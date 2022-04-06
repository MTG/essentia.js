// UTILS
self.log = function (msg) {
    console.info('audio-worker info:', msg);
};
self.error = function (msg) {
    throw Error(`audio-worker error: \n ${msg}`);
};

// INIT
import { Essentia, EssentiaWASM } from 'essentia.js';
log("Imports went OK");

self.essentia = null;
try {
    self.essentia = new Essentia(EssentiaWASM.EssentiaWASM);
} catch (err) { error(err) }

self.frameSize = 2048;
self.hopSize = 16384*2;

// COMMS
onmessage = function listenToMainThread(msg) {
    if (msg.data.shutdown) {
        cleanup();
        self.postMessage({shutdownFinished: true});
    }
    if (!msg.data.audioData) {
        error('Worker needs "audioData" property for processing');
        return;
    }

    const input = msg.data.audioData;

    self.postMessage({
        analysis: analyse(input)
    })
    delete msg.data.audioData;
};

function cleanup () {
    if (self.essentia) {
        self.essentia.shutdown();
        log('essentia was shutdown')
    }
    close();
    log('context closed')
}

// AUDIO FUNCS
function getMonoMix(track) {
    return track[0].map( (samp, idx) => (samp + track[1][idx]) * 0.5 );
}

function analyse (track) {
    const left = self.essentia.arrayToVector(track[0]);
    const right = self.essentia.arrayToVector(track[1]);

    // Cut frames
    console.time('frame-cutting');
    // const monoMixVector = self.essentia.MonoMixer(left, right).audio;
    // const monoMix = vectorToArray(monoMixVector);
    const monoMix = getMonoMix(track);
	const framesVector = self.essentia.FrameGenerator(monoMix, self.frameSize, self.hopSize);
    console.timeEnd('frame-cutting');

    // console.time('loudness');
    const monoMixVector = self.essentia.arrayToVector(monoMix);
    const loudness = getLoudness(left, right, monoMixVector);
    // console.timeEnd('loudness');

    const spectralSummary = spectralProfile(framesVector);

    left.delete();
    right.delete();
    framesVector.delete();
    monoMixVector.delete();

    return {
        loudness: loudness,
        phase: {
            correlation: phaseCorrelation(track[0], track[1])
        },
        spectralProfile: {
            integrated: spectralSummary
        }
    }
}

function median(arr){
    if(arr.length ===0) throw new Error("No inputs");
  
    arr.sort( (a,b) => a-b );

    const half = Math.floor(arr.length * 0.5);
    
    if (arr.length % 2) return arr[half];
    
    return (arr[half - 1] + arr[half]) * 0.5;
}

function getLoudness (left, right, mono) {
    let loudnessOut = self.essentia.LoudnessEBUR128(left, right);
    let rmsMono = self.essentia.RMS(mono).rms;
    // let rmsRight = self.essentia.RMS(right).rms;
    return {
        integrated: loudnessOut.integratedLoudness,
        range: loudnessOut.loudnessRange,
        momentary: Array.from(self.essentia.vectorToArray(loudnessOut.momentaryLoudness)),
        shortTerm: Array.from(self.essentia.vectorToArray(loudnessOut.shortTermLoudness)),
        rms: {
            mono: 20*Math.log10(rmsMono),
            // right: 20*Math.log10(rmsRight)
        }
    }
}

function phaseCorrelation (L, R) {
    // console.time('phase-correlation');
    // L and R are arrays
	const n = L.length;
	if (n == 0) return null;

	let sumL = 0,
		sumR = 0,
		sumLR = 0,
		sumL2 = 0,
		sumR2 = 0;
	

    // compute sums
    L.map( (leftSamp, idx) => {
        const rightSamp = R[idx];
        sumL += leftSamp;
        sumR += rightSamp;
        sumLR += leftSamp * rightSamp;
        sumL2 += leftSamp * leftSamp;
        sumR2 += rightSamp * rightSamp;
    })

    // console.timeEnd('phase-correlation');
	return (n * sumLR - sumL * sumR) / Math.sqrt((n * sumL2 - sumL * sumL) * (n * sumR2 - sumR * sumR));
}

function spectralProfile (framesVector) {
    const numFrames = framesVector.size();
    
    let spectralProfileFrameWise = [];
    // console.time('framewise-spectral');
	for (let f=0; f < numFrames; f++) {
        const frame = framesVector.get(f);
        spectralProfileFrameWise.push(getSpectrum(frame));
	}
    // console.timeEnd('framewise-spectral');
    // console.time('summary-spectral');
    let spectralProfileSummary = [];
    const numBins = spectralProfileFrameWise[0].length;

    for (let b=0; b < numBins; b++) {
        const binEnergies = spectralProfileFrameWise.map( currentFrame => {
            return currentFrame[b];
        });
        spectralProfileSummary.push(median(binEnergies));
    }
    // console.timeEnd('summary-spectral');
   
    spectralProfileFrameWise = null;
    return spectralProfileSummary;
}

function getSpectrum (monoFrame) {
    let chunkSize = monoFrame.size();
    const windowed = self.essentia.Windowing(monoFrame, true, chunkSize).frame;
    monoFrame.delete();
    const spectrum = self.essentia.Spectrum(windowed, chunkSize).spectrum;
    windowed.delete();
    const spectrumArray = self.essentia.vectorToArray(spectrum);
    spectrum.delete();
    
    return spectrumArray;
}