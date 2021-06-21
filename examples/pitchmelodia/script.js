
let essentia;
let audioURL = "https://freesound.org/data/previews/328/328857_230356-lq.mp3";

let audioData;
// fallback for cross-browser Web Audio API BaseAudioContext
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx = new AudioContext();

let plotContainerId = "plotDiv";
let plotMelodyContour;

let isComputed = false;

// callback function which compute the frame-wise HPCP chroma of input audioURL on a button.onclick event
async function onClickFeatureExtractor() {

  // load audio file from an url
  audioData = await essentia.getAudioChannelDataFromURL(audioURL, audioCtx, 0);
  
  if (isComputed) { plotChroma.destroy(); };

  const audioVector = essentia.arrayToVector(audioData);

  // Running PitchMelodia algorithm on an input audio signal vector
  // check https://essentia.upf.edu/reference/std_PitchMelodia.html
  let pitchMelodia = essentia.PitchMelodia(audioVector, // input
    // parameters (optional)
    10, // binResolution,
    3, // filterIterations
    2048, // frameSize
    false, // guessUnvoiced
    0.8, // harmonicWeight
    128, // hopSize
  ); 
   
  let pitches = essentia.vectorToArray(pitchMelodia.pitch);

  // plot the feature
  plotMelodyContour.create(
    pitches, // input feature array
    "PitchMelodia", // plot title
    audioData.length, // length of audio in samples
    audioCtx.sampleRate // audio sample rate
  );

  isComputed = true;
  essentia.algorithms.delete();
}

$(document).ready(function() {
  
  // create EssentaPlot instance
  plotMelodyContour = new EssentiaPlot.PlotMelodyContour(Plotly, plotContainerId);

  plotMelodyContour.plotLayout.yaxis.range = [40, 2000];

  // Now let's load the essentia wasm back-end, if so create UI elements for computing features
  EssentiaWASM().then(async function(WasmModule) {
    // populate html audio player with audio
    let player = document.getElementById("audioPlayer");
    player.src = audioURL;
    player.load();

    essentia = new Essentia(WasmModule);

    // essentia version log to html div
    $("#logDiv").html(
      "<h5> essentia-" + essentia.version + " wasm backend loaded ... </h5>"
    );

    $("#logDiv").append(
      '<button id="btn" class="ui white inverted button">Compute PitchMelodia </button>'
    );

    var button = document.getElementById("btn");

    // add onclick event handler to comoute button
    button.addEventListener("click", () => onClickFeatureExtractor(), false);
  });
});
