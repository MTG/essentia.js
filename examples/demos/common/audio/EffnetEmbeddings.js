import { onnxBackend } from "./audioUtils.js";
import { EssentiaWASM } from "./lib/essentia-custom-extractor.module.js";
// import { EssentiaWASM, EssentiaModel } from "essentia.js";

EssentiaWASM.init();

export default class EffnetMusicnnEmbeddings {
  static #tfInputMusiCNN = new EssentiaWASM.ObjectOrientedTFInputMusiCNN();
  static #frameSize = 512;
  static #hopSize = Math.floor(this.#frameSize / 2);

  constructor (ortModule, modelUrl, patchSize) {
    this.ort = ortModule;
    this.url = modelUrl;

    this.patchSize = patchSize;
    this.session = null;
    this.numMelBands = 96;
  }
  
  async initialize () {
    console.info(`init: ${this.url}`);
    this.session = await this.ort.InferenceSession.create(this.url, { executionProviders: [onnxBackend] });
    console.log(this.session);
  }

  static computeSpectrogram(audio) {
    // const melspectrogramStart = Date.now();
    const frames = EssentiaWASM.FrameGenerator(audio, EffnetMusicnnEmbeddings.#frameSize, EffnetMusicnnEmbeddings.#hopSize);
    const melspectrogram = [];
    for (let i=0; i < frames.size(); i++) {
      const bandsVector = EffnetMusicnnEmbeddings.#tfInputMusiCNN.compute(frames.get(i));
      melspectrogram.push(EssentiaWASM.vect2ArrayCpp(bandsVector));
    }

    // const melspectrogram = this.tfInputMusiCNN.computeFrameWise(audio, this.hopSize).melSpectrum;
    return melspectrogram;
    // console.info(`melspectrogram took ${Date.now() - melspectrogramStart}ms`);
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
        const offset = f * this.numMelBands;
        const bandValue = melbandsFrame[b]
        flattenedMelspectrogram[offset+b] = bandValue;
      }
    }

    const ortInputTensor = new this.ort.Tensor('float32', flattenedMelspectrogram, [numPatches, this.patchSize, this.numMelBands]);
    // console.debug('effnet shaped input tensor data (melspectrogram)', Array.from(ortInputTensor.data));
    const ortOutputTensor = await this.session.run({melspectrogram: ortInputTensor});
    console.info(`embeddings took ${Date.now() - embeddingsStartTime}ms`);

    console.log(`embeddings tensor for ${this.url}:`, ortOutputTensor);
    
    return ortOutputTensor.embeddings;
  }
}
