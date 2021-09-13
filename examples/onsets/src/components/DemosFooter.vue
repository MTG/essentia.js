<template>
    <footer id="footer-wrapper" class="d-flex justify-content-around text-muted font-weight-light container-fluid bg-light">
        <div id="mtg-logo" class="d-flex align-items-center footer-block">
            <p>Made at</p>
            <a id="mtg-link" href="https://www.upf.edu/web/mtg/" target="_blank">
                <mtg-logo></mtg-logo>
            </a> 
        </div>
        <div id="essentiajs-logo" class="d-flex align-items-center footer-block">
            <p>Using audio analysis from</p> 
            <a id="essentiajs-link" href="https://mtg.github.io/essentia.js/" target="_blank">
                <essentiajs-logo></essentiajs-logo>
            </a>
        </div>
    </footer>
</template>

<script>
import MtgLogo from './MTGLogo.vue';
import EssentiajsLogo from './EssentiajsLogo.vue';
export default {
    components: { MtgLogo, EssentiajsLogo }
}
</script>

<style lang="scss">
    @import '../assets/styles/globals.scss';

    #footer-wrapper {
        position: absolute;
        bottom: 0vh;
    }

    .footer-block {
        display: flex;

        // text-align: center;
        // align-content: center;
        // margin-bottom: 0.5rem;
    }

    .footer-block p {
        margin: auto!important;
    }

    .footer-block a {
        margin: auto 0;
    }

    .footer-block img {
        margin-left: 2rem;
        /* height: 2.5rem; */
        border-radius: 5px;
    }

    // .footer-block img:hover {
    //     /* border: solid 1px white; */
    //     box-shadow: 0 0 3px 1px white;
    // }

    #essentiajs-link {
        height: 2.5rem;
    }

    #mtg-link {
        height: 3.5rem;
    }
</style>