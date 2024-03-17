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
  props: {
    spectralData: Array, 
    trackID: String, 
    sampleRate: Number,
    refTrack: {
      default: undefined,
      required: true
    }
  },
  data () {
    return {
      minMag: -90, // dB
      tiltSlope: 3
    }
  },
  computed: {
    chartData () {
      let formattedData = [];
      
      this.getFormattedData(this.dataCopy, 'track energy', formattedData);
      if (this.refTrack !== undefined) {
        this.getFormattedData(this.refDataCopy, 'reference energy', formattedData);
      }
      
      return formattedData;
    },
    dataCopy () {
      let dataCopy = this.spectralData.slice();
      dataCopy[0] = this.minMagLinear;
      dataCopy.unshift(this.minMagLinear);
      dataCopy.push(this.minMagLinear);
      return dataCopy;
    },
    refDataCopy () {
      if (this.refTrack !== undefined) {
        let refDataCopy = this.refTrack.spectralProfile.integrated.slice();
        refDataCopy[0] = this.minMagLinear;
        refDataCopy.unshift(this.minMagLinear);
        refDataCopy.push(this.minMagLinear);
        return refDataCopy;
      }
      return [];
    },
    chartId () {
			// let whitespaceEscapedName = this.trackname.replace(/\s|\.|\d/g, '-');
			return `spectral-${this.trackID}`;
		},
    minMagLinear () {
      return Math.pow(10, this.minMag/20);
    },
    pinkCorrectionWeights () {
      return linspace(db2lin(-this.tiltSlope), db2lin(this.tiltSlope), this.dataCopy.length);
    },
    colors () {
      return {
        darkRed: this.$root.$vuetify.theme.themes.light.error,
        primaryRed: this.$root.$vuetify.theme.themes.light.primary
      }
    }
  },
  watch: {
    refTrack(newVal) {
      this.$nextTick(() => {
        this.chart.selectAll('*').remove();
        // redraw graph with Z axis data
        this.drawChart();
      })
    }
  },
  mounted () {
		this.drawChart();
  },
  methods: {
    binToFreq (bin) {
      const fftSize = (this.spectralData.length-1) * 2;
      return bin * this.sampleRate / fftSize;
    },
    drawChart () {
      this.chart = new LineChart(this.chartData, {
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
				color: (z) => {
					if (z == 'track energy') return this.colors.darkRed;
          return this.colors.primaryRed;
				},
        yLabel: 'dBFS',
        yDomain: [this.minMag, 0],
        fillColor: `${this.colors.primaryRed}44`,
        showGrid: true,
        showLegend: true
      })
    },
    getFormattedData (data, type, container) {
      for (let bin = 1; bin < data.length; bin++) {
        const mag = data[bin];
        let correctedMag = Math.sqrt(mag) * this.pinkCorrectionWeights[bin];
        if (bin == 1 || bin == data.length-1) {
          correctedMag = mag;
        }
        container.push({
          freq: this.binToFreq(bin),
          magnitude: 20 * Math.log10(correctedMag+Number.EPSILON), // bin magnitude in dBFS
          type: type
        });
      }
      return container;
    }
  }
}
</script>

<style>

</style>