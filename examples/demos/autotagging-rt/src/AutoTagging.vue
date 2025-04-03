<template>
  <div class="ui container">
    <explanation-modal title="Before you start..." main-text="Note that the autotagging model used in this demo was trained on clean digital audio files. As such, it is not designed to work with potentially noisy microphone capture of playback through speakers. You can use a virtual microphone to achieve the best results." button-text="Dismiss">
    </explanation-modal>
    <div class="wrapper">
      <header>
        <div id="controls">
          <mic-toggle-button 
            id="toggle-audio"
            :class="{recording: isRecording}"
            @click="buttonClickHandler"
            :disabled="buttonDisabled"
          >{{ buttonText }}</mic-toggle-button>
          <div id="info">
            <svg id="infoIcon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" viewBox="0 0 16 16" preserveAspectRatio="xMidYMid meet">
              <g><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.496 6.033h.825c.138 0 .248-.113.266-.25c.09-.656.54-1.134 1.342-1.134c.686 0 1.314.343 1.314 1.168c0 .635-.374.927-.965 1.371c-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486c.609-.463 1.244-.977 1.244-2.056c0-1.511-1.276-2.241-2.673-2.241c-1.267 0-2.655.59-2.75 2.286a.237.237 0 0 0 .241.247zm2.325 6.443c.61 0 1.029-.394 1.029-.927c0-.552-.42-.94-1.029-.94c-.584 0-1.009.388-1.009.94c0 .533.425.927 1.01.927z"/></g>
            </svg>
            <div id="infoText">Music autotagging will help you categorize music automatically. Play a song and click 'Start Autotagging' to see what music genre it is!</div>
          </div>
        </div>
        <div id="title">
          <h1><span class='highlight'>Real-time</span> music <span class='highlight'>autotagging</span></h1>
          <h2>with 
            <a href="https://github.com/jordipons/musicnn" target="_blank">MusiCNN</a> 
            <sup>
              <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 8 8"><path d="M0 0v8h8V6H7v1H1V1h1V0H0zm4 0l1.5 1.5L3 4l1 1l2.5-2.5L8 4V0H4z" fill="#626262"/></svg>
            </sup>
          </h2>
        </div>
      </header>
      <div id="matrix"></div>
    </div>
  </div>
</template>

<script setup>
import { createTagVisualisers, PredictionStore } from "/demos/autotagging-rt/src/utils.js";
import './explanation-modal'
// import './mic-toggle-button'
import './tagviz-component'
import { URLFromFiles } from '../../common/util';
import { onMounted, ref, computed } from "vue";

const audioCtxOptions = {
  sampleRate: 16000
};

const isRecording = ref(false);
const buttonDisabled = ref(false);
const buttonText = computed( () => {
  if (isRecording) return "Stop";
  return "Start"
})

// audio globals
let gumStream;
let AudioContext;
let audioCtx;
let mic;
let gain;
let featureExtractorNode;

let inferenceWorker;
let workerToWorkletPort;
let predictionStore = new PredictionStore;

async function createAudioProcessor(audioContext) {
  try {
    await audioContext.resume();
    // let url = await URLFromFile("./src/feature-extract-processor.js");
    // let url = './build/processor.js';
    let url = '/demos/autotagging-rt/src/feature-extract-processor.js';
    await audioContext.audioWorklet.addModule(url);
  } catch(e) {
    console.log('There was an error loading the worklet processor:\n', e);
    return null;
  }
  
  return new AudioWorkletNode(audioContext, "feature-extract-processor");
}

function createInferenceWorker() {
  inferenceWorker = new Worker('/demos/autotagging-rt/src/inference-worker.js');
  inferenceWorker.onmessage = function listenToWorker(msg) {
    if (msg.data.port) {
      // listen out for port transfer
      workerToWorkletPort = msg.data.port;
      console.log("Received port from worker\n", workerToWorkletPort);
      start();
    } else if (msg.data.predictions) {
      // listen out for model output
      activateTagVisualizers(msg.data.predictions);
      predictionStore.accumFrame(msg.data.predictions);
    }
  };
}

function start() {
  // let grid = document.querySelector('#matrix');
  // grid.classList.toggle('overlay');
  if (navigator.mediaDevices.getUserMedia) {
    console.log("Initializing audio...");
    
    // console.log('Supported constraints: ', navigator.mediaDevices.getSupportedConstraints());
    
    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    .then(startAudioProcessing)
    .catch(function(message) {
      throw "Could not access microphone - " + message;
    });
  } else {
    throw "Could not access microphone - getUserMedia not available";
  }
}

async function startAudioProcessing(stream) {
  gumStream = stream;
  
  let audioTracks = gumStream.getAudioTracks();
  audioTracks.forEach((t) => {
    console.log('MediaStream constraints are: ', t.getSettings());
  })
  
  if (gumStream.active) {
    if (audioCtx.state == "closed") {
      audioCtx = new AudioContext(audioCtxOptions);
    }
    else if (audioCtx.state == "suspended") {
      audioCtx.resume();
    }
    
    try {
      mic = audioCtx.createMediaStreamSource(gumStream);          
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
      } catch(e) {
        console.log(`There was a problem connecting the audio graph \n ${e}`);
      }
      
      // set button to stop
      isRecording.value = true;
      buttonDisabled.value = false;
    } catch(e) {
      alert("Due to sample rate requirements, this demo cannot run on Firefox. Please, try a Chromium-based browser instead.");
    }
  } else {
    throw "Mic stream not active";
  }
}

function stop() {
  // stop mic stream
  gumStream.getAudioTracks().forEach(function(track) {
    track.stop();
    gumStream.removeTrack(track);
  });
  
  audioCtx.close().then(function() {
    // manage button state
    isRecording.value = false;
    
    // disconnect nodes
    mic.disconnect();
    featureExtractorNode.disconnect();
    gain.disconnect();
    mic = undefined; 
    featureExtractorNode = undefined; 
    gain = undefined;
    
    console.log('Stopped mic stream ...');
  });
  
  inferenceWorker = undefined;
  workerToWorkletPort = undefined;
  
  let averagePreds = predictionStore.getAverages();
  // console.info(predictionStore);
  for (let tag in averagePreds) {
    const elem = document.querySelector(`[name="${tag}"]`);
    const logActivation = 1 + Math.log10(averagePreds[tag] + Number.MIN_VALUE)*0.8;
    elem.setActivation(logActivation, 0.1);
  }
  predictionStore.reset();
  // resetTagVisualizers();
}

function buttonClickHandler() {
  if (!isRecording.value) {
    buttonDisabled.value = true;
    createInferenceWorker(); // and then start
  } else {
    stop();
  }
}

function activateTagVisualizers(predictions) {
  for (let tag in predictions) {
    let tagVizElem = document.querySelector(`[name="${tag}"]`);
    tagVizElem.setActivation(predictions[tag], 0.75);
  }
}

function resetTagVisualizers() {
  // let grid = document.querySelector('#matrix');
  // grid.classList.toggle('overlay');
  for (elem of document.querySelectorAll('music-tag-viz')) {
    elem.reset();
  }
}


function main() {
  createTagVisualisers();
  
  try {
    AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext(audioCtxOptions);
  } catch (e) {
    throw 'Could not instantiate AudioContext: ' + e.message;
  }
  
}

onMounted( () => {
  main();
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');

:root {
  --container-padding: 0 5vw;
  --header-margin-top: 5vh;
  --matrix-margin: 1rem 1rem;
  --footer-padding-top: 0.55em;
  --footer-img-mleft: 0.7em;
  --button-font-size: 1.2rem;
  
  --tagviz-hr-display: none;
  --tagviz-direction: row;
  --tagviz-icon-display: block;
  --tagviz-h1-margin: 0;
  --tagviz-font-size: 1rem;
  font-family: 'Poppins', sans-serif;
  position: relative;
}

header {
  width: 100%;
  display: flex;
  /* grid-template: 100% / 1fr 2fr; */
  
  align-items: center;
  justify-content: space-between;
}

#controls {
  font-size: var(--button-font-size);
  max-width: 50%;
  
  display: flex;
  align-items: center;
  justify-content: start;
  flex-basis: 40%;
}

mic-toggle-button {
  --button-color: #E68510;
  --button-color-active: #b3680c;
  --text-color: white;
  --meter-dot-color: #ffd174;
  --button-font-family: 'Poppins', sans-serif;
  margin-left: 0.4rem;
  font-size: var(--button-font-size);
}

#info {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  position: relative;
  width: 100%;
  height: auto;
  
  justify-content: start;
  align-items: center;
  
  text-overflow: ellipsis;
  overflow: visible;
}

#infoIcon {
  height: 1em;
  width: 1em;
  
  margin-left: 0.8em;
  fill: #E68510;
}

#infoIcon:hover {
  fill: #FCA905; 
  cursor: pointer;
}

#infoText {
  position: absolute;
  /* basic styles */
  font-size: 0.57em;
  padding: 0.2em;
  background:rgba(255, 255, 255, 0);
  color: black;
  text-align: center;
  
  display: none;
  z-index: 1;
  
  left: 20%;
}

#infoIcon:hover ~ #infoText {
  display: block;
}

h1, h2 {
  text-align: right;
}

h1 {
  font-weight: 600;
  font-size: 1.8rem;
  margin: 0;
}

h2 {
  font-weight: 300;
  font-size: 1.3rem;
  margin-top: 0;
  margin-bottom: 0;
}

#title {
  margin-right: 0.4rem;
}

a {
  text-decoration: none;
  color: #b3680c;
}

a:link {
  color: #b3680c;
}

a:visited {
  color: #724208; 
}

a:hover {
  color: #E68510;
}

a:active {
  text-decoration: underline;
}

sup svg {
  height: 0.5rem;
  width: 0.5rem;
}

.wrapper {
  width: fit-content;
  height: 100%;
  
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
}

#matrix {
  /* max-width: 86%; */
  
  display: grid;
  grid-template-rows: repeat(5, 1fr);
  grid-template-columns: repeat(10, 1fr);
  /* gap: 0px; */
  
  justify-items: center;
  
  pointer-events: none;
}

.overlay {
  opacity: 0.7;
  filter: grayscale(100%);
}

span.highlight {
  /* color: #5DC1B9; */
  color: #E68510;
}
</style>