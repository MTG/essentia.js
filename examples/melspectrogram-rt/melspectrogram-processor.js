// avoid ES Module imports: not available on workers in Firefox nor Safari
let essentiaExtractor = new EssentiaExtractor(exports.EssentiaWASM);

function Float32Concat(first, second)
{
    var firstLength = first.length,
        result = new Float32Array(firstLength + second.length);

    result.set(first);
    result.set(second, firstLength);

    return result;
}

class MelspectrogramProcessor extends AudioWorkletProcessor {
    constructor(options) {
        super();
        this._bufferSize = options.processorOptions.bufferSize;
        this._hopSize = options.processorOptions.hopSize;
        this._melNumBands = options.processorOptions.melNumBands;
        this._sampleRate = options.processorOptions.sampleRate;
        this._channelCount = 1;
        this._extractor = essentiaExtractor;
        // modifying default extractor settings
        this._extractor.frameSize = this._bufferSize;
        this._extractor.hopSize = this._hopSize;
        // settings specific to an algorithm
        this._extractor.profile.MelBands.numberBands = this._melNumBands;
        this._extractor.profile.MelBands.type = 'power';

        // buffersize mismatch helpers
        this._inputRingBuffer = new ChromeLabsRingBuffer(this._bufferSize, this._channelCount);
        this._outputRingBuffer = new ChromeLabsRingBuffer(this._bufferSize, this._channelCount); // changed from 1024 to match block size

        this._accumData = [new Float32Array(this._bufferSize)];
        this._spectrum;

        // SAB config
        this.port.onmessage = e => {
          this._audio_writer = new AudioWriter(new RingBuffer(e.data.sab, Float32Array));
        };
    }

    process(inputList, outputList, params) {
        let input = inputList[0];
        let output = outputList[0];

        this._inputRingBuffer.push(input);

        if (this._inputRingBuffer.framesAvailable >= this._bufferSize) {

            this._inputRingBuffer.pull(this._accumData);

            this._spectrum = this._extractor.melSpectrumExtractor(this._accumData[0], this._sampleRate);
            if (this._audio_writer.available_write() >= this._melNumBands) {
              this._audio_writer.enqueue(this._spectrum);
            }

            let zeros = new Float32Array(128-this._spectrum.length);
            let zeroPaddedSpectrum = Float32Concat(this._spectrum, zeros);

            this._outputRingBuffer.push([zeroPaddedSpectrum]);
            
            // reset variables
            this._accumData = [new Float32Array(this._bufferSize)];
            this._spectrum = null;
        }

        this._outputRingBuffer.pull(output); // if ringbuffer does not have enough frames, output will be silent
        // console.log(output[0]);
        return true;
    }
}

registerProcessor("melspectrogram-processor", MelspectrogramProcessor);



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

