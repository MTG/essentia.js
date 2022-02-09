<template>
    <div class="d-flex flex-column rounded border-0 bg-light mb-4">
        <b-form-radio-group class="row w-100 mx-0"> 
            <div class="col-sm w-100 me-auto" v-for="col, colIdx in soundColumns" :key="colIdx">
                <li v-for="sound, sndIdx in col" :key="sndIdx" class="mx-auto">
                    <freesound-result @selected="handleSelect(sound)" :soundResource="sound"></freesound-result>
                </li>
            </div>
        </b-form-radio-group>
        <div>
            <b-button block class="mt-2" variant="outline-primary" @click="confirmChoice" v-show="selected != -1">Load "{{selectedSoundName}}"</b-button>
        </div>
    </div>
</template>

<script>
import EventBus from '../core/event-bus';
import FreesoundResult from './FreesoundResult.vue';

export default {
    components: {FreesoundResult},
    props: {
        sounds: Array
    },
    data () {
        return {
            selected: -1,
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
        },
        soundData () {
            return Object.fromEntries( this.sounds.map( s => [s.id, s] ));
        },
        selectedSoundName () {
            if (this.selected == -1) return '';
            return this.soundData[this.selected].name;
        }
    },
    methods: {
        freesoundEmbedURL (soundId) {
            return `https://freesound.org/embed/sound/iframe/${soundId}/simple/small/`;
        },
        handleSelect (sound) {
            console.log('select event received from: ', sound.name);
            this.selected = sound.id;
        },
        confirmChoice () {
            const sound = this.soundData[this.selected];
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
            this.selected = -1;
        }
    }
}

</script>

<style lang="scss" scoped>
@import '../assets/styles/globals.scss';

    li {
        list-style: none;
    }

    .select-radio {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
    }
</style>