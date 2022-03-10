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

self.frameSize = 4096;
self.hopSize = 2048;

// COMMS
onmessage = function leftSampstenToMainThread(msg) {
    if (!msg.data.audioData) {
        error('Worker needs "audioData" property for processing');
        return;
    }

    const input = msg.data.audioData;

    self.postMessage({
        analysis: analyse(input)
    })
};



// AUDIO FUNCS

function analyse (track) {
    const left = self.essentia.arrayToVector(track[0]);
    const right = self.essentia.arrayToVector(track[1]);

    // Cut frames
	const framesLeftVector = self.essentia.FrameGenerator(track[0], self.frameSize, self.hopSize);
	const framesRightVector = self.essentia.FrameGenerator(track[1], self.frameSize, self.hopSize);
    const leftLength = framesLeftVector.size();
    const rightLength = framesRightVector.size();
    // check in case FrameGenerator produced one vector shorter than the other
    const shortestVectorSize = leftLength > rightLength ? rightLength : leftLength;
    let spectralProfileFrameWise = [];

	for (let f=0; f < shortestVectorSize; f++) {
        const leftFrame = framesLeftVector.get(f);
        const rightFrame = framesRightVector.get(f);
        // another check in case the last frame exists for either L/R but not the other
        if (!rightFrame || !leftFrame) break;
        spectralProfileFrameWise.push(spectralProfile(leftFrame, rightFrame));
	}

    let spectralProfileSummary = [];

    for (let b=0; b < spectralProfileFrameWise[0].length; b++) {
        let binSum = spectralProfileFrameWise.reduce(
            (sum, currentFrame) => sum + currentFrame[b],
            0
        )
        spectralProfileSummary.push(binSum / spectralProfileFrameWise.length);
    }

    const loudness = getLoudness(left, right);

    left.delete();
    right.delete();
    framesLeftVector.delete();
    framesRightVector.delete();

    return {
        loudness: loudness,
        phase: {
            correlation: phaseCorrelation(track[0], track[1])
        },
        spectralProfile: {
            integrated: spectralProfileSummary
        }
    }
}

function getLoudness (left, right) {
    let loudnessOut = self.essentia.LoudnessEBUR128(left, right);
    return {
        integrated: loudnessOut.integratedLoudness,
        range: loudnessOut.loudnessRange,
        momentary: Array.from(self.essentia.vectorToArray(loudnessOut.momentaryLoudness)),
        shortTerm: Array.from(self.essentia.vectorToArray(loudnessOut.shortTermLoudness)),
    }
}

function phaseCorrelation (L, R) {
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

	return (n * sumLR - sumL * sumR) / Math.sqrt((n * sumL2 - sumL * sumL) * (n * sumR2 - sumR * sumR));
}

function spectralProfile (left, right) {
    let chunkSize = left.size();

    const monoMix = self.essentia.MonoMixer(left, right).audio;
    const windowed = self.essentia.Windowing(monoMix, true, chunkSize).frame;
    monoMix.delete();
    const spectrum = self.essentia.Spectrum(windowed, chunkSize).spectrum;
    windowed.delete();
    // const barkbands = self.essentia.BarkBands(spectrum).bands;
    // spectrum.delete();
    // const bandsArray = self.essentia.vectorToArray(barkbands);
    // barkbands.delete();
    const bandsArray = self.essentia.vectorToArray(spectrum);
    spectrum.delete();
    
    return bandsArray;
}
