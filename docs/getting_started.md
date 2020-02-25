# Getting started

## Loading `essentia.js`

 - ### NPM users

```bash
npm install essentia.js
```

```javascript
var esModule = require('essentia.js');

// NOTE: In npm dist 'Module.EssentiaJS' => 'Essentia.EssentiaJS'
let essentia = esModule.EssentiaJS(false);

// prints version of essentia
console.log(essentia.version)

// prints all the available algorithm methods in EssentiaJS
console.log(essentia.algorithmNames)
```

- ### Using CDN 

The following CDN links are available for `essentia.js`.
  
  - #### HTML `<script>` tag

  ```html
  <script src="https://unpkg.com/essentia.js@0.0.8/dist/essentia.js"></script>
  ```
  Check out this [example](../examples/script-node-processor/example.html). 


  - #### ES6 style import

  ```javascript
  import Module from 'https://unpkg.com/essentia.js@0.0.8/dist/essentia-module.js';
  
  // import essentia.tools.js (includes utility funcs for essentia.js)
  import { EssentiaTools } from 'https://unpkg.com/essentia.js@0.0.8/dist/essentia.tools.js';

  let essentia = new Module.EssentiaJS(false);

  // prints version of essentia
  console.log(essentia.version)

  // prints all the available algorithm methods in EssentiaJS
  console.log(essentia.algorithmNames)

  // create an instance of EssentiaTools
  let essentiaTools = new EssentiaTools(Module);
  ```
  Check out this [example](../examples/audio-worklets/essentia-worklet-processor.js).

  > Note: You shouldn't import the `essentia-module.js` on the main thread.

  There are also some other ways for loading WebAssembly modules. Check https://developer.mozilla.org/en-US/docs/WebAssembly/Loading_and_running.


## Usages in Javscript

After succesfully loading essentia.js on the JavaScript end, the typical usage would be like,

```javascript
// create essentia object with all the methods to run various algorithms
// here we set essentia debug mode = false
let essentia = new Module.EssentiaJS(false);
// if you use from npm it will be Essentia.EssentiaJS instead of Module.EssentiaJS

// for algorithms with single output
let yourOutputVar = essentia.'<your-essentia-algo>'(<inputs> ..., <parameters> ...);

// for algorithms with multiple outputs
essentia.'<your-essentia-algo>'(<inputs> ..., <outputs> ..., <parameters> ...);
```

As you can see, in contrary to essentia python bindings there are no seperate `configure` and `compute` methods in essentia.js since we bind both methods of essentia algorithms into one.

For example in real use-cases, it will look like below,

```javascript

// Computing ReplayGain from an input audio signal
// The algorithm return float type
// check https://essentia.upf.edu/reference/std_ReplayGain.html
let replaygain = essentia.ReplayGain(inputSignalVector, // input
                                     44100); // sampleRate (parameter)

// Running PitchYinProbabilistic algorithm on an input audio signal
// create empty std::vector<float> vector for populating the output of 
// essentia.PitchYinProbabilistic algorithm
var pitches = new Module.VectorFloat();
var voicedProbabilities = new Module.VectorFloat();

// check https://essentia.upf.edu/reference/std_PitchYinProbabilistic.html
essentia.PitchYinProbabilistic(inputSignalVector, // input_1
                               pitches, // output_1
                               voicedProbabilities, // output_2
                               // parameters
                               4096, // frameSize
                               256, // hopSize
                               0.1, // lowRMSThreshold
                               'zero', // outputUnvoiced,
                               false, // preciseTime
                               44100); //sampleRate
```

Similarly, you could use any of the algorithms specified in the [essentia algorithm reference](https://essentia.upf.edu/algorithms_reference.html) besides the algorithms listed [here](../src/python/excluded_algos.md).


> NOTE: In order to run a essentia standard algorithm, you need to specify value for all of it's parameters. The current essentia.js bindings doesn't bind the default parameter values provided in the essentia [documentation](https://essentia.upf.edu/algorithms_reference.html).


## Examples

### Simple example 

```html
<html lang="en">
  <script>
    var Module = {
      onRuntimeInitialized: function() {
        console.log('essentia.js loaded sucessfully ...');
        essentia = new Module.EssentiaJS(false);
        console.log('Essentia:', essentia.version);
        // your essentia feature extractor here
      }
    };
  </script>
  <head>
    <script src="https://unpkg.com/essentia.js@0.0.8/dist/essentia.js"></script>
  </head>
</html>
```

### Interactive demos: https://mtg.github.io/essentia.js/examples

### Using WebAudioAPI with ScriptNodeProcessor.

You can find some examples [here](https://github.com/MTG/essentia.js/tree/module/examples/script-node-processor) on how to use essentia as a feature extractor using the depreciated [`ScriptNodeProcessor`](https://developer.mozilla.org/en-US/docs/Web/API/ScriptProcessorNode).

### Using WebAudioAPI with AudioWorklets.

You can find some examples using the [`AudioWorkletProcessor`](https://developer.mozilla.org/en-US/docs/Web/API/AudioWorkletProcessor) and [`AudioWorkletNode`](https://developer.mozilla.org/en-US/docs/Web/API/AudioWorkletNode) along with the `essentia-module.js` build [here](https://github.com/MTG/essentia.js/tree/module/examples/audio-worklets).

&nbsp;