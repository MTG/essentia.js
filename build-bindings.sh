#!/usr/bin/env bash

# EMSCRIPTEN=/Users/apple/myemcc/emsdk/fastcomp/emscripten
# local-env variables
ESSENTIAJS_VERSION=0.0.1
LIB_DIR=$EMSCRIPTEN/system/local/lib
APP_BUILD=builds
BINDING_CPP=src/cpp/bindings.cpp
TO_INCLUDE_ESS=src/cpp/include/essentiamin.cpp

rm -rf ./builds
mkdir ./builds

printf "\nCompiling the bindings to bitcode ... \n\n"
# compile the app to byte code
emcc --emrun --bind -Oz ${BINDING_CPP} ${TO_INCLUDE_ESS} -o essentiamin.bc -s EXCEPTION_DEBUG -s ASSERTIONS=2 -s DISABLE_EXCEPTION_CATCHING=2 || exit 1
# emcc --bind -Oz $1 ${TO_INCLUDE_ESS} -c || exit 1

printf "Linking and compiling the bindings with essentia to js, wasm files ...\n\n"

# without emcc debug mode
emcc --emrun --bind -Oz essentiamin.bc ${LIB_DIR}/essentia.a -o ${APP_BUILD}/essentiamin-${ESSENTIAJS_VERSION}.js -s WASM=1 -s EXCEPTION_DEBUG -s ASSERTIONS=2 -s DISABLE_EXCEPTION_CATCHING=2 -s ALLOW_MEMORY_GROWTH=1 || exit 1
#EMCC_DEBUG=1 (for compiling in debug mode of emcc compiler)

printf "Removing unnecessary files ...\n\n"
rm essentiamin.bc

printf "essentia.js and wasm modules are succesfully built ....\n\n"

for file in ${APP_BUILD}/*
do
    if [[ -f $file ]]; then
        echo $file
    fi
done
