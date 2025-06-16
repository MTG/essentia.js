<template>
  <v-card height="100%">
		<v-list density="compact">
			<v-toolbar flat>
				<v-tooltip location="bottom">
					<template v-slot:activator="{ props }">
						<v-btn icon @click="() => $emit('cancel')" v-bind="props">
							<v-icon icon="mdi-arrow-left" color="secondary-darken-2"></v-icon>
						</v-btn>
					</template>
					<span>Cancel</span>
				</v-tooltip>
				<v-toolbar-title class="text-secondary-darken-2">
					Selected tracks
				</v-toolbar-title>
			</v-toolbar>
			<v-list-item v-for="trackName in tracks" :key="trackName" inactive prepend-icon="<v-icon icon='mdi-file-music-outline'></v-icon>">
				<v-list-item-title>{{ trackName }}</v-list-item-title>
				<v-list-item-action class="my-0">
					<v-btn icon @click="() => handleRemove(trackName)">
						<v-icon icon="mdi-trash-can-outline"></v-icon>
					</v-btn>
				</v-list-item-action>
			</v-list-item>
		</v-list>
		<v-snackbar 
			absolute 
			timeout="-1" 
			v-model="showUndoPrompt"
			class="elevation-0"
			color="accent-darken-2"
		>
			Removed track '{{deletedTrack}}'
        <v-tooltip location="top">
					<template v-slot:activator="{ props }">
						<v-btn
							color="accent-darken-2"
							v-bind="props"
							@click="handleUndo"
							variant="text"
						>
							<v-icon>
								mdi-undo-variant
							</v-icon>
						</v-btn>
					</template>
					<span>Undo</span>
				</v-tooltip>
		</v-snackbar>
  </v-card>
</template>

<script>
export default {
	props: {
		tracks: Array[String]
	},
	data () {
		return {
			showUndoPrompt: false,
			deletedTrack: ""
		}
	},
	methods: {
		handleRemove (track) {
			this.$emit('remove-track', track);
			this.deletedTrack = track;
			this.showUndoPrompt = true;
		},
		handleUndo () {
			this.$emit('undo');
			this.showUndoPrompt = false;
		}
	}
}
</script>

<style>

</style>