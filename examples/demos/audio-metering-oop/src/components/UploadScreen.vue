<template>
	<v-container fill-height>
		<v-row justify="center" style="height: 100%;">
			<v-col cols="8">
				<drop-zone @files-selected="handleFiles" v-if="!filesSelected"></drop-zone>
				<track-list 
					v-if="filesSelected"
					:tracks="updatedList"
					@cancel="handleCancelUpload"
					@remove-track="handleRemoveTrack"
					@undo="handleUndoRemove"
				></track-list>
			</v-col>
			<v-col cols="4">
				<v-card
					width="100%" 
					height="100%"
					color="white"
					class="rounded-lg mr-0 ml-2 pa-4"
					elevation="1"
				>
					<v-card-title>Audio Metering Song Analyser</v-card-title>
					<v-card-text height="100%">
						You can now check your tracks' levels, stereo phase 
						correlation and spectral profile directly in the browser. 
						Simply load up to 10 audio tracks 👈 and you'll have a 
						summary of the analysis in 2min. Don't worry, we don't 
						keep the tracks, everything happens in your device.
					</v-card-text>
					<v-card-actions>
						<v-btn 
							:disabled="nextBtnDisabled" 
							block 
							@click="handleNextClick"
							color="primary"
						>
							Analyse my tracks
							<v-icon right light>mdi-arrow-right-thick</v-icon>
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import DropZone from './DropZone.vue';
import TrackList from './TrackList.vue';

export default {
	components: {DropZone, TrackList},
	data () {
		return {
			nextBtnDisabled: true,
			filesSelected: false,
			files: null,
			updatedList: [],
			undoMemory: null
		}
	},
	methods: {
		handleFiles (files) {
			this.filesSelected = true;
			this.files = [];
			for (let f of files) {
				this.files.push(f);
				this.updatedList.push(f.name);
			}
			this.nextBtnDisabled = false;
		},
		handleNextClick () {
			const tracks = [];
			for (let f of this.files) {
				if (this.updatedList.includes(f.name)) {
					tracks.push(f);
				}
			}
			this.$emit('analyse-tracks', tracks);
		},
		handleCancelUpload () {
			this.files = null;
			this.updatedList = [];
			this.filesSelected = false;
		},
		handleRemoveTrack (track) {
			this.updatedList = this.updatedList.filter( name => name !== track );
		},
		handleUndoRemove () {
			if (!this.undoMemory) return;
			this.updatedList = this.undoMemory.slice(); // return copy, not ref
		}
	},
	watch: {
		updatedList (newList, oldList) {
			this.undoMemory = oldList;
		}
	}
}
</script>

<style>
	.v-stepper__wrapper {
		height: 100% !important;
	}
</style>