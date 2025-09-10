// import { EssentiaWASM, EssentiaModel } from "essentia.js";
import { EssentiaWASM } from "https://cdn.jsdelivr.net/npm/essentia.js@0.1.3/dist/essentia-wasm.es.js";
import * as EssentiaModel from "https://cdn.jsdelivr.net/npm/essentia.js@0.1.3/dist/essentia.js-model.es.js";
// retrieved from https://raw.githubusercontent.com/GoogleChromeLabs/web-audio-samples/main/audio-worklet/design-pattern/lib/wasm-audio-helper.js
// import { RingBuffer } from "./wasm-audio-helper.js";

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
        this._patchHop = new PatchHop(128, 0.5); // if patchSize at 16kHz and 256 hopSize corresponds to about 3s of audio, this would jump by 1s
        this._extractor = new EssentiaModel.EssentiaTFInputExtractor(EssentiaWASM, 'musicnn'); 
        this._features = {
            melSpectrum: getZeroMatrix(128, 96), // init melSpectrum 187x96 matrix with zeros
            frameSize: 128,
            melBandsSize: 96,
            patchSize: 128
        };
        
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
                this._workerPort.postMessage({request: "check", check: "Received 2-way port from worker" });
            }
        }
    }

    process(inputList) {
        let input = inputList[0];
        if (!input[0]) {
            console.info("worklet: empty input buffer");
            return true;
        }

        this._hopRingBuffer.push(input);

        if (this._hopRingBuffer.framesAvailable >= this._hopSize) {

            this._frameRingBuffer.push(this._hopData); // always push the previous hopData samples to create overlap of hopSize
            this._hopRingBuffer.pull(this._hopData);
            this._frameRingBuffer.push(this._hopData); // push new hopData samples

            if (this._frameRingBuffer.framesAvailable >= this._frameSize) {
                // console.count('frame');
                this._frameRingBuffer.pull(this._frameData);
                this._features.melSpectrum.push(this._extractor.compute(this._frameData[0]).melSpectrum);
                this._features.melSpectrum.shift();
                this._patchHop.incrementFrame();
                if (this._patchHop.readyToHop() && this._workerPort) {
                    // send features to Worker for inference
                    // console.info('Computed new patch of features\n', this._features);
                    this._workerPort.postMessage({
                        request: "features",
                        features: this._features
                    });
                }
            }
        }

        return true;
    }
}

registerProcessor("feature-extract-processor", FeatureExtractProcessor);