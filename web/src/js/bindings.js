//


class EssentiaMinJs {
	constructor (version) {
		this.version = version;
		this.audioArray = [];
	}

	// generic function to loads web audio buffer as a 1D vector matrix for further passing to c++ functions
	webAudioLoader(blob) {

		const audioVector = blob2ArrayBuffer(blob);
		this.audioArray = audioVector;
	    return audioVector;
	}

	// TODO: bindings for 2D vector reals, int, string
}


const blob2ArrayBuffer = async (blob) => {
	let arrayBuffer = await new Response(blob).arrayBuffer();
	return arrayBuffer;
}



vec2JsArray = function(vec) {

}