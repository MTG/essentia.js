import { audioManager } from './audio.js';
import { EssentiaPool } from './EssentiaPool.js';
import * as PIXI from 'pixi.js';

const displayDiv = document.getElementById('displayContainer');

const app = new PIXI.Application({
  height: 388,
  width: 800
});
// for DEBUGGING
// globalThis.__PIXI_APP__ = app;

displayDiv.appendChild(app.view);

// globals
const redRange = (255-61)/255;
const axesColor = "#bcbcbc";
const axesIndent = 50;
const heatmapHeight = app.screen.height - axesIndent - 15;
const heatmapWidth = app.screen.width - axesIndent;
const pixelsPerTimeFrame = 1;
const pixelsPerMelband = heatmapHeight / audioManager.melNumBands;
const lineStyle = {
  width: 1,
  color: axesColor
};
const tickSize = 6;
const labelTextStyle = new PIXI.TextStyle({
  fontSize: 14,
  fill: [axesColor],
});
const ticksTextStyle = new PIXI.TextStyle({
  fontSize: 12,
  fill: [axesColor]
});

// Axes Container
const axes = new PIXI.Container();
app.stage.addChild(axes);
axes.x = 0;
axes.y = 0;

// Axes graphic objects: X
const xAxis = new PIXI.Container();
axes.addChild(xAxis);
xAxis.x = axesIndent;
xAxis.y = heatmapHeight;

// add line
const xLine = new PIXI.Graphics();
xLine.lineStyle(lineStyle).lineTo(heatmapWidth, 0);
xAxis.addChild(xLine);
// add label
const xLabel = new PIXI.Text('Time (seconds)', labelTextStyle);
xLabel.x = heatmapWidth/2;
xLabel.y = axesIndent - xLabel.height;
xLabel.pivot.x = xLabel.width / 2;
xLabel.pivot.y = xLabel.height / 2;
xAxis.addChild(xLabel);
// add ticks
const xTimeStep = 1;
const xTickSeparation = xTimeStep*(audioManager.sampleRate/audioManager.bufferSize);
const xTicksPositions = [];
for (let i = xTickSeparation; i <= heatmapWidth; i += xTickSeparation) {
  xTicksPositions.push([i, 0]);
}
const xTicks = new PIXI.Graphics();
xTicks.lineStyle(lineStyle);
xTicksPositions.forEach( pos => {
  xTicks.moveTo(pos[0], pos[1]);
  xTicks.lineTo(pos[0], tickSize);
  // add tick label
  const labelText = xTimeStep*pos[0]/xTickSeparation;
  const label = new PIXI.Text(labelText, ticksTextStyle);
  label.x = pos[0];
  label.y = tickSize + 1;
  label.pivot.x = label.width / 2;
  xAxis.addChild(label);
});
xAxis.addChild(xTicks);

// Axes graphic objects: Y
const yAxis = new PIXI.Container();
axes.addChild(yAxis);
yAxis.x = axesIndent;
yAxis.y = heatmapHeight;

// add line
const yLine = new PIXI.Graphics();
yLine.lineStyle(lineStyle).lineTo(0, -heatmapHeight);
yAxis.addChild(yLine);
// add label
const yLabel = new PIXI.Text('Melbands', labelTextStyle);
yLabel.x = -axesIndent;
yLabel.y = -(heatmapHeight/2);
yLabel.pivot.x = yLabel.width / 2;
yLabel.rotation = -0.5*Math.PI;
yAxis.addChild(yLabel);
// add ticks
const yTickSeparation = Math.floor(heatmapHeight / 6);
const yTicksPositions = [];
for (let i = 1; i <= 6; i++) {
  yTicksPositions.push([0, -(i * yTickSeparation)]);
}
const yTicks = new PIXI.Graphics();
yTicks.lineStyle(lineStyle);
yTicksPositions.forEach( pos => {
  yTicks.moveTo(pos[0], pos[1]);
  yTicks.lineTo(-tickSize, pos[1]);
  // add tick label
  const labelText = -Math.floor(pos[1] / pixelsPerMelband);
  const label = new PIXI.Text(labelText, ticksTextStyle);
  label.x = -tickSize - label.width - 1;
  label.y = pos[1];
  label.pivot.y = label.height / 2;
  xAxis.addChild(label);
});
yAxis.addChild(yTicks);


// data objects
const spectrumAccum = [];
const centroidAccum = [];
const descriptorPool = new EssentiaPool(audioManager.memoryInfo);;
const melbandsArray = new Float32Array(audioManager.melNumBands);
const centroidArray = new Float32Array(1);

function getSpectrum() {
  // scale spectrum values to 0 - 255
  return melbandsArray.map(x => Math.round(x*35.5));
}
function getCentroid() {
  return centroidArray[0];
}
function getData() {
  /* SAB method */
  descriptorPool.get('melbands', melbandsArray);
  descriptorPool.get('melbands.centroid', centroidArray);
  // save into full spectrogram for drawing on stop
  spectrumAccum.push(getSpectrum());
  centroidAccum.push(getCentroid());
}

// Heatmap Container
const heatmap = new PIXI.Container();
app.stage.addChild(heatmap);
heatmap.x = axesIndent + 1;
heatmap.y = heatmapHeight;

let heatmapCursor = 0;
function drawNextPixelColumn() {
  const spectrum = getSpectrum();
  const centroid = getCentroid();
  const nextColumn = new PIXI.Graphics();
  for (let i = 0; i < spectrum.length; i++) {
    const colorArray = new Uint8ClampedArray([spectrum[i] * redRange, spectrum[i] * 81/255, spectrum[i] * 68/255, spectrum[i]]);
    const rgbColor = new PIXI.Color(colorArray);
    nextColumn.beginFill(rgbColor.toNumber());
    nextColumn.drawRect(heatmapCursor, (i+1) * -pixelsPerMelband, pixelsPerTimeFrame, pixelsPerMelband);
    nextColumn.endFill();
  }
  heatmap.addChild(nextColumn);
  heatmapCursor = Math.min(heatmapCursor+1, heatmapWidth); // cap at heatmapWidth
}

function heatmapIsFull() {
  return heatmap.children.length >= heatmapWidth;
}

function shiftHeatmap() {
  const oldestMelbandsColumn = heatmap.removeChildAt(0);
  oldestMelbandsColumn.destroy(); // free memory
  for (let melbandsColumn of heatmap.children) {
    const prevPosition = melbandsColumn.position;
    melbandsColumn.position.x = prevPosition.x - pixelsPerTimeFrame;
  }
}

export class Visualizer {
  constructor() {}
  start() {
    app.ticker.add((delta) => {
      getData();
      if (heatmapIsFull()) { 
        shiftHeatmap();  
      };
      drawNextPixelColumn();
    })
  }
  stop() {
    app.ticker.stop();
  }
};