import EventBus from "./event-bus";

/* 
    "Signal Processing Unit" for audio-only purposes (no views)
    Connects to EventBus for responding to global events
*/

export default class DSP {
    constructor () {
        this.audioCtx = new (AudioContext || webkitAudioContext)();
        // create audio worker, set up comms

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
        let audioArray = await this.decodeBuffer(buffer);
        // send audioArray to Worker
        
    }
}