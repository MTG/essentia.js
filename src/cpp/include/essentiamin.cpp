

#include <stdio.h>
#include <essentia/algorithmfactory.h>
#include "essentiamin.h"
 
using namespace std;
using namespace essentia;
using namespace standard;


std::vector<float> EssentiaMin::onsetRate(std::vector<float> audio) {


  setDebugLevel(EAll);                     // EAll is a special value that contains all modules
  unsetDebugLevel(EMemory | EConnectors);

  essentia::warningLevelActive = true; // deactivate warnings
  essentia::infoLevelActive = true;    // deactivate info
  essentia::errorLevelActive = true;    // activate error level

  printf("trying Essentia init\n");
  essentia::init();

  printf("Essentia init done\n");
  float onsetRate;
  vector<float> onsets;

  Algorithm* extractoronsetrate = AlgorithmFactory::create("OnsetRate");

  printf("created factory\n");
  extractoronsetrate->input("signal").set(audio);
  extractoronsetrate->output("onsets").set(onsets);
  extractoronsetrate->output("onsetRate").set(onsetRate);
  extractoronsetrate->compute();

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

  printf("start\n");
  AlgorithmFactory& factory = AlgorithmFactory::instance();
  
  printf("instance of factory\n");

  Algorithm* rms = factory.create("RMS");

  delete rms;
  printf("created factory\n");
}
