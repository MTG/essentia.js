<template>
  <div class="ui padded grid centered">
    <mic-toggle-button ref="mic-button" :isRecording="isRecording" @click="toggleRecording"></mic-toggle-button>
    <RMSDisplay>
      <template v-slot:rms-value> {{ rmsText }}</template>
    </RMSDisplay>
  </div>
  <div class="ui padded grid centered">
    <canvas
      ref="melspectrogram-axes-div"
      class="ui centered"
      style="width: 800px; height: 388px;"
    ></canvas>
  </div>
</template>

<script setup>
import RMSDisplay from "./RMS.vue";
import {ref, useTemplateRef, onMounted } from 'vue';
import melspectrogramProcessorURL from "./melspectrogram-processor.js?url";
import { registerEssentiaNode, createEssentiaNode } from '../common/essentia-worklet-node';
import { RMSAnalyser } from "./RMSAnalyser";

const micButton = useTemplateRef("mic-button");

// TODO: move to mount, otherwise template ref not available yet
let audioCtx;
let bufferSize = 1024;
let hopSize = 512;
let melNumBands = 96;

const isRecording = ref(false);
const isRecordDisabled = ref(false);
const rmsText = ref("-100");

// global audio node variables
let melspectrogramNode;
let analyserNode;
let melspectrumBuffer;
const melspectogramProcessorName = melspectrogramProcessorURL.split("/").at(-1).split(".")[0];
let rmsAnalyser;

const fontColor = "#6c6c6c";

// Plot Settings
const plot = {
  canvas: document.createElement('canvas'),
  movingWindowWidth: 350,
  get wPixelRatio() {
    return this.layoutWidth/this.canvas.width;
  },
  get hPixelRatio() {
    return this.layoutHeight/this.canvas.height;
  },
  layoutWidth: 700,
  layoutHeight: 288,
  isFull: false,
  offset: 50,
  cursor: 0,
  spectrumAccum: [],
  init: function() {
    this.canvas.width = this.movingWindowWidth;
    this.canvas.height = melNumBands;
    this.canvas.style.width = `${this.layoutWidth}px`;
    this.canvas.style.height = `${this.layoutHeight}px`;
    this.canvas.style.backgroundColor = 'transparent';
    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
  },
  resetState: function () {
    this.cursor = 0;
    this.isFull = false;
    this.canvas.width = this.movingWindowWidth;
    // clear this.canvas to zero
    let fullCanvasSlice = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    let data = fullCanvasSlice.data;
    data = data.fill(0);
    this.ctx.putImageData(fullCanvasSlice, 0, 0);
    // clear full spectro
    this.spectrumAccum = [];
  }
};

// Axes Settings
const axes = {
  canvas: useTemplateRef("melspectrogram-axes-div"),
  xOffset: plot.offset-1,
  yOffset: plot.offset+1.5,
  tickWidth: 6,
  fontSize: 12, 
  xLabel: "Time (sec)", 
  yLabel: "Melbands", 
  xticks: [], 
  xtickLabels: [],
  get xtickSeparation() {
    return this.xtimeStep*(audioCtx.sampleRate/bufferSize)*plot.wPixelRatio; // leave timeStep * frames/second * pixels each takes up between ticks
  },
  yticks: [], 
  ytickSeparation: plot.layoutHeight / 6, 
  xtimeStep: 1, // place xtick every <timeStep> seconds
  init: function() {
    this.canvas.value.width = 800;
    this.canvas.value.height = 388;
    this.ctx = this.canvas.value.getContext('2d');
    this.ctx.strokeStyle = fontColor;
    this.ctx.fillStyle = fontColor;
    this.ctx.lineWidth = 1;
    
    // calculate tick pixel coordinates
    for (let i=0; i < 6; i++) {
      this.yticks.push([this.xOffset, this.yOffset+(i*this.ytickSeparation)]);
    }
    
    this.drawAxes();
    this.drawYTicks();
    this.resetXAxis(1);
  },
  clearXTicks: function() {
    this.ctx.clearRect(this.xOffset, this.yOffset+plot.layoutHeight+1, this.canvas.value.width-this.xOffset, this.tickWidth); 
  },
  clearXTickLabels: function() {
    this.ctx.clearRect(this.xOffset, this.yOffset+plot.layoutHeight+this.tickWidth+1, this.canvas.value.width-this.xOffset, this.fontSize);
  },
  calculateXTicks: function(step) {
    this.xtimeStep = step;
    this.xticks = [];
    for (let j=this.xtickSeparation; j <= plot.layoutWidth; j += this.xtickSeparation) {
      this.xticks.push([this.xOffset+j, this.yOffset+plot.layoutHeight]);
    }
  },
  drawXTicks: function() {
    // x ticks & labels
    this.ctx.font = `${this.fontSize}px sans-serif`; 
    this.ctx.beginPath();
    this.xticks.forEach((tick, idx) => {
      this.ctx.moveTo(tick[0], tick[1]);
      this.ctx.lineTo(tick[0], this.yOffset+plot.layoutHeight+this.tickWidth);
    });
    this.ctx.stroke();
  },
  calculatXTickLabels: function() {
    this.xtickLabels = [];
    this.xticks.forEach((t) => {
      const labelValue = this.xtimeStep*(t[0]-this.xOffset)/this.xtickSeparation;
      this.xtickLabels.push(Math.trunc(labelValue*10)/10);
    })
  },
  drawXTickLabels: function() {
    this.ctx.fillStyle = fontColor;
    this.xticks.forEach((tick, idx) => {
      this.ctx.fillText(this.xtickLabels[idx], tick[0]-(this.fontSize/3), this.canvas.value.height-(this.yOffset*0.6));
    });
  },
  clearPlotArea: function() {
    // clear axes plot area
    // get black image of size plotLayout[Width/Height]
    let emptyImageData = this.ctx.createImageData(plot.layoutWidth, plot.layoutHeight);
    // put empty image data
    this.ctx.putImageData(emptyImageData, plot.offset, plot.offset);
  },
  drawYTicks: function() {
    // y ticks & labels
    this.ctx.font = `${this.fontSize}px sans-serif`;
    this.ctx.beginPath();
    this.yticks.forEach((tick) => {
      this.ctx.moveTo(tick[0], tick[1]);
      this.ctx.lineTo(this.xOffset-this.tickWidth, tick[1]);
      this.ctx.fillText(96 - (tick[1]-this.yOffset)/plot.hPixelRatio, this.xOffset*0.6, tick[1]+(this.fontSize/3));
    });
    this.ctx.stroke();
  },
  drawAxes: function() {
    // main axes
    this.ctx.moveTo(this.xOffset, this.yOffset);
    this.ctx.lineTo(this.xOffset, this.yOffset+plot.layoutHeight);
    this.ctx.lineTo(this.xOffset+plot.layoutWidth, this.yOffset+plot.layoutHeight);
    this.ctx.stroke();
    this.ctx.font = `${this.fontSize + 2}px sans-serif`;
    let xtext = this.ctx.measureText(this.xLabel);
    this.ctx.fillText(this.xLabel, this.xOffset+(plot.layoutWidth*0.5-(xtext.width*0.5)), this.canvas.value.height-10);
    this.ctx.fillText(this.yLabel, 10, 30);
  },
  resetXAxis: function(step) {
    this.clearXTicks();
    this.clearXTickLabels();
    this.calculateXTicks(step);
    this.calculatXTickLabels();
    this.drawXTicks();
    this.drawXTickLabels();
  }
};
  
let animationLoopId;

function toggleRecording() {
  if (!isRecording.value) {
    // empty canvas
    axes.clearPlotArea();
    plot.resetState();
    axes.resetXAxis(1);
    // start microphone stream using getUserMedia and runs the feature extraction
    startAudioProcessing();
  } else {
    stopAudioProcessing();
  }
}

function connectGraph() {
  analyserNode = audioCtx.createAnalyser();
  melspectrumBuffer = new Float32Array(melNumBands);
  const melspectrogramProcessorOptions = {
    bufferSize: bufferSize,
    hopSize: hopSize,
    melNumBands: melNumBands,
    sampleRate: audioCtx.sampleRate,
  };

  melspectrogramNode = createEssentiaNode(audioCtx, melspectogramProcessorName, melspectrogramProcessorOptions);    
  micButton.value.connectToAudioNode(melspectrogramNode);
  melspectrogramNode.connect(analyserNode);
}

function startAudioProcessing() {
  console.log("Initializing audio...");
  isRecordDisabled.value = true;
  
  if (audioCtx.state == "suspended") {
    audioCtx.resume();
  }
  
  rmsAnalyser.start();
  requestAnimationFrame(animateSpectrogram); // start plot animation

  isRecordDisabled.value = false;
  isRecording.value = true;
}

let animationStart;
let elapsed;
// draw melspectrogram frames
function animateSpectrogram(timestamp) {
  if (animationStart === undefined) animationStart = timestamp;
  elapsed = timestamp - animationStart;
  animationLoopId = requestAnimationFrame(animateSpectrogram);
  
  // get descriptor data
  analyserNode.getFloatTimeDomainData(melspectrumBuffer);
  // scale spectrum values to 0 - 255
  let scaledMelspectrum = melspectrumBuffer.map(x => Math.round(x*35.5))
  // save into full spectrogram for drawing on stop
  plot.spectrumAccum.push(scaledMelspectrum);
  
  // here we call the plotting function to display realtime feature extraction results
  drawMovingSpectro(scaledMelspectrum);
}

function drawMovingSpectro(spectrum) {
  if (!plot.isFull) {
    drawNextPixelColumn(spectrum, 1);
    axes.clearPlotArea();
    // insert in axes:
    axes.ctx.drawImage(plot.canvas, plot.offset, plot.offset, plot.layoutWidth, plot.layoutHeight);
    plot.cursor += 1;
  } else {
    // update xtick labels:
    axes.clearXTickLabels();
    axes.xtickLabels = axes.xtickLabels.map((x) => {
      return Math.trunc((x*1000+(elapsed-axes.xtickLabels[axes.xtickLabels.length-1]*1000))*0.01)/10;
    });
    axes.drawXTickLabels();
    // shift previous pixels for "moving window" effect
    let prevSlice = plot.ctx.getImageData(1, 0, plot.canvas.width-1, plot.canvas.height);
    plot.ctx.putImageData(prevSlice, 0, 0);
    
    drawNextPixelColumn(spectrum, 1);
    axes.clearPlotArea();
    axes.ctx.drawImage(plot.canvas, plot.offset, plot.offset, plot.layoutWidth, plot.layoutHeight);
  }
  
  if (plot.cursor == plot.canvas.width-1 && !plot.isFull) {
    plot.isFull = true;
    console.log(`Plot is full! Elapsed time: ${elapsed} ms`);
  }
}

let redRange = (255-61)/255;
function drawNextPixelColumn(spectrum, step) {
  let singleFrameSlice = plot.ctx.getImageData(plot.cursor, 0, step, plot.canvas.height);
  let pixels = step*plot.canvas.height;
  for (let i = 0; i < plot.canvas.height; i++) {
    const invertedIndex = melNumBands - i;
    singleFrameSlice.data[4 * i + 0] = 61 + (spectrum[invertedIndex] * redRange); // R
    singleFrameSlice.data[4 * i + 1] = (spectrum[invertedIndex] * 81/255);        // G
    singleFrameSlice.data[4 * i + 2] = (spectrum[invertedIndex] * 68/255);        // B
    singleFrameSlice.data[4 * i + 3] = spectrum[invertedIndex] * 2;             // A
  }
  plot.ctx.putImageData(singleFrameSlice, plot.cursor, 0);
}

function drawFullSpectrogram() {
  plot.cursor = 0;
  plot.canvas.width = plot.spectrumAccum.length;
  for (var j = 0; j < plot.spectrumAccum.length; j++) {
    drawNextPixelColumn(plot.spectrumAccum[j], 1);
    plot.cursor += 1;
  }
  
  axes.clearPlotArea();
  axes.resetXAxis(elapsed*0.001/6);
  axes.ctx.drawImage(plot.canvas, plot.offset, plot.offset, plot.layoutWidth, plot.layoutHeight);
  animationStart = undefined;
  elapsed = 0;
}

function stopAudioProcessing() {
  if (animationLoopId) {
    cancelAnimationFrame(animationLoopId);
    drawFullSpectrogram();
  }
  rmsAnalyser.stop();
  
  isRecording.value = false;
  console.log("Stopped recording ...");
}

onMounted( async () => {
  audioCtx = micButton.value.audio.ctx;
  rmsAnalyser = new RMSAnalyser(audioCtx, rmsText);
  await rmsAnalyser.registerNode();
  await registerEssentiaNode(audioCtx, melspectrogramProcessorURL);
  rmsAnalyser.connectGraph(micButton.value);
  connectGraph();
  plot.init();
  axes.init();
})
</script>

<style scoped>

</style>