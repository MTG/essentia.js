// Sample EssentiaNodeFactory design pattern

const workletUrl = "./logmelspectrogram-worklet.js"

export class LogMelSpectrumNodeFactory {
  static async create(audioContext) {
    class LogMelSpectrumNode extends AudioWorkletNode {
      constructor(audioContext) {
        super(audioContext, 'logmelspectrogram-worklet');
      }
    }
    try {
      await audioContext.audioWorklet.addModule(workletUrl);
    } catch(e) {
      console.log(e);
    }
    return new LogMelSpectrumNode(audioContext);
  }
}