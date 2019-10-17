/*
 * EssentiaMin.js 
 */

#ifndef ESSENTIAMIN_H
#define ESSENTIAMIN_H

#include <vector>

extern bool esInitStatus;

// EssentiaMin class which includes methods of some selected essentia c++ algos
class EssentiaMin {

    public:
        // to store the current essentia libray version
        std::string essentiaVersion;

        // register essentia algos
        void initState(bool debugger);
        // shutdown essentia instance
        void shutDown();

        // add your essentia example methods here and also define the methods in the essentiamin.cpp file 
        float loudnessVickers(std::vector<float>& signalFrame);
        float zeroCrossingRate(std::vector<float>& signal);
        // std::vector<std::vector<double> > stftExtractor(std::vector<float>& signal, int frameSize, int hopSize);
        std::string keyExtractor(std::vector<float>& signal);

        std::vector<float> spectrum(std::vector<float>& signalFrame);
        std::vector<float> spectrumExtractor(std::vector<float>& signal, int frameSize, int hopSize, std::string windowType);
        std::vector<float> logMelBandsExtractor(std::vector<float>& signal, int numBands, int frameSize, int hopSize, std::string windowType);
        std::vector<float> hpcp(std::vector<float>& signalFrame, bool nonLinear);
        std::vector<float> onsetRate(std::vector<float>& signal);
        std::vector<float> autoCorrelation(std::vector<float>& signal);
        std::vector<float> envelope(std::vector<float>& signal);
        std::vector<float> superFluxExtractor(std::vector<float>& signal, int sampleRate, int frameSize, int hopSize);
        std::vector<std::vector<float> > frameGenerator(std::vector<float>& signal, int frameSize, int hopeSize, std::string windowType);
        // if you want multiple returns, add void functions and pass the output vectors as input
        void mfcc(std::vector<float>& signal, std::vector<float>& mfccBands, std::vector<float>& mfccCoeffs);
        void pitchYin(std::vector<float>& signalFrame, float pitch, float pitchConfidence);
        void pitchProbabilisticYinExtractor(std::vector<float>& signal, std::vector<float>& pitch, std::vector<float>& voicedProbabilities);
        void predominantPitchMelodiaExtractor(std::vector<float>& signal, std::vector<float>& pitch, std::vector<float>& pitchConfidence);
        void bpmHistogram(std::vector<float>& signal, std::vector<float>& bpmEstimates, std::vector<float>& histogram);

        // add your essentia example methods here and also  define the methods in the essentiamin.cpp file
};

#endif  // ESSENTIAMIN_H
