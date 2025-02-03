const EssentiaWASM = require('../dist/essentia-wasm.umd.js');
const {
  ready,
  arrayToVector,
  vectorToArray
} = require('../dist/essentia.js-core.umd.js');

ready(EssentiaWASM);

class BPF {
  defaultParams = {
    xPoints: [0, 1],
    yPoints: [0, 1],
  };
  params = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param} [params]
  */
  constructor(params) {
    this.updateParams(params);
  }

  updateParams(params) {
    if (!params) return;
    if (params.xPoints) {
      params.xPoints = arrayToVector(params.xPoints);
    }
    if (params.yPoints) {
      params.yPoints = arrayToVector(params.yPoints);
    }
    this.params = { ...this.defaultParams, ...params };
  }
}

bpf = new BPF();

console.log('BPF params after update');
console.log(bpf.params);