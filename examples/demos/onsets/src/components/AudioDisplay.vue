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
            <b-button-group v-if="receivedSound">
                <b-link v-if="soundData.fsLink !== ''" :href="soundData.fsLink" target="_blank">
                    {{soundData.name}} - {{soundData.user}}
                </b-link>
                <p v-else>
                    {{soundData.name}}
                </p>
                <license-logo v-if="licenseType" :license-type="licenseType" color="#E4454A" style="margin-left: 1em;"></license-logo>
            </b-button-group>
            <b-button-group>
                <b-button id="download" @click="handleDownload" variant="light" :disabled="!downloadEnabled">
                    <b-icon icon="download"></b-icon>
                    Download slices
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
import LicenseLogo from './LicenseLogo.vue';

export default {
    components: {LicenseLogo},
    data () {
        return {
            isPlaying: false,
            soundOn: true,
            wavesurfer: null,
            pluginsInitialised: false,
            onsetPositions: [],
            sliceRegions: [],
            waitingOnsets: false,
            waitingOnsetsMsg: "Finding onsets...",
            soundData: null,
            receivedSound: false,
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
        drawOnsets () {
            if (!this.pluginsInitialised) {
                this.wavesurfer.initPlugin('markers');
            }

            this.wavesurfer.clearMarkers();
            this.onsetPositions.forEach( (p) => this.wavesurfer.addMarker({ time: p, position: 'top' }) );
        },
        drawOnsetSlices () {
            // generate region options from this.onsetPositions
            let slices = this.onsetPositions.map( (v, i) => {
                let endPos = this.onsetPositions[i+1];
                // if we're on the last onset, use audio track duration (end of file) as region end:
                if (endPos == undefined) { endPos = this.wavesurfer.getDuration(); }

                return {
                    id: `slice-${i}`,
                    start: v,
                    end: endPos,
                    drag: false,
                    resize: false,
                    color: "hsl(358 57% 79% / 0.2)"
                };
            });

            if (this.sliceRegions.length > 0) {
                this.sliceRegions.map( (sr) => sr.remove() );
                this.sliceRegions = []; // clear existing regions, if any
            } 
            slices.forEach((s) => { this.sliceRegions.push(this.wavesurfer.addRegion(s)) });

            this.wavesurfer.on('region-click', (region, ev) => {
                ev.stopPropagation();
                region.play();
            })
        },
        redraw () {
            setTimeout(() => {
                this.wavesurfer.clearMarkers();
                this.wavesurfer.clearRegions();
                this.drawOnsets();
                this.drawOnsetSlices();
            }, 150);
        }
    },
    watch: {
        onsetPositions: function () {
            this.drawOnsets();
            this.drawOnsetSlices();
        }
    },
    computed: {
        downloadEnabled () {
            if (this.onsetPositions.length > 0) {
                return true;
            }
            return false;
        },
        licenseType () {
            if (this.soundData.license == '') return null;
            if (this.soundData.license.includes('/zero/')) return 'zero';
            if (this.soundData.license.includes('/by/')) return 'by';
            if (this.soundData.license.includes('by-nc')) return 'by-nc';

            return 'sampling';
        }
    },
    created () {
        window.addEventListener('resize', () => {
            if (this.wavesurfer) this.redraw() 
        });
    },
    mounted () {
        this.height = this.$el.querySelector("#audio-display").clientHeight;
        let setPause = () => {
            if (this.isPlaying) this.isPlaying = false;
        };

        EventBus.$on("sound-read", (sound) => {
            this.waitingOnsetsMsg = "Finding onsets...";
            this.waitingOnsets = true;
            this.onsetPositions = [];

            this.soundData = sound;
            this.receivedSound = true;

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
        });

        EventBus.$on("analysis-finished-onsets", (onsets) => {
            this.onsetPositions = onsets;
            this.waitingOnsets = false;
        });

        EventBus.$on("analysis-finished-empty", () => { 
            this.onsetPositions = [];
            this.waitingOnsets = false;
        });

        EventBus.$on("algo-params-updated", () => {
            this.waitingOnsetsMsg = "Recalculating...";
            this.waitingOnsets = true;
        })
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
