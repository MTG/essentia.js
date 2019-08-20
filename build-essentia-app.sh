

rm -rf ./build

mkdir ./build

LIB_DIR=$EMSCRIPTEN/system/local/lib
APP_BUILD=./build
TO_INCLUDE_ESS=./src/cpp/include/essentiamin.cpp


printf "\nCompiling the bindings to bitcode ... \n\n"
# compile the app to byte code
emcc --emrun --bind $1 ${TO_INCLUDE_ESS} -o essentiamin.bc || exit 1
# emcc --bind -Oz $1 ${TO_INCLUDE_ESS} -c || exit 1

printf "Linking and compiling the bindings with essentia and fftw to js and wasm files ..\n\n"
# compile the bc to js and wasm by linking the builds of essentia and fftw
#EMCC_DEBUG=1 emcc --emrun --bind -s ASSERTIONS=2 -s SAFE_HEAP=1 -s EXCEPTION_DEBUG -Oz  bindings.o essentiamin.o ${LIB_DIR}/essentia.a ${LIB_DIR}/libfftw3f.a -o ${APP_BUILD}/appout.js -s WASM=0 -s ERROR_ON_UNDEFINED_SYMBOLS=0 || exit 1

EMCC_DEBUG=1 emcc --emrun --bind -s ASSERTIONS=2 -s SAFE_HEAP=1 -s EXCEPTION_DEBUG -Oz  essentiamin.bc ${LIB_DIR}/essentia.a ${LIB_DIR}/libfftw3f.a -o ${APP_BUILD}/essentiamin.js -s WASM=0 -s ERROR_ON_UNDEFINED_SYMBOLS=0 || exit 1


printf "\nCopying builds ...\n\n"
cp -rf ${APP_BUILD}/* ./web/dist/

echo " ... Done ..."