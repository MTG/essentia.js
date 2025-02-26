import { ref, computed, onMounted, onUnmounted } from 'vue';
import WaveSurfer from 'wavesurfer.js';
import { useColors } from '../../useColors';
import { EssentiaJS, EssentiaWASM } from 'essentia.js';
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
    essentia = new EssentiaWASM.EssentiaJS(false);
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
  const fileInput = ref(null);
  // const wavesurfer = WaveSurfer.create({
  //   container: '#waveform',
  //   progressColor: footerHeaderDarkBlue,
  //   waveColor: mainBlueDark,
  // });
  const controls = ref(null);
  const isPlaying = ref(false);
  const isMuted = ref(false);

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
    const file = event.target.files?.[0];
    if (file) wavesurfer.loadBlob(file);
  }

  function skipBackward() {
    wavesurfer.skipBackward();
  }

  function togglePlayPause() {
    isPlaying.value = !isPlaying.value;
    wavesurfer.playPause();
  }

  function skipForward() {
    wavesurfer.skipForward();
  }

  function toggleMute() {
    isMuted.value = !isMuted.value;
    wavesurfer.toggleMute();
  }

  function updateMeters(values) {
    Object.entries(classifiers.value).forEach(([key]) => {
      const meter = document.querySelector(`#${key} > .classifier-meter`);
      if (meter) meter.style.setProperty('--meter-width', values[key] * 100 + '%');
    });
  }

  function updateValueBoxes(essentiaAnalysis) {
    const stringBpm = essentiaAnalysis.bpm.toString();
    const formattedBpm = stringBpm.slice(0, stringBpm.indexOf('.') + 2);
    document.getElementById('bpm-value').textContent = formattedBpm;
    document.getElementById('key-value').textContent = `${essentiaAnalysis.keyData.key} ${essentiaAnalysis.keyData.scale}`;
  }

  return {
    fileInput,
    controls,
    isPlaying,
    isMuted,
    classifiers,
    handleFileUpload,
    skipBackward,
    togglePlayPause,
    skipForward,
    toggleMute,
    updateMeters,
    updateValueBoxes,
  };
}