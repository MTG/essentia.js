<template>
  <div id="app">
      <div id="instructions" v-if="!instructionsClosed">
        <!-- using placeholder GIFs -->
        <instructions-modal :img-link="instructionsGifs"
                            @closed="instructionsClosed=true">
          <template slot="header">Audio slicer fun!</template>
          <template slot="lead">Create weighted combinations of multiple onset detection functions for different audio segmentation results.</template>
          <template slot="dismiss">Got it!</template>
        </instructions-modal>
      </div>
      <main v-if="instructionsClosed" class="d-flex flex-column justify-content-between align-items-center">
        <demos-header></demos-header>
        <section id="middle-screen" class="d-flex flex-column justify-content-around align-items-center container-fluid">
          <browse-display></browse-display>
          <algorithm-controls></algorithm-controls>
        </section>
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
import AlgorithmControls from './components/AlgorithmControls.vue';

import gif1 from './assets/onset-instructions-1.gif';
import gif2 from './assets/onset-instructions-2.gif';
import gif3 from './assets/onset-instructions-3.gif';
import gif4 from './assets/onset-instructions-4.gif';

export default {
  name: 'app',
  components: { InstructionsModal, DemosFooter, DemosHeader, BrowseDisplay, AlgorithmControls },
  data () {
    return {
      instructionsClosed: false,
      audioUploaded: false,
      instructionsGifs: [gif1, gif2, gif3, gif4]
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
  #middle-screen {
    flex-grow: 1;
  }

  // #algo-controls {
  //   height: 200px;
  // }
</style>
