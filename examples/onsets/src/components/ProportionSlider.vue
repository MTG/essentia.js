<template>
    <div style="height: 50%;">
        <div style="width: 100%; display: flex; background-color: transparent; height: 100%;" ref="TagSliderRef">
            <tag-section 
            v-for="(tag, index) in tags" :key="index" 
            :name="tag.name" 
            :color="tag.color" 
            :width="widths[index]"
            :show-percentage="showTagPercentage"
            @slider-select-on="onSliderSelect($event, index)"
            @slider-select-off="showTagPercentage=false"
            @tag-clicked="removeTag">
            </tag-section>
        </div>
    </div>
</template>

<script>
const tagColor = '#dee2e6dd';

import TagSection from "./ProportionTag.vue";
import { ref } from "@vue/composition-api";
import { getPercentage, limitNumberWithinRange, nearestN } from "./utils.js";

export default {
    props: {
        tagsData: Object
    },
    components: { TagSection },
    setup () {
        return {
            TagSliderRef: ref(null)
        }
    },
    data () {
        return {
            tags: this.tagsData.names.map( name => { return {name: name, color: tagColor}; } ),
            widths: this.tagsData.values,
            percentageMovedOld: 0,
            showTagPercentage: false
        };
    },
    watch: {
        tags () {
            this.controlsChanged();
        },
        widths () {
            this.controlsChanged();
        }
    },
    methods: {
        onSliderSelect (selectEvent, index) {
            this.showTagPercentage = true;
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

                    if (this.tags.length > 2) {
                        if (_widths[index] === 5) {
                            _widths[nextSectionIndex] = maxPercent;
                            _widths.splice(index, 1);
                            this.tags = this.tags.filter((t, i) => i !== index);
                            removeEventListener();
                        }
                        if (_widths[nextSectionIndex] === 5) {
                            _widths[index] = maxPercent;
                            _widths.splice(nextSectionIndex, 1);
                            this.tags = this.tags.filter((t, i) => i !== nextSectionIndex);
                            removeEventListener();
                        }
                    }
                }

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
        },
        removeTag (name) {
            // guard: DONT remove if only one is left
            if (this.tags.length === 1) {
                return
            }
            let idx = null;
            let widths = this.widths.slice();
            this.tags = this.tags.filter((t,i) => {
                if (t.name === name) {
                    idx = i;
                }
                return t.name !== name;
            });
            let removedTagWidth = widths.splice(idx, 1);

            if (widths[idx+1]) {
                widths[idx+1] += removedTagWidth[0];
            } else if (widths[idx-1]) {
                widths[idx-1] += removedTagWidth[0];
            }

            this.widths = widths;
        },
        controlsChanged () {
            const tags = {
                names: this.tags.map(t => t.name.toLowerCase().replace(" ", "_") ),
                values: this.widths.map(w => w * 0.01)
            };

            this.$emit('slider-changed', tags);
        }
    }
}
</script>

<style lang="css" scoped>
</style>