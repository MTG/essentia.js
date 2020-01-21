import Module from '../../builds/essentiamin-0.0.1-module.js';
import { EssentiaJsTools } from '../../builds/essentia.jstools.js';


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

    // Write your essentia.js processing code here
     
    // copy the input audio frame array from channel 0 to a std::vector<float> type for using it in essentia
    let vectorInput = this.utils.typedFloatArray2Vector(input[0]);

    // In this case we are apply a hanning windowing to the input audio frame
    let windowedFrame = Module.windowing(vectorInput, "hann");

    // convert the output back to float32 typed array
    let outputArray = this.utils.vector2typedFloat32Array(windowedFrame);
    
    // copy converted array to the output channel 0
    output[0].set(outputArray);

    return true;
  }
}


registerProcessor('essentia-worklet-processor', EssentiaWorkletProcessor);
