import Module from '../../builds/essentiamin-0.0.1-module.js';
import EssentiaJsTools from '../../builds/essentia.jstools.js';

/**
 * A simple demonstration of using essentia.js wasm modules as AudioWorkletProcessor.
 *
 * @class EssentiaWorkletProcessor
 * @extends AudioWorkletProcessor
 */
class EssentiaWorkletProcessor extends AudioWorkletProcessor {
  /**
   * @constructor
   */
  constructor() {
    super();
    this.essentiaVersion = Module.getEssentiaVersion();
    this.utils = new EssentiaJsTools(Module);
  }

  /**
   * System-invoked process callback function.
   * @param  {Array} inputs Incoming audio stream.
   * @param  {Array} outputs Outgoing audio stream.
   * @param  {Object} parameters AudioParam data.
   * @return {Boolean} Active source flag.
   */
  process(inputs, outputs, parameters) {

    let input = inputs[0];
    let output = outputs[0];

    let vectorInput = this.utils.typedFloatArray2Vector(input.getChannelData(0));

    let wFrame = Module.windowing(vectorInput, "hann");
    let spec = Module.spectrum(wFrame);

    return true;
  }
}


registerProcessor('essentia-worklet-processor', EssentiaWorkletProcessor);
