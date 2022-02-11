import { audioEngine } from './engine';
import { test, expect, beforeAll } from 'vitest';
// import 'jsdom-worker';
// import { Response } from 'node-fetch';

// const originalFetch = globalThis.fetch;
// globalThis.fetch = async (url, options) => {
//   if (typeof url === 'string' && url.startsWith('file://')) {
//     const content = fs.readFileSync(url.slice('file://'.length));
//     return new Response(content);
//   }
//   return originalFetch(url, options);
// };

const fs = require('fs');
const path = require('path');

let songs = [];

function retrieveTestSongs () {
    let items = fs.readdirSync('../assets/testSongs/');
    for (let i of items) {
        if (!i.isFile()) {
            continue;
        }
        songs.push(fs.readFileSync(i));
    }
    console.log(songs);
    return songs;
}

beforeAll(retrieveTestSongs);

test('batchProcess returns list of analysis objects', async () => {
    await expect(audioEngine.batchProcess(songs)).resolves.toHaveProperty('loudness');
})
