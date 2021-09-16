<template>
    <section class="mx-2 p-3">
        <div id="audio-search-upload">
            <b-row class="my-3">
                <b-col sm="8">
                    <b-input-group>
                        <b-form-input v-model="searchTerm" placeholder="Search Freesound.org" @change="searchFreesound"></b-form-input>
                        <b-input-group-append>
                            <b-button variant="light" class="px-4">
                                <b-icon icon="search"></b-icon>
                            </b-button>
                        </b-input-group-append>
                    </b-input-group>
                </b-col>
                <b-col sm="4">
                    <b-button variant="light" >
                        <b-icon icon="upload"></b-icon>
                        <span class="ml-2">
                            Open file
                        </span>
                    </b-button>
                </b-col>
            </b-row>
        </div>
        <audio-display v-show="!showFreesoundResults" :file="audioURL"></audio-display>
    </section>
</template>

<script>
import AudioDisplay from './AudioDisplay.vue';
import FreesoundResults from './FreesoundResults.vue';
import freesound from 'freesound';

import audioURL from '../assets/acoustic-drums.wav';

export default {
    components: { AudioDisplay, FreesoundResults },
    data () {
        return {
            showFreesoundResults: false,
            searchTerm: "",
            audioURL: audioURL
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
        handleSearchSuccess (sounds) {
            console.log("Retrieved the following from FS: ", sounds);
            this.showFreesoundResults = true;
        },
        handleSearchFailure (error) {
            console.error("Freesound search failed", error);
        }
    },
    created () {
        // set FS API key
        console.info("FS token set");
    }
}

</script>

<style lang="scss" scoped>
    section {
        width: 80%;
    }
</style>
