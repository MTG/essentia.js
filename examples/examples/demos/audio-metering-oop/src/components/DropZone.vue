<template>
<v-hover>
    <template v-slot:default="{ isHovering, props}">
        <v-sheet
            id="dropzone"
            ref="dropzone"
            tabindex="0"
            :color="isHovering ? 'white' : 'secondary-lighten-3'"
            class="d-flex flex-column align-center rounded-lg"
            :elevation="isHovering ? 6 : 1"
            v-bind="props"
        >
            <input type="file" accept="audio/*" style="display: none;" multiple>
            <v-row>
                <v-icon
                    v-show="!dragover" 
                    :color="isHovering ? 'primary' : 'primary-darken-1'" 
                    size="5em"
                    icon="mdi-tray-arrow-up"
                ></v-icon>
                <v-icon
                    v-show="dragover" 
                    :color="isHovering ? 'primary' : 'primary-darken-1'" 
                    size="5em"
                    icon="mdi-plus-thick"
                ></v-icon>
            </v-row>
            <v-row class="ma-auto">
                <span 
                    class="text-h6 text-primary"
                    :class="isHovering ? 'text' : 'text-primary-darken-1'"
                >
                    Drop or click to upload file!
                </span>
            </v-row>
        </v-sheet>
    </template>
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
        const dropzone = this.$refs.dropzone.$el;
        console.log(dropzone)
        const fileupload = dropzone.firstElementChild;

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