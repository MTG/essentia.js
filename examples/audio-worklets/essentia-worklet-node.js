// Sample EssentiaNodeFactory design pattern

const workletUrl = "essentia-worklet-processor.js"

export class EssentiaNodeFactory {
  static async create(context) {
    class EssentiaNode extends AudioWorkletNode {
      constructor(context) {
        super(context, 'essentia-worklet-processor');
      }
    }
    try {
      await context.audioWorklet.addModule(workletUrl);
    } catch(e) {
      console.log(e);
    }
    return new EssentiaNode(context);
  }
}