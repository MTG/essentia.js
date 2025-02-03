import Essentia from "https://cdn.jsdelivr.net/npm/essentia.js@0.1.3/dist/essentia.js-core.es.js";
import { EssentiaWASM } from "https://cdn.jsdelivr.net/npm/essentia.js@0.1.3/dist/essentia-wasm.es.js"

(async function main() {
  const essentia = new Essentia(EssentiaWASM);
  console.log('loaded essentia web');

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
    return;
  }

  function getMFCC() {
    
    const frames = essentia.FrameGenerator(noiseTypedArray, FRAME_SIZE, HOP_SIZE);

    for (var i = 0; i < frames.size(); i++){
      const spectrumVector = essentia.Spectrum( frames.get(i) ).spectrum
      const bandsVector = essentia.MFCC( spectrumVector ).bands;
      results.push( essentia.vectorToArray(bandsVector) );
      if (deleteObjects) {
        spectrumVector.delete();
        bandsVector.delete()
      }
    }

    console.log("getMFCC done");
    
    if (deleteObjects) {
      frames.delete();
      noiseTypedArray = [];
      results = [];
      console.log("getMFCC cleared objects");
    }
  }

  // assign button listeners
  const launchButton = document.querySelector("#std-launch-test");
  launchButton.addEventListener("click", () => {
    createSourceArray();
    getMFCC();
  });

  const clearMemCheckbox = document.querySelector("#std-clear-objects");
  clearMemCheckbox.addEventListener("change", () => deleteObjects = clearMemCheckbox.checked );

})()