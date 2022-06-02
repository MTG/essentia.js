<template>
	<v-card :class="[`ma-${selectedAsRefCardElevation}`, selectedAsRef === 'selected' ? 'highlight-card' : '']" 
          :elevation="selectedAsRefCardElevation" max-width="500">
		<v-toolbar flat dense>
			<v-btn icon color="primary" text>
				<v-icon>mdi-tray-arrow-down</v-icon>
			</v-btn>
			<v-toolbar-title class="primary--text">{{ track.name }}</v-toolbar-title>
			<v-spacer></v-spacer>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn-toggle
            v-model="selectedAsRef"
            color="primary"
            rounded
            group
          >
            <v-btn v-on="on"
            v-bind="attrs" value="selected">
              <v-icon :color="selectedAsRefBtnColor">mdi-compare-horizontal</v-icon>
            </v-btn>
          </v-btn-toggle>
        </template>
        <span>Use as reference track</span>
      </v-tooltip>
		</v-toolbar>
		<v-divider></v-divider>
		<v-container fluid>
			<v-row dense>
				<v-col cols="12">
					<loudness-card
						:integrated="track.loudness.integrated"
						:range="track.loudness.range"
						:rms="track.loudness.rms"
						:momentary="track.loudness.momentary"
						:shortTerm="track.loudness.shortTerm"
						:trackID="track.uuid"
					></loudness-card>
				</v-col>
				<v-col cols="12">
					<phase-card 
						:leftCh="track.phase.channelData[0]"
						:rightCh="track.phase.channelData[1]"
						:correlation="track.phase.correlation"
					></phase-card>
				</v-col>
				<v-col cols="12">
					<spectral-card :spectral-data="track.spectralProfile.integrated" 
						:trackID="track.uuid" :sample-rate="track.sampleRate">
					</spectral-card>
				</v-col>
			</v-row>
		</v-container>
	</v-card>
</template>

<script>
import LoudnessCard from './LoudnessCard.vue';
import PhaseCard from './PhaseCard.vue';
import SpectralCard from './SpectralCard.vue';

export default {
	props: {
		track: Object,
    refTrack: {
      default: undefined,
      required: true
    },
    refTrackID: String
	},
	components: {LoudnessCard, PhaseCard, SpectralCard},
	data () {
		return {
			selectedAsRef: undefined,
      selectedAsRefBtnColor: 'secondary',
      selectedAsRefCardElevation: "3"
		}
	},
  watch: {
    selectedAsRef (newVal) {
      if (newVal === "selected") {
        this.selectedAsRefBtnColor = 'primary';
        this.selectedAsRefCardElevation = "0";
        this.$emit('ref-selected', this.track.uuid);
      }
      if (newVal === undefined) {
        this.selectedAsRefBtnColor = 'secondary';
        this.selectedAsRefCardElevation = "3";
      }
    },
    refTrackID (newVal) {
      if (newVal === '' || newVal === undefined) return;
      if (newVal !== this.track.uuid) {
        this.selectedAsRef = undefined;
      }
    }
  }
}
</script>

<style scoped>
  .highlight-card {
    border-width: 2px;
    border-color: #E4454A88;
    border-style: solid;
  }
</style>
