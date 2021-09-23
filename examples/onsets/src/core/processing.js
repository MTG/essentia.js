import EventBus from "./event-bus";

/* 
    "Signal Processing Unit" for audio-only purposes (no views)
    Connects to EventBus for responding to global events
*/

export default class DSP {
    constructor () {
        this.audioCtx = new (AudioContext || webkitAudioContext)();
        // create audio worker, set up comms
        this.audioWorker = new Worker("./audio-worker.js", {type: "module"});
        this.audioWorker.postMessage({
            request: 'updateParams',
            params: {sampleRate: this.audioCtx.sampleRate}
        });
        this.audioWorker.onmessage = function listenToWorker (msg) {
            if (msg.data instanceof Float32Array) {
                if (msg.data.length == 0) {
                    EventBus.$emit("analysis-finished-empty");
                } else {
                    EventBus.$emit("analysis-finished-onsets", Array.from(msg.data));
                }
            } else {
                throw TypeError("Worker failed. Analysis results should be of type Float32Array");
            }
        };

        // set up global event handlers
        EventBus.$on("sound-selected", (url) => this.handleSoundSelect(url) );
        EventBus.$on("sound-read", (blob) => this.decodeSoundBlob(blob) )
    }

    async getAudioFile (url) {
        let resp = await fetch(url);
        return await resp.blob();
    }
    
    async decodeBuffer (arrayBuffer) {
        await this.audioCtx.resume();
        let audioBuffer = await this.audioCtx.decodeAudioData(arrayBuffer);
        return audioBuffer;
    }
    
    async handleSoundSelect (url) {
        let blob = await this.getAudioFile(url);
        EventBus.$emit("sound-read", blob);
    }

    async decodeSoundBlob (blob) {
        let buffer = await blob.arrayBuffer();
        let audioBuffer = await this.decodeBuffer(buffer);
        let audioArray = audioBuffer.getChannelData(0);
        // send audioArray to Worker
        this.audioWorker.postMessage({
            request: 'analyse',
            audio: audioArray
        });
    }
}