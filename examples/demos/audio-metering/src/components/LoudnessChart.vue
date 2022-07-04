<template>
	<v-expansion-panels flat hover>
		<v-expansion-panel class="secondary lighten-3">
			<v-expansion-panel-header class="px-4">
				Momentary & short-term
			</v-expansion-panel-header>
			<v-expansion-panel-content eager>
				<div>
					<svg :id="chartId"></svg>
				</div>
			</v-expansion-panel-content>
		</v-expansion-panel>
	</v-expansion-panels>
</template>

<script>
import * as d3 from 'd3';
import LineChart from './LineChart.js';

export default {
	props: ['data', 'trackID'],
	data () {
		return {
			chart: null
		}
	},
	computed: {
		chartId () {
			// let whitespaceEscapedName = this.trackname.replace(/\s|\.|\d/g, '-');
			return `loudness-${this.trackID}`;
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
			yDomain: [-70, 0],
			height: 285
		})
	}
}
</script>

<style>
</style>