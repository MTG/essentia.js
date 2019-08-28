/*
 * EssentiaMin.js 
 */

#ifndef ESSENTIAMIN_H
#define ESSENTIAMIN_H

#include <vector>

// EssentiaMin class which includes methods of some selected essentia c++ algos
class EssentiaMin {

    public:
        bool initStatus = false;
        bool debugMode = false;

        // add your essentia example methods here
        void initState(bool debugger);
        void shutDown();
        std::vector<float> onsetRate(std::vector<float>& signal);
        std::vector<float> autoCorrelation(std::vector<float>& signal);
        std::vector<float> envelope(std::vector<float>& signal);
        std::vector<float> logMelBands(std::vector<float>& signal, int frameSize, int hopSize);
        // if you want multiple returns, add void functions and pass the output vectors as input
        void mfcc(std::vector<float>& signal, std::vector<float>& mfccBands, std::vector<float>& mfccCoeffs);

        // add your essentia example methods here
};


// TODO: functions for type conversion 
template <typename T>
std::vector<T> jsArray2Vec(){
    std::vector<T> vec;
    return vec;
}


#endif  // ESSENTIAMIN_H