<template>
  <v-row>
    <v-slide-group
      v-model="currentSlide"
      class="pa-4"
      show-arrows
    >
      <v-slide-item
        v-for="(track, trackID) in AnalysisData"
        :key="trackID"
      >
        <metering-card 
          :track="track" 
          :uuid="trackID" 
          @ref-selected="handleSelectedAsRef"
          :refTrack="selectedAsRefID !== undefined ? AnalysisData[selectedAsRefID] : undefined"
          :refTrackID="selectedAsRefID"
        ></metering-card>
      </v-slide-item>
    </v-slide-group>
  </v-row>
</template>

<script>
import MeteringCard from './MeteringCard.vue';

export default {
	components: { MeteringCard },
	props: {
		AnalysisData: Object[Object],
	},
	data () {
		return {
			currentSlide: 0,
			selectedAsRefID: undefined
		}
	},
	methods: {
		// formatName (name) {
		// 	const startNumRegexp = /^\d+/;
		// 	const tempstr = name.replace(reg, '');
		// 	return tempstr.replace(' ', '-');
		// },
		// handlePanelClick (name) {
			
		// }
		handleSelectedAsRef (trackID) {
			this.selectedAsRefID = trackID;
			// pass this track's data to other MeteringCard instances
		}
	}
}
</script>

<style>

</style>