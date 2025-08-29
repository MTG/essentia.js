// import { TensorflowMusiCNN } from "../../dist/essentia.js-model.es.js";
// import * as tf from "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs";

importScripts(
  "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs", 
  "https://cdn.jsdelivr.net/npm/essentia.js@0.1.3/dist/essentia.js-model.umd.js"
);
const modelURL = "model.json";
const playgroundSandboxUrl = location.href;


class TestMusicnn extends EssentiaModel.TensorflowMusiCNN {
  constructor(tfjs, modelPath) {
    super(tfjs, modelPath);
  }

  async initialize() {
    this.model = await this.tf.loadGraphModel(this.modelPath, {
      weightUrlConverter: async (filename) => {
        return new Promise((resolve) => {
          const brokenUrl = playgroundSandboxUrl.split('/');
          brokenUrl.pop();
          brokenUrl.push(filename);
          const newUrl = brokenUrl.join('/');
          resolve(newUrl);
        });
      }
    });
    this.isReady = true;
  }
}
const musiCNN = new TestMusicnn(tf, modelURL);

musiCNN.initialize()
       .then(() => console.log("essentia-tfjs model ready..."))
       .catch( err => console.error(err));
console.log(`Using TF ${tf.getBackend()} backend`);

self.onmessage = e => {
  musiCNN.predict(e.data, true)
  .then((predictions) => self.postMessage(predictions));
  // post the predictions as message to the main thread
}   
