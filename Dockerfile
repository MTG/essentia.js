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

# update nodejs and npm to latest stable version
RUN npm install n -g && n stable 

# (hacky way) Change the default environment varibales emsdk entrypoint to our custom node installation since essentia.js requires the latest Nodejs engine (v12 or later) 
RUN echo 'export PATH="/emsdk_portable:/emsdk_portable/clang/tag-e1.38.43/build_tag-e1.38.43_64/bin:/emsdk_portable/emscripten/tag-1.38.43:/emsdk_portable/binaryen/tag-1.38.43_64bit_binaryen/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/local/bin/node:/usr/local/bin/npm"' >> /emsdk_portable/emsdk_set_env.sh 
RUN echo 'export EMSDK_NODE="/usr/local/bin/node"' >> /emsdk_portable/emsdk_set_env.sh

ENV NODE_JS /usr/local/bin/node

WORKDIR /essentia/