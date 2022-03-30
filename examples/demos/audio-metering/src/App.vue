<template>
  <v-app>
    <v-main>
      <v-stepper 
				v-model="step" 
				height="100%" 
				color="accent"
				class="d-flex flex-column"
			>
        <v-stepper-header elevation="0">
          <v-stepper-step 
            step="1"
            :complete="step > 1"
          >Upload files</v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step 
            step="2"
            :complete="step > 2"
          >Audio analysis</v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step step="3">See results</v-stepper-step>
        </v-stepper-header>
        <v-stepper-items class="flex-grow-1">
          <v-stepper-content class="full-height" step="1">
            <upload-screen
              @analyse-tracks="triggerAnalysis"
            ></upload-screen>
          </v-stepper-content>
          <v-stepper-content class="full-height" step="2">
            <waiting-screen :progress="analysisProgress"></waiting-screen>
          </v-stepper-content>
          <v-stepper-content class="full-height" step="3">
            <results-screen :analysis-data="analysis"></results-screen>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </v-main>
    <demo-footer></demo-footer>
  </v-app>
</template>

<script>
import UploadScreen from "./components/UploadScreen.vue";
import WaitingScreen from "./components/WaitingScreen.vue";
import ResultsScreen from "./components/ResultsScreen.vue";
import DemoHeader from "./components/DemoHeader.vue";
import DemoFooter from "./components/DemoFooter.vue";

import { audioEngine } from './audio/engine.js';
// developing/testing TrackResults.vue
// import exampleTrackAnalysis from '../cypress/integration/exampleAnalysis';

export default {
  components: {
    DemoHeader,
    UploadScreen,
    WaitingScreen,
    ResultsScreen,
    DemoFooter,
  },
  data() {
    return {
      step: 1, // developing/testing TrackResults.vue
      analysis: null,
      analysisProgress: ''
    };
  },
  methods: {
    triggerAnalysis (tracks) {
      this.step = 2;
      audioEngine.batchProcess(tracks).then( analysis => {
        console.info('analysis finished');
        console.info('ready to visualise');
        this.step = 3;
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