
#include <stdio.h>
#include <math.h>
#include <emscripten.h>
#include <emscripten/bind.h>

using namespace emscripten;


int squareTest (int num) {
	return num * num; 
}


float normArray(const std::vector<float>& array) {
	if (array.empty()) {
		emscripten_run_script("console.log('trying to calculate norm of empty array')");
	}
	float sum = (float) 0.0;
	for (int i=0; i<array.size(); i++) {
		sum += array[i] * array[i];
	}
	return sqrt(sum);
}


EMSCRIPTEN_BINDINGS(my_module) {
	function("squareTest", &squareTest);
	function("normArray", &normArray);
	register_vector<float>("VectorFloat");
}





