import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue';
import WaveSurfer from 'wavesurfer.js';
import { useColors } from '../../common/useColors';
import { Essentia, EssentiaWASM } from 'essentia.js';
import inferenceWorkerURL from './inference.js?url';
import { preprocess, shortenAudio } from './audioUtils.js';
import Chart from 'chart.js';
import { pointToEmoji } from './pointToEmoji.js';

const { footerHeaderDarkBlue, mainBlueDark, mainRedDark } = useColors();

const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();
const KEEP_PERCENTAGE = 0.65; // keep only 15% of audio fil

let essentia;
let inferenceWorker;

const predictions = ref({});
const essentiaAnalysis = ref({keyData: null, bpm: null});

function processFile(arrayBuffer) {
  audioCtx.resume().then(() => {
    audioCtx.decodeAudioData(arrayBuffer).then(async function handleDecodedAudio(audioBuffer) {
      console.info("Done decoding audio!");
      
      const prepocessedAudio = preprocess(audioBuffer);
      await audioCtx.suspend();
      
      if (essentia) {
        computeKeyBPM(prepocessedAudio);
      }
      
      // reduce amount of audio to analyse
      let audioData = shortenAudio(prepocessedAudio, KEEP_PERCENTAGE, true); // <-- TRIMMED start/end
      
      // send for feature extraction
      inferenceWorker.postMessage({
        arrayBuffer: audioData.buffer,
        type: "audio"
      }, [audioData.buffer]);
      audioData = null;
    })
  })
}

function computeKeyBPM (audioSignal) {
  let vectorSignal = essentia.arrayToVector(audioSignal);
  essentiaAnalysis.value.keyData = essentia.KeyExtractor(vectorSignal, true, 4096, 4096, 12, 3500, 60, 25, 0.2, 'bgate', 16000, 0.0001, 440, 'cosine', 'hann');
  essentiaAnalysis.value.bpm = essentia.PercivalBpmEstimator(vectorSignal, 1024, 2048, 128, 128, 210, 50, 16000).bpm;
  
  // const bpm = essentia.RhythmExtractor(vectorSignal, 1024, 1024, 256, 0.1, 208, 40, 1024, 16000, [], 0.24, true, true).bpm;
  // const bpm = essentia.RhythmExtractor2013(vectorSignal, 208, 'multifeature', 40).bpm;
}

export function setupArousalValenceChart(canvasElem) {
  const data = {
    datasets: [{
      label: "Arousal/Valence (Emomusic model)",
      data: [{"x": 5, "y": 5}],
      backgroundColor: mainRedDark.value,
      pointStyle: (ctx) => {
        const point = ctx.dataset.data[0];
        return pointToEmoji(point.x, point.y);
      }
    }]
  };
  const config = {
    type: "scatter",
    data: data,
    options: {
      responsive: true,
      title: {
        display: true,
        text: "Arousal / Valence - emomusic model",
        fontSize: 14
      },
      legend: {
        display: false,
      },
      scales: {
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: "Valence"
          },
          ticks: {
            min: 1,
            max: 9
          }
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: "Arousal"
          },
          ticks: {
            min: 1,
            max: 9
          }
        }]
      }
    }
  };

  const chart = new Chart(canvasElem.value, config);

  watch(() => predictions.value["emomusic"], (newPreds) => {
    console.log('new predictions: emomusic', newPreds);
    chart.data.datasets[0].data[0] = {
      "x": newPreds["valence"], 
      "y": newPreds["arousal"]
    };
    chart.update();
    console.log(chart);
  })
}

export function useAnalysisResults() {
  
  function createInferenceWorker() {
    inferenceWorker = new Worker(inferenceWorkerURL, {type: "module"});
    inferenceWorker.onmessage = function listenToWorker(msg) {
      // listen out for model output
      if (msg.data.predictions) {
        const modelName = msg.data.predictions[0];
        predictions.value[modelName] = msg.data.predictions[1];
        console.log(`received predictions for ${modelName}`);
      }
    };
  }
  
  onMounted(() => {
    createInferenceWorker();
    essentia = new Essentia(EssentiaWASM.EssentiaWASM, false);
  })
  onUnmounted(() => {
    essentia.shutdown();
    inferenceWorker.terminate();
  })
  
  const bpmFormatted = computed(() => {
    if (!essentiaAnalysis.value.bpm) return '';
    const stringBpm = essentiaAnalysis.value.bpm.toString();
    return stringBpm.slice(0, stringBpm.indexOf('.') + 2); // 1 decimal place only
  })
  const keyFormatted = computed(() => {
    if (!essentiaAnalysis.value.keyData) return '';
    return `${essentiaAnalysis.value.keyData.key} ${essentiaAnalysis.value.keyData.scale}`;
  })
  
  return {
    predictions,
    bpmFormatted,
    keyFormatted
  }
}

export function useWaveformDisplay() {
  const isPlaying = ref(false);
  const isMuted = ref(false);
  const displayMode = ref("upload");
  const controlsEnabled = ref(false);
  let wavesurfer;
  
  function handleFileUpload(event) {
    const files = event.dataTransfer ? event.dataTransfer.files : event.target.files;
    if (files.length > 1) {
      alert("Only single-file uploads are supported currently");
      throw Error("Multiple file upload attempted, cannot process.");
    } else if (files.length) {
      files[0].arrayBuffer().then((ab) => {
        displayMode.value = "waveform";
        nextTick( () => {
          wavesurfer = WaveSurfer.create({
            container: '#waveform',
            progressColor: footerHeaderDarkBlue.value,
            waveColor: mainBlueDark.value,
          });
          
          wavesurfer.loadBlob(files[0]);
          controlsEnabled.value = true;
          processFile(ab);
        })
      })
    }
  }
  
  const controls = {
    skipBackward() {
      wavesurfer.skipBackward();
    },
    
    togglePlayPause() {
      isPlaying.value = !isPlaying.value;
      wavesurfer.playPause();
    },
    
    skipForward() {
      wavesurfer.skipForward();
    },
    
    toggleMute() {
      isMuted.value = !isMuted.value;
      wavesurfer.toggleMute();
    }
  };
  
  return {
    controls,
    controlsEnabled,
    isPlaying,
    isMuted,
    handleFileUpload,
    displayMode
  };
}