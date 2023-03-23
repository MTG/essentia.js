function checkValidDescriptorList(list) {
    // consists of array of duples of [String name, Number size] pairs
    if (!list instanceof Array) {
        throw TypeError("nameSizeList should be an Array");
    }
    if (list.length < 1) {
        throw Error("nameSizeList is empty");
    }
    for (let duple of list) {
        if (!duple instanceof Array) {
            throw TypeError("nameSizeList elements should be a duple of type Array");
        }
        if (duple.length !== 2) {
            throw Error("nameSizeList elements should contain 2 valuesArray (i.e. duple)");
        }
        if (typeof duple[0] !== "string" || typeof duple[1] !== "number") {
            throw TypeError("Values inside each nameSizeList duple should be [string, number]");
        }
    }

    return true;
}

export function createDescriptorMemoryInfo(nameSizeList) {
    checkValidDescriptorList(nameSizeList);
    const memoryInfoMap = new Map();
    let totalSize = 0;
    for (let descriptor of nameSizeList) {
        const name = descriptor[0];
        if (name === 'sab') throw new Error('Descriptor name "sab" is reserved for internal use only');
        const size = descriptor[1];
        memoryInfoMap.set(name, {
            size: size,
            startIndex: totalSize
        });
        totalSize += size;
    }
    // first 4 bytes used as thread sync digit
    const sizeInBytes = 4 + totalSize * Float32Array.BYTES_PER_ELEMENT;
    memoryInfoMap.set('sab', new SharedArrayBuffer(sizeInBytes));
    return memoryInfoMap;
}

export class EssentiaPool {
    #sab;
    #descriptorMemoryInfo;
    #capacity;
    #storage;
    #threadSync;

    constructor(descriptorMemoryInfo) {
        this.descriptorNames = [];
        this.#sab = descriptorMemoryInfo.get('sab');
        this.#descriptorMemoryInfo = descriptorMemoryInfo;

        for (const [name, _] of descriptorMemoryInfo) {
            this.descriptorNames.push(name);
        }

        this.#capacity = (this.#sab.byteLength - 4) / Float32Array.BYTES_PER_ELEMENT;
        // 1-byte offset to account for thread sync digit at pos 0
        this.#storage = new Float32Array(this.#sab, 4, this.#capacity);
        this.#threadSync = new Int32Array(this.#sab, 0, 1);
    }

    set(descriptorName, valuesArray) {
        const [size, descriptorOffset] = this.#getDescriptorInfo(descriptorName, valuesArray);
        
        for (let i = 0; i < size; i++) {
            this.#storage[descriptorOffset + i] = valuesArray[i];
        }

        // publish the enqueued data to the other side
        Atomics.store(this.#threadSync, 0, 1);
    }

    get(descriptorName, destinationArray) {
        const [size, descriptorOffset] = this.#getDescriptorInfo(descriptorName, destinationArray);

        for (let i = 0; i < size; i++) {
            destinationArray[i] = this.#storage[descriptorOffset + i];
        }
    
        Atomics.store(this.#threadSync, 0, 0);
    }

    #positionInBytes(index) {
        return 4 + index * Float32Array.BYTES_PER_ELEMENT;
    }

    #getDescriptorInfo(descriptorName, arr) {
        if (!this.#descriptorMemoryInfo.has(descriptorName)) {
            throw new ReferenceError(`${descriptorName} not found in Pool`)
        }
        if (!arr instanceof Float32Array) {
            throw TypeError('values/destination param should be a Float32Array');
        }
        const descriptorInfo = this.#descriptorMemoryInfo.get(descriptorName);
        if (arr.length !== descriptorInfo.size) {
            throw Error('length mismatch between provided array and descriptor memory info');
        }
        return [descriptorInfo.size, descriptorInfo.startIndex];
    }
}
