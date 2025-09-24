// debugger;
// import * as ort from 'onnxruntime-web';
import activationSmoother from './ActivationSmoother.js';
import modelURL from './discogs-maest-5s-pw-2.onnx?url';
import * as ort from 'onnxruntime-web';
import MAEST from "./MAEST.js";
// import { getExternalData } from "./externalData.js";
console.info('Worker: imports went ok')
// console.log({activationSmoother});

const patchSize = 316;
let model = null;
let modelReady = false;

async function loadModel() {
    // let externalData = await getExternalData();
    // console.log({externalData});
    model = new MAEST(ort, modelURL, null, patchSize);
    await model.initialize();
    modelReady = true;
    console.log('Model loaded!');
    // await modelWarmUp();
    // console.log('Model warmed up!')
}

async function modelWarmUp() {
    // perform inference on all-zero input to load model weights and ops onto GPU
    if (!modelReady) {
        console.error('worker: model not initialised');
        return;
    }
    let zeroMelSpectra = Array(patchSize).fill( Array(96).fill(0) );
    await model.predict(zeroMelSpectra);
}

function outputPredictions(p) {
    self.postMessage({
        type: 'predictions',
        predictions: p
    });
}

async function modelPredict(features) {
    // console.log('worker: received features, running model inference...', features);
    if (modelReady) {
        let predictions = await model.predict(features);
        // median smoothing
        // const smoothedPredictions = activationSmoother.push(predictions.cpuData);
        // output to main thread
        outputPredictions(Array.from(predictions.cpuData));
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
            await modelPredict(msg.data.melspectra);
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
