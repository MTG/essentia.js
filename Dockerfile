FROM apiaryio/emcc

ENV LANG C.UTF-8

RUN apt-get update \
    && apt-get install -y libyaml-0-2 libfftw3-3 libtag1v5 libsamplerate0 \
       libavcodec57 libavformat57 libavutil55 \
       libavresample3 \
    && rm -rf /var/lib/apt/lists/*

RUN apt-get update \
    && apt-get install -y build-essential libyaml-dev libfftw3-dev \
       libavcodec-dev libavformat-dev libavutil-dev libavresample-dev \
       libsamplerate0-dev libtag1-dev git-core \
    && mkdir /essentia && cd /essentia && git clone -b emscripten https://github.com/albincorreya/essentia.git \
    && cd /essentia/essentia \
    && emconfigure sh -c './waf configure --prefix=$EMSCRIPTEN/system/local/ --build-static --fft=KISS --emscripten' \
    && emmake ./waf && emmake ./waf install \
    &&  apt-get remove -y build-essential libyaml-dev libfftw3-dev libavcodec-dev \
        libavformat-dev libavutil-dev libavresample-dev libsamplerate0-dev \
        libtag1-dev \
    && apt-get autoremove -y \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/* 

WORKDIR /srv/workspace/
