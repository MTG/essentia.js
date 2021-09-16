<template>
    <b-list-group>
        <li v-for="sound, idx in sounds" :key="idx">
            <iframe frameborder="0" scrolling="no" :src="freesoundEmbedURL(sound.id)" width="375" height="25"></iframe>
        </li>
    </b-list-group>
</template>

<script>
import EventBus from '../core/event-bus';

export default {
    data () {
        return {
            sounds: null
        }
    },
    methods: {
        freesoundEmbedURL (soundId) {
            return `https://freesound.org/embed/sound/iframe/${soundId}/simple/small/`;
        },
        populateList (sounds) {
            this.sounds = sounds;
        }
    },
    created () {
        EventBus.$on("successful-fs-search", this.populateList);
    }
}

</script>
