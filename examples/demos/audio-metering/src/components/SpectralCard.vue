<template>
  <v-card elevation="0" color="secondary lighten-3">
    <v-card-title>Spectral profile</v-card-title>

    <svg id="spectral-chart"></svg>
  </v-card>
</template>

<script>
import * as d3 from 'd3';
import LineChart from './LineChart.js';

// const barkBandFrequencies = [1, 100, 200, 300, 400, 510, 630, 770, 920, 1080, 1270, 1480, 1720, 2000, 2320, 2700, 3150, 3700, 4400, 5300, 6400, 7700, 9500, 12000, 15500, 20500, 27000];

const binToFreq = (bin, fftSize) => {
  return bin * 44100 / fftSize;
}

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
          magnitude: mag,
          type: 'bark-bands'
        }
      })
    }
  },
  mounted () {
		this.chart = new LineChart(this.formattedData.slice(1), {
			svgSelector: '#spectral-chart',
			x: d => binToFreq(d.bin, this.formattedData.length * 2),
			y: d => d.magnitude,
      z: d => d.type,
      xType: d3.scaleLog,
      // xDomain: [1, 27000],
			color: '#E4454A',
			yLabel: 'Power Spectrum',
      fillColor: '#e4454a44'
		})
  }
}
</script>

<style>

</style>