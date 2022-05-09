
# Wrapper for Essentia's FFT + CartesianToPolar algorithms
Motivation: This wrapper is part of making an onsets demo web page, and is necessary because these two algorithms are not available in Essentia.js (as of May 2021) since they use `std::complex` C++ type.

## How to build
1. Clone this repository: 
    ```sh
    git clone https://github.com/MTG/essentia.js.git
    ```
2. `cd essentia.js`
3. Start Docker
4. Pull the Essentia emscripten image from DockerHub: 
    ```bash
    docker pull mtgupf/essentia-emscripten:latest
    ```
5. Start a container from that image, mounting the repo's root
    ```bash
    docker run -it -v `pwd`:/essentia/ mtgupf/essentia-emscripten:latest bash
    ```
6. Inside the container, cd to the code for this wrapper, and run `make`:
    ```bash
    cd src/cpp/PolarFFT
    make
    ```


## Testing

1. To run the tests with Node.js, add the following code to the `*.module.js` build:
```javascript
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
```

2. add a `package.json` with `"type": "module"` to the _/builds_ folder
3. run `node test.mjs`