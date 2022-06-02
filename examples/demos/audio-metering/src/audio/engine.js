import analyser from "./analysis";
import { v4 as uuidv4 } from 'uuid';

class AudioEngine {
    constructor () {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.progress = '';
        this.domObj = document.createElement('div');
    }

    addEventListener(listenerName, cb) {
        this.domObj.addEventListener(listenerName, cb);
    }
    dispatchEvent(event) {
        this.domObj.dispatchEvent(event);
    }

    #decodeAudioData (arrayBuffer) {
        // promisify AudioContext.decodeAudioData 
        // so it works with earlier Safari versions
        return new Promise((resolve, reject) => {
            this.ctx.decodeAudioData(arrayBuffer, resolve, reject);
        })
    }

    async #batchDecode (files) {
        const arrayBuffers = await Promise.all( files.map(f => f.arrayBuffer()) );
        const audioBuffers = await Promise.all( arrayBuffers.map(buf => this.#decodeAudioData(buf)) );
        return audioBuffers;
    }

    async batchProcess (files) {
        let analysis = {};
        console.time('tracks-analysis');
        const buffers = await this.#batchDecode(files);
        this.progress = `0/${buffers.length}`;
        this.dispatchEvent(new CustomEvent('progress', {detail: this.progress}));
        let idx = 0;
        for (const b of buffers) {
            const data = [b.getChannelData(0), b.getChannelData(1)];
            const analysisData = await analyser.analyseTrack(data);
            console.info(`analysed track #${idx}:`);
            this.progress = `${idx + 1}/${buffers.length}`;
            const progressEvent = new CustomEvent('progress', {detail: this.progress});
            this.dispatchEvent(progressEvent);
            analysisData.name = files[idx].name;
            analysisData.sampleRate = b.sampleRate;
            analysisData.phase.channelData = data;
            const trackID = uuidv4();
            analysisData.uuid = trackID;
            analysis[trackID] = analysisData;
            idx++;
        }

        console.timeEnd('tracks-analysis');
        await analyser.shutdown();
        return analysis;
    }
}

export const audioEngine = new AudioEngine();
