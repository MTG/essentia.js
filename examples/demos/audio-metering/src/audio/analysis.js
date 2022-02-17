import AnalysisWorker from './worker.js?worker';

const worker = new AnalysisWorker();

export default function analyseTrack (audioChannelData) {
    return new Promise( (resolve, reject) => {
        const messageHandler = function (msg) {
            worker.removeEventListener('message', messageHandler);
            resolve(msg.data.analysis);
        };

        worker.addEventListener('message', messageHandler);
        worker.addEventListener('error', reject);

        worker.postMessage({
            audioData: audioChannelData
        })
    })
}
