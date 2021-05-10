import { EssentiaWASM } from "./lib/essentia-wasm.module.js";
import { EssentiaTFInputExtractor}  from "./lib/essentia.js-model.es.js";
import { RingBuffer } from "./lib/wasm-audio-helper.js";

// const EssentiaWASM = Module;

class PatchHop {
    constructor(patchSize, ratio) {
        this.size = Math.floor(patchSize * ratio);
        this.frameCount = 0;
    }

    incrementFrame() {
        this.frameCount++;
        this.frameCount %= this.size;
    }

    readyToHop() {
        if (this.frameCount === 0) {
            return true;
        } else {
            return false;
        }
    }
}

class Gate {
    constructor(threshold, memory) {
        this.memory = new Array(memory).fill(0);
        this.threshold = threshold;
    }

    updateLevel(rms) {
        this.memory.push(rms);
        this.memory.shift();
    }

    isTriggered() {
        return this.memory.every((value) => value > this.threshold);
    }
}

function getZeroMatrix(x, y) {
    let matrix = new Array(x);
    for (let f = 0; f < x; f++) {
        matrix[f] = new Array(y);
        matrix[f].fill(0);
    }
    return matrix;
}

class FeatureExtractProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        this._frameSize = 512;
        this._hopSize = 256;
        this._channelCount = 1;
        this._patchHop = new PatchHop(187, 1/3); // if patchSize at 16kHz and 256 hopSize corresponds to about 3s of audio, this would jump by 1s
        this._extractor = new EssentiaTFInputExtractor(EssentiaWASM, 'musicnn');
        this.essentia = new EssentiaWASM.EssentiaJS(false);
        this._features = {
            melSpectrum: getZeroMatrix(187, 96), // init melSpectrum 187x96 matrix with zeros
            batchSize: 187,
            melBandsSize: 96,
            patchSize: 187
        };

        this._zeroMelBands = new Array(this._features.melBandsSize).fill(0);
        this._gate = new Gate(0.05, 6);
        
        // buffersize mismatch helpers
        this._hopRingBuffer = new RingBuffer(this._hopSize, this._channelCount);
        this._frameRingBuffer = new RingBuffer(this._frameSize, this._channelCount);
        this._hopData = [new Float32Array(this._hopSize)];
        this._frameData = [new Float32Array(this._frameSize)];

        // init zero-pad frameData so we have 512 values upon the very first 256 samples we get in
        this._hopData[0].fill(0);

        // setup worker comms
        this._workerPort = undefined;
        this._workerPortAvailable = false;
        this.port.onmessage = (msg) => {
            if (msg.data.port) {
                console.info('Worklet received port from main!\n', msg.data.port);
                this._workerPort = msg.data.port;
                this._workerPortAvailable = true;
                this._workerPort.postMessage({ check: "Hey Worker, everything alright?" });
            }
        }
    }

    process(inputList) {
        let input = inputList[0];

        this._hopRingBuffer.push(input);

        if (this._hopRingBuffer.framesAvailable >= this._hopSize) {

            this._frameRingBuffer.push(this._hopData); // always push the previous hopData samples to create overlap of hopSize
            this._hopRingBuffer.pull(this._hopData);
            this._frameRingBuffer.push(this._hopData); // push new hopData samples

            if (this._frameRingBuffer.framesAvailable >= this._frameSize) {
                this._frameRingBuffer.pull(this._frameData);
                this._features.melSpectrum.push(this._extractor.compute(this._frameData[0]).melSpectrum);
                this._features.melSpectrum.shift();
                const rms = this.essentia.RMS(EssentiaWASM.arrayToVector(this._frameData[0])).rms;
                this._gate.updateLevel(rms);
                if (rms > 0.05) { 
                    console.info(rms); 
                //     this._features.melSpectrum.push(this._extractor.compute(this._frameData[0]).melSpectrum);
                //     this._features.melSpectrum.shift();
                }
                // } else {
                //     this._features.melSpectrum.push(this._zeroMelBands);
                //     this._features.melSpectrum.shift();
                // }

                this._patchHop.incrementFrame();

                if (this._patchHop.readyToHop() && this._workerPort) {
                    // send features to Worker for inference
                    // console.info('Computed new patch of features\n', this._features);
                    const audioIsActive = this._gate.isTriggered();
                    this._workerPort.postMessage({
                        message: "Hi there, I've got features",
                        features: this._features,
                        audioIsActive: audioIsActive
                    });
                }
            }

            
            // reset variables
            // this._frameData = [new Float32Array(this._frameSize)];
        }

        return true;
    }
}

registerProcessor("feature-extract-processor", FeatureExtractProcessor);