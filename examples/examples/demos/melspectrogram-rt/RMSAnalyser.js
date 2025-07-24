import { registerEssentiaNode, createEssentiaNode } from "../common/essentia-worklet-node.js";
import processorUrl from "./rms-processor.js?url";

class Smoother {
  constructor(windowSize=10) {
    this.size = windowSize;
    this.buffer = new Array(this.size).fill(0);
    this.oldestVal = 0;
    this.sum = 0;
    this.firstTime = true;
  }

  lowpass(val) {
    // computes moving average
    this.buffer.push(val);
    this.oldestVal = this.buffer.shift();
    
    if (this.firstTime) {
      this.sum = this.buffer.reduce((acc, v) => acc + v);
      this.firstTime = false;
    } else {
      this.sum = (this.sum - this.oldestVal) + val;
    }
    const avg = this.sum / this.size;
    return Math.round(avg);
  }
}

export class RMSAnalyser {
  constructor(audioContext, textContainer) {
    this.ctx = audioContext;
    this.smoother = new Smoother(20);
    this.rmsValueElem = textContainer;
    this.inputNode;
    this.analyserNode;
    this.analyserData;
    this.essentiaNode;
    this.animationID;
    
    this.processorName = processorUrl.split("/").at(-1).split(".")[0];
  }
  
  async registerNode() {
    await registerEssentiaNode(this.ctx, processorUrl);
  }

  connectGraph(inputSource) {
    this.inputNode = inputSource;
    this.analyserNode = this.ctx.createAnalyser();
    this.analyserNode.fftSize = 2 * 128;
    this.analyserData = new Float32Array(this.analyserNode.frequencyBinCount);

    // create essentia node only once (avoid registering processor repeatedly)
    if (!this.essentiaNode) {
      this.essentiaNode = createEssentiaNode(this.ctx, this.processorName);
    }

    // connect mic stream to essentia node
    this.inputNode.connectToAudioNode(this.essentiaNode);
    // If it isn't connected to destination, the worklet is not executed
    this.essentiaNode.connect(this.analyserNode);
  }

  // connect the nodes
  start() {
    this.getRMSValue();
  }

  stop() {
    cancelAnimationFrame(this.animationID);
  }
  
  getRMSValue () {
    this.animationID = requestAnimationFrame(this.getRMSValue.bind(this));
    this.analyserNode.getFloatTimeDomainData(this.analyserData);
    let rms = this.analyserData[0];
    let dbFS = 20 * Math.log10((rms + Number.EPSILON) * Math.sqrt(2));
    // lowpass value for easier visualization
    let smoothedVal = this.smoother.lowpass(dbFS);
    this.rmsValueElem.value = smoothedVal;
  }
}

