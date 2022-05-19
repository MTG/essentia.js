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
        <metering-card :track="track"></metering-card>
      </v-slide-item>
    </v-slide-group>
  </v-row>
</template>

<script>
import MeteringCard from './MeteringCard.vue';

export default {
	components: { MeteringCard },
	props: {
		AnalysisData: Array[Object]
	},
	data () {
		return {
			currentSlide: 0
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
	}
}
</script>

<style>

</style>