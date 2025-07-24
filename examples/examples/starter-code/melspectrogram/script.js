

let essentiaExtractor;
let audioURL = "https://freesound.org/data/previews/328/328857_230356-lq.mp3";

let audioData;
let audioCtx = new AudioContext();
let plotSpectrogram;
let plotContainerId = "plotDiv";

let isComputed = false;
// settings for feature extractor
let frameSize = 1024;
let hopSize = 512;
let numBands = 96;

// callback function which compute the log mel spectrogram of input audioURL on a button.onclick event
async function onClickFeatureExtractor() {
  // load audio file from an url
  audioCtx.resume();
  audioData = await essentiaExtractor.getAudioChannelDataFromURL(audioURL, audioCtx);

  // if already computed, destroy plot traces
  if (isComputed) { plotSpectrogram.destroy(); };
  
  // modifying default extractor settings
  essentiaExtractor.frameSize = frameSize;
  essentiaExtractor.hopSize = hopSize;
  // settings specific to an algorithm
  essentiaExtractor.profile.MelBands.numberBands = numBands;

  // Now generate overlapping frames with given frameSize and hopSize
  // You could also do it using pure JS to avoid arrayToVector and vectorToArray conversion
  let audioFrames = essentiaExtractor.FrameGenerator(audioData, frameSize, hopSize);
  let logMelSpectrogram = [];
  for (var i=0; i<audioFrames.size(); i++) {
    logMelSpectrogram.push(essentiaExtractor.melSpectrumExtractor(essentiaExtractor.vectorToArray(audioFrames.get(i))));
  }

  // plot the feature
  plotSpectrogram.create(
    logMelSpectrogram, // input feature array
    "LogMelSpectrogram", // plot title
    audioData.length, // length of audio in samples
    audioCtx.sampleRate, // audio sample rate,
    hopSize // hopSize
  );
  // essentiaExtractor.algorithms.delete();
  isComputed = true;
}

$(document).ready(function() {
  
  // create EssentaPlot instance
  plotSpectrogram = new EssentiaPlot.PlotHeatmap(
    Plotly, // Plotly.js global 
    plotContainerId, // HTML container id
    "spectrogram", // type of plot
    EssentiaPlot.LayoutSpectrogramPlot // layout settings
  );

  plotSpectrogram.plotLayout.yaxis.range = [0, numBands];

  // Now let's load the essentia wasm back-end, if so create UI elements for computing features
  EssentiaWASM().then(async function(WasmModule) {
    // populate html audio player with audio
    let player = document.getElementById("audioPlayer");
    player.src = audioURL;
    player.load();

    essentiaExtractor = new EssentiaExtractor(WasmModule);

    // essentia version log to html div
    $("#logDiv").html("<h5> essentia-" + essentiaExtractor.version + " wasm backend loaded ... </h5><br>");

    $("#logDiv").append('<button id="btn" class="ui white inverted button">Compute Log-Mel-Spectrogram </button>');

    var button = document.getElementById("btn");

    // add onclick event handler to comoute button
    button.addEventListener("click", () => onClickFeatureExtractor(), false);
  });
});
