// UTILS
self.log = function (msg) {
    console.info('audio-worker info:', msg);
};
self.error = function (msg) {
    throw Error(`audio-worker error: \n ${msg}`);
};

const useExtractor = true;
// INIT
import { Essentia, EssentiaWASM } from 'essentia.js';
import { SpectralProfileWASM } from './spectralProfile.module.js';
log("Imports went OK");

self.frameSize = 2048;
self.hopSize = 32768; // equivalent to downsampling for spectral profile

self.essentia = null;
try {
    self.essentia = new Essentia(EssentiaWASM.EssentiaWASM);
} catch (err) { error(err) }


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

    const monoMix = getMonoMix(track);
    const monoMixVector = self.essentia.arrayToVector(monoMix);

    // console.time('loudness');
    const loudness = getLoudness(left, right, monoMixVector);
    // console.timeEnd('loudness');

    left.delete();
    right.delete();
    monoMixVector.delete();

    return {
        loudness: loudness,
        phase: {
            correlation: phaseCorrelation(track[0], track[1])
        },
        spectralProfile: {
            integrated: getSpectralProfile(monoMix)
        }
    }
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

function getSpectralProfile (monoMix) {
    const spectralExtractor = new SpectralProfileWASM.SpectralProfile(self.frameSize, self.hopSize, 'median');
    // arrayToVector implementations differ between essentia.js and custom extractors
    // spectralProfile only works with output from its own arrayToVector
    const spectralInputVector = SpectralProfileWASM.arrayToVector(monoMix);

    let spectralSummary = [];
    // console.time('spectral profile');
    // console.time('spectral compute');
    const spectralVector = spectralExtractor.compute(spectralInputVector);
    // console.timeEnd('spectral compute');
    for (let b = 0; b < spectralVector.size(); b++) {
        spectralSummary.push(spectralVector.get(b));
    }
    // console.timeEnd('spectral profile');
    spectralInputVector.delete();
    spectralExtractor.shutdown();
    return spectralSummary;
}