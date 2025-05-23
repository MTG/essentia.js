// Sample EssentiaNodeFactory design pattern
import { URLFromFiles } from "./util";

export async function registerEssentiaNode (context, processorUrl) {
  const workletProcessorCode = ["https://cdn.jsdelivr.net/npm/essentia.js@0.1.3/dist/essentia-wasm.umd.js", 
                                "https://cdn.jsdelivr.net/npm/essentia.js@0.1.3/dist/essentia.js-core.umd.js", 
                                "https://cdn.jsdelivr.net/npm/essentia.js@0.1.3/dist/essentia.js-extractor.umd.js", 
                                processorUrl];

  try {
    let concatenatedCode = await URLFromFiles(workletProcessorCode);
    await context.audioWorklet.addModule(concatenatedCode);
  } catch(e) {
    console.error(e);
  }
}

export function createEssentiaNode (context, name, processorOptions) {
  class EssentiaNode extends AudioWorkletNode {
    constructor(processorName) {
      super(context, processorName, {
        outputChannelCount: [1],
        processorOptions: processorOptions
      });
    }
  }

  return new EssentiaNode(name);
}
