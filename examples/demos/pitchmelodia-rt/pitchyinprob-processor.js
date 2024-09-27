// avoid ES Module imports: not available on workers in Firefox nor Safari 
let essentia = new Essentia(Module);

function Float32Concat(first, second)
{
    var firstLength = first.length,
        result = new Float32Array(firstLength + second.length);

    result.set(first);
    result.set(second, firstLength);

    return result;
}

class PitchProcessor extends AudioWorkletProcessor {
    constructor(options) {
      super();
      this._bufferSize = options.processorOptions.bufferSize;
      this._sampleRate = options.processorOptions.sampleRate;
      this._channelCount = 1;
      this._essentia = essentia;
      // specific settings for algorithm
      this._rmsThreshold = 0.04;
      this._ioHopSize = 128;
      this._frameSize = this._bufferSize / 2;
      this._hopSize = this._frameSize / 4;
      this._lowestFreq = 440 * Math.pow(Math.pow(2, 1/12), -33); // lowest note = C2
      this._highestFreq = 440 * Math.pow(Math.pow(2, 1/12), -33+(6*12)-1); // 6 octaves above C2

      // buffersize mismatch helpers
      this._ioMismatchBuffer = new ChromeLabsRingBuffer(this._bufferSize, this._channelCount);
      this._analysisBuffer = new OverlappingRingBuffer(this._bufferSize, this._channelCount);

      this._ioMismatchData = [new Float32Array(this._ioHopSize)];
      this._analysisData = [new Float32Array(this._bufferSize)];

      this.rms = 0;
      this.meanPitch = 0;
      this.meanConfidence = 0;
    }

    process(inputList, outputList, params) {
      let input = inputList[0];
      let output = outputList[0];
      
      this._ioMismatchBuffer.push(input);

      if (this._ioMismatchBuffer.framesAvailable >= this._ioHopSize) {

        this._ioMismatchBuffer.pull(this._ioMismatchData);
        this._analysisBuffer.push(this._ioMismatchData);

        // return early if analysis buffer is still not filled 
        // --> delayed analysis results? CHECK TIMINGS <-- TO-DO
        if (!this._analysisBuffer.isFilled) return true;
        
        this._analysisBuffer.pull(this._analysisData);
        const analysisDataVector = this._essentia.arrayToVector(this._analysisData[0]);

        this.rms = this._essentia.RMS(analysisDataVector).rms;

        const windowedFrame = this._essentia.Windowing(analysisDataVector).frame;
        const spectrum = this._essentia.Spectrum(windowedFrame, windowedFrame.size()).spectrum;
        // console.log(this._essentia.vectorToArray(spectrum));
        const algoOutput = this._essentia.PitchYinFFT(spectrum, spectrum.size()-1, true, this._highestFreq, this._lowestFreq, sampleRate);

        this.meanPitch = algoOutput.pitch;
        this.meanConfidence = algoOutput.pitchConfidence;
        
        // reset variables
        this._ioMismatchData = [new Float32Array(this._ioHopSize)];
        this._analysisData = [new Float32Array(this._bufferSize)];
      }

      [this.meanPitch, this.meanConfidence, this.rms, currentTime].forEach( (val, i) => {
        output[0][i] = val;
      });

      return true;
    }
}

registerProcessor("pitchyinprob-processor", PitchProcessor);



// helper classes from https://github.com/GoogleChromeLabs/web-audio-samples/blob/gh-pages/audio-worklet/design-pattern/lib/wasm-audio-helper.js#L170:

/**
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

// Basic byte unit of WASM heap. (16 bit = 2 bytes)
const BYTES_PER_UNIT = Uint16Array.BYTES_PER_ELEMENT;

// Byte per audio sample. (32 bit float)
const BYTES_PER_SAMPLE = Float32Array.BYTES_PER_ELEMENT;

// The max audio channel on Chrome is 32.
const MAX_CHANNEL_COUNT = 32;

// WebAudio's render quantum size.
const RENDER_QUANTUM_FRAMES = 128;

/**
 * A JS FIFO implementation for the AudioWorklet. 3 assumptions for the
 * simpler operation:
 *  1. the push and the pull operation are done by 128 frames. (Web Audio
 *    API's render quantum size in the speficiation)
 *  2. the channel count of input/output cannot be changed dynamically.
 *    The AudioWorkletNode should be configured with the `.channelCount = k`
 *    (where k is the channel count you want) and
 *    `.channelCountMode = explicit`.
 *  3. This is for the single-thread operation. (obviously)
 *
 * @class
 */
class ChromeLabsRingBuffer {
  /**
   * @constructor
   * @param  {number} length Buffer length in frames.
   * @param  {number} channelCount Buffer channel count.
   */
  constructor(length, channelCount) {
    this._readIndex = 0;
    this._writeIndex = 0;
    this._framesAvailable = 0;

    this._channelCount = channelCount;
    this._length = length;
    this._channelData = [];
    for (let i = 0; i < this._channelCount; ++i) {
      this._channelData[i] = new Float32Array(length);
    }
  }

  /**
   * Getter for Available frames in buffer.
   *
   * @return {number} Available frames in buffer.
   */
  get framesAvailable() {
    return this._framesAvailable;
  }

  /**
   * Push a sequence of Float32Arrays to buffer.
   *
   * @param  {array} arraySequence A sequence of Float32Arrays.
   */
  push(arraySequence) {
    // The channel count of arraySequence and the length of each channel must
    // match with this buffer obejct.

    // Transfer data from the |arraySequence| storage to the internal buffer.
    let sourceLength = arraySequence[0].length;
    for (let i = 0; i < sourceLength; ++i) {
      let writeIndex = (this._writeIndex + i) % this._length;
      for (let channel = 0; channel < this._channelCount; ++channel) {
        this._channelData[channel][writeIndex] = arraySequence[channel][i];
      }
    }

    this._writeIndex += sourceLength;
    if (this._writeIndex >= this._length) {
      this._writeIndex = 0;
    }

    // For excessive frames, the buffer will be overwritten.
    this._framesAvailable += sourceLength;
    if (this._framesAvailable > this._length) {
      this._framesAvailable = this._length;
    }
  }

  /**
   * Pull data out of buffer and fill a given sequence of Float32Arrays.
   *
   * @param  {array} arraySequence An array of Float32Arrays.
   */
  pull(arraySequence) {
    // The channel count of arraySequence and the length of each channel must
    // match with this buffer obejct.

    // If the FIFO is completely empty, do nothing.
    if (this._framesAvailable === 0) {
      return;
    }

    let destinationLength = arraySequence[0].length;

    // Transfer data from the internal buffer to the |arraySequence| storage.
    for (let i = 0; i < destinationLength; ++i) {
      let readIndex = (this._readIndex + i) % this._length;
      for (let channel = 0; channel < this._channelCount; ++channel) {
        arraySequence[channel][i] = this._channelData[channel][readIndex];
      }
    }

    this._readIndex += destinationLength;
    if (this._readIndex >= this._length) {
      this._readIndex = 0;
    }

    this._framesAvailable -= destinationLength;
    if (this._framesAvailable < 0) {
      this._framesAvailable = 0;
    }
  }
} // class ChromeLabsRingBuffer


/**
 * A JS FIFO implementation for the AudioWorklet. 3 assumptions for the
 * simpler operation:
 *  1. the push operation is done by [128, bufferLength] frames. (Web Audio
 *    API's render quantum size in the speficiation)
 *  2. the channel count of input/output cannot be changed dynamically.
 *    The AudioWorkletNode should be configured with the `.channelCount = k`
 *    (where k is the channel count you want) and
 *    `.channelCountMode = explicit`.
 *  3. This is for the single-thread operation. (obviously)
 *  4. Pull operation is done by buffer length always.
 * 
 * This version will always read the whole contents, 
 * even if only a small part of samples are new,
 * hence the "overlapping" characteristic.
 * 
 * @class
 */
class OverlappingRingBuffer {
  /**
   * @constructor
   * @param  {number} length Buffer length in frames.
   * @param  {number} channelCount Buffer channel count.
   */
  constructor(length, channelCount) {
    this._readIndex = 0;
    this._writeIndex = 0;
    this._framesAvailable = 0;

    this._channelCount = channelCount;
    this._length = length;
    this._channelData = [];
    for (let i = 0; i < this._channelCount; ++i) {
      this._channelData[i] = new Float32Array(length);
    }
  }

  /**
   * Getter for Available frames in buffer.
   *
   * @return {boolean} Buffer is filled with non-null values.
   */
  get isFilled() {
    return this._framesAvailable === this._length;
  }

  /**
   * Push a sequence of Float32Arrays to buffer.
   *
   * @param  {array} arraySequence A sequence of Float32Arrays.
   */
  push(arraySequence) {
    // The channel count of arraySequence and the length of each channel must
    // match with this buffer obejct.

    // Transfer data from the |arraySequence| storage to the internal buffer.
    let sourceLength = arraySequence[0].length;
    for (let i = 0; i < sourceLength; ++i) {
      let writeIndex = (this._writeIndex + i) % this._length;
      for (let channel = 0; channel < this._channelCount; ++channel) {
        this._channelData[channel][writeIndex] = arraySequence[channel][i];
      }
    }

    this._writeIndex += sourceLength;
    this._writeIndex %= this._length;
    // this ensures we always read from oldest to newest sample (where readIndex left off)
    this._readIndex = this._writeIndex;

    // For excessive frames, the buffer will be overwritten.
    this._framesAvailable += sourceLength;
    if (this._framesAvailable > this._length) {
      this._framesAvailable = this._length;
    }
  }

  /**
   * Pull data out of buffer and fill a given sequence of Float32Arrays.
   *
   * @param  {array} arraySequence An array of Float32Arrays.
   */
  pull(arraySequence) {
    // The channel count of arraySequence and the length of each channel must
    // match with this buffer obejct.

    // If the FIFO is completely empty, do nothing.
    if (this._framesAvailable === 0) {
      return;
    }

    let destinationLength = arraySequence[0].length;

    if (destinationLength !== this._length) {
      throw new RangeError("Destination array length and this overlapping buffer's length must be the same");
    }

    // Transfer data from the internal buffer to the |arraySequence| storage.
    for (let i = 0; i < destinationLength; ++i) {
      let readIndex = (this._readIndex + i) % this._length;
      for (let channel = 0; channel < this._channelCount; ++channel) {
        arraySequence[channel][i] = this._channelData[channel][readIndex];
      }
    }
  }
} // class OverlappingRingBuffer