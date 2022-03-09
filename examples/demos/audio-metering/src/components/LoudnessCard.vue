<template>
  <v-card elevation="0" color="secondary lighten-3">
		<v-card-title>Loudness EBU</v-card-title>

    <v-simple-table class="secondary lighten-3">
			<template v-slot:default>
				<tbody>
					<tr>
						<td><b>Integrated</b></td>
						<td>{{integrated}}</td>
					</tr>
					<tr>
						<td><b>Range</b></td>
						<td>{{range}}</td>
					</tr>
				</tbody>
			</template>
		</v-simple-table>
		<v-divider></v-divider>
		<loudness-chart :data="chartData"></loudness-chart>
	</v-card>
</template>

<script>
import LoudnessChart from './LoudnessChart.vue';

const timestampFromFramePosition = (framePos) => {
	let time = framePos * 0.1; // loudness EBU default hopsize = 0.1
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
		'momentary': Array,
		'shortTerm': Array
	},
	components: { LoudnessChart },
	data () {
		let chartData = [];
		this.momentary.map( (val, i) => {
			chartData.push({
				time: timestampFromFramePosition(i),
				dBs: val,
				measurement: 'momentary'
			});
		})
		this.shortTerm.map( (val, i) => {
			chartData.push({
				time: timestampFromFramePosition(i),
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