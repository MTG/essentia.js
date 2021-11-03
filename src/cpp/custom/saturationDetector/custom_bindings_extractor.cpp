#include <emscripten/bind.h>
#include "custom_extractor.h"

// expose the extractor class to js using embind templates
EMSCRIPTEN_BINDINGS(Class_Extractor) {
class_<SaturationDetectorExtractor>("SaturationDetectorExtractor")
.constructor<int, int>()
.property("version", &SaturationDetectorExtractor::essentiaVersion)
.function("configure", &SaturationDetectorExtractor::configure)
.function("compute", &SaturationDetectorExtractor::compute)
.function("reset", &SaturationDetectorExtractor::reset)
.function("shutdown", &SaturationDetectorExtractor::shutdown)
;
// utility function to convert a Float32 JS typed array into std::vector<float>
function("arrayToVector", &float32ArrayToVector);
register_vector<float>("VectorFloat");
};
