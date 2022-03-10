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
        let analysis = [];
        const start = Date.now();
        const buffers = await this.#batchDecode(files);
        let idx = 0;
        for (const b of buffers) {
            const data = [b.getChannelData(0), b.getChannelData(1)];
            const analysisData = await analyseTrack(data);
            console.info(`analysed track #${idx}:`);
            analysisData.name = files[idx].name;
            analysisData.phase.channelData = Array.from(data[0]).map( (samp, pos) => {
                return [samp, data[1][pos]];
            });
            analysis.push(analysisData);
            idx++;
        }

        console.log(`analysis took ${0.001 * (Date.now() - start)} sec`);

        return analysis;
    }
}

export const audioEngine = new AudioEngine();
