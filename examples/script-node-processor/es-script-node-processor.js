/*
An example of using essentia.js Module with getUserMedia microphone input streams using the depreciated  
WebAudioApi ScriptNodeProcessor (https://developer.mozilla.org/en-US/docs/Web/API/ScriptProcessorNode)
*/
// essentia js tools object
let essentiaTools;

// global var getUserMedia mic stream
let gumStream;

// settings for plotting
let isPlotting = false;
let plotContainerId = "plotDiv";
let plotStartTimeIndex = 0;


// record native microphone input and do further audio processing on each audio buffer using the given callback functions
function startMicRecordStream(audioCtx, bufferSize, onProcessCallback, btnCallback) {
  // cross-browser support for getUserMedia
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || 
                            navigator.mozGetUserMedia || navigator.msGetUserMedia;           
  window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL

  if (navigator.getUserMedia) {
    console.log('Initializing audio...')
    navigator.getUserMedia({audio: true, video: false}, function(stream) {
      gumStream = stream;
      if (gumStream.active) {
        console.log('Audio context sample rate = ' + audioCtx.sampleRate);
        var mic = audioCtx.createMediaStreamSource(stream);
        // We need the buffer size that is a power of two 
        if ((bufferSize % 2) != 0 || bufferSize < 4096) {
          throw "Choose a buffer size that is a power of two and greater than 4096"
        };
        // In most platforms where the sample rate is 44.1 kHz or 48 kHz, 
        // and the default bufferSize will be 4096, giving 10-12 updates/sec.
        console.log('Buffer size = ' + bufferSize);
        if (audioCtx.state == 'suspended') {
          audioCtx.resume();
        }
        const scriptNode = audioCtx.createScriptProcessor(bufferSize, 1, 1);
        // onprocess callback (here we can use essentia.js algos)
        scriptNode.onaudioprocess = onProcessCallback;
        // It seems necessary to connect the stream to a sink for the pipeline to work, contrary to documentataions.
        // As a workaround, here we create a gain node with zero gain, and connect temp to the system audio output.
        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0, audioCtx.currentTime);
        mic.connect(scriptNode);
        scriptNode.connect(gain);
        gain.connect(audioCtx.destination);

        if (btnCallback) { btnCallback() };
      } else {throw 'Mic stream not active';}
    }, function(message) {
      throw 'Could not access microphone - ' + message;
    });
  } else {throw 'Could not access microphone - getUserMedia not available';};
}


function stopMicRecordStream() {
  console.log("Stopped recording ...");
  // stop mic stream 
  gumStream.getAudioTracks().forEach(function(track) {
    track.stop();
  });
  $("#recordButton").removeClass('recording');
  $("#recordButton").html('Mic &nbsp;&nbsp;<i class="microphone icon"></i>');
  isPlotting = false;
  audioCtx.suspend();
  Plotly.deleteTraces(plotContainerId, 0);
}


// ScriptNodeProcessor callback function to extract Danceability feature using essentia.js and plotting it on the front-end
function onRecordEssentiaFeatureExtractor(event) {
  // convert the float32 audio data into std::vector<float> for using essentia algos 
  var bufferSignal = essentiaTools.arrayToVector(event.inputBuffer.getChannelData(0));
  if (!bufferSignal) { throw "onRecordingError: empty audio signal input found!"};
  
  // create empty std::vector<float> vector for populating the output of essentia.PitchYinProbabilistic algorithm
  // note: this is void function since we have multiple outputs
  var pitches = new Module.VectorFloat();
  var voicedProbabilities = new Module.VectorFloat();

  // check https://essentia.upf.edu/reference/std_PitchYinProbabilistic.html
  essentia.PitchYinProbabilistic(bufferSignal, // input_1
                                pitches, // output_1
                                voicedProbabilities, // output_2
                                // parameters
                                4096, // frameSize
                                256, // hopSize
                                0.1, // lowRMSThreshold
                                'zero', // outputUnvoiced,
                                false, // preciseTime
                                audioCtx.sampleRate); //sampleRate

  // convert the output to js arrray
  var pitchValues = essentiaTools.vectorToArray(pitches);
  // here we call the plotting function to display realtime feature extraction results
  plotMelodyContour(pitchValues, plotContainerId, 'PitchYinProbabilistic');

  // fallback to free the vectors
  pitches.resize(0, 1);
  voicedProbabilities.resize(0, 1);
}


// make linear space
function makeLinSpace(a, b, n) {
  if(typeof n === "undefined") n = Math.max(Math.round(b-a)+1,1);
  if(n<2) { return n===1?[a]:[]; }
  var i,ret = Array(n);
  n--;
  for(i=n;i>=0;i--) { ret[i] = (i*b+(n-i)*a)/n; }
  return ret;
}

// function to plot melody contours using plotly.js
function plotMelodyContour(pitchValues, divId, plotTitle) {
  // layout settings
  var layout = {
      title: plotTitle,
      plot_bgcolor: "transparent",
      paper_bgcolor:"#FCF7F7",
      autosize: false,
      width: 645,
      height: 295,
      xaxis: {
          type: "time",
          title: "Time"
      },
      yaxis: {
          autorange: false,
          range: [0, 1500],
          type: "linear",
          title: "Frequency (Hz)"
      }
  };

  var timeAxis = makeLinSpace(plotStartTimeIndex, 
                              bufferSize / audioCtx.sampleRate, 
                              pitchValues.length);

  if (!isPlotting) {
      Plotly.newPlot(divId, [{
          x: timeAxis,
          y: pitchValues,
          mode: 'lines',
          line: { color: '#2B6FAC', width: 2 }
      }], layout);

      isPlotting = true;
      plotStartTimeIndex = timeAxis[timeAxis.length-1];

  } else {
      timeAxis = makeLinSpace(plotStartTimeIndex,
                              plotStartTimeIndex + (bufferSize / audioCtx.sampleRate), 
                              pitchValues.length);
      plotStartTimeIndex = timeAxis[timeAxis.length-1];

      Plotly.extendTraces(divId, {
          x: [timeAxis],
          y: [pitchValues],
      }, [0]);
  }
}
