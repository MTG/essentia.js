<template>
    <b-form-radio-group v-model="selected" class="list-container flex-column flex-wrap justify-content-center rounded border-0 bg-light py-1"> 
        <li v-for="sound, idx in sounds" :key="idx" class="mx-auto">
            <iframe frameborder="0" scrolling="no" :src="freesoundEmbedURL(sound.id)" width="375" height="25"></iframe>
            <b-form-radio class="select-radio" @change="handleSelect(sound)"></b-form-radio>
        </li>
    </b-form-radio-group>
</template>

<script>
import EventBus from '../core/event-bus';

export default {
    data () {
        return {
            sounds: null,
            selected: ""
        }
    },
    methods: {
        freesoundEmbedURL (soundId) {
            return `https://freesound.org/embed/sound/iframe/${soundId}/simple/small/`;
        },
        populateList (sounds) {
            this.sounds = sounds;
        },
        handleSelect (sound) {
            let selectedAudioURL = sound.previews["preview-hq-mp3"];
            EventBus.$emit("sound-selected", selectedAudioURL);
            this.selected = "";
        }
    },
    created () {
        EventBus.$on("successful-fs-search", this.populateList);
    }
}

</script>

<style scoped>
    li {
        list-style: none;
    }

    .list-container {
        max-height: 45%;
    }

    .select-radio {
        display: inline;
    }
</style>