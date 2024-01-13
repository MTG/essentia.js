ARG EMSCRIPTEN_VERSION=3.1.24
FROM emscripten/emsdk:${EMSCRIPTEN_VERSION}

ENV LANG C.UTF-8

# compile essentia with emscripten and selected third-party dependencies
RUN apt-get update \
    && apt-get install -y cmake curl nano python3-dev python3-numpy-dev python3-numpy python3-yaml python3-six libeigen3-dev python3-pip \
    && mkdir /essentia && cd /essentia && git clone https://github.com/MTG/essentia.git \
    && cd /essentia/essentia/packaging/debian_3rdparty \
    && bash -C "./build_eigen3.sh" && cd ../../  && chmod +x waf \
    && emconfigure sh -c 'python3 waf configure --prefix=$EMSCRIPTEN/system/local/ --build-static --fft=KISS --emscripten --static-dependencies' \
    && emmake python3 waf && emmake python3 waf install \
    &&  apt-get remove -y python3-dev libeigen3-dev \
    && apt-get autoremove -y \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/* \
    && cd / && rm -rf /essentia/essentia

# copy and install python dependencies
COPY src/python/requirements.txt /tmp/requirements.txt
RUN pip3 install --upgrade setuptools \
    && pip3 install --no-cache-dir -r /tmp/requirements.txt \
    && rm /tmp/requirements.txt

# add latest eigen3 header files for linking the essentia.js binding builds
ARG EIGEN_VERSION=3.3.7
RUN wget  -P /usr/local/include/ "https://gitlab.com/libeigen/eigen/-/archive/3.3.7/eigen-${EIGEN_VERSION}.tar.gz" \
    && cd /usr/local/include/ && tar -xvzf eigen-${EIGEN_VERSION}.tar.gz \
    && rm -f eigen-${EIGEN_VERSION}.tar.gz && mv eigen-${EIGEN_VERSION} eigen3

ENV EIGEN_PATH /usr/local/include/eigen3
ENV EMSCRIPTEN /emsdk/upstream/emscripten 

WORKDIR /essentia/