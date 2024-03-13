importScripts("../../builds/essentia-wasm.universal.js");
console.log('imported essentia wasm');

EssentiaWASM().then( ejswasm => {
  console.log('worker loaded wasm module');
});