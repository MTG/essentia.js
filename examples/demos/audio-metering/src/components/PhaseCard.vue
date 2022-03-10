<template>
	<v-card elevation="0" color="secondary lighten-3">
		<v-card-title>Phase Correlation</v-card-title>

		<v-card-text>
			<svg id="phase-goniometer"></svg>
		</v-card-text>
	</v-card>
</template>

<script>
import LissajousChart from './LissajousChart.js';

export default {
	props: ['data'],
	data () {
		return {
			chart: null
		}
	},
	mounted () {
		this.chart = new LissajousChart(this.data.channelData, {
			svgSelector: '#phase-goniometer',
			color: '#e4454a44',
			xDomain: [-1, 1],
			yDomain: [-1, 1]
		})
	}
}
</script>

<style>

</style>