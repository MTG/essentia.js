import { createDescriptorMemoryInfo } from './EssentiaPool.js';
import { URLFromFiles } from "./utils";
import essentiaPoolURL from './EssentiaPool.js?url';

AudioContext = window.AudioContext || window.webkitAudioContext;

const codeForProcessorModule = ["https://cdn.jsdelivr.net/npm/essentia.js@0.1.3/dist/essentia-wasm.umd.js",
                                "https://cdn.jsdelivr.net/npm/essentia.js@0.1.3/dist/essentia.js-extractor.umd.js",
                                essentiaPoolURL,
                                "melspectrogram-processor.js"];

class AudioManager extends AudioContext {
    constructor () {
        super();
        
        this.bufferSize = 1024;
        this.hopSize = 512;
        this.melNumBands = 96;
        this.micStream = null;
        this.micNode = null;
        this.gainNode = null;
        this.melspectrogramNode = null;

        this.workletCodeLoaded = false;
        this.loadAudioWorkletModule();
        // console.log("AudioManager created", this);
        // create shared memory, 50ms of buffer, increase in case of glitches
        this.memoryInfo = createDescriptorMemoryInfo([['melbands', this.melNumBands], ['melbands.centroid', 1]]);
    }

    async startAudio () {
        await this.getMicrophoneStream();
        if (this.micStream.active) {
            this.setupAudioNetwork()
            // In most platforms where the sample rate is 44.1 kHz or 48 kHz,
            // and the default bufferSize will be 4096, giving 10-12 updates/sec.
            if (this.state == "closed") {
                audioManager = new AudioManager();
            }
            else if (this.state == "suspended") {
                this.resume();
            }
        } else {
            throw "Mic stream not active";
        }
    }
    
    async stopAudio() {
        // stop mic stream
        this.micStream.getAudioTracks().forEach( track => {
            track.stop();
            this.micStream.removeTrack(track);
        });
        
        // disconnect nodes
        this.micNode.disconnect();
        this.melspectrogramNode.disconnect();
        this.gainNode.disconnect();
        this.micNode = undefined; 
        this.melspectrogramNode = undefined; 
        this.gainNode = undefined;
        
        return await this.close();
    }
    
    // record native microphone input and do further audio processing on each audio buffer using the given callback functions
    async getMicrophoneStream() {
        if (!navigator.mediaDevices.getUserMedia) {
            throw "Could not access microphone - getUserMedia not available";
        }

        console.log("Initializing audio...");
        this.micStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        return;
    }

    async loadAudioWorkletModule() {
        // inject Essentia.js code into AudioWorkletGlobalScope context
        let concatenatedCode = "";
        try {
            concatenatedCode = await URLFromFiles(codeForProcessorModule);
        } catch (err) {
            console.error(`There was a problem retrieving the AudioWorklet module code: \n ${err.msg}`);
        }

        try {
            await this.audioWorklet.addModule(concatenatedCode);
            this.workletCodeLoaded = true;
        } catch (err) {
            console.error(`There was a problem loading the AudioWorklet module code: \n ${err.message}`);
        }
    }

    setupAudioNetwork() {
        if (!this.workletCodeLoaded) {
            throw new Error("Worklet code not loaded yet");
        }
        
        // create audio nodes
        this.micNode = this.createMediaStreamSource(this.micStream);
        this.gainNode = this.createGain();
        this.gainNode.gain.setValueAtTime(0, this.currentTime);
        
        this.melspectrogramNode = new AudioWorkletNode(this, 'melspectrogram-processor', {
            processorOptions: {
                bufferSize: this.bufferSize,
                hopSize: this.hopSize,
                melNumBands: this.melNumBands,
                sampleRate: this.sampleRate,
            }
        });
        
        try {
            this.melspectrogramNode.port.postMessage({
                memoryInfo: this.memoryInfo,
            });
        } catch(e){
            throw new Error("SAB transfer failed");
        }
    
        // It seems necessary to connect the stream to a sink for the pipeline to work, contrary to documentation.
        // As a workaround, here we create a gain node with zero gain, and connect temp to the system audio output.
        this.micNode.connect(this.melspectrogramNode);
        this.melspectrogramNode.connect(this.gainNode);
        this.gainNode.connect(this.destination);
    }
}

let audioManager = new AudioManager();

export { audioManager };