<template>
    <div 
    class="tag tag-borders" 
    :style="{ ...styles.tag, background: tagColor, width: width + '%' }">
        <span 
        :style="{ ...styles.tagText }"
        v-show="!showPercentage"
        :class="[{ hoveredTag: isHovered }, 'tag-text']"
        @pointerover="handleHoverIn" @pointerleave="handleHoverOut"
        @pointerdown="handleTagClicked">{{ name }}</span>
        <span 
        :style="{ ...styles.tagText, fontSize: 12 }"
        v-show="showPercentage"> {{ width }} % </span>
        <div class="slider-button" :style="{ ...styles.sliderButton }" 
        @pointerdown="handlePointerDown" @pointerup="handlePointerUp">
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
        name: String,
        showPercentage: Boolean
    },
    data () {
        return {
            tagColor: this.color,
            styles: {
                tag: {
                    padding: "auto 1rem",
                    textAlign: "center",
                    position: "relative",
                    borderRightWidth: ".1em",
                    borderRightStyle: "solid",
                    boxSizing: "border-box",
                    borderLeftWidth: ".1em",
                    borderLeftStyle: "solid",
                    // my own addition to center tagText labels
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center"
                },
                tagText: {
                    fontWeight: 500,
                    userSelect: "none",
                    display: "block",
                    overflow: "hidden",
                    fontFamily: "sans-serif",
                    flex: "1 1 100%"
                },
                sliderButton: {
                    width: "2em",
                    height: "2em",
                    backgroundColor: "#E4454A",
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
            isClicked: false,
            isHovered: false
        }
    },
    methods: {
        handleTagClicked (ev) {
            this.$emit('tag-clicked', this.name)
        },
        handlePointerDown (ev) {
            this.$emit('slider-select-on', ev);
        },
        handlePointerUp (ev) {
            this.$emit('slider-select-off')
        },
        handleHoverIn (ev) {
            this.tagColor = '#e8abad';
            this.isHovered = true;
        },
        handleHoverOut (ev) {
            this.tagColor = this.color;
            this.isHovered = false;
        }
    }
}
</script>

<style lang="scss" scoped>
    .tag-borders {
        border-left-color: #E4454A;
        border-right-color: #E4454A;
    }

    .tag:first-of-type {
        border-radius: 50px 0px 0px 50px;
        border-left-color: transparent;
    }
    .tag:last-of-type {
        border-radius: 0px 50px 50px 0px;
        border-right-color: transparent;
    }
    .tag:last-of-type>.slider-button {
        display:none !important;
    }

    .tag-text {
        color: #323232;
    }

    .hoveredTag {
        cursor: pointer;
        color: #631E20;
        text-decoration: line-through 20%;
    }

    .slider-button {
        color: #fff;
        &:hover {
            color: #631E20;
        }
    }
</style>
