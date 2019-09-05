/*
 * EssentiaMin.js 
 */

#include <stdio.h>
#include <emscripten/bind.h>
#include "./include/essentiamin.h"

using namespace emscripten;


void initEssentia(bool debugMode) {
    EssentiaMin essentiaMin;
    essentiaMin.initState(false);
}


void shutdownEssentia() {
    EssentiaMin essentiaMin;
    essentiaMin.initState(false);
    essentiaMin.shutDown();
}


std::vector<std::vector<float> > frameCutter(std::vector<float>& signal, int frameSize, int hopSize, std::string windowType) {
    EssentiaMin essentiaMin;
    essentiaMin.initState(false);
    return essentiaMin.frameCutter(signal, frameSize, hopSize, windowType);
}


void keyExtractor(std::vector<float>& signal, std::string key, std::string scale, float strength) {
    EssentiaMin essentiaMin;
    essentiaMin.initState(false);
    essentiaMin.keyExtractor(signal, key, scale, strength);
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


float percivalBpmEstimator(std::vector<float>& signal, int sampleRate, int frameSize, int hopSize) {
    EssentiaMin essentiaMin;
    essentiaMin.initState(false);
    return essentiaMin.percivalBpmEstimator(signal, sampleRate, frameSize, hopSize);  
}


std::vector<float> superFluxExtractor(std::vector<float>& signal, int sampleRate, int frameSize, int hopSize) {
    EssentiaMin essentiaMin;
    essentiaMin.initState(false);
    return essentiaMin.superFluxExtractor(signal, sampleRate, frameSize, hopSize);
}


std::vector<float> logMelBandsExtractor(std::vector<float>& signal, int frameSize=1024, int hopSize=1024) {
    EssentiaMin essentiaMin;
    essentiaMin.initState(false);
    return essentiaMin.logMelBands(signal, frameSize, hopSize);
}


std::vector<float> envelopeExtractor(std::vector<float> signal) {
    EssentiaMin essentiaMin;
    essentiaMin.initState(false);
    return essentiaMin.envelope(signal);
}


// expose cpp functions to js using embind wrappers
EMSCRIPTEN_BINDINGS(my_module) {

    // map esszentiamin functions here
    function("initEssentia", &initEssentia);
    function("shutdownEssentia", &shutdownEssentia);

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
    register_vector<std::vector<float>>("VectorVectorFloat");
}

