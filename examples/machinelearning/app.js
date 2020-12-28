
const extractorWorker = new Worker("extractor-worker.js", {type:'module'});
const inferenceWorker = new Worker("inference-worker.js");

extractorWorker.onmessage = e => {
  console.log("From extractor", e.data);
  plotSpectrum(e.data);
  sendForInferenceMusiCNN(e.data);
}

inferenceWorker.onmessage = e => {   
  console.log("Predictions from tfjs", e.data); 
  // plot tagGram
  tagramPlot.create(
    e.data, // input feature array
    "TagGram", // plot title
    audioLength, // length of audio in samples
    audioSampleRate, // audio sample rate,
    audioLength // hopSize
  );
}

function sendForFeatureExtraction(audioData) {
  extractorWorker.postMessage(audioData);
}

function sendForInferenceMusiCNN(inputFeature) {
  inferenceWorker.postMessage(inputFeature);
}

function plotSpectrum(feature) {
  audioLength = feature.audioLength
  essentiaHeatPlot.create(
    feature.melSpectrum, // input feature array
    "MelSpectrogramInput-MusiCNN", // plot title
    feature.audioLength, // length of audio in samples
    audioSampleRate, // audio sample rate,
    256 // hopSize
  );
}


async function onClickAction() {
  getAudioBufferFromURL(audioURL, audioCtx)
  .then((audioBuffer) => downsampleAudioBuffer(audioBuffer, audioSampleRate))
  .then((audioSignal) => sendForFeatureExtraction(audioSignal));
}
