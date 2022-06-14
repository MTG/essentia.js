<template>
    <Transition appear @enter="onEnter">
        <div class="prediction-set" :class="{flash: shouldFlash}">
            <div v-for="(t,i) in tags" :key="i" class="tag-container">
                <span :key="i" class="tag" 
                    :style="{fontSize: activation2fontSize(t.score), opacity: activation2opacity(t.score)}">
                    {{ t.name }} <span v-if="duplicateSubgenres.includes(t.name)" class="parent-genre">({{ t.parentGenre }})</span>
                </span>
            </div>
        </div>
    </Transition>
</template>

<script>
import { duplicateSubgenres } from '../audio/labels.js';

export default {
    props: ["tags"],
    data () {
        return {
            shouldFlash: false,
            duplicateSubgenres: duplicateSubgenres
        }
    },
    methods: {
        onEnter () {
            this.shouldFlash = true;
            setTimeout(() => {
                this.shouldFlash = false
            }, 1000);
        },
        activation2fontSize (activation) {
            if (activation <= 0.25) return "0.8rem";
            if (activation > 0.25 && activation <= 0.5) return "1rem";
            if (activation > 0.5 && activation <= 0.75) return "1.2rem";
            if (activation > 0.75) return "1.4rem";
        },
        activation2opacity (activation) {
            if (activation <= 0.25) return "0.4";
            if (activation > 0.25 && activation <= 0.5) return "0.6";
            if (activation > 0.5 && activation <= 0.75) return "0.8";
            if (activation > 0.75) return "1.0";
        }
    }
}
</script>

<style lang="scss">
.prediction-set {
    margin: .5em;
    padding: .5em;
    border-radius: var(--border-radius);
    background-color:  rgba(var(--color-primary), 0.2);
    color: black;

    // display: flex;
    // flex-direction: row;
    // flex: 0 1 1rem;
    // flex-wrap: wrap;

    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-auto-rows: auto;
    grid-gap: 10px;

    opacity: 1;

    transition: background-color .2s linear;
}

.tag, .tag-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.tag {
    // margin: .5em;
    background-color: rgb(var(--color-primary));
    box-shadow: 0 1px 2px black;
    border-radius: calc(var(--border-radius) * 2);
    padding: .5em;
    font-weight: bold;
}

.tag-container {
    &:nth-child(-1n + 3) {
        grid-column: span 4;
    }
    &:nth-last-child(2) {
        grid-row-start: 2;
        grid-column: 3 / span 4;
    }
    &:nth-last-child(1) {
        grid-row-start: 2;
        grid-column: 7 / span 4;
    }
}

.parent-genre {
    font-size: 0.7rem;
    font-weight: normal;
    color: var(--color-grey);
}

/* .flash-enter-active, .flash-leave-active */

.flash {
    background-color:  rgba(242, 242, 242, 0.4);
}
</style>