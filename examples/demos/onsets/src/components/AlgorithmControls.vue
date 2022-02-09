<template>
    <section class="mx-2">
        <div class="row">
            <div class="range-sliders col-3">
                <exp-slider 
                label="frame-size" min="64" max="8192" expStep="2" :initialValue="frameSize"
                @slider-changed="value => frameSize = value"
                @pointerenter="name => currentlyHovered=name"
                @pointerleave="currentlyHovered='none'"></exp-slider>
                <linear-slider 
                label="hop-size" min="5" max="100" step="5" :value="hopSizePercentage" unit="%"
                @slider-changed="value => hopSizePercentage = value"
                @pointerenter="name => currentlyHovered=name"
                @pointerleave="currentlyHovered='none'"></linear-slider>
                <linear-slider 
                label="sensitivity" min="0.1" max="1" step="0.05" :value="sensitivity" unit=""
                @slider-changed="value => sensitivity = Number(value)"
                @pointerenter="name => currentlyHovered=name"
                @pointerleave="currentlyHovered='none'"></linear-slider>
            </div>
            <div class="col-6">
                <label for="odf-ratios" @pointerenter="currentlyHovered='odf'" 
                @pointerleave="currentlyHovered='none'"><a href="https://en.wikipedia.org/wiki/Onset_(audio)" target="_blank">Onset</a> detection functions</label>
                <proportion-slider id="odf-ratios" @slider-changed="data => odfs = data" :tags="odfs" :tagsOrder="['hfc', 'complex', 'flux', 'complex_phase']"
                @pointerenter="name => currentlyHovered=name"
                @pointerleave="currentlyHovered='none'"></proportion-slider>
            </div>
            <div class="col-3 py-2">
                <b-card id="info-panel" class="h-100 text-secondary" :sub-title="quickHelpTitle">
                    <b-card-text>{{quickHelpText}}</b-card-text>
                </b-card>
            </div>
        </div>
        <div>
            <b-button block variant="primary" @click="handleFormUpdate" v-show="paramsChanged">Update</b-button>
        </div>
    </section>
</template>

<script>
import ExpSlider from "./ExponentialSlider.vue";
import LinearSlider from "./LinearSlider.vue";
import ProportionSlider from "./ProportionSlider.vue";

import EventBus from "../core/event-bus";

const quickhelpContents = {
    "frame-size": "Size of audio chunks for analysis. Controls frequency resolution. Increase this when using the 'Complex' or 'Complex Phase' detection functions and a pitched sound.",
    "hop-size": "Audio analysis frame rate, given as a percentage of the frame size. Lower values result in increased temporal resolution, but longer analysis time.",
    sensitivity: "Regulates the threshold for onset detection. Higher values tend to produce more false positives. Increase it if you know that your chosen audio has onsets but few or none are being displayed.",
    odf: "Four functions are available to use for onset detection. They can be combined and be given different ratios so that some have a greater effect than others on the results. At least one has to be selected.",
    HFC: "This function computes the High Frequency Content (HFC) of a sound's spectrum. Great for detecting percussive events. ",
    Complex: "Reacts to deviations in pitch and changes in the frequency components of the sound. Measures spectral differences of both magnitude and phase between frames.",
    Flux: "Measures how quickly the frequency components of the sound are changing over time. Related to changes in timbre, works well with synthetic or found sound with no clear transients.",
    "Complex Phase": "Similar to 'Complex' but considers only changes in phase, weighted by magnitude. Good for tonal sounds such as bowed string, but tends to over-detect percussive events.",
    none: "Hover over any of the controls for more info."
};
const odfsNames = ['hfc', 'complex', 'flux', 'complex_phase'];

export default {
    components: { ExpSlider, LinearSlider, ProportionSlider },
    props: {
        init: Object
    },
    data () {
        return {
            frameSize: this.init.frameSize,
            hopSizePercentage: this.init.hopSize * 100 / this.init.frameSize,
            odfs: {
                on: {
                    names: this.init.odfs,
                    values: this.init.odfsWeights
                },
                off: {
                    names: odfsNames.filter( odf => !this.init.odfs.includes(odf) )
                }
            },
            sensitivity: this.init.sensitivity,
            paramsChanged: false,
            currentlyHovered: "none"
        }
    },
    computed: {
        params () {
            return {
                frameSize: this.frameSize,
                hopSize: this.hopSizePercentage * this.frameSize * 0.01,
                odfs: this.odfs.on.names,
                odfsWeights: this.odfs.on.values,
                sensitivity: this.sensitivity
            }
        },
        quickHelpText () {
            return quickhelpContents[this.currentlyHovered];
        },
        quickHelpTitle () {
            if (this.currentlyHovered == "none") return "Quick help";
            let formattedName = this.currentlyHovered.split('-').map( (p) => p.charAt(0).toUpperCase() + p.slice(1) ).join(' ');
            if (this.currentlyHovered == "odf") formattedName = "ODF";
            return `Quick help: ${formattedName}`;
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
            EventBus.$emit("algo-params-updated", this.params);
            this.paramsChanged = false;
        }
    }
}
</script>

<style lang="scss" scoped>
    $primary: #E4454A;

    section {
        width: 90%;
        font-size: .85rem;
    }

    #info-panel {
        background-color: #dee2e6dd;
    }

    label[for="odf-ratios"] {
        &:hover {
            color: $primary;
        }
    }

    a {
        color: inherit;
        &:hover {
            color: inherit;
        }
    }
</style>
