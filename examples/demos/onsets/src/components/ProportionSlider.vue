<template>
    <div style="height: 6em;" id="multislider-container">
        <div class="h-100 w-100 d-flex mb-2 rounded-lg flex-grow-1" id="multislider" ref="TagSliderRef">
            <proportion-tag 
            v-for="(tag, index) in tagsOn" :key="index" 
            :name="tag.name" 
            :color="tag.color" 
            :width="widths[index]"
            :show-percentage="showTagPercentage"
            @slider-select-on="onSliderSelect($event, index)"
            @slider-select-off="showTagPercentage=false"
            @tag-clicked="removeTag"
            @pointerenter="(name) => $emit('pointerenter', name)"
            @pointerleave="$emit('pointerleave')">
            </proportion-tag>
        </div>
        <b-button variant="light" size="sm" v-for="(tag, index) in tagsOff" :key="index" 
        :class="{'ml-2': buttonIsNotFirst(index) }" @click="handleTagReset(tag.name)"
        v-b-tooltip.hover :title="`Add ${tag.name} to selected functions`">
            <b-icon icon="arrow-counterclockwise"></b-icon>
            {{tag.name}}
        </b-button>
    </div>
</template>

<script>
const tagColor = '#dee2e6dd';

import ProportionTag from "./ProportionTag.vue";
import { ref } from "@vue/composition-api";
import { getPercentage, limitNumberWithinRange, nearestN } from "./utils.js";

const formattedTagNames = {hfc: "HFC",complex: "Complex",flux: "Flux",complex_phase: "Complex Phase"};
let resize;

export default {
    props: {
        tags: Object,
        tagsOrder: Array
    },
    components: { ProportionTag },
    setup () {
        return {
            TagSliderRef: ref(null)
        }
    },
    data () {
        return {
            tagsOn: this.tags.on.names.map( (name) => { return {name: formattedTagNames[name], color: tagColor, position: this.tagsOrder.indexOf(name)}; } ),
            widths: this.tags.on.values.map(v => v * 100),
            tagsOff: this.tags.off.names.map( (name) => { return {name: formattedTagNames[name], color: tagColor, position: this.tagsOrder.indexOf(name)}; } ),
            percentageMovedOld: 0,
            showTagPercentage: false
        };
    },
    watch: {
        tagsOn () {
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

            resize = (resizeEvent) => {
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
                    if (currentSectionWidth < 10) return;
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

                this.widths = _widths;
            };

            window.addEventListener("pointermove", resize);
            window.addEventListener("touchmove", resize);

            const handleEventUp = (eventUp) => {
                eventUp.preventDefault();
                document.body.style.cursor = "initial";
                this.removeEventListener();
                this.showTagPercentage = false;
            };

            window.addEventListener("touchend", handleEventUp);
            window.addEventListener("pointerup", handleEventUp);
        },
        removeTag (name) {
            // guard: DONT remove if only one is left
            if (this.tagsOn.length === 1) return;
            let idx = null;
            let widths = this.widths.slice();
            this.tagsOn = this.tagsOn.filter((t, i) => {
                if (t.name === name) {
                    idx = i;
                    this.tagsOff.push(t);
                }
                return t.name !== name;
            });

            this.removeEventListener();

            let removedTagWidth = widths.splice(idx, 1);

            if (widths[idx+1]) {
                widths[idx+1] += removedTagWidth[0];
            } else if (widths[idx-1]) {
                widths[idx-1] += removedTagWidth[0];
            }

            this.widths = widths;
        },
        removeEventListener () {
            window.removeEventListener("pointermove", resize);
            window.removeEventListener("touchmove", resize);
            this.percentageMovedOld = 0;
        },
        controlsChanged () {
            const tags = {
                on: {
                    names: this.tagsOn.map(t => t.name.toLowerCase().replace(" ", "_") ),
                    values: this.widths.map(w => w * 0.01)
                },
                off: {
                    names: this.tagsOff.map(t => t.name.toLowerCase().replace(" ", "_") )
                }
            };

            this.$emit('slider-changed', tags);
        },
        buttonIsNotFirst (i) {
            return i > 0;
        },
        handleTagReset (name) {
            this.tagsOff = this.tagsOff.filter((t) => {
                if (t.name === name) {
                    // this.tagsOn.splice(t.position, 0, t);
                    this.tagsOn.push(t);
                }
                return t.name !== name;
            });
            this.tagsOn.sort( (elem1, elem2) => { return elem1.position - elem2.position; });
            const numTagsOn = this.tagsOn.length;
            this.widths = new Array(numTagsOn).fill(100 / numTagsOn);
        }
    }
}
</script>

<style lang="scss" scoped>
    #multislider {
        background-color: transparent;
    }

    b-button {
        margin-left: 1rem;
        &:first-of-type {
            margin-left: none;
        }
    }
</style>