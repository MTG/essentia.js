# -*- coding: utf-8 -*-
"""
A simple python script for generating essentia.js cpp source files and typescript wrappr from the essentia library documentation using its python bindings.
Designed to use along with the cog python library (https://nedbatchelder.com/code/cog/).
"""
import essentia.standard as estd
import argparse
import logging
from ast import literal_eval
from configure_bindings import TO_INCLUDE_ALGOS, TO_EXCLUDE_ALGOS

logging.basicConfig(level='INFO')

# prefix that we add to the input and output variable names of essentia algorithms to avoid compilation erros
INPUT_PREFIX_ES = "input_"
OUTPUT_PREFIX_ES = "output_"

# By default we return a JS object for every essentia algorithm bindings 
# using emscripten::val class (https://emscripten.org/docs/api_reference/val.h.html)
FUNC_RETURN_TYPE = "val"

# namespace where EssentiaJS class methods are exposed in the typescript wrapper
JS_ALGORITHMS_RETURN_NAMESPACE = "this.algorithms"

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
				return "const %s %s=std::vector<float>%s" % (map_types_to_cpp(param_dict['type']), 
															param_dict['name'], value)
			elif target == 'algorithm':
				return "const %s %s" % (map_types_to_cpp(param_dict['type']), param_dict['name'])
		else:
			if target == 'header':
				return "const %s %s=std::vector<float>()" % (map_types_to_cpp(param_dict['type']), 
															param_dict['name'])
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
	output_var_names = list()
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
				parameters.append('const %s& %s="%s"' % (map_types_to_cpp(params['type']), 
														params['name'], 
														params['default']))
			elif target == "algorithm":
				parameters.append('const %s& %s' % (map_types_to_cpp(params['type']), 
													params['name']))
		elif params['type'] == 'vector_real':		
			parameters.append(map_vector_params_to_cpp(params, target=target))
		else:
			if target == 'header':
				parameters.append("const %s %s=%s" % (map_types_to_cpp(params['type']), 
													params['name'], 
													params['default']))
			elif target == 'algorithm':
				parameters.append("const %s %s" % (map_types_to_cpp(params['type']), 
												params['name']))

		param_dict['params'].append('"%s", %s' % (params['name'], params['name']))

	# parse outputs
	# if the algorithm has multiple outputs we construct a void function, otherwise return it's return type
	if (len(doc_dict['outputs']) != 1):
		func_return_type = "void"
		if len(doc_dict['outputs']) > 0:
			for out in doc_dict['outputs']:
				output_var = "%s %s%s" % (map_types_to_cpp(out['type']), 
										OUTPUT_PREFIX_ES, 
										out['name'])
				
				outputs.append(output_var)
				output_var_names.append("%s%s" % (OUTPUT_PREFIX_ES, out['name']))
				output_dict['outputs'].append('  %s->output("%s").set(%s%s);' % (algo_obj, 
																			out['name'], 
																			OUTPUT_PREFIX_ES, 
																			out['name']))
	else:
		func_return_type = map_types_to_cpp(doc_dict['outputs'][0]['type']).replace('&', '')
		for out in doc_dict['outputs']:
			output_var = "%s %s%s" % (map_types_to_cpp(out['type']), OUTPUT_PREFIX_ES, out['name'])
			outputs.append(output_var)
			output_var_names.append("%s%s" % (OUTPUT_PREFIX_ES, out['name']))
			output_dict['outputs'].append('  %s->output("%s").set(%s%s);' % (algo_obj, 
																			out['name'], 
																			OUTPUT_PREFIX_ES, 
																			out['name']))
		
	# Default function declaration string
	func_str = "%s %s(%s, %s)" % (FUNC_RETURN_TYPE, 
								algorithm_name, 
								', '.join(inputs),  
								', '.join(parameters))

	# Update the func_str if either inputs or parameters 
	# are not specified for a particular algorithms

	if not inputs:

		func_str = "%s %s(%s)" % (FUNC_RETURN_TYPE, 
								algorithm_name,  
								', '.join(parameters))

		if not parameters and not outputs:
			raise IOError("No inputs, outputs or parameters found for the algorithm - '%s'" 
							% algorithm_name)
	
	if not parameters:

		func_str = "%s %s(%s)" % (FUNC_RETURN_TYPE, 
								algorithm_name, 
								', '.join(inputs))

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
		

		algorithm.append("%s %s::%s%s {" % (FUNC_RETURN_TYPE, 
											class_name, 
											algorithm_name, 
											func_str.split(arg_parse_str)[1]))

			
		algorithm.append("  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();")

		if param_dict['params']:
			algorithm.append('  Algorithm* %s = factory.create("%s", %s);' % (algo_obj, 
																	algorithm_name, 
																	', '.join(param_dict['params'])))
		else:
			algorithm.append('  Algorithm* %s = factory.create("%s");' % (algo_obj, algorithm_name))

		# set inputs to the algorithm
		for inp in doc_dict['inputs']:
			inp_str = '  %s->input("%s").set(%s%s);' % (algo_obj, inp['name'], 
													INPUT_PREFIX_ES, 
													inp['name'])
			algorithm.append(inp_str)

		for out in outputs:
			algorithm.append("  %s;" % out.replace('&', ''))

		# set outputs to the algorithm
		if output_dict['outputs']:
			for out in output_dict['outputs']:
				algorithm.append(out)
		else:
			raise IOError("No output variable found in the algo '%s'" % algorithm_name)

		algorithm.append("  %s->compute();" % algo_obj)

		algorithm.append("  val output%s(val::object());" % algorithm_name)

		for out_var in output_var_names:
			algorithm.append('  output%s.set("%s", %s);' % (algorithm_name,
														out_var.replace(OUTPUT_PREFIX_ES, ''),
														out_var))

		algorithm.append("  delete %s;" % algo_obj)	
		algorithm.append("  return output%s;" % algorithm_name)	
		algorithm.append("}")
		return algorithm

	else:
		raise IOError("Given target=%s is not valid. 'target' should be either 'header' or 'algorithm'." 
																							% target)


def generate_headers(algorithms=TO_INCLUDE_ALGOS):
	"""Generate a list of string where each of this string corresponds to the function declaration 
	of each essentia algorithm in the target header file."""
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


def map_types_to_js(es_type):
	if es_type in ['vector_real', 
					'vector_complex', 
					'matrix_real', 
					'vector_string']:
		return "any[]"
	elif es_type in ['vector_vector_real', 'vector_vector_complex', 'vector_stereosample']:
		return "VectorVectorFloat"
	elif es_type == 'string':
		return "string"
	elif es_type in ['integer', 'real']:
		return "number"
	elif es_type == 'bool':
		return "boolean"
	else:
		raise NotImplementedError("Cannot find the correspoding type for '%s'" % es_type)


def parse_to_typescript(algorithm_name):
	inputs = list()
	parameters = list()
	param_converted = list()
	return_inputs = list()
	return_parameters = list()	
	comments = list()
	algorithm = list()
	# create the algorithm object
	algo = getattr(estd, algorithm_name)()
	doc_dict = algo.getStruct()

	doc_link = " Check https://essentia.upf.edu/reference/std_%s.html for more details." % algorithm_name
	# We do a shim of algorithm description for prettifying the doc
	algo_description = doc_dict['description'].split('\n\n')[0] + doc_link
	# add jsdoc string
	comments.append("/**")
	comments.append("* %s" % algo_description)
	comments.append("* @method")

	param_prefix = "* @param"
	return_prefix = "* @returns"

	# parse input variables
	for inp in doc_dict['inputs']:

		if inp['type'] in ['vector_real', 
						'vector_complex', 
						'matrix_real', 
						'vector_string',
						'vector_vector_real', 
						'vector_vector_complex', 
						'vector_stereosample']:

			inputs.append("%s: any" % inp['name'])	

			if inp['type'] in ['vector_real', 'vector_complex', 'matrix_real']:
				comments.append("%s {VectorFloat} %s %s" % (param_prefix,
												inp['name'],
												inp['description']))
			
			elif inp['type'] == "vector_string":
				comments.append("%s {VectorString} %s %s" % (param_prefix,
															inp['name'],
															inp['description']))

			else:
				comments.append("%s {VectorVectorFloat} %s %s" % (param_prefix,
																inp['name'],
																inp['description']))		
		else:
			inputs.append("%s: %s" % (inp['name'], map_types_to_js(inp['type'])))

			comments.append("%s {%s} %s %s" % (param_prefix,
												map_types_to_js(inp['type']),
												inp['name'],
												inp['description']))

		return_inputs.append(inp['name'])
		
	# parse parameter variables
	for param in doc_dict['parameters']:

		comments.append("%s {%s} [%s=%s] %s" % (param_prefix, 
												map_types_to_js(param['type']), 
												param['name'], 
												param['default'],
												param['description']))

		if param['type'] in ['vector_real', 'vector_complex', 'matrix_real']:
			param_converted.append("  let vec%s = new this.module.VectorFloat();" % param['name'])
			param_converted.append("  for (var i=0; i<vec%s.size(); i++) {" %  param['name'])
			param_converted.append("    vec%s.push_back(%s[i]);" % (param['name'], param['name']))
			param_converted.append("  }")

			parameters.append("%s: %s=%s" % (param['name'],
											map_types_to_js(param['type']),
											param['default']))

			return_parameters.append("vec%s" % param['name'])

		elif param['type'] in ['vector_string']:
			param_converted.append("  let vec%s = new this.module.VectorString();" % param['name'])
			param_converted.append("  for (var i=0; i<vec%s.size(); i++) {" % param['name'])
			param_converted.append("    vec%s.push_back(%s[i]);" % param['name'])
			param_converted.append("  }")

			parameters.append("%s: %s=%s" % (param['name'],
											map_types_to_js(param['type']),
											param['default']))

			return_parameters.append("vec%s" % param['name'])

		elif param['type'] == 'string':
			parameters.append("%s: %s='%s'" % (param['name'],
											map_types_to_js(param['type']),
											param['default']))

			return_parameters.append(param['name'])
		else:
			parameters.append("%s: %s=%s" % (param['name'],
											map_types_to_js(param['type']),
											param['default']))

			return_parameters.append(param['name'])
	
	# parse output variables
	outs = list()
	for out in doc_dict['outputs']:
		outs.append("%s: '%s'" % (out['name'], out['description']))
	comments.append("%s {object} {%s}" % (return_prefix, ', '.join(outs)))

	comments.append("* @memberof Essentia")
	comments.append("*/")

	if inputs and parameters:
		func_definition = "%s(%s, %s)" % (algorithm_name, ', '.join(inputs), ', '.join(parameters))
		return_definition = "return %s.%s(%s, %s);" % (JS_ALGORITHMS_RETURN_NAMESPACE, 
													algorithm_name, 
													', '.join(return_inputs), 
													', '.join(return_parameters))
	elif inputs:
		func_definition = "%s(%s)" % (algorithm_name, ', '.join(inputs))
		return_definition = "return %s.%s(%s);" % (JS_ALGORITHMS_RETURN_NAMESPACE, 
												algorithm_name, 
												', '.join(return_inputs))
	else:
		func_definition = "%s(%s)" % (algorithm_name, ', '.join(parameters))
		return_definition = "return %s.%s(%s);" % (JS_ALGORITHMS_RETURN_NAMESPACE, 
												algorithm_name, 
												', '.join(return_parameters))

	algorithm.extend(comments)
	algorithm.append("%s {" % func_definition)

	if param_converted:
		algorithm.extend(param_converted)

	algorithm.append("  %s" % return_definition)  
	algorithm.append("}")
	return algorithm


def generate_typescript_wrapper(algorithms=TO_INCLUDE_ALGOS):
	algos = list()
	logging.info("Generating typescript wrapper ...")
	for algo_name in algorithms:
		algos.append(parse_to_typescript(algo_name))
	logging.info("Finished generating typescript wrapper for %s essentia algorithms" % len(algorithms))
	return algos
