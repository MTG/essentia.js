<template>
    <div>
        <b-modal v-model="showModal" footer-class="d-flex justify-content-center" class="w-100" title="Instructions" @close="closeModal" @hide="closeModal">
            <div class="d-block text-center">
                <h1>
                    <slot name="header"></slot>
                </h1>  
                <p class="my-4">
                    <slot name="lead"></slot>
                </p>
            </div>

            <div id="instructions-carousel" class="p-3">
                <b-carousel
                    fade
                    :interval="interval"
                    controls
                    indicators
                    background="#ababab"
                    label-next=""
                    label-prev=""
                    img-height="300"
                    ref="instructionsCarousel"
                >
                    <b-carousel-slide v-for="(link, index) in this.imgLink"
                    :key="index"
                    :img-src="link"
                    :caption="`${index+=1}.`"
                    ></b-carousel-slide>
                </b-carousel>
            </div>

            <template slot="modal-footer">
                <div class="d-block text-center">
                    <b-button variant="primary" href="#" @click="closeModal">
                        <slot name="dismiss"></slot>
                    </b-button>
                </div>
            </template>

        </b-modal>
    </div>
</template>

<script>

export default {
    props: ['img-link'],
    data () {
        return {
            showModal: true,
            interval: 0
        };
    },
    methods: {
        closeModal () {
            this.showModal = false;
            this.$emit('closed');
        }   
    }
}

</script>
