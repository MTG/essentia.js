<template>
  <v-card elevation="0" color="secondary lighten-3">
		<v-card-title>Loudness</v-card-title>
		<v-card-subtitle>EBU R128</v-card-subtitle>
		<v-simple-table class="secondary lighten-3">
			<template v-slot:default>
				<tbody>
					<tr>
						<td>Integrated</td>
						<td>{{integrated.toFixed(3)}} LUFS</td>
						<td v-if="refTrack !== undefined"  class="primary--text">{{refTrack.loudness.integrated.toFixed(3)}} LUFS</td>
					</tr>
					<tr>
						<td>Range</td>
						<td>{{range.toFixed(3)}} dB LU</td>
						<td v-if="refTrack !== undefined"  class="primary--text">{{refTrack.loudness.range.toFixed(3)}} dB LU</td>
					</tr>
				</tbody>
			</template>
		</v-simple-table>
		<v-divider></v-divider>
		<loudness-chart :data="chartData" :trackID="trackID" :colors="stdColors" :isRef="false"></loudness-chart>
		<v-divider v-if="refTrack !== undefined"></v-divider>
		<loudness-chart v-show="refTrack !== undefined" :data="refChartData" :trackID="refTrackID" :colors="refColors" :isRef="true"></loudness-chart>
		<v-divider></v-divider>
		<v-card-subtitle>RMS</v-card-subtitle>
		<v-simple-table class="secondary lighten-3">
			<template v-slot:default>
				<tbody>
					<tr>
						<td>Mono mix</td>
						<td>{{rms.mono.toFixed(3)}} dB</td>
						<td v-if="refTrack !== undefined" class="primary--text">{{refTrack.loudness.rms.mono.toFixed(3)}} dB</td>
					</tr>
				</tbody>
			</template>
		</v-simple-table>
	</v-card>
</template>

<script>
import LoudnessChart from './LoudnessChart.vue';

const timestampFromFramePosition = (framePos, frameSize) => {
	let time = framePos * 0.1 + frameSize*0.5; // loudness EBU default hopsize = 0.1
	if (framePos !== 0) time += 1E-15;
	let minutes = Math.floor(time / 60);
	let remainder = String(time % 60).split('.');
	let milliseconds = remainder[1] ? remainder[1].slice(0, 3) : '000';
	let seconds = remainder[0]
	return `${minutes}:${seconds.length > 1 ? seconds : '0'+seconds}:${milliseconds}`;
}

const getChartData = (momentary, shortTerm) => {
	let chartData = [];
	momentary.map( (val, i) => {
		chartData.push({
			time: timestampFromFramePosition(i, 0.4),
			dBs: val,
			measurement: 'momentary'
		});
	})
	shortTerm.map( (val, i) => {
		chartData.push({
			time: timestampFromFramePosition(i, 3),
			dBs: val,
			measurement: 'short-term'
		});
	})
	return chartData;
};

export default {
	props: {
		'integrated': Number,
		'range': Number,
		'rms': Object,
		'momentary': Array,
		'shortTerm': Array,
		'trackID': String,
		refTrack: {
			default: undefined,
			required: true
		}
	},
	components: { LoudnessChart },
	data () {
		return {
			chartData: getChartData(this.momentary, this.shortTerm),
			stdColors: {'momentary': '#E4454A', 'short-term': '#E3E05B', 'header': 'black'},
			refColors: {'momentary': '#000', 'short-term': '#9E9E9E', 'header': 'primary'}
		}
	},
	computed: {
		refChartData () {
			if (this.refTrack) {
				return getChartData(this.refTrack.loudness.momentary, this.refTrack.loudness.shortTerm);
			}
			return [];
		},
		refTrackID () {
			if (this.refTrack) return this.refTrack.uuid;
			return '';
		}
	}
}
</script>

<style>
</style>