#!/usr/bin/env bash
tsc src/typescript/core_api.ts || exit 1
tsc src/typescript/extractor.ts || exit 1
tsc src/typescript/plot.ts || exit 1

echo "Generating js docs"
node node_modules/jsdoc/jsdoc.js \
    -c jsdoc.config.json -t node_modules/foodoc/template \
    -R docs/index.md -u docs/tutorials . || exit 1

mkdir -p docs/api
cp -rf out/. docs/api/
rm -rf ./out