// import AnalysisWorker from './worker.js?worker';

const url = new URL('./worker.js', 'file://' + __filename).toString();

// const worker = new AnalysisWorker();
const worker = new Worker(url, {type: 'module'});

export default function analyseTrack (audioChannelData) {
    return new Promise( (resolve, reject) => {
        const messageHandler = function (msg) {
            worker.removeEventListener('message', messageHandler);
            resolve(msg.data.analysis)
        };

        worker.addEventListener('message', messageHandler);
        worker.addEventListener('error', reject);

        worker.postMessage({
            audioData: audioChannelData
        })
    })
}
