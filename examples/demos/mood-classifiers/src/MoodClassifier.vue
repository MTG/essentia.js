<template>
  <div class="ui container">
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
          <button @click="controls.skipBackward"  :disabled="!controlsEnabled" class="ui labeled icon button">
            <i class="backward icon"></i>
            Backward
          </button>
          <button @click="controls.togglePlayPause" :disabled="!controlsEnabled" class="ui primary labeled icon button">
            <i class="icon" :class="{play: !isPlaying, pause: isPlaying}"></i>
            {{ isPlaying ? 'Pause' : 'Play' }}
          </button>
          <button @click="controls.skipForward" :disabled="!controlsEnabled" class="ui labeled icon button">
            Forward
            <i class="forward icon"></i>
          </button>
          <button @click="controls.toggleMute" :disabled="!controlsEnabled" class="ui labeled icon button">
            <i class="mute icon"></i>
            {{ isMuted ? 'Unmute' : 'Mute' }}
          </button>
        </div>
      </template>
      <div id="loader" v-else class="dimmer" :class="{disabled: !loaderActive, active: loaderActive}">
        <div class="indeterminate text loader">Analyzing track... This may take a few seconds.</div>
      </div>
    </div>
    <div id="results">
      <div v-for="(classifier, key) in classifiers" :key="key" class="results-row">
        <span class="icon-span">{{ classifier.icon }}</span>
        <div class="classifier-meter" :data-classifier="classifier.label" :style="{'--meter-width': predictions[key]*100}"></div>
      </div>
      <div id="bpm-and-key">
        <div id="bpm" class="results-row">
          <span class="tag">BPM</span>
          <div id="bpm-value">{{ bpmFormatted }}</div>
        </div>
        <div id="key" class="results-row">
          <span class="tag">Key</span>
          <div id="key-value">{{ keyFormatted }}</div>
        </div>
      </div>
      <div>
        <canvas id="arousal-valence" ref="arousalValenceElem"></canvas>
      </div>
    </div>
  </div>
</template>

<script setup lang="js">
import { computed, onMounted, useTemplateRef } from 'vue';
import { useWaveformDisplay, useAnalysisResults, setupArousalValenceChart } from './moodClassifierComposables';

const classifiers = {
  danceability: { icon: '💃🏻', label: 'Danceability' },
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
const arousalValenceElem = useTemplateRef("arousalValenceElem");

onMounted(() => {
  setupArousalValenceChart(arousalValenceElem);
})

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



/* FILE UPLOAD AREA */

#file-select-area {
  margin-bottom: 2rem;
}

#file-drop-area {
    border: 3px dashed #BFBFBF;
    border-radius: 1rem;

    background-color: #f7f7f7;
    height: 100%;
    /* width: 80%; */

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

/* RESULTS AREA */

#results {
    /* height: 100%;
    max-width: 80%;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly; */
}

.controls {
    display: flex;
    flex-direction: row;
    justify-content: center;

    margin-top: 1rem;
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

.results-row {
    display: flex;
    /* align-items: center; */
    /* justify-content: flex-start; */
}

#bpm-and-key {
    /* margin-top: 1.8rem; */
    height: 1.8rem;
    display: flex;
    justify-content: end;
    /* display: grid; */
    /* grid-template-columns: 1fr 1fr; */
}

span {
  margin: auto .8rem;
  &.tag {
    font-weight: bold;
    font-size: 1rem;
  }

  &.icon-span {
    font-size: 1.5rem!important;
  }
}

#key-value, #bpm-value {
    /* width: 70%; */
    min-width: 10rem;
    margin: 0 0.3rem;
    border: 1px solid var(--footer-header-dark-blue);
    border-radius: 2px;

    text-align: center;
}

.classifier-meter {
    width: 100%;
    height: 1.8rem;
    position: relative;

    border: 1px solid var(--footer-header-dark-blue);
    border-radius: .1rem;
}
  
.classifier-meter, #bpm-and-key {
  margin-top: .5rem;
  margin-bottom: .5rem;
  margin-right: 0.8rem;
}

.classifier-meter::before {
    display: flex;
    align-items: center;

    background-color: var(--main-red-dark);
    width: calc(var(--meter-width, 0) * 1%);
    max-width: calc(100% - 0.3rem);
    min-width: 0;
    height: 1.4rem;
    position: absolute;
    left: .2rem;
    top: calc(.2rem - 1px);

    padding-left: .2rem;

    content: attr(data-classifier);
    text-align: center;
    font-size: 1rem;
    color: white;
}
</style>