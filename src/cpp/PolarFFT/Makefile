EIGEN_PATH=/usr/local/include/eigen3
LIB_DIR_ESSENTIA=$(EMSCRIPTEN)/system/local/lib
ESSENTIA_JS_WEB=polarFFT.web.js
ESSENTIA_JS_WEB_WASM=polarFFT.web.wasm
ESSENTIA_JS_MODULE=polarFFT.module.js
PRE_JS_WASM=../../js/wasm.module.pre.js
POST_JS_WEB_WASM=../../js/wasm.webmodule.post.js
POST_JS_ES6_WASM=./wasm.module.post.js

build:
	@echo "Compiling the Essentia custom cpp extractor"
	# Async builds for html imports ...
	@emcc -I $(EIGEN_PATH) \
	   --bind -Oz bindings_polarFFT.cpp polarFFT.cpp ${LIB_DIR_ESSENTIA}/essentia.a \
	   -s WASM=1 \
	   -o $(ESSENTIA_JS_WEB) \
	   -s EXCEPTION_DEBUG \
	   -s ASSERTIONS=2 \
	   -s ENVIRONMENT=web \
	   -s MODULARIZE=1 \
	   -s EXPORT_NAME="PolarFFTWASM" \
	   --post-js $(POST_JS_WEB_WASM) \
	   -s ALLOW_MEMORY_GROWTH=1 || exit 1	
	
	@echo "Done ..."
	   
	# Sync builds for ES6 import and AudioWorklet support ...
	@emcc -I $(EIGEN_PATH) \
		--bind -Oz bindings_polarFFT.cpp polarFFT.cpp ${LIB_DIR_ESSENTIA}/essentia.a \
		-s WASM=1 \
		-o $(ESSENTIA_JS_MODULE) \
		-s BINARYEN_ASYNC_COMPILATION=0 \
		-s ALLOW_MEMORY_GROWTH=1 \
		-s SINGLE_FILE=1 || exit 1
	
	@cat $(PRE_JS_WASM) $(ESSENTIA_JS_WEB) > $$.tmp && mv $$.tmp $(ESSENTIA_JS_WEB)
	@cat $(PRE_JS_WASM) $(ESSENTIA_JS_MODULE) > $$.tmp && mv $$.tmp $(ESSENTIA_JS_MODULE)
	@cat $(POST_JS_ES6_WASM) >> $(ESSENTIA_JS_MODULE)

	@echo "Done ..."
