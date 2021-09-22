<template>
  <div id="app">
      <div id="instructions" v-if="!instructionsClosed">
        <!-- using placeholder GIFs -->
        <instructions-modal img-link="https://media.giphy.com/media/eDOsXo70WqUU0/giphy.gif,
                                        https://media.giphy.com/media/AUlBq9xqbWu0E/giphy.gif,
                                        https://media.giphy.com/media/LSpDvtSVoq4yA/giphy.gif"
                            @closed="instructionsClosed=true">
          <template slot="header">Audio slicer fun!</template>
          <template slot="lead">Create weighted combinations of multiple onset detection functions for different audio segmentation results.</template>
          <template slot="dismiss">Got it!</template>
        </instructions-modal>
      </div>
      <main v-if="instructionsClosed" class="d-flex flex-column justify-content-between align-items-center">
        <demos-header></demos-header>
        <browse-display></browse-display>
        <demos-footer></demos-footer>
      </main>
  </div>
</template>

<script>
import EventBus from './core/event-bus';

import InstructionsModal from './components/InstructionsModal.vue';
import DemosFooter from './components/DemosFooter.vue';
import DemosHeader from './components/DemosHeader.vue';
import BrowseDisplay from './components/BrowseDisplayPanel.vue';

export default {
  name: 'app',
  components: { InstructionsModal, DemosFooter, DemosHeader, BrowseDisplay },
  data () {
    return {
      instructionsClosed: false,
      audioUploaded: false
    }
  },
  created () {
    // EventBus.$on()
  }
}
</script>

<style lang="scss">
  main {
    height: 100vh;
    width: 100vw;
  }
</style>
