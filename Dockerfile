ARG EMSCRIPTEN_VERSION=1.38.43
FROM trzeci/emscripten-slim:sdk-tag-${EMSCRIPTEN_VERSION}-64bit

ENV LANG C.UTF-8

# compile essentia with emscripten and selected third-party dependencies
RUN apt-get update \
    && apt-get install -y build-essential libsamplerate0-dev git-core cmake curl nano \
    && mkdir /essentia && cd /essentia && git clone -b emscripten https://github.com/albincorreya/essentia.git \
    && cd /essentia/essentia/packaging/debian_3rdparty \
    && bash -C "./build_libsamplerate.sh" \
    && bash -C "./build_eigen3.sh" && cd ../../ \
    && emconfigure sh -c './waf configure --prefix=$EMSCRIPTEN/system/local/ --build-static --fft=KISS --emscripten --static-dependencies' \
    && emmake ./waf && emmake ./waf install \
    &&  apt-get remove -y libsamplerate0-dev \
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