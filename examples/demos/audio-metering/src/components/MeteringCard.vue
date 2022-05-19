<template>
	<v-card max-width="500">
		<v-toolbar elevation="0" dense>
			<v-btn icon color="primary" text>
				<v-icon>mdi-tray-arrow-down</v-icon>
			</v-btn>
			<v-toolbar-title class="primary--text">{{ track.name }}</v-toolbar-title>
		</v-toolbar>
		<v-divider></v-divider>
		<v-container fluid>
			<v-row dense>
				<v-col cols="12">
					<loudness-card
						:integrated="track.loudness.integrated"
						:range="track.loudness.range"
						:rms="track.loudness.rms"
						:momentary="track.loudness.momentary"
						:shortTerm="track.loudness.shortTerm"
						:trackname="track.name"
					></loudness-card>
				</v-col>
				<v-col cols="12">
					<phase-card 
						:leftCh="track.phase.channelData[0]"
						:rightCh="track.phase.channelData[1]"
						:correlation="track.phase.correlation"
					></phase-card>
				</v-col>
				<v-col cols="12">
					<spectral-card :spectral-data="track.spectralProfile.integrated" 
						:trackname="track.name" :sample-rate="track.sampleRate">
					</spectral-card>
				</v-col>
			</v-row>
		</v-container>
	</v-card>
</template>

<script>
import LoudnessCard from './LoudnessCard.vue';
import PhaseCard from './PhaseCard.vue';
import SpectralCard from './SpectralCard.vue';

export default {
	props: {
		track: Object
	},
	components: {LoudnessCard, PhaseCard, SpectralCard}
}
</script>
