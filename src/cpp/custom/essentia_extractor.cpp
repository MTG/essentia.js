/*
 * Copyright (C) 2006-2020  Music Technology Group - Universitat Pompeu Fabra
 *
 * This file is part of Essentia
 *
 * Essentia is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation (FSF), either version 3 of the License, or (at your
 * option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more
 * details.
 *
 * You should have received a copy of the Affero GNU General Public License
 * version 3 along with this program.  If not, see http://www.gnu.org/licenses/
 */

#include <stdio.h>
#include <essentia/algorithmfactory.h>
#include <essentia/essentiamath.h>
#include <essentia/pool.h>
#include "essentia_extractor.h"
 
using namespace essentia;
using namespace essentia::standard;

// set to false to initialize essentia algo registry for the very first time
bool esInitStatus = false;

// method to instantiate the essentia algo registry with an optional to use debug mode 
void EssentiaExtractor::initState(bool debugger) {
	// if true sets essentia debugger active
	if (debugger) {
		setDebugLevel(EAll); // EAll is a special value in essentia that contains all modules
		unsetDebugLevel(EMemory | EConnectors);
		essentia::warningLevelActive = true; // activate warnings
		essentia::infoLevelActive = true;  // activate info
		essentia::errorLevelActive = true;  // activate error level
	}
	// if needed, init essentia algorithm registry
	if (!esInitStatus) {
		essentia::init();
	 	esInitStatus = true;
		essentiaVersion = essentia::version;
  }
}

// method to shutdown essentia instance
void EssentiaExtractor::shutDown() {
	essentia::shutdown();
	esInitStatus = false;
}

// Method for frameCutting with windowing from a given audio signal
std::vector<std::vector<float> > EssentiaExtractor::frameGenerator(std::vector<float>& signal, int frameSize, int hopSize) {

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
std::vector<float> EssentiaExtractor::windowing(std::vector<float>& signalFrame, std::string windowType) {

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

// https://essentia.upf.edu/documentation/reference/std_Danceability.html
float EssentiaExtractor::danceability(std::vector<float>& signal) {

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
void EssentiaExtractor::pitchYin(std::vector<float>& signalFrame, float pitch, float pitchConfidence) {

	AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
	Algorithm* pitchyin = factory.create("PitchYin");
	pitchyin->input("signal").set(signalFrame);
	pitchyin->output("pitch").set(pitch);
	pitchyin->output("pitchConfidence").set(pitchConfidence);
	pitchyin->compute();
	delete pitchyin;
}

// Check https://essentia.upf.edu/documentation/reference/std_RhythmDescriptors.html
void EssentiaExtractor::bpmHistogram(std::vector<float>& signal, std::vector<float>& bpmEstimates, std::vector<float>& histogram) {

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

// check https://essentia.upf.edu/documentation/reference/std_ChordsDetection.html
void EssentiaExtractor::chordDetection(std::vector<float>& chroma, int hopSize, std::vector<std::string>& chords, std::vector<float>& strength) {

	AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
	Algorithm* chordsDetect = factory.create("ChordsDetection",
											                     "hopSize", hopSize);
	std::vector<std::vector<float> > chromaVector;
	chromaVector.push_back(chroma);
	chordsDetect->input("pcp").set(chromaVector);
	chordsDetect->output("chords").set(chords);
	chordsDetect->output("strength").set(strength);
	chordsDetect->compute();
	delete chordsDetect;
}

// check https://essentia.upf.edu/documentation/reference/std_HPCP.html
std::vector<float> EssentiaExtractor::hpcp(std::vector<float>& signalFrame, bool nonLinear) {

	AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
	Algorithm* spec = factory.create("Spectrum");
	Algorithm* peaks = factory.create("SpectralPeaks");
	Algorithm* white = factory.create("SpectralWhitening");
	Algorithm* hpcp = factory.create("HPCP",
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
  // delete algos
	delete spec;
	delete peaks;
	delete white;
	delete hpcp;
	return hpcpVector;
}


// check https://essentia.upf.edu/documentation/reference/std_BeatTrackerMultiFeature.html
void EssentiaExtractor::beatTrackerMultiFeature(std::vector<float>& signal, std::vector<float>& ticks, float confidence) {

	AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
	Algorithm* beatTracker = factory.create("BeatTrackerMultiFeature");
	beatTracker->input("signal").set(signal);
	beatTracker->output("ticks").set(ticks);
	beatTracker->output("confidence").set(confidence);
	beatTracker->compute();
	delete beatTracker;
}

// Check https://essentia.upf.edu/documentation/reference/std_PitchYinProbabilistic.html
void EssentiaExtractor::pitchProbabilisticYinExtractor(std::vector<float>& signal, std::vector<float>& pitch, std::vector<float>& voicedProbabilities) {

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
void EssentiaExtractor::pitchMelodiaExtractor(std::vector<float>& signal, std::vector<float>& pitch, std::vector<float>& pitchConfidence) {
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
void EssentiaExtractor::predominantPitchMelodiaExtractor(std::vector<float>& signal, std::vector<float>& pitch, std::vector<float>& pitchConfidence) {

	AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
	Algorithm* eqloud	= factory.create("EqualLoudness");
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

void EssentiaExtractor::mfcc(std::vector<float>& signal, std::vector<float>& mfccBands, std::vector<float>& mfccCoeffs) {
	/////// PARAMS //////////////
	int frameSize = 2048;
	int hopSize = 1024;
	// we want to compute the MFCC of a input signal: we need the create the following:
	// audioloader -> framecutter -> windowing -> FFT -> MFCC
	AlgorithmFactory& factory = standard::AlgorithmFactory::instance();

	Algorithm* fc = factory.create("FrameCutter",
									      "frameSize", frameSize,
									      "hopSize", hopSize);
	Algorithm* w = factory.create("Windowing",
									      "type", "blackmanharris62");
	Algorithm* spec = factory.create("Spectrum");
	Algorithm* mfcc = factory.create("MFCC");
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

// Computes magnitude spectrum for each frames of a given audio signal
std::vector<float> EssentiaExtractor::spectrumExtractor(std::vector<float>& signal, int frameSize=1024, int hopSize=1024, std::string windowType="hann") {
  // framecutter -> windowing -> FFT 
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* fc = factory.create("FrameCutter",
									   	           "frameSize", frameSize,
									   	           "hopSize", hopSize,
									               "startFromZero", true);
  Algorithm* w = factory.create("Windowing",
									              "type", "hann",
									              "zeroPadding", frameSize);
  Algorithm* spec = factory.create("Spectrum",
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

// extract mel spectrogram for a given signal frame
std::vector<float> EssentiaExtractor::logMelSpectrogram(std::vector<float>& spectrumFrame, int numBands) {

  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* mel = factory.create("MelBands",
								                  "numberBands", numBands,
								                  "type", "magnitude");
  Algorithm* logNorm = factory.create("UnaryOperator",
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

// 
std::vector<float> EssentiaExtractor::logMelSpectrogramExtractor(std::vector<float>& signal, int numBands, int frameSize, int hopSize, std::string windowType) {
  // we want to compute the MFCC of a input signal: we need the create the following:
  // vector -> framecutter -> windowing -> FFT -> MFCC -> PoolStorage
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* fc = factory.create("FrameCutter",
									   	          "frameSize", frameSize,
									   	          "hopSize", hopSize,
									              "startFromZero", true);
  Algorithm* w = factory.create("Windowing",
									              "type", windowType,
									              "zeroPadding", frameSize);
  Algorithm* spec = factory.create("Spectrum",
									                "size", frameSize);
  Algorithm* mel = factory.create("MelBands",
								                  "numberBands", numBands,
								                  "type", "magnitude");
  Algorithm* logNorm = factory.create("UnaryOperator",
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
void EssentiaExtractor::loudnessEBUR128(std::vector<float>& signal, std::vector<float>& momLoudness, std::vector<float>& shortLoudness, float integrateLoudness, float loudRange) {
	AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
	Algorithm* loudnessEbur = factory.create("LoudnessEBUR128");
	std::vector<std::vector<float> > stereoSignal;
	// hack to work on mono audio signal
	stereoSignal.push_back(signal);
  for (size_t i=0; i<signal.size(); i++) {
    stereoSignal[i].push_back(signal[i]);
  }
	loudnessEbur->input("signal").set(stereoSignal);
	loudnessEbur->output("momentaryLoudness").set(momLoudness);
	loudnessEbur->output("shortTermLoudness").set(shortLoudness);
	loudnessEbur->output("integratedLoudness").set(integrateLoudness);
	loudnessEbur->output("loudnessRange").set(loudRange);

	loudnessEbur->compute();
	delete loudnessEbur;
}
