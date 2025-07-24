import EventBus from '../event-bus.js';
import InferenceWorker from './inference.js?worker';
import workletURL from './feature-extractor.js?url';
import { URLFromFiles } from '../utils.js';
// import essentiaURL from '../../node_modules/essentia.js/index?url';
import audiohelperURL from './wasm-audio-helper.js?url';
import eventBus from '../event-bus.js';

const audioCtxOptions = {
    sampleRate: 16000
};

let AudioContext = window.AudioContext || window.webkitAudioContext;;
let audioCtx;
let audioStream;
let mic;
let gain;
let featureExtractorNode;
let audioGraphConnected = false;

let inferenceWorker;
let workerToWorkletPort;

let dataIsAvailable = false;

async function createAudioProcessor(audioContext) {
    let node;
    try {
        node = new AudioWorkletNode(audioContext, "feature-extract-processor");
    } catch(e) {
        try {
            const concatenadedCode = await URLFromFiles([audiohelperURL, workletURL]);
            await audioContext.audioWorklet.addModule(concatenadedCode);
            console.log('audio worklet registered');
            node = new AudioWorkletNode(audioContext, "feature-extract-processor");
        } catch (e) {
            console.log('There was an error creating the feature extractor AudioWorklet:\n', e);
            return null;
        }
    }
  
    return node;
}

function createInferenceWorker() {
    inferenceWorker = new InferenceWorker();
    console.log({inferenceWorker});
    inferenceWorker.onmessage = function listenToWorker(msg) {
        switch (msg.data.type) {
            case 'port':
                // listen out for port transfer
                workerToWorkletPort = msg.data.port;
                console.log("Received port from worker\n", workerToWorkletPort);
                break;
            case 'predictions':
                // listen out for model output
                EventBus.$emit('model-predictions', msg.data.predictions);
                break;
            case 'shutdown':
                // worker has finished its operations and is ready to be terminated
                inferenceWorker.terminate();
                inferenceWorker = undefined;
                break;
            default:
                console.log(msg.data);
                break;
        }
    };
    inferenceWorker.onerror = function processWorkerError (ev) {
        console.log('There was an error with the worker', ev);
        console.error(ev.type);
    }
}

async function startAudioProcessing(stream) {
    console.log('manager: got audio stream')
    audioStream = stream;

    let audioTracks = audioStream.getAudioTracks();
    audioTracks.forEach((t) => {
        console.log('MediaStream constraints are: ', t.getSettings());
    })

    audioStream.addEventListener('active', handleActiveStream)
}

async function handleActiveStream () {
    dataIsAvailable = true;
    if (audioCtx.state === 'closed') {
        audioCtx = new AudioContext(audioCtxOptions);
    }
    
    if (!audioGraphConnected) {
        await connectAudioGraph();
        console.log('audio graph created and connected');
    } else {
        mic = audioCtx.createMediaStreamSource(audioStream);
        mic.connect(featureExtractorNode);
    }

    audioCtx.resume();
    console.log('audio ctx resumed');
    eventBus.$emit('stream-active');
}

async function connectAudioGraph () {
    mic = audioCtx.createMediaStreamSource(audioStream);          
    gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0, audioCtx.currentTime);
    featureExtractorNode = await createAudioProcessor(audioCtx);

    featureExtractorNode.port.postMessage({
        port: workerToWorkletPort
    }, [workerToWorkletPort]);

    try {
        mic.connect(featureExtractorNode);
        featureExtractorNode.connect(gain);
        gain.connect(audioCtx.destination);
        audioGraphConnected = true;
    } catch(e) {
        console.log(`There was a problem connecting the audio graph \n ${e}`);
    }
}

async function stopAudioProcessing() {
    // stop media stream
    audioStream.getAudioTracks().forEach(function(track) {
        track.stop();
        audioStream.removeTrack(track);
    });
    audioStream.removeEventListener('active', handleActiveStream);
    audioStream = null;
    console.log('audio stream cleared');

    await audioCtx.suspend();
    console.log('audio suspended');
    // disconnect mic, which we can't reuse
    mic.disconnect();
    mic = undefined; 
    console.log('mic disconnected');
    dataIsAvailable = false;
}



async function main() {
    try {
        audioCtx = new AudioContext(audioCtxOptions);
    } catch (e) {
        throw 'Could not instantiate AudioContext: ' + e.message;
    }

    createInferenceWorker();

    EventBus.$on('received-stream', async (stream) => {
        if (audioStream && audioCtx.state !== 'suspended') {
            await stopAudioProcessing();
        }
        if (!workerToWorkletPort && !inferenceWorker) {
            createInferenceWorker();
        }

        startAudioProcessing(stream);
    })

    EventBus.$on('stop-audio', () => stopAudioProcessing() );
    EventBus.$on('pause', () => audioCtx.suspend() );
    EventBus.$on('play', () => dataIsAvailable ? audioCtx.resume() : null );
    EventBus.$on('loaded-data', () => dataIsAvailable = true );
}

export default main;
