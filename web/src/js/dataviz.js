


plotAudioArray = function(audioArray) {

    Plotly.newPlot('results', [{
      x: audioArray,
      type: 'scatter'
    }]);

}

