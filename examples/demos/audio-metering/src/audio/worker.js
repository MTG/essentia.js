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

function analyse (track) {
    const left = self.essentia.arrayToVector(track[0]);
    const right = self.essentia.arrayToVector(track[1]);

    // Cut frames
    // console.time('frame-cutting');
    // const monoMix = self.essentia.MonoMixer(left, right).audio;
    const monoMix = track[0].map( (samp, idx) => (samp + track[1][idx]) * 0.5 );
	const framesLeftVector = self.essentia.FrameGenerator(monoMix, self.frameSize, self.hopSize);
	// const framesRightVector = self.essentia.FrameGenerator(track[1], self.frameSize, self.hopSize);
    const leftLength = framesLeftVector.size();
    // const rightLength = framesRightVector.size();
    // console.timeEnd('frame-cutting');
    // check in case FrameGenerator produced one vector shorter than the other
    // const shortestVectorSize = leftLength > rightLength ? rightLength : leftLength;
    let spectralProfileFrameWise = [];
    // console.time('framewise-spectral');
	for (let f=0; f < leftLength; f++) {
        const leftFrame = framesLeftVector.get(f);
        // const rightFrame = framesRightVector.get(f);
        // another check in case the last frame exists for either L/R but not the other
        // if (!rightFrame || !leftFrame) break;
        spectralProfileFrameWise.push(spectralProfile(leftFrame));//, rightFrame));
	}
    // console.timeEnd('framewise-spectral');
    // console.time('summary-spectral');
    let spectralProfileSummary = [];

    for (let b=0; b < spectralProfileFrameWise[0].length; b++) {
        // const binSum = spectralProfileFrameWise.reduce(
        //     (sum, currentFrame) => sum + currentFrame[b],
        //     0
        // )
        // spectralProfileSummary.push(binSum / spectralProfileFrameWise.length);
        const binEnergies = spectralProfileFrameWise.map( currentFrame => {
            return currentFrame[b];
        });
        spectralProfileSummary.push(median(binEnergies));
    }
    // console.timeEnd('summary-spectral');
    // console.time('loudness');
    const loudness = getLoudness(left, right);
    // console.timeEnd('loudness');
    left.delete();
    right.delete();
    framesLeftVector.delete();
    spectralProfileFrameWise = null;
    // framesRightVector.delete();

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

function median(arr){
    if(arr.length ===0) throw new Error("No inputs");
  
    arr.sort( (a,b) => a-b );

    const half = Math.floor(arr.length * 0.5);
    
    if (arr.length % 2) return arr[half];
    
    return (arr[half - 1] + arr[half]) * 0.5;
}

function getLoudness (left, right) {
    let loudnessOut = self.essentia.LoudnessEBUR128(left, right);
    let rmsLeft = self.essentia.RMS(left).rms;
    let rmsRight = self.essentia.RMS(right).rms;
    return {
        integrated: loudnessOut.integratedLoudness,
        range: loudnessOut.loudnessRange,
        momentary: Array.from(self.essentia.vectorToArray(loudnessOut.momentaryLoudness)),
        shortTerm: Array.from(self.essentia.vectorToArray(loudnessOut.shortTermLoudness)),
        rms: {
            left: 20*Math.log10(rmsLeft),
            right: 20*Math.log10(rmsRight)
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

function spectralProfile (monoFrame) {
    let chunkSize = monoFrame.size();
    // console.time('Windowing');
    const windowed = self.essentia.Windowing(monoFrame, true, chunkSize).frame;
    // console.timeEnd('Windowing');
    monoFrame.delete();
    // console.time('spectrum');
    const spectrum = self.essentia.Spectrum(windowed, chunkSize).spectrum;
    // console.timeEnd('spectrum');
    windowed.delete();
    // const barkbands = self.essentia.BarkBands(spectrum).bands;
    // spectrum.delete();
    // const bandsArray = self.essentia.vectorToArray(barkbands);
    // barkbands.delete();
    // console.time('spectral:vectorToArray');
    const bandsArray = self.essentia.vectorToArray(spectrum);
    // console.timeEnd('spectral:vectorToArray');
    spectrum.delete();
    
    return bandsArray;
}
