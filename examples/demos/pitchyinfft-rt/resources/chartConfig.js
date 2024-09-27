// function (ctx) {
//   let index = ctx.dataIndex;
  
//   let logRMS = RMS_ARRAY[index];
//   if (logRMS < 0) logRMS = 0;
  
//   // console.info("borderWidth: ", logRMS);
//   return logRMS * 8; // max 6 pixels wide
// }
let AudioContext;
// global var for web audio API AudioContext
let audioCtx;

try {
    AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
} catch (e) {
    throw "Could not instantiate AudioContext: " + e.message;
}

// assuming FPS = 60Hz
const REFRESH_RATE = 1000/60; // milliseconds

// calculate time axis labels
function getTimeLabels(n) {
    // where `n` is number of pitch values or time frames to be represented
    let xlabels = [];
    for (let i = 0; i < n; i++) {
        xlabels.push(Math.round(Math.round(i * REFRESH_RATE) / 100) / 10) // time in secs rounded to 1 decimal place
    }
    return xlabels;
}

const DISPLAY_LENGTH_SECONDS = 5;
const NUM_ANALYSIS_FRAMES = Math.ceil( DISPLAY_LENGTH_SECONDS / (REFRESH_RATE/1000) );

const FONT_COLOR = "#616161";

const DATA = {
  "labels": getTimeLabels(NUM_ANALYSIS_FRAMES),
  "yLabels": [],
  "datasets": [{
    "data": [],
    "fill": false,
    "type": "line",
    "pointRadius": 0,
    "borderWidth": 5,
    "fontColor": "#555",
    "yAxisID": "main-y-axis",
    "backgroundColor": "",
    "label": "",
    "borderColor": function(ctx) {
      return setColorGradient(ctx);
    },
    "pointBorderColor": "transparent"
  }, {
    "data": [],
    "fill": false,
    "type": "line",
    "pointRadius": 0,
    "borderWidth": 1,
    "label": "background-fill-bottom",
    "yAxisID": "background-area-y-axis",
    "borderColor": "rgba(224, 224, 224, 0.5)",
    "backgroundColor": "rgba(224, 224, 224, 0.5)",
    "pointBorderColor": "transparent"
  }, {
    "data": [],
    "fill": "-1",
    "type": "line",
    "pointRadius": 0,
    "borderWidth": 1,
    "label": "background-fill-top",
    "yAxisID": "background-area-y-axis",
    "borderColor": "rgba(224, 224, 224, 0.5)",
    "backgroundColor": "rgba(224, 224, 224, 0.5)",
    "pointBorderColor": "transparent"
  }]
};

const OPTIONS = {
  "responsive": true,
  "animation": false,
  "title": {
    "display": false
  },
  "maintainAspectRatio": true,
  "legend": {
    "labels": {
      "fontSize": 11,
      "boxWidth": 22,
      "fontColor": FONT_COLOR,
      "filter": function (item, chart) {
        return item.text.includes("Pitch");
      }
    }
  },
  "layout": {
    "padding": {
      "top": 0,
      "left": 10,
      "right": 10,
      "bottom": 0
    }
  },
  "scales": {
    "xAxes": [{
      "barPercentage": 1.00,
      "categoryPercentage": 1.00,
      "gridLines": {
        "display": true
      },
      "ticks": {
        "fontSize": 11,
        "fontColor": FONT_COLOR,
        "maxRotation": 15,
        "autoSkip": true,
        "autoSkipPadding": 10
      },
      "scaleLabel": {
        "display": true,
        "fontSize": 11,
        "fontColor": FONT_COLOR,
        "labelString": "Time (seconds)"
      }
    }],
    "yAxes": [{
        "id": "main-y-axis",
        "type": "logarithmic",
        "position": "left",
        "stacked": true,
        "gridLines": {
          "display": false
        },
        "ticks": {
          "min": 50,
          "max": 3500,
          "fontSize": 11,
          "fontColor": FONT_COLOR,
          "callback": function(...args) {
            const value = Chart.Ticks.formatters.logarithmic.call(this, ...args);
            if (value.length) {
              return Number(value).toLocaleString()
            }
            return value;
          }
        },
        "scaleLabel": {
          "display": true,
          "fontSize": 11,
          "fontColor": FONT_COLOR,
          "labelString": "Pitch (Hz)"
        }
      },
      {
        "id": "pitchclass-y-axis",
        "position": "right",
        "type": "category",
        "stacked": false,
        "gridLines": {
          "display": true,
          "color": [],
          "z": 2,
          "drawTicks": true,
        },
        "ticks": {
          "fontSize": 11,
          "fontColor": FONT_COLOR,
          "callback": function(value, index, values) {
            return value;
          }
        },
        "scaleLabel": {
          "display": true,
          "fontSize": 11,
          "fontColor": FONT_COLOR,
          "labelString": "Pitch Class"
        }
      },
      /* auxiliary axes */
      {
        "id": "background-area-y-axis",
        "position": "left",
        "type": "logarithmic",
        "stacked": true,
        "gridLines": {
          "display": false
        },
        "ticks": {
          "min": 50,
          "max": 3500,
          "fontSize": 11,
          "fontColor": FONT_COLOR,
          "callback": function(...args) {
            const value = Chart.Ticks.formatters.logarithmic.call(this, ...args);
            if (value.length) {
              return Number(value).toLocaleString()
            }
            return value;
          }
        },
        "display": false
      }
    ]
  }
};



const SEMITONE_RATIO = Math.pow(2, 1/12);
const AXES_PITCHES = getPitchScale();
const PITCH_CLASS_COLORS = {
  'C': 'hsl(210, 25%, 50%)', 
  'C#': 'hsl(240, 25%, 50%)', 
  'D': 'hsl(270, 25%, 50%)', 
  'D#': 'hsl(300, 25%, 50%)', 
  'E': 'hsl(330, 25%, 50%)', 
  'F': 'hsl(0, 25%, 50%)', 
  'F#': 'hsl(30, 25%, 50%)', 
  'G': 'hsl(60, 25%, 50%)', 
  'G#': 'hsl(90, 25%, 50%)', 
  'A': 'hsl(120, 25%, 50%)', 
  'A#': 'hsl(150, 25%, 50%)', 
  'B': 'hsl(180, 25%, 50%)'
};

const CONFIDENCE_ARRAY = Array(NUM_ANALYSIS_FRAMES).fill(0);
const RMS_ARRAY = Array(NUM_ANALYSIS_FRAMES).fill(0);
let rms_pointer = RMS_ARRAY;

function getPitchScale() {
  let freq = 440 * Math.pow(SEMITONE_RATIO, -33); // find C2 in 440 tuning
  let semitoneScale = [];
  
  do {
      semitoneScale.push(freq);
      freq = freq * SEMITONE_RATIO;
  } while (semitoneScale.length < 6*12) // fill up to 5 octaves

  return semitoneScale;
} 

function freqToPitchClass(f) {
  const keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const C2 = 440 * Math.pow(SEMITONE_RATIO, -33);
  const semitonesAboveC2 = Math.round(12 * Math.log2(f / C2));
  return keys[semitonesAboveC2 % 12];
}


// fill in data, labels, and setup axes

for (var i = 0; i < NUM_ANALYSIS_FRAMES; i++) DATA.datasets[0].data.push(100);
for (var i = 0; i < NUM_ANALYSIS_FRAMES; i++) DATA.datasets[1].data.push(AXES_PITCHES[0]);
for (var i = 0; i < NUM_ANALYSIS_FRAMES; i++) DATA.datasets[2].data.push(AXES_PITCHES.slice(-1)[0]);

for (var p of AXES_PITCHES) {
    DATA.yLabels.push(freqToPitchClass(p));
}
DATA.yLabels.reverse();

OPTIONS.scales.yAxes[0].ticks.min = AXES_PITCHES[0];
OPTIONS.scales.yAxes[0].ticks.max = AXES_PITCHES.slice(-1)[0];
OPTIONS.scales.yAxes[2].ticks.min = AXES_PITCHES[0];
OPTIONS.scales.yAxes[2].ticks.max = AXES_PITCHES.slice(-1)[0];


for (var n of DATA.yLabels) {
  OPTIONS.scales.yAxes[1].gridLines.color.push(PITCH_CLASS_COLORS[n]);
}


function setColorGradient(ctx) {
  // "#ff5144": hue = 4
  const chartArea = ctx.chart.chartArea;
  if (!chartArea) return null;

  const canvasCtx = ctx.chart.ctx;
  let gradient = canvasCtx.createLinearGradient(chartArea.left, 0, chartArea.right, 0);
  const transparency = rms_pointer;

  const dataSize = ctx.dataset.data.length;
  const stops = Array.from(Array(dataSize).keys()).map(i => i/dataSize); // normalized (0 - 1) gradient stops positions
  stops.forEach((s, idx) => {
    gradient.addColorStop(s, `rgba(255, 81, 69, ${transparency[idx]})`)
  });

  return gradient;
}