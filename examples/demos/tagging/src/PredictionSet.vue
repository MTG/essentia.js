<template>
    <div class="prediction-set ui divided list" :class="{flash: shouldFlash}">
        <div v-for="(t,i) in tags" :key="i" class="item" :style="{opacity: activation2opacity(t.normScore)}">
            <div class="ui label">
                <span :key="i" class="header">
                    {{ t.name }} 
                    <span v-if="duplicateSubgenres.includes(t.name)" class="parent-genre description">({{ t.parentGenre }})</span>
                </span>
            </div>
            <div class="right floated content">
                {{ (t.score).toFixed(3) }}
            </div>
        </div>
    </div>
</template>

<script>
import { duplicateSubgenres } from '../models/discogsTags.js';

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
        activation2opacity (activation) {
            if (activation <= 0.25) return "0.5";
            if (activation > 0.25 && activation <= 0.5) return "0.65";
            if (activation > 0.5 && activation <= 0.75) return "0.85";
            if (activation > 0.75) return "1.0";
        }
    }
}
</script>

<style lang="scss" scoped>
.prediction-set {
    border-radius: var(--border-radius);
    background-color:  rgba(var(--color-primary), 0.2);
    color: black;
    
    opacity: 1;
    
    transition: background-color .2s linear;
}

.tag, .tag-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.tag {
    background-color: rgb(var(--color-primary));
    box-shadow: 0 1px 2px black;
    border-radius: calc(var(--border-radius) * 2);
    padding: .5em;
}

.parent-genre {
    font-size: 0.8rem;
    font-weight: normal;
}

/* .flash-enter-active, .flash-leave-active */

.flash {
    background-color:  rgba(242, 242, 242, 0.4);
}
</style>