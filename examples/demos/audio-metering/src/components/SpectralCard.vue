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

function db2lin (db) {
  return Math.pow(10, db/20) - Number.EPSILON;
}

function linspace(x0, xN, n){
  let dx = (xN - x0)/(n-1);
  const x = [];
  for(let i=0; i < n; ++i) {
    x.push(x0 + i*dx);
  }
  return x;
}

export default {
  props: ['spectralData', 'trackID', 'sampleRate'],
  data () {
    return {
      dataCopy: this.spectralData.slice(),
      minMag: -90, // dB
      tiltSlope: 3
    }
  },
  computed: {
    formattedData () {
      const pinkCorrectionWeights = linspace(db2lin(-this.tiltSlope), db2lin(this.tiltSlope), this.dataCopy.length);
      // console.info({pinkCorrectionWeights});
      const formatted = this.dataCopy.map( (mag, bin) => {
        let correctedMag = Math.sqrt(mag) * pinkCorrectionWeights[bin];
        if (bin <= 1 || bin == this.dataCopy.length-1) {
          correctedMag = mag;
        }
        return {
          freq: this.binToFreq(bin),
          magnitude: 20 * Math.log10(correctedMag+Number.EPSILON), // bin magnitude in dBFS
          type: ''
        }
      });
      return formatted;
    },
    chartId () {
			// let whitespaceEscapedName = this.trackname.replace(/\s|\.|\d/g, '-');
			return `spectral-${this.trackID}`;
		}
  },
  mounted () {
    const minMagLinear = Math.pow(10, this.minMag/20);
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
      yDomain: [this.minMag, 0],
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