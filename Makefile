ESSENTIAJS_VERSION=0.1.3
## Path to libs for Emscripten
LIB_DIR_ESSENTIA=$(EMSCRIPTEN)/system/local/lib
INCLUDE_DIR_ESSENTIA=$(EMSCRIPTEN)/system/local/include
EIGEN_PATH=/usr/local/include/eigen3
## Pass custom build and dist directories using system environment variables
BUILD_DIR_ES := $(or $(ESSENTIAJS_WASM_BUILDS_DIR),builds)
DIST_DIR_ES := $(or $(ESSENTIAJS_BUILDS_DIR),dist)
## C++ source code for Essentia.js
BINDING_ESSENTIAJS=src/cpp/bindings_essentiajs.cpp
INCLUDE_ESSENTIAJS=src/cpp/includes/essentiajs.cpp 
## Define builds
ESSENTIA_JS_WEB=$(BUILD_DIR_ES)/essentia-wasm.web.js
ESSENTIA_JS_WEB_WASM=$(BUILD_DIR_ES)/essentia-wasm.web.wasm
ESSENTIA_JS_MODULE=$(BUILD_DIR_ES)/essentia-wasm.module.js
ESSENTIA_WASM_UMD_MODULE=$(BUILD_DIR_ES)/essentia-wasm.umd.js
ESSENTIA_WASM_ES6_MODULE=$(BUILD_DIR_ES)/essentia-wasm.es.js
## Path to custom --pre-js and --post-js files for Emscripten
PRE_JS_WASM=src/js/wasm.module.pre.js
POST_JS_WEB_WASM=src/js/wasm.webmodule.post.js
POST_JS_ES6_WASM=src/js/wasm.es6module.post.js
POST_JS_UMD_WASM=src/js/wasm.umd.post.js

codegen:
	@echo "Generating cpp source code from essentia python bindings ..."
	@cd src/python && python3 configure_bindings.py

build:
	@mkdir -p $(BUILD_DIR_ES)

	@echo "Compiling + linking emscripten embind cpp bindings directly to js, wasm files ..."

	@echo "... compiling async builds..."
	@emcc -Oz $(BINDING_ESSENTIAJS) $(INCLUDE_ESSENTIAJS) \
	   -lembind -lessentia -L $(LIB_DIR_ESSENTIA) \
		 -I $(EIGEN_PATH) -I $(INCLUDE_DIR_ESSENTIA)\
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

	@echo "... compiling sync builds..."
	@emcc -Oz $(BINDING_ESSENTIAJS) $(INCLUDE_ESSENTIAJS) \
		 -lembind -lessentia -L $(LIB_DIR_ESSENTIA) \
		 -I $(EIGEN_PATH) -I $(INCLUDE_DIR_ESSENTIA)\
	   -s WASM=1 \
	   -o $(ESSENTIA_JS_MODULE) \
	   -s BINARYEN_ASYNC_COMPILATION=0 \
	   -s ALLOW_MEMORY_GROWTH=1 \
	   -s SINGLE_FILE=1 || exit 1

	@cat $(PRE_JS_WASM) $(ESSENTIA_JS_WEB) > $$.tmp && mv $$.tmp $(ESSENTIA_JS_WEB)
	@cat $(PRE_JS_WASM) $(ESSENTIA_JS_MODULE) > $$.tmp && mv $$.tmp $(ESSENTIA_JS_MODULE)

	@cp -f $(ESSENTIA_JS_MODULE) $(ESSENTIA_WASM_ES6_MODULE)
	@cat $(POST_JS_ES6_WASM) >> $(ESSENTIA_WASM_ES6_MODULE)

	@cp -f $(ESSENTIA_JS_MODULE) $(ESSENTIA_WASM_UMD_MODULE)
	@cat $(POST_JS_UMD_WASM) >> $(ESSENTIA_WASM_UMD_MODULE)

	@rm -f $(ESSENTIA_JS_MODULE)

	@mkdir -p $(DIST_DIR_ES)
	@cp -f $(ESSENTIA_JS_WEB) $(DIST_DIR_ES)/
	@cp -f $(ESSENTIA_JS_WEB_WASM) $(DIST_DIR_ES)/
	@cp -f $(ESSENTIA_WASM_UMD_MODULE) $(DIST_DIR_ES)/
	@cp -f $(ESSENTIA_WASM_ES6_MODULE) $(DIST_DIR_ES)/

	@echo "Done ..."

	@echo "Builds ..."
	@ls $(BUILD_DIR_ES)

clean:
	@rm -rf $(BUILD_DIR_ES)
