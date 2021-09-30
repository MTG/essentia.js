<template>
    <div style="height: 100%;">
        <div style="width: 100%; display: flex; background-color: transparent; height: 100%;" ref="TagSliderRef">
            <tag-section 
            v-for="(tag, index) in tags" :key="index" 
            :name="tag.name" 
            :color="tag.color" 
            :width="widths[index]"
            @slider-select="onSliderSelect($event, index)">
            </tag-section>
        </div>
    </div>
</template>

<script>
const TAGS = [
                {
                    name: "HFC",
                    color: "#e8e8e8"
                },
                {
                    name: "Complex",
                    color: "#e8e8e8"
                },
                {
                    name: "Flux",
                    color: "#e8e8e8"
                },
                {
                    name: "Complex Phase",
                    color: "#e8e8e8"
                }
            ];

import TagSection from "./ProportionTag.vue";
import { ref, onMounted } from "@vue/composition-api";
import { getPercentage, limitNumberWithinRange, nearestN } from "./utils.js";

export default {
    components: { TagSection },
    setup () {
        return {
            TagSliderRef: ref(null)
        }
    },
    data () {
        return {
            tags: TAGS,
            widths: new Array(TAGS.length).fill(100 / TAGS.length),
            percentageMovedOld: 0,
        };
    },
    methods: {
        onSliderSelect (selectEvent, index) {
            // console.log("onSliderSelect: ", index);
            selectEvent.preventDefault();
            document.body.style.cursor = "ew-resize";

            const startDragX = selectEvent.pageX;
            // console.log({startDragX});
            const sliderWidth = this.$refs.TagSliderRef.offsetWidth;

            const resize = (resizeEvent) => {
                const _widths = this.widths.slice();
                // console.log("resize: ", e.target);
                resizeEvent.preventDefault();
                const endDragX = resizeEvent.touches ? resizeEvent.touches[0].pageX : resizeEvent.pageX;
                const distanceMoved = endDragX - startDragX;
                const maxPercent = _widths[index] + _widths[index + 1];
                const percentageMoved = nearestN(1, getPercentage(sliderWidth, distanceMoved))
                // const percentageMoved = getPercentage(sliderWidth, distanceMoved);

                // console.log({percentageMoved: percentageMoved});

                if (percentageMoved !== this.percentageMovedOld) {
                    const percentageDiff = percentageMoved - this.percentageMovedOld;
                    const prevPercentage = _widths[index];
                
                    const newPercentage = prevPercentage + percentageDiff;

                    const currentSectionWidth = limitNumberWithinRange(
                        newPercentage,
                        0,
                        maxPercent
                    );
                    // console.log({currentSectionWidth});
                    _widths[index] = currentSectionWidth;

                    const nextSectionIndex = index + 1;

                    const nextSectionNewPercentage =
                        _widths[nextSectionIndex] - percentageDiff;
                    const nextSectionWidth = limitNumberWithinRange(
                        nextSectionNewPercentage,
                        0,
                        maxPercent
                    );
                    _widths[nextSectionIndex] = nextSectionWidth;

                    this.percentageMovedOld = percentageMoved;
                }

                // if (this.tags.length > 2) {
                //     if (_widths[index] === 0) {
                //         _widths[nextSectionIndex] = maxPercent;
                //         _widths.splice(index, 1);
                //         this.tags = this.tags.filter((t, i) => i !== index);
                //         removeEventListener();
                //     }
                //     if (_widths[nextSectionIndex] === 0) {
                //         _widths[index] = maxPercent;
                //         _widths.splice(nextSectionIndex, 1);
                //         this.tags = this.tags.filter((t, i) => i !== nextSectionIndex);
                //         removeEventListener();
                //     }
                // }

                this.widths = _widths;
            };

            window.addEventListener("pointermove", resize);
            window.addEventListener("touchmove", resize);

            const removeEventListener = () => {
                window.removeEventListener("pointermove", resize);
                window.removeEventListener("touchmove", resize);
                this.percentageMovedOld = 0;
            };

            const handleEventUp = (eventUp) => {
                eventUp.preventDefault();
                document.body.style.cursor = "initial";
                removeEventListener();
            };

            window.addEventListener("touchend", handleEventUp);
            window.addEventListener("pointerup", handleEventUp);
        }
    },
    created () {
        // this.widths = new Array(this.tags.length).fill(100 / this.tags.length);
        // this.$refs.Widths = new Array(this.tags.length).fill(100 / this.tags.length);
    }
}
</script>

<style lang="css" scoped>
</style>