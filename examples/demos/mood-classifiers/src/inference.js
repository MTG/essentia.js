importScripts('./lib/tf.min.3.5.0.js');

let model;
let modelName = "";
let modelLoaded = false;

const modelTagOrder = {
    'mood_happy': [true, false],
    'mood_sad': [false, true],
    'mood_relaxed': [false, true],
    'mood_aggressive': [true, false],
    'danceability': [true, false]
};

async function initModel() {
    model = await tf.loadGraphModel(getModelURL(modelName));
    modelLoaded = true;
    console.info(`Model ${modelName} has been loaded!`);
}

function getModelURL() {
    return `../models/${modelName}-msd-musicnn-1/tfjs/model.json`;
}

function arrayToTensorAsBatches(embeddingsArray, patchSize) {
    let inputTensor = tf.tensor2d(embeddingsArray, [embeddingsArray.length, patchSize]);
    return inputTensor;
}

async function initTensorflowWASM() {
    let defaultBackend;
    tf.ready().then( () => {
        defaultBackend = tf.getBackend();
        console.log('default tfjs backend is: ', defaultBackend);
        initModel();
    });
    
    if (defaultBackend != 'wasm') {
        return;
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

function twoValuesAverage(arrayOfArrays) {
    const length = arrayOfArrays.length;
    if (length === 0) return [0, 0];

    const [firstValuesSum, secondValuesSum] = arrayOfArrays.reduce(
        ([firstAcc, secondAcc], [firstVal, secondVal]) => [
            firstAcc + firstVal,
            secondAcc + secondVal
        ],
        [0, 0]
    );

    return [firstValuesSum/length, secondValuesSum/length];
}

function outputPredictions(p) {
    postMessage({
        predictions: p
    });
}

function modelPredict(embeddings) {
    if (modelLoaded) {
        const inferenceStart = Date.now();
        let inputTensor = arrayToTensorAsBatches(embeddings, 200);
        let predictions = model.execute(inputTensor);
        inputTensor.dispose();
        let predictionsArray = predictions.arraySync();
        predictions.dispose();

        const summarizedPredictions = twoValuesAverage(predictionsArray);
        // format predictions, grab only positive one
        const results = summarizedPredictions.filter((_, i) => modelTagOrder[modelName][i])[0];
        
        console.info(`${modelName}: Inference took: ${Date.now() - inferenceStart}ms`);

        outputPredictions(results);
    }
}


onmessage = function listenToMainThread(msg) {
    // listen for audio embeddings
    if (msg.data.name) {
        modelName = msg.data.name;
        initTensorflowWASM();
    } else if (msg.data.embeddings) {
        console.log("From inference worker: I've got embeddings!");
        // should/can this eventhandler run async functions
        modelPredict(msg.data.embeddings);
    }
};
