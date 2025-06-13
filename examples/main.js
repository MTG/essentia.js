import "semantic-ui-css/semantic.min.css";
import { createApp } from 'vue';
import { createWebHistory, createRouter } from 'vue-router';

import './demos/common/mic-toggle-button.js'

import Chart from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels';
Chart.plugins.unregister(ChartDataLabels);

import LandingPage from './LandingPage.vue';
import MelSpectrogram from './demos/melspectrogram-rt/MelSpectrogram.vue';
import MoodClassifiers from './demos/mood-classifiers/src/MoodClassifier.vue';
import AutoTagging from "./demos/autotagging-rt/src/AutoTagging.vue";
import HPCPChroma from "./demos/hpcp-chroma-rt/HPCPChroma.vue";
import PitchYinFFT from "./demos/pitchyinfft-rt/PitchYinFFT.vue";
import OnsetsMain from "./demos/onsets/src/OnsetsMain.vue";
import AudioMetering from "./demos/audio-metering-oop/src/AudioMetering.vue";

import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import '@mdi/font/css/materialdesignicons.css';
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const essentiajsTheme = {
  dark: false,
  colors: {
    primary: '#E4454A',
    secondary: '#9E9E9E',
    accent: '#E3E05B',
    error: '#961E22',
    info: '#2DA0E3',
    success: '#44E36E'
  }
};

import { createBootstrap } from 'bootstrap-vue-next';

const routes = [
  { path: '/demos/melspectrogram-rt', component: MelSpectrogram },
  { path: '/demos/mood-classifiers', component: MoodClassifiers },
  { path: '/demos/autotagging-rt', component: AutoTagging},
  { path: '/demos/hpcp-chroma-rt', component: HPCPChroma},
  { path: '/demos/pitchyinfft-rt', component: PitchYinFFT},
  { path: '/demos/onsets', component: OnsetsMain},
  { path: '/demos/audio-metering', component: AudioMetering }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: "active"
});

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'essentiajsTheme',
    variations: {
      colors: ['primary', 'secondary'],
      lighten: 3,
      darken: 1
    },
    themes: {
      essentiajsTheme
    }
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi
    }
  }
})

const app = createApp(LandingPage);
app.use(router);
// Make BootstrapVue available throughout your project
app.use(createBootstrap());
app.use(vuetify)

// // Optionally install the BootstrapVue icon components plugin
// app.use(BootstrapVueIcons);
app.mount("#app");