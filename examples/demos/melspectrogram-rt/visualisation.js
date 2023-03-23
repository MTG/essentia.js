import { audioManager } from './audio.js';
import { EssentiaPool } from './EssentiaPool.js';

const RED_RANGE = (255-61)/255;
const axesColor = "#9c9c9c";

// Plot Settings
class Plot {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.movingWindowWidth = 350;
    this.layoutWidth = 700;
    this.layoutHeight = 288;
    this.isFull = false;
    this.offset = 50;
    this.cursor = 0;
    this.spectrumAccum = [];
    this.centroidAccum = [];

    this.canvas.width = this.movingWindowWidth;
    this.canvas.height = audioManager.melNumBands;
    this.canvas.style.width = `${this.layoutWidth}px`;
    this.canvas.style.height = `${this.layoutHeight}px`;
    this.canvas.style.backgroundColor = 'transparent';
    this.ctx = this.canvas.getContext('2d');
  }
  
  get wPixelRatio() {
    return this.layoutWidth/this.canvas.width;
  }
  
  get hPixelRatio() {
    return this.layoutHeight/this.canvas.height;
  }
  
  resetState() {
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
    this.centroidAccum = [];
  }
}

const plot = new Plot();

// Axes Settings
class Axes {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.canvas.width = 800;
    this.canvas.height = 388;
    this.xOffset = plot.offset - 1;
    this.yOffset = plot.offset + 1.5;
    this.tickWidth = 6;
    this.fontSize = 12;
    this.xLabel = "Time (sec)";
    this.yLabel = "Melbands";
    this.xticks = [];
    this.xtickLabels = [];
    this.yticks = [];
    this.ytickSeparation = plot.layoutHeight / 6;
    this.xtimeStep = 1;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.strokeStyle = axesColor;
    this.ctx.fillStyle = axesColor;
    this.ctx.lineWidth = 1;

    // calculate tick pixel coordinates
    for (let i = 0; i < 6; i++) {
      this.yticks.push([this.xOffset, this.yOffset + (i * this.ytickSeparation)]);
    }

    this.reset();
    this.drawAxes();
  }

  get xtickSeparation() {
    // leave timeStep * frames/second * pixels each takes up between ticks
    return this.xtimeStep*(audioManager.sampleRate/audioManager.bufferSize)*plot.wPixelRatio;
  }

  clearXTicks() {
    this.ctx.clearRect(
      this.xOffset,
      this.yOffset + plot.layoutHeight + 1,
      this.canvas.width - this.xOffset,
      this.tickWidth
    );
  }

  clearXTickLabels() {
    this.ctx.clearRect(
      this.xOffset,
      this.yOffset + plot.layoutHeight + this.tickWidth + 1,
      this.canvas.width - this.xOffset,
      this.fontSize
    );
  }

  calculateXTicks() {
    this.xticks = [];
    for (let j = this.xtickSeparation; j <= plot.layoutWidth; j += this.xtickSeparation) {
      this.xticks.push([this.xOffset + j, this.yOffset + plot.layoutHeight]);
    }
  }

  drawXTicks() {
    // x ticks & labels
    this.ctx.font = `${this.fontSize}px sans-serif`;
    this.ctx.beginPath();
    this.xticks.forEach((tick, idx) => {
      this.ctx.moveTo(tick[0], tick[1]);
      this.ctx.lineTo(tick[0], this.yOffset + plot.layoutHeight + this.tickWidth);
    });
    this.ctx.stroke();
  }

  calculateXTickLabels() {
    this.xtickLabels = [];
    this.xticks.forEach((t) => {
      const labelValue = this.xtimeStep*(t[0]-this.xOffset)/this.xtickSeparation;
      this.xtickLabels.push(Math.trunc(labelValue*10)/10);
    })
  }
  
  drawXTickLabels() {
    this.xticks.forEach((tick, idx) => {
      this.ctx.fillText(this.xtickLabels[idx], tick[0]-(this.fontSize/3), this.canvas.height-(this.yOffset*0.6));
    });
  }
  
  clearPlotArea() {
    // clear axes plot area
    // get black image of size plotLayout[Width/Height]
    let emptyImageData = this.ctx.createImageData(plot.layoutWidth, plot.layoutHeight);
    // put empty image data
    this.ctx.putImageData(emptyImageData, plot.offset, plot.offset);
  }
  
  drawYTicks() {
    // y ticks & labels
    this.ctx.font = `${this.fontSize}px sans-serif`;
    this.ctx.beginPath();
    this.yticks.forEach((tick) => {
      this.ctx.moveTo(tick[0], tick[1]);
      this.ctx.lineTo(this.xOffset-this.tickWidth, tick[1]);
      this.ctx.fillText(96 - (tick[1]-this.yOffset)/plot.hPixelRatio, this.xOffset*0.6, tick[1]+(this.fontSize/3));
    });
    this.ctx.stroke();
  }
  
  drawAxes() {
    // main axes
    this.ctx.moveTo(this.xOffset, this.yOffset);
    this.ctx.lineTo(this.xOffset, this.yOffset + plot.layoutHeight);
    this.ctx.lineTo(this.xOffset + plot.layoutWidth, this.yOffset + plot.layoutHeight);
    this.ctx.stroke();
    this.ctx.font = `${this.fontSize + 2}px sans-serif`;
    let xtext = this.ctx.measureText(this.xLabel);
    this.ctx.fillText(this.xLabel, this.xOffset+(plot.layoutWidth*0.5-(xtext.width*0.5)), this.canvas.height-10);
    this.ctx.fillText(this.yLabel, 10, 30);
  }
  
  reset() {
    this.clearXTicks();
    this.clearXTickLabels();
    this.calculateXTicks();
    this.calculateXTickLabels();
    this.drawXTicks();
    this.drawXTickLabels();
    this.drawYTicks();
  }
}

class Visualizer {
  constructor(containerId) {
    // visual objects
    this.axes = new Axes(containerId);

    // timing and animation
    this.animationStart;
    this.elapsed;
    this.animationLoopId;

    // data objects
    this.descriptorPool = new EssentiaPool(audioManager.memoryInfo);;
    this.melbandsArray = new Float32Array(audioManager.melNumBands);
    this.centroidArray = new Float32Array(1);
  }

  get spectrum() {
    // scale spectrum values to 0 - 255
    return this.melbandsArray.map(x => Math.round(x*35.5));
  }

  get centroid() {
    return this.centroidArray[0];
  }
  
  #getData() {
    /* SAB method */
    this.descriptorPool.get('melbands', this.melbandsArray);
    this.descriptorPool.get('melbands.centroid', this.centroidArray);
    // save into full spectrogram for drawing on stop
    plot.spectrumAccum.push(this.spectrum);
    plot.centroidAccum.push(this.centroid);
  }

  #insertPlotInAxes() {
    this.axes.ctx.drawImage(
      plot.canvas, 
      plot.offset, 
      plot.offset, 
      plot.layoutWidth, 
      plot.layoutHeight
    );
  }

  #drawNextPixelColumn(spectrum, centroid, step) {
    let singleFrameSlice = plot.ctx.getImageData(plot.cursor, 0, step, plot.canvas.height);
    let pixels = step*plot.canvas.height;
    for (let i = 0; i < pixels; i++) {
      const invertedIndex = audioManager.melNumBands - i;
      if (invertedIndex === centroid) {
        singleFrameSlice.data[4 * i + 0] = 240; // R
        singleFrameSlice.data[4 * i + 1] = 238; // G
        singleFrameSlice.data[4 * i + 2] = 0; // B
        singleFrameSlice.data[4 * i + 3] = 255; // A
        continue;
      }
      singleFrameSlice.data[4 * i + 0] = 61 + (spectrum[invertedIndex] * RED_RANGE); // R
      singleFrameSlice.data[4 * i + 1] = (spectrum[invertedIndex] * 81/255); // G
      singleFrameSlice.data[4 * i + 2] = (spectrum[invertedIndex] * 68/255); // B
      singleFrameSlice.data[4 * i + 3] = spectrum[invertedIndex];         // A
    }
    plot.ctx.putImageData(singleFrameSlice, plot.cursor, 0);
  }
  
  drawMovingGraph(timestamp=0) {
    this.#getData();
    if (this.animationStart === undefined)
    this.animationStart = timestamp;
    this.elapsed = timestamp - this.animationStart;
    if (!plot.isFull) {
      // draw melspectrogram frames
      this.#drawNextPixelColumn(this.spectrum, this.centroid, 1);
      this.axes.clearPlotArea();
      this.#insertPlotInAxes();
      plot.cursor += 1;
    } else {
      // update xtick labels:
      this.axes.clearXTickLabels();
      this.axes.xtickLabels = this.axes.xtickLabels.map((x) => {
        return Math.trunc((x*1000+(this.elapsed-this.axes.xtickLabels[this.axes.xtickLabels.length-1]*1000))*0.01)/10;
      });
      this.axes.drawXTickLabels();
      // shift previous pixels for "moving window" effect
      let prevSlice = plot.ctx.getImageData(1, 0, plot.canvas.width-1, plot.canvas.height);
      plot.ctx.putImageData(prevSlice, 0, 0);
      
      this.#drawNextPixelColumn(this.spectrum, this.centroid, 1);
      this.axes.clearPlotArea();
      this.#insertPlotInAxes();
    }
    
    if (plot.cursor == plot.canvas.width-1 && !plot.isFull) {
      plot.isFull = true;
      console.log(`Plot is full! Elapsed time: ${this.elapsed} ms`);
    }

    this.animationLoopId = requestAnimationFrame(this.drawMovingGraph.bind(this));
  }
  
  drawFullSpectrogram() {
    if (this.animationLoopId) {
      cancelAnimationFrame(this.animationLoopId);
    }
    plot.cursor = 0;
    plot.canvas.width = plot.spectrumAccum.length;
    for (var j = 0; j < plot.spectrumAccum.length; j++) {
      let spectrum = plot.spectrumAccum[j];
      let centroid = plot.centroidAccum[j];
      this.#drawNextPixelColumn(spectrum, centroid, 1);
      plot.cursor += 1;
    }
    
    this.axes.clearPlotArea();
    this.axes.reset(this.elapsed*0.001/6);
    this.#insertPlotInAxes();
    this.animationStart = undefined;
    this.elapsed = 0;
  }

  empty() {
    this.axes.clearPlotArea();
    plot.resetState();
    this.axes.reset(1);
  }
}

export { Visualizer };
