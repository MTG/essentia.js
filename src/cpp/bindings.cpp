/*
 * EssentiaMin.js 
 */

#include <stdio.h>
#include <emscripten/bind.h>
#include "./include/essentiamin.h"


using namespace emscripten;


void mfcc(std::vector<float>& signal, std::vector<float>& mfccBands, std::vector<float>& mfccCoeffs) {
    
    EssentiaMin essentiaMin;
    essentiaMin.initState(essentiaMin.debugMode);
    essentiaMin.mfcc(signal, mfccBands, mfccCoeffs);
    essentiaMin.shutDown();  
};


std::vector<float> logMelBands(std::vector<float>& signal, int frameSize=1024, int hopSize=1024) {

    EssentiaMin essentiaMin;

    if (!essentiaMin.initStatus) {
        essentiaMin.initState(essentiaMin.debugMode);
    }
    return essentiaMin.logMelBands(signal, frameSize, hopSize);
}


std::vector<float> standardOnsetRate(std::vector<float>& signal) {
    
    EssentiaMin essentiaMin;

    if (!essentiaMin.initStatus) {
        essentiaMin.initState(essentiaMin.debugMode);
    }

    return essentiaMin.onsetRate(signal);  
};


std::vector<float> standardAutoCorrelation(std::vector<float> signal) {
    
    EssentiaMin essentiaMin;

    if (!essentiaMin.initStatus) {
        essentiaMin.initState(essentiaMin.debugMode);
    }

    return essentiaMin.autoCorrelation(signal);  
};


std::vector<float> envelope(std::vector<float> signal) {

    EssentiaMin essentiaMin;

    if (!essentiaMin.initStatus) {
        essentiaMin.initState(essentiaMin.debugMode);
    }

    return essentiaMin.envelope(signal);
}


void initEssentia(bool debugMode) {
    EssentiaMin essentiaMin;
    essentiaMin.initState(debugMode);
}


void debuggerEssentia(bool mode=false) {
    EssentiaMin essentiaMin;
    essentiaMin.debugMode = mode;
    essentiaMin.initStatus = mode;
}

void shutdownEssentia() {
    EssentiaMin essentiaMin;
    essentiaMin.shutDown();
}


EMSCRIPTEN_BINDINGS(my_module) {
    // map esszentiamin functions here
    function("initEssentia", &initEssentia);
    function("shutdownEssentia", &shutdownEssentia);
    function("debuggerEssentia", &debuggerEssentia);

    function("envelope", &envelope);
    function("standardOnsetRate", &standardOnsetRate);
    function("standardAutoCorrelation", &standardAutoCorrelation);
    function("mfcc", &mfcc);
    function("logMelBands", &logMelBands);

    // map stl datatypes
    register_vector<int>("VectorInt");
    register_vector<float>("VectorFloat");
    register_vector<double>("VectorDouble");
}

