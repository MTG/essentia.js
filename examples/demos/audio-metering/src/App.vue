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
          <v-stepper-step step="1">Upload files</v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step step="2">Audio analysis</v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step step="3">See results</v-stepper-step>
        </v-stepper-header>
        <v-stepper-items class="flex-grow-1">
          <v-stepper-content class="full-height" step="1">
            <upload-screen></upload-screen>
          </v-stepper-content>
          <v-stepper-content class="full-height" step="2">
            <waiting-screen></waiting-screen>
          </v-stepper-content>
          <v-stepper-content class="full-height" step="3">
            <results-screen></results-screen>
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
      step: 1,
    };
  },
};
</script>

<style scoped>
.full-height {
	height: 100%;
}
</style>