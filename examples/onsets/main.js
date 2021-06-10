const AudioContext = window.AudioContext || window.webkitAudioContext;

class OnsetsApp {
    constructor () {
        // Audio
        this.audioCtx = new AudioContext();
        this.audioWorker = new Worker('audio-worker.js', {type: 'module'});
        this.onsetPositions = null;
        this.audioFile = null;
        // init audio stuff
        this.audioWorker.postMessage({
            request: 'updateParams',
            params: {sampleRate: this.audioCtx.sampleRate}
        });
        this.audioWorker.onmessage = this.listenToAudioWorker.bind(this);

        // UI
        this.algoControls = document.querySelector('#algorithm-controls');
        this.dropInput = document.createElement('input');
        this.dropArea = document.querySelector('#file-drop-area');
        this.playbackControlsTemplate = document.querySelector('#playback-controls');
        this.playbackControls = null;
        this.wavesurfer = null;
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
            this.audioFile = files[0];
            this.audioFile.arrayBuffer().then((ab) => {
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
            this.toggleWaveformDisplay();
            this.drawOnsets();
        }
    }

    toggleWaveformDisplay() {
        if (this.dropArea) {
            this.dropArea.remove();
        }
        const waveformDiv = document.createElement('section');
        waveformDiv.setAttribute('id', 'waveform');

        this.algoControls.after(this.playbackControlsTemplate.content.cloneNode(true));
        this.algoControls.after(waveformDiv);

        this.wavesurfer = WaveSurfer.create({
            container: '#waveform',
            progressColor: '#F7AF39',
            waveColor: '#a16607',
            plugins: [
                WaveSurfer.markers.create({
                    markers: []
                })
            ]
        });

        this.wavesurfer.loadBlob(this.audioFile);
        this.playbackControls = new PlaybackControls(this.wavesurfer);
        this.playbackControls.toggleEnabled(true);
    }

    drawOnsets() {
        console.log(this.wavesurfer.markers);
        this.wavesurfer.initPlugin('markers');
        this.onsetPositions.forEach( (p) => this.wavesurfer.addMarker({ time: p, position: 'top' }) );
    }

}

class PlaybackControls {
    constructor(wavesurferInstance) {
        this.controls = {
            backward: document.querySelector('.controls #backward'),
            play: document.querySelector('.controls #play'),
            forward: document.querySelector('.controls #forward'),
            mute: document.querySelector('.controls #mute')
        };

        // set click handlers
        this.controls.backward.onclick = () => { wavesurferInstance.skipBackward() };
        this.controls.play.onclick = () => { wavesurferInstance.playPause() };
        this.controls.forward.onclick = () => { wavesurferInstance.skipForward() };
        this.controls.mute.onclick = () => { wavesurferInstance.toggleMute() };
    }

    toggleEnabled(isEnabled) {
        if (isEnabled) {
            for (let c in this.controls) {
                this.controls[c].removeAttribute('disabled');
            }
        } else {
            for (let c in this.controls) {
                this.controls[c].setAttribute('disabled', '');
            }
        }
    }
}

window.onload = () => {
    const app = new OnsetsApp();
};