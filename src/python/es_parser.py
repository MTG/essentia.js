
import essentia.standard as estd

# essentia algorithms that are excluded by default while building essentia.js bindings
# these algos are excluded either because of it's thrid party dependencies or because it needs filesystem access.
TO_EXCLUDE_ALGOS = ['MonoLoader', 'AudioLoader', 'EasyLoader', 'ChromaPrint']

# Here we include essentia algorithms that need the corresponding js bindings
TO_INCLUDE_ALGOS = [al for al in estd.algorithmNames() if al not in TO_EXCLUDE_ALGOS]


def map_types_to_cpp(es_type):
	""""""
	if es_type == 'vector_real':
		return "std::vector<float>"

	elif es_type == 'vector_vector_real':
		return "std::vector<std::vector<float> >"

	elif es_type == 'REAL':
		return "float"

	# types of parameters are not explicitly available from the 'essentia.standard.algorithmInfo'. 
	# Hence we infer it from the param range for the moment.
	else:
		pass


def parse_algo_io_from_doc(doc_dict):
	"""TODO"""
	inputs = list()
	outputs = list()
	parameters = list()

	for inp in doc_dict['inputs']:

		inputs.append( {'name': inp[0], 'type': map_types_to_cpp(inp[1]), 'description': inp[2]} )

	for out in doc_dict['outputs']:

		outputs.append( {'name': out[0], 'type': map_types_to_cpp(out[1]), 'description': out[2]} )

	for params in doc_dict['parameters']:

		parameters.append( {'name': params[0], 
							'type': map_types_to_cpp(params[3]), 
							'description': params[1], 
							'value': params[3]} )


	if len(outputs) > 1:
		func_return_type = "void"

	else:
		func_return_type = outputs[0]['type']




print("Excluding the following algoirithms ....,\n", TO_EXCLUDE_ALGOS)
