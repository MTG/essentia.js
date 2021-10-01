<template>
    <!-- <svg viewBox="94.582 151.141 252.492 74.56" xmlns="http://www.w3.org/2000/svg">
        <path d="M 94.564 190.693 C 102.99 184.777 106.224 172.072 115.73 167.234 C 120.269 164.924 124.481 179.043 127.823 180.713 C 132.157 182.881 134.252 173.832 135.385 174.399 C 137.548 175.481 138.31 182.385 141.167 181.665 C 143.68 181.031 147.529 179.686 149.085 177.847 C 153.472 172.661 158.654 166.507 162.796 160.968 C 164.315 158.936 168.976 152.4 172.15 153.452 C 174.593 154.261 175.901 158.524 177.448 160.347 C 182.509 166.312 187.298 180.131 194.32 183.642 C 204.163 188.564 208.27 166.926 215.487 165.105 C 217.394 164.624 218.997 168.74 219.771 169.84 C 222.019 173.035 226.077 180.711 229.965 181.999 C 231.179 182.402 234.422 179.19 235.278 178.618 C 238.829 176.246 245.319 171.43 249.882 172.183 C 255.345 173.085 259.926 187.283 264.346 186.168 C 266.861 185.534 269.494 179.183 270.829 177.176 C 275.452 170.228 283.195 153.771 291.067 157.61 C 302.439 163.157 298.318 168.613 309.113 177.751 C 319.862 186.85 344.32 185.601 346.442 188.791" style="fill: rgb(230, 230, 230); stroke: rgb(0, 0, 0); stroke-width: 0px;" transform="matrix(0.999848, 0.017452, -0.017452, 0.999848, 3.360364, -3.82422)"/>
        <path d="M 94.904 188.266 C 103.33 194.182 106.564 206.969 116.07 211.807 C 120.609 214.117 124.821 199.998 128.163 198.328 C 132.497 196.16 134.592 205.209 135.725 204.642 C 137.888 203.56 138.65 196.656 141.507 197.376 C 144.02 198.01 147.869 199.355 149.425 201.194 C 153.812 206.38 158.994 212.534 163.136 218.073 C 164.655 220.105 169.316 226.641 172.49 225.589 C 174.933 224.78 176.241 220.517 177.788 218.694 C 182.849 212.729 187.638 198.91 194.66 195.399 C 204.503 190.477 208.61 212.115 215.827 213.936 C 217.734 214.417 219.337 210.301 220.111 209.201 C 222.359 206.006 226.417 198.33 230.305 197.042 C 231.519 196.639 234.762 199.851 235.618 200.423 C 239.169 202.795 245.659 207.611 250.222 206.858 C 255.685 205.956 260.266 191.758 264.686 192.873 C 267.201 193.507 269.834 199.858 271.169 201.865 C 275.792 208.813 283.535 225.27 291.407 221.431 C 302.779 215.884 298.658 210.428 309.453 201.29 C 320.202 192.191 344.579 193.768 346.701 190.578" style="fill: rgb(230, 230, 230); stroke: rgb(0, 0, 0); stroke-width: 0px;" transform="matrix(1.000001, 0, 0, 1.000001, -0.285557, -0.002297)"/>
    </svg> -->
    <div class="slider-container">
        <div class="d-flex justify-content-between w-100">
            <label :for="label" id="slider-label" class="slider-text">
                {{ formattedLabel }}
            </label>
            <span id="slider-value" class="slider-text" v-show="isClicked">{{ sliderValue }}{{ unit }}</span>
        </div>
        <input type="range" class="form-range" :id="label" :min="min" :max="max" :step="step" v-model="sliderValue"
            @mousedown="isClicked=true" @mouseup="isClicked=false" @input="handleInput">
    </div>
</template>

<script>

export default {
    props: ["label", "min", "max", "step", "unit", "value"],
    data () {
        return {
            sliderValue: this.value,
            isClicked: false
        }
    },
    computed: {
        formattedLabel: function () {
            let parts = this.label.split("-");
            let capitalizedParts = parts.map( (p) => p.charAt(0).toUpperCase() + p.slice(1) );
            return capitalizedParts.join(" ");
        }
    },
    methods: {
        handleInput (event) {
            this.$emit("slider-changed", this.sliderValue);
        }
    }
}
</script>

<style lang="scss">
    // variable overrides
    $primary: #E4454A;

    @import "node_modules/bootstrap5/scss/_functions.scss";
    @import "node_modules/bootstrap5/scss/_variables.scss";
    @import "node_modules/bootstrap5/scss/mixins/_gradients.scss";
    @import "node_modules/bootstrap5/scss/mixins/_border-radius.scss";
    @import "node_modules/bootstrap5/scss/mixins/_box-shadow.scss";
    @import "node_modules/bootstrap5/scss/mixins/_transition.scss";
    @import "node_modules/bootstrap5/scss/forms/_form-range.scss";

    .slider-container {
        margin-bottom: .6rem;

        &:hover {
            color: $primary;
        }
    }

    label#slider-label {
        font-size: inherit;
        margin: 0;
    }

    .slider-text {
        display: block;
    }

</style>
