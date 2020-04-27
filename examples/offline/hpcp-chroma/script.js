
let essentiaExtractor;
let audioURL = "https://freesound.org/data/previews/328/328857_230356-lq.mp3";

let audioData;
// fallback for cross-browser Web Audio API BaseAudioContext
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx = new AudioContext();
let plotChroma;
let plotContainerId = "plotDiv";

let isComputed = false;

// callback function which compute the frame-wise HPCP chroma of input audioURL on a button.onclick event
async function onClickFeatureExtractor() {
  // load audio file from an url
  audioData = await essentiaExtractor.getAudioChannelDataFromURL(audioURL, audioCtx, 0);
  
  if (isComputed) { plotChroma.destroy(); };
  
  // modifying default extractor settings
  essentiaExtractor.frameSize = 4096;
  essentiaExtractor.hopSize = 2048;
  essentiaExtractor.sampleRate = audioCtx.sampleRate;
  // settings specific to an algorithm
  essentiaExtractor.profile.HPCP.nonLinear = true;
  
  let chromaHPCP = essentiaExtractor.hpcpgram(audioData);
  // plot the feature
  plotChroma.create(
    chromaHPCP, // input feature array
    "HPCP Chroma", // plot title
    audioData.length, // length of audio in samples
    audioCtx.sampleRate // audio sample rate
  );
  isComputed = true;
}

$(document).ready(function() {
  
  // create EssentaPlot instance
  plotChroma = new EssentiaPlot.PlotHeatmap(
    Plotly, // Plotly.js global 
    plotContainerId, // HTML container id
    "chroma", // type of plot
    EssentiaPlot.LayoutChromaPlot // layout settings
  );

  // Now let's load the essentia wasm back-end, if so create UI elements for computing features
  EssentiaModule().then(async function(WasmModule) {
    // populate html audio player with audio
    let player = document.getElementById("audioPlayer");
    player.src = audioURL;
    player.load();

    essentiaExtractor = new EssentiaExtractor(WasmModule);

    // essentia version log to html div
    $("#logDiv").html(
      "<h5> essentia-" + essentiaExtractor.version + " wasm backend loaded ... </h5>"
    );

    $("#logDiv").append(
      '<button id="btn" class="ui white inverted button">Compute HPCP Chroma </button>'
    );

    var button = document.getElementById("btn");

    // add onclick event handler to comoute button
    button.addEventListener("click", () => onClickFeatureExtractor(), false);
  });
});
