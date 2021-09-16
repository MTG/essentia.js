<template>
    <section class="mx-2 p-3">
        <div id="audio-search-upload">
            <b-row class="my-3">
                <b-col sm="8">
                    <b-input-group>
                        <b-form-input v-model="searchTerm" placeholder="Search Freesound.org" @input="searchFreesound"></b-form-input>
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
        <audio-display v-show="!showFreesoundResults"></audio-display>
    </section>
</template>

<script>
import AudioDisplay from './AudioDisplay.vue';
import FreesoundResults from './FreesoundResults.vue';
import freesound from 'freesound';

export default {
    components: { AudioDisplay, FreesoundResults },
    data () {
        return {
            showFreesoundResults: false,
            searchTerm: ""
        }
    },
    methods: {
        searchFreesound () {

        }
    },
    created () {
        // set FS API key
        freesound.setToken("")
    }
}
</script>

<style lang="scss" scoped>
    section {
        width: 80%;
    }
</style>
