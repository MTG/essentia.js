/*
 * EssentiaMin.js 
 */

#include <stdio.h>
#include <essentia/algorithmfactory.h>
#include <essentia/essentiamath.h>
#include "essentiamin.h"
//#include <essentia/streaming/algorithms/poolstorage.h>
//#include <essentia/scheduler/network.h>
 
using namespace essentia;
using namespace essentia::standard;
//using namespace essentia::streaming;
//using namespace essentia::scheduler;


void EssentiaMin::initState(bool debugger) {

	if (debugger) {
		setDebugLevel(EAll);                     // EAll is a special value that contains all modules
		unsetDebugLevel(EMemory | EConnectors);
		essentia::warningLevelActive = true; // activate warnings
		essentia::infoLevelActive = true;    // deactivate info
		essentia::errorLevelActive = true;    // activate error level
	}
	if (!initStatus || debugMode) {
        essentia::init();;
		initStatus = true;
    }
}


std::vector<float> EssentiaMin::onsetRate(std::vector<float>& signal) {

	float onsetRate;
	std::vector<float> onsets;

	Algorithm* extractoronsetrate = standard::AlgorithmFactory::create("OnsetRate");
	extractoronsetrate->input("signal").set(signal);
	extractoronsetrate->output("onsets").set(onsets);
	extractoronsetrate->output("onsetRate").set(onsetRate);

	delete extractoronsetrate;

	return onsets;
}


std::vector<float> EssentiaMin::autoCorrelation(std::vector<float>& signal) {

	std::vector<float> ac;

	AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
	Algorithm* fc      = factory.create("FrameCutter",
										"frameSize", 1024,
										"hopSize", 512);
	Algorithm* w       = factory.create("Windowing",
										"type", "hann");
	Algorithm* autocor = factory.create("AutoCorrelation");
	
	std::vector<float> frame, windowedFrame;
	/////////// CONNECTING THE ALGORITHMS ////////////////
	std::cout << "-------- connecting algos ---------" << std::endl;
	fc->input("signal").set(signal);
	fc->output("frame").set(frame);
	w->input("frame").set(frame);
	w->output("frame").set(windowedFrame);
	autocor->input("signal").set(windowedFrame);
	autocor->output("autoCorrelation").set(ac);
	std::cout << "-------- done computation ---------" << std::endl;

	delete fc;
	delete w;
	delete autocor;

	return ac;
}


std::vector<float> EssentiaMin::envelope(std::vector<float>& signal) {

	std::vector<float> env;

	Algorithm* envelop = standard::AlgorithmFactory::create("Envelope");
	envelop->input("signal").set(signal);
	envelop->output("signal").set(env);

	delete envelop;

	return env;
}


void EssentiaMin::mfcc(std::vector<float>& signal, std::vector<float>& mfccBands, std::vector<float>& mfccCoeffs) {

	/////// PARAMS //////////////
	int frameSize = 2048;
	int hopSize = 1024;

	// we want to compute the MFCC of a file: we need the create the following:
	// audioloader -> framecutter -> windowing -> FFT -> MFCC

	AlgorithmFactory& factory = standard::AlgorithmFactory::instance();

	Algorithm* fc    = 	factory.create("FrameCutter",
									   "frameSize", frameSize,
									   "hopSize", hopSize);
	Algorithm* w     = 	factory.create("Windowing",
									   "type", "blackmanharris62");
	Algorithm* spec  =  factory.create("Spectrum");
	Algorithm* mfcc  =  factory.create("MFCC");

	/////////// CONNECTING THE ALGORITHMS ////////////////
	std::cout << "-------- connecting algos ---------" << std::endl;

	// Audio -> FrameCutter
	fc->input("signal").set(signal);

	// FrameCutter -> Windowing -> Spectrum
	std::vector<Real> frame, windowedFrame;

	fc->output("frame").set(frame);
	w->input("frame").set(frame);

	w->output("frame").set(windowedFrame);
	spec->input("frame").set(windowedFrame);

	// Spectrum -> MFCC
	std::vector<Real> spectrum;

	spec->output("spectrum").set(spectrum);
	mfcc->input("spectrum").set(spectrum);

	mfcc->output("bands").set(mfccBands);
	mfcc->output("mfcc").set(mfccCoeffs);

	while (true) {
		// compute a frame
		fc->compute();
		// if it was the last one (ie: it was empty), then we're done.
		if (!frame.size()) {
			break;
		}
		// if the frame is silent, just drop it and go on processing
		if (isSilent(frame)) continue;

		w->compute();
		spec->compute();
		mfcc->compute();
	}

	delete fc;
	delete w;
	delete spec;
	delete mfcc;
}


void EssentiaMin::shutDown() {
	essentia::shutdown();
}


std::vector<float> EssentiaMin::logMelBands(std::vector<float>& signal, int frameSize=1024, int hopSize=1024) {

  	// we want to compute the MFCC of a file: we need the create the following:
  	// vector -> framecutter -> windowing -> FFT -> MFCC -> PoolStorage

  	AlgorithmFactory& factory = standard::AlgorithmFactory::instance();

  	Algorithm* fc       =  	factory.create("FrameCutter",
									   	   "frameSize", frameSize,
									   	   "hopSize", hopSize,
									       "startFromZero", true);

  	Algorithm* w     	=  	factory.create("Windowing",
									       "type", "hann",
									       "zeroPadding", frameSize);

  	Algorithm* spec  	=  	factory.create("Spectrum",
									       "size", frameSize);

  	Algorithm* mel  	=   factory.create("MelBands",
								           "numberBands", 128,
								           "type", "magnitude");

  	Algorithm* logNorm  =   factory.create("UnaryOperator",
									       "type", "log");
								   

  	/////////// STARTING THE ALGORITHMS //////////////////
	fc->input("signal").set(signal);

	// FrameCutter -> Windowing -> Spectrum
	std::vector<Real> frame, windowedFrame;

	fc->output("frame").set(frame);
	w->input("frame").set(frame);

	w->output("frame").set(windowedFrame);
	spec->input("frame").set(windowedFrame);

	// Spectrum -> MFCC
	std::vector<Real> spectrum, mfccBands, melBands;

	spec->output("spectrum").set(spectrum);
	mel->input("spectrum").set(spectrum);

	mel->output("bands").set(mfccBands);
	logNorm->input("array").set(mfccBands);
	logNorm->output("array").set(melBands);

	while (true) {
		// compute a frame
		fc->compute();
		// if it was the last one (ie: it was empty), then we're done.
		if (!frame.size()) {
			break;
		}
		// if the frame is silent, just drop it and go on processing
		if (isSilent(frame)) continue;

		w->compute();
		spec->compute();
		mel->compute();
		logNorm->compute();
	}

	delete fc;
	delete w;
	delete mel;
	delete logNorm;

  	return melBands;
}


/*
void EssentiaMin::streamingLogMelBands(std::vector<float>& signal, std::vector<float>& melBands) {

  	// register the algorithms in the factory(ies)
  	essentia::init();

  	Pool pool;

  	/////// PARAMS //////////////
  	Real sampleRate = 44100.0;
  	int frameSize = 1024;
  	int hopSize = 1024;

  	// we want to compute the MFCC of a file: we need the create the following:
  	// audioloader -> framecutter -> windowing -> FFT -> MFCC -> PoolStorage
  	// we also need a DevNull which is able to gobble data without doing anything
  	// with it (required otherwise a buffer would be filled and blocking)

  	AlgorithmFactory& factory = streaming::AlgorithmFactory::instance();

  	Algorithm* vectorInput = new streaming::VectorInput<vector<Real> >(&melBands);

  	Algorithm* fc    = factory.create("FrameCutter",
									"frameSize", frameSize,
									"hopSize", hopSize,
									"startFromZero", true);

  	Algorithm* w     = factory.create("Windowing",
									"type", "hann",
									"zeroPadding", frameSize);

  	Algorithm* spec  = factory.create("Spectrum",
									"size", frameSize);

  	Algorithm* mel  = factory.create("MelBands",
								   "numberBands", 128,
								   "type", "magnitude");

  	Algorithm* logNorm  = factory.create("UnaryOperator",
									   "type", "log");
								   

  	/////////// CONNECTING THE ALGORITHMS ////////////////
  	std::cout << "-------- connecting algos --------" << std::endl;

  	vectorInput->output("data")    >>  fc->input("signal");
  	fc->output("frame")       	   >>  w->input("frame");
  	w->output("frame")             >>  spec->input("frame");
  	spec->output("spectrum")       >>  mel->input("spectrum");
  	mel->output("bands")           >>  logNorm->input("array");
  	logNorm->output("array")       >>  PC(pool, "log_mel_bands"); // store only the mfcc coeffs

  	// create a network with our algorithms...
  	Network n(vectorInput);

  	/////////// STARTING THE ALGORITHMS //////////////////
  	std::cout << "-------- start computing feature --------" << std::endl;
  	// ...and run it, easy as that!
  	n.run();

  	melBands = pool.value<vector<float> >("log_mel_bands");

  	n.clear();

  	essentia::shutdown();

}
*/


