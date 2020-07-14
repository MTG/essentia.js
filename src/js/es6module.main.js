import { EssentiaWASM } from "../../dist/essentia-wasm.module";
import Essentia from "../../dist/essentia.js-core.es";
// export as default for entry point to node package with the js wrapper
const EssentiaNode = new Essentia(EssentiaWASM);
export default EssentiaNode;