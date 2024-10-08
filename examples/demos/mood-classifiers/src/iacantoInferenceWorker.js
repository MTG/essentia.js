import { EssentiaWASM } from "essentia.js";
import EffnetEmbeddings from "./EffnetEmbeddings.js";
import { HeadModelORT } from "./HeadModel.js";
import modelState from "./modelState.js";

const effnetEmbeddings = new EffnetEmbeddings(EssentiaWASM.EssentiaWASM);
const classifiers = Object.keys(modelState);

/** from inference.js:
 4. add prediction postprocessing functions
 3. merge runClassifiers with modelsPredict
*/

function initModels() {
  let initPromiseArray = [];
  initPromiseArray.push(effnetEmbeddings.initialize());
  
  for (let n of classifiers) {
    modelState[n].model = HeadModelORT.create(n, "effnet");
    initPromiseArray.push(modelState[n].model.initialize());
  }
  
  Promise.all(initPromiseArray).then( () => {
    // update initialized state: message ExtractorManager
    self.postMessage({type: "initialised"});
    console.log('EffNet model initialised');
    classifiers.forEach( n => {
      modelState[n].isLoaded = true;
      console.info(`${n} classifier initialised`);
    })
  })
}

initModels();

function runClassifiers(embeddings) {
  Promise.all([
    moodHappy.predict(embeddings),
    moodSad.predict(embeddings),
    moodRelaxed.predict(embeddings),
    moodAggressive.predict(embeddings),
    danceability.predict(embeddings),
    approachability.predict(embeddings),
    engagement.predict(embeddings)
  ]).then( (predictions) => {

  });
}


self.onmessage = async (msg) => {
  switch (msg.data.type) {
    case 'audio':
      console.log('worker received audio');
      const audioArray = new Float32Array(msg.data.arrayBuffer);
      // runPitchCREPE(audioArray);
      // const musicnnEmbeddingsTensor = musicnnEmbeddings.predict(audioArray);
      const inferenceStart = performance.now();
      const {ortTensor: ortEmbeddingsTensor, tfTensor: effnetEmbeddingsTensor} = await effnetEmbeddings.predict(audioArray);
      // console.log('effnet embeddings', effnetEmbeddingsTensor.arraySync());
      
      // feed to classifier heads
      runClassifiers(ortEmbeddingsTensor);
      const inferenceTotal = performance.now() - inferenceStart;
      console.log(`total inference time: ${inferenceTotal}ms, for ${audioArray.length / 16000}s recording`);
      break;
  
    default:
      break;
  }
}