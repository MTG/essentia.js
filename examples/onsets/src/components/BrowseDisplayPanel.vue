<template>
    <section class="mx-2">
        <div id="audio-search-upload">
            <b-row class="my-3 justify-content-between">
                <b-col sm="5" class="px-0">
                    <b-input-group>
                        <b-form-input v-model="searchTerm" placeholder="Search Freesound.org" @change="searchFreesound"></b-form-input>
                        <b-input-group-append>
                            <b-button variant="light" class="px-4" @click="searchFreesound">
                                <b-icon icon="search"></b-icon>
                            </b-button>
                        </b-input-group-append>
                    </b-input-group>
                </b-col>
                <span sm="2" class="my-auto">Or</span>
                <b-col sm="5" class="px-0">
                    <b-input-group>
                        <b-form-input id="file-upload" placeholder="Upload from computer" readonly @click="uploadLabel.click()"></b-form-input>
                        <b-input-group-append>
                            <b-button variant="light" class="px-4" @click="uploadLabel.click()">
                                <b-icon icon="upload"></b-icon>
                            </b-button>
                        </b-input-group-append>
                    </b-input-group>
                    <label id="file-upload-label" class="d-none">
                        <input type="file" accept="audio/*, .m4a" @change="handleSoundUpload">
                    </label>
                </b-col>
            </b-row>
        </div>
        <freesound-results :class="[{ 'd-flex': showFreesoundResults }, { 'd-none': !showFreesoundResults }]"></freesound-results>
        <audio-display v-show="!showFreesoundResults"></audio-display>
    </section>
</template>

<script>
import EventBus from '../core/event-bus';
import AudioDisplay from './AudioDisplay.vue';
import FreesoundResults from './FreesoundResults.vue';
import freesound from 'freesound';
import apiKey from '../.env/key';

export default {
    components: { AudioDisplay, FreesoundResults },
    data () {
        return {
            showFreesoundResults: false,
            searchTerm: "",
            uploadLabel: null
        }
    },
    methods: {
        searchFreesound () {
            let searchOptions = {
                page: 1,
                filter: "duration:[1.0 TO 30.0]",
                sort: "rating_desc",
                page_size: 10,
                fields: "id,name,url,previews"
            };
            freesound.textSearch(this.searchTerm, searchOptions, this.handleSearchSuccess, this.handleSearchFailure);
        },
        handleSoundUpload (event) {
            event.preventDefault();

            let files = null;
            if (event.type == "change") {
                files = event.target.files;
            }
            if (event.type == "drop") {
                files = event.dataTransfer.files;
            }

            EventBus.$emit("sound-read", files[0]);
        },
        handleSearchSuccess (sounds) {
            EventBus.$emit("successful-fs-search", sounds.results);
            this.showFreesoundResults = true;
            this.searchTerm = "";
        },
        handleSearchFailure (error) {
            console.error("Freesound search failed", error);
        }
    },
    created () {
        // set FS API key
        freesound.setToken(apiKey);
        console.info("FS token set");

        EventBus.$on("sound-selected", () => {
            this.showFreesoundResults = false;
        })
    },
    mounted () {
        this.uploadLabel = document.querySelector("#file-upload-label");
    }
}

</script>

<style lang="scss" scoped>
    section {
        width: 80%;
    }
    #file-upload {
        background-color: inherit;
    }
</style>
