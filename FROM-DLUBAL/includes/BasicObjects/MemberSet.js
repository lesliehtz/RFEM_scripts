/**
 * Create Member Set
 * @class
 * @constructor
 * @param {int} no - Number of Member Set
 * @param {array} members - List of the number of the members
 * @param {string} comment - Comment for the Member Set
 * @param {dictionary} params - Parameters of the Member Set
 * @returns memberSet
 */
function MemberSet(no,
    members,
    comment,
    params) {
    if (arguments.length !== 0) {
        members = typeof members !== 'undefined' ? members : [];

        this.member_set = engine.create_member_set(no, members);
        set_comment_and_parameters(this.member_set, comment, params);
        return this.member_set;
    }
}

/**
 * @returns Number of member set
 */
MemberSet.prototype.GetNo = function() {
    return this.member_set.no;
};

/**
 * @returns Member set object
 */
MemberSet.prototype.GetMemberSet = function() {
    return this.member_set;
};

/**
 * Sets name
 * @param {String} name 	Name
 */
MemberSet.prototype.SetName = function (name) {
	this.member_set.name = name;
};

/**
 * Enable / disable Design properties for member set (Steel design add-on)
 * @param {Boolean} enabled     Enable / disable Design properties, can be undefined (true as default)
 */
MemberSet.prototype.SetSteelDesignSupport = function (enabled) {
	ASSERT(STEEL_DESIGN.isActive(), "Steel design add-on must be active");
	if (typeof enabled === "undefined") {
		enabled = true;
	}
	for (var i = 0; i < this.member_set.members.length; ++i) {
		var member = this.member_set.members[i];
		ASSERT(__hasSteelSection(member.section_start) && __hasSteelSection(member.section_end), "Member no. " + member.no + " must have section with " + materials.TYPE_STEEL + " material type");
	}
	this.member_set.design_properties_activated = enabled;
}

/**
 * Sets Steel design types
 * @param {Number} steel_effective_lengths_no 					Effective length number, can be undefined
 * @param {Number} steel_boundary_conditions_no 				Boundary condition number, can be undefined
 * @param {Number} steel_member_local_section_reduction_no 		Member local section reduction number, can be undefined
 */
MemberSet.prototype.SetSteelDesignTypes = function (steel_effective_lengths_no,
	steel_boundary_conditions_no,
	steel_member_local_section_reduction_no) {
	ASSERT(STEEL_DESIGN.isActive(), "Steel design add-on must be active");
	if (typeof steel_effective_lengths_no !== "undefined" && __objectExists(steel_effective_lengths_no, "Effective length", steel_effective_lengths)) {
		this.member_set.steel_effective_lengths = steel_effective_lengths_no;
	}
	if (typeof steel_boundary_conditions_no !== "undefined") {
		ASSERT(Member_IsSteelDesignCurrentCodeOfStandard("EN") || Member_IsSteelDesignCurrentCodeOfStandard("NTC"), "Boundary condition can be set only for EN, NTC code of standards");
		if (__objectExists(steel_boundary_conditions_no, "Boundary condition", steel_boundary_conditions)) {
			this.member_set.steel_boundary_conditions = steel_boundary_conditions_no;
		}
	}
	if (typeof steel_member_local_section_reduction_no !== "undefined" && __objectExists(steel_member_local_section_reduction_no, "Member local section reduction", steel_member_local_section_reductions)) {
		this.member_set.steel_member_local_section_reductions = steel_member_local_section_reduction_no;
	}
};

/**
 * Create Continuous Member memberSet type
 * @param {int} no - Number of Member Set
 * @param {array} members - List of the number of the members
 * @param {string} comment - Comment for the Member Set
 * @param {dictionary} params - Parameters of the Member Set
 */
MemberSet.prototype.ContinuousMembers = function (no,
    members,
    comment,
    params) {
    if (typeof (members) !== "undefined") {
        members = typeof members !== 'undefined' ? members : [];
        this.member_set = engine.create_member_set(no, members);
        this.member_set.set_type = member_sets.SET_TYPE_CONTINUOUS;
        set_comment_and_parameters(this.member_set, comment, params);
    }
};

/**
 * Create Group of  Member memberSet type
 * @param {int} no - Number of Member Set
 * @param {array} members - List of the number of the members
 * @param {string} comment - Comment for the Member Set
 * @param {dictionary} params - Parameters of the Member Set
 */
MemberSet.prototype.GroupOfMembers = function (no,
    members,
    comment,
    params) {
    if (typeof (members) !== "undefined") {
        members = typeof members !== 'undefined' ? members : [];
        this.member_set = engine.create_member_set(no, members);
        this.member_set.set_type = member_sets.SET_TYPE_GROUP;
        set_comment_and_parameters(this.member_set, comment, params);
    }
};

MemberSet.prototype.GetNo = function(){
	return this.member_set.no;
};

MemberSet.prototype.GetMember = function (){
	return this.member_set;
};

/**
 * Sets Design supports
 * @param {Number} design_support_on_member_set_start 	Design support at member start, can be undefined
 * @param {Number} design_support_on_member_set_end 	Design support at member end, can be undefined
 */
MemberSet.prototype.SetSteelDesignSupportAtMemberStartAndEnd = function (design_support_on_member_set_start,
	design_support_on_member_set_end) {
	ASSERT(STEEL_DESIGN.isActive(), "Steel design add-on must be active");
	if (typeof design_support_on_member_set_start !== "undefined") {
		if (__objectExists(design_support_on_member_set_start, "Design support", design_supports)) {
			this.member_set.design_support_on_member_set_start = design_support_on_member_set_start;
		}
	}
	if (typeof design_support_on_member_set_end !== "undefined") {
		if (__objectExists(design_support_on_member_set_end, "Design support", design_supports)) {
			this.member_set.design_support_on_member_set_end = design_support_on_member_set_end;
		}
	}
};

/**
 * Sets Design supports at internal nodes (Function takes arguments as design properties numbers)
 */
MemberSet.prototype.SetDesignSupportAtInternalNodes = function () {
	ASSERT(arguments.length < this.member_set.members.length, "Arguments count must be less then " + this.member_set.members.length);
	for (var i = 0; i < arguments.length; ++i) {
		if (typeof arguments[i] !== "undefined") {
			if (__objectExists(arguments[i], "Design support", design_supports)) {
				this.member_set.design_supports_on_internal_nodes[i + 1].design_support = arguments[i];
			}
		}
	}
};

/**
 * Enable / disable Concrete design support, van be undefined (true as default)
 * @param {Boolean} design_properties_activated 	Design properties
 */
MemberSet.prototype.SetConcreteDesignSupport = function (design_properties_activated) {
	ASSERT(CONCRETE_DESIGN.isActive(), "Concrete design add-on must be active");
	if (typeof design_properties_activated === "undefined") {
		design_properties_activated = true;
	}
	this.member_set.design_properties_activated = design_properties_activated;
};

/**
 * Sets Effective length for stability design using equivalent member method
 * @param {Number} concrete_effective_length_no 	Effective length number
 */
MemberSet.prototype.SetConcreteDesignEffectiveLength = function (concrete_effective_length_no) {
	SetMemberConcreteDesignEffectiveLength(this.member_set, concrete_effective_length_no);
};

/**
 * Sets User-defined concrete cover
 * @param {Number} concrete_cover 	Concrete cover
 */
MemberSet.prototype.SetConcreteDesignUserDefineConcreteCoverAllSectionSides = function (concrete_cover) {
	SetMemberConcreteDesignUserDefineConcreteCover(this.member_set, concrete_cover);
};

/**
 * Sets User-defined concrete cover on each section sides
 * @param {Number} concrete_cover_top 		Concrete cover on top side, can be undefined (is not set, 30 mm as default)
 * @param {Number} concrete_cover_left 		Concrete cover on left side, can be undefined (is not set, 30 mm as default)
 * @param {Number} concrete_cover_right 	Concrete cover on right side, can be undefined (is not set, 30 mm as default)
 * @param {Number} concrete_cover_bottom 	Concrete cover on bottom side, can be undefined (is not set, 30 mm as default)
 */
MemberSet.prototype.SetConcreteDesignUserDefineConcreteCoverOnEachSide = function (concrete_cover_top,
	concrete_cover_left,
	concrete_cover_right,
	concrete_cover_bottom) {
	SetMemberConcreteDesignUserDefineConcreteCoverOnEachSide(this.member_set, concrete_cover_top, concrete_cover_left, concrete_cover_right, concrete_cover_bottom);
};

/**
 * Sets Concrete durability on all section sides
 * @param {Number} concrete_durability_no 	Concrete durability number
 */
MemberSet.prototype.SetConcreteDesignConcreteDurabilityAllSectionSides = function (concrete_durability_no) {
	SetMemberConcreteDesignConcreteDurabilityAllSectionSides(this.member_set, concrete_durability_no);
};

/**
 * Sets Concrete durability on each section side
 * @param {Number} concrete_durability_top_no 		Concrete durability on top side, can be undefined (is not set, first concrete durability)
 * @param {Number} concrete_durability_left_no 		Concrete durability on left side, can be undefined (is not set, first concrete durability)
 * @param {Number} concrete_durability_right_no 	Concrete durability on right side, can be undefined (is not set, first concrete durability)
 * @param {Number} concrete_durability_bottom_no 	Concrete durability on bottom side, can be undefined (is not set, first concrete durability)
 */
MemberSet.prototype.SetConcreteDesignConcreteDurabilityOnEachSide = function (concrete_durability_top_no,
	concrete_durability_left_no,
	concrete_durability_right_no,
	concrete_durability_bottom_no) {
	SetMemberConcreteDesignConcreteDurabilityOnEachSide(this.member_set, concrete_durability_top_no, concrete_durability_left_no, concrete_durability_right_no, concrete_durability_bottom_no);
};

/**
 * Sets Minimum concrete cover according to standard
 * @param {Number} concrete_cover_min 	Minimal concrete cover on all section sides
 */
MemberSet.prototype.SetConcreteDesignMinimumConcreteCoverAllSectionSides = function (concrete_cover_min) {
	SetMemberConcreteDesignMinimumConcreteCoverAllSectionSides(this.member_set, concrete_cover_min);
};

/**
 * Sets Minimum concrete cover on each section side, according to standard
 * @param {Number} concrete_cover_min_top 		Concrete cover on top section side, can be undefined (is not set, 30 mm as default)
 * @param {Number} concrete_cover_min_left 		Concrete cover on left section side, can be undefined (is not set, 30 mm as default)
 * @param {Number} concrete_cover_min_right 	Concrete cover on right section side, can be undefined (is not set, 30 mm as default)
 * @param {Number} concrete_cover_min_bottom 	Concrete cover on bottom section side, can be undefined (is not set, 30 mm as default)
 */
MemberSet.prototype.SetConcreteDesignMinimumConcreteCoverOnEachSide = function (concrete_cover_min_top,
	concrete_cover_min_left,
	concrete_cover_min_right,
	concrete_cover_min_bottom) {
	SetMemberConcreteDesignMinimumConcreteCoverOnEachSide(this.member_set, concrete_cover_min_top, concrete_cover_min_left, concrete_cover_min_right, concrete_cover_min_bottom);
};

/**
 * Adds Shear reinforcement
 * @returns 	Number of shear reinforcement
 */
MemberSet.prototype.AddConcreteDesignShearReinforcement = function () {
	return MemberAddConcreteDesignShearReinforcement(this.member_set);
};

/**
 * Removes shear reinforcement
 * @param {Number} shear_reinforcement_no 	Shear reinforcement number
 */
MemberSet.prototype.RemoveConcreteDesignShearReinforcement = function(shear_reinforcement_no) {
	MemberRemoveConcreteDesignShearReinforcement(this.member_set, shear_reinforcement_no);
};

/**
 * Sets Shear reinforcement Base data
 * @param {Number} shear_reinforcement_no 	Shear Reinforcement number
 * @param {Number} material_no 				Material number
 * @param {String} stirrup_type 			Stirrup type (TWO_LEGGED_CLOSED_HOOK_135, TWO_LEGGED_CLOSED_HOOK_90, TWO_LEGGED_OPEN, THREE_LEGGED_CLOSED_HOOK_135,
 *												THREE_LEGGED_CLOSED_HOOK_90, FOUR_LEGGED_CLOSED_HOOK_135, FOUR_LEGGED_CLOSED_HOOK_90, TWO_LEGGED_OVERLAP_HOOK_180,
 *												THREE_LEGGED_OVERLAP_HOOK_180, FOUR_LEGGED_OVERLAP_HOOK_180), can be undefined (TWO_LEGGED_CLOSED_HOOK_135 as default)
 */
 MemberSet.prototype.SetConcreteDesignShearReinforcementBaseData = function (shear_reinforcement_no,
	material_no,
	stirrup_type) {
	MemberSetConcreteDesignShearReinforcementBaseData(this.member_set, shear_reinforcement_no, material_no, stirrup_type);
};

/**
 * Sets Shear reinforcement areas
 * @param {Number} shear_reinforcement_no 	Shear reinforcement number
 * @param {Number} reinforcement_area 		Area
 */
MemberSet.prototype.SetConcreteDesignShearReinforcementAreas = function (shear_reinforcement_no,
	reinforcement_area) {
	MemberSetConcreteDesignShearReinforcementAreas(this.member_set, shear_reinforcement_no, reinforcement_area);
};

/**
 * Sets Shear reinforcement span location
 * @param {Number} shear_reinforcement_no 				Shear reinforcement number
 * @param {String} span_position_reference_type 		Reference (START, END, X_LOCATION), can be undefined (START as default)
 * @param {Number} span_start 							Start, can be undefined
 * @param {Number} span_end 							End, can be undefined
 * @param {Number} span_position_reference_x_location 	x-Location, can be undefined
 * @param {Boolean} definition_format_absolute 			Definition format (absolute, relative), can be undefined (true as default)
 */
MemberSet.prototype.SetConcreteDesignShearReinforcementSpanLocation = function (shear_reinforcement_no,
	span_position_reference_type,
	span_start,
	span_end,
	span_position_reference_x_location,
	definition_format_absolute) {
	MemberSetConcreteDesignShearReinforcementSpanLocation(this.member_set, shear_reinforcement_no, span_position_reference_type, span_start, span_end, span_position_reference_x_location, definition_format_absolute);
};

/**
 * Sets Shear reinforcement stirrup parameters
 * @param {Number} shear_reinforcement_no 	Shear reinforcement number
 * @param {Number} stirrup_diameter 		Bar diameter, can be undefined (is not set, 10 mm as default)
 * @param {Number} stirrup_distances 		Distance, can be undefined (is not set, 0.3 m as default)
 * @param {Number} stirrup_count 			Number, can be undefined (is not set, 11 as default)
 * @param {Boolean} crossties_active 		Crossties over free rebars with active selection in graphic, can be undefined (is not set, false as default)
 * @param {Number} crossties_diameter 		Bar diameter, can be undefined (is not set, 10 mm as default)
 */
MemberSet.prototype.SetConcreteDesignShearReinforcementStirrupParameters = function (shear_reinforcement_no,
	stirrup_diameter,
	stirrup_distances,
	stirrup_count,
	crossties_active,
	crossties_diameter) {
	MemberSetConcreteDesignShearReinforcementStirrupParameters(this.member_set, shear_reinforcement_no, stirrup_diameter, stirrup_distances, stirrup_count, crossties_active, crossties_diameter);
};

/**
 * Sets Border distance of stirrups
 * @param {Number} shear_reinforcement_no 	Shear reinforcement number
 * @param {String} stirrup_layout_rule 		Layout rule (START_EQUALS_END, START_DEFINED, START_EQUALS_REST_LENGTH_TO_STIRRUP_DISTANCED, END_DEFINED, END_EQUALS_REST_LENGTH_TO_STIRRUP_DISTANCED), can be undefined (START_EQUALS_END as default)
 */
MemberSet.prototype.SetConcreteDesignShearReinforcementBorderDistancesOfStirrups = function (shear_reinforcement_no,
	stirrup_layout_rule) {
	MemberSetConcreteDesignShearReinforcementBorderDistancesOfStirrups(this.member_set, shear_reinforcement_no, stirrup_layout_rule);
};

/**
 * Adds Longitudinal reinforcement
 * @returns 	Number of longitudinal reinforcement
 */
MemberSet.prototype.AddConcreteDesignLongitudinalReinforcement = function () {
	return MemberAddConcreteDesignLongitudinalReinforcement(this.member_set);
};

/**
 * Removes longitudinal reinforcement
 * @param {Number} longitudinal_reinforcement_no 	Longitudinal reinforcement number
 */
MemberSet.prototype.RemoveConcreteDesignLongitudinalReinforcement = function(longitudinal_reinforcement_no) {
	MemberRemoveConcreteDesignLongitudinalReinforcement(this.member_set, longitudinal_reinforcement_no);
};

/**
 * Sets Longitudinal reinforcement Base data
 * @param {Number} longitudinal_reinforcement_no 						Longitudinal reinforcement number
 * @param {String} rebar_type 											Rebar type (SYMMETRICAL, UNSYMMETRICAL, UNIFORMLY_SURROUNDING, LINE, SINGLE), can be undefined (SYMMETRICAL as default)
 * @param {Number} material_no 											Material number
 * @param {Boolean} reinforcement_placed_in_bending_corner_enabled 		Reinforcement placed in the bent corner of thi stirrup (column), can be undefined (is not set, false as default)
 */
MemberSet.prototype.SetConcreteDesignLongitudinalReinforcementBaseData = function (longitudinal_reinforcement_no,
	rebar_type,
	material_no,
	reinforcement_placed_in_bending_corner_enabled) {
	MemberSetConcreteDesignLongitudinalReinforcementBaseData(this.member_set, longitudinal_reinforcement_no, rebar_type, material_no, reinforcement_placed_in_bending_corner_enabled);
};

/**
 * Sets Longitudinal reinforcement rebar symmetrical parameters
 * @param {Number} longitudinal_reinforcement_no 		Longitudinal reinforcement number
 * @param {Number} bar_count_symmetrical 				Number of bars | Side, can be undefined (is not set, 3 as default)
 * @param {Number} bar_diameter_symmetrical 			Bar diameter | Side, can be undefined (is not set, 20 mm as default)
 * @param {Boolean} corner_reinforcement_enabled 		Corner reinforcement, can be undefined (is not set, false as default)
 * @param {Number} bar_diameter_corner 					Bar diameter | Corner, can be undefined (is not set, 20 mm as default)
 */
MemberSet.prototype.SetConcreteDesignLongitudinalReinforcementSymmetricalRebarParameters = function (longitudinal_reinforcement_no,
	bar_count_symmetrical,
	bar_diameter_symmetrical,
	corner_reinforcement_enabled,
	bar_diameter_corner) {
	MemberSetConcreteDesignLongitudinalReinforcementSymmetricalRebarParameters(this.member_set, longitudinal_reinforcement_no, bar_count_symmetrical, bar_diameter_symmetrical, corner_reinforcement_enabled, bar_diameter_corner);
};

/**
 * Sets Longitudinal reinforcement rebar unsymmetrical parameters
 * @param {Number} longitudinal_reinforcement_no 			Longitudinal reinforcement number
 * @param {Number} bar_count_unsymmetrical_top_side 		Number of bars | Top side, can be undefined (is not set, 3 as default)
 * @param {Number} bar_diameter_unsymmetrical_top_side 		Bar diameter | Top side, can be undefined (is not set, 20 mm as default)
 * @param {Number} bar_count_unsymmetrical_at_side 			Number of bars | Lateral side, can be undefined (is not set, 0 as default)
 * @param {Number} bar_diameter_unsymmetrical_at_side 		Bar diameter | Lateral side, can be undefined (is not set, 10 mm as default)
 * @param {Number} bar_count_unsymmetrical_bottom_side 		Number of bars | Bottom side, can be undefined (is not set, 3 as default)
 * @param {Number} bar_diameter_unsymmetrical_bottom_side 	Bar diameter | Bottom side, can be undefined (is not set, 20 mm as default)
 * @param {Boolean} corner_reinforcement_enabled 			Corner reinforcement, can be undefined (is not set, false as default)
 * @param {Number} bar_diameter_corner 						Bar diameter | Corner, can be undefined (is not set, 20 mm as default)
 */
MemberSet.prototype.SetConcreteDesignLongitudinalReinforcementUnSymmetricalRebarParameters = function (longitudinal_reinforcement_no,
	bar_count_unsymmetrical_top_side,
	bar_diameter_unsymmetrical_top_side,
	bar_count_unsymmetrical_at_side,
	bar_diameter_unsymmetrical_at_side,
	bar_count_unsymmetrical_bottom_side,
	bar_diameter_unsymmetrical_bottom_side,
	corner_reinforcement_enabled,
	bar_diameter_corner) {
	MemberSetConcreteDesignLongitudinalReinforcementUnSymmetricalRebarParameters(this.member_set, longitudinal_reinforcement_no, bar_count_unsymmetrical_top_side, bar_diameter_unsymmetrical_top_side, 
		bar_count_unsymmetrical_at_side, bar_diameter_unsymmetrical_at_side, bar_count_unsymmetrical_bottom_side, bar_diameter_unsymmetrical_bottom_side, corner_reinforcement_enabled,
		bar_diameter_corner);
};

/**
 * Sets Longitudinal reinforcement rebar uniformly surrounding parameters
 * @param {Number} longitudinal_reinforcement_no 		Longitudinal reinforcement number
 * @param {Number} bar_count_uniformly_surrounding 		Number of bars, can be undefined (is not set, 4 as default)
 * @param {Number} bar_diameter_uniformly_surrounding 	Bar diameter, can be undefined (is not set, 20 mm as default)
 * @param {Boolean} corner_reinforcement_enabled 		Corner reinforcement, can be undefined (is not set, false as default)
 * @param {Number} bar_diameter_corner 					Bar diameter | Corner, can be undefined (is not set, 20 mm as default)
 */
MemberSet.prototype.SetConcreteDesignLongitudinalReinforcementUniformlySurroundingRebarParameters = function (longitudinal_reinforcement_no,
	bar_count_uniformly_surrounding,
	bar_diameter_uniformly_surrounding,
	corner_reinforcement_enabled,
	bar_diameter_corner) {
	MemberSetConcreteDesignLongitudinalReinforcementUniformlySurroundingRebarParameters(this.member_set, longitudinal_reinforcement_no, bar_count_uniformly_surrounding, bar_diameter_uniformly_surrounding, 
		corner_reinforcement_enabled, bar_diameter_corner);
};

/**
 * Sets Longitudinal reinforcement rebar line parameters
 * @param {Number} longitudinal_reinforcement_no 				Longitudinal reinforcement number
 * @param {Number} bar_count_line 								Number of bars, can be undefined (is not set, 2 as default)
 * @param {Number} bar_diameter_line 							Bar diameter, can be undefined (is not set, 20 mm as default)
 * @param {String} additional_offset_type 						Offset type (NONE, FROM_STIRRUP, FROM_CONCRETE_COVER, FROM_SECTION_SURFACE), can be undefined (FROM_STIRRUP as default)
 * @param {String} additional_offset_reference_type_at_start 	Reference | Start (LEFT_TOP, LEFT_CENTER, LEFT_BOTTOM, CENTER_TOP, CENTER_CENTER, CENTER_BOTTOM, RIGHT_TOP, RIGHT_CENTER, RIGHT_BOTTOM), can be undefined (LEFT_BOTTOM as default)
 * @param {Number} additional_horizontal_offset_at_start 		Horizontal offset | Start, can be undefined (is not set, 0 mm)
 * @param {Number} additional_vertical_offset_at_start 			Vertical offset | Start, can be undefined (is not set, 40 mm as default)
 * @param {String} additional_offset_reference_type_at_end 		Reference | End (LEFT_TOP, LEFT_CENTER, LEFT_BOTTOM, CENTER_TOP, CENTER_CENTER, CENTER_BOTTOM, RIGHT_TOP, RIGHT_CENTER, RIGHT_BOTTOM), can be undefined (LEFT_TOP as default)
 * @param {Number} additional_horizontal_offset_at_end 			Horizontal reference | End, can be undefined (is not set, 0 mm as default)
 * @param {Number} additional_vertical_offset_at_end 			Vertical offset | End, can be undefined (is not set, 40 mm as default)
 */
MemberSet.prototype.SetConcreteDesignLongitudinalReinforcementLineRebarParameters = function (longitudinal_reinforcement_no,
	bar_count_line,
	bar_diameter_line,
	additional_offset_type_single_line,
	additional_offset_reference_type_at_start,
	additional_horizontal_offset_at_start,
	additional_vertical_offset_at_start,
	additional_offset_reference_type_at_end,
	additional_horizontal_offset_at_end,
	additional_vertical_offset_at_end) {
	MemberSetConcreteDesignLongitudinalReinforcementLineRebarParameters(this.member_set, longitudinal_reinforcement_no, bar_count_line, bar_diameter_line, additional_offset_type_single_line,
		additional_offset_reference_type_at_start, additional_horizontal_offset_at_start, additional_vertical_offset_at_start, additional_offset_reference_type_at_end,
		additional_horizontal_offset_at_end, additional_vertical_offset_at_end);
};

/**
 * Sets Longitudinal reinforcement rebar single parameters
 * @param {Number} longitudinal_reinforcement_no 		Longitudinal reinforcement number
 * @param {Number} additional_offset_type_single_line	Bar diameter, can be undefined (is not set, 20 mm as default)
 * @param {String} additional_offset_type 				Offset type (NONE, FROM_STIRRUP, FROM_CONCRETE_COVER, FROM_SECTION_SURFACE), can be undefined (FROM_STIRRUP as default)
 * @param {String} additional_offset_reference_type 	Reference (LEFT_TOP, LEFT_CENTER, LEFT_BOTTOM, CENTER_TOP, CENTER_CENTER, CENTER_BOTTOM, RIGHT_TOP, RIGHT_CENTER, RIGHT_BOTTOM), can be undefined (CENTER_BOTTOM as default)
 * @param {Number} additional_horizontal_offset 		Horizontal offset, can be undefined (is not set, 0 mm as default)
 * @param {Number} additional_vertical_offset 			Vertical offset, can be undefined (is not set, 40 mm as default)
 */
MemberSet.prototype.SetConcreteDesignLongitudinalReinforcementSingleRebarParameters = function (longitudinal_reinforcement_no,
	bar_diameter_single,
	additional_offset_type_single_line,
	additional_offset_reference_type,
	additional_horizontal_offset,
	additional_vertical_offset) {
	MemberSetConcreteDesignLongitudinalReinforcementSingleRebarParameters(this.member_set, longitudinal_reinforcement_no, bar_diameter_single, additional_offset_type_single_line, additional_offset_reference_type,
		additional_horizontal_offset, additional_vertical_offset);
};

/**
 * Sets Longitudinal reinforcement symmetrical areas
 * @param {Number} longitudinal_reinforcement_no 	Longitudinal reinforcement number
 * @param {Number} reinforcement_area_symmetrical 	Side
 */
MemberSet.prototype.SetConcreteDesignLongitudinalReinforcementSymmetricalAreas = function (longitudinal_reinforcement_no,
	reinforcement_area_symmetrical) {
	MemberSetConcreteDesignLongitudinalReinforcementSymmetricalAreas(this.member_set, longitudinal_reinforcement_no, reinforcement_area_symmetrical);
};

/**
 * Sets Longitudinal reinforcement unsymmetrical areas
 * @param {Number} longitudinal_reinforcement_no 					Longitudinal reinforcement number
 * @param {Number} reinforcement_area_unsymmetrical_top_side 		Top side, can be undefined
 * @param {Number} reinforcement_area_unsymmetrical_at_side 		Lateral sides, can be undefined
 * @param {Number} reinforcement_area_unsymmetrical_bottom_side 	Bottom side, can be undefined
 */
MemberSet.prototype.SetConcreteDesignLongitudinalReinforcementUnSymmetricalAreas = function (longitudinal_reinforcement_no,
	reinforcement_area_unsymmetrical_top_side,
	reinforcement_area_unsymmetrical_at_side,
	reinforcement_area_unsymmetrical_bottom_side) {
	MemberSetConcreteDesignLongitudinalReinforcementUnSymmetricalAreas(this.member_set, longitudinal_reinforcement_no, reinforcement_area_unsymmetrical_top_side, reinforcement_area_unsymmetrical_at_side,
		reinforcement_area_unsymmetrical_bottom_side);
};

/**
 * Sets Longitudinal reinforcement uniformly surrounding areas
 * @param {Number} longitudinal_reinforcement_no 				Longitudinal reinforcement number
 * @param {Number} reinforcement_area_uniformly_surrounding 	Reinforcement area
 */
MemberSet.prototype.SetConcreteDesignLongitudinalReinforcementUniformlySurroundingAreas = function (longitudinal_reinforcement_no,
	reinforcement_area_uniformly_surrounding) {
	MemberSetConcreteDesignLongitudinalReinforcementUniformlySurroundingAreas(this.member_set, longitudinal_reinforcement_no, reinforcement_area_uniformly_surrounding);
};

/**
 * Sets Longitudinal reinforcement line areas
 * @param {Number} longitudinal_reinforcement_no 	Longitudinal reinforcement number
 * @param {Number} reinforcement_area_line 			Total
 */
MemberSet.prototype.SetConcreteDesignLongitudinalReinforcementLineAreas = function (longitudinal_reinforcement_no,
	reinforcement_area_line) {
	MemberSetConcreteDesignLongitudinalReinforcementLineAreas(this.member_set, longitudinal_reinforcement_no, reinforcement_area_line);
};

/**
 * Sets Longitudinal reinforcement single areas
 * @param {Number} longitudinal_reinforcement_no 	Longitudinal reinforcement number
 * @param {Number} reinforcement_area_single 		Total
 */
MemberSet.prototype.SetConcreteDesignLongitudinalReinforcementSingleAreas = function (longitudinal_reinforcement_no,
	reinforcement_area_single) {
	MemberSetConcreteDesignLongitudinalReinforcementSingleAreas(this.member_set, longitudinal_reinforcement_no, reinforcement_area_single);
};

/**
 * Sets longitudinal reinforcement span location
 * @param {Number} shear_reinforcement_no 				Longitudinal reinforcement number
 * @param {String} span_position_reference_type 		Reference (START, END, X_LOCATION), can be undefined (START as default)
 * @param {Number} span_start 							Start, can be undefined
 * @param {Number} span_end 							End, can be undefined
 * @param {Number} span_position_reference_x_location 	x-Location, can be undefined
 * @param {Boolean} definition_format_absolute 			Definition format (absolute, relative), can be undefined (true as default)
 */
MemberSet.prototype.SetConcreteDesignLongitudinalReinforcementSpanLocation = function (longitudinal_reinforcement_no,
	span_position_reference_type,
	span_start,
	span_end,
	span_position_reference_x_location,
	definition_format_absolute) {
	MemberSetConcreteDesignLongitudinalReinforcementSpanLocation(this.member_set, longitudinal_reinforcement_no, span_position_reference_type, span_start, span_end, span_position_reference_x_location,
		definition_format_absolute);
};

/**
 * Sets Longitudinal reinforcement additional offset
 * @param {Number} longitudinal_reinforcement_no 	Longitudinal reinforcement number
 * @param {String} additional_offset_type 			Offset type (NONE, FROM_STIRRUP, FROM_CONCRETE_COVER, FROM_SECTION_SURFACE)
 * @param {Number} additional_offset_top_side 		Top side, can be undefined (is not set, 0 mm as default)
 * @param {Number} additional_offset_bottom_side 	Bottom side, can be undefined (is not set, 0 mm as default)
 * @param {Number} additional_offset_left_side 		Left side, can be undefined (is not set, 0 mm as default)
 * @param {Number} additional_offset_right_side 	Right side, can be undefined (is not set, 0 mm as default)
 */
MemberSet.prototype.SetConcreteDesignLongitudinalReinforcementAdditionalOffset = function (longitudinal_reinforcement_no,
	additional_offset_type,
	additional_offset_top_side,
	additional_offset_bottom_side,
	additional_offset_left_side,
	additional_offset_right_side) {
	MemberSetConcreteDesignLongitudinalReinforcementAdditionalOffset(this.member_set, longitudinal_reinforcement_no, additional_offset_type, additional_offset_top_side, additional_offset_bottom_side,
		additional_offset_left_side, additional_offset_right_side);
};

/**
 * Sets Longitudinal reinforcement anchorage start
 * @param {Number} longitudinal_reinforcement_no 		Longitudinal reinforcement number
 * @param {String} anchorage_start_anchor_type 			Anchorage type (NONE, STRAIGHT, HOOK, BEND, STRAIGHT_WITH_TRANSVERSE_BAR, HOOK_WITH_TRANSVERSE_BAR, STRAIGHT_WITH_TWO_TRANSVERSE_BARS)
 * @param {Number} anchorage_start_anchor_length 		Anchor length, can be undefined
 * @param {Number} anchorage_start_bending_diameter 	Bending diameter, can be undefined
 */
MemberSet.prototype.SetConcreteDesignLongitudinalReinforcementAnchorageStart = function (longitudinal_reinforcement_no,
	anchorage_start_anchor_type,
	anchorage_start_anchor_length,
	anchorage_start_bending_diameter) {
	MemberSetConcreteDesignLongitudinalReinforcementAnchorageStart(this.member_set, longitudinal_reinforcement_no, anchorage_start_anchor_type, anchorage_start_anchor_length, anchorage_start_bending_diameter);
};

/**
 * Sets Longitudinal reinforcement anchorage end
 * @param {Number} longitudinal_reinforcement_no 	Longitudinal reinforcement number
 * @param {String} anchorage_end_anchor_type 		Anchorage type (NONE, STRAIGHT, HOOK, BEND, STRAIGHT_WITH_TRANSVERSE_BAR, HOOK_WITH_TRANSVERSE_BAR, STRAIGHT_WITH_TWO_TRANSVERSE_BARS)
 * @param {Number} anchorage_end_anchor_length 		Anchor length, can be undefined
 * @param {Number} anchorage_end_bending_diameter 	Bending diameter, can be undefined
 */
MemberSet.prototype.SetConcreteDesignLongitudinalReinforcementAnchorageEnd = function (longitudinal_reinforcement_no,
	anchorage_end_anchor_type,
	anchorage_end_anchor_length,
	anchorage_end_bending_diameter) {
	MemberSetConcreteDesignLongitudinalReinforcementAnchorageEnd(this.member_set, longitudinal_reinforcement_no, anchorage_end_anchor_type, anchorage_end_anchor_length, anchorage_end_bending_diameter);
};

/**
 * Sets Steel design configurations (Steel design add-on)
 * @param {Number} member_steel_design_uls_configuration_no 	Ultimate configuration number, can be undefined
 * @param {Number} member_steel_design_sls_configuration_no 	Serviceability configuration number, can be undefined
 * @param {Number} member_steel_design_fr_configuration_no 		Fire resistance configuration number, can be undefined
 */
MemberSet.prototype.SetDesignConfigurations = function (member_steel_design_uls_configuration_no,
	member_steel_design_sls_configuration_no,
	member_steel_design_fr_configuration_no) {
	ASSERT(this.member_set.design_properties_activated, "Design properties must be on");
	if (typeof member_steel_design_uls_configuration_no !== "undefined") {
		ASSERT(!Member_IsSteelDesignCurrentCodeOfStandard("AISC"), "Ultimate configuration can't be set for AISC code of standard");
		if (__objectExists(member_steel_design_uls_configuration_no, "Ultimate configuration", STEEL_DESIGN.steel_design_uls_configurations)) {
			this.member_set.member_steel_design_uls_configuration = member_steel_design_uls_configuration_no;
		}
	}
	if (typeof member_steel_design_sls_configuration_no !== "undefined" && __objectExists(member_steel_design_sls_configuration_no, "Serviceability configuration", STEEL_DESIGN.steel_design_sls_configurations)) {
		this.member_set.member_steel_design_sls_configuration = member_steel_design_sls_configuration_no;
	}
	if (typeof member_steel_design_fr_configuration_no !== "undefined") {
		ASSERT(Member_IsSteelDesignCurrentCodeOfStandard("EN") || Member_IsSteelDesignCurrentCodeOfStandard("NTC"), "Fire resistance configuration can be set only for EN, NTC code of standards");
		if (__objectExists(member_steel_design_fr_configuration_no, "Fire resistance configuration", STEEL_DESIGN.steel_design_fr_configurations)) {
			this.member_set.member_steel_design_fr_configuration = member_steel_design_fr_configuration_no;
		}
	}
};

/**
 * Sets Deflection analysis
 * @param {String} deflection_check_direction 				Check direction (LOCAL_AXIS_Z, LOCAL_AXIS_Y, LOCAL_AXIS_Z_AND_Y, RESULTING_AXIS), can be undefined (LOCAL_AXIS_Z_AND_Y as default)
 * @param {String} deflection_check_displacement_reference 	Displacement reference (DEFORMED_SEGMENT_ENDS, DEFORMED_UNDEFORMED_SYSTEM), can be undefined (DEFORMED_SEGMENT_ENDS as default)
 * @param {Array} segments_in_z_axis 						Segments in z-axis ([[active_1, length_1, precamber_1], ... [active_n, length_n, precamber_n]]), can be undefined
 * @param {Boolean} active_y 								Segment in y-axis - active, can be undefined (true as default)
 * @param {Number} length_y 								Segment in y-axis - length, can be undefined (member length as default)
 * @param {Number} precamber_y 								Segment in y-axis - precamber, can be undefined (0.0 as default)
 */
MemberSet.prototype.SetDeflectionAnalysis = function (deflection_check_direction,
	deflection_check_displacement_reference,
	deflection_segments_z_axis_items,
	active_y,
	length_y,
	precamber_y) {
	function GetDesignSupportsAtInternalNodesCount (member_set) {
		var count = 0;
		for (var i = 0; i < member_set.design_supports_on_internal_nodes.row_count(); ++i) {
			if (member_set.design_supports_on_internal_nodes[i + 1].design_support !== null) {
				count++;
			}
		}
		return count;
	}
	var designSupportAtInternalNodesCount = GetDesignSupportsAtInternalNodesCount(this.member_set);
	ASSERT(this.member_set.design_properties_activated, "Design properties must be on");
	this.member_set.deflection_check_direction = GetMemberDesignSupportCheckDirection(deflection_check_direction);
	this.member_set.deflection_check_displacement_reference = GetMemberDesignCheckDisplacementDirection(deflection_check_displacement_reference);
	ASSERT(Array.isArray(deflection_segments_z_axis_items), "deflection_segments_z_axis_items must be array of arrays ([[active_1, length_1, precamber_1], ... [active_n, length_n, precamber_n]])");
	ASSERT(deflection_segments_z_axis_items.length <= designSupportAtInternalNodesCount + 1, "deflection_segments_z_axis_items must have size less or equal to " + (designSupportAtInternalNodesCount + 1).toString());
	for (var i = 0; i < deflection_segments_z_axis_items.length; ++i) {
		if (deflection_segments_z_axis_items[i] === undefined) {
			continue;
		}
		ASSERT(Array.isArray(deflection_segments_z_axis_items[i], "[active_1, length_1, precamber_1]"));
		ASSERT(deflection_segments_z_axis_items[i].length === 3, "[active_1, length_1, precamber_1]");
		if (deflection_segments_z_axis_items[i][0] !== undefined) {
			ASSERT(this.member_set.deflection_check_direction !== member_sets.DEFLECTION_CHECK_DIRECTION_LOCAL_AXIS_Y, "Check direction can't be " + member_sets.DEFLECTION_CHECK_DIRECTION_LOCAL_AXIS_Y);
			this.member.deflection_segments_z_axis[i + 1].active = deflection_segments_z_axis_items[i][0];
		}
		if (deflection_segments_z_axis_items[i][1] !== undefined) {
			ASSERT(this.member_set.deflection_check_direction !== member_sets.DEFLECTION_CHECK_DIRECTION_LOCAL_AXIS_Y, "Check direction can't be " + member_sets.DEFLECTION_CHECK_DIRECTION_LOCAL_AXIS_Y);
			this.member_set.deflection_segments_defined_length_z_axis_enabled = true;
			this.member_set.deflection_segments_z_axis[i + 1].length = deflection_segments_z_axis_items[i][1];
		}
		else {
			this.member_set.deflection_segments_defined_length_z_axis_enabled = false;
		}
		if (deflection_segments_z_axis_items[i][2] !== undefined) {
			ASSERT(this.member_set.deflection_check_direction !== member_sets.DEFLECTION_CHECK_DIRECTION_LOCAL_AXIS_Y, "Check direction can't be " + member_sets.DEFLECTION_CHECK_DIRECTION_LOCAL_AXIS_Y);
			this.member_set.deflection_segments_z_axis[i + 1].precamber = deflection_segments_z_axis_items[i][2];
		}
	}
	if (typeof active_y !== "undefined") {
		ASSERT(this.member_set.deflection_check_direction !== member_sets.DEFLECTION_CHECK_DIRECTION_LOCAL_AXIS_Z, "Check direction can't be " + member_sets.DEFLECTION_CHECK_DIRECTION_LOCAL_AXIS_Z);
		this.member_set.deflection_segments_y_axis[1].active = active_y;
	}
	if (typeof length_y !== "undefined") {
		ASSERT(this.member_set.deflection_check_direction !== member_sets.DEFLECTION_CHECK_DIRECTION_LOCAL_AXIS_Z, "Check direction can't be " + member_sets.DEFLECTION_CHECK_DIRECTION_LOCAL_AXIS_Z);
		this.member_set.deflection_segments_defined_length_y_axis_enabled = true;
		this.member_set.deflection_segments_y_axis[1].length = length_y;
	}
	else {
		this.member_set.deflection_segments_defined_length_y_axis_enabled = false;
	}
	if (typeof precamber_y !== "undefined") {
		ASSERT(this.member_set.deflection_check_direction !== member_sets.DEFLECTION_CHECK_DIRECTION_LOCAL_AXIS_Z, "Check direction can't be " + member_sets.DEFLECTION_CHECK_DIRECTION_LOCAL_AXIS_Z);
		this.member_set.deflection_segments_y_axis[1].precamber = precamber_y;
	}
};

function GetMemberSetDesignSupportCheckDirection(direction_type) {
	const direction_types_dict = {
        "LOCAL_AXIS_Z": member_sets.DEFLECTION_CHECK_DIRECTION_LOCAL_AXIS_Z,
		"LOCAL_AXIS_Y": member_sets.DEFLECTION_CHECK_DIRECTION_LOCAL_AXIS_Y,
		"LOCAL_AXIS_Z_AND_Y": member_sets.DEFLECTION_CHECK_DIRECTION_LOCAL_AXIS_Z_AND_Y,
		"RESULTING_AXIS": member_sets.DEFLECTION_CHECK_DIRECTION_RESULTING_AXIS
	};

	if (direction_type !== undefined) {
		var type = direction_types_dict[direction_type];
		if (type === undefined) {
			console.log("Wrong design support check direction type. Value was: " + direction_type);
			console.log("Correct values are: ( " + Object.keys(direction_types_dict) + ")");
			type = member_sets.DEFLECTION_CHECK_DIRECTION_LOCAL_AXIS_Z_AND_Y;
		}
		return type;
	}
	else {
		return member_sets.DEFLECTION_CHECK_DIRECTION_LOCAL_AXIS_Z_AND_Y;
	}
}

function GetMemberSetDesignCheckDisplacementDirection(direction_type) {
	const direction_types_dict = {
        "DEFORMED_SEGMENT_ENDS": member_sets.DEFLECTION_CHECK_DISPLACEMENT_REFERENCE_DEFORMED_SEGMENT_ENDS,
		"DEFORMED_UNDEFORMED_SYSTEM": member_sets.DEFLECTION_CHECK_DISPLACEMENT_REFERENCE_DEFORMED_UNDEFORMED_SYSTEM
	};

	if (direction_type !== undefined) {
		var type = direction_types_dict[direction_type];
		if (type === undefined) {
			console.log("Wrong design support check displacement type. Value was: " + direction_type);
			console.log("Correct values are: ( " + Object.keys(direction_types_dict) + ")");
			type = member_sets.DEFLECTION_CHECK_DISPLACEMENT_REFERENCE_DEFORMED_SEGMENT_ENDS;
		}
		return type;
	}
	else {
		return member_sets.DEFLECTION_CHECK_DISPLACEMENT_REFERENCE_DEFORMED_SEGMENT_ENDS;
	}
}