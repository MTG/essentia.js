import "semantic-ui-css/semantic.min.css";
import { createApp } from 'vue';
import { createWebHashHistory, createRouter } from 'vue-router';
import { basePath } from './config.js';

import './demos/common/mic-toggle-button.js';
import { useColors } from "./demos/common/useColors.js";

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
import GenreTagging from "./demos/genre-tagging/src/GenreTagging.vue";

import * as playgroundElements from "playground-elements";

import GlitchMelspectrogram from "./snippet-components/GlitchMelspectrogram.vue";
import GlitchPitch from "./snippet-components/GlitchPitch.vue";
import GlitchChroma from "./snippet-components/GlitchChroma.vue";
import GlitchAutotagging from "./snippet-components/GlitchAutotagging.vue";

import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import '@mdi/font/css/materialdesignicons.css';
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const essentiaColors = useColors();

const essentiajsTheme = {
  dark: false,
  colors: {
    primary: essentiaColors.mainRedLight.value,
    secondary: '#9E9E9E',
    accent: essentiaColors.accentYellow.value,
    error: essentiaColors.mainRedDark.value,
    info: essentiaColors.mainBlueDark.value,
    success: essentiaColors.mainBlueLight.value
  }
};

import { createBootstrap } from 'bootstrap-vue-next';

const routes = [
  { path: '/', redirect: '/demos/'},
  { path: '/demos/melspectrogram-rt', component: MelSpectrogram, name: "Melspectrogram | real-time" },
  { path: '/demos/mood-classifiers', component: MoodClassifiers, alias: '/demos/', name: "Mood Classification, Key & BPM" },
  { path: '/demos/autotagging-rt', component: AutoTagging, name: "Music Autotagging | real-time" },
  { path: '/demos/hpcp-chroma-rt', component: HPCPChroma, name: "HPCP Chroma | real-time" },
  { path: '/demos/pitchyinfft-rt', component: PitchYinFFT, name: "Pitch Melodia | real-time" },
  { path: '/demos/onsets', component: OnsetsMain, name: "Onset Detection" },
  { path: '/demos/audio-metering', component: AudioMetering, name: "Audio Metering" },
  { path: '/demos/genre-tagging', component: GenreTagging, name: "Genre Tagging" },
  { path: '/snippets/glitch-melspectrogram', component: GlitchMelspectrogram, alias: '/snippets/' },
  { path: '/snippets/glitch-pitch', component: GlitchPitch },
  { path: '/snippets/glitch-chroma', component: GlitchChroma },
  { path: '/snippets/glitch-autotagging', component: GlitchAutotagging }
];

const router = createRouter({
  history: createWebHashHistory(basePath),
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