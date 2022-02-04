<template>
	<div id="player">
		<b-button variant="light" class="not-stretchy" size="sm" id="playbutton" @click="handlePlay">
			<b-icon v-show="!playing" icon="play"></b-icon>
			<b-icon v-show="playing" icon="pause"></b-icon>
		</b-button>
		<div id="middle-section">
			<div id="titleLink">
				<b-link :href="soundResource.url" target="_blank">
					{{soundResource.name}}
					<sup><b-icon icon="box-arrow-up-right"></b-icon></sup>
				</b-link>
			</div>
			<div id="playbar-container">
				<b-form-input type="range" id="playbar" :max="seekMax" 
				v-model="playbackPosition" size="sm" step="any" @change="handleSeek" @input="handleSeek"></b-form-input>
			</div>
		</div>
		<span class="not-stretchy" id="select-container">
			<b-form-radio :value="soundResource.id" v-model="selected" size="sm"></b-form-radio>
		</span>
	</div>
</template>

<script>

export default {
    emits: ['selected'],
    props: {
        soundResource: Object,
    },
    data () {
        return {
            playing: false,
            selected: -1,
			audio: null,
			seekMax: 100,
			playbackPosition: 0
        }
    },
    watch: {
        selected (isSelected) {
            if (isSelected == this.soundResource.id) this.$emit('selected');
        },
		soundResource () {
			if (this.audio) {
				this.stopAudio();
				this.audio = null;
				this.playbackPosition = 0;
			}
			this.setupAudioElement();
		}
    },
	created () {
		this.setupAudioElement();
	},
	methods: {
		handlePlay () {
			if (this.playing) {
				this.stopAudio();
				return;
			}
			this.playAudio();
		},
		setupAudioElement () {
			this.audio = document.createElement('audio');
			this.audio.src = this.soundResource.previews["preview-hq-mp3"];
			this.audio.addEventListener('ended', () => {
				this.playing = false;
			})

			const setSliderMax = () => {
				this.seekMax = this.audio.duration;
			}
			if (this.audio.readyState > 0) setSliderMax();
			else this.audio.addEventListener('loadedmetadata', setSliderMax.bind(this));
		},
		handleSeek (pos) {
			this.audio.currentTime = Number(pos);
		},
		playAudio () {
			this.audio.play();
			requestAnimationFrame(this.whilePlaying.bind(this));
			this.playing = true;
		},
		stopAudio () {
			this.audio.pause();
			cancelAnimationFrame(this.rAF)
			this.playing = false;
		},
		whilePlaying () {
			this.playbackPosition = this.audio.currentTime;
			this.rAF = requestAnimationFrame(this.whilePlaying.bind(this))
		}
	}
}
</script>

<style lang="scss" scoped>
@import '../assets/styles/globals.scss';

#player {
	display: flex;
	flex-direction: row;
	justify-content: space-evenly;
	&:hover {
		background-color: rgba($secondary, 0.1);
	}
}

#titleLink {
	font-size: 0.75rem;
	min-width: 0;
}

#titleLink > a {
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

#middle-section {
    flex: 1 0 70%;
	display: grid;
	grid-template-rows: minmax(0, 1fr) 1fr;
	grid-row-gap: 0;
	align-items: center;
	justify-items: start;
}

.not-stretchy {
    flex: 0;
}

#playbutton {
	background-color: rgba($light, 0.5);
	z-index: 10;
	border-color: transparent;
	&:hover {
		border-color: $light;
	}
}

#playbar-container {
	width: 95%;
}

input[type="range"]#playbar {
	-moz-appearance: none;
	-webkit-appearance: none;
	appearance: none;
	outline: none;
	cursor: pointer;
	height: .75rem;

	&::-webkit-slider-runnable-track {
		-moz-appearance: none;
		-webkit-appearance: none;
		appearance: none;
		height: 3px;
		background-color: $secondary;
	}

	&::-webkit-slider-thumb {
		-moz-appearance: none;
		-webkit-appearance: none;
		appearance: none;
		background-color: $dark;
		width: 5px;
		height: .7rem;
		border-radius: 0;
	}
	
	&::-moz-range-track {
		-moz-appearance: none;
		-webkit-appearance: none;
		appearance: none;
		height: 3px;
		background-color: $secondary;
	}

	&::-moz-range-thumb {
		-moz-appearance: none;
		-webkit-appearance: none;
		appearance: none;
		background-color: $dark;
		width: 5px;
		height: .7rem;
		border-radius: 0;
	}
}

#select-container {
	margin: auto 0;
}

</style>