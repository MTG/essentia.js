<template>
    <div>
        <div id="display"></div>
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
                <b-button id="download" @click="handleDownload" variant="light">
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

import audioURL from '../assets/acoustic-drums.wav';

export default {
    data () {
        return {
            isPlaying: false,
            soundOn: true,
            wavesurfer: null,
            pluginsInitialised: false,
            onsetPositions: [],
            sliceRegions: []
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

            if (this.sliceRegions.length == 0) {
                this.sliceRegions.map( (sr) => sr.remove() );
                this.sliceRegions = []; // clear existing regions, if any
            } 
            slices.forEach((s) => { this.sliceRegions.push(this.wavesurfer.addRegion(s)) });

            this.wavesurfer.on('region-click', (region, ev) => {
                ev.stopPropagation();
                region.play();
            })
        }
    },
    watch: {
        onsetPositions: function () {
            this.drawOnsets();
            this.drawOnsetSlices();
        }
    },
    mounted () {
        EventBus.$on("sound-read", (blob) => {
            if (this.wavesurfer) {
                this.wavesurfer.destroy();
            }

            this.wavesurfer = WaveSurfer.create({
                container: '#display',
                height: this.$el.querySelector("#display").clientHeight,
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

            this.wavesurfer.loadBlob(blob);

            this.wavesurfer.on("finish", () => {
                if (this.isPlaying) this.isPlaying = false;
            });

            this.wavesurfer.on("plugin-initialised", () => this.pluginsInitialised = true );
        });

        EventBus.$on("analysis-finished-onsets", (onsets) => {
            this.onsetPositions = onsets;
        })

        EventBus.$emit("sound-selected", audioURL);
    }
}
</script>

<style scoped>
    #display {
        height: 25vh;
    }
</style>
