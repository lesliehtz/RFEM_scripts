/**
 * Create Surface Set
 * @class
 * @constructor
 * @param {int} no - Number of Surface Set
 * @param {array} surfaces - List of surfaces
 * @param {string} surface_set_type - Surface Set type
 * @param {string} comment - Comment for the Surface Set
 * @param {dictionary} params - Parameters of the Surface Set
 * @returns surfaceSet
 */
function SurfaceSet(no,
    surfaces,
    surface_set_type,
    comment,
    params) {

    if (arguments.length !== 0) {
        surfaces = typeof surfaces !== 'undefined' ? surfaces : [];

        this.surface_set = engine.create_surface_set(no, surfaces);

        if (surface_set_type == "") {
            this.surface_set.set_type = surface_sets.SET_TYPE_GROUP;
        }
        else {
            this.surface_set.set_type = surface_set_type;
        }
        set_comment_and_parameters(this.surface_set, comment, params);
        return this.surface_set;
    }
}

/**
 * @returns Surface set object
 */
 SurfaceSet.prototype.GetSurfaceSet = function () {
	return this.surface_set;
};

/**
 * @returns Surface set number
 */
SurfaceSet.prototype.GetNo = function () {
	return this.surface_set.no;
};

/**
 * Sets name
 * @param {String} name     Name
 */
SurfaceSet.prototype.SetName = function (name) {
    ASSERT(typeof name !== "undefined", "Name must be specified");
    this.surface_set.name = name;
};

/**
 * Create Continuous Surfaces surfaceSet type
 * @param {int} no - Number of Surface Set
 * @param {array} surfaces - List of surfaces
 * @param {string} comment - Comment for the Surface Set
 * @param {dictionary} params - Parameters of the Surface Set
 */
SurfaceSet.prototype.ContinuousSurfaces = function (no,
    surfaces,
    comment,
    params) {
    surfaces = typeof surfaces !== 'undefined' ? surfaces : [];
    this.surface_set = engine.create_surface_set(no, surfaces);
    this.surface_set.set_type = surface_sets.SET_TYPE_CONTINUOUS;
    set_comment_and_parameters(this.surface_set, comment, params);
};

/**
 * Create Group of Surfaces
 * @param {int} no - Number of Surface Set
 * @param {array} surfaces - List of surfaces
 * @param {string} comment - Comment for the Surface Set
 * @param {dictionary} params - Parameters of the Surface Set
 */
SurfaceSet.prototype.GroupOfSurfaces = function (no,
    surfaces,
    comment,
    params) {
    surfaces = typeof surfaces !== 'undefined' ? surfaces : [];
    this.surface_set = engine.create_surface_set(no, surfaces);
    this.surface_set.set_type = surface_sets.SET_TYPE_GROUP;
    set_comment_and_parameters(this.surface_set, comment, params);
};

/**
 * Enable / disable Design properties for surface (Concrete design add-on)
 * @param {Boolean} enabled 	Enable / disable Design properties, can be undefined (true as default)
 */
SurfaceSet.prototype.SetConcreteDesignProperties = function (enabled) {
	SetSurfaceConcreteDesignProperties(this.surface_set, enabled);
};

/**
 * Sets User-defined concrete cover
 * @param {Number} concrete_cover_top 							Concrete cover top, can be undefined (is not set, 30 mm as default). For EN must be is_user_defined_concrete_cover_enabled set true
 * @param {Number} concrete_cover_bottom 						Concrete cover bottom, can be undefined (is not set, 30 mm as default). For EN must be is_user_defined_concrete_cover_enabled set true
 * @param {Boolean} is_user_defined_concrete_cover_enabled 		Enable/disable user-defined values, can be undefined (true as default). Has meaning only for EN standard.
 */
SurfaceSet.prototype.SetUserDefinedConcreteCover = function (concrete_cover_top,
	concrete_cover_bottom,
	is_user_defined_concrete_cover_enabled) {
	SurfaceSetUserDefinedConcreteCover(this.surface_set, concrete_cover_top, concrete_cover_bottom, is_user_defined_concrete_cover_enabled);
};

/*
/**
 * Sets Concrete Cover Acc. to EN 1992 | CEN | 2014-11
 */
/*SurfaceSet.prototype.SetConcreteCoverAccToEn1992 = function () {
	SurfaceSetConcreteCoverAccToEn1992(this.surface_set);
};*/	//Cannot be set Cannot be set (top surface side, bottom surface side)?

/**
 * Sets Assignments
 * @param {Number} surface_concrete_design_uls_configuration 	Ultimate configuration, can be undefined (empty by default)
 * @param {Number} surface_concrete_design_sls_configuration 	Serviceability configuration, can be undefined (empty by default)
 */
SurfaceSet.prototype.SetAssignments = function (surface_concrete_design_uls_configuration,
	surface_concrete_design_sls_configuration) {
	SurfaceSetAssignments(this.surface_set, surface_concrete_design_uls_configuration, surface_concrete_design_sls_configuration);
};

/**
 * Sets Reinforcement directions
 * @param {Number} reinforcement_direction_top 			Reinforcement direction number for top surface side
 * @param {Number} reinforcement_direction_bottom 		Reinforcement direction number for bottom surface side
 */
SurfaceSet.prototype.SetConcreteDesignReinforcementDirections = function (reinforcement_direction_top,
	reinforcement_direction_bottom) {
	SurfaceSetConcreteDesignReinforcementDirections(this.surface_set, reinforcement_direction_top, reinforcement_direction_bottom);
};

/**
 * Sets Concrete durabilities
 * @param {Number} concrete_durability_top 		Concrete durability number for top surface side
 * @param {Number} concrete_durability_bottom 	Concrete durability number for bottom surface side
 */
SurfaceSet.prototype.SetConcreteDesignConcreteDurability = function (concrete_durability_top,
	concrete_durability_bottom) {
	SurfaceSetConcreteDesignConcreteDurability(this.surface_set, concrete_durability_top, concrete_durability_bottom);
};

/**
 * Sets Surface reinforcements
 * @param {Array} surface_reinforcement_nos 	Array of surface reinforcements numbers
 */
SurfaceSet.prototype.SetConcreteDesignSurfaceReinforcement = function (surface_reinforcement_nos) {
	SurfaceSetConcreteDesignSurfaceReinforcement(this.surface_set, surface_reinforcement_nos);
};

/**
 * Sets Deflection analysis
 * @param {String} deflection_check_surface_type 						Surface type (DOUBLE_SUPPORTED, CANTILEVER), can be undefined (is not set, DOUBLE_SUPPORTED as default)
 * @param {String} deflection_check_displacement_reference 				Displacement reference (DEFORMED_USER_DEFINED_REFERENCE_PLANE, PARALLEL_SURFACE, UNDEFORMED_SYSTEM), can be undefined (is not set, UNDEFORMED_SYSTEM as default)
 * @param {String} deflection_check_reference_length_z_definition_type 	Definition type (MANUALLY, BY_MAXIMUM_BOUNDARY_LINE, BY_MINIMUM_BOUNDARY_LINE), can be undefined (is not set, BY_MAXIMUM_BOUNDARY_LINE as default)
 * @param {Number} deflection_check_reference_length_z					Reference length, can be undefined
 */
SurfaceSet.prototype.SetDeflectionAnalysis = function (deflection_check_surface_type,
	deflection_check_displacement_reference,
	deflection_check_reference_length_z_definition_type,
	deflection_check_reference_length_z) {
	SurfaceSetDeflectionAnalysis(this.surface_set, deflection_check_surface_type, deflection_check_displacement_reference, deflection_check_reference_length_z_definition_type, deflection_check_reference_length_z);
};

/**
 * Sets User-defined reference plane
 * @param {Array} reference_plane 		Reference plane ([AX, AY, AZ, BX, BY, BZ, CX, CY, CZ])
 */
SurfaceSet.prototype.SetUserDefinedReferencePlane = function (reference_plane) {
	SurfaceSetUserDefinedReferencePlane(this.surface_set, reference_plane);
};