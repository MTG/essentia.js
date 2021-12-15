<template>
    <div id="audio-display-wrap">
        <div id="audio-display" class="display"></div>
        <b-alert v-model="showNoIssuesAlert" variant="success" dismissible>
          There are no issues in this audio file!
        </b-alert>
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
	data() {
		return {
			isPlaying: false,
			soundOn: true,
			wavesurfer: null,
			pluginsInitialised: false,
			startStopCutResults: {},
			saturationResults: {},
			silenceResults: {},
			height: 0,
			showNoIssuesAlert: false
		}
	},
	methods: {
		handleMute() {
			if (!this.wavesurfer) {
				return
			}
			this.soundOn = !this.soundOn;
			this.wavesurfer.toggleMute();
		},
		handlePlay() {
			if (!this.wavesurfer) {
				return
			}
			this.isPlaying = !this.isPlaying;
			this.wavesurfer.playPause();
		},
		drawStartStopCut() {
			let newRegions = [];
			let markers = [];
			const widthPixels = this.wavesurfer.mediaContainer.clientWidth;
			// generate region options from this.startStopCutResults
			if (this.startStopCutResults.startCut === 1) {
				newRegions.push({
					id: `startStopCut`,
					start: 0,
					end: this.wavesurfer.getDuration() * 5 / widthPixels,
					drag: false,
					resize: false,
					color: "#FEA24CA6"
				});
				markers.push({
					time: this.wavesurfer.getDuration() * 5 / widthPixels,
					label: "Cut",
					color: "#FEA24CA6",
					position: "bottom"
				});
			}
			if (this.startStopCutResults.stopCut === 1) {
				newRegions.push({
					id: `startStopCut`,
					start: this.wavesurfer.getDuration() * (widthPixels - 5) / widthPixels,
					end: this.wavesurfer.getDuration(),
					drag: false,
					resize: false,
					color: "#FEA24CA6"
				});
				markers.push({
					time: this.wavesurfer.getDuration() * (widthPixels - 5) / widthPixels,
					label: "Cut",
					color: "#FEA24CA6",
					position: "bottom"
				});
			}

			newRegions.forEach(s => this.wavesurfer.addRegion(s));

			markers.forEach(m => this.wavesurfer.addMarker(m));

			this.wavesurfer.on('region-click', (region, ev) => {
				ev.stopPropagation();
				region.play();
			});
		},
		drawSaturation() {
			let newRegions = [];
			let markers = [];
			// generate region options from this.saturationResults

			if (this.saturationResults.starts.length < 0 || this.saturationResults.ends.length < 0) {
				return;
			}
			if (this.saturationResults.starts.length !== this.saturationResults.ends.length) {
				console.error("Saturation: different number of start and end points");
				return;
			}

			let firstSaturation = this.saturationResults.starts[0];
			let lastSaturation = this.saturationResults.starts[0];
			let isRegion = true;
			for (let i = 1; i < this.saturationResults.starts.length; i++) {

				if (isRegion) {
					if (i === this.saturationResults.starts.length - 1 || this.saturationResults.starts[i] - lastSaturation > 0.5) {
						isRegion = false;
						newRegions.push({
							id: `saturation-${i}`,
							start: firstSaturation,
							end: this.saturationResults.ends[i - 1],
							drag: false,
							resize: false,
							color: "#FF585880",
						});
						markers.push({
							time: firstSaturation,
							label: "Saturation",
							color: "#FF585880",
							position: "bottom"
						})
					}
					lastSaturation = this.saturationResults.starts[i];
				} else {
					firstSaturation = this.saturationResults.starts[i];
					lastSaturation = this.saturationResults.starts[i];
					isRegion = true;
				}
			}
			newRegions.forEach(s => this.wavesurfer.addRegion(s));

			markers.forEach(m => this.wavesurfer.addMarker(m));

			this.wavesurfer.on('region-click', (region, ev) => {
				ev.stopPropagation();
				region.play();
			});
		},
		drawSilence() {
			let newRegions = [];
			let markers = [];

			for (let prop in this.silenceResults) {
				if (!this.silenceResults[prop]) {
					continue;
				}
				newRegions.push({
					id: `startStopSilence-${prop}`,
					start: this.silenceResults[prop].begin,
					end: this.silenceResults[prop].finish,
					drag: false,
					resize: false,
					color: "#FFD645A3"
				});
				markers.push({
					time: this.silenceResults[prop].begin,
					label: "Silence",
					color: "#FFD645A3",
					position: "bottom"
				});
			}

			newRegions.forEach(s => this.wavesurfer.addRegion(s));

			markers.forEach(m => this.wavesurfer.addMarker(m));

			this.wavesurfer.on('region-click', (region, ev) => {
				ev.stopPropagation();
				region.play();
			})

		},
		redrawAlgorithms() {
			setTimeout(() => {
				this.drawStartStopCut();
				this.drawSilence();
				this.drawSaturation();
			}, 150);
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
	created() {
		window.addEventListener('resize', this.redrawAlgorithms);
	},
	mounted() {
		this.height = this.$el.querySelector("#audio-display").clientHeight;
		let setPause = () => {
			if (this.isPlaying) this.isPlaying = false;
		};

		EventBus.$on("sound-read", (sound) => {
			this.startStopCutResults = {};

			if (this.wavesurfer) {
				this.wavesurfer.destroy();
			}

			this.wavesurfer = WaveSurfer.create({
				container: '#audio-display',
				height: this.height - 22,
				responsive: true,
				progressColor: '#2d4c89',
				waveColor: '#87b4f8',
				partialRender: true,
				plugins: [
					MarkersPlugin.create({
						markers: []
					}),
					RegionsPlugin.create({
						regionsMinLength: 0.1
					})
				]
			});

			this.wavesurfer.loadBlob(sound.blob);
			this.wavesurfer.on("finish", setPause);
			this.wavesurfer.on("pause", setPause);
			this.wavesurfer.on("play", () => this.isPlaying = true);
			this.wavesurfer.on("plugin-initialised", () => this.pluginsInitialised = true);

			this.wavesurfer.on('region-mouseenter', (region, ev) => {
				ev.stopPropagation();
				EventBus.$emit("region-mouseenter", region, ev);
			});
			this.wavesurfer.on('region-mouseleave', (region, ev) => {
				ev.stopPropagation();
				EventBus.$emit("region-mouseleave", region, ev);
			});
			this.wavesurfer.on('marker-click', (region, ev) => {
				ev.stopPropagation();
				EventBus.$emit("marker-clicked", region, ev);
			});
		});

		EventBus.$on("startstopcut-finished", (results) => {
			this.startStopCutResults = results;
			this.showNoIssuesAlert = false;
		});

		EventBus.$on("saturation-finished", (results) => {
			this.saturationResults = results;
			this.showNoIssuesAlert = false;
		});

		EventBus.$on("silence-finished", (results) => {
			this.silenceResults = results;
			this.showNoIssuesAlert = false;
		});

		EventBus.$on("empty-results", () => {
			this.showNoIssuesAlert = true;
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
