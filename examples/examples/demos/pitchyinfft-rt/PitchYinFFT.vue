<template>
  <div class="ui container">
    <div class="ui padded grid centered">
      <div class="ui container">
        <button
          id="record-button"
          class="ui inverted big button" 
          role="switch"
          :class="{recording: isRecording}"
          :disabled="buttonDisabled"
          @click="onRecordClickHandler"
        >
          {{ buttonText }} &nbsp;&nbsp;
          <i class="microphone icon"></i>
        </button>
      </div>
      <canvas
        ref="pitchfft-axes-div"
        class="ui centered"
        style="width: 800px; height: 388px;"
      ></canvas>
    </div>
  </div>
</template>

<script setup>
import { onMounted, useTemplateRef, ref, computed } from 'vue';
import { URLFromFiles } from '../common/util';
import pitchProcessorURL from './pitchyinfft-processor.js?url';

import Chart from 'chart.js';
import { DATA, OPTIONS, NUM_ANALYSIS_FRAMES, AXES_PITCHES, RMS_ARRAY, rmsPointer, getTimeLabels } from "./resources/chartConfig.js";
      
let bufferSize = 8192;
let audioCtx = new AudioContext();
// global var getUserMedia mic stream
let gumStream;
// global audio node variables
let mic;
let pitchNode;
let analyserNode;
let pitchBuffer = new Float32Array(4);
const isRecording = ref(false);
const buttonDisabled = ref(false);
const buttonText = computed( () => {
  if (isRecording.value) return "Stop";
  return "Start"
})

// Visualization objects
let animationId;
let canvas = useTemplateRef("pitchfft-axes-div");
let pitchChart;
let pitchAccum = [];
let rmsAccum = [];

onMounted( () => {
  pitchChart = new Chart(canvas.value.getContext("2d"), {
    "data": DATA,
    "options": OPTIONS
  });
})

function resetChartData() {
  rmsPointer.value = RMS_ARRAY;
  pitchChart.data.labels = getTimeLabels(NUM_ANALYSIS_FRAMES);
  pitchChart.data.datasets[0].data = Array(NUM_ANALYSIS_FRAMES).fill(0);
  pitchChart.data.datasets[1].data = Array(NUM_ANALYSIS_FRAMES).fill(AXES_PITCHES[0]);
  pitchChart.data.datasets[2].data = Array(NUM_ANALYSIS_FRAMES).fill(AXES_PITCHES.slice(-1)[0]);
  pitchChart.update();
}

function onRecordClickHandler() {
  if (!isRecording.value) {
    buttonDisabled.value = true;    
    resetChartData();
    // start microphone stream using getUserMedia and runs the feature extraction
    startMicRecordStream();
  } else {
    stopMicRecordStream();
  }
}

// record native microphone input and do further audio processing on each audio buffer using the given callback functions
function startMicRecordStream() {
  if (navigator.mediaDevices.getUserMedia) {
    console.log("Initializing audio...");
    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    .then(startAudioProcessing)
    .catch(function(message) {
      throw "Could not access microphone - " + message;
    });
  } else {
    throw "Could not access microphone - getUserMedia not available";
  }
}

function startAudioProcessing(stream) {
  gumStream = stream;
  if (gumStream.active) {
    if (audioCtx.state == "closed") {
      audioCtx = new AudioContext();
    }
    else if (audioCtx.state == "suspended") {
      audioCtx.resume();
    }
    
    mic = audioCtx.createMediaStreamSource(gumStream);
    analyserNode = new AnalyserNode(audioCtx, {channelCountMode: "explicit", channelCount: 1, fftSize: 128});
    
    let codeForProcessorModule = ["https://cdn.jsdelivr.net/npm/essentia.js@0.1.3/dist/essentia-wasm.umd.js", 
    "https://cdn.jsdelivr.net/npm/essentia.js@0.1.3/dist/essentia.js-core.umd.js", 
    pitchProcessorURL];
    
    // inject Essentia.js code into AudioWorkletGlobalScope context, then setup audio graph and start animation
    URLFromFiles(codeForProcessorModule)
    .then((concatenatedCode) => {
      audioCtx.audioWorklet.addModule(concatenatedCode)
      .then(setupAudioGraph)
      .catch( function moduleLoadRejected(msg) {
        console.log(`There was a problem loading the AudioWorklet module code: \n ${msg}`);
      });
    })
    .catch((msg) => {
      console.log(`There was a problem retrieving the AudioWorklet module code: \n ${msg}`);
    })
    
    // set button to stop
    isRecording.value = true;
    buttonDisabled.value = false;
  } else {
    throw "Mic stream not active";
  }
}

function setupAudioGraph() {
  pitchNode = new AudioWorkletNode(audioCtx, 'pitchyinfft-processor', {
    processorOptions: {
      bufferSize: bufferSize,
      sampleRate: audioCtx.sampleRate,
    },
    outputChannelCount: [1]
  });
  
  
  // It seems necessary to connect the stream to a sink for the pipeline to work, contrary to documentataions.
  // As a workaround, here we create a analyserNode node with zero analyserNode, and connect temp to the system audio output.
  mic.connect(pitchNode);
  pitchNode.connect(analyserNode);
  
  requestAnimationFrame(animatePitch); // start plot animation
}

// draw melspectrogram frames
function animatePitch() {
  animationId = requestAnimationFrame(animatePitch);
  
  analyserNode.getFloatTimeDomainData(pitchBuffer);
  
  const logRMS = 1 + Math.log10(pitchBuffer[2] + Number.MIN_VALUE) * 0.5;
  rmsAccum.push(logRMS);
  RMS_ARRAY.push(logRMS);
  RMS_ARRAY.shift();
  pitchAccum.push(pitchBuffer[0]);
  pitchChart.data.datasets[0].data.push(pitchBuffer[0]);
  pitchChart.data.datasets[0].data.shift();
  
  // console.info("before chart update");
  pitchChart.update();
  // console.info("AFTER chart update");
}

function drawFullPitchContour() {
  rmsPointer.value = rmsAccum;
  pitchChart.data.datasets[0].data = pitchAccum;
  pitchChart.data.datasets[1].data = Array(pitchAccum.length).fill(AXES_PITCHES[0]);
  pitchChart.data.datasets[2].data = Array(pitchAccum.length).fill(AXES_PITCHES.slice(-1)[0]);
  pitchChart.data.labels = getTimeLabels(pitchAccum.length);
  pitchChart.update();
  pitchAccum = [];
  rmsAccum = [];
  console.info("Full pitch contour should be displaying");
}

function stopMicRecordStream() {
  if (animationId) {
    cancelAnimationFrame(animationId);
    drawFullPitchContour();
  }
  
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
    pitchNode.disconnect();
    analyserNode.disconnect();
    mic = undefined; 
    pitchNode = undefined; 
    analyserNode = undefined;
    
    console.log("Stopped recording ...");
  });
}

</script>

<style scoped>
#record-button {
  background-color: var(--main-red-light);
  margin-bottom: 1rem;
}
</style>