import modelsData from "../models/modelsData.js";

const ALLOWED_EMBEDDINGS = ['musicnn', 'effnet'];

export class HeadModelORT {
  constructor(modelURL, embeddingsSource, modelName, ort) {
    this.url = modelURL;
    this.name = modelName;
    this.isReady = false;
    this.session = null;
    this.embeddingsSource = embeddingsSource;
    this.ort = ort;
  }

  static create (modelName, embeddingsSource, ortModule) {
    if (!ALLOWED_EMBEDDINGS.includes(embeddingsSource)) {
      throw Error("embeddingsSource should be one of these: musicnn / effnet");
    }
    const url = modelsData.heads[modelName].url[embeddingsSource];
    return new this(url, embeddingsSource, modelName, ortModule);
  }

  async initialize () {
    this.session = await this.ort.InferenceSession.create(this.url, { executionProviders: ['wasm'] });
    console.debug(`${this.name} session`, this.session);
    this.isReady = true;
  }

  async predict (inputTensor) {
    // const numBatches = inputTensor.dims[0];
    // const numOutputValues = ["engagement", "approachability"].includes(this.name) ? 1 : 2;
    // const outputDataShape = [numBatches, numOutputValues];
    // // console.log(outputDataShape);
    // const outputDataTensor = Float32Array.from(Array(numBatches*numOutputValues).fill(0));
    // const outputTensor = new this.ort.Tensor('float32', outputDataTensor, outputDataShape);
    // let feeds = undefined;
    // if (["engagement", "approachability", "danceability"].includes(this.name)) {
    //   feeds = {"activations": outputTensor};
    // }
    try {
      const ortOutputTensor = await this.session.run({"embeddings": inputTensor}); //, feeds)
      console.log(`${this.name} completed successfully`, ortOutputTensor);
      return {"modelName": this.name, "activations": ortOutputTensor};
    }
    catch (err) {
      console.log(`${this.name} just failed with...`)
      console.trace(err)
    };
    // console.log(`${this.name} (${this.embeddingsSource}-based) activations: `, ortOutputTensor["activations"]);
  }
}