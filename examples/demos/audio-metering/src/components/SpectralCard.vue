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

export default {
  props: ['spectralData', 'trackname', 'sampleRate'],
  data () {
    return {
      dataCopy: this.spectralData.slice()
    }
  },
  computed: {
    formattedData () {
      return this.dataCopy.map( (mag, bin) => {
        return {
          freq: this.binToFreq(bin),
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
    const minMag = -130; // dB
    const minMagLinear = Math.pow(10, minMag/20);
    this.dataCopy[0] = minMagLinear;
    this.dataCopy.unshift(minMagLinear);
    this.dataCopy.push(minMagLinear);

		this.chart = new LineChart(this.formattedData.slice(1), {
			svgSelector: `#${this.chartId}`,
			x: d => d.freq,
			y: d => d.magnitude,
      z: d => d.type,
      xType: d3.scaleLog,
      xLabel: "Hz",
      xFormat: (tickLabel) => {
        let strLabel = String(tickLabel);
        if (strLabel.includes('3') || strLabel.includes('4')) return '';
        if (strLabel.length > 3) strLabel = strLabel.replace(/\d{3}$/, 'k')
        return strLabel;
      },
			color: '#E4454A',
			yLabel: 'Energy',
      yDomain: [minMag, 0],
      fillColor: '#e4454a44',
      showGrid: true
		})
  },
  methods: {
    binToFreq (bin) {
      const fftSize = (this.spectralData.length-1) * 2;
      return bin * this.sampleRate / fftSize;
    }
  }
}
</script>

<style>

</style>