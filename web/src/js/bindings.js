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
		myReader.readAsArrayBuffer(blob);
		myReader.onloadend = function(loadEvent) {
			AUDIOARRAY = new Uint16Array(loadEvent.target.result);
			console.log("Loaded blob into Uint8 typed array sucessfully...");
		}
	}

    // get a copy a audio array
	getAudioArray = function() {
		return AUDIOARRAY.slice();
	}

	// TODO: bindings for 2D vector reals, int, string
}


function iterateTypedArrayCallback(element, index, array) {
	console.log('a[' + index + '] = ' + element);
}



vec2typedFloat32Array = function(vec) {
	var jsArray = [];
	for (var i=0; i <= vec.size(); i++) {
		jsArray[i] = vec[i];
	}
	return new Float32Array();
}


typedFloat32Array2Vec = function(typedArray) {

	var vec = new Module.VectorFloat();
	var cnt = 0;
	for (var i=0; i<typedArray.length; i++) {
		if (typeof typedArray[i] === 'undefined') {
			vec.push_back(0);
			cnt ++;
		}
		else {
			vec.push_back(typedArray[i]);
		}
	}
	console.log("Found undefined values -> ", cnt, "/", typedArray.length);
	return vec;
}



function floatTo16BitInt(inputArray, startIndex){
    var output = new Uint16Array(inputArray.length-startIndex);
    for (var i = 0; i < inputArray.length; i++){
        var s = Math.max(-1, Math.min(1, inputArray[i]));
        output[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    return output;
}

// This is passed in an unsigned 16-bit integer array. It is converted to a 32-bit float array.
// The first startIndex items are skipped, and only 'length' number of items is converted.
function int16ToFloat32(inputArray, startIndex, length) {
    var output = new Float32Array(inputArray.length-startIndex);
    for (var i = startIndex; i < length; i++) {
        var int = inputArray[i];
        // If the high bit is on, then it is a negative number, and actually counts backwards.
        var float = (int >= 0x8000) ? -(0x10000 - int) / 0x8000 : int / 0x7FFF;
        output[i] = float;
    }
    return output;
}



