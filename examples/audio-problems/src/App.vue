<template>
  <div id="app">
      <main class="d-flex flex-column justify-content-between align-items-center">
        <demos-header></demos-header>
        <section id="middle-screen" class="d-flex flex-column justify-content-around align-items-center container-fluid">
          <browse-display></browse-display>

        </section>
        <demos-footer></demos-footer>
      </main>
  </div>
</template>

<script>
import EventBus from './core/event-bus';

import DemosFooter from './components/DemosFooter.vue';
import DemosHeader from './components/DemosHeader.vue';
import BrowseDisplay from './components/BrowseDisplayPanel.vue';
import AlgorithmControls from './components/AlgorithmControls.vue';


export default {
  name: 'app',
  components: { DemosFooter, DemosHeader, BrowseDisplay, AlgorithmControls },
  data () {
    return {
      audioUploaded: false,
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
