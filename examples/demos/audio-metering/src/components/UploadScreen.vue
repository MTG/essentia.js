<template>
	<v-container fill-height>
		<v-row justify="center" style="height: 100%;">
			<v-col cols="8">
				<drop-zone @files-selected="handleFiles"></drop-zone>
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

export default {
	components: {DropZone},
	data () {
		return {
			nextBtnDisabled: true
		}
	},
	methods: {
		handleFiles (files) {
			console.log("received files from drag and drop component:", files)
		},
		handleNextClick () {

		}
	}
}
</script>

<style>
	.v-stepper__wrapper {
		height: 100% !important;
	}
</style>