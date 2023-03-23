// avoid ES Module imports: not available on workers in Firefox nor Safari
let essentiaExtractor = new EssentiaExtractor(exports.EssentiaWASM);

class MelspectrogramProcessor extends AudioWorkletProcessor {
    constructor(options) {
        super();
        this.bufferSize = options.processorOptions.bufferSize;
        this.hopSize = options.processorOptions.hopSize;
        this.melNumBands = options.processorOptions.melNumBands;
        this.sampleRate = options.processorOptions.sampleRate;
        this.channelCount = 1;
        this.extractor = essentiaExtractor;
        // modifying default extractor settings
        this.extractor.frameSize = this.bufferSize;
        this.extractor.hopSize = this.hopSize;
        // settings specific to an algorithm
        this.extractor.profile.MelBands.numberBands = this.melNumBands;
        this.extractor.profile.MelBands.type = 'power';

        // buffersize mismatch helpers
        this.inputRingBuffer = new ChromeLabsRingBuffer(this.bufferSize, this.channelCount);

        this.accumData = [new Float32Array(this.bufferSize)];

        // Shared memory config
        this.port.onmessage = msg => {
          this.descriptor_pool = new EssentiaPool(msg.data.memoryInfo);
        };
    }

    process(inputList, outputList) {
        let input = inputList[0];
        let output = outputList[0];

        this.inputRingBuffer.push(input);

        if (this.inputRingBuffer.framesAvailable >= this.bufferSize) {

            this.inputRingBuffer.pull(this.accumData);

            const spectrum = this.extractor.melSpectrumExtractor(this.accumData[0], this.sampleRate);
            const spectrumVector = this.extractor.arrayToVector(spectrum);
            const centroid = Math.round(this.extractor.Centroid(spectrumVector, this.melNumBands).centroid);

            const centroidContainer = Float32Array.from([centroid]);
            
            this.descriptor_pool.set('melbands', spectrum);
            this.descriptor_pool.set('melbands.centroid', centroidContainer);
            
            // reset variables
            this.accumData = [new Float32Array(this.bufferSize)];
        }

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
    const sourceLength = arraySequence[0].length;
    for (let i = 0; i < sourceLength; ++i) {
      const writeIndex = (this._writeIndex + i) % this._length;
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

    const destinationLength = arraySequence[0].length;

    // Transfer data from the internal buffer to the |arraySequence| storage.
    for (let i = 0; i < destinationLength; ++i) {
      const readIndex = (this._readIndex + i) % this._length;
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
} // class RingBuffer