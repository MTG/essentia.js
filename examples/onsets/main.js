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
        this.waveformContainer = document.createElement('section');
        this.waveformContainer.setAttribute('id', 'waveform');
        this.playbackControlsElement = document.querySelector('#playback-controls').content.cloneNode(true).querySelector('div.controls');
        this.noOnsetsNoticeElement = document.querySelector('#no-onsets-notice').content.cloneNode(true).querySelector('div.notice');

        this.playbackControls = null;
        // wait these ms to send 'updateParams' cmd to audioWorker, in case user is still tweaking parameters
        this.interactionDelay = 2000;
        this.wavesurfer = null;
        this.initializeDropArea();

        // State
        this.waveformHasBeenLoaded = false;
        this.scrollPosition = 0;
        this.scrollFactor = 0.005;
        this.basePxPerSecond = null;
        this.pluginsAreInitialised = false;
        this.sliceRegions = [];

        this.noOnsetsNoticeIsShown = false;
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
            elem.checkbox.addEventListener('click', this.algoControlsHandler.bind(this));
            elem.addEventListener('change', this.algoControlsHandler.bind(this));
        });

        this.fftControlInputs.forEach((elem) => {
            elem.addEventListener('change', this.algoControlsHandler.bind(this))
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
            if (msg.data.length == 0) {
                console.info('empty onsets array');
                this.onsetPositions = [];
                if (!this.waveformHasBeenLoaded) {
                    this.toggleWaveformDisplay();
                }
                this.toggleNoOnsetsNotice('on');
            } else {
                this.onsetPositions = Array.from(msg.data);
                if (!this.waveformHasBeenLoaded) {
                    this.toggleWaveformDisplay();
                }
                if (this.noOnsetsNoticeIsShown) {
                    this.toggleNoOnsetsNotice('off');
                }
            }
            this.drawOnsets();
            this.addOnsetSlices();
        } else {
            throw TypeError("Worker failed. Analysis results should be of type Float32Array");
        }
    }

    algoControlsHandler (ev) {
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
            if (this.timeoutId) {
                clearTimeout(this.timeoutId);
            }
            this.timeoutId = setTimeout(this.sendToWorkerAfterTimeout.bind(this), this.interactionDelay, params);
        }
    }

    sendToWorkerAfterTimeout (params) {
        this.timeoutId = null;
        this.audioWorker.postMessage({
            request: 'updateParams',
            params: params
        });
    }

    toggleWaveformDisplay () {
        if (this.dropArea) {
            this.dropArea.remove();
        }

        this.algoControls.after(this.playbackControlsElement);
        this.algoControls.after(this.waveformContainer);

        this.wavesurfer = WaveSurfer.create({
            container: '#waveform',
            progressColor: '#F7AF39',
            waveColor: '#a16607',
            partialRender: true,
            plugins: [
                WaveSurfer.markers.create({
                    markers: []
                }),
                WaveSurfer.regions.create()
            ]
        });

        this.wavesurfer.loadBlob(this.audioFile);
        this.playbackControls = new PlaybackControls(this.wavesurfer);
        this.playbackControls.toggleEnabled(true);
        this.wavesurfer.on('plugin-initialised', () => this.pluginsAreInitialised = true);
        this.wavesurfer.on('ready', () => {
            if (this.onsetPositions) {
                this.drawOnsets();
                this.addOnsetSlices();
                this.basePxPerSecond = this.waveformContainer.clientWidth / this.wavesurfer.getDuration();
            }
        });

        this.waveformContainer.addEventListener('wheel', (ev) => {
            ev.preventDefault();
            const pixelMousePosition = this.wavesurfer.params.pixelRatio * (ev.pageX - mousePositionX(this.waveformContainer));
            const normalizedMousePosition = pixelMousePosition/this.waveformContainer.clientWidth;
            this.zoomWaveform(pixelMousePosition, ev.deltaY);
        });

        this.waveformHasBeenLoaded = true;
    }

    drawOnsets () {
        if (!this.pluginsAreInitialised) {
            this.wavesurfer.initPlugin('markers');
        }

        this.wavesurfer.clearMarkers();
        this.onsetPositions.forEach( (p) => this.wavesurfer.addMarker({ time: p, position: 'top' }) );
        this.wavesurfer.on('marker-click', (marker, ev) => {
            console.info(marker);
            console.info(ev);
        });
    }

    addOnsetSlices () {
        // generate region options from this.onsetPositions
        let slices = this.onsetPositions.map( (v, i) => {
            let endPos = this.onsetPositions[i+1];
            // if we're on the last onset, use audio track duration (end of file) as region end:
            if (endPos == undefined) { endPos = this.wavesurfer.getDuration(); }

            return {
                id: `slice-${i}`,
                start: v,
                end: endPos,
                drag: false,
                resize: false,
                color: "hsl(37 92% 70% / 0.2)"
            };
        });

        this.sliceRegions.map( (sr) => sr.remove() );
        this.sliceRegions = []; // clear existing regions, if any
        slices.forEach((s) => { this.sliceRegions.push(this.wavesurfer.addRegion(s)) });

        this.wavesurfer.on('region-click', (region, ev) => {
            ev.stopPropagation();
            region.play();
        })
    }

    zoomWaveform (xPos, scrollAmount) {
        this.scrollPosition += -1.5 * scrollAmount; // invert, like deprecated mousewheel event
        if (this.scrollPosition < 0) this.scrollPosition = 0;

        let pxPerSecond = Math.round( this.basePxPerSecond + Math.exp(this.scrollPosition * this.scrollFactor) ); // offset by wavesurfer's minPxPerSec
        if (pxPerSecond > 10000) { pxPerSecond = 10000 } // upper limit
        // console.log('scrollPosition', this.scrollPosition);
        // console.log('pxPerSecond', pxPerSecond);
        // console.log('xPos', xPos);
        this.wavesurfer.zoom(pxPerSecond);
        // this.wavesurfer.drawer.recenterOnPosition(xPos, true);
        this.wavesurfer.clearMarkers();
        this.drawOnsets();
    }

    toggleNoOnsetsNotice(state) {
        switch (state) {
            case 'on':
                this.noOnsetsNoticeIsShown = true;
                this.playbackControlsElement.after(this.noOnsetsNoticeElement);
                break;
        
            case 'off':
                this.noOnsetsNoticeIsShown = false;
                this.noOnsetsNoticeElement.remove()
                break;
        }
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
    window.onsetsApp = new OnsetsApp();
};