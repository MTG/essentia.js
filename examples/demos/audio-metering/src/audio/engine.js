import analyseTrack from "./analysis";

class AudioEngine {
    constructor () {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
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
        for (let f of files) {
            let buf = await this.#batchDecode(f);
            let data = [buf.getChannelData(0), buf.getChannelData(1)];
            analysis[f.name] = await analyseTrack(data);
        }

        return analysis;
    }
}

export const audioEngine = new AudioEngine();
