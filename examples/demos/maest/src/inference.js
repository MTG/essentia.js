import EffnetMusicnnEmbeddings from "../../common/audio/EffnetEmbeddings.js";

import maestUrl from '../models/discogs-maest-30s-pw-519l-1.onnx?url';

import * as ort from 'onnxruntime-web';

const maestModel = new EffnetMusicnnEmbeddings(ort, maestUrl, 1876);

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
  maestModel.initialize().then( () => {
    // update initialized state: message ExtractorManager
    self.postMessage({type: "initialised"});
    console.info('EffNet model and downstream classifiers initialised');

    modelsReady = true;
    if (waitingForInference) runModels();
  })
}

initModels();

async function runModels() {
  const inferenceStart = performance.now();
  const melspectrogram = EffnetMusicnnEmbeddings.computeSpectrogram(audioArray);
  const maestActivations = await maestModel.predict(melspectrogram);
  // console.debug('embeddings data: ', Array.from(embeddings.data));
  // console.debug('musicnn embeddings: ', Array.from(musicnnEmbeddings.data));
  let maestActivationsArray = maestActivations.cpuData;
  console.debug(`maest output tensor:`, Array.from(maestActivationsArray), maestActivations.dims);

  const genreDiscogsReshapedAndAveraged = reshapeAndAverage(maestActivationsArray, maestActivations.dims[0], maestActivations.dims[1]);
  // console.debug('genreDiscogs reshaped and averaged:', genreDiscogsReshapedAndAveraged);

  const inferenceTotal = performance.now() - inferenceStart;
  console.info(`total inference time: ${inferenceTotal}ms, for ${audioArray.length / 16000}s recording`);
  return genreDiscogsReshapedAndAveraged;
}

self.onmessage = async (msg) => {
  let genreDiscogs;
  switch (msg.data.type) {
    case 'audio':
      console.info('worker received audio');
      audioArray = new Float32Array(msg.data.arrayBuffer);

      if (!modelsReady) {
        waitingForInference = true;
        break;
      }
      genreDiscogs = await runModels();
      postMessage({
        predictions: ['maest', genreDiscogs]
      });

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