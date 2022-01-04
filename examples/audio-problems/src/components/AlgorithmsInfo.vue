<template>
  <section>
    <h2>{{ title }}</h2>
    <div id="algos_info" class="algosInfoTable">
        <div class="row" :class="{'highlight': algo.isHighlighted}" v-for="algo in algorithms" :id="algo.name.toLowerCase()" :key="algo.name.toLowerCase()">
          <h3 class="cell" :style="{'background-color':algo.color}"><a :href="algo.href">{{ algo.name }}</a></h3>
          <p class="cell grow">{{ algo.def}}</p>
        </div>
    </div>
  </section>
</template>

<script>
import EventBus from "../core/event-bus";

export default {
  data() {
    return {
      isPlaying: false,
      title: "Algorithms",
      algorithms: {
                    startstopcut: {
                      name: "StartStopCut", 
                      href:"https://essentia.upf.edu/reference/std_StartStopCut.html", 
                      color: "#FEA24CA6", def: "Marks whether there is a cut at the beginning or at the end of the audio", 
                      isHighlighted: false
                    },
                    saturation: {
                      name: "Saturation",
                      href:"https://essentia.upf.edu/reference/std_SaturationDetector.html", 
                      color:  "#FF585880", def: "Shows the regions where there are saturated samples", 
                      isHighlighted: false
                    },
                    startstopsilence: {
                      name: "StartStopSilence",
                      href:"https://essentia.upf.edu/reference/std_StartStopSilence.html", 
                      color: "#FFD645A3", 
                      def: "Shows if there are more than 5 seconds of silence at the beginning or the end of the audio", 
                      isHighlighted: false
                    }
      }
    }
  },
  methods: {
    activateHighlight (algoName) {
      this.algorithms[algoName].isHighlighted = true;
    },
    deactivateHighlight (algoName) {
      this.algorithms[algoName].isHighlighted = false;
    }
  },
  mounted() {
    EventBus.$on('region-mouseenter', (param) => {
      let algoName = param.id.split('-')[0].toLowerCase();
      this.activateHighlight(algoName);
    })
    EventBus.$on('region-mouseleave', (param) => {
      let algoName = param.id.split('-')[0].toLowerCase();
      this.deactivateHighlight(algoName);
    })
    EventBus.$on('marker-clicked', (param) => {
      let algoName = param.label.toLowerCase();
      algoName = (algoName.includes('cut') || algoName.includes('silence')) ? 'startstop'+algoName : algoName;
      this.activateHighlight(algoName);
      setTimeout(() => {
        this.deactivateHighlight(algoName);
      }, 2000);
    })
  },
  name: "AlgorithmsInfo"
}
</script>

<style scoped>
section {
  height: 30vh;
}
.algosInfoTable {
  max-width: 850px;
  color: #2a2929;
}

.algosInfoTable h4,h5,a,p{
  color: #2a2929;
}

.algosInfoTable th {
  padding: 5px;
}

.highlight{
  background-color: #e0dcdc;
}

.highlight a,p{
  color: black;
}

.row.highlight#saturation h5 {
  background-color: rgba(255, 88, 88, 0.8) !important;
}

.row.highlight#startstopcut h5 {
  background-color: rgba(254, 162, 76, 0.88) !important;
}

.row.highlight#startstopsilence h5 {
  background-color: rgba(255, 214, 69, 0.88) !important;
}

.row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  padding: 2px 2px;
  transition: background-color .4s;
}
.row:hover {
   color: black;
}

.cell {
  width: 175px;
  margin: 0px;
  padding: 8px;
}

.cell.grow {
   width: auto;
   flex-grow: 1;
}

</style>