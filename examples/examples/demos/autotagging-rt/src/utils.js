import { GENRE_EMOJIS } from "/demos/autotagging-rt/data/tag-emojis.js";

function createTagVisualisers() {
    const container = document.querySelector('#matrix');
    for (let tag in GENRE_EMOJIS) {
        const vizElem = document.createElement('music-tag-viz');
        vizElem.setAttribute('name', tag);
        vizElem.setAttribute('icon', GENRE_EMOJIS[tag]);
        container.appendChild(vizElem);
    }
}

class PredictionStore {
    constructor() {
        this.reset();
    }

    reset() {
        this.predictionsAccum = {};
        this.predictionsFrameCount = 0;
    }

    accumFrame(predictions) {
        this.predictionsFrameCount++;

        for (let tag in predictions) {
            if (!this.predictionsAccum[tag]) {
                this.predictionsAccum[tag] = predictions[tag];
            } else {
                this.predictionsAccum[tag] += predictions[tag];
            }
        }
    }

    getAverages() {
        let averages = {};
        for (let tag in this.predictionsAccum) {
            averages[tag] = this.predictionsAccum[tag] / this.predictionsFrameCount;
        }
        return averages;
    }
}

export { createTagVisualisers, PredictionStore };