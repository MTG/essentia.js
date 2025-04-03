import "semantic-ui-css/semantic.min.css";
import { createApp } from 'vue';
import { createWebHistory, createRouter } from 'vue-router';

import './demos/common/mic-toggle-button.js'

import LandingPage from './LandingPage.vue';
import RMS from './demos/rms-rt/RMS.vue';
import MelSpectrogram from './demos/melspectrogram-rt/MelSpectrogram.vue';
import MoodClassifiers from './demos/mood-classifiers/src/MoodClassifier.vue';
import AutoTagging from "./demos/autotagging-rt/src/AutoTagging.vue";

const routes = [
  { path: '/demos/melspectrogram-rt', component: MelSpectrogram },
  { path: '/demos/rms-rt', component: RMS },
  { path: '/demos/mood-classifiers', component: MoodClassifiers },
  { path: '/demos/autotagging-rt', component: AutoTagging}
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: "active"
});


const app = createApp(LandingPage);
app.use(router);
app.mount("#app");