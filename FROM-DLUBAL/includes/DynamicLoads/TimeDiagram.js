include("../Tools/high_level_functions_support.js");

/**
* Creates time diagram
* @class
* @constructor
* @param    {Number}	no          Index of time diagram, can be undefined
* @param	{String}	comment		Comment, can be undefined
* @param	{Object}	params		Load parameters, can be undefined
* @return	{Object}	Created time diagram
*/
function TimeDiagram(no,
    comment,
    params) {
    if (arguments.length !== 0) {
        return this.time_diagram = createBaseTimeDiagram(no, comment, params);
    }
}

/**
 * @returns     Time diagram number
 */
TimeDiagram.prototype.GetNo = function () {
    return this.time_diagram.no;
};

/**
 * @returns     Time diagram internal object
 */
TimeDiagram.prototype.GetTimeDiagram = function () {
    return this.time_diagram;
};

/**
 * Creates User-defined time diagram
 * @param {Number} no                                           Index of time diagram, can be undefined
 * @param {String} user_defined_time_diagram                    User defined values ([multiplier_1, time_1, ... multiplier_n, time_n])
 * @param {Boolean} user_defined_time_diagram_step_enabled      User-defined time diagram step enabled, can be undefined (false as default)
 * @param {Number} user_defined_time_diagram_time_step          User-defined time diagram time step | Δt, can be undefined (is not set, 0.1 as default)
 * @param {String} comment                                      Comment, can be undefined
 * @param {Object} params                                       Additional parameters, can be undefined
 */
TimeDiagram.prototype.UserDefined = function (
    no,
    user_defined_time_diagram,
    user_defined_time_diagram_step_enabled,
    user_defined_time_diagram_time_step,
    comment,
    params) {
    ASSERT(Array.isArray(user_defined_time_diagram), "user_defined_time_diagram must be array ([multiplier_1, time_1, ... multiplier_n, time_n])");
    ASSERT(user_defined_time_diagram.length >= 2, "user_defined_time_diagram must have more then two items ([multiplier_1, time_1, ... multiplier_n, time_n])");
    this.time_diagram = createBaseTimeDiagram(no, comment, params);
    this.time_diagram.definition_type = time_diagrams.USER_DEFINED;
    for (var i = 0; i < user_defined_time_diagram.length; i += 2) {
        this.time_diagram.user_defined_time_diagram[i / 2 + 1].multiplier = user_defined_time_diagram[i];
        this.time_diagram.user_defined_time_diagram[i / 2 + 1].time = user_defined_time_diagram[i + 1];
    }
    if (typeof user_defined_time_diagram_step_enabled === "undefined") {
        user_defined_time_diagram_step_enabled = false;
    }
    this.time_diagram.user_defined_time_diagram_step_enabled = user_defined_time_diagram_step_enabled;
    if (this.time_diagram.user_defined_time_diagram_step_enabled) {
        ASSERT(typeof user_defined_time_diagram_time_step !== "undefined", "user_defined_time_diagram_time_step is required");
        this.time_diagram.user_defined_time_diagram_time_step = user_defined_time_diagram_time_step;
    }
};

/**
 * Creates time diagram with function specified
 * @param {Number} no                                           Index of time diagram, can be undefined
 * @param {String} function_defined_function                    Function | k(t)
 * @param {Number} function_defined_maximum_t                   Maximum time | tmax, can be undefined (is not set, 10 secs. as default)
 * @param {String} comment                                      Comment, can be undefined
 * @param {Object} params                                       Additional parameters, can be undefined
 */
TimeDiagram.prototype.Function = function (
    no,
    function_defined_function,
    function_defined_maximum_t,
    comment,
    params) {
    ASSERT(typeof function_defined_function !== "undefined", "Function is required");
    this.time_diagram = createBaseTimeDiagram(no, comment, params);
    this.time_diagram.definition_type = time_diagrams.FUNCTION;
    this.time_diagram.function_defined_function = function_defined_function;
    if (typeof function_defined_maximum_t !== "undefined") {
        this.time_diagram.function_defined_maximum_t = function_defined_maximum_t;
    }
};

/**
 * Sets diagram start
 * @param {String} function_defined_diagram_start   Diagram start (ZERO, CONSTANT) (is not set, ZERO as default)
 */
TimeDiagram.prototype.SetStart = function (function_defined_diagram_start) {
    ASSERT(typeof function_defined_diagram_start !== "undefined", "function_defined_diagram_start is required");
    this.time_diagram.function_defined_diagram_start = timeDiagramStartAndEnd(function_defined_diagram_start);
};

/**
 * Sets diagram end
 * @param {String} function_defined_diagram_end   Diagram end (ZERO, CONSTANT) (is not set, ZERO as default)
 */
TimeDiagram.prototype.SetEnd = function (function_defined_diagram_end) {
    ASSERT(typeof function_defined_diagram_end !== "undefined", "function_defined_diagram_end is required");
    this.time_diagram.function_defined_diagram_end = timeDiagramStartAndEnd(function_defined_diagram_end);
};

function createBaseTimeDiagram (no,
    comment,
    params) {
    if (typeof no === "undefined") {
        no = time_diagrams.count() + 1;
    }
    var time_diagram = time_diagrams.create(no);
    set_comment_and_parameters(time_diagram, comment, params);
    return time_diagram;
}

function timeDiagramStartAndEnd (value) {
    return EnumValueFromJSHLFTypeName(
        value,
        "diameter start or end",
        {
            "ZERO": time_diagrams.ZERO,
            "CONSTANT": time_diagrams.CONSTANT
        },
        time_diagrams.ZERO);
}