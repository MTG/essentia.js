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

    let spectralProfileFrameWise = [];

	for (let f=0; f<framesLeftVector.size(); f++) {
        const leftFrame = framesLeftVector.get(f);
        const rightFrame = framesRightVector.get(f);
        spectralProfileFrameWise.push(spectralProfile(leftFrame, rightFrame));
	}

    return {
        loudness: getLoudness(left, right),
        phaseCorrelation: {
            integrated: phaseCorrelation(track[0], track[1]),
        },
        spectralProfile: {
            momentary: spectralProfileFrameWise
        }
    }
}

function getLoudness (left, right) {
    let loudnessOut = self.essentia.LoudnessEBUR128(left, right);
    return {
        integrated: loudnessOut.integratedLoudness,
        range: loudnessOut.loudnessRange,
        momentary: self.essentia.vectorToArray(loudnessOut.momentaryLoudness),
        shortTerm: self.essentia.vectorToArray(loudnessOut.shortTermLoudness),
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
    // if (chunkSize % 2 != 0) {
    //     chunkSize--;
    //     frame = frame.slice(0, -1);
    // }

    // console.info({chunkSize});
    // const frameVector = self.essentia.arrayToVector(frame);
    // let monoStart = Date.now();
    const monoMix = self.essentia.MonoMixer(left, right).audio;
    // console.log(`MonoMix took: ${0.001 * (Date.now() - monoStart)} sec`);
    // windowing
    // let windowStart = Date.now();
    const windowed = self.essentia.Windowing(monoMix, true, chunkSize).frame;
    // console.log(`Windowing took: ${0.001 * (Date.now() - windowStart)} sec`);
    monoMix.delete();
    // spectrum
    // let spectrumStart = Date.now();
    const spectrum = self.essentia.Spectrum(windowed, chunkSize).spectrum;
    // console.log(`Spectrum took: ${0.001 * (Date.now() - spectrumStart)} sec`);
    windowed.delete();
    // ERBBands
    // let erbStart = Date.now();
    // const erbbands = self.essentia.ERBBands(spectrum, 22050, spectrum.size(), 50).bands;
    // console.log(`ERBBands took: ${0.001 * (Date.now() - erbStart)} sec`);

    // let melStart = Date.now();
    // const melbands = self.essentia.MelBands(spectrum, 22050, spectrum.size(), 50).bands;
    // console.log(`MelBands took: ${0.001 * (Date.now() - melStart)} sec`);

    // let barkStart = Date.now();
    const barkbands = self.essentia.BarkBands(spectrum).bands;
    // console.log(`BarkBands took: ${0.001 * (Date.now() - barkStart)} sec`);

    spectrum.delete();
    const bandsArray = self.essentia.vectorToArray(barkbands);
    barkbands.delete();
    return bandsArray;
}
