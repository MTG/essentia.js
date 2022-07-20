<template>
	<v-expansion-panels flat hover>
		<v-expansion-panel class="secondary lighten-3" key="0">
			<v-expansion-panel-header class="px-4" :class="headerColor">
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
	props: {
		data: Array,
		trackID: String,
		colors: Object,
		isRef: Boolean
	},
	data () {
		return {
			chart: null,
			// selected: undefined
		}
	},
	watch: {
		data () {
			console.log('loudnesschart data change');
			console.log('chartId', this.chartId);
			this.$nextTick(() => {
				this.createChart();
			})
		}
	},
	computed: {
		chartId () {
			// let whitespaceEscapedName = this.trackname.replace(/\s|\.|\d/g, '-');
			if (this.isRef) return `loudness-${this.trackID}-${String(Math.random()).split('.')[1]}`;
			return `loudness-${this.trackID}`;
		},
		headerColor () {
			return `${this.colors.header}--text`;
		}
	},
	methods: {
		createChart () {
			if (this.chart) this.chart.selectAll('*').remove();

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
				height: 285,
				showLegend: true
			})
		}
	},
	mounted () {
		this.createChart();
	}
}
</script>

<style>
</style>