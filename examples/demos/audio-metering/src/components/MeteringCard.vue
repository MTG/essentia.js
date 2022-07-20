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
            @change="handleRefToggleChange"
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
		<v-container fluid id="relative-container">
      <v-overlay
        :value="showOverlay"
        absolute
        color="#ffffff"
        opacity="0.6"
      ></v-overlay>
			<v-row dense>
				<v-col cols="12">
					<loudness-card
						:integrated="track.loudness.integrated"
						:range="track.loudness.range"
						:rms="track.loudness.rms"
						:momentary="track.loudness.momentary"
						:shortTerm="track.loudness.shortTerm"
						:trackID="track.uuid"
            :refTrack="showRef ? refTrack : undefined"
					></loudness-card>
				</v-col>
				<v-col cols="12">
					<phase-card 
						:leftCh="track.phase.channelData[0]"
						:rightCh="track.phase.channelData[1]"
						:correlation="track.phase.correlation"
            :refTrack="showRef ? refTrack : undefined"
					></phase-card>
				</v-col>
				<v-col cols="12">
					<spectral-card 
            :spectral-data="track.spectralProfile.integrated" 
						:trackID="track.uuid" 
            :sample-rate="track.sampleRate"
            :refTrack="showRef ? refTrack : undefined"
          >
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
  },
  computed: {
    showOverlay () {
      if (this.selectedAsRef === "selected") return true;
      return false;
    },
    showRef () {
      if (this.refTrack !== undefined && this.refTrackID !== this.track.uuid) {
        return true;
      }
      return false;
    }
  },
  methods: {
    handleRefToggleChange (val) {
      if (val === "selected") {
        this.$emit('ref-selected', this.track.uuid);
      }
      if (val === undefined) {
        this.$emit('ref-unselected', this.track.uuid);
      }
    }
  }
}
</script>

<style scoped>
  #relative-container {
    position: relative;
  }

  .highlight-card {
    border-width: 2px;
    border-color: #E4454A88;
    border-style: solid;
  }
</style>
