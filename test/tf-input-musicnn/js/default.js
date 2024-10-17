import { EssentiaModel, EssentiaWASM } from "essentia.js";

const essentiaWasm = EssentiaWASM.EssentiaWASM;
const tfInputMusiCNN = new EssentiaModel.EssentiaTFInputExtractor(essentiaWasm, "musicnn", true);
const frameSize = tfInputMusiCNN.frameSize;
const hopSize = Math.floor(frameSize / 2);

export function getFeaturesDefault(audio) {
  console.log('Running default test...')
  const melspectrogram = tfInputMusiCNN.computeFrameWise(audio, hopSize).melSpectrum;
  return melspectrogram;
}