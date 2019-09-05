/*

*/

class EssentiaJsTools {

	constructor (audioContext) {
		this.audioContext = audioContext;
		this.audioSignal = null;
	}

	// generic function to loads web audio buffer as a 1D vector matrix for further passing to c++ functions
	loadAudioDataFromUrl = function(url) {
		var request = new XMLHttpRequest();
		request.open('GET', url, true);
		request.responseType = 'arraybuffer';
	
		// Decode asynchronously
		request.onload = function() {
			audioContext.decodeAudioData(request.response, function(buffer) {
			urlAudioBuffer = buffer;
			// mono signal
			this.audioSignal = typedFloat32Array2Vec(buffer.getChannelData(0));	
			});
		}
		request.send();
	}
}


function EssentiaTools(myAudioCtx) {
	this.audioContext = myAudioCtx;
	this.audioSignal = null;
}

EssentiaTools.prototype.loadAudioDataFromUrl = function(url) {

	var request = new XMLHttpRequest();
	request.open('GET', url, true);
	request.responseType = 'arraybuffer';

	// Decode asynchronously
	request.onload = function() {
		this.audioContext.decodeAudioData(request.response, function(buffer) {
		urlAudioBuffer = buffer;
		// mono signal
		this.audioSignal = typedFloat32Array2Vec(buffer.getChannelData(0));	
		});
	}
	request.send();
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

