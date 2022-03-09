<template>
  <v-row>
		<v-col v-for="track in AnalysisData" :key="track.name">
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
								:momentary="track.loudness.momentary"
								:shortTerm="track.loudness.shortTerm"
							></loudness-card>
						</v-col>
						<v-col cols="6">
							<phase-card :data="track.phase"></phase-card>
						</v-col>
						<v-col cols="6">
							<spectral-card :data="track.spectralProfile.integrated"></spectral-card>
						</v-col>
					</v-row>
				</v-container>
			</v-card>
		</v-col>
	</v-row>
</template>

<script>
import LoudnessCard from './LoudnessCard.vue';
import PhaseCard from './PhaseCard.vue';
import SpectralCard from './SpectralCard.vue';

export default {
	components: {LoudnessCard, PhaseCard, SpectralCard},
	props: {
		AnalysisData: Array[Object]
	},
	data () {
		return {

		}
	},
	methods: {

	}
}
</script>

<style>

</style>