<template>
    <div id="audio-display-wrap">
        <div id="audio-display" class="display"></div>
        <div id="load-overlay" class="d-flex justify-content-center align-items-center w-100 display" v-if="waitingOnsets"></div>
        <div id="load-spinner" class="d-flex flex-column justify-content-center align-items-center w-100 display" v-if="waitingOnsets">
            <strong class="mb-2">{{waitingOnsetsMsg}}</strong>
            <BSpinner variant="light"></BSpinner>
        </div>
        <div class="d-flex flex-row justify-content-between my-2">
            <BButtonGroup>
                <BButton id="play" class="px-4" @click="handlePlay" variant="light">
                    <IBiPlayFill v-show="!isPlaying"/>
                    <IBiPauseFill v-show="isPlaying"/>
                </BButton>
                <BButton id="mute" class="px-4" @click="handleMute" variant="light">
                    <IBiVolumeMuteFill v-show="!soundOn"/>
                    <IBiVolumeUpFill v-show="soundOn"/>
                </BButton>
            </BButtonGroup>
            <BButtonGroup v-if="receivedSound">
                <BLink v-if="soundData.fsLink !== ''" :href="soundData.fsLink" target="_blank">
                    {{soundData.name}} - {{soundData.user}}
                </BLink>
                <p v-else>
                    {{soundData.name}}
                </p>
                <LicenseLogo v-if="licenseType" :license-type="licenseType" color="#E4454A" style="margin-left: 1em;"></LicenseLogo>
            </BButtonGroup>
            <BButtonGroup>
                <BButton id="download" @click="handleDownload" variant="light" :disabled="!downloadEnabled">
                    <IBiDownload/>
                    Download slices
                </BButton>
            </BButtonGroup>
        </div>
    </div>
</template>

<script>
import EventBus from '../core/event-bus';
import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions';
import LicenseLogo from './LicenseLogo.vue';

function colorLog(msg) {
    console.log(`%c audio display ${msg}`, 'background: #fff; color: green;');
}

let eventRegistrationCount = 0;

export default {
    components: {LicenseLogo},
    data () {
        return {
            isPlaying: false,
            soundOn: true,
            wavesurfer: null,
            regions: null,
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
        setPause() {
            if (this.isPlaying) this.isPlaying = false;
        },
        handleDownload () {
            EventBus.$emit('download-slices');
        },
        drawOnsets () {
            this.regions.clearRegions();
            this.onsetPositions.forEach( (p) => this.regions.addRegion({ start: p }) );
        },
        drawOnsetSlices () {
            // generate region options from this.onsetPositions
            let slices = this.onsetPositions.map( (v, i) => {
                let endPos = this.onsetPositions[i+1];
                // if we're on the last onset, use audio track duration (end of file) as region end:
                if (endPos == undefined) { endPos = this.wavesurfer.getDuration(); }
                const sliceTag = `slice-${i}`;

                return {
                    id: sliceTag,
                    start: v,
                    end: endPos,
                    drag: false,
                    resize: false,
                    color: "hsl(358 57% 79% / 0.2)",
                    content: sliceTag,
                    contentEditable: true
                };
            });

            if (this.sliceRegions.length > 0) {
                this.sliceRegions.map( (sr) => sr.remove() );
                this.sliceRegions = []; // clear existing regions, if any
            } 
            slices.forEach((s) => { this.sliceRegions.push(this.regions.addRegion(s)) });
        },
        redraw () {
            setTimeout(() => {
                this.regions.clearRegions();
                // this.drawOnsets();
                this.drawOnsetSlices();
            }, 150);
        },
        handleSoundRead(sound) {
            eventRegistrationCount += 1;
            this.waitingOnsetsMsg = "Finding onsets...";
            this.waitingOnsets = true;
            this.onsetPositions = [];

            this.soundData = sound;
            this.receivedSound = true;

            this.wavesurfer.loadBlob(sound.blob);

            this.wavesurfer.on("finish", this.setPause.bind(this));
            this.wavesurfer.on("pause", this.setPause.bind(this));
            this.wavesurfer.on("play", () => this.isPlaying = true );
            colorLog(`eventRegistrationCount: ${eventRegistrationCount}`)
        },
        handleAnalysisFinishedOnsets(onsets) {
            this.onsetPositions = onsets;
            this.waitingOnsets = false;
        },
        handleAnalysisFinishedEmpty() { 
            this.onsetPositions = [];
            this.waitingOnsets = false;
        },
        handleAlgoParamsUpdated() {
            this.waitingOnsetsMsg = "Recalculating...";
            this.waitingOnsets = true;
        },
        handleResize() {
            if (this.wavesurfer) this.redraw() 
        }
    },
    watch: {
        onsetPositions: function () {
            // this.drawOnsets();
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
        window.addEventListener('resize', this.handleResize);
        EventBus.$on("sound-read", this.handleSoundRead);
        EventBus.$on("analysis-finished-onsets", this.handleAnalysisFinishedOnsets);
        EventBus.$on("analysis-finished-empty", this.handleAnalysisFinishedEmpty);
        EventBus.$on("algo-params-updated", this.handleAlgoParamsUpdated);
    },
    mounted () {
        if (!this.regions) {
            this.regions = RegionsPlugin.create();
            this.regions.on('region-clicked', (region, event) => {
                event.stopPropagation();
                region.play(true);
            });
        }

        this.height = this.$el.querySelector("#audio-display").clientHeight;
        // if (this.wavesurfer) {
        //     colorLog("destroying and nulling wavesurfer")
        //     this.wavesurfer.destroy();
        //     this.wavesurfer = null;
        // }

        // if (this.wavesurfer) return;

        this.wavesurfer = WaveSurfer.create({
            container: '#audio-display',
            height: this.height,
            responsive: true,
            progressColor: '#E4454A',
            waveColor: '#631E20',
            partialRender: true,
            plugins: [this.regions]
        });
    },
    beforeUnmount () {
        // this.wavesurfer.destroy();
        this.wavesurfer = null;
    },
    unmounted() {
        window.removeEventListener("resize", this.handleResize);
        EventBus.$off("sound-read", this.handleSoundRead);
        EventBus.$off("analysis-finished-onsets", this.handleAnalysisFinishedOnsets);
        EventBus.$off("analysis-finished-empty", this.handleAnalysisFinishedEmpty);
        EventBus.$off("algo-params-updated", this.handleAlgoParamsUpdated);
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
