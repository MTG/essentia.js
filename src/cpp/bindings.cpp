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


// std::vector<std::vector<double> > stftExtractor(std::vector<float>& signal, int frameSize, int hopSize) {
//     EssentiaMin essentiaMin;
//     essentiaMin.initState(false);
//     return essentiaMin.stftExtractor(signal, frameSize, hopSize);
// }


std::vector<std::vector<float> > frameGenerator(std::vector<float>& signal, int frameSize, int hopSize, std::string windowType) {
    EssentiaMin essentiaMin;
    essentiaMin.initState(false);
    return essentiaMin.frameGenerator(signal, frameSize, hopSize, windowType);
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


std::vector<float> superFluxExtractor(std::vector<float>& signal, int sampleRate, int frameSize, int hopSize) {
    EssentiaMin essentiaMin;
    essentiaMin.initState(false);
    return essentiaMin.superFluxExtractor(signal, sampleRate, frameSize, hopSize);
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


// expose cpp functions to js using embind wrappers
EMSCRIPTEN_BINDINGS(my_module) {

    // map esszentiamin functions here
    function("initEssentia", &initEssentia);
    function("shutdownEssentia", &shutdownEssentia);
    function("getEssentiaVersion", &getEssentiaVersion);

    // function("stftExtractor", &stftExtractor);
    function("frameGenerator", &frameGenerator);
    function("loudnessVickers", &loudnessVickers);
    function("zeroCrossingRate", &zeroCrossingRate);
    function("spectrum", &spectrum);
    function("hpcp", &hpcp);
    function("pitchYin", &pitchYin);
    function("superFluxExtractor", &superFluxExtractor);
    function("keyExtractor", &keyExtractor);
    function("pitchProbabilisticYinExtractor", &pitchProbabilisticYinExtractor);
    function("predominantPitchMelodiaExtractor", &predominantPitchMelodiaExtractor);
    function("envelopeExtractor", &envelopeExtractor);
    function("spectrumExtractor", &spectrumExtractor);
    function("mfccExtractor", &mfccExtractor);
    function("logMelBandsExtractor", &logMelBandsExtractor);
    function("bpmHistogram", &bpmHistogram);

    // map stl datatypes
    register_vector<int>("VectorInt");
    register_vector<float>("VectorFloat");
    register_vector<double>("VectorDouble");
    register_vector<std::vector<float>>("VectorVectorFloat");
    // register_vector<std::vector<double>>("VectorVectorDouble");
}

