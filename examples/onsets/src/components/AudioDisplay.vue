<template>
    <div>
        <div id="display"></div>
        <div class="d-flex flex-row justify-content-between">
            <b-button-group>
                <b-button id="play" class="px-4" @click="handlePlay" variant="light">
                    <b-icon icon="play-fill" v-show="!isPlaying"></b-icon>
                    <b-icon icon="pause-fill" v-show="isPlaying"></b-icon>
                </b-button>
                <b-button id="mute" class="px-4" @click="handleMute" variant="light">
                    <b-icon icon="volume-mute-fill" v-show="!soundOn"></b-icon>
                    <b-icon icon="volume-up-fill" v-show="soundOn"></b-icon>
                </b-button>
            </b-button-group>
            <b-button-group>
                <b-button id="download" @click="handleDownload" variant="light">
                    <b-icon icon="download"></b-icon>
                    Download
                </b-button>
            </b-button-group>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            isPlaying: false,
            soundOn: true
        }
    },
    methods: {
        handleMute () {
            this.soundOn = !this.soundOn;
        },
        handlePlay () {
            this.isPlaying = !this.isPlaying;
        },
        handleDownload () {

        }
    }
}
</script>