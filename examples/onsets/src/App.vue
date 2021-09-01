<template>
  <div id="app">
      <demos-header v-if="instructionsClosed"></demos-header>
      <main>
        <!-- using placeholder GIFs -->
        <instructions-modal img-link="https://media.giphy.com/media/eDOsXo70WqUU0/giphy.gif,
                                        https://media.giphy.com/media/AUlBq9xqbWu0E/giphy.gif,
                                        https://media.giphy.com/media/LSpDvtSVoq4yA/giphy.gif"
                            @closed="instructionsClosed=true">
          <template slot="header">Audio slicer fun!</template>
          <template slot="lead">Create weighted combinations of multiple onset detection functions for different audio segmentation results.</template>
          <template slot="dismiss">Got it!</template>
        </instructions-modal>
      </main>
      <demos-footer v-if="instructionsClosed"></demos-footer>
  </div>
</template>

<script>
import InstructionsModal from './components/InstructionsModal.vue';
import DemosFooter from './components/DemosFooter.vue';
import DemosHeader from './components/DemosHeader.vue';

export default {
  name: 'app',
  components: { InstructionsModal, DemosFooter, DemosHeader },
  data () {
    return {
      instructionsClosed: false 
    }
  }
}
</script>

<style lang="scss">
  main {
    height: 100vh;
  }
</style>
