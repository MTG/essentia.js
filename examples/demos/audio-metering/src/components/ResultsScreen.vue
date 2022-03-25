<template>
  <v-row>
    <v-slide-group
      v-model="currentSlide"
      class="pa-4"
      show-arrows
    >
      <v-slide-item
        v-for="track in AnalysisData"
        :key="track.name"
      >
		<!-- <v-col v-for="track in AnalysisData" :key="track.name"> -->
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
								></phase-card>
							</v-col>
							<v-col cols="12">
								<spectral-card :data="track.spectralProfile.integrated" :trackname="track.name"></spectral-card>
							</v-col>
						</v-row>
					</v-container>
				</v-card>
			</v-slide-item>
    </v-slide-group>
  </v-row>
		<!-- </v-col> -->
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
			currentSlide: 0
		}
	},
	methods: {

	}
}
</script>

<style>

</style>