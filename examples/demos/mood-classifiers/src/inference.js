import EffnetMusicnnEmbeddings from "./EffnetEmbeddings.js";
import { HeadModelORT } from "./HeadModel.js";
import modelState from "./modelState.js";

import effnetUrl from '../models/effnet-based/discogs-effnet-bsdynamic-1.onnx?url';
import musicnnUrl from '../models/msd-musicnn-1.onnx?url';

import * as ort from 'onnxruntime-web';

const effnetModel = new EffnetMusicnnEmbeddings(ort, effnetUrl, 128);
const musicnnModel = new EffnetMusicnnEmbeddings(ort, musicnnUrl, 187);
const classifiers = Object.keys(modelState);

let audioArray = null;
let modelsReady = false; 
let waitingForInference = false;

function getPositives(tensor, name) {
  const reshapeTemp = [];
  const innerDim = tensor.dims[1]
  for (let i = 0; i < tensor.size; i += innerDim) {
    const innerTemp = tensor.data.slice(i, i+innerDim);
    const positive = innerTemp.filter((_, j) => modelState[name].tagOrder[j])[0];
    reshapeTemp.push(positive);
  }
  return reshapeTemp;
}

function average(arr) {
  const length = arr.length;
  if (length === 0) return 0;

  const sum = arr.reduce( (acc, val) => acc + val, 0 );

  return sum/length;
}

function parseEmomusicOutput(outputTensor) {
  const tagOrder = modelState.emomusic.tagOrder;
  const outputArray = outputTensor.data;
  const separatedPreds = {};
  separatedPreds[tagOrder[0]] = [];
  separatedPreds[tagOrder[1]] = [];
  for (let i = 0; i < outputTensor.size; i+=2) {
    separatedPreds[tagOrder[0]].push(outputArray[i]);
    separatedPreds[tagOrder[1]].push(outputArray[i+1]);
  }
  // summarise each tag (valence, arousal)
  separatedPreds[tagOrder[0]] = average(separatedPreds[tagOrder[0]]);
  separatedPreds[tagOrder[1]] = average(separatedPreds[tagOrder[1]]);
  return separatedPreds;
}

function initModels() {
  let initPromiseArray = [];
  initPromiseArray.push(effnetModel.initialize());
  initPromiseArray.push(musicnnModel.initialize());
  
  for (let n of classifiers) {
    modelState[n].model = HeadModelORT.create(n, ort);
    initPromiseArray.push(modelState[n].model.initialize());
  }
  
  Promise.all(initPromiseArray).then( () => {
    // update initialized state: message ExtractorManager
    self.postMessage({type: "initialised"});
    console.info('EffNet model initialised');
    classifiers.forEach( n => {
      modelState[n].isLoaded = true;
      console.info(`${n} classifier initialised`);
    })

    modelsReady = true;
    if (waitingForInference) runModels();
  })
}

initModels();

async function runClassifiers(effnetEmbeddings, musicnnEmbeddings) {
  // use array of promises pattern here too
  for (let n of classifiers) {
    let embeddings = effnetEmbeddings;
    if (n == "emomusic") embeddings = musicnnEmbeddings;

    const o = await modelState[n].model.predict(embeddings);
    const name = o.modelName;
    const outputTensor = o.activations;
    let outputArray = outputTensor.data;
    // console.debug(`${name} output tensor:`, Array.from(outputArray), outputTensor.dims);
    let positivesArray = outputArray;
    
    // format predictions, grab only positive output
    if (!["approachability", "engagement"].includes(name)) {
      positivesArray = getPositives(outputTensor, name);
    }

    if (name == "emomusic") {
      const emomusicOut = parseEmomusicOutput(outputTensor);
      postMessage({
        predictions: [name, emomusicOut]
      })
      continue;
    }
    
    const summarizedPredictions = average(positivesArray);
    postMessage({
      predictions: [name, summarizedPredictions]
    });
  }
}

async function runModels() {
  const inferenceStart = performance.now();
  const melspectrogram = EffnetMusicnnEmbeddings.computeSpectrogram(audioArray)
  const effnetEmbeddings = await effnetModel.predict(melspectrogram);
  const musicnnEmbeddings = await musicnnModel.predict(melspectrogram);
  // console.debug('embeddings data: ', Array.from(embeddings.data));
  // console.debug('musicnn embeddings: ', Array.from(musicnnEmbeddings.data));
  // feed to classifier heads
  runClassifiers(effnetEmbeddings, musicnnEmbeddings);
  const inferenceTotal = performance.now() - inferenceStart;
  console.info(`total inference time: ${inferenceTotal}ms, for ${audioArray.length / 16000}s recording`);
};

self.onmessage = async (msg) => {
  switch (msg.data.type) {
    case 'audio':
      console.info('worker received audio');
      audioArray = new Float32Array(msg.data.arrayBuffer);

      if (!modelsReady) {
        waitingForInference = true;
        break;
      }
      runModels();

      break;
  
    default:
      break;
  }
}