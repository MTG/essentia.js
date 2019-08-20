
#include <stdio.h>
#include <emscripten.h>
#include "essentiamin.h"


int main(int argc, char const *argv[]) {
    return 0;
}

// add wrappers for essentia algorithms here
extern "C" {
    EMSCRIPTEN_KEEPALIVE void standardOnsetRate(std::string inputAudioFile) {
        EssentiaMin essentiaMin;
        essentiaMin.onsetRate(inputAudioFile);
    }
}
