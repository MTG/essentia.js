<template>
  <div class="ui padded grid centered">
    <div class="one column centered row">
      <button @click="onRecordClickHandler" class="ui red basic big button" :class="{recording: isRecording}" :disabled="isRecordDisabled" role="switch">
        {{ recordButtonText }} &nbsp;&nbsp;<i class="icon" :class="[isRecording ? 'stop' : 'microphone']"></i>
      </button>
    </div>
    <canvas
    ref="melspectrogram-axes-div"
    class="ui centered"
    style="width: 800px; height: 388px;"
    ></canvas>
  </div>
</template>

<script setup>
import { URLFromFiles } from './util';

import {ref, computed, useTemplateRef, onMounted } from 'vue';

let AudioContext;
// global var for web audio API AudioContext
let audioCtx;
let bufferSize = 1024;
let hopSize = 512;
let melNumBands = 96;

const isRecording = ref(false);
const isRecordDisabled = ref(false);

const recordButtonText = computed( () => {
  if (!isRecording.value) {
    return 'Mic'
  }
  return 'Stop'
});

try {
  AudioContext = window.AudioContext || window.webkitAudioContext;
  audioCtx = new AudioContext();
} catch (e) {
  throw "Could not instantiate AudioContext: " + e.message;
}

// global var getUserMedia mic stream
let gumStream;
// global audio node variables
let mic;
let melspectrogramNode;
let analyserNode;
let melspectrumBuffer;

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
  
  // Utils:
  function arraySum(total, num) {
    return total + num;
  }
  
  
  function onRecordClickHandler() {
    if (!isRecording.value) {
      $(this).prop("disabled", true);
      // empty canvas
      axes.clearPlotArea();
      plot.resetState();
      axes.resetXAxis(1);
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
      isRecordDisabled.value = true;
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
      // In most platforms where the sample rate is 44.1 kHz or 48 kHz,
      // and the default bufferSize will be 4096, giving 10-12 updates/sec.
      if (audioCtx.state == "closed") {
        audioCtx = new AudioContext();
      }
      else if (audioCtx.state == "suspended") {
        audioCtx.resume();
      }
      
      mic = audioCtx.createMediaStreamSource(gumStream);
      analyserNode = audioCtx.createAnalyser();
      melspectrumBuffer = new Float32Array(melNumBands);
      
      let codeForProcessorModule = ["https://cdn.jsdelivr.net/npm/essentia.js@0.1.3/dist/essentia-wasm.umd.js",
      "https://cdn.jsdelivr.net/npm/essentia.js@0.1.3/dist/essentia.js-extractor.umd.js", 
      "/demos/melspectrogram-rt/melspectrogram-processor.js"];
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
      
      isRecordDisabled.value = false;
      isRecording.value = true;
      // set button to stop
      $("#melspectrogram-record-button").prop("disabled", false);
    } else {
      throw "Mic stream not active";
    }
  }
  
  function setupAudioGraph() {
    melspectrogramNode = new AudioWorkletNode(audioCtx, 'melspectrogram-processor', {
      processorOptions: {
        bufferSize: bufferSize,
        hopSize: hopSize,
        melNumBands: melNumBands,
        sampleRate: audioCtx.sampleRate,
      }
    });
    
    mic.connect(melspectrogramNode);
    melspectrogramNode.connect(analyserNode);
    
    requestAnimationFrame(animateSpectrogram); // start plot animation
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
  
  function stopMicRecordStream() {
    if (animationLoopId) {
      cancelAnimationFrame(animationLoopId);
      drawFullSpectrogram();
    }
    
    // stop mic stream
    gumStream.getAudioTracks().forEach(function(track) {
      track.stop();
      gumStream.removeTrack(track);
    });
    
    audioCtx.close().then(function() {
      isRecording.value = false;
      
      // disconnect nodes
      mic.disconnect();
      melspectrogramNode.disconnect();
      mic = undefined; 
      melspectrogramNode = undefined; 
      analyserNode = undefined;
      
      console.log("Stopped recording ...");
    });
  }
  
  onMounted( () => {
    plot.init();
    axes.init();
  })
</script>

<style scoped>

</style>