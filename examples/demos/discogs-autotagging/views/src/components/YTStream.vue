<template>
    <section id="side-column">
        <header class="side-column-item">
            <h1>Music Genre Autotagging</h1>
            <h3>with <a id="discogsresnet" href="https://essentia.upf.edu/models.html#discogs-effnet" target="_blank">DiscogsResNet</a></h3>
        </header>
        <div class="side-column-item">
            <p>
                Enter a Youtube video URL or upload your own file to get real-time music genre predictions based on the analysed audio stream.
            </p>
            <p class="note">
                Note: Works only in Chromium-based browsers.
            </p>
        </div>
        <div class="control side-column-item">
            <custom-toggle @change="(method) => selectedMethod = method"></custom-toggle>
            <input 
                type="search" 
                id="yt-url-box" 
                v-model="youtubeURL"
                class="search-control my-auto"
                placeholder="Enter youtube video URL"
                v-show="selectedMethod == 'youtube'"
            >
            <input 
                type="file" 
                v-show="selectedMethod == 'file'"
                id="audio-file-upload"
                @change="handleUpload"
            >
            <label 
                for="audio-file-upload"
                class="search-control my-auto"
                v-show="selectedMethod == 'file'"
            >Choose an audio file from your computer</label>
            <button 
                @click="handleButton" 
                :disabled="streamButtonDisabled"
                class="search-control"
                :class="{'control-is-active': !streamButtonDisabled, 'btn-blinker': btnShouldBlink }"
                id="start-streaming-btn"
            >{{ buttonPrompt }} streaming</button>
        </div>
        <div class="control side-column-item">
            <audio :src="streamingURL" controls ref="audioElem" crossorigin="anonymous"
            @ended="handleStreamEnded" @pause="handlePause" @play="handlePlay" 
            @loadeddata="handleLoadedData"></audio>
        </div>
    </section>
</template>

<script>
import EventBus from '../event-bus.js';
import CustomToggle from './CustomToggle.vue';

console.log(import.meta.env.BASE_URL);

function getStreamingURL (youtubeID) {
    if (import.meta.env.DEV) {
        return `http://localhost:8000/stream/${youtubeID}`
    }
    if (import.meta.env.PROD) {
        return `${import.meta.env.BASE_URL}stream/${youtubeID}`
    }
}

export default {
    components: {CustomToggle},
    data () {
        return {
            buttonPrompt: 'Start',
            youtubeURL: '',
            fileURL: '',
            streamingURL: '',
            audioElem: null,
            selectedMethod: 'youtube'
        }
    },
    methods: {
        handleButton () {
            switch (this.buttonPrompt) {
                case 'Start':
                    this.startStream();
                    this.buttonPrompt = 'Stop';
                    console.log('button: Start streaming');
                    break;
                case 'Resume':
                    this.$refs.audioElem.play();
                    this.buttonPrompt = 'Stop';
                    break;
                case 'Stop':
                    this.streamingURL = '';
                    this.youtubeURL = '';
                    console.log('button: Stop streaming');
                    break;
            }
        },
        startStream () {
            this.$refs.audioElem.play();
            let stream = this.$refs.audioElem.captureStream();
            EventBus.$emit('received-stream', stream);
        },
        handleStreamEnded () {
            console.log('<audio> stream ended');
            this.buttonPrompt = 'Start';
            EventBus.$emit('stop-audio');
        },
        handlePause () {
            console.log('<audio> pause');
            this.buttonPrompt = 'Resume';
            EventBus.$emit('pause');
        },
        handlePlay () {
            if (this.buttonPrompt !== 'Stop') {
                // if not already streaming, trigger it
                this.startStream();
            }
            console.log('<audio> play')
            this.buttonPrompt = 'Stop';
            EventBus.$emit('play');
        },
        handleLoadedData () {
            console.log('<audio> loaded data');
            EventBus.$emit('loaded-data');
        },
        handleUpload (ev) {
            let selFiles = ev.target.files;
            if (selFiles.length == 0) return;
            if (selFiles.length < 1) {
                // display "only single file allowed" message
                console.error('Multiple file upload not allowed!');
                return;
            }

            this.fileURL = URL.createObjectURL(selFiles[0]);
        }
    },
    computed: {
        streamButtonDisabled () {
            if (this.streamingURL === '') return true;
            return false;
        },
        btnShouldBlink () {
            return !this.streamButtonDisabled && (this.buttonPrompt === 'Start' || this.buttonPrompt === 'Resume');
        }
    },
    watch: {
        youtubeURL () {
            // find ID inside youtube URL
            let regex = this.youtubeURL.includes('youtu.be') ? /\/(?<id>\w{11})/ : /watch\?v=(?<id>(\w|\d|-|_){11})/;
            let matches = regex.exec(this.youtubeURL);
            let ytid = matches ? matches.groups.id : null;
            if (ytid) this.streamingURL = getStreamingURL(ytid);
        },
        fileURL (val, _) {
            this.streamingURL = val;
        },
        streamingURL (val, oldVal) {
            if (oldVal === '') return;
            EventBus.$emit('stop-audio');
            this.buttonPrompt = 'Start';
        }
    }
}
</script>

<style lang="scss">
    div.control {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: start;
        font-size: 0.9rem;
    }

    #side-column {
        /* display: flex;
        flex-direction: column;
        justify-content: start; */
        flex: 1;
        margin: 3em 0;
    }

    #discogsresnet {
        text-decoration: none;
        color: inherit;
        &:hover {
            color: var(--action-color);
        }
    }

    .search-control {
        border-radius: var(--border-radius);
        width: 100%;
        padding: .5em;
    }

    .side-column-item {
        width: 100%;
        padding: 0 2em;
        margin: 3em 0;
    }

    audio {
        width: 100%;
    }

    .control > * {
        flex-grow: 0;
    }

    button, label[for="audio-file-upload"] {
        background-color: rgb(var(--color-primary));
        border-width: 0px;
        border-color: rgba(var(--color-primary), 0.5);
        border-bottom-width: .25rem;
        color: rgb(var(--color-bg));
        box-shadow: var(--btn-shadow);
        font-size: inherit;
        transition: border-bottom .3s ease-in-out;
    }

    button:hover, label[for="audio-file-upload"]:hover {
        background-color: rgba(var(--color-primary), 0.75);
        cursor: pointer;
        color: black;
    }

    button:disabled {
        cursor: default;
        color: rgb(var(--color-grey));
        background-color: rgb(var(--color-primary));
    }

    button:active, label[for="audio-file-upload"]:active {
        color: var(--color-primary);
        background-color: rgba(var(--color-primary), 0.5);
        box-shadow: none;
    }

    .control-is-active {
        border-bottom-color: var(--action-color);
        border-bottom-style: solid;
    }

    #yt-url-box {
        border-width: 0px;
        font-size: inherit;
        font-weight: 300;
        font-style: italic;
    }

    #audio-file-upload {
        height: 0;
        padding: 0;
        opacity: 0;
    }

    label[for="audio-file-upload"] {
        text-align: left;
        color: rgb(var(--color-grey));
    }

    #start-streaming-btn {
        font-weight: bold;
    }

    .my-auto {
        margin-top: 0.5rem;
        margin-bottom: 0.5rem;
    }

    .btn-blinker {
        animation: blinking 750ms ease infinite alternate
    }

    p {
        text-align: left;
        &.note {
            color: rgb(var(--color-grey));
        }
    }

    @keyframes blinking {
        from{
            background-color: rgb(var(--color-primary));
            color: rgb(var(--color-bg));
            box-shadow: var(--btn-shadow);
        }
        to{
            background-color: rgba(var(--color-primary), 0.8);
            color: black;
            box-shadow: none;
        }
    }
</style>