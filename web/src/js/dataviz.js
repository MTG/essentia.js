

// global settings for chart.js

Chart.defaults.line.spanGaps = true;


// compute predominant melody of a given audio signal vector array
getPreDominantMelody = function(signal) {
  var pitch = new Module.VectorFloat();
  var pitchConfidence = new Module.VectorFloat();
  Module.predominantPitchMelodiaExtractor(signal, pitch, pitchConfidence);
  return pitch;
}


getLoudnessVickers = function(signal) {

    var frames = Module.frameCutter(signal, 1024, 512, "hann");
    var volumes = new Array(frames.size());
    for (var i=0; i<2; i++) {
        var loudness = Module.loudnessVickers(frames.get(i));
        volumes[i] = loudness;
    }
    return volumes;
}



plotLoudnessBar = function() {

    var canvas = document.createElement('canvas');
    var chartDiv = document.getElementById('loudness-div');
    canvas.id = 'loudness-viz';
    canvas.width = 100;
    canvas.height = 200;
    canvas.style.display = 'block';
    canvas.style.margin = "auto";
    canvas.style.position = "absolute";
    canvas.style.top = 0;
    canvas.style.bottom = 0;
    canvas.style.left = 0;
    canvas.style.right = 0;
    chartDiv.appendChild(canvas);

    var canvasText = document.createElement('canvas');
    canvasText.id = 'loudness-value';
    canvasText.width = 200;
    canvasText.height = 100;
    canvasText.style.margin = "auto";
    canvasText.style.position = "relative";
    canvasText.style.top = 0;
    canvasText.style.bottom = 0;
    canvasText.style.left = 50;
    chartDiv.appendChild(canvasText);


    var optionsBars = {
      // Minimum number.
      min: -100,
      // Maximum number.
      max: 1,
      // Background dash color.
      dashColor: '#e5e5e5',
      // Bar color.
      barColor: '#007bfb',
      // Bar speed.
      speed: 10,
      // Bar color gradient or not.
      gradient: true
    };
    
    var barMeter = new zeu.BarMeter('loudness-viz', optionsBars);

    /* Setters */
    barMeter.value = 0;
    barMeter.dashColor = '#e5e5e5';
    barMeter.barColor = '#007bfb';
    barMeter.speed = 10;

    var signal = typedFloat32Array2Vec(urlAudioBuffer.getChannelData(0));
    loudness = getLoudnessVickers(signal);
        
    var optionsText = {
        // Text
        text: {
          // Font color.
          fontColor: '#dc3547',
          // Background color.
          bgColor: '#000000',
          // Text value.
          value: 'ZEU'
        },
        // Border color at four corners.
        borderColor: '#ffa500',
        // Wave color.
        waveColor: '#28a748',
        // Background color. Use rgba() function to have the gradient effect.
        bgColor: 'rgba(0, 0, 0, 0.01)'
    };

    var textBox = new zeu.TextBox('loudness-value', optionsText);

    /* Setter */
    textBox.value = 0;
    textBox.textColor = '#dc3547';
    textBox.textBgColor = '#000000';
    textBox.bgColor = 'rgba(0, 0, 0, 0.01)';
    textBox.borderColor = '#ffa500';
    textBox.waveColor = '#28a748';

    for (var i=0; i<loudness.length; i++) {
        barMeter.value = loudness[i]
        textBox.value = float2str(loudness[i]);
    }
}



plotTestChart = function() {

    var signal = typedFloat32Array2Vec(urlAudioBuffer.getChannelData(0));
    var pitches = getPreDominantMelody(signal);
    var pc = vec2typedFloat32Array(pitches);
    var data = format1dDataToChartJsFormat(pc, urlAudioBuffer.length);
    createCanvasOnDiv('melody-div', 'melody-viz');
    plotLineChartMelody(data);
}

plotLineChartMelody = function(dataset) {

    var scatterChart = new Chart(chartJsCtx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Predominant Pitch Melodia',
                data: dataset,
                showLine: true,
              }]
        },
        options : {
            scales : {
                xAxes: [{
                    type: 'linear',
                    position: 'bottom',
                    labelString: 'Time (secs)'
                }],
                yAxes: [{
                    type: 'linear',
                    labelString: 'Frequencies (Hz)'
                }]
            }
        }
    });

}


format1dDataToChartJsFormat = function(data, audioLength) {

    audioTimes = makeLinSpace(0, audioLength / 44100., data.length);
    return formatTwoArrays2ObjectArrays(audioTimes, data);
}


makeLinSpace = function(a,b,n) {

    if(typeof n === "undefined") n = Math.max(Math.round(b-a)+1,1);
    if(n<2) { return n===1?[a]:[]; }
    var i,ret = Array(n);
    n--;
    for(i=n;i>=0;i--) { ret[i] = (i*b+(n-i)*a)/n; }
    return ret;
}


formatTwoArrays2ObjectArrays = function(arrayOne, arrayTwo) {

    var outArray = new Array(arrayOne.length);
    for (var i=0; i<arrayOne.length; i++) {
      outArray[i] = {"x": arrayOne[i], "y": arrayTwo[i]};
    }
    return outArray;
}


plotMelodyContour = function(pitchValues, audioLength) {

    pitchTimes = makeLinSpace(0, audioLength / 44100., pitchValues.length);
    var data = [{
        type: "scatter",
        mode: "lines",
        name: "Predominant Pitch Melodia",
        x: pitchTimes,
        y: pitchValues,
        line: {color: '#17BECF'}
    }]
    var layout = {
        title: "Predominant Pitch Melodia",
        xaxis: {
          autorange: true,
          range: [0, 2.28],
          type: 'time',
          name: 'Time (secs)'
        },
        yaxis: {
          range: [Math.min(...pitchValues), Math.max(...pitchValues)],
          type: 'linear',
          name: 'Frequencies (Hz)'
        }
    };
    Plotly.newPlot('viz-div', data, layout);
}

