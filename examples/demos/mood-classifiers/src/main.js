import { AnalysisResults, toggleUploadDisplayHTML, PlaybackControls } from './viz.js';
import { preprocess, shortenAudio } from './audioUtils.js';
import inferenceWorkerURL from './inference.js?url';

const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();
const KEEP_PERCENTAGE = 0.15; // keep only 15% of audio file

let essentia = null;
let essentiaAnalysis;
const modelNames = ['mood_happy' , 'mood_sad', 'mood_relaxed', 'mood_aggressive', 'danceability'];
let inferenceWorker;

const resultsViz = new AnalysisResults(modelNames);
let wavesurfer;
let controls;

const dropInput = document.createElement('input');
dropInput.setAttribute('type', 'file');
dropInput.addEventListener('change', () => {
    handleFileUpload(dropInput.files);
})

const dropArea = document.querySelector('#file-drop-area');
dropArea.addEventListener('dragover', (e) => { e.preventDefault() });
dropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    handleFileUpload(files);
})
dropArea.addEventListener('click', () => {
    dropInput.click();
})



function handleFileUpload(files) {
    if (files.length > 1) {
        alert("Only single-file uploads are supported currently");
        throw Error("Multiple file upload attempted, cannot process.");
    } else if (files.length) {
        files[0].arrayBuffer().then((ab) => {
            toggleLoader();
            wavesurfer = toggleUploadDisplayHTML('display');
            wavesurfer.loadBlob(files[0]);
            controls = new PlaybackControls(wavesurfer);
            controls.toggleEnabled(false);
            processFile(ab);
        })
    }
}

function processFile(arrayBuffer) {
    audioCtx.resume().then(() => {
        audioCtx.decodeAudioData(arrayBuffer).then(async function handleDecodedAudio(audioBuffer) {
            console.info("Done decoding audio!");
                        
            const prepocessedAudio = preprocess(audioBuffer);
            await audioCtx.suspend();

            if (essentia) {
                essentiaAnalysis = computeKeyBPM(prepocessedAudio);
            }

            // reduce amount of audio to analyse
            let audioData = shortenAudio(prepocessedAudio, KEEP_PERCENTAGE, true); // <-- TRIMMED start/end

            // send for feature extraction
            inferenceWorker.postMessage({
                arrayBuffer: audioData.buffer,
                type: "audio"
            }, [audioData.buffer]);
            audioData = null;
        })
    })
}

function computeKeyBPM (audioSignal) {
    let vectorSignal = essentia.arrayToVector(audioSignal);
    const keyData = essentia.KeyExtractor(vectorSignal, true, 4096, 4096, 12, 3500, 60, 25, 0.2, 'bgate', 16000, 0.0001, 440, 'cosine', 'hann');
    const bpm = essentia.PercivalBpmEstimator(vectorSignal, 1024, 2048, 128, 128, 210, 50, 16000).bpm;
    
    // const bpm = essentia.RhythmExtractor(vectorSignal, 1024, 1024, 256, 0.1, 208, 40, 1024, 16000, [], 0.24, true, true).bpm;
    // const bpm = essentia.RhythmExtractor2013(vectorSignal, 208, 'multifeature', 40).bpm;

    return {
        keyData: keyData,
        bpm: bpm
    };
}

function createInferenceWorker() {
    inferenceWorker = new Worker(inferenceWorkerURL, {type: "module"});
    inferenceWorker.onmessage = function listenToWorker(msg) {
        // listen out for model output
        if (msg.data.predictions) {
            const preds = msg.data.predictions;
            console.log(`received predictions: `, preds);
            displayPredictions(preds);
        }
    };
}

function displayPredictions(predictions) {
    const allPredictions = {...predictions};
    resultsViz.updateMeters(allPredictions);
    resultsViz.updateValueBoxes(essentiaAnalysis);
    toggleLoader();
    controls.toggleEnabled(true)
}

function toggleLoader() {
    const loader = document.querySelector('#loader');
    loader.classList.toggle('disabled');
    loader.classList.toggle('active')
}


window.onload = () => {
    createInferenceWorker();
    EssentiaWASM().then((wasmModule) => {
        essentia = new wasmModule.EssentiaJS(false);
        essentia.arrayToVector = wasmModule.arrayToVector;
    })
};
