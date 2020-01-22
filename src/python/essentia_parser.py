# -*- coding: utf-8 -*-
import essentia.standard as estd

# essentia algorithms that are excluded by default while building essentia.js bindings
TO_EXCLUDE_ALGOS = ['MonoLoader', 'AudioLoader', 'EasyLoader', 'ChromaPrint', 
					'Extractor', 'PCA', 'PoolAggregator', 'Viterbi', 'YamlInput',
					'YamlOutput', ]

# Here we include essentia algorithms that need the corresponding js bindings
TO_INCLUDE_ALGOS = [al for al in estd.algorithmNames() if al not in TO_EXCLUDE_ALGOS]

print("Excluding the following algoirithms while generating bindings ...")
print(TO_EXCLUDE_ALGOS)

def map_types_to_cpp(es_type):
	if es_type in ['vector_real', 'vector_complex', 'matrix_real']:
		return "std::vector<Real>&"

	elif es_type in ['vector_vector_real', 'vector_vector_complex', 'vector_stereosample']:
		return "std::vector<std::vector<Real> >&"

	elif es_type == 'vector_string':
		return "std::vector<std::string>"
		
	elif es_type == 'string':
		return "std::string"

	elif es_type == 'integer':
		return "int"

	elif es_type == 'real':
		return "Real"

	elif es_type in ['bool']:
		return es_type

	else:
		raise NotImplementedError("Cannot find the correspoding type for '%s'" % es_type)


def parse_algorithm_info(algorithm_name, target="header"):
	"""parse algorithm info"""
	inputs = list()
	outputs = list()
	parameters = list()

	algo = getattr(estd, algorithm_name)()
	doc_dict = algo.getStruct()

	for idx, inp in enumerate(doc_dict['inputs']):
		input_var = "%s input%s" % (map_types_to_cpp(inp['type']), idx)
		inputs.append(input_var)

	# for out in doc_dict['outputs']:
	# 	map_types_to_cpp(out['outputs'])

	for params in doc_dict['parameters']:
		parameters.append("%s %s" % (map_types_to_cpp(params['type']), params['name']))

	# if the algorithm has multiple outputs we construct a void function, otherwise return it's return type
	if (len(doc_dict['outputs']) != 1):
		func_return_type = "void"
	else:
		func_return_type = map_types_to_cpp(doc_dict['outputs'][0]['type'])

	if target == "header":
		inputs = ', '.join(inputs)
		parameters = ', '.join(parameters)
		func_str = "%s %s(%s, %s);" % (func_return_type, algorithm_name, inputs, parameters)
		return func_str
	
	elif target == "algorithm":
		# TODO
		pass

	else:
		raise IOError("Given target=%s is not valid. 'target' should be either 'header' or 'algorithm'." % target)


# TO_INCLUDE_ALGOS = ['HPCP', 'Spectrum', 'Key']

def generate_headers():
	funcs = list()
	print("Total %s algorithms" % len(TO_INCLUDE_ALGOS))
	for algo_name in TO_INCLUDE_ALGOS:
		print(algo_name)
		funcs.append(parse_algorithm_info(algo_name, target="header"))
	return funcs

def generate_algorithms():
	"""TODO"""
	return
