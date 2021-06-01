self.log = function (msg) {
    console.info('audio-worker info:', msg);
};
self.error = function (msg) {
    console.info('audio-worker error:', msg);
};

importScripts('./lib/essentia-wasm.module.js', './lib/essentia.js-core.umd.js');
log("Imports went OK");

try {
    self.essentia = new Essentia(EssentiaWASM);
} catch (err) { error(err) }

onmessage = function (msg) {
    switch (msg.request) {
        case 'processFile':
            
            break;
    
        default:
            break;
    }
}


// AUDIO FUNCS
function processFileUpload(files) {
    if (files.length > 1) {
        alert("Only single-file uploads are supported currently");
        throw Error("Multiple file upload attempted, cannot process.");
    } else if (files.length) {
        files[0].arrayBuffer().then((ab) => {
            decodeFile(ab);
            wavesurfer = toggleUploadDisplayHTML('display');
            wavesurfer.loadBlob(files[0]);
            controls = new PlaybackControls(wavesurfer);
            controls.toggleEnabled(false);
        })
    }
}

function decodeFile(arrayBuffer) {
    audioCtx.resume().then(() => {
        audioCtx.decodeAudioData(arrayBuffer).then(async function handleDecodedAudio(audioBuffer) {
            console.info("Done decoding audio!");
            
            toggleLoader();
            
            const prepocessedAudio = preprocess(audioBuffer);
            await audioCtx.suspend();

            if (essentia) {
                essentiaAnalysis = computeKeyBPM(prepocessedAudio);
            }

            // reduce amount of audio to analyse
            let audioData = shortenAudio(prepocessedAudio, KEEP_PERCENTAGE, true); // <-- TRIMMED start/end

            audioData = null;
        })
    })
}


/* 
    essentia.getAudioBufferFromURL.then
    signal = new Float32Array(audioBuffer)
    frames = essentia.FrameGenerator(signal, frameSize, hopSize)
    for (var i = 0; i < frames.size(); i++) {
        mag, phase = cartesianToPolar(FFT(essentia.Windowing(frames.get(i))))
        
    }
    frames.delete();
*/