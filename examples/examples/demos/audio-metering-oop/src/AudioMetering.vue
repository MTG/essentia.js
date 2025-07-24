<template>
  <v-container>
    <v-stepper 
      v-model="step" 
      color="accent"
      class="d-flex flex-column"
      hide-actions
    >
      <v-stepper-header elevation="0">
        <v-stepper-item 
          value="1"
          :complete="step > 0"
        >Upload files</v-stepper-item>
        <v-divider></v-divider>
        <v-stepper-item 
          value="2"
          :complete="step > 1">
          Audio analysis
        </v-stepper-item>
        <v-divider></v-divider>
        <v-stepper-item value="3">See results</v-stepper-item>
      </v-stepper-header>
      <v-stepper-window class="flex-grow-1">
        <v-stepper-window-item value="1">
            <upload-screen
              @analyse-tracks="triggerAnalysis"
            ></upload-screen>
        </v-stepper-window-item>
        <v-stepper-window-item value="2">
          <waiting-screen :progress="analysisProgress"></waiting-screen>
        </v-stepper-window-item>
        <v-stepper-window-item value="3">
          <results-screen :analysis-data="analysis"></results-screen>
        </v-stepper-window-item>
      </v-stepper-window>
    </v-stepper>
  </v-container>
</template>

<script>
import UploadScreen from "./components/UploadScreen.vue";
import WaitingScreen from "./components/WaitingScreen.vue";
import ResultsScreen from "./components/ResultsScreen.vue";

import { audioEngine } from './audio/engine.js';
// developing/testing TrackResults.vue
// import exampleTrackAnalysis from '../cypress/integration/exampleAnalysis.js';

export default {
  components: {
    UploadScreen,
    WaitingScreen,
    ResultsScreen,
  },
  data() {
    return {
      step: 0, // developing/testing purposes, should be init 1
      // analysis: {
      //   "ffc9d616-b4db-4a1e-af92-738c5096665c": exampleTrackAnalysis["ffc9d616-b4db-4a1e-af92-738c5096665c"],
      //   "09a4c1d2-e71f-422a-b26b-1d2c41843d15": {...exampleTrackAnalysis["ffc9d616-b4db-4a1e-af92-738c5096665c"], uuid: "09a4c1d2-e71f-422a-b26b-1d2c41843d15"}
      // },
      analysis: undefined,
      analysisProgress: ''
    };
  },
  methods: {
    triggerAnalysis (tracks) {
      this.step = 1;
      audioEngine.batchProcess(tracks).then( analysis => {
        console.info('analysis finished');
        console.info('ready to visualise');
        this.step = 2;
        this.analysis = analysis;
      })
    }
  },
  mounted () {
    audioEngine.addEventListener('progress', (e) => {
      // console.info('progress event on audioEngine', e);
      this.analysisProgress = e.detail;
    })
  }
};

function download(obj) {
  let a = document.createElement('a');
  let b = new Blob([JSON.stringify(obj)], {type: 'application/json'});
  console.log(b);
  let url = URL.createObjectURL(b);
  a.setAttribute('href', url);
  a.setAttribute('download', 'right');
  a.click();
}
</script>

<style scoped>
.full-height {
	height: 100%;
}
</style>