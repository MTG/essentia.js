class OnsetsApp {
    constructor () {
        // Audio
        this.audioWorker = new Worker('audio-worker.js', {type: 'module'});
        this.audioCtx = new AudioContext();

        // UI
        this.dropInput = document.createElement('input');
        this.dropArea = document.querySelector('#file-drop-area');
        this.initializeDropArea();
    }

    initializeDropArea () {
        this.dropInput.setAttribute('type', 'file');
        this.dropInput.addEventListener('change', (ev) => {
            ev.preventDefault();
            this.processFileUpload(ev.target.files);
        });

        this.dropArea.addEventListener('dragover', (e) => { e.preventDefault() });
        this.dropArea.addEventListener('drop', (ev) => {
            ev.preventDefault();
            this.processFileUpload(ev.dataTransfer.files);
        });
        this.dropArea.addEventListener('click', () => {
            this.dropInput.click();
        })
    }
    
    processFileUpload(files) {
        if (files.length > 1) {
            alert("Only single-file uploads are supported currently");
            throw Error("Multiple file upload attempted, cannot process.");
        } else if (files.length) {
            files[0].arrayBuffer().then((ab) => {
                this.decodeBuffer(ab).then((audioBuffer) => {
                    console.info("Done decoding audio!");
                    let audioArray = audioBuffer.getChannelData(0);
                    this.audioWorker.postMessage({
                        request: 'analyse',
                        audio: audioArray
                    });
                });
            });
        }
    }

    async decodeBuffer(arrayBuffer) {
        await this.audioCtx.resume();
        let audioBuffer = await this.audioCtx.decodeAudioData(arrayBuffer);
        return audioBuffer;
    }

}


window.onload = () => {
    const app = new OnsetsApp();
};