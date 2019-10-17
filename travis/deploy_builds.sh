set -e -x

cd ./builds
for js in *.js; do
    curl --upload-file "$js"  https://transfer.sh/"$js" -w "\n"
done

for wasm in *.wasm; do
    curl --upload-file "$swasm"  https://transfer.sh/"$swasm" -w "\n"
done
