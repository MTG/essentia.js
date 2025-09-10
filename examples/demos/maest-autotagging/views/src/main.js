import { createApp } from 'vue'
import App from './App.vue';
import initAudio from './audio/manager.js';

initAudio();
createApp(App).mount('#app')
