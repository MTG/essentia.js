

#include <stdio.h>
#include <essentia/algorithmfactory.h>
#include "essentiamin.h"
 
using namespace std;
using namespace essentia;
using namespace standard;


void EssentiaMin::initState(bool d) {

    if (d) {
        setDebugLevel(EAll);                     // EAll is a special value that contains all modules
        unsetDebugLevel(EMemory | EConnectors);
        essentia::warningLevelActive = true; // activate warnings
        essentia::infoLevelActive = true;    // deactivate info
        essentia::errorLevelActive = true;    // activate error level
    }
    essentia::init();
}


std::vector<float> EssentiaMin::onsetRate(std::vector<float> audio) {

  //essentia::init();

  float onsetRate;
  vector<float> onsets;

  Algorithm* extractoronsetrate = AlgorithmFactory::create("OnsetRate");

  cout << "onsetRate: " << onsetRate << endl;
  cout << "onsetTimes: " << onsets << endl;

  delete extractoronsetrate;

  essentia::shutdown();

  return onsets;

}


void EssentiaMin::testAlgoFactory() {

  setDebugLevel(EAll);                     // EAll is a special value that contains all modules
  unsetDebugLevel(EMemory | EConnectors);

  essentia::warningLevelActive = true; // deactivate warnings
  essentia::infoLevelActive = true;    // deactivate info
  essentia::errorLevelActive = true;    // activate error level

  essentia::init();

  AlgorithmFactory& factory = AlgorithmFactory::instance();

  Algorithm* rms = factory.create("RMS");
  delete rms;

}


