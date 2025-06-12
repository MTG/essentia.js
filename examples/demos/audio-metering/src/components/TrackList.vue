<template>
  <v-card height="100%">
		<v-list dense>
			<v-toolbar flat>
				<v-tooltip bottom>
					<template v-slot:activator="{ on, attrs }">
						<v-btn icon light @click="() => $emit('cancel')" v-bind="attrs" v-on="on">
							<v-icon color="secondary darken-2">
								mdi-arrow-left
							</v-icon>
						</v-btn>
					</template>
					<span>Cancel</span>
				</v-tooltip>
				<v-toolbar-title class="secondary--text text--darken-2">
					Selected tracks
				</v-toolbar-title>
			</v-toolbar>
			<v-list-item v-for="trackName in tracks" :key="trackName" inactive>
				<v-list-item-avatar class="my-0">
					<v-icon>mdi-file-music-outline</v-icon>
				</v-list-item-avatar>
				<v-list-item-content>
					<v-list-item-title v-text="trackName"></v-list-item-title>
				</v-list-item-content>
				<v-list-item-action class="my-0">
					<v-btn icon @click="() => handleRemove(trackName)">
						<v-icon>mdi-trash-can-outline</v-icon>
					</v-btn>
				</v-list-item-action>
			</v-list-item>
		</v-list>
		<v-snackbar 
			absolute 
			timeout="-1" 
			v-model="showUndoPrompt"
			elevation="0"
			color="accent darken-2"
			text
		>
			Removed track '{{deletedTrack}}'
			<template v-slot:action="{ attrs }">
        <v-tooltip top>
					<template v-slot:activator="{ on }">
						<v-btn
							color="accent darken-2"
							v-bind="attrs"
							@click="handleUndo"
							v-on="on"
							text
						>
							<v-icon>
								mdi-undo-variant
							</v-icon>
						</v-btn>
					</template>
					<span>Undo</span>
				</v-tooltip>
      </template>
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