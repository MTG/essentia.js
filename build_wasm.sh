

LIB_DIR=$EMSCRIPTEN/system/local/lib
$SRC_EMSENTIA_DIR=./src/cpp
$BUILD_EMSENTIA_DIR=./build

emcc  -Oz -c $SRC_B_CPP/emscripten.cpp $SRC_B_CPP/essentiamin.cpp -o $BUILD_EMSENTIA_DIR/emsentia.bc

emcc -Oz BUILD_EMSENTIA_DIR/emsentia.bc $LIB_DIR/libessentia.a $LIB_DIR/libfftw3f.a -o $BUILD_EMSENTIA_DIR/essentiamin.js