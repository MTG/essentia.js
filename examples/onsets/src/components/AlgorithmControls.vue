<template>
    <section class="mx-2 row">
        <div class="range-sliders col-4">
            <exp-slider 
            label="frame-size" min="64" max="8192" expStep="2" :initialValue="frameSize"
            @slider-changed="value => frameSize = value"></exp-slider>
            <linear-slider 
            label="hop-size" min="5" max="100" step="5" :value="hopSizePercentage" unit="%"
            @slider-changed="value => hopSizePercentage = value"></linear-slider>
            <linear-slider 
            label="sensitivity" min="0.1" max="1" step="0.05" :value="sensitivity" unit=""
            @slider-changed="value => sensitivity = value"></linear-slider>
        </div>
        <div class="col-6">
            <label for="odf-ratios">Onset Detection Function (ODF) ratios</label>
            <proportion-slider id="odf-ratios" @slider-changed="data => odfs = data" :tagsData="odfs"></proportion-slider>
        </div>
        <div class="col-2"></div>
    </section>
</template>

<script>
import ExpSlider from "./ExponentialSlider.vue";
import LinearSlider from "./LinearSlider.vue";
import ProportionSlider from "./ProportionSlider.vue";

import EventBus from "../core/event-bus";

const ODFS = ["HFC", "Complex", "Flux", "Complex Phase"];

export default {
    components: { ExpSlider, LinearSlider, ProportionSlider },
    data () {
        return {
            frameSize: 1024,
            hopSizePercentage: 50,
            odfs: {
                names: ODFS,
                values: new Array(ODFS.length).fill(100 / ODFS.length)
            },
            sensitivity: 0.1,
            paramsChanged: false
        }
    },
    computed: {
        params () {
            return {
                frameSize: this.frameSize,
                hopSize: this.hopSizePercentage * this.frameSize * 0.01,
                odfs: this.odfs.names,
                odfsWeights: this.odfs.values,
                sensitivity: this.sensitivity
            }
        }
    },
    watch: {
        params (newVal, oldVal) {
            this.paramsChanged = true;
        }
    },
    methods: {
        handleFormUpdate () {
            console.info("algoparams form was updated");
            // EventBus.$emit("algo-params-updated", this.params);
            // this.paramsChanged = false;
        }
    }
}
</script>

<style scoped>
    section {
        width: 90%;
        font-size: .85rem;
    }
</style>
