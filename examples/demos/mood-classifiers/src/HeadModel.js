import modelsData from "../models/modelsData.js";

const ALLOWED_EMBEDDINGS = ['musicnn', 'effnet'];

export class HeadModelORT {
  constructor(modelURL, modelName, ort) {
    this.url = modelURL;
    this.name = modelName;
    this.isReady = false;
    this.session = null;
    this.ort = ort;
  }

  static create (modelName, ortModule) {
    const url = modelsData[modelName].url;
    const embeddingsSource = modelsData[modelName].embeddings;
    if (!ALLOWED_EMBEDDINGS.includes(embeddingsSource)) {
      throw Error("embeddingsSource should be one of these: musicnn / effnet");
    }
    return new this(url, modelName, ortModule);
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
      return {"modelName": this.name, "activations": ortOutputTensor["activations"]};
    }
    catch (err) {
      console.log(`${this.name} just failed with...`)
      console.trace(err)
    };
    // console.log(`${this.name} (${this.embeddingsSource}-based) activations: `, ortOutputTensor["activations"]);
  }
}