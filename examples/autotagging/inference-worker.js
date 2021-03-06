// import { TensorflowMusiCNN } from "../../dist/essentia.js-model.es.js";
// import * as tf from "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs";

importScripts(
  "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs", 
  "./lib/essentia.js-model.umd.js"
);
const modelURL = "models/msd-musicnn-1/model.json"
const musiCNN = new EssentiaModel.TensorflowMusiCNN(tf, modelURL);

musiCNN.initialize().then(() => console.log("essentia-tfjs model ready..."));
console.log(`Using TF ${tf.getBackend()} backend`);

self.onmessage = e => {
  musiCNN.predict(e.data, true)
  .then((predictions) => self.postMessage(predictions));
  // post the predictions as message to the main thread
}   
