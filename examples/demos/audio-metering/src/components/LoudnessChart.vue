<template>
	<div id="chart-wrapper">
		<svg id="loudness-chart"></svg>
	</div>
</template>

<script>
import * as d3 from 'd3';
import LineChart from './LineChart.js';

export default {
	props: ['data'],
	data () {
		return {
			chart: null
		}
	},
	mounted () {
		this.chart = new LineChart(this.data, {
			svgSelector: '#loudness-chart',
			x: d => d3.timeParse('%M:%S:%L')(d.time),
			y: d => d.dBs,
			z: d => d.measurement,
			color: (z) => {
				return z == 'short-term' ? '#E4454A' : '#E3E05B';
			},
			xFormat: '%M:%S',
			xType: d3.scaleTime,
			yLabel: 'dB',
			yDomain: [d3.min(d3.map(this.data, d => d.dBs)) - 3, 0]
		})
	}
}
</script>

<style>
</style>