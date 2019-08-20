#include <stdio.h>
#include <emscripten.h>
#include <essentia/algorithmfactory.h>
#include "./essentiamin.h"

using namespace std;
using namespace essentia;
using namespace standard;


void EssentiaMin::onsetRate(string inputAudioFile) {

  essentia::init();

  Real onsetRate;
  vector<Real> onsets;
  vector<Real> audio, unused;
  // File Input
  Algorithm* audiofile = AlgorithmFactory::create("MonoLoader",
                                                  "filename", inputAudioFile,
                                                  "sampleRate", 44100);

  Algorithm* extractoronsetrate = AlgorithmFactory::create("OnsetRate");

  audiofile->output("audio").set(audio);
  extractoronsetrate->input("signal").set(audio);
  extractoronsetrate->output("onsets").set(onsets);
  extractoronsetrate->output("onsetRate").set(onsetRate);
  audiofile->compute();
  extractoronsetrate->compute();

  cout << "onsetRate: " << onsetRate << endl;
  cout << "onsetTimes: " << onsets << endl;

  delete extractoronsetrate;
  delete audiofile;

  essentia::shutdown();

}


// add more methods here