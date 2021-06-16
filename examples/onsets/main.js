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
        this.algoControls = document.querySelector('#algorithm-controls-section');
        this.fftControlInputs = document.querySelectorAll('.fft-control input[type="number"]');
        this.odfToggles = document.querySelectorAll('weight-toggle');
        this.initializeAlgoControls();
        this.dropInput = document.createElement('input');
        this.dropArea = document.querySelector('#file-drop-area');
        this.playbackControlsTemplate = document.querySelector('#playback-controls');
        this.playbackControls = null;
        this.wavesurfer = null;
        this.initializeDropArea();

        // State
        this.scrollPosition = 0;
        this.pluginsAreInitialised = false;
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

    initializeAlgoControls () {
        this.odfToggles.forEach((elem) => {
            // init selected ODF (e.g. HFC)
            if (elem.name == 'hfc') { elem.checkbox.click() }
            elem.checkbox.addEventListener('click', this.inputHandler.bind(this));
            elem.addEventListener('change', this.inputHandler.bind(this));
        });

        this.fftControlInputs.forEach((elem) => {
            elem.addEventListener('change', this.inputHandler.bind(this))
        })
    }
    
    processFileUpload (files) {
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

    async decodeBuffer (arrayBuffer) {
        await this.audioCtx.resume();
        let audioBuffer = await this.audioCtx.decodeAudioData(arrayBuffer);
        return audioBuffer;
    }

    listenToAudioWorker (msg) {
        if (msg.data instanceof Float32Array) {
            this.onsetPositions = msg.data;
            this.updateWaveform();
        } else {
            throw TypeError("Worker failed. Analysis results should be of type Float32Array");
        }
    }

    inputHandler (ev) {
        const currentElem = ev.target;

        let params = {
            odfs: [],
            odfsWeights: []
        };
        // check all again to see which ones are currently on
        this.odfToggles.forEach((elem) => {
            if (elem.isSelected()) {
                // grab their weights & put into new odfs and odfsWeights arrays
                params.odfs.push(elem.name);
                params.odfsWeights.push(elem.getWeight());
            }
        });

        // check frameSize and hopSize for changes and add to params obj:
        this.fftControlInputs.forEach((elem) => {
            params[elem.name] = parseFloat(elem.value);
        });

        // ensure that at least 1 ODF is selected (the currentElem is NOT the last one) 
        // else show short alert on div below controls and keep currentElem selected
        if (ev.type == 'click' && params.odfs.length == 0) {
            currentElem.click();
            alert(`Couldn't toggle ${currentElem.name} ODF, at least one has to be selected.`);
        } else {
            // submit to this.worker: use 'updateParams' cmd
            this.audioWorker.postMessage({
                request: 'updateParams',
                params: params
            });
        }
        // console.info('algo change: ', params);
    }

    updateWaveform () {
        if (this.onsetPositions) {
            console.info(this.onsetPositions);
            this.toggleWaveformDisplay();
            this.drawOnsets();
        }
    }

    toggleWaveformDisplay () {
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
        this.wavesurfer.on('plugin-initialised', () => this.pluginsAreInitialised = true);

        waveformDiv.addEventListener('wheel', (ev) => {
            ev.preventDefault();
            const pixelMousePosition = ev.pageX - mousePositionX(waveformDiv);
            const normalizedMousePosition = pixelMousePosition/waveformDiv.clientWidth;
            this.zoomWaveform(normalizedMousePosition, ev.deltaY);
        });
    }

    drawOnsets () {
        if (!this.pluginsAreInitialised) {
            this.wavesurfer.initPlugin('markers');
        }

        this.onsetPositions.forEach( (p) => this.wavesurfer.addMarker({ time: p, position: 'top' }) );
    }

    zoomWaveform (xPos, scrollAmount) {
        this.scrollPosition += -1 * scrollAmount;
        if (this.scrollPosition < 0) this.scrollPosition = 0;

        this.wavesurfer.seekAndCenter(xPos);
        this.wavesurfer.zoom(this.scrollPosition);
        // this.wavesurfer.drawer.recenter(xPos);
        // this.wavesurfer.clearMarkers();
        this.drawOnsets();
    }
}

function getNumericStyleProperty(style, prop){
    return parseInt(style.getPropertyValue(prop),10) ;
}

function mousePositionX(e) {
    var x = 0;
    var inner = true ;
    do {
        x += e.offsetLeft;
        var style = getComputedStyle(e, null);
        var borderLeft = getNumericStyleProperty(style, "border-left-width");
        x += borderLeft;
        if (inner){
          var paddingLeft = getNumericStyleProperty(style, "padding-left");
          x += paddingLeft;
        }
        inner = false;
    } while (e = e.offsetParent);
    return x;
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