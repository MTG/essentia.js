const AudioContext = window.AudioContext || window.webkitAudioContext;

class OnsetsApp {
    constructor () {
        // Audio
        this.audioCtx = new AudioContext();
        this.audioWorker = new Worker('audio-worker.js', {type: 'module'});
        this.onsetPositions = null;
        // init audio stuff
        this.audioWorker.postMessage({
            request: 'updateParams',
            params: {sampleRate: this.audioCtx.sampleRate}
        });
        this.audioWorker.onmessage = this.listenToAudioWorker.bind(this);

        // UI
        this.dropInput = document.createElement('input');
        this.dropArea = document.querySelector('#file-drop-area');
        this.waveformDisplay = null;
        this.initializeDropArea();
    }

    initializeDropArea () {
        this.dropInput.setAttribute('type', 'file');
        this.dropInput.addEventListener('change', (ev) => {
            ev.preventDefault();
            this.processFileUpload(ev.target.files);
        });

        this.dropArea.addEventListener('dragover', (e) => { e.preventDefault() });
        this.dropArea.addEventListener('drop', (ev) => {
            ev.preventDefault();
            this.processFileUpload(ev.dataTransfer.files);
        });
        this.dropArea.addEventListener('click', () => {
            this.dropInput.click();
        })
    }
    
    processFileUpload(files) {
        if (files.length > 1) {
            alert("Only single-file uploads are supported currently");
            throw Error("Multiple file upload attempted, cannot process.");
        } else if (files.length) {
            files[0].arrayBuffer().then((ab) => {
                this.decodeBuffer(ab).then((audioBuffer) => {
                    console.info("Done decoding audio!");
                    let audioArray = audioBuffer.getChannelData(0);
                    this.audioWorker.postMessage({
                        request: 'analyse',
                        audio: audioArray
                    });
                });
            });
        }
    }

    async decodeBuffer(arrayBuffer) {
        await this.audioCtx.resume();
        let audioBuffer = await this.audioCtx.decodeAudioData(arrayBuffer);
        return audioBuffer;
    }

    listenToAudioWorker(msg) {
        if (msg.data instanceof Float32Array) {
            this.onsetPositions = msg.data;
            this.updateWaveform();
        } else {
            throw TypeError("Worker failed. Analysis results should be of type Float32Array");
        }
    }

    updateWaveform() {
        if (this.onsetPositions) {
            console.info(this.onsetPositions);
        }
    }

}


window.onload = () => {
    const app = new OnsetsApp();
};