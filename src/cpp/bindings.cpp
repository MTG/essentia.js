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


void debuggerEssentia(bool mode=false) {
    EssentiaMin essentiaMin;
    essentiaMin.debugMode = mode;
}

void shutdownEssentia() {
    EssentiaMin essentiaMin;
    essentiaMin.shutDown();
}


std::vector<std::vector<float> > frameCutter(std::vector<float>& signal, int frameSize, int hopSize, std::string windowType) {
    EssentiaMin essentiaMin;
    essentiaMin.initState(essentiaMin.debugMode);
    return essentiaMin.frameCutter(signal, frameSize, hopSize, windowType);
}


void keyExtractor(std::vector<float>& signal, std::string key, std::string scale, float strength) {
    EssentiaMin essentiaMin;
    essentiaMin.initState(essentiaMin.debugMode);
    essentiaMin.keyExtractor(signal, key, scale, strength);
}


void pitchYin(std::vector<float>& signalFrame, float pitch, float pitchConfidence) {
    EssentiaMin essentiaMin;
    essentiaMin.initState(essentiaMin.debugMode);
    essentiaMin.pitchYin(signalFrame, pitch, pitchConfidence);
}


void pitchProbabilisticYinExtractor(std::vector<float>& signal, std::vector<float>& pitch, std::vector<float>& voicedProbabilities) {
    EssentiaMin essentiaMin;
    essentiaMin.initState(essentiaMin.debugMode);
    essentiaMin.pitchProbabilisticYinExtractor(signal, pitch, voicedProbabilities);
}


void predominantPitchMelodiaExtractor(std::vector<float>& signal, std::vector<float>& pitch, std::vector<float>& pitchConfidence) {
    EssentiaMin essentiaMin;
    essentiaMin.initState(essentiaMin.debugMode);
    essentiaMin.predominantPitchMelodiaExtractor(signal, pitch, pitchConfidence);
}


void mfccExtractor(std::vector<float>& signal, std::vector<float>& mfccBands, std::vector<float>& mfccCoeffs) {
    EssentiaMin essentiaMin;
    essentiaMin.initState(essentiaMin.debugMode);
    essentiaMin.mfcc(signal, mfccBands, mfccCoeffs);  
};


float loudnessVickers(std::vector<float>& signalFrame) {
    EssentiaMin essentiaMin;
    essentiaMin.initState(essentiaMin.debugMode);
    return essentiaMin.loudnessVickers(signalFrame);  
}


float zeroCrossingRate(std::vector<float>& signal) {
    EssentiaMin essentiaMin;
    essentiaMin.initState(essentiaMin.debugMode);
    return essentiaMin.zeroCrossingRate(signal);  
}


float percivalBpmEstimator(std::vector<float>& signal, int sampleRate, int frameSize, int hopSize) {
    EssentiaMin essentiaMin;
    essentiaMin.initState(essentiaMin.debugMode);
    return essentiaMin.percivalBpmEstimator(signal, sampleRate, frameSize, hopSize);  
}


std::vector<float> superFluxExtractor(std::vector<float>& signal, int sampleRate, int frameSize, int hopSize) {
    EssentiaMin essentiaMin;
    essentiaMin.initState(essentiaMin.debugMode);
    return essentiaMin.superFluxExtractor(signal, sampleRate, frameSize, hopSize);
}


std::vector<float> logMelBandsExtractor(std::vector<float>& signal, int frameSize=1024, int hopSize=1024) {
    EssentiaMin essentiaMin;
    essentiaMin.initState(essentiaMin.debugMode);
    return essentiaMin.logMelBands(signal, frameSize, hopSize);
}


std::vector<float> envelopeExtractor(std::vector<float> signal) {
    EssentiaMin essentiaMin;
    essentiaMin.initState(essentiaMin.debugMode);
    return essentiaMin.envelope(signal);
}


EMSCRIPTEN_BINDINGS(my_module) {
    // map esszentiamin functions here
    function("initEssentia", &initEssentia);
    function("shutdownEssentia", &shutdownEssentia);
    function("debuggerEssentia", &debuggerEssentia);

    function("frameCutter", &frameCutter);
    function("loudnessVickers", &loudnessVickers);
    function("zeroCrossingRate", &zeroCrossingRate);
    function("percivalBpmEstimator", &percivalBpmEstimator);
    function("pitchYin", &pitchYin);
    function("superFluxExtractor", &superFluxExtractor);
    function("keyExtractor", &keyExtractor);
    function("pitchProbabilisticYinExtractor", &pitchProbabilisticYinExtractor);
    function("predominantPitchMelodiaExtractor", &predominantPitchMelodiaExtractor);
    function("envelopeExtractor", &envelopeExtractor);
    function("mfccExtractor", &mfccExtractor);
    function("logMelBandsExtractor", &logMelBandsExtractor);

    // map stl datatypes
    register_vector<int>("VectorInt");
    register_vector<float>("VectorFloat");
    register_vector<double>("VectorDouble");
}

