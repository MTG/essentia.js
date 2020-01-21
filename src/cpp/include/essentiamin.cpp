/*
 * EssentiaMin.js 
 */

#include <stdio.h>
#include <essentia/algorithmfactory.h>
#include <essentia/essentiamath.h>
#include <essentia/pool.h>
#include "essentiamin.h"
//#include <essentia/streaming/algorithms/poolstorage.h>
//#include <essentia/scheduler/network.h>
 
using namespace essentia;
using namespace essentia::standard;
//using namespace essentia::streaming;
//using namespace essentia::scheduler;


// set to false to initialize essentia algo registry for the very first time
bool esInitStatus = false;


// method to instantiate the essentia algo registry with an optional to use debug mode 
void EssentiaMin::initState(bool debugger) {
	// if true sets essentia debugger active
	if (debugger) {
		setDebugLevel(EAll); // EAll is a special value in essentia that contains all modules
		unsetDebugLevel(EMemory | EConnectors);
		essentia::warningLevelActive = true; // activate warnings
		essentia::infoLevelActive = true;    // activate info
		essentia::errorLevelActive = true;    // activate error level
	}
	// if needed, init essentia algorithm registry
	if (!esInitStatus) {
		essentia::init();
	 	esInitStatus = true;
		essentiaVersion = essentia::version;
    }
}


// method to shutdown essentia instance
void EssentiaMin::shutDown() {
	essentia::shutdown();
	esInitStatus = false;
}


// Method for frameCutting with windowing from a given audio signal
std::vector<std::vector<float> > EssentiaMin::frameGenerator(std::vector<float>& signal, int frameSize, int hopSize) {

	AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
	Algorithm* fc   = factory.create("FrameCutter",
									 "frameSize", frameSize,
									 "hopSize", hopSize);

	Pool pool;
	
	std::vector<float> frame;
	fc->input("signal").set(signal);
	fc->output("frame").set(frame);

	while (true) {
		// compute a frame
		fc->compute();
		// if it was the last one (ie: it was empty), then we're done.
		if (!frame.size()) {
			break;
		}
		// if the frame is silent, just drop it and go on processing
		if (isSilent(frame)) continue;

		pool.add("frames", frame);
	}

	delete fc;
	return pool.value<std::vector<std::vector<float> > >("frames");
}


// Check https://essentia.upf.edu/documentation/reference/std_Windowing.html
std::vector<float> EssentiaMin::windowing(std::vector<float>& signalFrame, std::string windowType) {

	AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
	Algorithm* window = factory.create("Windowing",
						"type", windowType);
	
	std::vector<float> windowedFrame;
	window->input("frame").set(signalFrame);
	window->output("frame").set(windowedFrame);

	window->compute();
	delete window;

	return windowedFrame;
}


// Check https://essentia.upf.edu/documentation/reference/std_LoudnessVickers.html. Meant to be input by audio frames not the entire audio signal.
float EssentiaMin::loudnessVickers(std::vector<float>& signalFrame) {

	AlgorithmFactory& factory = standard::AlgorithmFactory::instance();

	Algorithm* loudness = factory.create("LoudnessVickers");

	float loudnessValue;
	loudness->input("signal").set(signalFrame);
	loudness->output("loudness").set(loudnessValue);
	loudness->compute();

	delete loudness;
	return loudnessValue;
}


// Check https://essentia.upf.edu/documentation/reference/std_ZeroCrossingRate.html
float EssentiaMin::zeroCrossingRate(std::vector<float>& signal) {

	AlgorithmFactory& factory = standard::AlgorithmFactory::instance();

	Algorithm* zcr = factory.create("ZeroCrossingRate");

	float zcrValue;
	zcr->input("signal").set(signal);
	zcr->output("zeroCrossingRate").set(zcrValue);
	zcr->compute();

	delete zcr;

	return zcrValue;
}


// https://essentia.upf.edu/documentation/reference/std_Danceability.html
float EssentiaMin::danceability(std::vector<float>& signal) {

	AlgorithmFactory& factory = standard::AlgorithmFactory::instance();

	Algorithm* dance = factory.create("Danceability");

	float danceOut;
	std::vector<float> dfa;
	dance->input("signal").set(signal);
	dance->output("danceability").set(danceOut);
	dance->output("dfa").set(dfa);
	dance->compute();

	delete dance;
	return danceOut;
}


// Check https://essentia.upf.edu/documentation/reference/std_PitchYin.html
void EssentiaMin::pitchYin(std::vector<float>& signalFrame, float pitch, float pitchConfidence) {

	AlgorithmFactory& factory = standard::AlgorithmFactory::instance();

	Algorithm* pitchyin = factory.create("PitchYin");

	pitchyin->input("signal").set(signalFrame);
	pitchyin->output("pitch").set(pitch);
	pitchyin->output("pitchConfidence").set(pitchConfidence);
	pitchyin->compute();

	delete pitchyin;
}


// Check https://essentia.upf.edu/documentation/reference/std_RhythmDescriptors.html
void EssentiaMin::bpmHistogram(std::vector<float>& signal, std::vector<float>& bpmEstimates, std::vector<float>& histogram) {

	AlgorithmFactory& factory = standard::AlgorithmFactory::instance();

	Algorithm* rhyDesc = factory.create("RhythmDescriptors");

	std::vector<float> beatsPosition, bpmIntervals;
	float bpm, confidence, firstPeakBpm, firstPeakSpread, firstPeakWeight, secondPeakBpm, secondPeakSpread, secondPeakWeight;

	rhyDesc->input("signal").set(signal);
	rhyDesc->output("beats_position").set(beatsPosition);
	rhyDesc->output("bpm_estimates").set(bpmEstimates);
	rhyDesc->output("bpm_intervals").set(bpmIntervals);
	rhyDesc->output("bpm").set(bpm);
	rhyDesc->output("confidence").set(confidence);
	rhyDesc->output("histogram").set(histogram);
	rhyDesc->output("first_peak_bpm").set(firstPeakBpm);
	rhyDesc->output("first_peak_spread").set(firstPeakSpread);
	rhyDesc->output("first_peak_weight").set(firstPeakWeight);
	rhyDesc->output("second_peak_bpm").set(secondPeakBpm);
	rhyDesc->output("second_peak_spread").set(secondPeakSpread);
	rhyDesc->output("second_peak_weight").set(secondPeakWeight);

	rhyDesc->compute();

	delete rhyDesc;
}


// Check https://essentia.upf.edu/documentation/reference/std_SuperFluxExtractor.html for more details.
std::vector<float> EssentiaMin::superFluxExtractor(std::vector<float>& signal, int sampleRate, int frameSize, int hopSize) {

	AlgorithmFactory& factory = standard::AlgorithmFactory::instance();

	Algorithm* superflux = factory.create("SuperFluxExtractor",
										  "frameSize", frameSize,
										  "hopSize", hopSize,
										  "sampleRate", sampleRate);
	
	std::vector<float> onsets;

	superflux->input("signal").set(signal);
	superflux->output("onsets").set(onsets);

	superflux->compute();

	delete superflux;

	return onsets;	
}


// check https://essentia.upf.edu/documentation/reference/std_ChordsDetection.html
void EssentiaMin::chordDetection(std::vector<float>& chroma, int hopSize, std::vector<std::string>& chords, std::vector<float>& strength) {

	AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
	Algorithm* chordsDetect   = factory.create("ChordsDetection",
											   "hopSize", hopSize);
	
	std::vector<std::vector<float> > chromaVector;
	chromaVector.push_back(chroma);

	chordsDetect->input("pcp").set(chromaVector);
	chordsDetect->output("chords").set(chords);
	chordsDetect->output("strength").set(strength);

	chordsDetect->compute();
	delete chordsDetect;
}


// check https://essentia.upf.edu/documentation/reference/std_Key.html
void EssentiaMin::key(std::vector<float>& chroma, std::string profileType, std::vector<std::string> keyFeatures, float strength) {

	AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
	Algorithm* keyAlgo = factory.create("Key",
										"profileType", profileType,
										"pcpSize", 12);
	
	float nowhere;
	std::string keyOut, scale;
	keyAlgo->input("signal").set(chroma);
	keyAlgo->output("key").set(keyOut);
	keyAlgo->output("scale").set(scale);
	keyAlgo->output("strength").set(strength);
	keyAlgo->output("firstToSecondRelativeStrength").set(nowhere);
	keyAlgo->compute();
	keyFeatures.push_back(keyOut);
	keyFeatures.push_back(scale);
	delete keyAlgo;
}


// Check https://essentia.upf.edu/documentation/reference/std_KeyExtractor.html for more details
std::string EssentiaMin::keyExtractor(std::vector<float>& signal) {

	AlgorithmFactory& factory = standard::AlgorithmFactory::instance();

	Algorithm* keyExt = factory.create("KeyExtractor");

	std::string key, scale;
	float strength;

	keyExt->input("signal").set(signal);
	keyExt->output("key").set(key);
	keyExt->output("scale").set(scale);
	keyExt->output("strength").set(strength);

	keyExt->compute();

	// format everything to a string (NOTE: this is hacky way. To be replaced in future)
	std::ostringstream strStream;
	strStream << strength;
	std::string streng("_" + strStream.str());
	std::string out = ((key + "_") + scale) + streng;
	
	delete keyExt;

	return out;
}


// check https://essentia.upf.edu/documentation/reference/std_HPCP.html
std::vector<float> EssentiaMin::hpcp(std::vector<float>& signalFrame, bool nonLinear) {

	AlgorithmFactory& factory = standard::AlgorithmFactory::instance();

	Algorithm* spec  =  factory.create("Spectrum");
	Algorithm* peaks =  factory.create("SpectralPeaks");
	Algorithm* white =  factory.create("SpectralWhitening");
	Algorithm* hpcp  =  factory.create("HPCP",
									   "nonLinear", nonLinear);

	std::vector<float> spectrum, freqs, mags, whiteMags, hpcpVector;
	// configure i/o
	spec->input("frame").set(signalFrame);
	spec->output("spectrum").set(spectrum);
	peaks->input("spectrum").set(spectrum);
	peaks->output("frequencies").set(freqs);
	peaks->output("magnitudes").set(mags);
	white->input("spectrum").set(spectrum);
	white->input("frequencies").set(freqs);
	white->input("magnitudes").set(mags);
	white->output("magnitudes").set(whiteMags);
	hpcp->input("frequencies").set(freqs);
	hpcp->input("magnitudes").set(whiteMags);
	hpcp->output("hpcp").set(hpcpVector);
	// compute
	spec->compute();
	peaks->compute();
	white->compute();
	hpcp->compute();

	delete spec;
	delete peaks;
	delete white;
	delete hpcp;

	return hpcpVector;
}


// check https://essentia.upf.edu/documentation/reference/std_OnsetDetectionGlobal.html
std::vector<float> EssentiaMin::onsetDetectionGlobal(std::vector<float>& signal) {

	AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
	Algorithm* onsetDetect = factory.create("OnsetDetectionGlobal");
	std::vector<float> onsets;
	onsetDetect->input("signal").set(signal);
	onsetDetect->output("onsetDetections").set(onsets);
	delete onsetDetect;
	return onsets;
}


// check https://essentia.upf.edu/documentation/reference/std_NoveltyCurve.html
std::vector<float> EssentiaMin::noveltyCurve(std::vector<float>& spectrumFrame) {

	AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
	Algorithm* freqBands = factory.create("FrequencyBands");
	Algorithm* novelty = factory.create("NoveltyCurve");

	std::vector<float> bands, novCurve;

	freqBands->input("spectrum").set(spectrumFrame);
	freqBands->output("bands").set(bands);
	novelty->input("frequencyBands").set(bands);
	novelty->output("novelty").set(novCurve);

	freqBands->compute();
	novelty->compute();

	delete freqBands;
	delete novelty;

	return novCurve;
}


// check https://essentia.upf.edu/documentation/reference/std_SuperFluxNovelty.html
std::vector<float> EssentiaMin::superfluxNoveltyCurve(std::vector<float>& spectrumFrame) {

	AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
	Algorithm* freqBands = factory.create("FrequencyBands");
	Algorithm* fluxNovelty = factory.create("SuperFluxNovelty");

	std::vector<float> bands, novCurve;

	freqBands->input("spectrum").set(spectrumFrame);
	freqBands->output("bands").set(bands);
	fluxNovelty->input("frequencyBands").set(bands);
	fluxNovelty->output("novelty").set(novCurve);

	freqBands->compute();
	fluxNovelty->compute();

	delete freqBands;
	delete fluxNovelty;

	return novCurve;
}


// check https://essentia.upf.edu/documentation/reference/std_BeatTrackerMultiFeature.html
void EssentiaMin::beatTrackerMultiFeature(std::vector<float>& signal, std::vector<float>& ticks, float confidence) {

	AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
	Algorithm* beatTracker = factory.create("BeatTrackerMultiFeature");

	beatTracker->input("signal").set(signal);
	beatTracker->output("ticks").set(ticks);
	beatTracker->output("confidence").set(confidence);

	beatTracker->compute();

	delete beatTracker;
}


// Check https://essentia.upf.edu/documentation/reference/std_PitchYinProbabilistic.html
void EssentiaMin::pitchProbabilisticYinExtractor(std::vector<float>& signal, std::vector<float>& pitch, std::vector<float>& voicedProbabilities) {

	AlgorithmFactory& factory = standard::AlgorithmFactory::instance();

	Algorithm* pyYin = factory.create("PitchYinProbabilistic",
									  "outputUnvoiced", "zero");

	pyYin->input("signal").set(signal);
	pyYin->output("pitch").set(pitch);
	pyYin->output("voicedProbabilities").set(voicedProbabilities);
	pyYin->compute();

	delete pyYin;
}



// Check https://essentia.upf.edu/documentation/reference/std_PitchMelodia.html
void EssentiaMin::pitchMelodiaExtractor(std::vector<float>& signal, std::vector<float>& pitch, std::vector<float>& pitchConfidence) {

	AlgorithmFactory& factory = standard::AlgorithmFactory::instance();

	Algorithm* eqloud 		= factory.create("EqualLoudness");
	Algorithm* melodia = factory.create("PitchMelodia");

	std::vector<float> eqloudSignal;

	eqloud->input("signal").set(signal);
	eqloud->output("signal").set(eqloudSignal);
	melodia->input("signal").set(eqloudSignal);
	melodia->output("pitch").set(pitch);
	melodia->output("pitchConfidence").set(pitchConfidence);

	eqloud->compute();
	melodia->compute();

	delete eqloud;
	delete melodia;

}


// Check https://essentia.upf.edu/documentation/reference/std_PredominantPitchMelodia.html
void EssentiaMin::predominantPitchMelodiaExtractor(std::vector<float>& signal, std::vector<float>& pitch, std::vector<float>& pitchConfidence) {

	AlgorithmFactory& factory = standard::AlgorithmFactory::instance();

	Algorithm* eqloud 		= factory.create("EqualLoudness");
	Algorithm* predomelodia = factory.create("PredominantPitchMelodia");

	std::vector<float> eqloudSignal;

	eqloud->input("signal").set(signal);
	eqloud->output("signal").set(eqloudSignal);
	predomelodia->input("signal").set(eqloudSignal);
	predomelodia->output("pitch").set(pitch);
	predomelodia->output("pitchConfidence").set(pitchConfidence);

	eqloud->compute();
	predomelodia->compute();

	delete eqloud;
	delete predomelodia;

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


// Computes magnitude spectrum of a given audio frame
std::vector<float> EssentiaMin::spectrum(std::vector<float>& signalFrame) {
	if (signalFrame.size() < 2048) {
		throw EssentiaException("spectrogram: Size of audio frame is less than the expected size of 2048");
	}
  	AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  	Algorithm* spec  	=  	factory.create("Spectrum");

	spec->input("frame").set(signalFrame);
	std::vector<Real> spectrum;
	spec->output("spectrum").set(spectrum);

	spec->compute();

	delete spec;

	return spectrum;
}


// Computes magnitude spectrum for each frames of a given audio signal
std::vector<float> EssentiaMin::spectrumExtractor(std::vector<float>& signal, int frameSize=1024, int hopSize=1024, std::string windowType="hann") {

  	// framecutter -> windowing -> FFT 
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

	/////////// STARTING THE ALGORITHMS //////////////////
	fc->input("signal").set(signal);

	// FrameCutter -> Windowing -> Spectrum
	std::vector<Real> frame, windowedFrame;

	fc->output("frame").set(frame);
	w->input("frame").set(frame);

	w->output("frame").set(windowedFrame);
	spec->input("frame").set(windowedFrame);

	std::vector<Real> spectrum;
	spec->output("spectrum").set(spectrum);

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
	}

	delete fc;
	delete w;
	delete spec;

	return spectrum;
}


std::vector<float> EssentiaMin::logMelBands(std::vector<float>& spectrumFrame, int numBands) {

  	AlgorithmFactory& factory = standard::AlgorithmFactory::instance();

  	Algorithm* mel  	=   factory.create("MelBands",
								           "numberBands", numBands,
								           "type", "magnitude");

  	Algorithm* logNorm  =   factory.create("UnaryOperator",
									       "type", "log");
				
  	/////////// STARTING THE ALGORITHMS //////////////////
	std::vector<Real> mfccBands, melBands;

	mel->input("spectrum").set(spectrumFrame);
	mel->output("bands").set(mfccBands);
	logNorm->input("array").set(mfccBands);
	logNorm->output("array").set(melBands);
	
	mel->compute();
	logNorm->compute();

	delete mel;
	delete logNorm;
	
  	return melBands;
}


std::vector<float> EssentiaMin::logMelBandsExtractor(std::vector<float>& signal, int numBands, int frameSize, int hopSize, std::string windowType) {

  	// we want to compute the MFCC of a file: we need the create the following:
  	// vector -> framecutter -> windowing -> FFT -> MFCC -> PoolStorage

  	AlgorithmFactory& factory = standard::AlgorithmFactory::instance();

  	Algorithm* fc       =  	factory.create("FrameCutter",
									   	   "frameSize", frameSize,
									   	   "hopSize", hopSize,
									       "startFromZero", true);

  	Algorithm* w     	=  	factory.create("Windowing",
									       "type", windowType,
									       "zeroPadding", frameSize);

  	Algorithm* spec  	=  	factory.create("Spectrum",
									       "size", frameSize);

  	Algorithm* mel  	=   factory.create("MelBands",
								           "numberBands", numBands,
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
	delete spec;
	delete mel;
	delete logNorm;

  	return melBands;
}


// check https://essentia.upf.edu/documentation/reference/std_LoudnessEBUR128.html
void EssentiaMin::loudnessEBUR128(std::vector<float>& signal, std::vector<float>& momLoudness, std::vector<float>& shortLoudness, float integrateLoudness, float loudRange) {

	AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
	Algorithm* loudnessEbur = factory.create("LoudnessEBUR128");

	std::vector<std::vector<float> > stereoSignal;
	// hack to work on mono audio signal
	stereoSignal.push_back(signal);
	stereoSignal.push_back(signal);

	loudnessEbur->input("signal").set(stereoSignal);
	loudnessEbur->output("momentaryLoudness").set(momLoudness);
	loudnessEbur->output("shortTermLoudness").set(shortLoudness);
	loudnessEbur->output("integratedLoudness").set(integrateLoudness);
	loudnessEbur->output("loudnessRange").set(loudRange);

	loudnessEbur->compute();
	delete loudnessEbur;
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

// std::vector<std::vector<double> > EssentiaMin::stftExtractor(std::vector<float>& signal, int frameSize, int hopSize) {

// 	AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
// 	Algorithm* fc   = factory.create("FrameCutter",
// 									 "frameSize", frameSize,
// 									 "hopSize", hopSize,
// 									 "startFromZero", false);
// 	Algorithm* w    = factory.create("Windowing",
// 									 "type", 'hann');
	
// 	Algorithm* fft 	= factory.create("FFT",
// 									 "size", frameSize);
	
// 	std::vector<float> frame, windowedFrame, fftFrame;

// 	Pool pool;

// 	fc->input("signal").set(signal);
// 	fc->output("frame").set(frame);
// 	w->input("frame").set(frame);
// 	w->output("frame").set(windowedFrame);
// 	fft->input("frame").set(windowedFrame);
// 	fft->output("fft").set(fftFrame);

// 	while (true) {
// 		// compute a frame
// 		fc->compute();
// 		// if it was the last one (ie: it was empty), then we're done.
// 		if (!frame.size()) {
// 			break;
// 		}
// 		// if the frame is silent, just drop it and go on processing
// 		if (isSilent(frame)) continue;

// 		w->compute();

// 		fft->compute();

// 		pool.add("fftFrames", fftFrame);
// 	}

// 	delete fc;
// 	delete w;
// 	delete fft;

// 	return pool.value<std::vector<std::vector<double> > >("fftFrames");
// }


