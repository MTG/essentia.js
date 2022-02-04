<template>
  <div id="app">
      <div id="instructions" v-show="!instructionsClosed">
        <!-- using placeholder GIFs -->
        <instructions-modal :img-link="instructionsGifs"
                            @closed="instructionsClosed=true">
          <template slot="header">Audio slicer fun!</template>
          <template slot="lead">Create weighted combinations of multiple onset detection functions for different audio segmentation results.</template>
          <template slot="dismiss">Got it!</template>
        </instructions-modal>
      </div>
      <main v-show="instructionsClosed" class="d-flex flex-column justify-content-between align-items-center">
        <demos-header></demos-header>
        <section id="middle-screen" class="d-flex flex-column justify-content-around align-items-center container-fluid">
          <browse-display></browse-display>
          <algorithm-controls :init="algorithmParameters"></algorithm-controls>
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

import audioURL from './assets/acoustic-drums.wav';
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
      instructionsGifs: [gif1, gif2, gif3, gif4],
      url: new URL(window.location),
      algorithmParameters: {}
    }
  },
  created () {
    EventBus.$on('sound-selected', sound => {
      if (sound.id !== '') {
        this.url.searchParams.set('id', sound.id);
        window.history.pushState({}, '', this.url);
      }
    })

    EventBus.$on('algo-params-updated', params => {
      let searchParams = new URLSearchParams(params);
      for (let p of searchParams) {
        this.url.searchParams.set(p[0], p[1]);
      }
      window.history.pushState({}, '', this.url);
    })

    this.initAlgoParams();
  },
  mounted () {
    function loadSound () {
      // initialize sound
      if (this.url.searchParams.has('id')) {
        // grab from URL params (Freesound-hosted)
        console.log("grab from URL params (Freesound-hosted)")
        const id = this.url.searchParams.get('id');
        EventBus.$emit('sound-selected', {name: '', url: '', id: id, user: '', fsLink: '', license: ''});
      } else {
        // load self-hosted file
        console.log("load self-hosted file")
        EventBus.$emit("sound-selected", {name: 'acoustic-drums', url: audioURL, id: '', user: '', fsLink: '', license: ''});
      }
    }
    this.$nextTick(loadSound);
  },
  methods: {
    initAlgoParams () {
      let algoParams = {
        frameSize: 1024,
        hopSize: 512,
        odfs: ["hfc","complex"],
        odfsWeights: [0.5,0.5],
        sensitivity: 0.65
      };

      if (this.url.searchParams.has('frameSize')) {
        for (let p of this.url.searchParams) {
          if (p[0] === 'id') continue;
          let paramVal = p[1].split(',').map( v => p[0] === 'odfs' ? v : Number(v))
          if (p[0] === 'odfs' || p[0] === 'odfsWeights') {
            algoParams[p[0]] = paramVal;
            continue;
          }
          algoParams[p[0]] = paramVal[0];
        }
        console.info('found algo params in URL!', algoParams);
      }

      this.algorithmParameters = algoParams;
      EventBus.$emit('algo-params-init', algoParams);
    }
  }
}
</script>

<style lang="scss">
  main {
    height: 100vh;
    width: 100vw;
    overflow: scroll;
  }
  #middle-screen {
    flex-grow: 1;
  }
</style>
