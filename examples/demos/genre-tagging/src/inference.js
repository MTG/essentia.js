import EffnetMusicnnEmbeddings from "./EffnetEmbeddings.js";
import { HeadModelORT } from "./HeadModel.js";

import effnetUrl from '../models/effnet-based/discogs-effnet-bsdynamic-1.onnx?url';

import genreDiscogsUrl from '../models/effnet-based/genre_discogs400-discogs-effnet-1.onnx?url';
import mttDiscogsUrl from '../models/effnet-based/mtt-discogs-effnet-1.onnx?url';

import * as ort from 'onnxruntime-web';

const effnetModel = new EffnetMusicnnEmbeddings(ort, effnetUrl, 128);
const genreDiscogsModel = HeadModelORT.create({name: "genre_discogs", url: genreDiscogsUrl}, ort);
const mttDiscogsModel = HeadModelORT.create({name: "mtt", url: mttDiscogsUrl}, ort);

let audioArray = null;
let modelsReady = false; 
let waitingForInference = false;

function reshapeAndAverage(arr, rows, cols) {
  // Validate input length matches expected shape
  if (arr.length !== rows * cols) {
      throw new Error(`Array length (${arr.length}) doesn't match shape [${rows},${cols}]`);
  }
  
  // Reshape and compute mean in one operation
  return Array(cols).fill(0).map((_, colIndex) => {
      // Get all elements in the current column
      const columnValues = Array(rows).fill(0).map((_, rowIndex) => {
          return arr[rowIndex * cols + colIndex];
      });
      
      // Calculate mean of the column
      const sum = columnValues.reduce((acc, val) => acc + val, 0);
      return sum / rows;
  });
}

function initModels() {
  let initPromiseArray = [];
  initPromiseArray.push(effnetModel.initialize());
  initPromiseArray.push(genreDiscogsModel.initialize());
  initPromiseArray.push(mttDiscogsModel.initialize());
  
  Promise.all(initPromiseArray).then( () => {
    // update initialized state: message ExtractorManager
    self.postMessage({type: "initialised"});
    console.info('EffNet model and downstream classifiers initialised');

    modelsReady = true;
    if (waitingForInference) runModels();
  })
}

initModels();

async function runClassifiers(effnetEmbeddings) {
  // use array of promises pattern here too

  const genreDiscogsOut = await genreDiscogsModel.predict(effnetEmbeddings);
  const genreDiscogsActivations = genreDiscogsOut.activations;
  let genreDiscogsActivationsArray = genreDiscogsActivations.data;
  // console.debug(`genreDiscogs output tensor:`, Array.from(genreDiscogsActivationsArray), genreDiscogsActivations.dims);

  const genreDiscogsReshapedAndAveraged = reshapeAndAverage(genreDiscogsActivationsArray, genreDiscogsActivations.dims[0], genreDiscogsActivations.dims[1]);
  // console.debug('genreDiscogs reshaped and averaged:', genreDiscogsReshapedAndAveraged);
  postMessage({
    predictions: ['genre_discogs', genreDiscogsReshapedAndAveraged]
  });

  const mttDiscogsOut = await mttDiscogsModel.predict(effnetEmbeddings);
  const mttDiscogsActivations = mttDiscogsOut.activations;
  let mttDiscogsActivationsArray = mttDiscogsActivations.data;
  // console.debug(`mttDiscogs output tensor:`, Array.from(mttDiscogsActivationsArray), mttDiscogsActivations.dims);

  const mttDiscogsReshapedAndAveraged = reshapeAndAverage(mttDiscogsActivationsArray, mttDiscogsActivations.dims[0], mttDiscogsActivations.dims[1]);
  // console.debug('mttDiscogs reshaped and averaged:', mttDiscogsReshapedAndAveraged);

  postMessage({
    predictions: ['mtt', mttDiscogsReshapedAndAveraged]
  });
}

async function runModels() {
  const inferenceStart = performance.now();
  const melspectrogram = EffnetMusicnnEmbeddings.computeSpectrogram(audioArray);
  const effnetEmbeddings = await effnetModel.predict(melspectrogram);
  // console.debug('embeddings data: ', Array.from(embeddings.data));
  // console.debug('musicnn embeddings: ', Array.from(musicnnEmbeddings.data));
  // feed to classifier heads
  runClassifiers(effnetEmbeddings);
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
      
    case 'features':
      console.info('worker received features');
      console.log('features data:', msg.data.features);
      // melspectrogram data received from main thread
      runModels(msg.data.features);
      break;

    default:
      break;
  }
}