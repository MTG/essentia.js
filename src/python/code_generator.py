# -*- coding: utf-8 -*-
"""
A simple python script for generating essentia.js cpp source files and typescript wrapper from the essentia library upstream documentation using its python bindings.
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
logging.info(f"Excluding the following {len(TO_EXCLUDE_ALGOS)} algorithms while generating bindings ...")
logging.info(TO_EXCLUDE_ALGOS)

def map_types_to_cpp(es_type):
	if es_type == 'vector_real':
		return "std::vector<float>&"
	elif es_type == 'vector_vector_real':
		return "std::vector<std::vector<float> >&"
	elif es_type == 'vector_string':
		return "std::vector<std::string>"
	elif es_type == 'string':
		return "std::string"
	elif es_type == 'integer':
		return "int"
	elif es_type == 'real':
		return "float"
	elif es_type == 'bool':
		return es_type
	# TODO: implement coressponding JS supported types for the following types
	# elif es_type == "vector_complex":
	# 	return "std::complex<float>&"
	# elif es_type == 'vector_stereosample':
	# 	return ""
	# elif es_type == 'matrix_real':
	# 	return ""
	else:
		raise NotImplementedError(f"Cannot find the correspoding type for '{es_type}'")


def map_vector_params_to_cpp(param_dict, target):
	if param_dict['type'] == 'vector_real':
		if param_dict['default'] != '[]':
			if target == 'header':
				value = param_dict['default'].replace('[', '{').replace(']', '}')
				return f"const {map_types_to_cpp(param_dict['type'])} {param_dict['name']}=std::vector<float>{value}"
			elif target == 'algorithm':
				return f"const {map_types_to_cpp(param_dict['type'])} {param_dict['name']}"
		else:
			if target == 'header':
				return f"const {map_types_to_cpp(param_dict['type'])} {param_dict['name']}=std::vector<float>()"
			elif target == 'algorithm':
				return f"const {map_types_to_cpp(param_dict['type'])} {param_dict['name']}"
	else:
		raise NotImplementedError(f"Couldn't parse param type for {param_dict}")
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
	param_var_names = list()
	param_type_list = list()
	# create the algorithm object
	algo = getattr(estd, algorithm_name)()
	doc_dict = algo.getStruct()
	algo_obj = f"_{algorithm_name.lower()}"

	# parse inputs
	for inp in doc_dict['inputs']:
		input_var = f"{map_types_to_cpp(inp['type'])} {INPUT_PREFIX_ES}{inp['name']}"
		inputs.append(input_var)

	# parse parameters
	for param in doc_dict['parameters']:
		param_type = map_types_to_cpp(param['type'])
		param_type_list.append(param_type)
		if target == "binding": 
			continue
		if param['type'] == 'string':
			if target == 'header':
				parameters.append(f'const {param_type}& {param["name"]}="{param["default"]}"')
			elif target == "algorithm":
				parameters.append(f'const {param_type}& {param["name"]}')
		elif param['type'] == 'vector_real':		
			parameters.append(map_vector_params_to_cpp(param, target=target))
		else:
			if target == 'header':
				parameters.append(f"const {param_type} {param['name']}={param['default']}")
			elif target == 'algorithm':
				parameters.append(f"const {param_type} {param['name']}")

		param_dict['params'].append(f'"{param["name"]}", {param["name"]}')
		param_var_names.append(param['name'])

	# parse outputs
	# if the algorithm has multiple outputs we construct a void function, otherwise return it's return type

	if len(doc_dict['outputs']) > 0:
		for out in doc_dict['outputs']:
			output_name = out['name']
			output_var_name = f"{OUTPUT_PREFIX_ES}{output_name}"
			output_var_type_declaration = f"{map_types_to_cpp(out['type'])} {output_var_name}"
			outputs.append(output_var_type_declaration)
			output_var_names.append(output_var_name)
			output_set_str = f'\t{algo_obj}->output("{output_name}").set({OUTPUT_PREFIX_ES}{output_name});'
			output_dict['outputs'].append(output_set_str)
		
	# Default class declaration string
	class_str = f"""
class {algorithm_name} {{
	public:
		{algorithm_name}({', '.join(parameters)});
		~{algorithm_name}();
		void configure({', '.join(parameters)});
		{FUNC_RETURN_TYPE} compute({', '.join(inputs)});
		void reset();
	private:
		Algorithm* {algo_obj};
}};"""

	# Update the class_str if either inputs or parameters 
	# are not specified for a particular algorithms

	if not inputs and not parameters and not outputs:
		raise IOError(f"No inputs, outputs or parameters found for the algorithm - '{algorithm_name}'")

	# return class declaration string if target is for header file
	if target == "header":
		return class_str
	
	# otherwise construct the algorithm method 
	elif target == "algorithm":		
		algorithm = list()

		# add comment to the links of documentation
		algorithm.append(f"\n// START {algorithm_name} definitions")
		algorithm.append(f"// check https://essentia.upf.edu/reference/std_{algorithm_name}.html")
		
		def close_def_body():
			algorithm.append("}")

		# append algo constructor
		algorithm.append(f"{algorithm_name}::{algorithm_name}({', '.join(parameters)}) {{")
		algorithm.append(f"\tconfigure({', '.join(param_var_names)});")
		close_def_body()

		# append algo destructor
		algorithm.append(f"{algorithm_name}::~{algorithm_name}() {{")
		algorithm.append(f"\tdelete {algo_obj};")
		close_def_body()

		# append algo configure: factory instance, algo create
		algorithm.append(f"void {algorithm_name}::configure({', '.join(parameters)}) {{")
		algorithm.append("\tAlgorithmFactory& factory = standard::AlgorithmFactory::instance();")
		if param_dict['params']:
			algorithm.append(f'\t{algo_obj} = factory.create("{algorithm_name}", {", ".join(param_dict["params"])});')
		else:
			algorithm.append(f'\t{algo_obj} = factory.create("{algorithm_name}");')
		close_def_body()

		# append algo compute:
		algorithm.append(f"{FUNC_RETURN_TYPE} {algorithm_name}::compute({', '.join(inputs)}) {{")
		# set inputs to the algorithm
		for input in doc_dict['inputs']:
			input_name = input['name']
			input_str = f'\t{algo_obj}->input("{input_name}").set({INPUT_PREFIX_ES}{input_name});'
			algorithm.append(input_str)

		# declare output containers
		for out in outputs:
			algorithm.append(f"\t{out.replace('&', '')};")
		# set outputs to the algorithm
		if output_dict['outputs']:
			for out in output_dict['outputs']:
				algorithm.append(out)
		else:
			raise IOError(f"No output variable found in the algo '{algorithm_name}'")
		# call compute
		algorithm.append(f"\t{algo_obj}->compute();")
		# declare output val object
		algorithm.append(f"\t{FUNC_RETURN_TYPE} output{algorithm_name}(val::object());")
		# set its values
		for out_var in output_var_names:
			output_name = out_var.replace(OUTPUT_PREFIX_ES, '')
			algorithm.append(f'\toutput{algorithm_name}.set("{output_name}", {out_var});')
		# return
		algorithm.append(f"\treturn output{algorithm_name};")	
		close_def_body()

		# append algo reset:
		algorithm.append(f"void {algorithm_name}::reset() {{")
		algorithm.append(f"{algo_obj}->reset();")
		close_def_body()
		algorithm.append(f"// END {algorithm_name} definitions")

		return algorithm

	elif target == "binding":
		binding_str = f"""
class_<{algorithm_name}>("{algorithm_name}")
	.constructor<{', '.join(param_type_list)}>()
	.function("configure", &{algorithm_name}::configure)
	.function("compute", &{algorithm_name}::compute)
	.function("reset", &{algorithm_name}::reset)
	;"""
		return binding_str
	
	else:
		raise IOError(f"Given target={target} is not valid. 'target' should be either 'header' or 'algorithm'.")


def generate_headers(algorithms=TO_INCLUDE_ALGOS):
	"""Generate a list of string where each of this string corresponds to the class declaration 
	of each essentia algorithm in the target header file."""
	classes = list()
	# we have bindings for 3 more extra algorithms with custom wrappers (MonoMixer, FrameCutter and LoudnessEBUR128) beside autogenerated ones.
	logging.info(f"Total {len(TO_INCLUDE_ALGOS) + 3} algorithms")
	logging.info("Generating essentiajs.h file ...")
	for algo_name in algorithms:
		logging.info(algo_name)
		classes.append(parse_algorithm_info(algo_name, target="header"))
	return classes


def generate_algorithms(algorithms=TO_INCLUDE_ALGOS):
	"""Generate a list of string where each of this string corresponds to a line of code 
	for the corresponding essentia algorithm."""
	algos = list()
	logging.info("Generating essentiajs.cpp file ...")
	for algo_name in algorithms:
		logging.info(algo_name)
		algos.append(parse_algorithm_info(algo_name, target="algorithm"))
	# we have bindings for 3 more extra algorithms with custom wrappers (MonoMixer, FrameCutter and LoudnessEBUR128) beside autogenerated ones.
	logging.info(f"Finished generating cpp source code for {len(algorithms) + 3} essentia algorithms")
	return algos

def generate_bindings(algorithms=TO_INCLUDE_ALGOS):
	logging.info("Generating emscripten bindings for the essentia...")
	bindings = list()
	for algo_name in algorithms:
		bindings.append(parse_algorithm_info(algo_name, target="binding"))
	return bindings

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
		raise NotImplementedError(f"Cannot find the correspoding type for '{es_type}'")


def parse_to_typescript(algorithm_name):
	inputs = list()
	parameters = list()
	param_converted = list()
	untyped_inputs = list()
	untyped_parameters = list()	
	comments = list()
	algorithm = list()
	# create the algorithm object
	algo = getattr(estd, algorithm_name)()
	doc_dict = algo.getStruct()

	wasmBackendVar = "wasmBackend"
	doc_link = f" Check https://essentia.upf.edu/reference/std_{algorithm_name}.html for more details."
	# We do a shim of algorithm description for prettifying the doc
	algo_description = doc_dict['description'].split('\n\n')[0] + doc_link
	# add jsdoc string
	comments.append("/**")
	comments.append(f"* {algo_description}")
	comments.append("* @class")

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

			inputs.append(f"{inp['name']}: any")	

			if inp['type'] in ['vector_real', 'vector_complex', 'matrix_real']:
				comment_input_type = "{VectorFloat}"
			
			elif inp['type'] == "vector_string":
				comment_input_type = "{VectorString}"
			else:
				comment_input_type = "{VectorVectorFloat}"

		else:
			inputs.append(f"{inp['name']}: {map_types_to_js(inp['type'])}")
			comment_input_type = f"{{{map_types_to_js(inp['type'])}}}"

		comments.append(f"{param_prefix} {comment_input_type} {inp['name']} {inp['description']}")
		untyped_inputs.append(inp['name'])
		
	# parse parameter variables
	for param in doc_dict['parameters']:

		comments.append(f"{param_prefix} {{{map_types_to_js(param['type'])}}} [{param['name']}={param['default']}] {param['description']}")
		vec_param_var = f"vec{param['name']}"
		param_default_val = param['default']
		param_var_name = param['name']
		if param['type'] in ['vector_real', 'vector_complex', 'matrix_real']:
			param_converted.append(f"    let {vec_param_var} = new {wasmBackendVar}.VectorFloat();")
			param_converted.append(f"    for (var i=0; i<{vec_param_var}.size(); i++) {{")
			param_converted.append(f"      {vec_param_var}.push_back({param['name']}[i]);")
			param_converted.append("    }")

			param_var_name = vec_param_var

		# NOTE: there are no algos in INCLUDED_ALGOS with vector_string typed params
		elif param['type'] in ['vector_string']:
			param_converted.append(f"    let {vec_param_var} = new {wasmBackendVar}.VectorString();")
			param_converted.append(f"    for (var i=0; i<{vec_param_var}.size(); i++) {{")
			param_converted.append(f"      {vec_param_var}.push_back({param['name']}[i]);")
			param_converted.append("    }")

			param_var_name = vec_param_var

		elif param['type'] == 'string':
			param_default_val = f"'{param['default']}'"
		
		parameters.append(f"{param['name']}: {map_types_to_js(param['type'])}={param_default_val}")
		untyped_parameters.append(param_var_name)
	
	# parse output variables
	outs = list()
	for out in doc_dict['outputs']:
		outs.append(f"{out['name']}: '{out['description']}'")
	comments.append(f"{return_prefix} {{object}} {{{', '.join(outs)}}}")

	comments.append("* @memberof Essentia")
	comments.append("*/")

	# Add the comments to the algorithm list
	algorithm.extend(comments)

	# Generate the class definition
	class_definition = f"class {algorithm_name} {{"
	algorithm.append(class_definition)
	algorithm.append("  private algoInstance: any;")

	config_param_list = ', '.join(untyped_parameters)
	# Add the constructor
	constructor_args = ', '.join(parameters)
	algorithm.append(f"  constructor({constructor_args}) {{")
	if param_converted:
		algorithm.extend(param_converted)
	algorithm.append(f"    this.algoInstance = new wasmBackend.{algorithm_name}({config_param_list});")
	algorithm.append("  }")

	# Add configure method
	algorithm.append(f"  configure({constructor_args}) {{")		
	if param_converted:
		algorithm.extend(param_converted)
	algorithm.append(f"    this.algoInstance.configure({config_param_list});")
	algorithm.append("  }")

	# Add the compute method
	compute_args = ', '.join(inputs)
	algorithm.append(f"  compute({compute_args}) {{")
	algorithm.append(f"    return this.algoInstance.compute({', '.join(untyped_inputs)});")
	algorithm.append("  }")

	# Close the class definition
	algorithm.append("}")


	return algorithm


def generate_typescript_wrapper(algorithms=TO_INCLUDE_ALGOS):
	algos = list()
	logging.info("Generating typescript wrapper ...")
	for algo_name in algorithms:
		algos.append(parse_to_typescript(algo_name))
	# we have bindings for 3 more extra algorithms (MonoMixer, FrameCutter and LoudnessEBUR128) beside autogenerated ones.
	logging.info(f"Finished generating typescript wrapper for {len(algorithms) + 3} essentia algorithms")
	return algos

def check_type_param_algos(check_type):
	count = 0
	for algo_name in TO_INCLUDE_ALGOS:
		count+=1
		algo = getattr(estd, algo_name)()
		doc_dict = algo.getStruct()
		vector_string_params = [p['name'] for p in doc_dict['parameters'] if p['type'] in [check_type]]
		if len(vector_string_params) > 0:
			print(f'{algo_name} has {check_type} params: {vector_string_params}')
