// import { EssentiaWASM, EssentiaModel } from "essentia.js";

export default class MAEST {
  constructor (ortModule, modelUrl, externalData, patchSize) {
    this.ort = ortModule;
    this.url = modelUrl;
    this.externalData = externalData;

    this.patchSize = patchSize;
    this.numMelBands = 96;
    this.session = null;
  }
  
  async initialize () {
    console.info(`init: ${this.url}`);
    const sessionOpts = {
      // externalData: this.externalData,
      executionProviders: ["wasm"]
    }
    this.session = await this.ort.InferenceSession.create(this.url, sessionOpts);
    console.log(this.session);
  }

  async predict (melspectrogram) {
    if (!this.session) throw Error ('Effnet ORT session doesnt exist, please await .initialize() before calling predict');

    const embeddingsStartTime = Date.now();
    const numPatches = Math.ceil(melspectrogram.length / this.patchSize);
    const paddingSize = (numPatches * this.patchSize) - melspectrogram.length;
    const zerosMelspectrum = Array(this.numMelBands).fill(0);
    let padCounter = 0;
    while (padCounter < paddingSize) {
      melspectrogram.push(Float32Array.from(zerosMelspectrum));
      padCounter++;
    }

    const flattenedMelspectrogram = new Float32Array(melspectrogram.length * this.numMelBands);
    for (let f=0; f < melspectrogram.length; f++) {
      const melbandsFrame = melspectrogram[f];
      for (let b=0; b < melbandsFrame.length; b++) {
        const bandValue = melbandsFrame[b]
        flattenedMelspectrogram[f+b] = bandValue;
      }
    }

    const ortInputTensor = new this.ort.Tensor('float32', flattenedMelspectrogram, [numPatches, this.patchSize, this.numMelBands]);
    // console.debug('effnet shaped input tensor data (melspectrogram)', Array.from(ortInputTensor.data));
    const ortOutputTensor = await this.session.run({melspectrogram: ortInputTensor});
    console.info(`embeddings took ${Date.now() - embeddingsStartTime}ms`);

    console.log(`embeddings tensor for ${this.url}:`, ortOutputTensor);
    
    return ortOutputTensor.activations;
  }
}
