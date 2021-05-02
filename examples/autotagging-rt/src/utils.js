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

        for (tag in predictions) {
            if (!this.predictionsAccum[tag]) {
                this.predictionsAccum[tag] = predictions[tag];
            } else {
                this.predictionsAccum[tag] += predictions[tag];
            }
        }
    }

    getAverages() {
        let averages = {};
        for (tag in this.predictionsAccum) {
            averages[tag] = this.predictionsAccum[tag] / this.predictionsFrameCount;
        }
        return averages;
    }
}