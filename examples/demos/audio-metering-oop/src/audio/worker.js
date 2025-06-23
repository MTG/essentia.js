// UTILS
self.log = function (msg) {
    console.info('audio-worker info:', msg);
};
self.error = function (msg) {
    throw Error(`audio-worker error: \n ${msg}`);
};

// INIT
import {EssentiaWASM} from './essentia-wasm.es.js'
import { ready, RMS, LoudnessEBUR128, BinaryOperator, arrayToVector, vectorToArray } from './essentia.js-core.es.js';
import { SpectralProfileWASM } from './spectralProfile2.module.js';

self.frameSize = 2048;
self.hopSize = 32768; // equivalent to downsampling for spectral profile

try {
    ready(EssentiaWASM);
} catch (err) { error(err) }


// COMMS
onmessage = function listenToMainThread(msg) {
    if (msg.data.shutdown) {
        close();
        log('context closed');
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

function cleanup (cppObjectsArray) {
    for (let obj of cppObjectsArray) {
        obj.delete();
    }
}

// AUDIO FUNCS
function getMonoMix(track) {
    return track[0].map( (samp, idx) => (samp + track[1][idx]) * 0.5 );
}

function analyse (track) {
    const left = arrayToVector(track[0]);
    const right = arrayToVector(track[1]);

    const monoMix = getMonoMix(track);
    const monoMixVector = arrayToVector(monoMix);

    console.time('loudness');
    const loudness = getLoudness(left, right, monoMixVector);
    console.timeEnd('loudness');

    cleanup([left, right, monoMixVector]);

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
    const loudnessEBUR128 = new LoudnessEBUR128();
    const rms = new RMS();

    let loudnessOut = loudnessEBUR128.compute(left, right);
    let rmsMono = rms.compute(mono).rms;

    const result = {
        integrated: loudnessOut.integratedLoudness,
        range: loudnessOut.loudnessRange,
        momentary: Array.from(vectorToArray(loudnessOut.momentaryLoudness)),
        shortTerm: Array.from(vectorToArray(loudnessOut.shortTermLoudness)),
        rms: {
            mono: 20*Math.log10(rmsMono),
            // right: 20*Math.log10(rmsRight)
        }
    }

    cleanup([loudnessEBUR128, rms, loudnessOut.momentaryLoudness, loudnessOut.shortTermLoudness]);
    
    return result;
}

function accumVector(vec) {
    let accum = 0;
    for (let i = 0; i < vec.size(); i++) {
        accum += vec.get(i);
    }
    return accum;
}

function phaseCorrelation (L, R) {
    console.time('phase-correlation');
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

    console.timeEnd('phase-correlation');
	return (n * sumLR - sumL * sumR) / Math.sqrt((n * sumL2 - sumL * sumL) * (n * sumR2 - sumR * sumR));
}

function getSpectralProfile (monoMix) {
    console.time('spectral-profile');

    const spectralExtractor = new SpectralProfileWASM.SpectralProfile(self.frameSize, self.hopSize, 'median');
    // arrayToVector implementations differ between essentia.js and custom extractors
    // spectralProfile only works with output from its own arrayToVector
    const spectralInputVector = SpectralProfileWASM.arrayToVector(monoMix);

    const spectralVector = spectralExtractor.compute(spectralInputVector);

    let spectralSummary = Array.from(SpectralProfileWASM.vectorToArrayCpp(spectralVector));

    spectralInputVector.delete();
    spectralExtractor.shutdown();
    console.timeEnd('spectral-profile');
    return spectralSummary;
}