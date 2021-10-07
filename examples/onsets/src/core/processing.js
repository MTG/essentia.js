import EventBus from "./event-bus";
import JSZip from "jszip";
import audioEncoder from "audio-encoder";

/* 
    "Signal Processing Unit" for audio-only purposes (no views)
    Connects to EventBus for responding to global events
*/
function getMimeTypeFromExtension (ext) {
    return {
        'mp3': 'audio/mpeg',
        'wav': 'audio/wav',
        'ogg': 'audio/ogg',
        'm4a': 'audio/aac',
        'weba': 'audio/webm'
    }[ext]
}

export default class DSP {
    constructor () {
        this.audioCtx = new (AudioContext || webkitAudioContext)();
        // create audio worker, set up comms
        this.audioWorker = new Worker("./audio-worker.js", {type: "module"});
        this.audioWorker.postMessage({
            request: 'updateParams',
            params: {sampleRate: this.audioCtx.sampleRate}
        });
        this.audioWorker.onmessage = (msg) => {
            if (msg.data instanceof Float32Array) {
                if (msg.data.length == 0) {
                    EventBus.$emit("analysis-finished-empty");
                } else {
                    EventBus.$emit("analysis-finished-onsets", Array.from(msg.data));
                }
            } else if (msg.data instanceof Array && msg.data[0] instanceof Float32Array) {
                console.info('worker returned sliced audio', msg.data);
                this.downloadSlicesAsZip(msg.data);
            } else {
                throw TypeError("Worker failed. Analysis results should be of type Float32Array");
            }
        };

        this.fileURL = '';
        this.filename = '';
        
        // set up global event handlers
        EventBus.$on("sound-selected", (url) => this.handleSoundSelect(url) );
        EventBus.$on("sound-read", (blob) => this.decodeSoundBlob(blob) );
        EventBus.$on("algo-params-updated", (parameters) => this.updateAlgoParams(parameters) );
        EventBus.$on("download-slices", this.handleDownload.bind(this));
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
        this.fileURL = url;
        console.info(this.fileURL);
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

    updateAlgoParams (params) {
        this.audioWorker.postMessage({
            request: 'updateParams',
            params: params
        })
    }

    handleDownload () {
        this.audioWorker.postMessage({
            request: 'slice'
        })
    }

    async encodeSlices (slicesArray) {
        const filenameItems = this.fileURL.split('/').slice(-1)[0].split('.');
        const filename = filenameItems.slice(0, -1)[0];
        const extension = filenameItems.slice(-1)[0];
        this.filename = filename;

        let blobPromises = slicesArray.map( (slice) => {
            // console.log(slice.buffer);
            let buffer = this.audioCtx.createBuffer(1, slice.length, 44100);
            let data = buffer.getChannelData(0);
            for (let i = 0; i < slice.length; i++) data[i] = slice[i];

            return audioEncoder(buffer, 'WAV', null);
        });

        let blobs = await Promise.all(blobPromises);

        let encodedSlices = blobs.map( (b, idx) => {
            return {
                name: `${filename}-${idx}.wav`,
                blob: b
            }
        });

        return encodedSlices;
    }

    async downloadSlicesAsZip (slicesArray) {
        const slices = await this.encodeSlices(slicesArray);
        let zip = new JSZip();
        slices.forEach( (s) => {
            zip.file(s.name, s.blob, {
                compression: 'STORE' // no compression
            })
        });

        zip.generateAsync({type: 'blob', compression: 'STORE'})
        .then( zipBlob => {
            const zipURL = URL.createObjectURL(zipBlob);
            const downloadName = `onset-slices_${this.filename}.zip`;
            const link = document.createElement('a');
            link.setAttribute('href', zipURL );
            link.setAttribute('download', downloadName);
            console.info('download link', link);
            link.click();
            URL.revokeObjectURL(zipURL);
            EventBus.$emit('slices-downloaded');
        })
    }
}
