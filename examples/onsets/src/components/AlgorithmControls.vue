<template>
    <section class="mx-2 row">
        <div class="range-sliders col-4">
            <exp-slider label="frame-size" min="64" max="8192" expStep="2" initialValue="8192"></exp-slider>
            <linear-slider label="hop-size" min="5" max="100" step="5" initialValue="50" unit="%"></linear-slider>
            <linear-slider label="sensitivity" min="0.1" max="1" step="0.05" initialValue="0.3" unit=""></linear-slider>
        </div>
        <div class="col-6">
            <proportion-slider></proportion-slider>
        </div>
        <div class="col-2"></div>
    </section>
</template>

<script>
import ExpSlider from "./ExponentialSlider.vue";
import LinearSlider from "./LinearSlider.vue";
import ProportionSlider from "./ProportionSlider.vue";

export default {
    components: { ExpSlider, LinearSlider, ProportionSlider },
}
</script>

<style scoped>
    section {
        width: 90%;
        font-size: .85rem;
    }
</style>
