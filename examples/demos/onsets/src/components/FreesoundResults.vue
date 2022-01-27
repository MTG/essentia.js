<template>
    <b-form-radio-group v-model="selected" class="row rounded border-0 bg-light py-1 w-100 mx-0"> 
        <div class="col-sm px-0 w-100" v-for="col, colIdx in soundColumns" :key="colIdx">
            <li v-for="sound, sndIdx in col" :key="sndIdx" class="mx-auto">
                <iframe frameborder="0" scrolling="no" :src="freesoundEmbedURL(sound.id)" width="375" height="25"></iframe>
                <b-form-radio class="select-radio" @change="handleSelect(sound)"></b-form-radio>
            </li>
        </div>
    </b-form-radio-group>
</template>

<script>
import EventBus from '../core/event-bus';

export default {
    data () {
        return {
            sounds: [],
            selected: "",
            cols: 2
        }
    },
    computed: {
        soundColumns () {
            let columns = [];
            let mid = Math.ceil(this.sounds.length / this.cols);
            for (let col = 0; col < this.cols; col++) {
                columns.push(this.sounds.slice(col * mid, col * mid + mid));
            }
            return columns;
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
            EventBus.$emit("sound-selected", 
                {
                    name: sound.name, 
                    id: sound.id, 
                    user: sound.username, 
                    url: selectedAudioURL, 
                    fsLink: sound.url,
                    license: sound.license
                }
            );
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

    .select-radio {
        display: inline;
    }
</style>