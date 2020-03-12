/**
 * Class with utility methods to use essentia.js
 *
 * @export
 * @class EssentiaTools
 */
export class EssentiaTools {
  /**
   * Creates an instance of EssentiaTools.
   * @param {EmscriptenModuleObject} essentiaWasmModule
   * @memberof EssentiaTools
   */
  constructor(essentiaWasmModule) {
    this._module = essentiaWasmModule;
    this.audioData = null;
    this.audioVector = null;
  }

  /**
   * Copy the contents of a std::vector<float> into a float 32 JS typed array. 
   * @method
   * @param {VectorFloat} vect
   * @returns {Float32Array}
   * @memberof EssentiaTools
   */
  vectorToArray(vect) {
    if (!vect) { throw "Null input"};
    if (vect.size() == 0) { throw "Empty vector input"};
    const typedArray = new Float32Array(vect.size());
      for (var i=0; i < vect.size(); i++) {
        typedArray[i] = vect.get(i); 
        typedArray[i] = parseFloat(typedArray[i].toFixed(2));
      }
    return typedArray
  }

  /**
   * Returns audio vector data from an given audio url or blob url
   * @async
   * @method
   * @param {string} uri audio url or blob url or path to a local file
   * @param {object} webAudioCtx a instance of WebAudioApi `BaseAudioContext`
   * @param {number} [channel=0] channel number
   * @returns {VectorFloat} returns the audio data as a VectorFloat
   * @memberof EssentiaTools
   */
  async getAudioVectorfromUrl(uri, webAudioCtx, channel=0) {
    const response = await fetch(uri);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await webAudioCtx.decodeAudioData(arrayBuffer);
    if (!this.audioData) { this.audioData = null };
    this.audioData = audioBuffer.getChannelData(channel);
    return this.arrayToVector(this.audioData);
  }
  
  // add your new utitlity methods here
}