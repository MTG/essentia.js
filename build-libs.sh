#!/usr/bin/env bash
set -e -x

# Custom path to the node installation in the essentia-emscripten docker image
# provided along with emsdk. This can be removed once the 
# entrypoint issues in the essentia-emscripten docker image got resolved.
NPM_PATH=/emsdk/node/12.18.1_64bit/bin/npm
NODE_PATH=/emsdk/node/12.18.1_64bit/bin/node
# set permission
ln -sf $NODE_PATH /usr/bin/node

# Generate Essentia.js source code from Essentia docs
$NPM_PATH run gen-code

# Build Essentia WASM backend
$NPM_PATH run build-wasm

# Install essentia.js node dependecies
$NPM_PATH install

# Build essentia.js JS API and add-on modules
$NPM_PATH run build-js-api

# Run tests
echo "Running tests ..."
$NPM_PATH test