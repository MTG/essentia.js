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
		if param_dict['params']:
			algorithm.append(f'\t{algo_obj} = AlgorithmFactory::create("{algorithm_name}", {", ".join(param_dict["params"])});')
		else:
			algorithm.append(f'\t{algo_obj} = AlgorithmFactory::create("{algorithm_name}");')
		close_def_body()

		# append algo destructor
		algorithm.append(f"{algorithm_name}::~{algorithm_name}() {{")
		algorithm.append(f"\tif ({algo_obj}) delete {algo_obj};")
		close_def_body()

		# append algo configure: factory instance, algo create
		algorithm.append(f"void {algorithm_name}::configure({', '.join(parameters)}) {{")
		problem_config_algos = ["PitchMelodia", "PredominantPitchMelodia", "MultiPitchMelodia"]
		# TODO: remove this dirty fix for these 3 algorithms which fail on compile on their many-parameter `configure` method calls
		if param_dict['params'] and algorithm_name in problem_config_algos:
			algorithm.append(f'\tif ({algo_obj}) delete {algo_obj};')
			algorithm.append(f'\t{algo_obj} = AlgorithmFactory::create("{algorithm_name}", {", ".join(param_dict["params"])});')
		elif param_dict['params']:
			algorithm.append(f'\t{algo_obj}->configure({", ".join(param_dict["params"])});')
		else:
			algorithm.append(f"\t{algo_obj}->configure();")
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
	internal_instance_arg_list = list()
	converted_params_check_list = list()
	untyped_inputs = list()
	untyped_parameters = list()
	algorithm_class_body = list()
	# create the algorithm object
	algo = getattr(estd, algorithm_name)()
	doc_dict = algo.getStruct()

	wasm_backend_var = "wasmBackend"

	# 1. PARSE ALGO INFO:
	doc_link = f" Check https://essentia.upf.edu/reference/std_{algorithm_name}.html for more details."
	# We do a shim of algorithm description for prettifying the doc
	algo_description = doc_dict['description'].split('\n\n')[0] + doc_link

	param_jsdocs_prefix = "* @param"
	return_jsdocs_prefix = "* @returns"

	inputs_comments = list()
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

		inputs_comments.append(f"   {param_jsdocs_prefix} {comment_input_type} {inp['name']} {inp['description']}")
		untyped_inputs.append(inp['name'])
	
	algo_param_type = f"paramTypes.Params{algorithm_name}" # access from global param types import
	param_comment = f"   {param_jsdocs_prefix} {{{algo_param_type}}} [params]"
	default_params_object = list()
	default_params_object.append(f"  private readonly defaultParams: {algo_param_type} = {{")


	# parse parameter variables
	# TODO: check if algo has no parameters at all!
	has_params = len(doc_dict['parameters']) > 0
	constructor_configure_param_arg = f"params: {algo_param_type}" if has_params else ""

	for param in doc_dict['parameters']:

		# gather vec params for #updateParams checks
		param_default_val = param['default']
		param_name = param['name']
		if param['type'] in ['vector_real', 'vector_complex', 'matrix_real']:
			# arrayToVector now sits at the same module level as all algorithm classes
			obj_arg_param_access = f"params.{param_name}"
			converted_params_check_list.append(f"    if ({obj_arg_param_access}) {{")
			converted_params_check_list.append(f"      {obj_arg_param_access} = arrayToVector({obj_arg_param_access});")
			converted_params_check_list.append("    }")
			param_default_val = f"arrayToVector({param_default_val})"

		elif param['type'] == 'string':
			param_default_val = f"'{param['default']}'"

		# gather param names and default values for defaultParams declaration at top of class def
		default_params_object.append(f"    {param_name}: {param_default_val},")
		
		# assemble individual params.paramName list to pass to internal algo instance
		internal_instance_arg_list.append(f"this.params.{param_name}")
		untyped_parameters.append(param_name)
	
	default_params_object.append("  };")

	# parse output variables
	outs = list()
	for out in doc_dict['outputs']:
		outs.append(f"{out['name']}: '{out['description']}'")
	return_comment = f"   {return_jsdocs_prefix} {{object}} {{{', '.join(outs)}}}"

	
	# 2. ASSEMBLE CLASS DECLARATION with algo info
	# add jsdoc string
	class_comment = [
		"/**",
		f"* {algo_description}",
		"* @class",
		"*/"
	]

	algorithm_class_body.extend(class_comment)
	# top of class definition
	classname_line = f"class {algorithm_name} {{"
	algorithm_class_body.append(classname_line)
	algorithm_class_body.append("  private algoInstance: any;")
	if has_params:
		algorithm_class_body.extend(default_params_object)
		algorithm_class_body.append(f"  private params: {algo_param_type} = {{ ...this.defaultParams }};")

	internal_config_param_list = ', '.join(internal_instance_arg_list)
	
	# Add the constructor
	constructor_comment = [
		"  /**",
		"   * Creates an instance of the algorithm and initializes it by configuring with default or given params",
		"   * @constructor",
		param_comment,
		"  */"
	]
	algorithm_class_body.extend(constructor_comment)
	algorithm_class_body.append(f"  constructor({constructor_configure_param_arg}) {{")
	if has_params: algorithm_class_body.append("    this.updateParams(params);")
	algorithm_class_body.append(f"    this.algoInstance = new {wasm_backend_var}.{algorithm_name}({internal_config_param_list});")
	algorithm_class_body.append("  }")

	# Add configure method
	configure_comment = [
		"  /**",
		"   * Configure algorithm with default or given params",
		"   * @method",
		param_comment,
		f"   * @memberof {algorithm_name}",
		"  */"
	]
	algorithm_class_body.extend(configure_comment)
	algorithm_class_body.append(f"  configure({constructor_configure_param_arg}) {{")		
	if has_params: algorithm_class_body.append("    this.updateParams(params);")
	algorithm_class_body.append(f"    this.algoInstance.configure({internal_config_param_list});")
	algorithm_class_body.append("  }")

	# Add the compute method
	compute_comment = [
		"  /**",
		"   * Execute algorithm with given inputs",
		"   * @method",
		*inputs_comments,
		return_comment,
		f"   * @memberof {algorithm_name}",
		"  */"
	]
	algorithm_class_body.extend(compute_comment)
	compute_args = ', '.join(inputs)
	algorithm_class_body.append(f"  compute({compute_args}) {{")
	algorithm_class_body.append(f"    return this.algoInstance.compute({', '.join(untyped_inputs)});")
	algorithm_class_body.append("  }")

	# Add delete method
	delete_comment = [
		"  /**",
		"   * Delete algorithm instance",
		"   * @method",
		f"   * @memberof {algorithm_name}",
		"  */"
	]
	algorithm_class_body.extend(delete_comment)
	algorithm_class_body.append("  delete() {")
	algorithm_class_body.append("    this.algoInstance.delete();")
	algorithm_class_body.append("  }")

	# private params update method
	if has_params:
		algorithm_class_body.append(f"  private updateParams({constructor_configure_param_arg}) {{")
		algorithm_class_body.append("    if (!params) return;")
		if converted_params_check_list:
			algorithm_class_body.extend(converted_params_check_list)
		
		algorithm_class_body.append("    this.params = { ...this.defaultParams, ...params };")
		algorithm_class_body.append("  }")

	# Close the class definition
	algorithm_class_body.append("}")

	return algorithm_class_body


def parse_to_param_types(algorithm_name):
	algo = getattr(estd, algorithm_name)()
	doc_dict = algo.getStruct()

	param_type = list()

	param_prefix = "* @param"
	param_comments = list()
	param_type_defs = [f"type Params{algorithm_name} = {{"]

	if not doc_dict['parameters'] or len(doc_dict['parameters']) == 0:
		return [""]
	
	for param in doc_dict['parameters']:
		param_comments.append(f" {param_prefix} {{{map_types_to_js(param['type'])}}} [{param['name']}={param['default']}] {param['description']}")
		param_type_defs.append(f"  {param['name']}: { map_types_to_js(param['type']) },")

	param_type_defs.append("};")

	type_comments = [
		"/**",
		f" * Parameter object type accepted by `{algorithm_name}` algorithm",
		" *@type",
		*param_comments,
		"*/"
	]

	param_type.extend(type_comments)
	param_type.extend(param_type_defs)

	return param_type

def generate_typescript_wrapper(algorithms=TO_INCLUDE_ALGOS):
	algos = list()
	logging.info("Generating typescript wrapper ...")
	for algo_name in algorithms:
		algos.append(parse_to_typescript(algo_name))
	# we have bindings for 3 more extra algorithms (MonoMixer, FrameCutter and LoudnessEBUR128) beside autogenerated ones.
	logging.info(f"Finished generating typescript wrapper for {len(algorithms) + 3} essentia algorithms")
	return algos

def generate_ts_param_types(algorithms=TO_INCLUDE_ALGOS):
	param_types = list()
	logging.info("Generating typescript param types ...")

	exports = list()
	exports.append("export {")

	for algo_name in algorithms:
		param_type_code = parse_to_param_types(algo_name)
		param_types.append(param_type_code)
		if param_type_code == [""]:
			continue
		exports.append(f"  Params{algo_name},")
	
	exports.append("}")
	param_types.append(exports)
	# we have bindings for 3 more extra algorithms (MonoMixer, FrameCutter and LoudnessEBUR128) beside autogenerated ones.
	logging.info(f"Finished generating typescript wrapper for {len(algorithms) + 3} essentia algorithms")
	return param_types

def check_type_param_algos(check_type):
	count = 0
	for algo_name in TO_INCLUDE_ALGOS:
		count+=1
		algo = getattr(estd, algo_name)()
		doc_dict = algo.getStruct()
		vector_string_params = [p['name'] for p in doc_dict['parameters'] if p['type'] in [check_type]]
		if len(vector_string_params) > 0:
			print(f'{algo_name} has {check_type} params: {vector_string_params}')

def get_types_summary():
	param_types = []
	input_types = []
	output_types = []
	for algo_name in TO_INCLUDE_ALGOS:
		algo = getattr(estd, algo_name)()
		doc_dict = algo.getStruct()
		algo_param_types = [p['type'] for p in doc_dict['parameters'] if p['type'] not in param_types]
		param_types.extend(set(algo_param_types))
		algo_input_types = [i['type'] for i in doc_dict['inputs'] if i['type'] not in input_types]
		input_types.extend(set(algo_input_types))
		algo_output_types = [o['type'] for o in doc_dict['outputs'] if o['type'] not in output_types]
		output_types.extend(set(algo_output_types))

	print(f'param types in INCLUDED_ALGOS: {param_types}')
	print(f'input types in INCLUDED_ALGOS: {input_types}')
	print(f'output types in INCLUDED_ALGOS: {output_types}')

def parse_param_range(param_range):
	pass

def gen_valid_input(name, input_type):
	if name == 'signal' and input_type in ['vector_real', 'vector_complex']:
		return f'Array(5*44100).fill(0).map( _ => Math.random() );'
	elif map_types_to_js(input_type) == 'VectorVectorFloat':
		return 

def parse_to_test_suite(algorithm_name):
	algo = getattr(estd, algorithm_name)()
	doc_dict = algo.getStruct()

	instance_variable = f"{algorithm_name[0].lower() + algorithm_name[1:]}Instance"

	invalid_parameter_cases = list()
	valid_parameters_obj = "{}"
	
	default_input_size = 1028
	# generate valid inputs
	for param in doc_dict['parameters']:
		# TODO: should take type into account: strings, vector_vector_float, vector string, etc
		if param['name'] in ['inputSize', 'frameSize']:
			default_input_size = param['default']
	
	# find correct output props
	# TODO: check output value correctness?
	output_props_test_checks = list()
	for out in doc_dict['outputs']:
		output_props_test_checks.append(f"expect(result).to.have.property('{out['name']}');")

	newline = '\n'
	suite_template = f"""
	describe('{algorithm_name}:instantiation', () => {{
		let {instance_variable};
		it('should instantiate algorithm and initialize with default params', () => {{
			{instance_variable} = new {algorithm_name}();
			expect({instance_variable}).to.be.instanceOf({algorithm_name});
		}});
		it('should delete instance', function () {{
			if (!{instance_variable}) this.skip();
			{instance_variable}.delete();
		}});
	}});

	describe('{algorithm_name}:functionality', () => {{
		let {instance_variable};
		let {algorithm_name}ValidInput;
		let {algorithm_name}ValidInputVector;

		before(() => {{
			{instance_variable} = new {algorithm_name}();
			{algorithm_name}ValidInput = Array({default_input_size}).fill(0).map( _ => Math.random() );
			{algorithm_name}ValidInputVector = arrayToVector({algorithm_name}ValidInput)
		}});
		after(() => {{
			if ({instance_variable}) {instance_variable}.delete();
			{algorithm_name}ValidInputVector.delete();
		}});

		it('should configure with valid parameters', function () {{
			if (!{instance_variable}) this.skip();
			expect(() => {{
				{instance_variable}.configure({valid_parameters_obj});
			}}).to.not.throw();
		}});

		// invalid param cases

		
		it('should compute with valid input', function () {{
			let result;
			if (!{instance_variable}) this.skip();
			expect(() => {{
				result = {instance_variable}.compute({algorithm_name}ValidInputVector);
			}}).to.not.throw();
			// output has expected props
			{newline.join(output_props_test_checks)}
		}});
	}});
	"""
	return suite_template

def generate_integration_tests(algorithms=TO_INCLUDE_ALGOS):
	algorithm_test_suites = list()
	logging.info("Generating integration tests...")
	for algo_name in algorithms:
		algorithm_test_suites.append(parse_to_test_suite(algo_name))
		algorithm_test_suites.append("\n")
	logging.info(f"Finished generating integration tests for {len(algorithms)} essentia algorithms")
	return algorithm_test_suites


def get_possible_input_output_params(algorithms=TO_INCLUDE_ALGOS):
	input_types = list()
	output_types = list()
	param_types = list()
	param_ranges = list()
	for algo in algorithms:
		a = getattr(estd, algo)()
		doc = a.getStruct()

		for input in doc['inputs']:
			if input['type'] not in input_types: input_types.append(input['type'])
		for output in doc['outputs']:
			if output['type'] not in output_types: output_types.append(output['type'])
		for param in doc['parameters']:
			if param['type'] not in param_types: param_types.append(param['type'])
			if param['range'] not in param_ranges: param_ranges.append(param['range'])
		
	return {
		"input_types": input_types,
		"output_types": output_types,
		"param_types": param_types,
		"param_ranges": param_ranges
	}

def get_input_size_params(algorithms=TO_INCLUDE_ALGOS):
	for algo in algorithms:
		a = getattr(estd, algo)()
		doc = a.getStruct()

		for param in doc['parameters']:
			if param['name'] in ['inputSize', 'frameSize']:
				print(param)
