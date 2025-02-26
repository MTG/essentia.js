import { ref, computed, onMounted, onUnmounted } from 'vue';
import WaveSurfer from 'wavesurfer.js';
import { useColors } from '../../useColors';
import { Essentia, EssentiaWASM } from 'essentia.js';
import inferenceWorkerURL from './inference.js?url';

const { footerHeaderDarkBlue, mainBlueDark } = useColors();

let essentia;
let inferenceWorker;

export function useAnalysisResults() {
  const predictions = ref({});

  function createInferenceWorker() {
    inferenceWorker = new Worker(inferenceWorkerURL, {type: "module"});
    inferenceWorker.onmessage = function listenToWorker(msg) {
      // listen out for model output
      if (msg.data.predictions) {
        predictions.value = msg.data.predictions;
        console.log(`received predictions: `, preds);
      }
    };
  }

  onMounted(() => {
    // createInferenceWorker();
    essentia = new Essentia(EssentiaWASM.EssentiaWASM, false);
  })
  onUnmounted(() => {
    essentia.shutdown();
    inferenceWorker.delete();
  })

  const essentiaAnalysis = ref({keyData: null, bpm: null});
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

export function useMoodClassifier() {
  // const wavesurfer = WaveSurfer.create({
  //   container: '#waveform',
  //   progressColor: footerHeaderDarkBlue,
  //   waveColor: mainBlueDark,
  // });

  const isPlaying = ref(false);
  const isMuted = ref(false);
  const controlsEnabled = ref(false)

  const classifiers = ref({
    danceability: { icon: '💃🏻', label: 'Daceability' },
    mood_happy: { icon: '😁', label: 'Happy' },
    mood_sad: { icon: '😢', label: 'Sad' },
    mood_relaxed: { icon: '😌', label: 'Relaxed' },
    mood_aggressive: { icon: '👊', label: 'Aggressiveness' },
    engagement: { icon: '👁', label: 'Engagement' },
    approachability: { icon: '🧠', label: 'Approachability' },
  });

  function handleFileUpload(event) {
    const files = event.dataTransfer ? event.dataTransfer.files : event.target.files;
    if (files.length > 1) {
      alert("Only single-file uploads are supported currently");
      throw Error("Multiple file upload attempted, cannot process.");
    } else if (files.length) {
      files[0].arrayBuffer().then((ab) => {
        toggleLoader();
        wavesurfer = toggleUploadDisplayHTML('display');
        wavesurfer.loadBlob(files[0]);
        controlsEnabled.value = false;
        processFile(ab);
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
    classifiers,
    handleFileUpload
  };
}