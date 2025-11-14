import { ref, computed, onMounted, onUnmounted, nextTick, watch, useTemplateRef } from 'vue';
import WaveSurfer from 'wavesurfer.js';
import { useColors } from '../../common/useColors.js';
import { Essentia, EssentiaWASM } from 'essentia.js';
import { preprocess, shortenAudio } from '../../common/audio/audioUtils.js';

import discogsTags from '../models/discogsTags.js';
import mttTags from '../models/mttTags.js';

const LABELS = {
  'genre_discogs': discogsTags,
  'mtt': mttTags
};

const MAX_TAGS_DISPLAY = 10;

const { footerHeaderDarkBlue, mainBlueDark } = useColors();

const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();
const KEEP_PERCENTAGE = 0.65; // keep only 15% of audio fil

let essentia;
let inferenceWorker;

const predictions = ref({});
const essentiaAnalysis = ref({keyData: null, bpm: null});
let resultsElem = document.getElementById('genre-tagging-container');
console.log({resultsElem});

function processFile(arrayBuffer) {
  audioCtx.resume().then(() => {
    audioCtx.decodeAudioData(arrayBuffer).then(async function handleDecodedAudio(audioBuffer) {
      console.info("Done decoding audio!");
      
      const prepocessedAudio = preprocess(audioBuffer);
      await audioCtx.suspend();
      
      // reduce amount of audio to analyse
      let shortenedAudio = shortenAudio(prepocessedAudio, KEEP_PERCENTAGE, true); // <-- TRIMMED start/end

      // send for feature extraction
      inferenceWorker.postMessage({
        arrayBuffer: shortenedAudio.buffer,
        type: "audio"
      }, [shortenedAudio.buffer]);
      shortenedAudio = null;
    })
  })
}

// from discogs-tagging demo
function normalizeActivations (activationsMap) {
  // normalize activation values
  const activationsArray = activationsMap.map( t => t.score );
  const activationMax = activationsArray.reduce( (a, b) => {
    return Math.max(a, b);
  }, 0);
  const activationMin = activationsArray.reduce( (a, b) => {
    return Math.min(a, b);
  }, 1);
  
  const activationsRange = activationMax - activationMin;
  
  return activationsMap.map( tag => {
    const normActivation = (tag.score - activationMin) / activationsRange;
    return {
      parentGenre: tag.parentGenre ? tag.parentGenre : null,
      name: tag.name,
      normScore: normActivation,
      score: tag.score
    };
  });
}

function getTopPredictions(predictions, modelName) {
  // activations array --> map to corresponding tags
  let scoreTagMap;
  if (modelName == "genre_discogs") {
    scoreTagMap = predictions.map( (score, index) => {
      const [genre, subgenre] = LABELS[modelName][index].split('---');
      return {
        parentGenre: genre,
        name: subgenre,
        score: score
      }
    });
  } else if (modelName == "mtt") {
    scoreTagMap = predictions.map( (score, index) => {
      return {
        name: LABELS[modelName][index],
        score: score
      }
    });
  }
  
  scoreTagMap.sort( (a, b) => b.score - a.score); // descending sort
  
  // grab top N
  let topTags = scoreTagMap.slice(0, MAX_TAGS_DISPLAY);
  // normalize top N
  return normalizeActivations(topTags);
}

export function useAnalysisResults() {
  
  function createInferenceWorker() {
    inferenceWorker = new Worker(new URL("./inference.js", import.meta.url), {type: "module"});
    inferenceWorker.onmessage = function listenToWorker(msg) {
      // listen out for model output
      if (msg.data.predictions) {
        const modelName = msg.data.predictions[0];
        predictions.value[modelName] = getTopPredictions(msg.data.predictions[1], modelName);
        // get top predictions and labels
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