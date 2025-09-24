// import { EssentiaWASM, EssentiaModel } from "essentia.js";
import { EssentiaWASM } from "https://cdn.jsdelivr.net/npm/essentia.js@0.1.3/dist/essentia-wasm.es.js";
import Essentia from "https://cdn.jsdelivr.net/npm/essentia.js@0.1.3/dist/essentia.js-core.es.js";
// retrieved from https://raw.githubusercontent.com/GoogleChromeLabs/web-audio-samples/main/audio-worklet/design-pattern/lib/wasm-audio-helper.js
// import { RingBuffer } from "./wasm-audio-helper.js";

class FeatureResynthProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        this.essentia = new Essentia(EssentiaWASM);
        this._frameSize = 2048;
        this._hopSize = 512;
        this._actualHopSize = 256;
        this._channelCount = 1;

        this.freqDevOffset = 20;
        this.freqDevSlope = 0.01;
        this.magnitudeThreshold = 0;
        this.maxFrequency = 5000;
        this.maxPeaks = 100;
        this.maxnSines = 100;
        this.minFrequency = 0;
        this.orderBy = "frequency";

        this.resynthFrame = null;

        // buffersize mismatch helpers
        this._hopRingBuffer = new RingBuffer(this._actualHopSize, this._channelCount);
        this._frameRingBuffer = new RingBuffer(this._hopSize, this._channelCount);
        this._hopData = [new Float32Array(this._actualHopSize)];
        this._frameData = [new Float32Array(this._hopSize)];
        this.inputBuffer = [];

        // init zero-pad frameData so we have 512 values upon the very first 256 samples we get in
        this._hopData[0].fill(0);
        this.testArr = [];

        this.startTime = null;
        this.printedTestArr = false;
        this.iteration = -1;
        console.log('Feature resynth worklet - starting sampleRate, currentTime, currentFrame: ', sampleRate, currentTime, currentFrame);
    }

    process(inputList, outputList) {
        this.iteration++;
        let input = inputList[0];
        let output = outputList[0];

        if (!input[0]) {
            console.info("worklet: empty input buffer");
            return true;
        }

        if (this.iteration === 0) return true;


        this._hopRingBuffer.push(input);
        // console.log('worklet: hopRingBuffer framesAvailable', this._hopRingBuffer.framesAvailable);

        if (this._hopRingBuffer.framesAvailable >= this._actualHopSize) {
            // console.log('worklet: enough hop samples available, doing resynthesis');

            this._frameRingBuffer.push(this._hopData); // always push the previous hopData samples to create overlap of hopSize
            this._hopRingBuffer.pull(this._hopData);
            this._frameRingBuffer.push(this._hopData); // push new hopData samples
            // this.inputBuffer.push(...input[0]);

            if (this._frameRingBuffer.framesAvailable >= this._hopSize) {
            // if (this.inputBuffer.length >= this._hopSize*0.5) {
                // console.log('worklet: enough frame samples available, doing resynthesis');
                // console.count('frame');
                this._frameRingBuffer.pull(this._frameData);
                // this._frameData[0] = new Float32Array( this.inputBuffer.splice(0, this._hopSize*0.5) );
                const inputFrame = this.essentia.arrayToVector(this._frameData[0]);
                // console.log('worklet: input frame', inputFrame);

                const analOut = this.essentia.SprModelAnal(
                    inputFrame,
                    this._frameSize,
                    this.freqDevOffset,
                    this.freqDevSlope,
                    this._hopSize,
                    this.magnitudeThreshold,
                    this.maxFrequency,
                    this.maxPeaks,
                    this.maxnSines,
                    this.minFrequency,
                    this.orderBy,
                    sampleRate
                );

                // console.log('worklet: analysis output', analOut);

                const synthOut = this.essentia.SprModelSynth(
                    analOut.magnitudes,
                    analOut.frequencies,
                    analOut.phases,
                    analOut.res,
                    this._frameSize,
                    this._hopSize,
                    sampleRate
                );
                this.resynthFrame = Array.from(this.essentia.vectorToArray(synthOut.frame));
                // console.log('worklet: resynth frame', this.resynthFrame);
            }
        }

        if (!this.resynthFrame) { return true; }

        const nextOutQuantum = this.resynthFrame.splice(0, output[0].length);
        // console.log('worklet: nextOutQuantum', nextOutQuantum);
        // pass the resynthesis to the output
        for (let channel = 0; channel < output.length; channel++) {
            for (let i = 0; i < output[channel].length; i++) {
                let sample = nextOutQuantum[i];
                output[channel][i] = sample;
            }
        }
        return true;
    }
}

registerProcessor("feature-resynth-processor", FeatureResynthProcessor);