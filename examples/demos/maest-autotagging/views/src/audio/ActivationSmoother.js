import { EffnetDiscogsLabels as discogsLabels } from './labels.js';
import { median } from 'mathjs';

class ActivationSmoother {
    #memory;
    #size;
    constructor (memorySize = 3) {
        this.#memory = {};
        this.#size = memorySize;

        for (let label of discogsLabels) {
            this.#memory[label] = Array(memorySize).fill(0);
        }
        console.log('Smoother init:\n');
        console.log(this.#memory);
    }

    push (activations) {
        if (activations.length < discogsLabels.length) throw RangeError;

        if (this.#size === 1) {
            console.log('smoother: size 1');
            return activations;
        }

        return discogsLabels.map( (l, i) => {
            // if (i==0) console.log('before shift', this.#memory[l]);
            this.#memory[l].shift();
            // if (i==0) console.log('before push', this.#memory[l]);
            this.#memory[l].push(activations[i]);
            // console.log('after push', this.#memory[l]);
            const activationMedian = median(this.#memory[l]);
            // console.log('after median', this.#memory[l]);
            // this.#memory[l][this.#size-1] = activationMedian;
            return activationMedian;
        })
    }

    set memorySize (newSize) {
        if (newSize === this.#size) return; // do nothing
        if (newSize < 1) newSize = 1;
        if (newSize > this.#size) {
            const diff = newSize - this.#size; // to add
            for (let label of discogsLabels) {
                this.#memory[label].splice(0, 0, ...Array(diff).fill(0));
            }
            console.log(this.#memory);
        }
        if (newSize < this.#size) {
            const diff = this.#size - newSize; // to remove
            for (let label of discogsLabels) {
                this.#memory[label].splice(0, diff);
            }
            console.log(this.#memory);
        }
        this.#size = newSize;
        console.info(`Smoother now using memory size: ${this.#size}`);
    }

    get memorySize () {
        return this.#size;
    }
}

export default new ActivationSmoother();