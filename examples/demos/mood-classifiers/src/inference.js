importScripts('./lib/tf.min.3.5.0.js');

let classifiers = {
    'mood_happy': {
        isLoaded: false,
        tagOrder: [true, false],
        model: null
    }, 
    'mood_sad': {
        isLoaded: false,
        tagOrder: [false, true],
        model: null
    }, 
    'mood_relaxed': {
        isLoaded: false,
        tagOrder: [false, true],
        model: null
    }, 
    'mood_aggressive': {
        isLoaded: false,
        tagOrder: [true, false],
        model: null
    }, 
    'danceability': {
        isLoaded: false,
        tagOrder: [true, false],
        model: null
    }
};

async function initModel(name) {
    classifiers[name].model = await tf.loadGraphModel(getModelURL(name));
    console.info(`Model ${name} has been loaded!`);
    classifiers[name].isLoaded = true;
}

function getModelURL(modelName) {
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
        for (let n of Object.keys(classifiers)) {
            initModel(n);
        }
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

function modelsPredict(embeddings) {
    const inferenceStart = Date.now();
    let inputTensor = arrayToTensorAsBatches(embeddings, 200);
    
    let predictions = {};

    for (let name of Object.keys(classifiers)) {
        if (classifiers[name].isLoaded) {
            let output = classifiers[name].model.execute(inputTensor);
            let outputArray = output.arraySync();
            
            const summarizedPredictions = twoValuesAverage(outputArray);
            // format predictions, grab only positive one
            const results = summarizedPredictions.filter((_, i) => classifiers[name].tagOrder[i])[0];
            predictions[name] = results;
            
            console.info(`${name}: Inference took: ${Date.now() - inferenceStart}ms`);
            
        }
    }
    outputPredictions(predictions);
    inputTensor.dispose();
}

initTensorflowWASM();

onmessage = function listenToMainThread(msg) {
    // listen for audio embeddings
    if (msg.data.embeddings) {
        console.log("From inference worker: I've got embeddings!");
        // should/can this eventhandler run async functions
        modelsPredict(msg.data.embeddings);
    }
};
