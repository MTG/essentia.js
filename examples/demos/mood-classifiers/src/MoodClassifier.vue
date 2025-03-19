<template>
  <div id="file-select-area">
    <input type="file" ref="fileInput" @change="handleFileUpload" style="display: none"/>
    <div id="file-drop-area"
      v-if="displayMode === 'upload'"
      @dragover="e=>e.preventDefault()"
      @drop="dropHandler"
      @click="()=>fileInput.click()">
      <span>Drop file here or click to upload</span>
    </div>
    <template v-else-if="displayMode === 'waveform'">
      <div id="waveform"></div>
      <div class="controls">
        <button @click="controls.skipBackward"  :disabled="!controlsEnabled">Backward</button>
        <button @click="controls.togglePlayPause" :disabled="!controlsEnabled">{{ isPlaying ? 'Pause' : 'Play' }}</button>
        <button @click="controls.skipForward" :disabled="!controlsEnabled">Forward</button>
        <button @click="controls.toggleMute" :disabled="!controlsEnabled">{{ isMuted ? 'Unmute' : 'Mute' }}</button>
      </div>
    </template>
    <div id="loader" v-else class="dimmer" :class="{disabled: !loaderActive, active: loaderActive}">
      <div class="indeterminate text loader">Analyzing track... This may take a few seconds.</div>
    </div>
  </div>
  <div id="results">
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
import { ref, useTemplateRef, computed } from 'vue';
import { useMoodClassifier, useAnalysisResults } from './moodClassifierComposables';

const { isPlaying, isMuted, classifiers, handleFileUpload, controls, controlsEnabled, displayMode} = useMoodClassifier();

const loaderActive = computed(() => {
  return displayMode !== "upload" && displayMode !== "waveform";
}); // displayPredictions()-false, handleFileUpload()-true

const { predictions, bpmFormatted, keyFormatted } = useAnalysisResults();

const fileInput = useTemplateRef("fileInput");

function dropHandler (e) {
    e.preventDefault();
    handleFileUpload(e);
}

</script>

<style scoped>
@import url("../style.css");
</style>