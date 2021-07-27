// Sample EssentiaNodeFactory design pattern

function URLFromFiles(files) {
  const promises = files
    .map((file) => fetch(file)
      .then((response) => response.text()));

  return Promise
    .all(promises)
    .then((texts) => {
      const text = texts.join('');
      const blob = new Blob([text], {type: "application/javascript"});

      return URL.createObjectURL(blob);
    });
}

const workletProcessorCode = ["https://cdn.jsdelivr.net/npm/essentia.js@0.1.0/dist/essentia-wasm.module.js", 
                              "https://cdn.jsdelivr.net/npm/essentia.js@0.1.0/dist/essentia.js-core.es.js", 
                              "essentia-worklet-processor.js"];

export async function createEssentiaNode (context) {
  class EssentiaNode extends AudioWorkletNode {
    constructor(context) {
      super(context, 'essentia-worklet-processor', {
        outputChannelCount: [1]
      });
    }
  }
  try {
    let concatenatedCode = await URLFromFiles(workletProcessorCode)
    await context.audioWorklet.addModule(concatenatedCode);
  } catch(e) {
    console.log(e);
  }
  return new EssentiaNode(context);
}
