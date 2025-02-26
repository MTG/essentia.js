<template>
  <div id="file-select-area">
    <input type="file" ref="fileInput" @change="handleFileUpload" />
    <div id="waveform"></div>
    <template id="playback-controls">
      <div class="controls">
        <button @click="skipBackward">Backward</button>
        <button @click="togglePlayPause">{{ isPlaying ? 'Pause' : 'Play' }}</button>
        <button @click="skipForward">Forward</button>
        <button @click="toggleMute">{{ isMuted ? 'Unmute' : 'Mute' }}</button>
      </div>
    </template>
  </div>
  <div id="results">
    <div id="loader" class="dimmer" :class="{disabled: !loaderActive, active: loaderActive}">
      <div class="indeterminate text loader">Analyzing track... This may take a few seconds.</div>
    </div>
    <div v-for="(classifier, key) in classifiers" :key="key" class="classifier">
      <span>{{ classifier.icon }}</span>
      <div class="classifier-meter" :data-classifier="classifier.label" :style="{'--meter-width': predictions[key]*100}"></div>
    </div>
    <div id="bpm-and-key">
      <div id="bpm" class="row-container">
        <div class="tag">BPM</div>
        <div id="bpm-value">{{ bpmFormatted }}</div>
      </div>
      <div id="key" class="row-container">
        <div class="tag">Key</div>
        <div id="key-value">{{ keyFormatted }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="js">
import { ref, onMounted } from 'vue';
import { useMoodClassifier, useAnalysisResults } from './moodClassifierComposables';

const { fileInput, wavesurfer, controls, isPlaying, isMuted, classifiers, handleFileUpload, skipBackward, togglePlayPause, skipForward, toggleMute, updateMeters, updateValueBoxes } = useMoodClassifier();

const loaderActive = ref(false); // displayPredictions()-false, handleFileUpload()-true

const { predictions, bpmFormatted, keyFormatted } = useAnalysisResults();

</script>

<style scoped>
@import url("../style.css");
</style>