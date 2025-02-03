const { expect } = require('chai');
const EssentiaWASM = require('../dist/essentia-wasm.umd.js');
const { ready, FrequencyBands, LoudnessEBUR128, arrayToVector, vectorToArray } = require('../dist/essentia.js-core.umd.js');

ready(EssentiaWASM);

describe('LoudnessEBUR128:instantiation', () => {
  let loudnessEBUR128Instance;
  it('should instantiate algorithm correctly', () => {
    loudnessEBUR128Instance = new LoudnessEBUR128();
  });
  it('should delete instance', () => {
    if (!loudnessEBUR128Instance) this.skip;
    loudnessEBUR128Instance.delete();
  })
});

describe('LoudnessEBUR128:functionality', () => {
  let loudnessEBUR128Instance;
  let signalVector;

  before(() => {
    // Initialize the LoudnessEBUR128 instance before tests
    loudnessEBUR128Instance = new LoudnessEBUR128();
    const signalData = Array(44100*5).fill(0).map( _ => Math.random() ); // 5s audio
    signalVector = arrayToVector(signalData);
  });

  after(() => {
    // clear object from C++/WASM memory after tests
    loudnessEBUR128Instance.delete();
  })

  it('should initialize with default params', () => {
    expect(loudnessEBUR128Instance).to.be.instanceOf(LoudnessEBUR128);
  });

  it('should configure with valid parameters', () => {
    expect(() => {
      loudnessEBUR128Instance.configure(0.05, 48000, true); // hopSize in seconds
    }).to.not.throw();
  });

  it('should throw an error when configuring with invalid `hopSize` param', () => {
    expect(() => {
      loudnessEBUR128Instance.configure('hello');
    }).to.throw();
  });

  it('should throw an error when configuring with invalid `sampleRate` param', () => {
    expect(() => {
      loudnessEBUR128Instance.configure(512, '16000');
    }).to.throw();
   });

  it('should compute with valid input', () => {
    const result = loudnessEBUR128Instance.compute(signalVector, signalVector);
    console.log('loudnessebur128 output', result);
    // Add assertions to check the result of the computation
    expect(result).to.be.an('object');
    // for some reason chaining `and.to.have.property`s wasn't working
    expect(result).to.have.property('momentaryLoudness');
    expect(result).to.have.property('shortTermLoudness');
    expect(result).to.have.property('integratedLoudness');
    expect(result).to.have.property('loudnessRange');
    // Chai cannot check for type VectorFloat, so quick conversion to bypass that
    expect(vectorToArray(result['momentaryLoudness'])).to.be.a('Float32Array');
    expect(vectorToArray(result['shortTermLoudness'])).to.be.a('Float32Array');
  });

});

describe('FrequencyBands:instantiation', () => {
  let frequencyBandsInstance;
  it('should instantiate algorithm correctly', () => {
    frequencyBandsInstance = new FrequencyBands();
  });
  it('should delete instance', () => {
    frequencyBandsInstance.delete();
  })
});

describe('FrequencyBands:functionality', () => {
  let frequencyBandsInstance;

  beforeEach(() => {
    // Initialize the FrequencyBands instance before each test
    frequencyBandsInstance = new FrequencyBands();
  });

  afterEach(() => {
    // clear object from C++/WASM memory
    frequencyBandsInstance.delete();
  })

  it('should initialize with default frequency bands and sample rate', () => {
    expect(frequencyBandsInstance).to.be.instanceOf(FrequencyBands);
  });

  it('should configure with valid parameters', () => {
    expect(() => {
      const customFrequencyBands = [0, 50, 100, 200, 300];
      const customSampleRate = 48000;
      frequencyBandsInstance.configure(customFrequencyBands, customSampleRate);
    }).to.not.throw();
  });

  it('should throw an error when configuring with invalid `frequencyBands` param', () => {
    expect(() => {
      frequencyBandsInstance.configure('hello');
    }).to.throw();
  });

  it('should throw an error when configuring with invalid `sampleRate` param', () => {
    expect(() => {
      frequencyBandsInstance.configure([0, 50, 100, 500], '16000');
    }).to.throw();
   });

  it('should compute with valid input', () => {
    const spectrumData = Array(1024).fill(0).map( _ => Math.random() );
    const spectrum = arrayToVector(spectrumData);
    const result = frequencyBandsInstance.compute(spectrum);
    // Add assertions to check the result of the computation
    expect(result).to.be.an('object')
                .and.to.have.property('bands');
    // Chai cannot check for type VectorFloat, so quick conversion to bypass that
    expect(vectorToArray(result['bands'])).to.be.a('Float32Array');
  });

});