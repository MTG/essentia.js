ARG EMSCRIPTEN_VERSION=1.38.43
FROM trzeci/emscripten-slim:sdk-tag-${EMSCRIPTEN_VERSION}-64bit

ENV LANG C.UTF-8

# install third-party dependencies for essentia
RUN apt-get update \
    && apt-get install -y libyaml-0-2 libfftw3-3 libtag1v5 libsamplerate0 \
       libavcodec57 libavformat57 libavutil55 libeigen3-dev libavresample3 \
    && rm -rf /var/lib/apt/lists/*

# compile essentia with emscripten
RUN apt-get update \
    && apt-get install -y build-essential libyaml-dev libfftw3-dev \
       libavcodec-dev libavformat-dev libavutil-dev libavresample-dev \
       libsamplerate0-dev libtag1-dev git-core \
    && mkdir /essentia && cd /essentia && git clone https://github.com/MTG/essentia.git \
    && cd /essentia/essentia \
    && emconfigure sh -c './waf configure --prefix=$EMSCRIPTEN/system/local/ --build-static --fft=KISS --emscripten \
                        --pkg-config-path=/usr/share/pkgconfig' \
    && emmake ./waf && emmake ./waf install \
    &&  apt-get remove -y libyaml-dev libfftw3-dev libavcodec-dev \
        libavformat-dev libavutil-dev libavresample-dev libsamplerate0-dev \
        libtag1-dev \
    && apt-get autoremove -y \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/* \
    && cd / && rm -rf /essentia/essentia

# copy and install python dependencies
COPY src/python/requirements.txt /tmp/requirements.txt

RUN pip install --upgrade setuptools \
    && pip install --no-cache-dir -r /tmp/requirements.txt \
    && rm /tmp/requirements.txt

WORKDIR /essentia/