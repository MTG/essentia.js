<template>
  <div class="ui container">
    <div class="ui centered one column padded grid">
      <div class="ui container">
          <button
            id="record-button"
            class="ui inverted big button record-button"
            :class="{recording: isRecording}"
            :disabled="buttonDisabled"
            @click="handleButtonClick"
          >
            {{ buttonText }} &nbsp;&nbsp;<i class="microphone icon"></i>
          </button>
      </div>

      <canvas
        ref="chroma-chart"
        style="width: 650px; height: 300px; background-color: transparent;"
      ></canvas>
    </div>
  </div>
</template>

<script setup>
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { EssentiaExtractor, EssentiaWASM } from 'essentia.js';

import { computed, onMounted, ref, useTemplateRef } from 'vue';

import { KEYS, PITCH_CLASS_COLORS, CHART_CONFIG } from "/demos/hpcp-chroma-rt/chartConfig.js";
// global var to load essentia.js core instance
let essentiaExtractor;
let isEssentiaInstance = false;
// global var for web audio API AudioContext
let audioCtx;
// buffer size microphone stream (bufferSize is high in order to make PitchYinProbabilistic algo to work)
let bufferSize = 8192;
let hopSize = 2048;

let mic, scriptNode, gain;

const isRecording = ref(false);
const buttonDisabled = ref(false);
const buttonText = computed( () => {
  if (isRecording.value) return "Stop";
  return "Start"
})

const canvas = useTemplateRef("chroma-chart");

try {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  audioCtx = new AudioContext();
} catch (e) {
  throw "Could not instantiate AudioContext: " + e.message;
}

// global var getUserMedia mic stream
let gumStream;

// settings for plotting
let chromaChart;

// record native microphone input and do further audio processing on each audio buffer using the given callback functions
function startMicRecordStream(
  audioCtx,
  bufferSize,
  onProcessCallback,
  btnCallback
) {
  // cross-browser support for getUserMedia
  navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;
  window.URL =
    window.URL || window.webkitURL || window.mozURL || window.msURL;

  if (navigator.getUserMedia) {
    console.log("Initializing audio...");
    navigator.getUserMedia(
      { audio: true, video: false },
      function(stream) {
        gumStream = stream;
        if (gumStream.active) {
          console.log(
            "Audio context sample rate = " + audioCtx.sampleRate
          );
          mic = audioCtx.createMediaStreamSource(stream);
          // We need the buffer size that is a power of two
          if (bufferSize % 2 != 0 || bufferSize < 4096) {
            throw "Choose a buffer size that is a power of two and greater than 4096";
          }
          // In most platforms where the sample rate is 44.1 kHz or 48 kHz,
          // and the default bufferSize will be 4096, giving 10-12 updates/sec.
          console.log("Buffer size = " + bufferSize);
          if (audioCtx.state == "suspended") {
            audioCtx.resume();
          }
          scriptNode = audioCtx.createScriptProcessor(bufferSize, 1, 1);
          // onprocess callback (here we can use essentia.js algos)
          scriptNode.onaudioprocess = onProcessCallback;
          // It seems necessary to connect the stream to a sink for the pipeline to work, contrary to documentataions.
          // As a workaround, here we create a gain node with zero gain, and connect temp to the system audio output.
          gain = audioCtx.createGain();
          gain.gain.setValueAtTime(0, audioCtx.currentTime);
          mic.connect(scriptNode);
          scriptNode.connect(gain);
          gain.connect(audioCtx.destination);

          if (btnCallback) {
            btnCallback();
          }
        } else {
          throw "Mic stream not active";
        }
      },
      function(message) {
        throw "Could not access microphone - " + message;
      }
    );
  } else {
    throw "Could not access microphone - getUserMedia not available";
  }
}

function stopMicRecordStream() {
  console.log("Stopped recording ...");
  // stop mic stream
  gumStream.getAudioTracks().forEach(function(track) {
    track.stop();
  });
  isRecording.value = false;
  audioCtx.suspend().then(() => {
    mic.disconnect();
    gain.disconnect();
    scriptNode.disconnect();

    mic, gain, scriptNode = null;
  });
}

// ScriptNodeProcessor callback function to extract pitchyin feature using essentia.js and plotting it on the front-end
function onRecordEssentiaFeatureExtractor(event) {

  let audioBuffer = event.inputBuffer.getChannelData(0);

  // compute RMS for thresholding:
  const rms = essentiaExtractor.RMS(essentiaExtractor.arrayToVector(audioBuffer)).rms;
  if (rms >= 0.05) {
    // compute hpcp for overlapping frames of audio
    const hpcp = essentiaExtractor.hpcpExtractor(audioBuffer);
    // console.log(`raw: ${hpcp}`);

    const scaledHPCP = hpcp.map(i => 100* Math.tanh(Math.pow(i*0.5, 2)));
    // console.log(`scaled: ${scaledHPCP}`);

    chromaChart.data.datasets[0].backgroundColor = KEYS.map((k, i) => `hsl(${PITCH_CLASS_COLORS[k]}, ${scaledHPCP[i]}%, ${50+scaledHPCP[i]/3}%)`);
    // here we call the plotting function to display realtime feature extraction results
    chromaChart.update();
  } else {
    chromaChart.data.datasets[0].backgroundColor = KEYS.map((k, i) => `hsl(${PITCH_CLASS_COLORS[k]}, 0%, 50%)`);
    chromaChart.update();
  }

}

function handleButtonClick() {
    if (isRecording.value) {
      stopMicRecordStream();
      return;
    }
    buttonDisabled.value = true;
    // loads the WASM backend and runs the feature extraction
    if (!isEssentiaInstance) {
      essentiaExtractor = new EssentiaExtractor(EssentiaWASM.EssentiaWASM);
      // settings specific to an algorithm
      // essentiaExtractor.profile.HPCP.nonLinear = true;
                // modifying default extractor settings
      essentiaExtractor.frameSize = bufferSize;
      essentiaExtractor.hopSize = hopSize;
      essentiaExtractor.sampleRate = audioCtx.sampleRate;
      essentiaExtractor.profile.HPCP.normalized = 'none';
      essentiaExtractor.profile.HPCP.harmonics = 0;
      console.log('profile changed')
      isEssentiaInstance = true;
    }
    // start microphone stream using getUserMedia
    startMicRecordStream(
      audioCtx,
      bufferSize,
      onRecordEssentiaFeatureExtractor, // essentia.js feature extractor callback function
      () => {
        // called when the promise fulfilled
        isRecording.value = true;
        buttonDisabled.value = false;
      }
    );
  } // end recordButton onClick

onMounted( () => {
  // create essentia plot instance
  chromaChart = new Chart(canvas.value.getContext('2d'), CHART_CONFIG);
})

</script>

<style scoped>
#record-button {
  background-color: var(--main-red-light);
  margin-bottom: 1rem;
}
</style>
