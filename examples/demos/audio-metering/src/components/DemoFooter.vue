<template>
    <v-footer class="d-flex justify-space-around">
        <div id="mtg-logo" class="d-flex align-center footer-block">
            <p>Made at</p>
            <a id="mtg-link" href="https://www.upf.edu/web/mtg/" target="_blank">
                <mtg-logo></mtg-logo>
            </a> 
        </div>
        <div id="essentiajs-logo" class="d-flex align-center footer-block">
            <p>Using audio analysis from</p> 
            <a id="essentiajs-link" href="https://mtg.github.io/essentia.js/" target="_blank">
                <essentiajs-logo></essentiajs-logo>
            </a>
        </div>
    </v-footer>
</template>

<script>
import MtgLogo from './MTGLogo.vue';
import EssentiajsLogo from './EssentiajsLogo.vue';
export default {
    components: { MtgLogo, EssentiajsLogo }
}
</script>

<style lang="scss">
    // .footer-block img {
    //     margin-left: 2rem;
    //     border-radius: 5px;
    // }

    // #essentiajs-link {
    //     height: 2.5rem;
    //     margin-left: .5rem;
    // }

    // #mtg-link {
    //     height: 3.5rem;
    // }
</style>