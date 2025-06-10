import modelsData from "../models/modelsData.js";
import { onnxBackend } from "./audioUtils.js";

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
    this.session = await this.ort.InferenceSession.create(this.url, { executionProviders: [onnxBackend], executionMode: "parallel" });
    // console.debug(`${this.name} session`, this.session);
    this.isReady = true;
  }

  async predict (inputTensor) {
    // console.log(`${this.name} predict has been called`);
    const ortOutputTensor = await this.session.run({"embeddings": inputTensor}); //, feeds)
    // console.log(`${this.name} completed successfully`, ortOutputTensor);
    return {"modelName": this.name, "activations": ortOutputTensor["activations"]};
    // console.log(`${this.name} (${this.embeddingsSource}-based) activations: `, ortOutputTensor["activations"]);
  }
}