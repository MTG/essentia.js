import Vue from 'vue';
import App from './App.vue';
import '@mdi/font/css/materialdesignicons.css';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

const vuetifyOptions = {
    theme: {
        themes: {
            light: {
                primary: '#E4454A',
                secondary: '#9E9E9E',
                accent: '#E3E05B',
                error: '#961E22',
                info: '#2DA0E3',
                success: '#44E36E'
            }
        }
    }
};

new Vue({
    vuetify: new Vuetify(vuetifyOptions),
    el: '#app',
    render: h => h(App)
});

import { audioEngine } from './audio/engine.js';
const songURLs = import.meta.glob('./assets/testSongs/*.mp3');


async function retrieveTestSongs () {
    let songs = [];
    for (const path in songURLs) {
        if (path.includes('Deep Mystery')) {
            let url = await songURLs[path]();
            let song = await fetch(url.default).then(resp => resp.blob());
            songs.push(song);
            break;
        }
    }
    // const decorrAudio = "https://cdn.glitch.global/9ac995f5-cf01-4f58-8c52-3f6865837ebc/phase-test-decorr.mp3?v=1645544275141"; 
    // const freesoundBeat = "https://freesound.org/data/previews/234/234809_1648664-lq.mp3";
    // let song = await fetch(freesoundBeat).then(resp => resp.blob());
    // songs.push(song);
    return songs;
}

window.onload = async () => {
    let songs = await retrieveTestSongs();
    let analysis = await audioEngine.batchProcess(songs);
    console.log('analysis finished');
};

