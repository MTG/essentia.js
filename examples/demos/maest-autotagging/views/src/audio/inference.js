// debugger;
import * as tf from '@tensorflow/tfjs';
import { EssentiaModel } from 'essentia.js';
import activationSmoother from './ActivationSmoother.js';
import modelURL from './model-tfjs/model.json?url';
console.info('Worker: imports went ok')
// console.log({activationSmoother});

let model = new EssentiaModel.TensorflowMusiCNN(tf, modelURL);
let modelReady = false;

async function loadModel() {
    await model.initialize();
    modelReady = true;
    console.log('Model loaded!');
    await modelWarmUp();
    console.log('Model warmed up!')
}

async function modelWarmUp() {
    // perform inference on all-zero input to load model weights and ops onto GPU
    if (!modelReady) {
        console.error('worker: model not initialised');
        return;
    }
    let zeroFeatures = {
        melSpectrum: Array(128).fill( Array(96).fill(0) ),
        melBandsSize: 96,
        patchSize: 128,
        frameSize: 128
    };
    await model.predict(zeroFeatures);
}

function outputPredictions(p) {
    self.postMessage({
        type: 'predictions',
        predictions: p
    });
}

async function modelPredict(features) {
    if (modelReady) {
        let predictions = await model.predict(features);
        predictions = predictions[0]; // model.predict returns a [Array(50)]
        // median smoothing
        const smoothedPredictions = activationSmoother.push(predictions);
        // output to main thread
        // console.log({smoothedPredictions});
        outputPredictions(smoothedPredictions);
    }
}

const channel = new MessageChannel();
const port1 = channel.port1;

self.postMessage({
    type: 'port',
    port: channel.port2
}, [channel.port2]);

port1.onmessage = async function listenToAudioWorklet(msg) {
    switch (msg.data.request) {
        case 'check':
            console.log(`Received ${msg.data.check} from AudioWorkletProcessor`);
            break;
        case 'features':
            await modelPredict(msg.data.features);
            break;
        default:
            break;
    }
}

self.onmessage = function listenToMainThread (msg) {
    switch (msg.data.request) {
        case 'shutdown':
            model.dispose();
            self.postMessage({type: 'shutdown'})
            break;
        case 'setSmoothing':
            activationSmoother.memorySize = Number(msg.data.value);
        default:
            break;
    }
}

loadModel();
