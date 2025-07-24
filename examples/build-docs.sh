#!/usr/bin/env bash
set -e -x

tsc --lib ES2015,DOM src/typescript/core_api.ts || exit 1
tsc --lib ES2015,DOM src/typescript/extractor/extractor.ts || exit 1
tsc --lib ES2015,DOM src/typescript/display/plot.ts || exit 1
tsc --lib ES2015,DOM src/typescript/machinelearning/index.ts || exit 1
tsc --lib ES2015,DOM src/typescript/machinelearning/tfjs_input_extractor.ts || exit 1
tsc --lib ES2015,DOM src/typescript/machinelearning/tfjs_models.ts || exit 1

rm -rf docs/api

echo "Generating JS docs"
node node_modules/jsdoc/jsdoc.js \
    -c jsdoc.config.json -t node_modules/foodoc/template \
    -R docs/index.md -u docs/tutorials . || exit 1

mkdir -p docs/api
cp -rf out/. docs/api/
rm -rf out

find src/typescript/ -maxdepth 2 -type f -name "*.js" -delete 