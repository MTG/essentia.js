.<template>
  <div class="ui two column centered row">
    <span class="ui column">
      <mic-toggle-button ref="audio-button" :isRecording="isRecording" @click="toggleRecording"></mic-toggle-button>
    </span>
    <span id="rms" class="ui column">
      <span id="rms-value">{{ rmsText }}</span> <span>dBFS</span>
    </span>
  </div>
</template>

<script setup>
// import MicToggleButton from "./MicToggleButton.vue";
import { createEssentiaNode } from "./essentia-worklet-node.js";

import { ref, useTemplateRef } from 'vue';

let audioContext;
let gumStream;
const audioButton = useTemplateRef("audio-button");

let micNode = null;
let essentiaNode = null;
let analyserNode = null;
let analyserData = null;

let animationID;

const rmsText = ref("0");

class Smoother {
  constructor(windowSize=10) {
    this.size = windowSize;
    this.buffer = new Array(this.size).fill(0);
    this.oldestVal = 0;
    this.sum = 0;
    this.firstTime = true;
  }

  lowpass(val) {
    // computes moving average
    this.buffer.push(val);
    this.oldestVal = this.buffer.shift();
    
    if (this.firstTime) {
      this.sum = this.buffer.reduce((acc, v) => acc + v);
      this.firstTime = false;
    } else {
      this.sum = (this.sum - this.oldestVal) + val;
    }
    const avg = this.sum / this.size;
    return Math.round(avg);
  }
}

const isRecording = ref(false);

const toggleRecording = () => {
  if (!isRecording.value) {
    startAudio()
  } else {
    stopAudio()
  }
}

const startAudio = () => {
  audioContext = audioButton.value.audio.ctx;
  startEssentiaAnalyser(audioContext);
  return;
}

const stopAudio = () => {
  gumStream.getAudioTracks().forEach((track) => {
    track.stop();
    gumStream.removeTrack(track);
  });

  micNode.disconnect();
  analyserNode.disconnect();
  essentiaNode.disconnect();
  // micNode = null;
  // essentiaNode = null;

  cancelAnimationFrame(animationID);

  isRecording.value = false;
}

const smoother = new Smoother(20);

function draw () {
  animationID = requestAnimationFrame(draw);
  analyserNode.getFloatTimeDomainData(analyserData);
  let rms = analyserData[0];
  let dbFS = 20 * Math.log10((rms + Number.EPSILON) * Math.sqrt(2));
  // lowpass value for easier visualization
  let smoothedVal = smoother.lowpass(dbFS);
  rmsText.value = smoothedVal;
}

// connect the nodes
async function startEssentiaAnalyser(audioContext) {
  async function setupAudioGraph(stream) {
    gumStream = stream;
    if (gumStream.active) {
      micNode = audioContext.createMediaStreamSource(stream);
      analyserNode = audioContext.createAnalyser();
      analyserNode.fftSize = 2 * 128;
      analyserData = new Float32Array(analyserNode.frequencyBinCount);

      // create essentia node only once (avoid registering processor repeatedly)
      if (!essentiaNode) {
        essentiaNode = await createEssentiaNode(audioContext);
      }

      // connect mic stream to essentia node
      audioButton.value.connectToAudioNode(essentiaNode);
      // If it isn't connected to destination, the worklet is not executed
      essentiaNode.connect(analyserNode);

      draw(analyserData);

      isRecording.value = true;
    } else { 
      throw 'Mic stream not active'; 
    }
  }
  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({audio: {sampleRate: {exact: audioContext.sampleRate }}, video: false}).then((stream) => {
      setupAudioGraph(stream);
    }).catch(function(message) {
      throw 'Could not access microphone - ' + message;
    });
  } else {throw 'Could not access microphone - getUserMedia not available';}
}
</script>

<style scoped>
  /* TODO: semantic-ui dependency */
</style>