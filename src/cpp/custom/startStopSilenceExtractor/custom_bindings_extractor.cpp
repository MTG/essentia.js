#include <emscripten/bind.h>
#include "custom_extractor.h"

// expose the extractor class to js using embind templates
EMSCRIPTEN_BINDINGS(Class_Extractor) {
class_<StartStopSilenceExtractor>("StartStopSilenceExtractor")
.constructor<int, int>()
.property("version", &StartStopSilenceExtractor::essentiaVersion)
.function("configure", &StartStopSilenceExtractor::configure)
.function("compute", &StartStopSilenceExtractor::compute)
.function("reset", &StartStopSilenceExtractor::reset)
.function("shutdown", &StartStopSilenceExtractor::shutdown)
;
// utility function to convert a Float32 JS typed array into std::vector<float>
function("arrayToVector", &float32ArrayToVector);
register_vector<float>("VectorFloat");
};
