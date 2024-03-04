const { expect } = require('chai');
const EssentiaWASM = require('../dist/essentia-wasm.umd.js');
const { ready, FrequencyBands } = require('../dist/essentia.js-core.umd.js');

ready(EssentiaWASM);

console.log('frequencybands', FrequencyBands);

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

  it('should throw an error when configuring with invalid parameters', () => {
   expect(() => {
    frequencyBandsInstance.configure('hello');
   }).to.throw();
  });

  it('should compute with valid input', () => {
    const spectrum = Array(1024).fill(0).map( _ => Math.random() );
    const result = frequencyBandsInstance.compute(spectrum);
    // Add assertions to check the result of the computation
    expect(result).to.be.an('object')
                .and.to.have.property('bands');
    expect(result['bands']).to.be.a('VectorFloat');
  });

});