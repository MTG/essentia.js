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

        // register essentia algos
        void initState(bool debugger);
        // shutdown essentia instance
        void shutDown();

        // add your essentia example methods here and also in the essentiamin.cpp file
        std::vector<std::vector<float> > frameCutter(std::vector<float>& signal, int frameSize, int hopeSize, std::string windowType);

        float percivalBpmEstimator(std::vector<float>& signal, int sampleRate, int frameSize, int hopSize);
        float loudnessVickers(std::vector<float>& signalFrame);
        float zeroCrossingRate(std::vector<float>& signal);
        std::vector<float> onsetRate(std::vector<float>& signal);
        std::vector<float> autoCorrelation(std::vector<float>& signal);
        std::vector<float> envelope(std::vector<float>& signal);
        std::vector<float> logMelBands(std::vector<float>& signal, int frameSize, int hopSize);
        std::vector<float> superFluxExtractor(std::vector<float>& signal, int sampleRate, int frameSize, int hopSize);
        // if you want multiple returns, add void functions and pass the output vectors as input
        void mfcc(std::vector<float>& signal, std::vector<float>& mfccBands, std::vector<float>& mfccCoeffs);
        void keyExtractor(std::vector<float>& signal, std::string key, std::string scale, float strength);
        void pitchYin(std::vector<float>& signalFrame, float pitch, float pitchConfidence);
        void pitchProbabilisticYinExtractor(std::vector<float>& signal, std::vector<float>& pitch, std::vector<float>& voicedProbabilities);
        void predominantPitchMelodiaExtractor(std::vector<float>& signal, std::vector<float>& pitch, std::vector<float>& pitchConfidence);


        // add your essentia example methods here and also in the essentiamin.cpp file
};


// TODO: functions for type conversion 
template <typename T>
std::vector<T> jsArray2Vec(){
    std::vector<T> vec;
    return vec;
}


#endif  // ESSENTIAMIN_H