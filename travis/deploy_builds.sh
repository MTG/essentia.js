set -e -x

cd ./builds
for js in essentia*.js; do
    curl --upload-file "$js"  https://transfer.sh/"$js" -w "\n"
done

for wasmfile in essentia*.wasm; do
    curl --upload-file "$swasmfile"  https://transfer.sh/"$wasmfile" -w "\n"
done
