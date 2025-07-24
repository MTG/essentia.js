import AnalysisWorker from './worker.js?worker';

const worker = new AnalysisWorker();

function analyseTrack (audioChannelData) {
    return new Promise( (resolve, reject) => {
        const messageHandler = function (msg) {
            worker.removeEventListener('message', messageHandler);
            worker.removeEventListener('error', reject);
            resolve(msg.data.analysis);
        };

        worker.addEventListener('message', messageHandler);
        worker.addEventListener('error', reject);

        worker.postMessage({
            audioData: audioChannelData
        })
    })
}

function shutdown () {
    return new Promise( (resolve, _) => {
        const terminationHandler = function (msg) {
            if (!msg.data.shutdownFinished) return;
            worker.removeEventListener('message', terminationHandler);
            worker.terminate();
            console.info('worker was terminated');
            resolve();
        };

        worker.addEventListener('message', terminationHandler);

        worker.postMessage({
            shutdown: true
        })
    })
}

export default {
    analyseTrack: analyseTrack,
    shutdown: shutdown
}