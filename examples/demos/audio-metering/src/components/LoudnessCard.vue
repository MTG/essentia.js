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
					</tr>
					<tr>
						<td>Range</td>
						<td>{{range.toFixed(3)}} dB LU</td>
					</tr>
				</tbody>
			</template>
		</v-simple-table>
		<v-divider></v-divider>
		<loudness-chart :data="chartData" :trackname="trackname"></loudness-chart>
		<v-card-subtitle>RMS</v-card-subtitle>
		<v-simple-table class="secondary lighten-3">
			<template v-slot:default>
				<tbody>
					<tr>
						<td>Left channel</td>
						<td>{{rms.left.toFixed(3)}} dB</td>
					</tr>
					<tr>
						<td>Right channel</td>
						<td>{{rms.right.toFixed(3)}} dB</td>
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

export default {
	props: {
		'integrated': Number,
		'range': Number,
		'rms': Object,
		'momentary': Array,
		'shortTerm': Array,
		'trackname': String
	},
	components: { LoudnessChart },
	data () {
		let chartData = [];
		this.momentary.map( (val, i) => {
			chartData.push({
				time: timestampFromFramePosition(i, 0.4),
				dBs: val,
				measurement: 'momentary'
			});
		})
		this.shortTerm.map( (val, i) => {
			chartData.push({
				time: timestampFromFramePosition(i, 3),
				dBs: val,
				measurement: 'short-term'
			});
		})
		return {
			chartData: chartData,		
		}
	}
}
</script>

<style>

</style>