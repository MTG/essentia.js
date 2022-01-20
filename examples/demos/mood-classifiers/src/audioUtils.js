function preprocess (audioBuffer) {
    if (audioBuffer instanceof AudioBuffer) {
        const mono = monomix(audioBuffer);
        // downmix to mono, and downsample to 16kHz sr for essentia tensorflow models
        return downsampleArray(mono, audioBuffer.sampleRate, 16000);
    } else {
        throw new TypeError("Input to audio preprocessing is not of type AudioBuffer");
    }
}

function monomix(buffer) {
    // downmix to mono
    let monoAudio;
    if (buffer.numberOfChannels > 1) {
        console.log('mixing down to mono...');
        const leftCh = buffer.getChannelData(0);
        const rightCh = buffer.getChannelData(1);
        monoAudio = leftCh.map( (sample, i) => 0.5 * (sample + rightCh[i]) );
    } else {
        monoAudio = buffer.getChannelData(0);
    }

    return monoAudio;
}

function downsampleArray(audioIn, sampleRateIn, sampleRateOut) {
    if (sampleRateOut === sampleRateIn) {
      return audioIn;
    }
    let sampleRateRatio = sampleRateIn / sampleRateOut;
    let newLength = Math.round(audioIn.length / sampleRateRatio);
    let result = new Float32Array(newLength);
    let offsetResult = 0;
    let offsetAudioIn = 0;

    console.log(`Downsampling to ${sampleRateOut} kHz...`);
    while (offsetResult < result.length) {
        let nextOffsetAudioIn = Math.round((offsetResult + 1) * sampleRateRatio);
        let accum = 0,
            count = 0;
        for (let i = offsetAudioIn; i < nextOffsetAudioIn && i < audioIn.length; i++) {
            accum += audioIn[i];
            count++;
        }
        result[offsetResult] = accum / count;
        offsetResult++;
        offsetAudioIn = nextOffsetAudioIn;
    }

    return result;
}


function shortenAudio (audioIn, keepRatio=0.5, trim=false) {
    /* 
        keepRatio applied after discarding start and end (if trim == true)
    */
    if (keepRatio < 0.15) {
        keepRatio = 0.15 // must keep at least 15% of the file
    } else if (keepRatio > 0.66) {
        keepRatio = 0.66 // will keep at most 2/3 of the file
    }

    if (trim) {
        const discardSamples = Math.floor(0.1 * audioIn.length); // discard 10% on beginning and end
        audioIn = audioIn.subarray(discardSamples, audioIn.length - discardSamples); // create new view of buffer without beginning and end
    }

    const ratioSampleLength = Math.ceil(audioIn.length * keepRatio);
    const patchSampleLength = 187 * 256; // cut into patchSize chunks so there's no weird jumps in audio
    const numPatchesToKeep = Math.ceil(ratioSampleLength / patchSampleLength);

    // space patchesToKeep evenly
    const skipSize = Math.floor( (audioIn.length - ratioSampleLength) / (numPatchesToKeep - 1) );

    let audioOut = [];
    let startIndex = 0;
    for (let i = 0; i < numPatchesToKeep; i++) {
        let endIndex = startIndex + patchSampleLength;
        let chunk = audioIn.slice(startIndex, endIndex);
        audioOut.push(...chunk);
        startIndex = endIndex + skipSize; // discard even space
    }

    return Float32Array.from(audioOut);
}

export { preprocess, shortenAudio };
