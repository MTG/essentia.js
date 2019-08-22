/*


*/


// cahce typed array variable to load the async arraybuffer 
let AUDIOARRAY;


class EssentiaMinJs {
	constructor () {
	}

	// generic function to loads web audio buffer as a 1D vector matrix for further passing to c++ functions
	webAudioLoader = function (blob) {
		var myReader = new FileReader();
		var arrayBuf = myReader.readAsArrayBuffer(blob);
		console.log("Loading blob into typed array");
		myReader.onloadend = function(loadEvent) {
			AUDIOARRAY = new Uint8Array(loadEvent.target.result);
			console.log("Loaded blob into Uint8 typed array sucessfully...");
		}
	}

	getAudioArray = function() {
		return AUDIOARRAY.slice();
	}

	// TODO: bindings for 2D vector reals, int, string
}


vec2JsArray = function(vec) {
}



