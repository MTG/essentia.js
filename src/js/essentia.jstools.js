/*
Class with utility methods to use essentia.js
*/
export class EssentiaJSTools {
	constructor(essentiaWasmModule) {
		this._module = essentiaWasmModule;
	}
	// copy the contents of a float 32 js typed array into a std::vector<float>.
	typedFloatArray2Vector = function(typedArray) {
		let vect = new this._module.VectorFloat();
    for (let i=0; i<typedArray.length; i++) {
      if (typeof typedArray[i] === 'undefined') {
      	vect.push_back(0);
        }
        else {
          vect.push_back(typedArray[i]);
        }
    }
    return vect; 
  }
  // copy the contents of a std::vector<float> into a float 32 js typed array. 
	vector2typedFloat32Array = function(vect) {
		const typedArray = new Float32Array(vect.size());
		for (var i=0; i < vect.size(); i++) {
			typedArray[i] = vect.get(i); 
			typedArray[i] = parseFloat(typedArray[i].toFixed(2));
		}
		return typedArray
	}
	// add your essentia.js utility funcs here
}