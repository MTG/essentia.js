<template>
  <v-row>
    <v-slide-group
      v-model="currentSlide"
      class="pa-4"
      show-arrows
    >
      <v-slide-group-item
        v-for="(track, trackID) in analysisData"
        :key="trackID"
      >
        <metering-card 
          :track="track" 
          :uuid="trackID" 
          @ref-selected="handleRefSelected" @ref-unselected="handleRefUnselected"
          :refTrack="selectedAsRefID !== undefined ? analysisData[selectedAsRefID] : undefined"
          :refTrackID="selectedAsRefID"
        ></metering-card>
      </v-slide-group-item>
    </v-slide-group>
  </v-row>
</template>

<script>
import MeteringCard from './MeteringCard.vue';

export default {
	components: { MeteringCard },
	props: {
		analysisData: Object[Object],
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
		handleRefSelected (trackID) {
			this.selectedAsRefID = trackID;
			// pass this track's data to other MeteringCard instances
		},
		handleRefUnselected () {
			this.selectedAsRefID = undefined;
		}
	}
}
</script>

<style>

</style>