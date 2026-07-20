include("../Tools/high_level_functions_support.js");

/**
* Creates member stiffness modification
* @class
* @constructor
* @param	{Number}	no							Index of member stiffness modification, can be undefined
* @param	{Array}		structure_modifications		Assigned structure modifications, can be undefined
* @param	{String}	comment						Comment, can be undefined
* @param	{Object}	params						Member stiffness modification parameters, can be undefined
* @return	{Object}	Created member stiffness modification
*/
function MemberStiffnessModification(no,
	structure_modifications,
	comment,
	params) {
    this.member_stiffness_modification = engine.create_member_stiffness_modification(no);
	if (typeof structure_modifications !== "undefined") {
		this.member_stiffness_modification.assigned_to_structure_modification = structure_modifications;
	}
    set_comment_and_parameters(this.member_stiffness_modification, comment, params);
}

/**
* Sets total stiffness factor
* @param	{Number}	total_stiffness	Total stiffness
*/
MemberStiffnessModification.prototype.TotalStiffnessFactor = function (total_stiffness) {
	this.member_stiffness_modification.type = member_stiffness_modifications.TYPE_TOTAL_STIFFNESSES_FACTORS;
	this.member_stiffness_modification.total_stiffness_factor_of_total_stiffness = total_stiffness;
};

/**
* Sets partial stiffness factors
* @param	{Number}	axial_stiffness			Axial stiffness, can be undefined
* @param	{Number}	bending_stiffness_y		Bending stiffness Y, can be undefined
* @param 	{Number}	bending_stiffness_z		Bending stiffness Z, can be undefined
* @param	{Number}	shear_stiffness_y		Shear stiffness Y, can be undefined
* @param	{Number}	shear_stiffness_z		Shear stiffness Z, can be undefined
* @param	{Number}	torsional_stiffness		Torsional stiffness, can be undefined
* @param	{Number}	weight					Weight, can be undefined
*/
MemberStiffnessModification.prototype.PartialStiffnessFactors = function (axial_stiffness,
	bending_stiffness_y,
	bending_stiffness_z,
	shear_stiffness_y,
	shear_stiffness_z,
	torsional_stiffness,
	weight) {
	this.member_stiffness_modification.type = member_stiffness_modifications.TYPE_PARTIAL_STIFFNESSES_FACTORS;
	if (typeof axial_stiffness !== "undefined") {
		this.member_stiffness_modification.factor_of_axial_stiffness = axial_stiffness;
	}
	if (typeof bending_stiffness_y !== "undefined") {
		this.member_stiffness_modification.factor_of_bending_y_stiffness = bending_stiffness_y;
	}
	if (typeof bending_stiffness_z !== "undefined") {
		this.member_stiffness_modification.factor_of_bending_z_stiffness = bending_stiffness_z;
	}
	if (typeof shear_stiffness_y !== "undefined") {
		this.member_stiffness_modification.partial_stiffness_factor_of_shear_y_stiffness = shear_stiffness_y;
	}
	if (typeof shear_stiffness_z !== "undefined") {
		this.member_stiffness_modification.partial_stiffness_factor_of_shear_z_stiffness = shear_stiffness_z;
	}
	if (typeof torsional_stiffness !== "undefined") {
		this.member_stiffness_modification.partial_stiffness_factor_of_torsion_stiffness = torsional_stiffness;
	}
	if (typeof weight !== "undefined") {
		this.member_stiffness_modification.partial_stiffness_factor_of_weight = weight;
	}
};

/**
 * Sets Modification type
 * @param {String} modification_type 	Modification type (TOTAL_STIFFNESSES_FACTORS, PARTIAL_STIFFNESSES_FACTORS, CONCRETE_STRUCTURES_ACI, CONCRETE_STRUCTURES_CSA, STEEL_STRUCTURES_360_16,
 * 										STEEL_STRUCTURES_CSA, STEEL_STRUCTURES_GB, STEEL_STRUCTURES_360_10, STEEL_STRUCTURES_S100_16)
 */
MemberStiffnessModification.prototype.SetModificationType = function (modification_type) {
	this.member_stiffness_modification.type = EnumValueFromJSHLFTypeName(
		modification_type,
		"modification type",
		{
			"TOTAL_STIFFNESSES_FACTORS": member_stiffness_modifications.TYPE_TOTAL_STIFFNESSES_FACTORS,
			"PARTIAL_STIFFNESSES_FACTORS": member_stiffness_modifications.TYPE_PARTIAL_STIFFNESSES_FACTORS,
			"CONCRETE_STRUCTURES_ACI": member_stiffness_modifications.TYPE_CONCRETE_STRUCTURES_ACI,
			"CONCRETE_STRUCTURES_CSA": member_stiffness_modifications.TYPE_CONCRETE_STRUCTURES_CSA,
			"STEEL_STRUCTURES_360_16": member_stiffness_modifications.TYPE_STEEL_STRUCTURES_360_16,
			"STEEL_STRUCTURES_CSA": member_stiffness_modifications.TYPE_STEEL_STRUCTURES_CSA,
			"STEEL_STRUCTURES_GB": member_stiffness_modifications.TYPE_STEEL_STRUCTURES_GB,
			"STEEL_STRUCTURES_360_10": member_stiffness_modifications.TYPE_STEEL_STRUCTURES_360_10,
			"STEEL_STRUCTURES_S100_16": member_stiffness_modifications.TYPE_STEEL_STRUCTURES_S100_16
		},
		member_stiffness_modifications.TYPE_TOTAL_STIFFNESSES_FACTORS);
};

/**
 * Sets Multiplier factors of partial stiffnesses, weight and masses
 * @param {Number} factor_of_axial_stiffness 						Factor of Axial stiffness, can be undefined (is not set, 1.0 as default)
 * @param {Number} factor_of_bending_z_stiffness 					Factor of Bending stiffness in Z, can be undefined (is not set, 1.0 as default)
 * @param {Number} factor_of_bending_y_stiffness 					Factor of Bending stiffness in Y, can be undefined (is not set, 1.0 as default)
 * @param {Number} partial_stiffness_factor_of_shear_z_stiffness 	Factor of Shear stiffness in Z, can be undefined (is not set, 1.0 as default)
 * @param {Number} partial_stiffness_factor_of_shear_y_stiffness 	Factor of Shear stiffness in Y, can be undefined (is not set, 1.0 as default)
 * @param {Number} partial_stiffness_factor_of_torsion_stiffness 	Factor of Torsional stiffness, can be undefined (is not set, 1.0 as default)
 * @param {Number} partial_stiffness_factor_of_weight 				Factor of weight, can be undefined (is not set, 1.0 as default)
 */
MemberStiffnessModification.prototype.SetMultiplierFactorsOfPartialStiffnesses = function (factor_of_axial_stiffness,
	factor_of_bending_z_stiffness,
	factor_of_bending_y_stiffness,
	partial_stiffness_factor_of_shear_z_stiffness,
	partial_stiffness_factor_of_shear_y_stiffness,
	partial_stiffness_factor_of_torsion_stiffness,
	partial_stiffness_factor_of_weight) {
	ASSERT(this.member_stiffness_modification.type === member_stiffness_modifications.TYPE_PARTIAL_STIFFNESSES_FACTORS, "Modification type must be " + member_stiffness_modifications.TYPE_PARTIAL_STIFFNESSES_FACTORS);
	if (typeof factor_of_axial_stiffness !== "undefined") {
		this.member_stiffness_modification.factor_of_axial_stiffness = factor_of_axial_stiffness;
	}
	if (typeof factor_of_bending_z_stiffness !== "undefined") {
		this.member_stiffness_modification.factor_of_bending_z_stiffness = factor_of_bending_z_stiffness;
	}
	if (typeof factor_of_bending_y_stiffness !== "undefined") {
		this.member_stiffness_modification.factor_of_bending_y_stiffness = factor_of_bending_y_stiffness;
	}
	if (typeof partial_stiffness_factor_of_shear_z_stiffness !== "undefined") {
		this.member_stiffness_modification.partial_stiffness_factor_of_shear_z_stiffness = partial_stiffness_factor_of_shear_z_stiffness;
	}
	if (typeof partial_stiffness_factor_of_shear_y_stiffness !== "undefined") {
		this.member_stiffness_modification.partial_stiffness_factor_of_shear_y_stiffness = partial_stiffness_factor_of_shear_y_stiffness;
	}
	if (typeof partial_stiffness_factor_of_torsion_stiffness !== "undefined") {
		this.member_stiffness_modification.partial_stiffness_factor_of_torsion_stiffness = partial_stiffness_factor_of_torsion_stiffness;
	}
	if (typeof partial_stiffness_factor_of_weight !== "undefined") {
		this.member_stiffness_modification.partial_stiffness_factor_of_weight = partial_stiffness_factor_of_weight;
	}
};

/**
 * Sets Multiplier factor of total stiffnesses
 * @param {Number} total_stiffness_factor_of_total_stiffness 	Factor of total stiffness, can be undefined (is not set, 1.0 as default)
 */
MemberStiffnessModification.prototype.SetMultiplierFactorsOfTotalStiffnesses = function (total_stiffness_factor_of_total_stiffness) {
	ASSERT(this.member_stiffness_modification.type === member_stiffness_modifications.TYPE_TOTAL_STIFFNESSES_FACTORS, "Modification type must be " + member_stiffness_modifications.TYPE_TOTAL_STIFFNESSES_FACTORS);
	if (typeof total_stiffness_factor_of_total_stiffness === "undefined") {
		total_stiffness_factor_of_total_stiffness = true;
	}
	this.member_stiffness_modification.total_stiffness_factor_of_total_stiffness = total_stiffness_factor_of_total_stiffness;
};

/**
 * Sets Concrete structure for ACI 318-19 Table 6.6.3.1.1(a) or CSA A23.3-19 Table 10.14.1.2
 * @param {Number} concrete_structure_component_type 	Component type (COLUMNS, BEAMS), can be undefined (COLUMNS as default)
 */
MemberStiffnessModification.prototype.SetConcreteStructure = function (concrete_structure_component_type) {
	ASSERT(this.member_stiffness_modification.type === member_stiffness_modifications.TYPE_CONCRETE_STRUCTURES_ACI || this.member_stiffness_modification.type === member_stiffness_modifications.TYPE_CONCRETE_STRUCTURES_CSA,
		"Modification type must be " + member_stiffness_modifications.TYPE_PARTIAL_STIFFNESSES_FACTORS + " or " + member_stiffness_modifications.TYPE_CONCRETE_STRUCTURES_CSA);
	this.member_stiffness_modification.concrete_structure_component_type = EnumValueFromJSHLFTypeName(
		concrete_structure_component_type,
		"concrete structure component",
		{
			"COLUMNS": member_stiffness_modifications.COMPONENT_TYPE_COLUMNS,
			"BEAMS": member_stiffness_modifications.COMPONENT_TYPE_BEAMS
		},
		member_stiffness_modifications.COMPONENT_TYPE_COLUMNS);
};

/**
 * Sets Steel structure for AISC 360-10 C2.3 or AISC 360-16 C2.3 or AISI S100-16 C1.1.1.3
 * @param {String} steel_structure_determine_tau_b 		Determine τb (ITERATIVE, SET_TO_1), can be undefined (is not set, ITERATIVE as default)
 * @param {String} steel_structure_design_method 		Design method (LRFD, ASD), can be undefined (is not set, LRFD as default)
 */
MemberStiffnessModification.prototype.SetSteelStructureAiscOrAisi = function (steel_structure_determine_tau_b,
	steel_structure_design_method) {
	ASSERT(this.member_stiffness_modification.type === member_stiffness_modifications.TYPE_STEEL_STRUCTURES_360_16 || this.member_stiffness_modification.type === member_stiffness_modifications.TYPE_STEEL_STRUCTURES_360_10 ||
		this.member_stiffness_modification.type === member_stiffness_modifications.TYPE_STEEL_STRUCTURES_S100_16,
		"Modification type must be " + member_stiffness_modifications.TYPE_STEEL_STRUCTURES_360_16 + " or " + member_stiffness_modifications.TYPE_STEEL_STRUCTURES_360_10 + " or " + member_stiffness_modifications.TYPE_STEEL_STRUCTURES_S100_16);
	this.member_stiffness_modification.steel_structure_determine_tau_b = EnumValueFromJSHLFTypeName(
		steel_structure_determine_tau_b,
		"steel structure determine tau_b",
		{
			"ITERATIVE": member_stiffness_modifications.ITERATIVE,
			"SET_TO_1": member_stiffness_modifications.SET_TO_1
		},
		member_stiffness_modifications.ITERATIVE);
	if (typeof steel_structure_design_method !== "undefined") {
		ASSERT(this.member_stiffness_modification.steel_structure_determine_tau_b === member_stiffness_modifications.ITERATIVE, "Steel structure determine tau_b must be set to " + member_stiffness_modifications.ITERATIVE + " type");
		this.member_stiffness_modification.steel_structure_design_method = EnumValueFromJSHLFTypeName(
			steel_structure_design_method,
			"steel structure design method",
			{
				"LRFD": member_stiffness_modifications.LRFD,
				"ASD": member_stiffness_modifications.ASD
			});
	}
};


/**
 * Sets Steel structure for CSA S16-19 O.2.4
 * @param {String} steel_structure_csa_determine_tau_b						Determine τb (ITERATIVE, SET_TO_1), can be undefined (is not set, ITERATIVE as default)
 * @param {String/Number} factor_of_axial_stiffness 						Axial stiffness multiplier factor (Number or APPLY_TAU_B), can be undefined (is not set, APPLY_TAU_B as default)
 * @param {String/Number} factor_of_bending_z_stiffness 					Bending stiffness in Z multiplier factor (Number or APPLY_TAU_B), can be undefined (is not set, APPLY_TAU_B as default)
 * @param {String/Number} factor_of_bending_y_stiffness 					Bending stiffness in Y multiplier factor (Number or APPLY_TAU_B), can be undefined (is not set, APPLY_TAU_B as default)
 * @param {String/Number} steel_structure_csa_stiffness_factor_of_shear_y_stiffness 	Shear stiffness in Y multiplier factor (Number or APPLY_TAU_B), can be undefined (is not set, 1.0 as default)
 * @param {String/Number} steel_structure_csa_stiffness_factor_of_shear_z_stiffness 	Shear stiffness in Z multiplier factor (Number or APPLY_TAU_B), can be undefined (is not set, 1.0 as default)
 * @param {String/Number} steel_structure_csa_stiffness_factor_of_torsion_stiffness 	Torsional stiffness multiplier factor (Number or APPLY_TAU_B), can be undefined (is not set, 1.0 as default)
 */
MemberStiffnessModification.prototype.SetSteelStructureCsa = function (steel_structure_csa_determine_tau_b,
	factor_of_axial_stiffness,
	factor_of_bending_z_stiffness,
	factor_of_bending_y_stiffness,
	steel_structure_csa_stiffness_factor_of_shear_y_stiffness,
	steel_structure_csa_stiffness_factor_of_shear_z_stiffness,
	steel_structure_csa_stiffness_factor_of_torsion_stiffness) {
	ASSERT(this.member_stiffness_modification.type === member_stiffness_modifications.TYPE_STEEL_STRUCTURES_CSA, "Modification type must be " + member_stiffness_modifications.TYPE_STEEL_STRUCTURES_CSA);
	this.member_stiffness_modification.steel_structure_csa_determine_tau_b = EnumValueFromJSHLFTypeName(
		steel_structure_csa_determine_tau_b,
		"steel structure determine tau_b",
		{
			"ITERATIVE": member_stiffness_modifications.ITERATIVE,
			"SET_TO_1": member_stiffness_modifications.SET_TO_1
		},
		member_stiffness_modifications.ITERATIVE);
	function setValue(member_stiffness_modification, value_name, value) {
		if (typeof value !== "undefined") {
			if (typeof value === "string") {
				ASSERT(value === "APPLY_TAU_B", value_name + ": APPLY_TAU_B string must be used");
				switch (value_name) {
					case "factor_of_axial_stiffness":
						member_stiffness_modification.steel_structure_csa_factor_of_axial_stiffness_enable = true;
						break;
					case "factor_of_bending_z_stiffness":
						member_stiffness_modification.steel_structure_csa_factor_of_bending_z_stiffness_enable = true;
						break;
					case "factor_of_bending_y_stiffness":
						member_stiffness_modification.steel_structure_csa_factor_of_bending_y_stiffness_enable = true;
						break;
					case "steel_structure_csa_stiffness_factor_of_shear_y_stiffness":
						member_stiffness_modification.steel_structure_csa_factor_of_shear_y_stiffness_enable = true;
						break;
					case "steel_structure_csa_stiffness_factor_of_shear_z_stiffness":
						member_stiffness_modification.steel_structure_csa_factor_of_shear_z_stiffness_enable = true;
						break;
					case "steel_structure_csa_stiffness_factor_of_torsion_stiffness":
						member_stiffness_modification.steel_structure_csa_stiffness_factor_of_torsion_stiffness_enable = true;
						break;
					default:
						ASSERT(false, "SetSteelStructureCsa: unknown property " + value_name);
				}
			}
			else {
				ASSERT(typeof value === "number", "Number must be specified");
				switch (value_name) {
					case "factor_of_axial_stiffness":
						member_stiffness_modification.steel_structure_csa_factor_of_axial_stiffness_enable = false;
						member_stiffness_modification.factor_of_axial_stiffness = factor_of_axial_stiffness;
						break;
					case "factor_of_bending_z_stiffness":
						member_stiffness_modification.steel_structure_csa_factor_of_bending_z_stiffness_enable = false;
						member_stiffness_modification.factor_of_bending_z_stiffness = factor_of_bending_z_stiffness;
						break;
					case "factor_of_bending_y_stiffness":
						member_stiffness_modification.steel_structure_csa_factor_of_bending_y_stiffness_enable = false;
						member_stiffness_modification.factor_of_bending_y_stiffness = factor_of_bending_y_stiffness;
						break;
					case "steel_structure_csa_stiffness_factor_of_shear_y_stiffness":
						member_stiffness_modification.steel_structure_csa_factor_of_shear_y_stiffness_enable = false;
						member_stiffness_modification.steel_structure_csa_stiffness_factor_of_shear_y_stiffness = steel_structure_csa_stiffness_factor_of_shear_y_stiffness;
						break;
					case "steel_structure_csa_stiffness_factor_of_shear_z_stiffness":
						member_stiffness_modification.steel_structure_csa_stiffness_factor_of_shear_z_stiffness = false;
						member_stiffness_modification.steel_structure_csa_stiffness_factor_of_shear_z_stiffness = steel_structure_csa_stiffness_factor_of_shear_z_stiffness;
						break;
					case "steel_structure_csa_stiffness_factor_of_torsion_stiffness":
						member_stiffness_modification.steel_structure_csa_stiffness_factor_of_torsion_stiffness_enable = false;
						member_stiffness_modification.steel_structure_csa_stiffness_factor_of_torsion_stiffness = steel_structure_csa_stiffness_factor_of_torsion_stiffness;
						break;
					default:
						ASSERT(false, "SetSteelStructureCsa: unknown property " + value_name);
				}
			}
		}
	}
	setValue(this.member_stiffness_modification, "factor_of_axial_stiffness", factor_of_axial_stiffness);
	setValue(this.member_stiffness_modification, "factor_of_bending_z_stiffness", factor_of_bending_z_stiffness);
	setValue(this.member_stiffness_modification, "factor_of_bending_y_stiffness", factor_of_bending_y_stiffness);
	setValue(this.member_stiffness_modification, "steel_structure_csa_stiffness_factor_of_shear_y_stiffness", steel_structure_csa_stiffness_factor_of_shear_y_stiffness);
	setValue(this.member_stiffness_modification, "steel_structure_csa_stiffness_factor_of_shear_z_stiffness", steel_structure_csa_stiffness_factor_of_shear_z_stiffness);
	setValue(this.member_stiffness_modification, "steel_structure_csa_stiffness_factor_of_torsion_stiffness", steel_structure_csa_stiffness_factor_of_torsion_stiffness);
};

/**
 * Sets Steel structure for GB 50017-2017 Chap. 5.5.8
 * @param {Boolean} steel_structure_gb_direct_method_enabled 	Direct method acc. to 5.5.8 with Nd > 0.5 A f
 * @param {Number} factor_of_bending_z_stiffness 				Bending stiffness in Z multiplier factor, can be undefined (is not set, 0.8 as default)
 * @param {Number} factor_of_bending_y_stiffness				Bending stiffness in Y multiplier factor, can be undefined (is not set, 0.8 as default)
 */
MemberStiffnessModification.prototype.SetSteelStructureGb = function (steel_structure_gb_direct_method_enabled,
	factor_of_bending_z_stiffness,
	factor_of_bending_y_stiffness) {
	ASSERT(this.member_stiffness_modification.type === member_stiffness_modifications.TYPE_STEEL_STRUCTURES_GB, "Modification type must be " + member_stiffness_modifications.TYPE_STEEL_STRUCTURES_GB);
	if (typeof steel_structure_gb_direct_method_enabled !== "undefined") {
		this.member_stiffness_modification.steel_structure_gb_direct_method_enabled = steel_structure_gb_direct_method_enabled;
	}
	if (typeof factor_of_bending_z_stiffness !== "undefined") {
		ASSERT(!this.member_stiffness_modification.steel_structure_gb_direct_method_enabled, "Direct method must be set off");
		this.member_stiffness_modification.factor_of_bending_z_stiffness = factor_of_bending_z_stiffness;
	}
	if (typeof factor_of_bending_y_stiffness !== "undefined") {
		ASSERT(!this.member_stiffness_modification.steel_structure_gb_direct_method_enabled, "Direct method must be set off");
		this.member_stiffness_modification.factor_of_bending_y_stiffness = factor_of_bending_y_stiffness;
	}
};

function GetMemberStiffnessModificationConcreteStructureComponentType (component_type) {
	const component_types_dict = {
		"COLUMNS": member_stiffness_modifications.COMPONENT_TYPE_COLUMNS,
		"BEAMS": member_stiffness_modifications.COMPONENT_TYPE_BEAMS
	};

	if (component_type !== undefined) {
	  var type = component_types_dict[component_type];
	  if (type === undefined) {
		console.log("Wrong concrete structure component type. Value was: " + component_type);
		console.log("Correct values are: ( " + Object.keys(component_types_dict) + ")");
		type = member_stiffness_modifications.COMPONENT_TYPE_COLUMNS;
	  }
	  return type;
	}
	else {
	  return member_stiffness_modifications.COMPONENT_TYPE_COLUMNS;
	}
}
