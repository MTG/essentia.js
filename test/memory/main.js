import { ready, FrameGenerator, Spectrum, MFCC, vectorToArray, SNR } from "/dist/essentia.js-core.es.js";
import { EssentiaWASM } from "/dist/essentia-wasm.es.js";

(async function main() {
  let frameGenOO, spectrumOO, mfccOO, snrOO;
  let initialised = false;

  function initMFCCAlgos() {
    ready(EssentiaWASM);
    console.log('essentia init successful');
    frameGenOO = new FrameGenerator(FRAME_SIZE, HOP_SIZE);
    spectrumOO = new Spectrum(FRAME_SIZE);
    mfccOO = new MFCC();
    initialised = true;
  }

  function initSNRAlgos() {
    ready(EssentiaWASM);
    console.log('essentia init successful');
    frameGenOO = new FrameGenerator(FRAME_SIZE, HOP_SIZE);
    snrOO = new SNR(0.95, 0.98, 0.9, FRAME_SIZE, -40, 44100, true);
    initialised = true;
  }

  const FRAME_SIZE = 2048;
  const HOP_SIZE = 1024;

  const ctx = new AudioContext();
  // flag to clean up memory (or not): should affect the number of HEAP resize msg shown on console
  let deleteObjects = false;
  let noiseTypedArray;
  let results = [];

  function createSourceArray() {
    // create random sound array
    let noiseArray = Array(ctx.sampleRate*60*5).fill(0).map( _ => Math.random()*2 - 1);
    noiseTypedArray = Float32Array.from( noiseArray );
    noiseArray = [];
    return
  }

  function getMFCC() {
    if (!initialised) initMFCCAlgos();

    const framesOO = frameGenOO.compute(noiseTypedArray);

    for (var i = 0; i < framesOO.size(); i++){
      const spectrumVector = spectrumOO.compute( framesOO.get(i) ).spectrum;
      const bandsVector = mfccOO.compute(spectrumVector).bands;
      results.push( vectorToArray(bandsVector) );
      if (deleteObjects) {
        spectrumVector.delete();
        bandsVector.delete()
      }
    }

    console.log("getMFCC done");
    
    if (deleteObjects) {
      framesOO.delete();
      frameGenOO.delete();
      spectrumOO.delete();
      mfccOO.delete();
      noiseTypedArray = [];
      results = [];
      console.log("getMFCC cleared objects");
      initialised = false;
    }
  }

  function getSNR() {
    if (!initialised) initSNRAlgos();

    const framesOO = frameGenOO.compute(noiseTypedArray);

    for (var i = 0; i < framesOO.size(); i++){
      const snrOut = snrOO.compute( framesOO.get(i) );
    }

    console.log("getSNR done");
    
    if (deleteObjects) {
      framesOO.delete();
      snrOO.delete();
      noiseTypedArray = [];
      results = [];
      console.log("getSNR cleared objects");
      initialised = false;
    }
  }

  // assign button listeners
  const launchButton = document.querySelector("#oop-launch-test");
  launchButton.addEventListener("click", () => {
    createSourceArray();
    // getMFCC();
    getSNR();
  });

  const clearMemCheckbox = document.querySelector("#oop-clear-objects");
  clearMemCheckbox.addEventListener("change", () => deleteObjects = clearMemCheckbox.checked );

})()