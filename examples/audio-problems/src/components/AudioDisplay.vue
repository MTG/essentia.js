<template>
    <div id="audio-display-wrap">
        <div id="audio-display" class="display"></div>
        <div id="load-overlay" class="d-flex justify-content-center align-items-center w-100 display" v-if="waitingOnsets"></div>
        <div id="load-spinner" class="d-flex flex-column justify-content-center align-items-center w-100 display" v-if="waitingOnsets">
            <strong class="mb-2">{{waitingOnsetsMsg}}</strong>
            <b-spinner variant="light"></b-spinner>
        </div>
        <div class="d-flex flex-row justify-content-between my-2">
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
                <b-button id="download" @click="handleDownload" variant="light" :disabled="!downloadEnabled">
                    <b-icon icon="download"></b-icon>
                    Download
                </b-button>
            </b-button-group>
        </div>
    </div>
</template>

<script>
import EventBus from '../core/event-bus';
import WaveSurfer from 'wavesurfer.js';
import MarkersPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.markers';
import RegionsPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions';

import audioURL from '../assets/song_saturation_and_start_cut_silence_end.wav';

export default {
    data () {
        return {
            isPlaying: false,
            soundOn: true,
            wavesurfer: null,
            pluginsInitialised: false,
            startStopCutResults: {},
            startStopRegions: [],
            saturationResults: {},
            saturationRegions: [],
            silenceResults: {},
            silenceRegions: [],
            waitingOnsets: false,
            waitingOnsetsMsg: "Finding onsets...",
            height: 0
        }
    },
    methods: {
        handleMute () {
            if (!this.wavesurfer) {
                return
            }
            this.soundOn = !this.soundOn;
            this.wavesurfer.toggleMute();
        },
        handlePlay () {
            if (!this.wavesurfer) {
                return
            }
            this.isPlaying = !this.isPlaying;
            this.wavesurfer.playPause();
        },
        handleDownload () {
            EventBus.$emit('download-slices');
        },
        drawStartStopCut () {
            if (this.startStopRegions.length > 0) {
                this.startStopRegions.map( (sr) => sr.remove() );
                this.startStopRegions = []; // clear existing regions, if any
            }

            let newRegions = [];
            const widthPixels = this.wavesurfer.mediaContainer.clientWidth;
            // generate region options from this.startStopCutResults
            if (this.startStopCutResults.startCut === 1){
                newRegions.push({
                    id: `startCut`,
                    start: 0,
                    end: this.wavesurfer.getDuration() * 5 / widthPixels,
                    drag: false,
                    resize: false,
                    color: "#21252994"
                })
            }
            if (this.startStopCutResults.stopCut === 1){
                newRegions.push({
                    id: `stopCut`,
                    start: this.wavesurfer.getDuration() * (widthPixels - 5)/widthPixels,
                    end: this.wavesurfer.getDuration(),
                    drag: false,
                    resize: false,
                    color: "#21252994"
                }) 
            }

            newRegions.forEach((s) => { this.startStopRegions.push(this.wavesurfer.addRegion(s)) });

            this.wavesurfer.on('region-click', (region, ev) => {
                ev.stopPropagation();
                region.play();
            })
        },
        drawSaturation () {
            if (this.saturationRegions.length > 0) {
                this.saturationRegions.map( (sr) => sr.remove() );
                this.saturationRegions = []; // clear existing regions, if any
            }

            let newRegions = [];
            // const widthPixels = this.wavesurfer.mediaContainer.clientWidth;
            // generate region options from this.saturationResults

            console.log("saturationResults", this.saturationResults);
            if (this.saturationResults.starts.length < 0 || this.saturationResults.ends.length < 0) {
                return;
            }
            if (this.saturationResults.starts.length !== this.saturationResults.ends.length) {
                console.error("Saturation: different number of start and end points");
                return;
            }

            for (let i = 0; i < this.saturationResults.starts.length; i++) {
                newRegions.push({
                    id: `saturation-${i}`,
                    start: this.saturationResults.starts[i],
                    end: this.saturationResults.ends[i],
                    drag: false,
                    resize: false,
                    color: "#21252994"
                })
            }

            newRegions.forEach((s) => { this.saturationRegions.push(this.wavesurfer.addRegion(s)) });

            this.wavesurfer.on('region-click', (region, ev) => {
                ev.stopPropagation();
                region.play();
            })
        },
        drawSilence () {
            if (this.silenceRegions.length > 0) {
                this.silenceRegions.map( (sr) => sr.remove() );
                this.silenceRegions = []; // clear existing regions, if any
            }

            let newRegions = [];
            // const widthPixels = this.wavesurfer.mediaContainer.clientWidth;

            console.log("silenceResults", this.silenceResults);

            for (let prop in this.silenceResults) {
                newRegions.push({
                    id: `silence-${prop}`,
                    start: prop == 'start' ? 0 : this.silenceResults.end,
                    end: prop == 'start' ? this.silenceResults.start : this.wavesurfer.getDuration(),
                    drag: false,
                    resize: false,
                    color: "#21252994"
                })
            }

            newRegions.forEach((s) => { this.silenceRegions.push(this.wavesurfer.addRegion(s)) });

            this.wavesurfer.on('region-click', (region, ev) => {
                ev.stopPropagation();
                region.play();
            })
        }
    },
    watch: {
        startStopCutResults: function () {
            this.drawStartStopCut();
        },
        saturationResults: function () {
            this.drawSaturation();
        },
        silenceResults: function () {
            this.drawSilence();
        }
    },
    computed: {
        downloadEnabled () {
            if (this.startStopCutResults.length > 0) {
                return true;
            }
            return false;
        }
    },
    mounted () {
        this.height = this.$el.querySelector("#audio-display").clientHeight;
        let setPause = () => {
            if (this.isPlaying) this.isPlaying = false;
        };

        EventBus.$on("sound-read", (sound) => {
            // this.waitingOnsetsMsg = "Finding onsets...";
            // this.waitingOnsets = true;
            this.startStopCutResults = {};

            if (this.wavesurfer) {
                this.wavesurfer.destroy();
            }

            this.wavesurfer = WaveSurfer.create({
                container: '#audio-display',
                height: this.height,
                responsive: true,
                progressColor: '#E4454A',
                waveColor: '#631E20',
                partialRender: true,
                plugins: [
                    MarkersPlugin.create({
                        markers: []
                    }),
                    RegionsPlugin.create()
                ]
            });

            this.wavesurfer.loadBlob(sound.blob);

            this.wavesurfer.on("finish", setPause);
            this.wavesurfer.on("pause", setPause);
            this.wavesurfer.on("play", () => this.isPlaying = true );

            this.wavesurfer.on("plugin-initialised", () => this.pluginsInitialised = true );
            console.log(this.wavesurfer);
        });

        EventBus.$on("startstopcut-finished", (results) => {
            this.startStopCutResults = results;
            this.waitingOnsets = false;
        });

        EventBus.$on("saturation-finished", (results) => {
            this.saturationResults = results;
            this.waitingOnsets = false;
        });

        EventBus.$on("silence-finished", (results) => {
            this.silenceResults = results;
            this.waitingOnsets = false;
        });

        EventBus.$on("analysis-finished-empty", () => { 
            this.startStopCutResults = [];
            this.waitingOnsets = false;
        });

        EventBus.$on("algo-params-updated", () => {
            // this.waitingOnsetsMsg = "Recalculating...";
            // this.waitingOnsets = true;
        })

        EventBus.$emit("sound-selected", audioURL);
    }
}
</script>

<style scoped>
    #audio-display-wrap {
        position: relative;
    }

    .display {
        height: 25vh;
    }

    #load-overlay {
        background-color: #000;
        opacity: 0.65;
        z-index: 10;
        position: absolute;
        top: 0;
        left: 0;
    }

    #load-spinner {
        color: #fff;
        z-index: 20;
        position: absolute;
        top: 0;
        left: 0;
    }
</style>
