// essentia.js interface to pre-trained Tensorflow JS and ONNX.js Machine Learning models

import Essentia from "./core_api";

class EssentiaModels extends Essentia {
  constructor(public EssentiaModule: any) {
    super(EssentiaModule);
  }
  // TODO
}

export { EssentiaModels };