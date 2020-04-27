

let essentiaExtractor;
let audioURL = "https://freesound.org/data/previews/328/328857_230356-lq.mp3";

let audioData;
let audioCtx = new AudioContext();
let plotSpectrogram;
let plotContainerId = "plotDiv";

let isComputed = false;

// callback function which compute the log mel spectrogram of input audioURL on a button.onclick event
async function onClickFeatureExtractor() {
  // load audio file from an url
  audioData = await essentiaExtractor.getAudioChannelDataFromURL(audioURL, audioCtx);

  // if already computed, destroy plot traces
  if (isComputed) { plotSpectrogram.destroy(); };
  
  // modifying default extractor settings
  essentiaExtractor.frameSize = 1024;
  essentiaExtractor.hopSize = 512;
  // settings specific to an algorithm
  essentiaExtractor.profile.MelBands.numberBands = 96;
  
  let logMelSpectrogram = essentiaExtractor.melSpectrogram(audioData);

  // plot the feature
  plotSpectrogram.create(
    logMelSpectrogram, // input feature array
    "LogMelSpectrogram", // plot title
    audioData.length, // length of audio in samples
    audioCtx.sampleRate // audio sample rate
  );
  
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

  // Now let's load the essentia wasm back-end, if so create UI elements for computing features
  EssentiaModule().then(async function(WasmModule) {
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
