// import { EssentiaWASM } from './lib/essentia-wasm.module.js';
// import Essentia from './lib/essentia.js-core.es.js';

let essentia;

EssentiaWASM().then((wasmModule) => {
    essentia = new Essentia(wasmModule);
}).catch((err) => console.error('There was an error loading the Essentia WASM backend: \n', err));

/* 
    essentia.getAudioBufferFromURL.then
    signal = new Float32Array(audioBuffer)
    frames = essentia.FrameGenerator(signal, frameSize, hopSize)
    for (var i = 0; i < frames.size(); i++) {
        mag, phase = cartesianToPolar(FFT(essentia.Windowing(frames.get(i))))
        
    }
    frames.delete();
*/
