<template>
  <v-hover v-slot="{ hover }">
			<v-sheet
				id="dropzone"
				tabindex="0"
				:color="hover ? 'white' : 'secondary lighten-3'"
				width="100%"
				height="100%"
				class="d-flex flex-column align-center rounded-lg transition-swing"
				:elevation="hover ? 6 : 1"
			>
				<input type="file" accept="audio/*" style="display: none;" multiple>
				<v-row>
					<v-icon
						v-if="!dragover" 
						:color="hover ? 'primary' : 'primary darken-1'" 
						size="5em"
					>mdi-tray-arrow-up</v-icon>
					<v-icon
						v-if="dragover" 
						:color="hover ? 'primary' : 'primary darken-1'" 
						size="5em"
					>mdi-plus-thick</v-icon>
				</v-row>
				<v-row class="ma-0">
					<span 
						class="title primary--text"
						:class="hover ? 'text' : 'text--darken-1'"
					>
						Drag'n drop or click to upload file!
					</span>
				</v-row>
			</v-sheet>
	</v-hover>
</template>

<script>
export default {
    data () {
        return {
            dragover: false,
        }
    },
    mounted () {
        const dropzone = this.$el;
        const fileupload = this.$el.firstElementChild;
        console.log('fileupload', fileupload);

        if(dropzone) {
            // register all drag & drop event listeners
            dropzone.addEventListener("dragenter", e => {
                e.preventDefault();
                this.dragover = true;
            })
            dropzone.addEventListener("dragleave", e => {
                e.preventDefault();
                this.dragover = false;
            })
            dropzone.addEventListener("dragover", e => {
                e.preventDefault();
                this.dragover = true;
            })
            dropzone.addEventListener("drop", e => {
                e.preventDefault()
                const dragevent = e;
                if(dragevent.dataTransfer) {
                    this.filesSelected(dragevent.dataTransfer.files);
                }
            })

            dropzone.addEventListener("mousedown", e => {
                console.log('dropzone was clicked')
                e.preventDefault();
                if(fileupload) {
                    fileupload.click()
                }
            })
            dropzone.addEventListener("keypress", e => {
                console.log('keypress on dropzone');
                e.preventDefault();
                if (e.key === "Enter") {
                    if(fileupload) fileupload.click();
                }
            })
            // register listeners on the file input
            if(fileupload) {
                fileupload.addEventListener("change", e => {
                    const target = e.target;
                    if(target.files) {
                        this.filesSelected(target.files)
                    }
                })
            }
        }
    },
    methods: {
        filesSelected (fileList) {
            this.dragover = false;
            this.$emit('files-selected', fileList);
        }
    }
}
</script>

<style lang="scss" scoped>

#dropzone {
	cursor: pointer;
}
</style>