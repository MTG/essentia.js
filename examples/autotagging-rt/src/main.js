const toggleAudio = document.getElementById('toggle-audio');
const audioCtxOptions = {
    sampleRate: 16000
};

// audio globals
let gumStream;
let AudioContext;
let audioCtx;
let mic;
let gain;
let featureExtractorNode;

let inferenceWorker;
let workerToWorkletPort;
let predictionStore = new PredictionStore;

async function URLFromFile(file) {
    const response = await fetch(file);
    const text = await response.text();
    const blob = new Blob([text], {type: "application/javascript"});
    return URL.createObjectURL(blob);
}

async function createAudioProcessor(audioContext) {
    try {
        await audioContext.resume();
        // let url = await URLFromFile("./src/feature-extract-processor.js");
        // let url = './build/processor.js';
        let url = './src/feature-extract-processor.js';
        await audioContext.audioWorklet.addModule(url);
    } catch(e) {
        console.log('There was an error loading the worklet processor:\n', e);
        return null;
    }
  
    return new AudioWorkletNode(audioContext, "feature-extract-processor");
}

function createInferenceWorker() {
    inferenceWorker = new Worker('./src/inference-worker.js');
    inferenceWorker.onmessage = function listenToWorker(msg) {
        if (msg.data.port) {
            // listen out for port transfer
            workerToWorkletPort = msg.data.port;
            console.log("Received port from worker\n", workerToWorkletPort);
            start();
        } else if (msg.data.predictions) {
            // listen out for model output
            activateTagVisualizers(msg.data.predictions);
            predictionStore.accumFrame(msg.data.predictions);
        }
    };
}

function start() {
    // let grid = document.querySelector('#matrix');
    // grid.classList.toggle('overlay');
    if (navigator.mediaDevices.getUserMedia) {
        console.log("Initializing audio...");

        // console.log('Supported constraints: ', navigator.mediaDevices.getSupportedConstraints());

        navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        .then(startAudioProcessing)
        .catch(function(message) {
            throw "Could not access microphone - " + message;
        });
    } else {
        throw "Could not access microphone - getUserMedia not available";
    }
}

async function startAudioProcessing(stream) {
    gumStream = stream;

    let audioTracks = gumStream.getAudioTracks();
    audioTracks.forEach((t) => {
        console.log('MediaStream constraints are: ', t.getSettings());
    })

    if (gumStream.active) {
        if (audioCtx.state == "closed") {
            audioCtx = new AudioContext(audioCtxOptions);
        }
        else if (audioCtx.state == "suspended") {
            audioCtx.resume();
        }

        try {
            mic = audioCtx.createMediaStreamSource(gumStream);          
            gain = audioCtx.createGain();
            gain.gain.setValueAtTime(0, audioCtx.currentTime);
            featureExtractorNode = await createAudioProcessor(audioCtx);

            featureExtractorNode.port.postMessage({
                port: workerToWorkletPort
            }, [workerToWorkletPort]);

            try {
                mic.connect(featureExtractorNode);
                featureExtractorNode.connect(gain);
                gain.connect(audioCtx.destination);
            } catch(e) {
                console.log(`There was a problem connecting the audio graph \n ${e}`);
            }

            // set button to stop
            toggleAudio.classList.toggle('recording');
            toggleAudio.innerHTML = 'Stop';
            toggleAudio.disabled = false;
        } catch(e) {
            alert("Due to sample rate requirements, this demo cannot run on Firefox. Please, try a Chromium-based browser instead.");
        }
    } else {
        throw "Mic stream not active";
    }
}

function stop() {
    // stop mic stream
    gumStream.getAudioTracks().forEach(function(track) {
        track.stop();
        gumStream.removeTrack(track);
    });

    audioCtx.close().then(function() {
        // manage button state
        toggleAudio.classList.toggle('recording');
        toggleAudio.innerHTML = 'Start Autotagging';
        
        // disconnect nodes
        mic.disconnect();
        featureExtractorNode.disconnect();
        gain.disconnect();
        mic = undefined; 
        featureExtractorNode = undefined; 
        gain = undefined;

        console.log('Stopped mic stream ...');
    });

    inferenceWorker = undefined;
    workerToWorkletPort = undefined;

    let averagePreds = predictionStore.getAverages();
    // console.info(predictionStore);
    for (tag in averagePreds) {
        const elem = document.querySelector(`[name="${tag}"]`);
        const logActivation = 1 + Math.log10(averagePreds[tag] + Number.MIN_VALUE)*0.8;
        elem.setActivation(logActivation, 0.1);
    }
    predictionStore.reset();
    // resetTagVisualizers();
}

function activateTagVisualizers(predictions) {
    for (tag in predictions) {
        let tagVizElem = document.querySelector(`[name="${tag}"]`);
        tagVizElem.setActivation(predictions[tag], 0.75);
    }
}

function resetTagVisualizers() {
    // let grid = document.querySelector('#matrix');
    // grid.classList.toggle('overlay');
    for (elem of document.querySelectorAll('music-tag-viz')) {
        elem.reset();
    }
}


function main() {
    try {
        AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext(audioCtxOptions);
    } catch (e) {
        throw 'Could not instantiate AudioContext: ' + e.message;
    }

    toggleAudio.addEventListener('click', function buttonClickHandler() {
        let recording = this.classList.contains('recording');
        if (!recording) {
            this.disabled = true;
            createInferenceWorker(); // and then start
        } else {
            stop();
        }
    });

}

main();