// let essentia;

// EssentiaWASM().then((wasmModule) => {
//     essentia = new Essentia(wasmModule);
// }).catch((err) => console.error('There was an error loading the Essentia WASM backend: \n', err));


class OnsetsApp {
    constructor () {
        // Audio
        this.audioWorker = new Worker('audio-worker.js');

        // UI
        this.dropInput = document.createElement('input');
        this.dropArea = document.querySelector('#file-drop-area');
        this.initializeDropArea();
    }

    initializeDropArea () {
        this.dropInput.setAttribute('type', 'file');
        this.dropInput.addEventListener('change', (ev) => {
            processFileUpload(ev.target.files);
        })


        this.dropArea.addEventListener('dragover', (e) => { e.preventDefault() });
        this.dropArea.addEventListener('drop', (e) => {
            e.preventDefault();
            const files = e.dataTransfer.files;
            processFileUpload(files);
        })
        this.dropArea.addEventListener('click', () => {
            dropInput.click();
        })
    }
 

}


window.onload = () => {
    const app = new OnsetsApp();
}
