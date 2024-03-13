const EssentiaWASM = require("../../builds/essentia-wasm.universal.js");

EssentiaWASM().then( ejswasm => {
  console.log("loaded wasm", typeof ejswasm);
})
