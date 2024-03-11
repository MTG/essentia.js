(async function main() {
  const wasmModule = await EssentiaWASM();
  const essentia = new Essentia(wasmModule);
  console.log('loaded essentia web');

  const FRAME_SIZE = 2048;
  const HOP_SIZE = 1024;
  const audioFilePath = '/test/data/mozart_c_major_30sec.wav';
  const options = { 'async': true };

  const ctx = new AudioContext();
  const suite = new Benchmark.Suite('MFCC');

  const mfccModule = await MFCC_WASM_MODULE();
  mfccModule.bootEssentia();
  console.log('mfccModule::init successfully');
  const frameGenOO = new mfccModule.FrameGenerator(FRAME_SIZE, HOP_SIZE);
  const spectrumOO = new mfccModule.Spectrum(FRAME_SIZE);
  const mfccOO = new mfccModule.MFCC();

  let ooCounter=0, stdCounter=0;
  // flag to clean up memory (or not): should affect the number of HEAP resize msg shown on console
  const deleteObjects = true;

  function downloadJSON(jsonData) {
    const jsonURL = URL.createObjectURL(new Blob([jsonData]));
    const a = document.createElement('a');
    a.setAttribute('download', 'mfcc_comparison_browser.json');
    a.setAttribute('href', jsonURL);
    a.click();
    console.log("MFCC JSON file has been saved.");
  }

  function setupBenchmark(audioBuffer) {
    const channelData = audioBuffer.getChannelData(0);
    
    const frames = essentia.FrameGenerator(channelData, FRAME_SIZE, HOP_SIZE);
    const framesOO = frameGenOO.compute(channelData);
    
    // add test
    suite.add('Essentia#MFCC', () => {
      console.log(`std mfcc run ${stdCounter}`);
      for (var i = 0; i < frames.size(); i++){
        const spectrumVector = essentia.Spectrum( frames.get(i) ).spectrum
        const bandsVector = essentia.MFCC( spectrumVector ).bands;
        if (deleteObjects) {
          spectrumVector.delete();
          bandsVector.delete()
        }
      }
      stdCounter++;
    }, options);

    suite.add('Essentia-OO#MFCC', () => {
      console.log(`OOP mfcc run ${ooCounter}`);
      for (var i = 0; i < framesOO.size(); i++){
        const spectrumVector = spectrumOO.compute( framesOO.get(i) ).spectrum;
        const bandsVector = mfccOO.compute(spectrumVector).bands;
        if (deleteObjects) {
          spectrumVector.delete();
          bandsVector.delete()
        }
      }
      ooCounter++;
    }, options);

    // add listeners
    suite.on('cycle', function(event) {
      if (deleteObjects) {
        if (event.target.name == "Essentia#MFCC") {
          frames.delete()
        }
        if (event.target.name == "Essentia-OO#MFCC") {
          framesOO.delete();
        }
      };
      console.log(String(event.target));
    });
    
    suite.on('complete', function() {
      console.log(this);
      console.log('Fastest is ' + this.filter('fastest').map('name'));
      
      const resultsObj = {
        "essentia": {
          "mean": this[0].stats.mean,
          "moe": this[0].stats.moe,
          "rme": this[0].stats.rme,
          "sem": this[0].stats.sem,
          "deviation": this[0].stats.deviation,
          "variance": this[0].stats.variance,
          "execution times": this[0].stats.sample,
          "cycle": this[0].times.cycle,
          "elapsed": this[0].times.elapsed,
          "period": this[0].times.period,
          "timeStamp": this[0].times.timeStamp,
          "count": this[0].count,
          "cycles": this[0].cycles,
          "hz": this[0].hz
        },
        "essentia-object-oriented": {
          "mean": this[1].stats.mean,
          "moe": this[1].stats.moe,
          "rme": this[1].stats.rme,
          "sem": this[1].stats.sem,
          "deviation": this[1].stats.deviation,
          "variance": this[1].stats.variance,
          "execution times": this[1].stats.sample,
          "cycle": this[1].times.cycle,
          "elapsed": this[1].times.elapsed,
          "period": this[1].times.period,
          "timeStamp": this[1].times.timeStamp,
          "count": this[1].count,
          "cycles": this[1].cycles,
          "hz": this[1].hz
        }
      }
      let json = JSON.stringify(resultsObj);
      downloadJSON(json);
    });
    console.log('ready to run suite...');
  }

  fetch(audioFilePath)
  .then( resp => resp.arrayBuffer() )
  .then( data => ctx.decodeAudioData(data) )
  .then( buffer => {
    setupBenchmark(buffer);
    // run async
    suite.run();       
  })
})()