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
  
  async predict(inputFeature, zeroPadding) {

    let featureTensor = this.arrayToTensorAsBatches(
      inputFeature.melSpectrum, 
      [inputFeature.frameSize, inputFeature.melBandsSize], 
      inputFeature.patchSize,
      zeroPadding
    );
    // Get default model input variables
    let modelInputs = this.disambiguateExtraInputs();
    // add the input feature tensor to the model inputs
    modelInputs.push(featureTensor);
    // Run inference
    let results = this.model.execute(modelInputs);
    // free tensors
    featureTensor.dispose();
    // decode the output activations as array with a promise
    let resultsArray = await results.array();
    results.dispose();
    return resultsArray;
  }
}
const musiCNN = new TestMusicnn(tf, modelURL);

musiCNN.initialize()
       .then(() => console.log("essentia-tfjs model ready..."))
       .catch( err => console.error(err));
console.log(`Using TF ${tf.getBackend()} backend`);

self.onmessage = e => {
  console.log('received data: ', e.data)
  musiCNN.predict(e.data, true)
  .then((predictions) => self.postMessage(predictions));
  // post the predictions as message to the main thread
}   
