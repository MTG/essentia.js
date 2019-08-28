FROM trzeci/emscripten:sdk-incoming-64bit

ENV LANG C.UTF-8

RUN mkdir /essentia && cd /essentia && git clone https://github.com/MTG/essentia.git  

# configure build settings for essentia using kissfft
RUN cd /essentia/essentia \
    && emconfigure sh -c './waf configure --prefix=$EMSCRIPTEN/system/local/ --build-static --fft=KISS --emscripten'

# compile and build essentia
RUN emmake ./waf

# (you might need sudo rights)
RUN emmake ./waf install

WORKDIR /srv/workspace/
