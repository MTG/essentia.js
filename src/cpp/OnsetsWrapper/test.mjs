import { OnsetsWASM } from './builds/onsets.module.js';

const Onsets = new OnsetsWASM.Onsets(0.1, 5, 44100/512, 0.02);

function createTestMatrix(rows, cols) {
    let out = [];
    for (let i = 0; i < rows; i++) {
        let row = new Float32Array(cols);
        row.forEach( (_, j) => row[j] = Math.random() );
        out.push(row);
    }
    return out;
}

const numberODF = 3;
const timeFrames = 400;
const testMatrix = createTestMatrix(numberODF, timeFrames);
const testWeights = new Float32Array(numberODF);
testWeights.forEach( (_, i) => testWeights[i] = Math.random() );

const onsetsOut = Onsets.compute(testMatrix, testWeights);
console.info("onsetsOut is: ", onsetsOut);

// Probably throw errors if wrong output type
try {
    var onsetsOutArray = OnsetsWASM.vectorToArray(onsetsOut.positions);
} catch (err) {
    console.error('vectorToArray failed: ', err);
}


if (onsetsOutArray instanceof Float32Array) {
    console.log("Number of onsets detected: ", onsetsOutArray.length);
    console.log("Onset positions: ", onsetsOutArray);
    console.log("Test passing!");
}
