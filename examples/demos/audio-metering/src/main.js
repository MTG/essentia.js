import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')

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
    return songs;
}

window.onload = async () => {
    let songs = await retrieveTestSongs();
    let analysis = await audioEngine.batchProcess(songs);
    console.log('analysis finished');
};

