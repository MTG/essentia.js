import { onnxBackend } from "./audioUtils.js";

const feedNames = {
  "genre_discogs": {
    inputName: "serving_default_model_Placeholder:0",
    outputName: "PartitionedCall:0"
  },
  "mtt": {
    inputName: "embeddings",
    outputName: "activations"
  }
}

export class HeadModelORT {
  constructor(modelURL, modelName, ort) {
    this.url = modelURL;
    this.name = modelName;
    this.isReady = false;
    this.session = null;
    this.ort = ort;
  }

  static create (modelData, ortModule) {
    const url = modelData.url;
    return new this(url, modelData.name, ortModule);
  }

  async initialize () {
    this.session = await this.ort.InferenceSession.create(this.url, { executionProviders: [onnxBackend], executionMode: "parallel" });
    console.debug(`${this.name} session`, this.session);
    this.isReady = true;
  }

  async predict (inputTensor) {
    // console.log(`${this.name} predict has been called`);
    const ortOutputTensor = await this.session.run({[feedNames[this.name].inputName]: inputTensor}); //, feeds)
    // console.log(`${this.name} completed successfully`, ortOutputTensor);
    return {"modelName": this.name, "activations": ortOutputTensor[feedNames[this.name].outputName]};
    // console.log(`${this.name} (${this.embeddingsSource}-based) activations: `, ortOutputTensor["activations"]);
  }
}