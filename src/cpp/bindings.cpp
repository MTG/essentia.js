/*
 * EssentiaMin.js 
 */

#include <stdio.h>
#include <emscripten/bind.h>
#include "./include/essentiamin.h"

using namespace emscripten;


void initEssentia(bool debugMode) {
    EssentiaMin essentiaMin;
    essentiaMin.initState(debugMode);
}


void shutdownEssentia() {
    EssentiaMin essentiaMin;
    essentiaMin.shutDown();
}


std::string getEssentiaVersion() {
    EssentiaMin essentiaMin;
    essentiaMin.initState(false);
    return essentiaMin.essentiaVersion;
}


std::vector<float> windowing(std::vector<float>& signalFrame, std::string windowType) {
    EssentiaMin essentiaMin;
    essentiaMin.initState(false);
    return essentiaMin.windowing(signalFrame, windowType);
}


std::vector<std::vector<float> > frameGenerator(std::vector<float>& signal, int frameSize, int hopSize) {
    EssentiaMin essentiaMin;
    essentiaMin.initState(false);
    return essentiaMin.frameGenerator(signal, frameSize, hopSize);
}


void bpmHistogram(std::vector<float>& signal, std::vector<float>& bpmEstimates, std::vector<float>& histogram) {
    EssentiaMin essentiaMin;
    essentiaMin.initState(false);
    essentiaMin.bpmHistogram(signal, bpmEstimates, histogram);
}


std::string keyExtractor(std::vector<float>& signal) {
    EssentiaMin essentiaMin;
    essentiaMin.initState(false);
    return essentiaMin.keyExtractor(signal);
}


void key(std::vector<float>& chroma, std::string profileType, std::vector<std::string> keyFeatures, float strength) {
    EssentiaMin essentiaMin;
    essentiaMin.initState(false);
    essentiaMin.key(chroma, profileType, keyFeatures, strength);
}


std::vector<float> hpcp(std::vector<float>& signalFrame, bool nonLinear) {
    EssentiaMin essentiaMin;
    essentiaMin.initState(false);
    return essentiaMin.hpcp(signalFrame, nonLinear);
}


void pitchYin(std::vector<float>& signalFrame, float pitch, float pitchConfidence) {
    EssentiaMin essentiaMin;
    essentiaMin.initState(false);
    essentiaMin.pitchYin(signalFrame, pitch, pitchConfidence);
}


void pitchProbabilisticYinExtractor(std::vector<float>& signal, std::vector<float>& pitch, std::vector<float>& voicedProbabilities) {
    EssentiaMin essentiaMin;
    essentiaMin.initState(false);
    essentiaMin.pitchProbabilisticYinExtractor(signal, pitch, voicedProbabilities);
}


void pitchMelodiaExtractor(std::vector<float>& signal, std::vector<float>& pitch, std::vector<float>& pitchConfidence) {
    EssentiaMin essentiaMin;
    essentiaMin.initState(false);
    essentiaMin.pitchMelodiaExtractor(signal, pitch, pitchConfidence);
}


void predominantPitchMelodiaExtractor(std::vector<float>& signal, std::vector<float>& pitch, std::vector<float>& pitchConfidence) {
    EssentiaMin essentiaMin;
    essentiaMin.initState(false);
    essentiaMin.predominantPitchMelodiaExtractor(signal, pitch, pitchConfidence);
}


void mfccExtractor(std::vector<float>& signal, std::vector<float>& mfccBands, std::vector<float>& mfccCoeffs) {
    EssentiaMin essentiaMin;
    essentiaMin.initState(false);
    essentiaMin.mfcc(signal, mfccBands, mfccCoeffs);  
};


void chordExtractor(std::vector<float>& chroma,  int hopSize, std::vector<std::string>& chords, std::vector<float>& strength) {
    EssentiaMin essentiaMin;
    essentiaMin.initState(false);
    essentiaMin.chordDetection(chroma, hopSize, chords, strength);
}


float loudnessVickers(std::vector<float>& signalFrame) {
    EssentiaMin essentiaMin;
    essentiaMin.initState(false);
    return essentiaMin.loudnessVickers(signalFrame);  
}


float zeroCrossingRate(std::vector<float>& signal) {
    EssentiaMin essentiaMin;
    essentiaMin.initState(false);
    return essentiaMin.zeroCrossingRate(signal);  
}


float danceability(std::vector<float>& signal) {
    EssentiaMin essentiaMin;
    essentiaMin.initState(false);
    return essentiaMin.danceability(signal);
}


std::vector<float> superFluxExtractor(std::vector<float>& signal, int sampleRate, int frameSize, int hopSize) {
    EssentiaMin essentiaMin;
    essentiaMin.initState(false);
    return essentiaMin.superFluxExtractor(signal, sampleRate, frameSize, hopSize);
}


std::vector<float> logMelBands(std::vector<float>& spectrumFrame, int numBands) {
    EssentiaMin essentiaMin;
    essentiaMin.initState(false);
    return essentiaMin.logMelBands(spectrumFrame, numBands);
}


std::vector<float> logMelBandsExtractor(std::vector<float>& signal, int numBands, int frameSize, int hopSize, std::string windowType) {
    EssentiaMin essentiaMin;
    essentiaMin.initState(false);
    return essentiaMin.logMelBandsExtractor(signal, numBands,frameSize, hopSize, windowType);
}


std::vector<float> envelopeExtractor(std::vector<float> signal) {
    EssentiaMin essentiaMin;
    essentiaMin.initState(false);
    return essentiaMin.envelope(signal);
}


std::vector<float> spectrum(std::vector<float>& signal) {
    EssentiaMin essentiaMin;
    essentiaMin.initState(false);
    return essentiaMin.spectrum(signal);
}


std::vector<float> spectrumExtractor(std::vector<float>& signal, int frameSize, int hopSize, std::string windowType) {
    EssentiaMin essentiaMin;
    essentiaMin.initState(false);
    return essentiaMin.spectrumExtractor(signal, frameSize, hopSize, windowType);
}


std::vector<float> noveltyCurve(std::vector<float>& spectrumFrame) {
    EssentiaMin essentiaMin;
    essentiaMin.initState(false);
    return essentiaMin.noveltyCurve(spectrumFrame);
}


std::vector<float> superfluxNoveltyCurve(std::vector<float>& spectrumFrame) {
    EssentiaMin essentiaMin;
    essentiaMin.initState(false);
    return essentiaMin.superfluxNoveltyCurve(spectrumFrame);
}


std::vector<float> onsetDetectionGlobal(std::vector<float>& signal) {
    EssentiaMin essentiaMin;
    essentiaMin.initState(false);
    return essentiaMin.onsetDetectionGlobal(signal);
}


void beatTrackerMultiFeature(std::vector<float>& signal, std::vector<float>& ticks, float confidence) {
    EssentiaMin essentiaMin;
    essentiaMin.initState(false);
    essentiaMin.beatTrackerMultiFeature(signal, ticks, confidence);
}


void loudnessEBUR128(std::vector<float>& signal, std::vector<float>& momLoudness, std::vector<float>& shortLoudness, float integrateLoudness, float loudRange) {
    EssentiaMin essentiaMin;
    essentiaMin.initState(false);
    essentiaMin.loudnessEBUR128(signal, momLoudness, shortLoudness, integrateLoudness, loudRange);
}

// expose cpp functions to js using embind wrappers
EMSCRIPTEN_BINDINGS(my_module) {

    // map essentiamin functions here
    function("initEssentia", &initEssentia);
    function("shutdownEssentia", &shutdownEssentia);
    function("getEssentiaVersion", &getEssentiaVersion);
    function("windowing", &windowing);
    function("frameGenerator", &frameGenerator);
    function("loudnessVickers", &loudnessVickers);
    function("zeroCrossingRate", &zeroCrossingRate);
    function("spectrum", &spectrum);
    function("noveltyCurve", &noveltyCurve);
    function("onsetDetectionGlobal", &onsetDetectionGlobal);
    function("superfluxNoveltyCurve", &superfluxNoveltyCurve);
    function("danceability", &danceability);
    function("beatTrackerMultiFeature", &beatTrackerMultiFeature);
    function("hpcp", &hpcp);
    function("pitchYin", &pitchYin);
    function("superFluxExtractor", &superFluxExtractor);
    function("key", &key);
    function("keyExtractor", &keyExtractor);
    function("pitchMelodiaExtractor", &pitchMelodiaExtractor);
    function("pitchProbabilisticYinExtractor", &pitchProbabilisticYinExtractor);
    function("predominantPitchMelodiaExtractor", &predominantPitchMelodiaExtractor);
    function("envelopeExtractor", &envelopeExtractor);
    function("spectrumExtractor", &spectrumExtractor);
    function("mfccExtractor", &mfccExtractor);
    function("logMelBands", &logMelBands);
    function("logMelBandsExtractor", &logMelBandsExtractor);
    function("bpmHistogram", &bpmHistogram);
    function("chordExtractor", &chordExtractor);
    function("loudnessEBUR128", &loudnessEBUR128);

    // map stl datatypes (eg. var x = new Module.VectorFloat(); )
    register_vector<int>("VectorInt");
    register_vector<float>("VectorFloat");
    register_vector<double>("VectorDouble");
    register_vector<std::string>("VectorString");
    // 2D std vectors
    register_vector<std::vector<float>>("VectorVectorFloat");
    // register_vector<std::vector<double>>("VectorVectorDouble");
}

