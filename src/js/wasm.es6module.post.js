Module['vectorToArray'] = function(vect) {
  if (!vect) { throw "Null input"};
  if (vect.size() == 0) { throw "Empty vector input"};
  const typedArray = new Float32Array(vect.size());
    for (var i=0; i < vect.size(); i++) {
      typedArray[i] = vect.get(i); 
      typedArray[i] = parseFloat(typedArray[i].toFixed(2));
    }
  return typedArray;
}
// EXPORT_ES6 option does not work as described at
// https://github.com/emscripten-core/emscripten/issues/6284, so we have to
// manually add this to the final builds.
export { Module as EssentiaModule };