<template>
  <div class="ui container" id="genre-tagging-container">
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
          <button @click="controls.togglePlayPause" :disabled="!controlsEnabled" class="ui bg-primary labeled icon button">
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
    <div id="results" class="ui grid">
      <div v-for="(classifier, key) in classifiers" :key="key" class="eight wide column">
        <h2 class="ui header">
          {{ classifier.label }}
          <div class="sub header">
            with <i><a :href="classifier.url" target="_blank" rel="noopener noreferrer">{{ classifier.urlName }}</a></i>
          </div>
        </h2>
        <prediction-set v-if="predictions[key]" :tags="predictions[key]"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="js">
import { computed, useTemplateRef } from 'vue';
import { useWaveformDisplay, useAnalysisResults } from './taggingComposables';
import PredictionSet from './PredictionSet.vue';

const classifiers = {
  'genre_discogs': { label: 'Music style classification', urlName: 'Genre Discogs400', url: 'https://essentia.upf.edu/models.html#genre-discogs400' },
  'mtt': { label: 'Music tagging', urlName: 'MagnaTagATune', url: 'https://essentia.upf.edu/models.html#magnatagatune' }
};

const { isPlaying, isMuted, handleFileUpload, controls, controlsEnabled, displayMode} = useWaveformDisplay();

const loaderActive = computed(() => {
  return displayMode !== "upload" && displayMode !== "waveform";
}); // displayPredictions()-false, handleFileUpload()-true

const { predictions } = useAnalysisResults();

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
}

#bpm-and-key {
    height: 1.8rem;
    display: flex;
    justify-content: end;
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

    color: black;
    &.filled {
      color: white;
    }
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
    max-width: calc(100% - 0.4rem);

    height: calc(100% - 0.4rem);
    position: absolute;
    left: .2rem;
    top: .2rem;

    padding-left: .2rem;

    content: attr(data-classifier);
    text-align: center;
    font-size: 1rem;
}
</style>