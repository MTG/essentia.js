import "semantic-ui-css/semantic.min.css";
import { createApp } from 'vue';
import { createWebHistory, createRouter } from 'vue-router';

import './demos/common/mic-toggle-button.js'

import Chart from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels';
Chart.plugins.unregister(ChartDataLabels);

import LandingPage from './LandingPage.vue';
import RMS from './demos/rms-rt/RMS.vue';
import MelSpectrogram from './demos/melspectrogram-rt/MelSpectrogram.vue';
import MoodClassifiers from './demos/mood-classifiers/src/MoodClassifier.vue';
import AutoTagging from "./demos/autotagging-rt/src/AutoTagging.vue";
import HPCPChroma from "./demos/hpcp-chroma-rt/HPCPChroma.vue";
import PitchYinFFT from "./demos/pitchyinfft-rt/PitchYinFFT.vue";
import OnsetsMain from "./demos/onsets/src/OnsetsMain.vue";

import { createBootstrap } from 'bootstrap-vue-next';
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'

const routes = [
  { path: '/demos/melspectrogram-rt', component: MelSpectrogram },
  { path: '/demos/rms-rt', component: RMS },
  { path: '/demos/mood-classifiers', component: MoodClassifiers },
  { path: '/demos/autotagging-rt', component: AutoTagging},
  { path: '/demos/hpcp-chroma-rt', component: HPCPChroma},
  { path: '/demos/pitchyinfft-rt', component: PitchYinFFT},
  { path: '/demos/onsets', component: OnsetsMain}
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: "active"
});


const app = createApp(LandingPage);
app.use(router);
// Make BootstrapVue available throughout your project
app.use(createBootstrap());
// // Optionally install the BootstrapVue icon components plugin
// app.use(BootstrapVueIcons);
app.mount("#app");