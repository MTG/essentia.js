<template>
    <div 
    class="tag" 
    :style="{ ...styles.tag, background: color,  width: width + '%' }">
        <span 
        :style="{ ...styles.tagText }"
        v-show="!isClicked">{{ name }}</span>
        <span 
        :style="{ ...styles.tagText, fontSize: 12 }"
        v-show="isClicked"> {{ width }} % </span>
        <div class="slider-button" :style="{ ...styles.sliderButton }" 
        @pointerdown="handlePointerDown"
        @pointerup="isClicked=false">
            <b-icon icon="chevron-compact-left"></b-icon>
            <b-icon icon="chevron-compact-right"></b-icon>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        color: String,
        width: Number,
        name: String
    },
    data () {
        return {
            styles: {
                tag: {
                    padding: 20,
                    textAlign: "center",
                    position: "relative",
                    borderRightWidth: ".1em",
                    borderRightStyle: "solid",
                    borderRightColor: "white",
                    boxSizing: "border-box",
                    borderLeftWidth: ".1em",
                    borderLeftStyle: "solid",
                    borderLeftColor: "white",
                    // height: "100%"
                    // my own addition to center tagText labels
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center"
                },
                tagText: {
                    color: "black",
                    fontWeight: 500,
                    userSelect: "none",
                    display: "block",
                    overflow: "hidden",
                    fontFamily: "sans-serif"
                },
                sliderButton: {
                    width: "2em",
                    height: "2em",
                    backgroundColor: "white",
                    position: "absolute",
                    borderRadius: "2em",
                    right: "calc(-1.1em)",
                    top: 0,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    bottom: 0,
                    margin: "auto",
                    zIndex: 10,
                    cursor: "ew-resize",
                    userSelect: "none"
                }
            },
            isClicked: false
        }
    },
    methods: {
        handlePointerDown (ev) {
            this.$emit('slider-select', ev);
            this.isClicked = true;
        }
    }
}
</script>

<style scoped>
    .tag:first-of-type {
    border-radius: 50px 0px 0px 50px;
    }
    .tag:last-of-type {
    border-radius: 0px 50px 50px 0px;
    }
    .tag:last-of-type>.slider-button {
    display:none !important;
    }
</style>
