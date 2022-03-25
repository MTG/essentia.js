<template>
  <v-card elevation="0" color="secondary lighten-3">
    <v-card-title>Spectral profile</v-card-title>

    <v-card-text>
      <svg :id="chartId"></svg>
    </v-card-text>
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
  props: ['data', 'trackname'],
  data () {
    return {
      chart: null
    }
  },
  computed: {
    formattedData () {
      const maxMag = Math.max(...this.data);
      return this.data.map( (mag, bin) => {
        return {
          freq: binToFreq(bin, this.data.length * 2),
          magnitude: 20 * Math.log10((mag+Number.EPSILON)/1.0), // bin magnitude in dBFS
          type: ''
        }
      })
    },
    chartId () {
			let whitespaceEscapedName = this.trackname.replace(/\s|\.|\d/g, '-');
			return `${whitespaceEscapedName}-spectral`;
		}
  },
  mounted () {
		this.chart = new LineChart(this.formattedData.slice(1), {
			svgSelector: `#${this.chartId}`,
			x: d => d.freq,
			y: d => d.magnitude,
      z: d => d.type,
      xType: d3.scaleLog,
      xLabel: "Hz",
      // xDomain: [1, 27000],
			color: '#E4454A',
			yLabel: 'Energy',
      yDomain: [d3.min(d3.map(this.formattedData, d => d.magnitude)) - 3, 0],
      fillColor: '#e4454a44'
		})
  }
}
</script>

<style>

</style>