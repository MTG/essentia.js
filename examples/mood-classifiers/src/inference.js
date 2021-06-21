importScripts('./lib/tf.min.3.5.0.js');
importScripts('./lib/essentia.js-model.umd.js');

let model;
let modelName = "";
let modelLoaded = false;
let modelReady = false;

const modelTagOrder = {
    'mood_happy': [true, false],
    'mood_sad': [false, true],
    'mood_relaxed': [false, true],
    'mood_aggressive': [true, false],
    'danceability': [true, false]
};

function initModel() {
    model = new EssentiaModel.TensorflowMusiCNN(tf, getModelURL(modelName));
    
    loadModel(modelName).then((isLoaded) => {
        if (isLoaded) {
            modelLoaded = true;
            // perform dry run to warm them up
            warmUp();
        } 
    });
}

function getModelURL() {
    return `../models/${modelName}-musicnn-msd-2/model.json`;
}

async function loadModel() {
    await model.initialize();
    // warm-up: perform dry run to prepare WebGL shader operations
    console.info(`Model ${modelName} has been loaded!`);
    return true;
}

function warmUp() {
    const fakeFeatures = {
        melSpectrum: getZeroMatrix(187, 96),
        frameSize: 187,
        melBandsSize: 96,
        patchSize: 187
    };

    const fakeStart = Date.now();

    model.predict(fakeFeatures, false).then(() => {
        console.info(`${modelName}: Warm up inference took: ${Date.now() - fakeStart}`);
        modelReady = true;
        if (modelLoaded && modelReady) console.log(`${modelName} loaded and ready.`);
    });
}

async function initTensorflowWASM() {
    if (tf.getBackend() != 'wasm') {
        importScripts('./lib/tf-backend-wasm-3.5.0.js');
        // importScripts('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm/dist/tf-backend-wasm.js');
        tf.setBackend('wasm');
        tf.ready().then(() => {
            console.info('tfjs WASM backend successfully initialized!');
            initModel();
        }).catch(() => {
            console.error(`tfjs WASM could NOT be initialized, defaulting to ${tf.getBackend()}`);
            return false;
        });
    }
}


function outputPredictions(p) {
    postMessage({
        predictions: p
    });
}

function twoValuesAverage (arrayOfArrays) {
    let firstValues = [];
    let secondValues = [];

    arrayOfArrays.forEach((v) => {
        firstValues.push(v[0]);
        secondValues.push(v[1]);
    });

    const firstValuesAvg = firstValues.reduce((acc, val) => acc + val) / firstValues.length;
    const secondValuesAvg = secondValues.reduce((acc, val) => acc + val) / secondValues.length;

    return [firstValuesAvg, secondValuesAvg];
}

function modelPredict(features) {
    if (modelReady) {
        const inferenceStart = Date.now();

        model.predict(features, true).then((predictions) => {
            const summarizedPredictions = twoValuesAverage(predictions);
            // format predictions, grab only positive one
            const results = summarizedPredictions.filter((_, i) => modelTagOrder[modelName][i])[0];

            console.info(`${modelName}: Inference took: ${Date.now() - inferenceStart}`);
            // output to main thread
            outputPredictions(results);
            model.dispose();
        });
    }
}

function getZeroMatrix(x, y) {
    let matrix = new Array(x);
    for (let f = 0; f < x; f++) {
        matrix[f] = new Array(y).fill(0);
    }
    return matrix;
}


onmessage = function listenToMainThread(msg) {
    // listen for audio features
    if (msg.data.name) {
        modelName = msg.data.name;
        initTensorflowWASM();
    } else if (msg.data.features) {
        console.log("From inference worker: I've got features!");
        // should/can this eventhandler run async functions
        modelPredict(msg.data.features);
    }
};
