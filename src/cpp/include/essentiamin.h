
#ifndef ESSENTIAMIN_H
#define ESSENTIAMIN_H

#include <vector>


// EssentiaMin class which includes methods of some selected essentia c++ algos
class EssentiaMin {

    public:
        void initState(bool d);
        void testAlgoFactory();
        std::vector<float> onsetRate(std::vector<float> audio);
        // add your essentia example methods here
};


// functions for type conversion
template <typename T>
std::vector<T> jsArray2Vec(){
    std::vector<T> vec;
    return vec;
}


#endif  // ESSENTIAMIN_H