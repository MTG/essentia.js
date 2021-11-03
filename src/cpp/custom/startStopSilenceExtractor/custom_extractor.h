#ifndef __EXTRACTOR_EXAMPLE_H__ 
#define __EXTRACTOR_EXAMPLE_H__

#include <vector>
#include <essentia/algorithmfactory.h>
#include <essentia/essentiamath.h>
#include <emscripten/bind.h>

using namespace essentia;
using namespace essentia::standard;
using namespace emscripten;


class StartStopSilenceExtractor {

  public:
    std::string essentiaVersion = essentia::version;

    StartStopSilenceExtractor(const int frameSize=512, const int hopSize=256);

    ~StartStopSilenceExtractor() {};

    void configure(const int frameSize=512, const int hopSize=256);

    val compute(const val& audioData);

    void reset();

    void shutdown();

  private:
    Algorithm* _FrameCutter;
    Algorithm* _StartStopSilence;

};

// convert a Float32 JS typed array into std::vector<float>
// https://github.com/emscripten-core/emscripten/issues/5519#issuecomment-589702756
std::vector<float> float32ArrayToVector(const val &v);

#endif // __EXTRACTOR_EXAMPLE_H__
