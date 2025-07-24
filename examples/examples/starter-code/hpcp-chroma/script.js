
let essentiaExtractor;
let audioURL = "https://freesound.org/data/previews/328/328857_230356-lq.mp3";

let audioData;
// fallback for cross-browser Web Audio API BaseAudioContext
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx = new AudioContext();
let plotChroma;
let plotContainerId = "plotDiv";

let isComputed = false;
let frameSize = 4096;
let hopSize = 2048;

// callback function which compute the frame-wise HPCP chroma of input audioURL on a button.onclick event
async function onClickFeatureExtractor() {
  // load audio file from an url
  audioData = await essentiaExtractor.getAudioChannelDataFromURL(audioURL, audioCtx, 0);
  
  if (isComputed) { plotChroma.destroy(); };
  
  // modifying default extractor settings
  essentiaExtractor.frameSize = frameSize;
  essentiaExtractor.hopSize = hopSize;
  essentiaExtractor.sampleRate = audioCtx.sampleRate;
  // settings specific to an algorithm
  essentiaExtractor.profile.HPCP.nonLinear = true;

  // Now generate overlapping frames with given frameSize and hopSize
  // You could also do it using pure JS to avoid arrayToVector and vectorToArray conversion
  let audioFrames = essentiaExtractor.FrameGenerator(audioData, frameSize, hopSize);
  let hpcpgram = [];
  for (var i=0; i<audioFrames.size(); i++) {
    hpcpgram.push(essentiaExtractor.hpcpExtractor(essentiaExtractor.vectorToArray(audioFrames.get(i))));
  }
  
  // plot the feature
  plotChroma.create(
    hpcpgram, // input feature array
    "HPCP Chroma", // plot title
    audioData.length, // length of audio in samples
    audioCtx.sampleRate, // audio sample rate,
    hopSize // hopSize
  );
  essentiaExtractor.delete();
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
  EssentiaWASM().then(async function(WasmModule) {
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
