# -*- coding: utf-8 -*-
import os
import argparse
import essentia.standard as estd

def read_txt_file(txt_file):
    """read a text file and strips \n char from it"""
    f = open(txt_file)
    data = f.readlines()
    return [d.replace('\n', '') for d in data]

def savelist_to_file(path_list, filename):
    doc = open(filename, 'w')
    for item in path_list:
        doc.write("%s\n" % item)
    doc.close()

TO_INCLUDE_ALGOS_TXT_FILE = "included_algos.md"
TO_EXCLUDE_ALGOS_TXT_FILE = "excluded_algos.md"

# essentia algorithms that are excluded by default 
# some of them are excluded because of either third party dependencies or the need file I/O access
# some of them have matrix-real input types which are not supported for the embind wrappers
# see https://github.com/MTG/essentia.js/issues/27
DEFAULT_EXCLUDE_ALGOS = [# requires FFTW, TagLib or Chromaprint dependencies
                        'MonoLoader', 'AudioLoader', 'EasyLoader', 'MonoWriter', 'MonoMixer', 'EqloudLoader', 'AudioWriter',
                        'Chromaprinter', 'Extractor', 'FreesoundExtractor', 'MusicExtractor', 
                        'PCA', 'PoolAggregator', 'YamlInput', 'YamlOutput', 'MetadataReader', 'Viterbi', 'SilenceRate',
                        'FFTW', 'IFFTW', 'IFFTA', 'FFTA', 'FFTWComplex', 'IFFTWComplex', 'FFTAComplex', 'IFFTAComplex',
                        # requires Gaia and Tensorflow dependencies
                        'GaiaTransform', 'MusicExtractorSVM', 
                        'TensorflowPredict', 'TensorflowPredictMusiCNN', 'TensorflowPredictVGGish',
                        # expect tensor_real type
                        'TensorNormalize', 'TensorTranspose',
                        # these algortihms expect a matrix_real input or output types which are not yet supported for the JS bindings 
                        'BpmHistogram', 'FadeDetection', 'HumDetector', 'Onsets', 'Panning', 'SBic', 'SingleGaussian',
                        # these algorithms expect std::complex** type for wither input, parameters or outputs, which are not yet supported for the JS bindings 
                        'CartesianToPolar', 'PolarToCartesian', 'Magnitude', 'ConstantQ', 'NSGConstantQ', 'NSGIConstantQ', 
                        'FFT', 'IFFT', 'FFTC', 'IFFTC', 'HarmonicMask', 'HarmonicModelAnal', 'SineModelAnal', 'SineModelSynth',
                        # expect vector_stereosample type
                        'FalseStereoDetector', 'LoudnessEBUR128', 'StereoDemuxer', 'StereoMuxer', 'StereoTrimmer',
                        ]

# create a default file for exclude algo list file in case there is none
if not os.path.exists(TO_EXCLUDE_ALGOS_TXT_FILE): 
    savelist_to_file(DEFAULT_EXCLUDE_ALGOS, TO_EXCLUDE_ALGOS_TXT_FILE)

# essentia algorithms that are excluded by default while building essentia.js bindings 
# (due to FFTW dependency or need of filesystem access etc) 
TO_EXCLUDE_ALGOS = read_txt_file(TO_EXCLUDE_ALGOS_TXT_FILE)

# By default, we include all the algorithms from essentia except ones that are in exclude algo list
DEFAULT_INCLUDE_ALGOS = [al for al in estd.algorithmNames() if al not in TO_EXCLUDE_ALGOS]
# create a default to include algo list file in case there is none
if not os.path.exists(TO_INCLUDE_ALGOS_TXT_FILE): 
    savelist_to_file(DEFAULT_INCLUDE_ALGOS, TO_INCLUDE_ALGOS_TXT_FILE)

# Here we only include essentia algorithms that need in the corresponding js bindings (default)
TO_INCLUDE_ALGOS = read_txt_file(TO_INCLUDE_ALGOS_TXT_FILE)


if __name__ == '__main__':
    import subprocess
    from ast import literal_eval

    parser = argparse.ArgumentParser(description="CLI inferface for configuring python script to generate \
						essentia.js cpp source code and bindings", 
						formatter_class=argparse.ArgumentDefaultsHelpFormatter)

    parser.add_argument("-i", "--include-algos", action="store",
                        help='Either a text file with list of names of essentia algos to be included (refer included_algos.md file) \
							or a str(list) of names of essentia algos (eg. "["HPCP", "Key"]").')
    parser.add_argument("-e", "--exclude-algos", action="store",
                        help='Either a text file with list of names of essentia algos to be excluded (refer excluded_algos.md file) \
							or a str(list) of names of essentia (eg. "["HPCP", "Key"]").')

    cmd_args = parser.parse_args()

    if cmd_args.include_algos:
        if os.path.exists(cmd_args.include_algos):
            TO_INCLUDE_ALGOS = read_txt_file(str(cmd_args.include_algos))
            savelist_to_file(TO_INCLUDE_ALGOS, TO_INCLUDE_ALGOS_TXT_FILE)
        else:
            TO_INCLUDE_ALGOS = literal_eval(cmd_args.include_algos)
            savelist_to_file(TO_INCLUDE_ALGOS, TO_INCLUDE_ALGOS_TXT_FILE)
    else:
        savelist_to_file(DEFAULT_INCLUDE_ALGOS, TO_INCLUDE_ALGOS_TXT_FILE)

    if cmd_args.exclude_algos:
        # here instead replacing our defaults, we extend it with the defaults
        if os.path.exists(cmd_args.exclude_algos):
            extend_algos = read_txt_file(str(cmd_args.exclude_algos))
            TO_EXCLUDE_ALGOS.extend(extend_algos)
            savelist_to_file(TO_EXCLUDE_ALGOS, TO_EXCLUDE_ALGOS_TXT_FILE)
        else:
            TO_EXCLUDE_ALGOS.extend(literal_eval(cmd_args.exclude_algos))
            savelist_to_file(TO_EXCLUDE_ALGOS, TO_EXCLUDE_ALGOS_TXT_FILE)
    else:
        savelist_to_file(DEFAULT_EXCLUDE_ALGOS, TO_EXCLUDE_ALGOS_TXT_FILE)

    print("Configured essentia algorithm lists...")
    
    # now spawn a subshell to run our code generator
    subprocess.call("cog -d -D version=3.4.1 @cogfiles.txt", shell=True)
    