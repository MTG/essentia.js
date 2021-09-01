<template>
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
</template>

<script>
import InstructionsModal from './components/InstructionsModal.vue';

export default {
  name: 'app',
  components: { InstructionsModal },
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
