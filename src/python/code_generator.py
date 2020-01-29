# -*- coding: utf-8 -*-
"""
A simple ugly python script for generating essentia.js cpp source files from the essentia library documentation using python bindings.
Designed to use along with the cog python library (https://nedbatchelder.com/code/cog/).
"""
import essentia.standard as estd
import subprocess
import argparse
import logging

logging.basicConfig(level='INFO')

# essentia algorithms that are excluded by default while building essentia.js bindings (due to FFTW dependency or filesystem access etc)
TO_EXCLUDE_ALGOS = ['MonoLoader', 'AudioLoader', 'EasyLoader', 'ChromaPrint', 'Extractor', 'PCA', 'PoolAggregator', 
					'Viterbi', 'YamlInput', 'YamlOutput', 'FreesoundExtractor', 'MetadataReader', 'MusicExtractor',
					'AudioWriter', 'MonoWriter', 'MonoMixer', 'SilenceRate', 'EqloudLoader', 'IFFTWComplex', 
					'FFTAComplex', 'Resample', 'YamlOutput', 'MusicExtractorSVM', 'IFFTAComplex', 'TensorflowPredict', 
					'TensorflowPredictMusiCNN', 'GaiaTransform', 'TensorflowPredictVGGish', 'YamlInput', 'IFFTW', 'FFTW', 
					'IFFTA', 'MetadataReader', 'FFTA', 'FFTWComplex']

# excluding these algos since the current essentia AlgorithmFactory instances has a limitation on number of parameters (16) that can configure at algorithm creation.
# NOTE: these algos should be included once the cpp macros has added in the main essentia repository.
TO_EXCLUDE_ALGOS.extend(['MultiPitchKlapuri', 'MultiPitchMelodia', 'PitchMelodia', 'PredominantPitchMelodia'])

# Here we only include essentia algorithms that need in the corresponding js bindings
TO_INCLUDE_ALGOS = [al for al in estd.algorithmNames() if al not in TO_EXCLUDE_ALGOS]

# prefix that we add to the input and output variable names of essentia algorithms to avoid compilation erros
INPUT_PREFIX_ES = "input_"
OUTPUT_PREFIX_ES = "output_"

logging.info("Generating essentia.js cpp source code and binding files ....")
logging.info("Excluding the following %s algorithms while generating bindings ..." % len(TO_EXCLUDE_ALGOS))
logging.info(TO_EXCLUDE_ALGOS)


def map_types_to_cpp(es_type):
	if es_type in ['vector_real', 'vector_complex', 'matrix_real']:
		return "std::vector<float>&"
	elif es_type in ['vector_vector_real', 'vector_vector_complex', 'vector_stereosample']:
		return "std::vector<std::vector<float> >&"
	elif es_type == 'vector_string':
		return "std::vector<std::string>"
	elif es_type == 'string':
		return "std::string"
	elif es_type == 'integer':
		return "int"
	elif es_type == 'real':
		return "float"
	elif es_type in ['bool']:
		return es_type
	else:
		raise NotImplementedError("Cannot find the correspoding type for '%s'" % es_type)


def map_vector_params_to_cpp(param_dict, target):
	if param_dict['type'] == 'vector_real':
		if param_dict['default'] != '[]':
			if target == 'header':
				value = param_dict['default'].replace('[', '{').replace(']', '}')
				return "const %s %s=std::vector<float>%s" % (map_types_to_cpp(param_dict['type']), param_dict['name'], value)
			elif target == 'algorithm':
				return "const %s %s" % (map_types_to_cpp(param_dict['type']), param_dict['name'])
		else:
			if target == 'header':
				return "const %s %s=std::vector<float>()" % (map_types_to_cpp(param_dict['type']), param_dict['name'])
			elif target == 'algorithm':
				return "const %s %s" % (map_types_to_cpp(param_dict['type']), param_dict['name'])
	else:
		raise NotImplementedError("Couldn't parse param type for %s" % param_dict)
	return 


def parse_algorithm_info(algorithm_name, target="header"):
	"""Parse algorithm info and generate target cpp code for essentia algorithms"""
	inputs = list()
	outputs = list()
	parameters = list()
	output_dict = dict()
	param_dict = dict()
	output_dict['outputs'] = []
	param_dict['params'] = []
	# create the algorithm object
	algo = getattr(estd, algorithm_name)()
	doc_dict = algo.getStruct()
	algo_obj = "algo%s" % algorithm_name

	# parse inputs
	for inp in doc_dict['inputs']:
		input_var = "%s %s%s" % (map_types_to_cpp(inp['type']), INPUT_PREFIX_ES, inp['name'])
		inputs.append(input_var)

	# parse parameters
	for params in doc_dict['parameters']:
		if params['type'] == 'string':
			if target == 'header':
				parameters.append('const %s& %s="%s"' % (map_types_to_cpp(params['type']), params['name'], params['default']))
			elif target == "algorithm":
				parameters.append('const %s& %s' % (map_types_to_cpp(params['type']), params['name']))
		elif params['type'] == 'vector_real':		
			parameters.append(map_vector_params_to_cpp(params, target=target))
		else:
			if target == 'header':
				parameters.append("const %s %s=%s" % (map_types_to_cpp(params['type']), params['name'], params['default']))
			elif target == 'algorithm':
				parameters.append("const %s %s" % (map_types_to_cpp(params['type']), params['name']))

		param_dict['params'].append('"%s", %s' % (params['name'], params['name']))

	# parse outputs
	# if the algorithm has multiple outputs we construct a void function, otherwise return it's return type
	if (len(doc_dict['outputs']) != 1):
		func_return_type = "void"
		if len(doc_dict['outputs']) > 0:
			for out in doc_dict['outputs']:
				output_var = "%s %s%s" % (map_types_to_cpp(out['type']), OUTPUT_PREFIX_ES, out['name'])
				outputs.append(output_var)
				output_dict['outputs'].append('  %s->output("%s").set(%s%s);' % (algo_obj, out['name'], OUTPUT_PREFIX_ES, out['name']))
	else:
		func_return_type = map_types_to_cpp(doc_dict['outputs'][0]['type']).replace('&', '')
		for out in doc_dict['outputs']:
			output_var = "%s %s%s" % (map_types_to_cpp(out['type']), OUTPUT_PREFIX_ES, out['name'])
			outputs.append(output_var)
			output_dict['outputs'].append('  %s->output("%s").set(%s%s);' % (algo_obj, out['name'], OUTPUT_PREFIX_ES, out['name']))
		
	# create function declaration string
	if func_return_type != 'void':
		func_str = "%s %s(%s, %s)" % (func_return_type, 
										algorithm_name, 
										', '.join(inputs),  
										', '.join(parameters))
	else:
		func_str = "%s %s(%s, %s, %s)" % (func_return_type, 
											algorithm_name, 
											', '.join(inputs), 
											', '.join(outputs), 
											', '.join(parameters))

	if not inputs:
		if func_return_type != 'void':
			func_str = "%s %s(%s)" % (func_return_type, algorithm_name,  
										', '.join(parameters))
		else:
			func_str = "%s %s(%s, %s)" % (func_return_type, algorithm_name, 
											', '.join(outputs), 
											', '.join(parameters))

		if not inputs and not outputs:
			func_str = "%s %s(%s)" % (func_return_type, 
									algorithm_name, 
									', '.join(parameters))

		if not inputs and not parameters:
			if func_return_type == 'void':
				func_str = "%s %s(%s)" % (func_return_type, 
											algorithm_name, 
											', '.join(outputs))
			else:
				raise IOError("No inputs, outputs or parameters found for the algorithm - '%s'" % algorithm_name)

	if not outputs:
		func_str = "%s %s(%s, %s)" % (func_return_type, 
										algorithm_name, 
										', '.join(inputs), 
										', '.join(parameters))

		if not outputs and not parameters:
			func_str = "%s %s(%s)" % (func_return_type, 
										algorithm_name, 
										', '.join(inputs))
	
	if not parameters:
		if func_return_type != 'void':
			func_str = "%s %s(%s)" % (func_return_type, 
										algorithm_name, 
										', '.join(inputs))
		else:
			func_str = "%s %s(%s, %s)" % (func_return_type, 
											algorithm_name, 
											', '.join(inputs), 
											', '.join(outputs))
	
	# return function declaration string if target is for header file
	if target == "header":
		return func_str
	
	# otherwise construct the algorithm method 
	elif target == "algorithm":		
		algorithm = list()
		class_name = "EssentiaJS"
		# add empty line
		algorithm.append(" ")
		# add comment to the links of documentation
		algorithm.append("// check https://essentia.upf.edu/reference/std_%s.html" % algorithm_name)

		arg_parse_str = " %s" % algorithm_name
		
		if func_return_type != "void":
			algorithm.append("%s %s::%s%s {" % (func_return_type.replace('&', ''), 
												class_name, 
												algorithm_name, 
												func_str.split(arg_parse_str)[1]))
		else:
			algorithm.append("void %s::%s%s {" % (class_name, algorithm_name, func_str.split(arg_parse_str)[1]))
			
		algorithm.append("  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();")

		if param_dict['params']:
			algorithm.append('  Algorithm* %s = factory.create("%s", %s);' % (algo_obj, 
																			algorithm_name, 
																			', '.join(param_dict['params'])))
		else:
			algorithm.append('  Algorithm* %s = factory.create("%s");' % (algo_obj, algorithm_name))

		for inp in doc_dict['inputs']:
			inp_str = '  %s->input("%s").set(%s%s);' % (algo_obj, inp['name'], INPUT_PREFIX_ES, inp['name'])
			algorithm.append(inp_str)

		if func_return_type != 'void':
			for out in outputs:
				algorithm.append("  %s;" % out.replace('&', ''))

		if output_dict['outputs']:
			for out in output_dict['outputs']:
				algorithm.append(out)
		else:
			raise IOError("Not found output variable in the algo '%s'" % algorithm_name)

		algorithm.append("  %s->compute();" % algo_obj)
		algorithm.append("  delete %s;" % algo_obj)

		if func_return_type != "void":
			if len(outputs[0].split(' ')) > 2:
				algorithm.append("  return %s;" % outputs[0].split(' ')[2])
			else:
				algorithm.append("  return %s;" % outputs[0].split(' ')[1])
		
		algorithm.append("}")
		return algorithm

	else:
		raise IOError("Given target=%s is not valid. 'target' should be either 'header' or 'algorithm'." % target)


def generate_headers(algorithms=TO_INCLUDE_ALGOS):
	"""Generate a list of string where each of this string corresponds to the function declaration of 
	each essentia algorithm in the target header file."""
	funcs = list()
	logging.info("Total %s algorithms" % len(TO_INCLUDE_ALGOS))
	logging.info("Generating essentiajs.h file ...")
	for algo_name in algorithms:
		funcs.append(parse_algorithm_info(algo_name, target="header"))
	return funcs


def generate_algorithms(algorithms=TO_INCLUDE_ALGOS):
	"""Generate a list of string where each of this string corresponds to a line of code 
	for the corresponding essentia algorithm."""
	algos = list()
	logging.info("Generating essentiajs.cpp file ...")
	for algo_name in algorithms:
		logging.info(algo_name)
		algos.append(parse_algorithm_info(algo_name, target="algorithm"))
	logging.info("Finished generating cpp source code for %s essentia algorithms" % len(algorithms))
	return algos


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="CLI inferface for the python script to generate essentia.js cpp source code and bindings", 
						formatter_class=argparse.ArgumentDefaultsHelpFormatter)

    parser.add_argument("-i", "--include", action="store",
                        help="list of names of algos to inlude", 
						default=TO_INCLUDE_ALGOS)
    parser.add_argument("-e", "--exclude", action="store",
                        help="list of names of algos to exclude", 
						default=TO_EXCLUDE_ALGOS)
    parser.add_argument("-d", "--target-dir", action="store",
                        help="path to directory where the output")

	# TODO: cli interface
    cmd_args = parser.parse_args()