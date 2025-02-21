import "semantic-ui-css/semantic.min.css";
import { createApp } from 'vue';
import { createWebHistory, createRouter } from 'vue-router';

import LandingPage from './LandingPage.vue';
import RMS from './demos/rms-rt/RMS.vue';
import MelSpectrogram from './demos/melspectrogram-rt/MelSpectrogram.vue';
// import Moods from './demos/mood-classifiers/MoodClassifiers.vue';

const routes = [
  { path: '/demos/melspectrogram-rt', component: MelSpectrogram },
  { path: '/demos/rms-rt', component: RMS },
  // { path: '/demos/mood-classifiers', component: MoodClassifiers },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: "active"
});


const app = createApp(LandingPage);
app.use(router);
app.mount("#app");