import {Essentia, EssentiaWASM} from 'essentia.js';
import { describe, expect, test } from 'vitest';

const essentia = new Essentia(EssentiaWASM);

function mockAudioVector (size) {
    let arr = (new Float32Array(size)).map(s => Math.random()*2 - 1);
    return essentia.arrayToVector(arr);
}

function getSpectrum (size) {
    let mockSignal = mockAudioVector(size);
    return essentia.Spectrum(mockSignal, size).spectrum;
}

describe('essentia.Spectrum() frameSize limits', () => {
    test('small frameSize', () => {
        let result = getSpectrum(8);
        expect(result.size()).toBe(5);
    });

    test('typical frameSize, odd', () => {
        let result = getSpectrum(257);
        expect(result.size()).toBe(129);
    });

    test('typical frameSize, even', () => {
        let result = getSpectrum(256);
        expect(result.size()).toBe(129);
    });

    test('big frameSize', () => {
        let result = getSpectrum(8167246);
        expect(result.size()).toBe(8167246/2 + 1);
    });
})