import { EssentiaWASM } from "../../dist/essentia-wasm.module";
import Essentia from "../../dist/essentia.js-core.es";
import * as EssentiaModel from "../../dist/essentia.js-model.es";
import * as EssentiaPlot from "../../dist/essentia.js-plot.es";
import EssentiaExtractor from "../../dist/essentia.js-extractor.es";

// export as default for entry point to node package with the js wrapper
// const EssentiaNode = new Essentia(EssentiaWASM);
export { 
  // essentia wasm object
  EssentiaWASM,
  // core JS API
  Essentia,
  // Add-on modules
  EssentiaModel,
  EssentiaPlot,
  EssentiaExtractor
};