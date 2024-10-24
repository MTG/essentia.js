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
    // const inputTensorTypedArray = inputTensor.dataSync();
    // const ortInputTensor = new ort.Tensor('float32', inputTensorTypedArray);
    // console.log(`${this.name} input  tensor`, inputTensor);
    const ortOutputTensor = await this.session.run({"embeddings": inputTensor});
    // console.log(`${this.name} (${this.embeddingsSource}-based) activations: `, ortOutputTensor["activations"]);
    return {"modelName": this.name, "activations": ortOutputTensor["activations"]};
  }
}