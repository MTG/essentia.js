// import Module from 'https://unpkg.com/essentia.js@0.0.8/dist/essentia-module.js';
import { EssentiaModule } from "https://unpkg.com/essentia.js@0.0.9/dist/essentia-wasm.module.js";
// import Essentia JS API interface
import Essentia from "https://unpkg.com/essentia.js@0.0.9/dist/essentia.js-core.es.js";
// Tools for sending audio interleaved audio frames between threads, wait-free from the ringbuf.js package
// import { RingBuffer, AudioReader, ParameterReader } from "https://unpkg.com/browse/ringbuf.js@0.1.0/dist/index.es.js";

let essentia = new Essentia(EssentiaModule);

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
    // this.port.onmessage = e => {
    //   this._size = 128;
    //   if (e.data.type === "recv-audio-queue") {
    //     this._audio_reader = new AudioReader(new RingBuffer(e.data.data, Float32Array));
    //   } else if (e.data.type === "recv-param-queue") {
    //     this._param_reader = new ParameterReader(new RingBuffer(e.data.data, Uint8Array));
    //   } else {
    //     throw "unexpected.";
    //   }
    // };
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

    // In this case we apply a traingular windowing function to every input audio frame
    // check https://essentia.upf.edu/reference/std_Windowing.html
    let windowedFrame = this.essentia.Windowing(vectorInput, // input audio frame
                                                // parameters
                                                true, // normalized
                                                1024, // size
                                                'triangular', // type
                                                0, // zeroPadding
                                                true); // zeroPhase 

    
    // check https://essentia.upf.edu/reference/std_PitchYinProbabilistic.html
    // let algoOutput = essentia.PitchYinProbabilistic(vectorInput, // input_1
    //                                               // parameters (optional)
    //                                               4096, // frameSize
    //                                               256, // hopSize
    //                                               0.1, // lowRMSThreshold
    //                                               'zero', // outputUnvoiced,
    //                                               false, // preciseTime
    //                                               audioCtx.sampleRate); //sampleRate

    // convert the output back to float32 typed array
    let outputArray = this.essentia.vectorToArray(windowedFrame.frame);

    console.log("Processed audio buffer stream using essentia.js worklet with size: " + outputArray.length + " frames.");
    
    // copy converted array to the output channel 0
    output[0].set(outputArray);

    return true;
  }


}

registerProcessor('essentia-worklet-processor', EssentiaWorkletProcessor);