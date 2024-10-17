import { EssentiaWASM } from "./lib/essentia-custom-extractor.module.js";
import modelUrl from '../models/effnet-based/discogs-effnet-bsdynamic-1.onnx?url';

EssentiaWASM.init();

export default class EffnetEmbeddings {
  /*
  */
  constructor (ortModule) {
    this.ort = ortModule;
    this.url = modelUrl;
    this.tfInputMusiCNN = new EssentiaWASM.ObjectOrientedTFInputMusiCNN();
    this.frameSize = 512;
    this.hopSize = Math.floor(this.frameSize / 2);

    this.patchSize = 128;
    this.session = null;
    this.numMelBands = 96;
  }
  
  async initialize () {
    // console.log('effnet init')
    this.session = await this.ort.InferenceSession.create(this.url, { executionProviders: ['wasm'] });
  }

  async predict (audio) {
    const melspectrogramStart = Date.now();
    if (!this.session) throw Error ('Effnet ORT session doesnt exist, please await .initialize() before calling predict');
    // console.log('audio for embeddings', audio);
    const frames = EssentiaWASM.FrameGenerator(audio, this.frameSize, this.hopSize);
    const melspectrogram = [];
    for (let i=0; i < frames.size(); i++) {
      const bandsVector = this.tfInputMusiCNN.compute(frames.get(i));
      melspectrogram.push(EssentiaWASM.vect2ArrayCpp(bandsVector));
    }
    console.log(`melspectrogram took ${Date.now() - melspectrogramStart}ms`);

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
    for (let f of melspectrogram) {
      f.forEach( (bandValue, i) => flattenedMelspectrogram[i] = bandValue);
    }

    const ortInputTensor = new this.ort.Tensor('float32', flattenedMelspectrogram, [numPatches, this.patchSize, this.numMelBands]);
    // console.log('effnet shaped input tensor', ortInputTensor);
    const ortOutputTensor = await this.session.run({melspectrogram: ortInputTensor});
    console.log(`embeddings took ${Date.now() - embeddingsStartTime}ms`);
    
    return ortOutputTensor.embeddings;
  }
}
