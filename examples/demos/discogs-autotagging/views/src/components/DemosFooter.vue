<template>
    <footer id="footer-wrapper" class="d-flex justify-content-around text-muted font-weight-light container-fluid">
        <div id="mtg-logo" class="d-flex align-items-center footer-block">
            <a id="mtg-link" href="https://www.upf.edu/web/mtg/" target="_blank">
                <mtg-logo></mtg-logo>
            </a> 
        </div>
        <div id="essentiajs-logo" class="d-flex align-items-center footer-block">
            <a id="essentiajs-link" href="https://mtg.github.io/essentia.js/" target="_blank">
                <essentiajs-logo></essentiajs-logo>
            </a>
        </div>
        <div id="essentia-models" class="d-flex flex-column justify-content-center align-items-center footer-block" 
            @mouseover="essentiaModelsHovered = true" @mouseleave="essentiaModelsHovered = false">
            <p>Made with</p> 
            <a href="https://essentia.upf.edu/models.html#discogs-effnet" target="_blank">
                <essentia-logo :isHovered="essentiaModelsHovered"></essentia-logo>
            </a>
            <p :style="essentiaModelsHovered ? {fontWeight: 'bold', color: '#afafaf'} : {}">Models</p>
        </div>
    </footer>
</template>

<script>
import MtgLogo from './MTGLogo.vue';
import EssentiajsLogo from './EssentiajsLogo.vue';
import EssentiaLogo from './EssentiaLogo.vue';
export default {
    components: { MtgLogo, EssentiajsLogo, EssentiaLogo },
    data () {
        return {
            essentiaModelsHovered: false
        }
    }
}
</script>

<style lang="scss" scoped>
    @import '../assets/styles/globals.scss';

    #footer-wrapper {
        position: absolute;
        bottom: 0vh;
        background-color: $dark;
        z-index: 10;
    }

    .footer-block {
        margin-bottom: 0.5rem;
    }

    .footer-block p {
        margin: auto!important;
    }

    .footer-block a {
        margin: auto 0;
    }

    .footer-block img {
        margin-left: 2rem;
        border-radius: 5px;
    }

    #essentiajs-link {
        height: 2.5rem;
        margin-left: .5rem;
    }

    #mtg-link {
        height: 3.5rem;
    }

    #essentia-models {
        margin-top: .5rem;
        &:hover {
            cursor: pointer;
        }
    }
</style>