// import { TensorflowMusiCNN } from "../../dist/essentia.js-model.es.js";
// import * as tf from "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs";

importScripts(
  "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs", 
  "../../dist/essentia.js-model.umd.js"
);

const modelURL = "../../models/msd-musicnn-1/model.json"
const musiCNN = new EssentiaModel.TensorflowMusiCNN(tf, modelURL);

musiCNN.initialize().then(() => console.log("tjs model ready..."));

self.onmessage = e => {
  musiCNN.predict(e.data, true)
  .then((predictions) => self.postMessage(predictions));
  // post the predictions as message to the main thread
}   
