let audioCtx;
let essentiaHeatPlot;
let tagramPlot;
let audioLength;
const audioSampleRate = 16000;
const plotContainerId = "plotDiv";
const audioURL = "https://cdn.freesound.org/previews/328/328857_230356-lq.mp3";

const musiCNNLabels = ["rock", "pop", "alternative", "indie", "electronic", 
  "female vocalists", "dance", "00s", "alternative rock", "jazz", "beautiful", 
  "metal", "chillout", "male vocalists", "classic rock", "soul", "indie rock", 
  "Mellow", "electronica", "80s", "folk", "90s", "chill", "instrumental", "punk", 
  "oldies", "blues", "hard rock", "ambient", "acoustic", "experimental", "female vocalist", 
  "guitar", "Hip-Hop", "70s", "party", "country", "easy listening", "sexy", 
  "catchy", "funk", "electro", "heavy metal", "Progressive rock", "60s", "rnb", 
  "indie pop", "sad", "House", "happy"
];

// init Web Audio API AudioContext
function initAudioContext() {
  try {  
      unlockAudioContext();
  } catch (e) {
      throw 'Could not instantiate AudioContext: ' + e.message;
  }
}

// cross-browser fallback to initiate WebAudio API with user gesture if required
function unlockAudioContext() {
  if (typeof(audioCtx) === "undefined") {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
  }
  if (audioCtx.state !== ("suspended")) return;
  const b = document.body;
  const events = ["touchstart", "touchend", "mousedown", "keydown"];
  events.forEach(e => b.addEventListener(e, unlock, false));
  function unlock() {audioCtx.resume().then(clean);}
  function clean() {
      events.forEach(e => b.removeEventListener(e, unlock));
  }
}


initAudioContext();

// populate html audio player with audio
let player = document.getElementById("audioPlayer");
player.src = audioURL;
player.load();

var button = document.getElementById("btn");

essentiaHeatPlot = new EssentiaPlot.PlotHeatmap(
  Plotly, // Plotly.js global 
  plotContainerId, // HTML container id
  "spectrogram", // type of plot
  EssentiaPlot.LayoutSpectrogramPlot // layout settings
);

tagramPlot = new EssentiaPlot.PlotHeatmap(
  Plotly, // Plotly.js global 
  "plotDivTags", // HTML container id
  "chroma", // type of plot
  EssentiaPlot.LayoutChromaPlot // layout settings
);

tagramPlot.yAxis = musiCNNLabels;
tagramPlot.plotLayout.height = 650;
tagramPlot.plotLayout.yaxis.title = "";
tagramPlot.plotLayout.yaxis.range = [0, 49];

// add onclick event handler to comoute button
button.addEventListener("click", () => onClickAction(), false);

const extractorWorker = new Worker("extractor-worker.js");
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
    256 // hopSize
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
