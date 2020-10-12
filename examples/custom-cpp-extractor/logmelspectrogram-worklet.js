/*
TODO: fix the freeze
*/
import { EssentiaWASM } from "./essentia-custom-extractor.module.js";
// Tools for sending audio interleaved audio frames between threads, wait-free from the ringbuf.js package
// import { RingBuffer, AudioReader, ParameterReader } from "https://unpkg.com/browse/ringbuf.js@0.1.0/dist/index.es.js";

const FRAME_SIZE = 1024;
const HOP_SIZE = 512;
const NUM_BANDS = 96;
const WINDOW_TYPE = 'hann';


/**
 * A simple demonstration of using essentia.js custom wasm extractors as AudioWorkletProcessor.
 *
 * @class LogMelSpectrumProcessor
 * @extends AudioWorkletProcessor
 */
class LogMelSpectrumProcessor extends AudioWorkletProcessor {
  /**
   * @constructor
   */
  constructor() {
    super();
    this.extractor = new EssentiaWASM.LogMelSpectrogramExtractor(FRAME_SIZE, HOP_SIZE, NUM_BANDS, WINDOW_TYPE);
    console.log('Backend - essentia:' + this.extractor.version + '- http://essentia.upf.edu'); 
    // this.port.onmessage = e => {
    //   this._size = FRAME_SIZE;
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
     
    const logMelSpectrum = this.extractor.compute(input);
    console.log("Spectrum shape", logMelSpectrum.size());

    // convert the output back to float32 typed array
    // let outputArray = this.essentia.vectorToArray(logMelSpectrum.frame);

    console.log("Processed audio buffer stream using essentia.js worklet with size: " + output[0].length + " frames.");
    
    // // copy converted array to the output channel 0
    // output[0].set(outputArray);

    return true;
  }


}

registerProcessor('logmelspectrogram-worklet', LogMelSpectrumProcessor);