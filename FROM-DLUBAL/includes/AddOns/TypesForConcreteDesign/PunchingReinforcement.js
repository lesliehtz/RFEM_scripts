include ("../ConcreteDesign/ConcreteDesignSupport.js");

/**
 * Creates Concrete design punching reinforcement
 * @param {Number} no               Concrete design punching reinforcement index, can be undefined
 * @param {Array} nodes_no          List of nodes indexes, can be undefined
 * @param {Array} material_no       Material number, can be undefined
 * @param {String} comment          Comment, can be undefined
 * @param {Object} params           Additional parameters, can be undefined
 */
function ConcreteDesignPunchingReinforcement (no,
    nodes_no,
    material_no,
    comment,
    params) {
    ASSERT(!RSECTION, "This script is only for RFEM or RSTAB");
    ASSERT(CONCRETE_DESIGN.isActive(), "Concrete design add-on must be active");
    if (typeof no === "undefined") {
        this.punching_reinforcement = punching_reinforcements.create();
    }
    else {
        this.punching_reinforcement = this.punching_reinforcements.create(no);
    }
    if (typeof nodes_no !== "undefined") {
        ASSERT(Array.isArray(nodes_no), "Nodes list must be array of nodes indexes");
        nodes_list = nodes_no;
        nodes_no = [];
        for (var i = 0; i < nodes_list.length; ++i) {
            if (nodes.exist(nodes_list[i])) {
                nodes_no.push(nodes_list[i]);
            }
            else {
                console.log("Node no. " + nodes_list[i] + " doesn't exist");
            }
        }
        this.punching_reinforcement.nodes = nodes_no;
    }
    this.punching_reinforcement.material = material_no;
    set_comment_and_parameters(this.punching_reinforcement, comment, params);
}

/**
 * @returns Punching reinforcement number
 */
ConcreteDesignPunchingReinforcement.prototype.GetNo = function () {
    return this.punching_reinforcement.no;
};

/**
 * @returns Punching reinforcement object
 */
ConcreteDesignPunchingReinforcement.prototype.GetSurfaceReinforcement = function () {
    return this.punching_reinforcement;
};

/**
 * Sets Name
 * @param {String} name     Name, can be undefined (when undefined, generated name is used)
 */
ConcreteDesignPunchingReinforcement.prototype.SetName = function (name) {
    if (typeof name !== "undefined") {
        this.punching_reinforcement.user_defined_name_enabled = true;
        this.punching_reinforcement.name = name;
    }
    else {
        this.punching_reinforcement.user_defined_name_enabled = false;
    }
};

/**
 * Sets type
 * @param {String} type     Type (VERTICAL)
 */
ConcreteDesignPunchingReinforcement.prototype.SetType = function (type) {
    ASSERT(typeof type !== "undefined", "Type must be specified");
    this.punching_reinforcement.type = EnumValueFromJSHLFTypeName(
        type,
        "type",
        {
            "VERTICAL": punching_reinforcements.TYPE_VERTICAL
        },
        punching_reinforcements.TYPE_VERTICAL);
};

/**
 * Sets Placement
 * @param {String} placement_type   Placement (UNIFORM, AUTOMATICALLY)
 */
ConcreteDesignPunchingReinforcement.prototype.SetPlacement = function (placement_type) {
    ASSERT(typeof placement_type !== "undefined", "Placement type must be specified");
    this.punching_reinforcement.placement_type = EnumValueFromJSHLFTypeName(
        placement_type,
        "placement",
        {
            "UNIFORM": punching_reinforcements.PLACEMENT_TYPE_UNIFORM,
            "DIFFERENT": punching_reinforcements.PLACEMENT_TYPE_DIFFERENT
        },
        punching_reinforcements.PLACEMENT_TYPE_UNIFORM);
};

/**
 * Sets Bendu-up diameter
 * @param {Number} bend_up_diameter     Bend-up diameter
 */
ConcreteDesignPunchingReinforcement.prototype.SetBendUpDiameter = function (bend_up_diameter) {
    ASSERT(typeof bend_up_diameter !== "undefined", "Bend-up diameter must be specified");
    this.punching_reinforcement.bend_up_diameter = bend_up_diameter;
};

/**
 * Sets Bend-up diameter automatically
 * @param {Number} bend_up_diameter_auto_minimum                    Minimum diameter, can be undefined (is not set, 10 mm as default)
 * @param {Number} bend_up_diameter_auto_maximum                    Maximum diameter, can be undefined (is not set, 20 mm as default)
 * @param {Boolean} bend_up_diameter_auto_diameters_list_enabled    List of possible diameters, can be undefined (is not set, fals eas default)
 * @param {Array} bend_up_diameter_auto_diameters_list              Diameters for reinforcement, can be undefined (is not set, empty as default)
 * @param {Number} bend_up_diameter_auto_priority                   Priority, can be undefined (is not set, 1 as default)
 */
ConcreteDesignPunchingReinforcement.prototype.SetBendUpDiameterAutomatically = function (bend_up_diameter_auto_minimum,
    bend_up_diameter_auto_maximum,
    bend_up_diameter_auto_diameters_list_enabled,
    bend_up_diameter_auto_diameters_list,
    bend_up_diameter_auto_priority) {
    this.punching_reinforcement.bend_up_diameter_auto_enabled = true;
    if (typeof bend_up_diameter_auto_minimum !== "undefined") {
        this.punching_reinforcement.bend_up_diameter_auto_minimum = bend_up_diameter_auto_minimum;
    }
    if (typeof bend_up_diameter_auto_maximum !== "undefined") {
        this.punching_reinforcement.bend_up_diameter_auto_maximum = bend_up_diameter_auto_maximum;
    }
    if (typeof bend_up_diameter_auto_diameters_list_enabled !== "undefined") {
        this.punching_reinforcement.bend_up_diameter_auto_diameters_list_enabled = bend_up_diameter_auto_diameters_list_enabled;
    }
    if (typeof bend_up_diameter_auto_diameters_list !== "undefined") {
        ASSERT(this.punching_reinforcement.bend_up_diameter_auto_diameters_list_enabled, "List of possible diameters must be on");
        ASSERT(Array.isArray(bend_up_diameter_auto_diameters_list, "Diameters must be list of numbers"));
        this.punching_reinforcement.bend_up_diameter_auto_diameters_list = bend_up_diameter_auto_diameters_list.join(",");
    }
    if (typeof bend_up_diameter_auto_priority !== "undefined") {
        this.punching_reinforcement.bend_up_diameter_auto_priority = bend_up_diameter_auto_priority;
    }
};

/**
 * Sets Perimeters and Legs
 * @param {Boolean} number_of_perimeters_auto_enabled               Number of perimeters auto, can be undefined (is not set, true as default)
 * @param {Number/Array} number_of_perimeters                       Number of perimeters (number if auto is on, otherwise array of values [minimum, maximum, priority]), can be undefined
 * @param {Boolean} number_of_legs_in_each_perimeter_auto_enabled   Number of legs in each perimeter auto, can be undefined (is not set, true as default)
 * @param {Number/Array} number_of_legs_in_each_perimeter           Number of legs in each perimeter (number if auto is on, otherwise array of values [minimum, maximum, priority]), can be undefined
 */
ConcreteDesignPunchingReinforcement.prototype.SetUniformPlacementPerimetersAndLegs = function (number_of_perimeters_auto_enabled,
    number_of_perimeters,
    number_of_legs_in_each_perimeter_auto_enabled,
    number_of_legs_in_each_perimeter) {
    ASSERT(this.punching_reinforcement.placement_type === punching_reinforcements.PLACEMENT_TYPE_UNIFORM, "Uniform placement type must be set");
    if (typeof number_of_perimeters_auto_enabled !== "undefined") {
        this.punching_reinforcement.number_of_perimeters_auto_enabled = number_of_perimeters_auto_enabled;
    }
    if (typeof number_of_perimeters !== "undefined") {
        if (typeof number_of_perimeters === "number") {
            ASSERT(!this.punching_reinforcement.number_of_perimeters_auto_enabled, "Number of perimeters auto setting must be off");
            this.punching_reinforcement.number_of_perimeters = number_of_perimeters;
        }
        else {
            ASSERT(Array.isArray(number_of_perimeters) && number_of_perimeters.length === 3, "Number of perimeters values must be array [minimum, maximum, priority]");
            ASSERT(this.punching_reinforcement.number_of_perimeters_auto_enabled, "Number of perimeters auto setting must be on");
            this.punching_reinforcement.number_of_perimeters_auto_minimum = number_of_perimeters[0];
            this.punching_reinforcement.number_of_perimeters_auto_maximum = number_of_perimeters[1];
            this.punching_reinforcement.number_of_perimeters_auto_priority = number_of_perimeters[2];
        }
    }
    if (typeof number_of_legs_in_each_perimeter_auto_enabled !== "undefined") {
        this.punching_reinforcement.number_of_legs_in_each_perimeter_auto_enabled = number_of_legs_in_each_perimeter_auto_enabled;
    }
    if (typeof number_of_legs_in_each_perimeter !== "undefined") {
        if (typeof number_of_legs_in_each_perimeter === "number") {
            ASSERT(!this.punching_reinforcement.number_of_legs_in_each_perimeter_auto_enabled, "Number of legs in each perimeter auto setting must be off");
            this.punching_reinforcement.number_of_legs_in_each_perimeter = number_of_legs_in_each_perimeter;
        }
        else {
            ASSERT(Array.isArray(number_of_legs_in_each_perimeter) && number_of_legs_in_each_perimeter.length === 3, "Number of legs in each perimeter must be array [minimum, maximum, priority]");
            ASSERT(this.punching_reinforcement.number_of_legs_in_each_perimeter_auto_enabled, "Number of legs in each perimeter auto setting must be on");
            this.punching_reinforcement.number_of_legs_in_each_perimeter_auto_minimum = number_of_legs_in_each_perimeter[0];
            this.punching_reinforcement.number_of_legs_in_each_perimeter_auto_maximum = number_of_legs_in_each_perimeter[1];
            this.punching_reinforcement.number_of_legs_in_each_perimeter_auto_priority = number_of_legs_in_each_perimeter[2];
        }
    }
};

/**
 * Sets Perimeter spacing type
 * @param {String} perimeter_spacing_type   Perimeter spacing type (MULTIPLE_STATIC_DEPTH, ABSOLUTE), can be undefined (MULTIPLE_STATIC_DEPTH as default)
 */
ConcreteDesignPunchingReinforcement.prototype.SetUniformPerimeterSpacing = function (perimeter_spacing_type) {
    ASSERT(this.punching_reinforcement.placement_type === punching_reinforcements.PLACEMENT_TYPE_UNIFORM, "Uniform placement type must be set");
    this.punching_reinforcement.perimeter_spacing_type = EnumValueFromJSHLFTypeName(
        perimeter_spacing_type,
        "perimeter spacing",
        {
            "MULTIPLE_STATIC_DEPTH": punching_reinforcements.PERIMETER_SPACING_TYPE_MULTIPLE_STATIC_DEPTH,
            "ABSOLUTE": punching_reinforcements.PERIMETER_SPACING_TYPE_ABSOLUTE
        },
        punching_reinforcements.PERIMETER_SPACING_TYPE_MULTIPLE_STATIC_DEPTH
    );
};

/**
 * Sets Absolute perimeter spacing
 * @param {Boolean} multiple_static_depth_spacing_between_support_face_and_first_perimeter_auto_enabled     Between support face and first perimeter auto, can be undefined (is not set, false as default)
 * @param {Number/Array} multiple_static_depth_spacing_between_support_face_and_first_perimeter             Between support face and first perimeter (number if auto is on, otherwise array of values [minimum, maximum, priority]), can be undefined
 * @param {Boolean} multiple_static_depth_spacing_between_perimeters_auto_enabled                           Between perimeters auto, can be undefined (is not set, false as default)
 * @param {Number/Array} multiple_static_depth_spacing_between_perimeters                                   Between perimeters (number if auto is on, otherwise array of values [minimum, maximum, priority]), can be undefined
 */
ConcreteDesignPunchingReinforcement.prototype.SetUniformMultipleStaticPerimeterSpacing = function (multiple_static_depth_spacing_between_support_face_and_first_perimeter_auto_enabled,
    multiple_static_depth_spacing_between_support_face_and_first_perimeter,
    multiple_static_depth_spacing_between_perimeters_auto_enabled,
    multiple_static_depth_spacing_between_perimeters) {
    ASSERT(this.punching_reinforcement.placement_type === punching_reinforcements.PLACEMENT_TYPE_UNIFORM, "Uniform placement type must be set");
    SetConcreteDesignPunchingReinforcementPerimeterSpacing(this.punching_reinforcement, "MULTIPLE_STATIC_DEPTH", multiple_static_depth_spacing_between_support_face_and_first_perimeter_auto_enabled,
        multiple_static_depth_spacing_between_support_face_and_first_perimeter, multiple_static_depth_spacing_between_perimeters_auto_enabled, multiple_static_depth_spacing_between_perimeters);
};

/**
 * Sets Absolute perimeter spacing
 * @param {Boolean} absolute_spacing_between_support_face_and_first_perimeter_auto_enabled     Between support face and first perimeter auto, can be undefined (is not set, false as default)
 * @param {Number/Array} absolute_spacing_between_support_face_and_first_perimeter             Between support face and first perimeter (number if auto is on, otherwise array of values [minimum, maximum, priority]), can be undefined
 * @param {Boolean} absolute_spacing_between_perimeters_auto_enabled                           Between perimeters auto, can be undefined (is not set, false as default)
 * @param {Number/Array} absolute_spacing_between_perimeters                                   Between perimeters (number if auto is on, otherwise array of values [minimum, maximum, priority]), can be undefined
 */
ConcreteDesignPunchingReinforcement.prototype.SetUniformAbsolutePerimeterSpacing = function (absolute_spacing_between_support_face_and_first_perimeter_auto_enabled,
    absolute_spacing_between_support_face_and_first_perimeter,
    absolute_spacing_between_perimeters_auto_enabled,
    absolute_spacing_between_perimeters) {
    ASSERT(this.punching_reinforcement.placement_type === punching_reinforcements.PLACEMENT_TYPE_UNIFORM, "Uniform placement type must be set");
    SetConcreteDesignPunchingReinforcementPerimeterSpacing(this.punching_reinforcement, "ABSOLUTE", absolute_spacing_between_support_face_and_first_perimeter_auto_enabled, absolute_spacing_between_support_face_and_first_perimeter,
        absolute_spacing_between_perimeters_auto_enabled, absolute_spacing_between_perimeters);
};

/**
 * Sets Perimeter spacing type for Different perimeters
 * @param {String} different_placement_perimeter_spacing_type   Perimeter spacing type (MULTIPLE_STATIC_DEPTH, ABSOLUTE), can be undefined (is not set, MULTIPLE_STATIC_DEPTH)
 */
ConcreteDesignPunchingReinforcement.prototype.SetPerimeterSpacingTypeForDifferentPerimeters = function (different_placement_perimeter_spacing_type) {
    ASSERT(this.punching_reinforcement.placement_type === punching_reinforcements.PLACEMENT_TYPE_DIFFERENT, "Different placement type must be set");
    this.punching_reinforcement.different_placement_perimeter_spacing_type = EnumValueFromJSHLFTypeName(
        perimeter_spacing_type,
        "perimeter spacing",
        {
            "MULTIPLE_STATIC_DEPTH": punching_reinforcements.PERIMETER_SPACING_TYPE_MULTIPLE_STATIC_DEPTH,
            "ABSOLUTE": punching_reinforcements.PERIMETER_SPACING_TYPE_ABSOLUTE
        },
        punching_reinforcements.PERIMETER_SPACING_TYPE_MULTIPLE_STATIC_DEPTH
    );
};

/**
 * Sets Different placement perimeters
 * @param {Number} number_of_legs                               Number of legs, can be undefined
 * @param {Number} spacing                                      Spacing, can be undefined
 */
ConcreteDesignPunchingReinforcement.prototype.AddDifferentPerimeters = function (number_of_legs,
    spacing) {
    ASSERT(this.punching_reinforcement.placement_type === punching_reinforcements.PLACEMENT_TYPE_DIFFERENT, "Different placement type must be set");
    AddConcreteDesignPunchingReinforcementDifferentPerimeters(this.punching_reinforcement, number_of_legs, spacing);
};