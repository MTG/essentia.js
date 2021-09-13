<template>
    <section class="mx-2 p-3">
        <audio-browse></audio-browse>
        <audio-display v-show="!showFreesoundResults"></audio-display>
    </section>
</template>

<script>
import AudioBrowse from './Browse.vue';
import AudioDisplay from './Display.vue';
import FreesoundResults from './FreesoundResults.vue';

export default {
    components: { AudioBrowse, AudioDisplay, FreesoundResults },
    data () {
        return {
            showFreesoundResults: false
        }
    }
}
</script>

<style lang="scss" scoped>
    section {
        width: 80%;
    }
</style>