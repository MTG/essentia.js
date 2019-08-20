//


class EssentiaMinJs {
	constructor (name) {
		this.name = name;
	}

	// generic function to loads web audio buffer as a 1D vector matrix for further passing to c++ functions
	webAudioLoader(blob) {

		const audioVector = blob2ArrayBuffer(blob);
	    return audioVector;
	}

	// TODO: bindings for 2D vector reals, int, string
}


const blob2ArrayBuffer = async (blob) => {
	let arrayBuffer = await new Response(blob).arrayBuffer();
	return arrayBuffer;
}

