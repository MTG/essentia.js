
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

  let pitchGram = [];
  // load audio file from an url
  audioData = await essentia.getAudioChannelDataFromURL(audioURL, audioCtx, 0);
  
  if (isComputed) { plotChroma.destroy(); };

  let frames = essentia.FrameGenerator(audioData, 4096, 512);

  // compute for overlapping frames
  for (var i=0; i<frames.size(); i++) {

    // Running PitchYinProbabilistic algorithm on an input audio signal vector
    // check https://essentia.upf.edu/reference/std_PitchYinProbabilistic.html
    let pitchPyYin = essentia.PitchYinProbabilistic(frames.get(i), // input
      // parameters (optional)
      4096, // frameSize
      256, // hopSize
      0.1, // lowRMSThreshold
      'zero', // outputUnvoiced,
      false, // preciseTime
      audioCtx.sampleRate //sampleRate
    ); 
   
    let pitches = essentia.vectorToArray(pitchPyYin.pitch);

    pitchGram.push(pitches[0]);

  }
  // plot the feature
  plotMelodyContour.create(
    pitchGram, // input feature array
    "PitchYinProbabilistic", // plot title
    audioData.length, // length of audio in samples
    audioCtx.sampleRate // audio sample rate
  );
  isComputed = true;
}

$(document).ready(function() {
  
  // create EssentaPlot instance
  plotMelodyContour = new EssentiaPlot.PlotMelodyContour(Plotly, plotContainerId);

  plotMelodyContour.plotLayout.yaxis.range = [40, 300];

  // Now let's load the essentia wasm back-end, if so create UI elements for computing features
  EssentiaModule().then(async function(WasmModule) {
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
      '<button id="btn" class="ui white inverted button">Compute PitchYinProbabilistic </button>'
    );

    var button = document.getElementById("btn");

    // add onclick event handler to comoute button
    button.addEventListener("click", () => onClickFeatureExtractor(), false);
  });
});
