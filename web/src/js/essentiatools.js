/*

*/

window.AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext = new AudioContext(); // web audio api context
var essentiaAudioBuffer = null; // variable to store the audioBuffer read from audioContext

// just a sample options template for the EssentiaJsTools
var optionsTemplate = {
	'sampleRate': 44100,
	'hopSize': 512,
	'frameSize': 1024,
	'window': 'hann',
};


// class for encapsulating all the utility methods for using essentia.js
class EssentiaJsTools {

	constructor (myAudioContext, options) {
		this.audioContext = myAudioContext;
		// this.audioSignal = null;
		this.params = options;
	}

	// generic function to loads web audio buffer as a 1D vector matrix for further passing to c++ functions of essentia
	loadAudioDataFromUrl = function(url) {
		var request = new XMLHttpRequest();
		request.open('GET', url, true);
		request.responseType = 'arraybuffer';
	
		// Decode asynchronously
		request.onload = function() {
			audioContext.decodeAudioData(request.response, function(buffer) {
			urlAudioBuffer = buffer;
			// mono signal
			essentiaAudioBuffer = buffer;	
			});
		}
		request.send();
	}

	getAudioBufferAsEssentiaArray = function(audioBuffer) {
		return typedFloat32Array2Vec(audioBuffer.getChannelData(0));
	}
}


// copy the contents of a float 32 js typed array into a std::vector<float> type. 
typedFloat32Array2Vec = function(typedArray) {

	var vec = new Module.VectorFloat();
	for (var i=0; i<typedArray.length; i++) {
		if (typeof typedArray[i] === 'undefined') {
			vec.push_back(0);
		}
		else {
			vec.push_back(typedArray[i]);
		}
	}
	return vec;
}


// copy the contents of a std::vector<float> into a float 32 js typed array. 
vec2typedFloat32Array = function(vec) {
	const typedArray = new Float32Array(vec.size());
	for (var i=0; i < vec.size(); i++) {
		typedArray[i] = vec.get(i);
	}
	return typedArray
}


blob2Url = function(blob) {
	return URL.createObjectURL(blob);
}


function iterateTypedArrayCallback(element, index, array) {
	console.log('a[' + index + '] = ' + element);
}

