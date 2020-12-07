Module['vectorToArray'] = function(vect) {
  if (!vect) { throw "Null input"};
  if (vect.size() == 0) { throw "Empty vector input"};
  const typedArray = new Float32Array(vect.size());
    for (var i=0; i < vect.size(); i++) {
      typedArray[i] = vect.get(i); 
      // typedArray[i] = parseFloat(typedArray[i].toFixed(2));
    }
  return typedArray;
}

exports.EssentiaWASM = Module
