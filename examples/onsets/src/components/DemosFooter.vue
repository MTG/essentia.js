<template>
    <footer>
      <div id="mtg-logo" class="footer-block">
          <p>Made at</p>
          <a href="https://www.upf.edu/web/mtg/" target="_blank"><img src="src/assets/mtg-logo.png" alt="Music Technology Group logo"></a> 
      </div>
      <div id="essentiajs-logo" class="footer-block">
          <p>Using audio analysis from</p> 
          <a href="https://mtg.github.io/essentia.js/" target="_blank"><img src="src/assets/essentia.js-logo.png" alt="Javascript audio analysis library Essentia.js"></a>
      </div>
    </footer>
</template>

<script>
export default {

}
</script>

<style lang="scss">
    @import '../assets/styles/globals.scss';

    footer {
        width: 100%;

        display: flex;
        justify-content: space-evenly;
        align-content: center;
        padding-top: 1rem;

        color: #ffffff;
        font-weight: 300;
        font-size: 1rem;
        background-color: $main-bg;

        position: absolute;
        bottom: 0vh;
    }

    .footer-block {
        display: flex;

        text-align: center;
        align-content: center;
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
        /* height: 2.5rem; */
        border-radius: 5px;
    }

    .footer-block img:hover {
        /* border: solid 1px white; */
        box-shadow: 0 0 0 1px white;
    }

    [alt="Javascript audio analysis library Essentia.js"] {
        height: 2.5rem;
    }

    [alt="Music Technology Group logo"] {
        height: 3.5rem;
    }
</style>