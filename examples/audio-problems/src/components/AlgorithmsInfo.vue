<template>
  <section class="mb-2 mt-4">
    <div id="audio-display-wrap">
      <h3>{{ title }}</h3>
      <div id="algos_info" class="algosInfoTable">
          <div class="row" v-for="algo in algorithms" :id="algo.name.toLowerCase()">
            <h5 class="cell" :style="{'background-color':algo.color}"><a :href="algo.href">{{ algo.name }}</a></h5>
            <p class="cell grow">{{ algo.def}}</p>
          </div>
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
      algorithms: [{name: "StartStopCut", href:"https://essentia.upf.edu/reference/std_StartStopCut.html", color: "#FEA24CA6", def: "Marks whether there is a cut at the beginning or at the end of the audio"},
                  {name: "Saturation",href:"https://essentia.upf.edu/reference/std_SaturationDetector.html" , color:  "#FF585880", def: "Shows the regions where there are saturated samples"},
                  {name: "StartStopSilence",href:"https://essentia.upf.edu/reference/std_StartStopSilence.html" , color: "#FFD645A3", def: "Shows if there are more than 5 seconds of silence at the beginning or the end of the audio"}]
    }
  },
  methods: {
    highlightFromRegion(obj, ev){
      let algoName = obj.id.split('-')[0]
      let elementTr = document.querySelector('.algosInfoTable'+ ' #'+algoName.toLowerCase());

      if(ev.type === "mouseenter" && !elementTr.classList.contains("highlight")){
        elementTr.classList.add("highlight");
      }
      if(ev.type === "mouseleave" && elementTr.classList.contains("highlight")){
        elementTr.classList.remove("highlight");
      }
    },
    highlightFromMarker(obj, ev){
      let algoName = obj.label.toLowerCase();
      algoName = (algoName === "cut") ? "startstopcut" : algoName;
      algoName = (algoName === "silence") ? "startstopsilence" : algoName;
      let elementTr = document.querySelector('.algosInfoTable'+ ' #'+algoName.toLowerCase());
      if(ev.type === "click" && !elementTr.classList.contains("highlight")){
        elementTr.classList.add("highlight");
        setTimeout(function (){
          elementTr.classList.remove("highlight");
        }, 2000);
      }
    }
  },
  watch: {
  },
  computed: {},
  mounted() {
    EventBus.$on('region-mouseenter', (param, ev) => {
      this.highlightFromRegion(param, ev);
    })
    EventBus.$on('region-mouseleave', (param, ev) => {
      this.highlightFromRegion(param, ev);
    })
    EventBus.$on('marker-clicked', (param, ev) => {
      this.highlightFromMarker(param, ev);
    })
  },
  name: "AlgorithmsInfo"
}
</script>

<style scoped>

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