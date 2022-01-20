<template>
    <section class="mb-2 mt-4">
        <div id="audio-search-upload" class="my-2 mx-0 row justify-content-between">
            <div class="px-0 col-5">
                <b-input-group>
                    <b-form-input v-model="searchTerm" placeholder="Search Freesound.org" @change="searchFreesound" 
                    v-b-tooltip.focus.bottom title="Prepend a number with # to search by Freesound ID"></b-form-input>
                    <b-input-group-append>
                        <b-button variant="light" class="px-4" @click="searchFreesound">
                            <b-icon icon="search"></b-icon>
                        </b-button>
                    </b-input-group-append>
                </b-input-group>
            </div>
            <span class="my-auto col-2">Or</span>
            <div class="px-0 col-5">
                <b-input-group>
                    <b-form-input id="file-upload" placeholder="Upload from computer" readonly @click="uploadLabel.click()" :disabled="showFreesoundResults"></b-form-input>
                    <b-input-group-append>
                        <b-button variant="light" class="px-4" @click="uploadLabel.click()" :disabled="showFreesoundResults">
                            <b-icon icon="upload"></b-icon>
                        </b-button>
                    </b-input-group-append>
                </b-input-group>
                <label id="file-upload-label" class="d-none">
                    <input type="file" accept="audio/*, .m4a" @change="handleSoundUpload">
                </label>
            </div>
        </div>
        <b-alert id="no-fs-results" show dismissible v-show="showNoResultsFoundBanner" @dismissed="showNoResultsFoundBanner = false; searchTerm=''">
            Sorry, no results were found for "{{searchTerm}}" on Freesound. Try something different or upload your own.
        </b-alert>
        <b-alert id="search-failure" show dismissible v-show="showSearchFailureBanner" @dismissed="showSearchFailureBanner = false; searchTerm=''">
            Sorry, Freesound search is currently not available. Try uploading a sound instead.
        </b-alert>
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
            uploadLabel: null,
            showSearchFailureBanner: false,
            showNoResultsFoundBanner: false
        }
    },
    methods: {
        searchFreesound () {
            const isSearchById = /#\d+$/.test(this.searchTerm); // match regex for #<id_number>
            if (isSearchById) {
                freesound.getSound(this.searchTerm.split('#').pop(), this.handleSearchSuccess, this.handleSearchFailure);
                return;
            }

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
            // guard: no files chosen (e.g. upload was cancelled)
            if (event.target.files.length == 0) return;

            // guard: avoid excessively large files
            if (event.target.files[0].size > 5000000) {
                alert("File size limit is 5MB. Please upload a shorter audio file.");
                return;
            }

            let file = null;
            if (event.type == "change") {
                file = event.target.files[0];
            }
            if (event.type == "drop") {
                file = event.dataTransfer.files[0];
            }

            EventBus.$emit("sound-read", {blob: file, url: file.name});
        },
        handleSearchSuccess (sound) {
            // guard: sound collection or single sound?
            if (sound.results == undefined && 'id' in sound) { // deal with it as single sound (id search)
                EventBus.$emit("successful-fs-search", [sound]);
                this.showFreesoundResults = true;
                return;
            }
            // guard: are results empty?
            if (sound.results.length < 1) {
                this.showNoResultsFoundBanner = true;
                return;
            }
            EventBus.$emit("successful-fs-search", sound.results);
            this.showFreesoundResults = true;
        },
        handleSearchFailure (error) {
            this.showFreesoundResults = false;
            this.showSearchFailureBanner = true;
            console.error("Freesound search failed", error);
        }
    },
    created () {
        // set FS API key
        freesound.setToken(apiKey);
        console.info("FS token set");

        EventBus.$on("sound-selected", () => {
            this.showFreesoundResults = false;
            this.searchTerm = "";
        })
    },
    mounted () {
        this.uploadLabel = document.querySelector("#file-upload-label");
    }
}

</script>

<style lang="scss" scoped>
    section {
        width: 90%;
    }
    #file-upload {
        background-color: inherit;
        &[disabled] {
            background-color: #dee2e6dd;
        }
    }
    span {
        text-align: center;
    }
</style>
