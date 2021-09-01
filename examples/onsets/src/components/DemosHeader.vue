<template>
    <header class="container-fluid center-block text-center">
        <h1>Audio slicer fun!</h1>
        <p>Create weighted combinations of multiple onset detection functions for different segmentation results.</p>
    </header>
</template>

<script>
export default {
    
}
</script>

<style lang="scss">
    @import '../assets/styles/globals.scss';
    header, h1 {
        margin: 0;
    }

    header {
        background-color: $main-bg;
        padding: 1rem 0;
        text-align: center;
    }

    h1 {
        color: #fff;
        font-weight: 500;
        font-size: 1.7rem;
    }

    p {
        color: #f7f7f7;
    }
</style>