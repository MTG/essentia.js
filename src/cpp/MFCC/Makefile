EIGEN_PATH=/usr/local/include/eigen3
LIB_DIR_ESSENTIA=$(EMSCRIPTEN)/system/local/lib
ESSENTIA_JS_WEB=mfcc.web.js
ESSENTIA_JS_WEB_WASM=mfcc.web.wasm
ESSENTIA_JS_MODULE=mfcc.umd.js
PRE_JS_WASM=../../js/wasm.module.pre.js
POST_JS_WEB_WASM=../../js/wasm.webmodule.post.js
POST_JS_ES6_WASM=./wasm.umd.post.js

build:
	@echo "Compiling the Essentia object-oriented MFCC algo"
	# Async builds for html imports ...
	@emcc -I $(EIGEN_PATH) \
	   --bind -Oz bindings_mfcc.cpp mfcc.cpp ${LIB_DIR_ESSENTIA}/essentia.a \
	   -s WASM=1 \
	   -o $(ESSENTIA_JS_WEB) \
	   -s EXCEPTION_DEBUG \
	   -s ASSERTIONS=2 \
	   -s ENVIRONMENT=web \
	   -s MODULARIZE=1 \
	   -s EXPORT_NAME="EssentiaWASM" \
	   --post-js $(POST_JS_WEB_WASM) \
	   -s ALLOW_MEMORY_GROWTH=1 || exit 1	
	
	@echo "Done ..."
	   
	# Sync builds for ES6 import and AudioWorklet support ...
	@emcc -I $(EIGEN_PATH) \
		--bind -Oz bindings_mfcc.cpp mfcc.cpp ${LIB_DIR_ESSENTIA}/essentia.a \
		-s WASM=1 \
		-o $(ESSENTIA_JS_MODULE) \
		-s BINARYEN_ASYNC_COMPILATION=0 \
		-s ALLOW_MEMORY_GROWTH=1 \
		-s SINGLE_FILE=1 || exit 1
	
	@cat $(PRE_JS_WASM) $(ESSENTIA_JS_WEB) > $$.tmp && mv $$.tmp $(ESSENTIA_JS_WEB)
	@cat $(PRE_JS_WASM) $(ESSENTIA_JS_MODULE) > $$.tmp && mv $$.tmp $(ESSENTIA_JS_MODULE)
	@cat $(POST_JS_ES6_WASM) >> $(ESSENTIA_JS_MODULE)

	@echo "Done ..."
