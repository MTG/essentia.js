<template>
  <v-card elevation="0" color="secondary lighten-3">
    <v-card-title>Spectral profile</v-card-title>

    <svg id="spectral-chart"></svg>
  </v-card>
</template>

<script>
import * as d3 from 'd3';
import LineChart from './LineChart.js';

const barkBandFrequencies = [0, 100, 200, 300, 400, 510, 630, 770, 920, 1080, 1270, 1480, 1720, 2000, 2320, 2700, 3150, 3700, 4400, 5300, 6400, 7700, 9500, 12000, 15500, 20500, 27000];

export default {
  props: ['data'],
  data () {
    return {
      chart: null
    }
  },
  computed: {
    formattedData () {
      return this.data.map( (mag, bin) => {
        return {
          bin: bin,
          magnitude: mag
        }
      })
    }
  },
  mounted () {
		this.chart = new LineChart(this.formattedData, {
			svgSelector: '#spectral-chart',
			x: d => barkBandFrequencies[d.bin],
			y: d => d.magnitude,
      xType: d3.scaleLog,
      xDomain: [Number.EPSILON, 27000],
			color: '#E4454A',
			yLabel: 'Power Spectrum'
		})
  }
}
</script>

<style>

</style>