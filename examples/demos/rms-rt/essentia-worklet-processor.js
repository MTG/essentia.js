let essentia = new Essentia(Module); // where Module is EssentiaWASM object when concatenated to this code by URLFromFiles

/**
 * A simple demonstration of using essentia.js wasm  Modules as AudioWorkletProcessor.
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
    this.essentia = essentia;
    console.log('Backend - essentia:' + this.essentia.version + '- http://essentia.upf.edu'); 
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
    
    // convert the input audio frame array from channel 0 to a std::vector<float> type for using it in essentia
    let vectorInput = this.essentia.arrayToVector(input[0]);

    // In this case we compute the Root Mean Square of every input audio frame
    // check https://mtg.github.io/essentia.js/docs/api/Essentia.html#RMS 
    let rmsFrame = this.essentia.RMS(vectorInput) // input audio frame

    // console.log("Processed audio buffer stream using essentia.js worklet with size: " + outputArray.length + " frames.");

    output[0][0] = rmsFrame.rms;

    return true;
  }


}

registerProcessor('essentia-worklet-processor', EssentiaWorkletProcessor);