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
import { useWaveformDisplay, useAnalysisResults } from './moodClassifierComposables';

const classifiers = {
  danceability: { icon: '💃🏻', label: 'Daceability' },
  mood_happy: { icon: '😁', label: 'Happy' },
  mood_sad: { icon: '😢', label: 'Sad' },
  mood_relaxed: { icon: '😌', label: 'Relaxed' },
  mood_aggressive: { icon: '👊', label: 'Aggressiveness' },
  engagement: { icon: '👁', label: 'Engagement' },
  approachability: { icon: '🧠', label: 'Approachability' },
};

const { isPlaying, isMuted, handleFileUpload, controls, controlsEnabled, displayMode} = useWaveformDisplay();

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
:root {
    --meter-width: 0;
}

body, header, h1 {
    margin: 0;
}

header {
    background-color: var(--main-blue);
    padding: 2rem 0;
    text-align: center;
}

h1 {
    color: #fff;
    font-weight: 500;
}

a#essentia-header-link {
    color: inherit;
}

a#essentia-header-link:hover {
    text-decoration: underline;
}

a#essentia-header-link:active {
    color: var(--dark-blue);
}

#main {
    display: grid;
    grid-template-columns: 3fr 2fr;
    align-items: center;

    margin: 3rem auto;
    height: 30vh;
}


/* FILE UPLOAD AREA */
/* button {
    font-size: 1rem;
    padding: .33rem .66rem;
} */

#file-select-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;

    height: 30vh;
}

#file-drop-area {
    border: 3px dashed #BFBFBF;
    border-radius: 1rem;

    background-color: #f7f7f7;
    height: 100%;
    width: 80%;

    text-align: center;
    line-height: 30vh;
    color: #AFAFAF;
}

#file-drop-area:hover {
    cursor: pointer;
    color: #7f7f7f;
    border-color: #7f7f7f;
}

#file-drop-area > span {
    display: inline-block;
    vertical-align: center;
    line-height: normal;
}

#waveform {
    width: 90%;
}


/* RESULTS AREA */

#results {
    height: 100%;
    max-width: 80%;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
}

.controls {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;

    /* margin-top: 1rem; */
}

.controls#play {
    background-color: var(--main-blue-dark)!important;
}

#loader {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;

    border-radius: 1rem;
}

.classifier {
    display: flex;
    align-items: center;
    justify-content: flex-start;
}

#bpm-and-key {
    margin-top: 1.8rem;
    height: 1.8rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
}

.tag {
    font-weight: bold;
}

#key-value, #bpm-value {
    width: 70%;
    margin: 0 0.3rem;
    border: 1px solid var(--footer-header-dark-blue);
    border-radius: 2px;

    text-align: center;
}

.row-container {
    display: flex;
    flex-direction: row;
}

span {
    margin: auto .8rem;
    font-size: 1.5rem!important;
}

.classifier-meter {
    width: 80%;
    height: 1.8rem;
    position: relative;

    border: .05rem solid var(--footer-header-dark-blue);
    border-radius: .1rem;
    margin: .5rem 0;
}

.classifier-meter::before {
    display: flex;
    align-items: center;

    background-color: var(--main-red-light);
    width: calc(var(--meter-width, 0) * 1%);
    max-width: calc(100% - 0.3rem);
    min-width: 0;
    height: 1.4rem;
    position: absolute;
    left: .15rem;
    top: .15rem;
    bottom: .15rem;

    padding-left: .15rem;

    content: attr(data-classifier);
    text-align: center;
    font-size: 1rem;
}
</style>