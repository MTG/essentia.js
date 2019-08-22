

#include <stdio.h>
#include <emscripten/bind.h>
#include "./include/essentiamin.h"


using namespace emscripten;


std::vector<float> standardOnsetRate(std::vector<float> audioVector) {
    
    EssentiaMin essentiaMin;
    essentiaMin.initState(true);
    return essentiaMin.onsetRate(audioVector);  
};


void testAlgoFact() {
    EssentiaMin essentiaMin;
    essentiaMin.initState(true);
    essentiaMin.testAlgoFactory();
}


std::vector<int> testVec(std::vector<int> items) {

    std::vector<int> outArray(items.size(), 0);

    for (int i=0; i<items.size(); i++) {
        outArray[i] = items[i] * items[i];
        printf("item: %d\n", outArray[i]);
    }
    return outArray;
}


void freeMemory() {
    printf("TODO:\n");
}


EMSCRIPTEN_BINDINGS(my_module) {
    // map esszentiamin functions here
    function("standardOnsetRate", &standardOnsetRate);
    function("testVec", &testVec);
    function("testAlgoFact", &testAlgoFact);
    function("freeMemory", &freeMemory);

    // map stl datatypes
    register_vector<int>("VectorInt");
    register_vector<float>("VectorFloat");
    register_vector<double>("VectorDouble");
}

