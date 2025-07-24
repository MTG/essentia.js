
async function getAudioBufferFromURL(audioURL, webAudioCtx) {
  const response = await fetch(audioURL);
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await webAudioCtx.decodeAudioData(arrayBuffer);
  return audioBuffer;
}

function audioBufferToMonoSignal(buffer) {
    if (buffer.numberOfChannels === 1) {
        return buffer.getChannelData(0);
    }
    if (buffer.numberOfChannels === 2) {
        const left = buffer.getChannelData(0);
        const right = buffer.getChannelData(1);
        return left.map((v, i) => (v + right[i]) / 2);
    }
    throw new Error('unexpected number of channels');
}

function downsampleAudioBuffer(sourceBuffer, targetRate) {
  // adapted from https://github.com/julesyoungberg/soundboy/blob/main/worker/loadSoundFile.ts#L25
  const ctx = new OfflineAudioContext(1, sourceBuffer.duration * targetRate, targetRate);
  // create mono input buffer
  const buffer = ctx.createBuffer(1, sourceBuffer.length, sourceBuffer.sampleRate);
  buffer.copyToChannel(audioBufferToMonoSignal(sourceBuffer), 0);
  // connect the buffer to the context
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.connect(ctx.destination);
  // resolve when the source buffer has been rendered to a downsampled buffer
  return new Promise((resolve) => {
    ctx.oncomplete = (e) => {
      const rendered = e.renderedBuffer;
      const samples = rendered.getChannelData(0);
      resolve(samples);
    };
    ctx.startRendering();
    source.start(0);
  });
}