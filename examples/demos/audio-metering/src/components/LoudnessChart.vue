<template>
	<v-card-text>
  <!-- <div class="pa-1"> -->
		<svg :id="chartId"></svg>
  <!-- </div> -->
	</v-card-text>
</template>

<script>
import * as d3 from 'd3';
import LineChart from './LineChart.js';

export default {
	props: ['data', 'trackname'],
	data () {
		return {
			chart: null
		}
	},
	computed: {
		chartId () {
			let whitespaceEscapedName = this.trackname.replace(/\s|\.|\d/g, '-');
			return `${whitespaceEscapedName}-loudness`;
		} 
	},
	mounted () {
		this.chart = new LineChart(this.data, {
			svgSelector: `#${this.chartId}`,
			x: d => d3.timeParse('%M:%S:%L')(d.time),
			y: d => d.dBs,
			z: d => d.measurement,
			color: (z) => {
				return z == 'short-term' ? '#E4454A' : '#E3E05B';
			},
			xFormat: '%M:%S',
			xType: d3.scaleTime,
			xLabel: 'Time (min:sec)',
			yLabel: 'dB',
			yDomain: [d3.min(d3.map(this.data, d => d.dBs)) - 3, 0]
		})
	}
}
</script>

<style>
</style>