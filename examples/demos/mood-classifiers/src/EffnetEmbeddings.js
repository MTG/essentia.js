import { EssentiaModel } from "essentia.js";
import modelUrl from '../models/effnet-based/discogs-effnet-bsdynamic-1.onnx?url';


export default class EffnetEmbeddings {
  /*
  */
  constructor (essentiaWasm, ortModule) {
    this.ort = ortModule;
    this.url = modelUrl;
    this.tfInputMusiCNN = new EssentiaModel.EssentiaTFInputExtractor(essentiaWasm, "musicnn", true);
    this.frameSize = this.tfInputMusiCNN.frameSize;
    this.hopSize = Math.floor(this.frameSize / 2);
    console.log(this.tfInputMusiCNN);

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
    const melspectrogram = this.tfInputMusiCNN.computeFrameWise(audio, this.hopSize).melSpectrum;
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
