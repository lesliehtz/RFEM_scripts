/*
1. SetSteeleDesignConfigurations - no API support for Strength configuration?
2. SetSteeleDesignConfigurations - no API support for Seismic configuration?
3. design_properties_parent_member_set cam't be set?
*/

include("../Tools/global.js")

/**
 * Creates member
 * @class
 * @constructor
 * @param	{Number}		no				Index of member, can be undefined
 * @param	{Array/Number}	nodes_or_line	List of node indexes or number of line
 * @param	{String}		comment			Comment, can be undefined
 * @param	{Object}		params  		Member's parameters, can be undefined
 * @returns	Created member
 */
function Member(no,
	node_ids,
	comment,
	params) {

	if (arguments.length !== 0) {
		node_ids = typeof node_ids !== 'undefined' ? node_ids : [];
		ASSERT(node_ids.length > 1, "Minimum two nodes must be set to Member");
		this.member = "undefined";
		if (RFEM) {
			var line = engine.create_line(no, node_ids);
			this.member = engine.create_member(no, line);
		}
		else {
			this.member = engine.create_member(no, node_ids[0], node_ids[1]);
		}
		set_comment_and_parameters(this.member, comment, params);
		return this.member;
	}
}

/**
 * @returns Member's number
 */
Member.prototype.GetNo = function () {
	return this.member.no;
};

/**
 * @returns Member object
 */
Member.prototype.GetMember = function () {
	return this.member;
};

/**
 * Creates beam member
 * @param	{Number}		no				Index of member, can be undefined
 * @param	{Array/Number}	nodes_or_line	List of node indexes or number of line
 * @param	{Number}		section_start	Section start. Section end is same as section start by default. To set section end specify distribution type.
 * @param	{String}		comment			Comment, can be undefined
 * @param	{Object}		params  		Member's parameters, can be undefined
 * @returns	Created member
 */
Member.prototype.Beam = function (no,
	nodes_or_line,
	section_start,
	comment,
	params) {
	return this.member = createBaseMember(no, nodes_or_line, members.TYPE_BEAM, section_start, comment, params);
};

/**
 * Creates rigid member
 * @param	{Number}		no				Index of member, can be undefined
 * @param	{Array/Number}	nodes_or_line	List of node indexes or number of line
 * @param	{String}		comment			Comment, can be undefined
 * @param	{Object}		params  		Member's parameters, can be undefined
 * @returns	Created member
 */
Member.prototype.Rigid = function (no,
	nodes_or_line,
	comment,
	params) {
	return this.member = createBaseMember(no, nodes_or_line, members.TYPE_RIGID, undefined, comment, params);
};

/**
 * Creates truss member
 * @param	{Number}		no				Index of member, can be undefined
 * @param	{Array/Number}	nodes_or_line	List of node indexes or number of line
 * @param	{Number}		section_start	Section start. Section end is same as section start by default. To set section end specify distribution type.
 * @param	{String}		comment			Comment, can be undefined
 * @param	{Object}		params  		Member's parameters, can be undefined
 * @returns	Created member
 */
Member.prototype.Truss = function (no,
	nodes_or_line,
	section_start,
	comment,
	params) {
	return this.member = createBaseMember(no, nodes_or_line, members.TYPE_TRUSS, section_start, comment, params);
};

/**
 * Creates truss (only N) member
 * @param	{Number}		no				Index of member, can be undefined
 * @param	{Array/Number}	nodes_or_line	List of node indexes or number of line
 * @param	{Number}		section_start	Section start. Section end is same as section start by default. To set section end specify distribution type.
 * @param	{String}		comment			Comment, can be undefined
 * @param	{Object}		params  		Member's parameters, can be undefined
 * @returns	Created member
 */
Member.prototype.TrussOnlyN = function (no,
	nodes_or_line,
	section_start,
	comment,
	params) {
	return this.member = createBaseMember(no, nodes_or_line, members.TYPE_TRUSS_ONLY_N, section_start, comment, params);
};

/**
 * Creates tension member
 * @param	{Number}		no				Index of member, can be undefined
 * @param	{Array/Number}	nodes_or_line	List of node indexes or number of line
 * @param	{Number}		section_start	Section start. Section end is same as section start by default. To set section end specify distribution type.
 * @param	{String}		comment			Comment, can be undefined
 * @param	{Object}		params  		Member's parameters, can be undefined
 * @returns	Created member
 */
Member.prototype.Tension = function (no,
	nodes_or_line,
	section_start,
	comment,
	params) {
	return this.member = createBaseMember(no, nodes_or_line, members.TYPE_TENSION, section_start, comment, params);
};

/**
 * Creates compression member
 * @param	{Number}		no				Index of member, can be undefined
 * @param	{Array/Number}	nodes_or_line	List of node indexes or number of line
 * @param	{Number}		section_start	Section start. Section end is same as section start by default. To set section end specify distribution type.
 * @param	{String}		comment			Comment, can be undefined
 * @param	{Object}		params  		Member's parameters, can be undefined
 * @returns	Created member
 */
Member.prototype.Compression = function (no,
	nodes_or_line,
	section_start,
	comment,
	params) {
	return this.member = createBaseMember(no, nodes_or_line, members.TYPE_COMPRESSION, section_start, comment, params);
};

/**
 * Creates buckling member
 * @param	{Number}		no				Index of member, can be undefined
 * @param	{Array/Number}	nodes_or_line	List of node indexes or number of line
 * @param	{Number}		section_start	Section start. Section end is same as section start by default. To set section end specify distribution type.
 * @param	{String}		comment			Comment, can be undefined
 * @param	{Object}		params  		Member's parameters, can be undefined
 * @returns	Created member
 */
Member.prototype.Buckling = function (no,
	nodes_or_line,
	section_start,
	comment,
	params) {
	return this.member = createBaseMember(no, nodes_or_line, members.TYPE_BUCKLING, section_start, comment, params);
};

/**
 * Creates cable member
 * @param	{Number}		no				Index of member, can be undefined
 * @param	{Array/Number}	nodes_or_line	List of node indexes or number of line
 * @param	{Number}		section_start	Section start. Section end is same as section start by default. To set section end specify distribution type.
 * @param	{String}		comment			Comment, can be undefined
 * @param	{Object}		params  		Member's parameters, can be undefined
 * @returns	Created member
 */
Member.prototype.Cable = function (no,
	nodes_or_line,
	section_start,
	comment,
	params) {
	return this.member = createBaseMember(no, nodes_or_line, members.TYPE_CABLE, section_start, comment, params);
};

/**
 * Creates surface model member
 * @param	{Number}		no				Index of member, can be undefined
 * @param	{Array/Number}	nodes_or_line	List of node indexes or number of line
 * @param	{Number}		section_start	Section start. Section end is same as section start by default. To set section end specify distribution type.
 * @param	{Number}		material_no		Material number
 * @param	{String}		comment			Comment, can be undefined
 * @param	{Object}		params  		Member's parameters, can be undefined
 * @returns	Created member
 */
Member.prototype.SurfaceModel = function (no,
	nodes_or_line,
	section_start,
	material_no,
	comment,
	params) {
	this.member = createBaseMember(no, nodes_or_line, members.TYPE_SURFACE_MODEL, section_start, comment, params);
	ASSERT(typeof material_no !== "undefined", "Material number of Surface model member must be defined");
	if (materials.exist(material_no)) {
		this.member.section_material = material_no;
	}
	else {
		console.log("Material no. " + material_no + " doesn't exist");
	}
};

/**
* Create result beam member
* @param	{Number}		no											Index of member, can be undefined
* @param	{Array/Number}	nodes_or_line								List of node indexes or number of line
* @param	{Number}		section_start								Section start. Section end is same as section start by default. To set section end specify distribution type.
* @param	{String} 		result_beam_integrate_stresses_and_forces	Stresses and forces type, can be undefined:
*																			INTEGRATE_WITHIN_CUBOID_QUADRATIC
*																			INTEGRATE_WITHIN_CUBOID_GENERAL
*																			INTEGRATE_WITHIN_CYLINDER
*																			INTEGRATE_FROM_LISTED_OBJECT
* @param	{Array}			result_beam_parameters						Result beam parameters, can be undefined
*																			1 - [Yz]
*																			2 - [Y+, Y-, Z+, Z-]
*																			3 - [R]
*																			4 - undefined
* @param	{Array}			included_objects							Included surfaces, members and solids, can be undefined ([true, [1, 2], true]: true = all objects, array of indexes = only specified objects)
* @param	{Array}			excluded_objects							Excluded surfaces, members and solids, can be undefined ([undefined, [1, 2], undefined]: array of indexes = only specified objects)
* @param	{String}		comment										Comment, can be undefined
* @param	{Object}		params  									Member's parameters, can be undefined
* @returns	Created member
*/
Member.prototype.ResultBeam = function (no,
	nodes_or_line,
	section_start,
	result_beam_integrate_stresses_and_forces,
	result_beam_parameters,
	included_objects,
	excluded_objects,
	comment,
	params) {
	if (RFEM) {
		this.member = createBaseMember(no, nodes_or_line, members.TYPE_RESULT_BEAM, section_start, comment, params);
		if (typeof result_beam_integrate_stresses_and_forces !== "undefined") {
			switch (result_beam_integrate_stresses_and_forces) {
				case "INTEGRATE_WITHIN_CUBOID_QUADRATIC":	// Integrate stresses and forces within block with square base
					this.member.result_beam_integrate_stresses_and_forces = GetResultBeamIntegrationType(result_beam_integrate_stresses_and_forces);
					if (typeof result_beam_parameters !== "undefined") {
						ASSERT(result_beam_parameters.length === 1, "Dimension parameter is required: [Yz]");
						this.member.result_beam_y_z = result_beam_parameters[0];
					}
					break;
				case "INTEGRATE_WITHIN_CUBOID_GENERAL":		// Integrate stresses and forces within cuboid
					this.member.result_beam_integrate_stresses_and_forces = GetResultBeamIntegrationType(result_beam_integrate_stresses_and_forces);
					if (typeof result_beam_parameters !== "undefined") {
						ASSERT(result_beam_parameters.length === 4, "Four parameters are required: [Y+, Y-, Z+, Z-]");
						this.member.result_beam_y_plus = result_beam_parameters[0];
						this.member.result_beam_y_minus = result_beam_parameters[1];
						this.member.result_beam_z_plus = result_beam_parameters[2];
						this.member.result_beam_z_minus = result_beam_parameters[3];
					}
					break;
				case "INTEGRATE_WITHIN_CYLINDER":		// Integrate stresses and forces within cylinder
					this.member.result_beam_integrate_stresses_and_forces = GetResultBeamIntegrationType(result_beam_integrate_stresses_and_forces);
					if (typeof result_beam_parameters !== "undefined") {
						ASSERT(result_beam_parameters.length === 1, "Radius parameter is required: [R]");
						this.member.result_beam_radius = result_beam_parameters[0];
					}
					break;
				case "INTEGRATE_FROM_LISTED_OBJECT":		// Integrate stresses and forces from listed objects
					this.member.result_beam_integrate_stresses_and_forces = GetResultBeamIntegrationType(result_beam_integrate_stresses_and_forces);
					break;
				default:
					ASSERT(false, "Unknown stresses and forces type");
			}
		}
		if (typeof included_objects !== "undefined") {
			ASSERT(included_objects.length === 3, "Three parameters are required");
			setResultBeamObjects(this.member, "result_beam_include_all_surfaces", "result_beam_include_surfaces", included_objects[0]);
			setResultBeamObjects(this.member, "result_beam_include_all_members", "result_beam_include_members", included_objects[1]);
			setResultBeamObjects(this.member, "result_beam_include_all_solids", "result_beam_include_solids", included_objects[2]);
		}
		if (typeof excluded_objects !== "undefined") {
			ASSERT(excluded_objects.length === 3, "Three parameters are required");
			setResultBeamObjects(this.member, undefined, "result_beam_exclude_surfaces", excluded_objects[0]);
			setResultBeamObjects(this.member, undefined, "result_beam_exclude_members", excluded_objects[1]);
			setResultBeamObjects(this.member, undefined, "result_beam_exclude_solids", excluded_objects[2]);
		}
		return this.member;
	}
};

/**
* Create definable stiffness member
* @param	{Number}		no					Index of member, can be undefined
* @param	{Array/Number}	nodes_or_line		List of node indexes or number of line
* @param	{Number}		definable_stiffness	Definable stiffness
* @param	{String}		comment				Comment, can be undefined
* @param	{Object}		params  			Member's parameters, can be undefined
* @return 	Created definable stiffness member
*/
Member.prototype.DefinableStiffness = function (no,
	nodes_or_line,
	definable_stiffness,
	comment,
	params) {
	this.member = createBaseMember(no, nodes_or_line, members.TYPE_DEFINABLE_STIFFNESS, undefined, comment, params);
	ASSERT(member_definable_stiffnesses.exist(definable_stiffness), "Member definable stiffness no. " + definable_stiffness + " doesn't exist");
	this.member.member_type_definable_stiffness = member_definable_stiffnesses[definable_stiffness];
	return this.member;
};

/**
* Create coupling rigid-rigid member
* @param	{Number}		no					Index of member, can be undefined
* @param	{Array/Number}	nodes_or_line		List of node indexes or number of line
* @param	{String}		comment				Comment, can be undefined
* @param	{Object}		params  			Member's parameters, can be undefined
* @return 	Created coupling rigid-rigid member
*/
Member.prototype.CouplingRigidRigid = function (no,
	nodes_or_line,
	comment,
	params) {
	return this.member = createBaseMember(no, nodes_or_line, members.TYPE_COUPLING_RIGID_RIGID, undefined, comment, params);
};

/**
* Create coupling rigid-hinge member
* @param	{Number}		no					Index of member, can be undefined
* @param	{Array/Number}	nodes_or_line		List of node indexes or number of line
* @param	{String}		comment				Comment, can be undefined
* @param	{Object}		params  			Member's parameters, can be undefined
* @return 	Created coupling rigid-hinge member
*/
Member.prototype.CouplingRigidHinge = function (no,
	nodes_or_line,
	comment,
	params) {
	return this.member = createBaseMember(no, nodes_or_line, members.TYPE_COUPLING_RIGID_HINGE, undefined, comment, params);
};

/**
* Create coupling hinge-rigid member
* @param	{Number}		no					Index of member, can be undefined
* @param	{Array/Number}	nodes_or_line		List of node indexes or number of line
* @param	{String}		comment				Comment, can be undefined
* @param	{Object}		params  			Member's parameters, can be undefined
* @return 	Created coupling hinge-rigid member
*/
Member.prototype.CouplingHingeRigid = function (no,
	nodes_or_line,
	comment,
	params) {
	return this.member = createBaseMember(no, nodes_or_line, members.TYPE_COUPLING_HINGE_RIGID, undefined, comment, params);
};

/**
* Create coupling hinge-hinge member
* @param	{Number}		no					Index of member, can be undefined
* @param	{Array/Number}	nodes_or_line		List of node indexes or number of line
* @param	{String}		comment				Comment, can be undefined
* @param	{Object}		params  			Member's parameters, can be undefined
* @return 	Created coupling hinge-hinge member
*/
Member.prototype.CouplingHingeHinge = function (no,
	nodes_or_line,
	comment,
	params) {
	return this.member = createBaseMember(no, nodes_or_line, members.TYPE_COUPLING_HINGE_HINGE, undefined, comment, params);
};

/**
 *
 * @param {Array/Number} nodes_or_line	List of node indexes or number of line
 * @param {Number} no	Index of member, can be undefined
 * @param {Number} section_start Section start. Section end is same as section start by default. To set section end specify distribution type.
 * @param {String} rib_alignment Alignment of rib - "ALIGNMENT_ON_Z_SIDE_NEGATIVE","ALIGNMENT_CENTRIC","ALIGNMENT_ON_Z_SIDE_POSITIVE","ALIGNMENT_USER_DEFINED_VIA_MEMBER_ECCENTRICITY"
 * @param {Boolean} surface_assignment_autodetect
 * @param {Boolean} align_axes
 * @param {Array} flange_dimensions - two dimensional array each row could have form [end_ordinate,reference_length_definition_type,reference_length_width,width_minus_y_maximal,width_plus_y_maximal,reference_length,width_minus_y_integrative,width_plus_y_integrative]
 * @param {Array} surfaces
 * @param {String} comment
 * @param {Object} params
 * @returns object Rib
 */
Member.prototype.Rib = function (no,
	nodes_or_line,
	section_start,
	rib_alignment,
	surface_assignment_autodetect,
	align_axes,
	flange_dimensions,
	surfaces,
	comment,
	params) {
	this.member = createBaseMember(no, nodes_or_line, members.TYPE_RIB, section_start, comment, params);

	this.member.member_type_rib_alignment = GetRibAlignmentType(rib_alignment);
	this.member.member_rib_surface_assignment_autodetect = surface_assignment_autodetect;
	this.member.align_local_z_axis_to_local_z_axis_of_surface = align_axes;

	SetFlangeDimensions(this.member, flange_dimensions);

	if (surfaces !== undefined) {
		if (surfaces[0] !== undefined && typeof surfaces[1] === 'number') {
			this.member.member_rib_first_surface = surfaces[0];
		}
		if (surfaces[1] !== undefined && typeof surfaces[1] === 'number') {
			this.member.member_rib_second_surface = surfaces[1];
		}
	}
	return this.member;
};


/**
* Sets nodes on member
* @param	{Array}		values	Nodes on member values in format [[node_1, reference_1, from_start_1, from_end1_1] ... [node_n, reference_n, from_start_n, from_end_1]]
*/
Member.prototype.NodesOnMember = function (values) {
	for (var i = 0; i < values.length; ++i) {
		ASSERT(values[i].length === 4, "Values has to be set in this format: [[node_1, reference_1, from_start_1, from_end1_1] ... [node_n, reference_n, from_start_n, from_end_1]]");
		if (typeof values[i][0] !== "undefined") {
			this.member.nodes_on_member_assignment[i + 1].node = values[i][0];
		}
		this.member.nodes_on_member_assignment[i + 1].reference = values[i][1];
		this.member.nodes_on_member_assignment[i + 1].fromStart = values[i][2];
		this.member.nodes_on_member_assignment[i + 1].fromEnd = values[i][3];
	}
};

/**
* Sets member start and/or member end hinges
* @param	{Number}	member_start_hinge	Member hinge object id at member start, can be undefined
* @param	{Number}	member_end_hinge	Member hinge object id at member end, can be undefined
*/
Member.prototype.Hinges = function (member_start_hinge,
	member_end_hinge) {
	ASSERT(this.member.type === members.TYPE_BEAM || this.member.type === members.TYPE_RIGID || this.member.type === members.TYPE_RIB || this.member.type === members.TYPE_DEFINABLE_STIFFNESS, "Hinges cannot be set for this type of member");
	if (typeof member_start_hinge !== "undefined") {
		ASSERT(member_hinges.exist(member_start_hinge), "Member hinge no. " + member_start_hinge + " doesn't exist");
		this.member.member_hinge_start = member_hinges[member_start_hinge];
	}
	if (typeof member_end_hinge !== "undefined") {
		ASSERT(member_hinges.exist(member_end_hinge), "Member hinge no. " + member_end_hinge + " doesn't exist");
		this.member.member_hinge_end = member_hinges[member_end_hinge];
	}
};

/**
* Sets member start and/or member end eccentricities
* @param	{Number}	member_start_eccentricity	Member eccentricity object id at member start, can be undefined
* @param	{Number}	member_end_eccentricity		Member eccentricity object id at member end, can be undefined
*/
Member.prototype.Eccentricities = function (member_start_eccentricity,
	member_end_eccentricity) {
	ASSERT(this.member.type === members.TYPE_BEAM || this.member.type === members.TYPE_RIGID || this.member.type === members.TYPE_TRUSS || this.member.type === members.TYPE_TRUSS_ONLY_N ||
		this.member.type === members.TYPE_TENSION || this.member.type === members.TYPE_COMPRESSION || this.member.type === members.TYPE_BUCKLING ||
		this.member.type === members.TYPE_DEFINABLE_STIFFNESS, "Eccentricity cannot be set for this type of member");
	if (typeof member_start_eccentricity !== "undefined") {
		ASSERT(member_eccentricities.exist(member_start_eccentricity), "Member eccentricity no. " + member_start_eccentricity + " doesn't exist");
		this.member.member_eccentricity_start = member_eccentricities[member_start_eccentricity];
	}
	if (typeof member_end_eccentricity !== "undefined") {
		ASSERT(member_eccentricities.exist(member_end_eccentricity), "Member eccentricity no. " + member_end_eccentricity + " doesn't exist");
		this.member.member_eccentricity_end = member_eccentricities[member_end_eccentricity];
	}
};

/**
* Sets member supports
* @param	{Number}	member_support	Member supports object id
*/
Member.prototype.Supports = function (member_support) {
	ASSERT(this.member.type === members.TYPE_BEAM || this.member.type === members.TYPE_RIGID || this.member.type === members.TYPE_RIB, "Support cannot be set to this type of member");
	ASSERT(typeof member_support !== "undefined");
	ASSERT(member_supports.exist(member_support), "Member support no. " + member_support + " doesn't exist");
	this.member.support = member_supports[member_support];
};

/**
* Sets member nonlinearity
* @param	{Number}	member_nonlinearity	Member nonlinearity object id
*/
Member.prototype.Nonlinearity = function (member_nonlinearity) {
	ASSERT(this.member.type === members.TYPE_BEAM || this.member.type === members.TYPE_RIGID || this.member.type === members.TYPE_TRUSS || this.member.type === members.TYPE_TRUSS_ONLY_N ||
		this.member.type === members.TYPE_DEFINABLE_STIFFNESS, "Nonlinearity cannot be set for this type of member");
	ASSERT(typeof member_nonlinearity !== "undefined");
	ASSERT(member_nonlinearities.exist(member_nonlinearity), "Member nonlinearity no. " + member_nonlinearity + " doesn't exist");
	this.member.member_nonlinearity = member_nonlinearities[member_nonlinearity];
};

/**
* @param	{Number}	member_result_intermediate_point	member result intermediate point object id
*/
Member.prototype.ResultIntermediatePoints = function (member_result_intermediate_point) {
	ASSERT(this.member.type === members.TYPE_BEAM || this.member.type === members.TYPE_RIGID || this.member.type === members.TYPE_RIB || this.member.type === members.TYPE_RESULT_BEAM ||
		this.member.type === members.TYPE_DEFINABLE_STIFFNESS, "Result intermediate points cannot be set for this type of member");
	ASSERT(typeof member_result_intermediate_points !== "undefined");
	ASSERT(member_result_intermediate_points.exist(member_result_intermediate_point), "Result intermediate points no. " + member_result_intermediate_points + " doesn't exist");
	this.member.member_result_intermediate_point = member_result_intermediate_point;
};

/**
* Sets member start and/or member end extensions
* @param	{Array}		member_start	Member start values, can be undefined ([Δi, αi,y, αi,z])
* @param	{Array}		member_end		Member end values, can be undefined ([Δj, αj,y, αj,z])
*/
Member.prototype.EndModifications = function (member_start,
	member_end) {
	ASSERT(this.member.type === members.TYPE_BEAM || this.member.type === members.TYPE_RIB || this.member.type === members.TYPE_TRUSS || this.member.type === members.TYPE_TRUSS_ONLY_N ||
		this.member.type === members.TYPE_TENSION || this.member.type === members.TYPE_COMPRESSION || this.member.type === members.TYPE_BUCKLING || this.member.type === members.TYPE_CABLE ||
		this.member.type === members.TYPE_RESULT_BEAM, "End modification cannot be set for this type of member");
	if (typeof member_start !== "undefined") {
		ASSERT(member_start.length === 3, "Member start requires three values: [Δi, αi,y, αi,z]");
		this.member.end_modifications_member_start_extension = member_start[0];
		this.member.end_modifications_member_start_slope_y = member_start[1];
		this.member.end_modifications_member_start_slope_z = member_start[2];
	}
	if (typeof member_end !== "undefined") {
		ASSERT(member_end.length === 3, "Member end extension requires three values: [Δj, αj,y, αj,z]");
		this.member.end_modifications_member_end_extension = member_end[0];
		this.member.end_modifications_member_end_slope_y = member_end[1];
		this.member.end_modifications_member_end_slope_z = member_end[2];
	}
};

Member.prototype.DeactivateForCalculation = function (deactivate) {
	if (typeof deactivate === "undefined") {
		deactivate = true;
	}
	this.member.is_deactivated_for_calculation = deactivate;
};

/**
* Sets uniform section distribution
*/
Member.prototype.SectionDistributionUniform = function () {
	this.member.section_distribution_type = members.SECTION_DISTRIBUTION_TYPE_UNIFORM;
};

/**
 * Sets linear distribution
 * @param {Number} section_start Number of section at start of member
 * @param {Number} section_end Number of section at end of member
 * @param {String} section_alignment section_alignment	Section alignment (Top, Centric, Bottom), can be undefined (centric as default)
 */
Member.prototype.SectionDistributionLinear = function (section_start, section_end, section_alignment) {
	this.member.section_distribution_type = members.SECTION_DISTRIBUTION_TYPE_LINEAR;
	if (typeof section_alignment !== "undefined") {
		this.member.section_alignment = GetMemberSectionAlignment(section_alignment);
	}
	if (typeof section_start !== "undefined") {
		ASSERT(sections.exist(section_start), "Section no. " + section_start + " doesn't exist");
		this.member.section_start = sections[section_start];
	}
	if (typeof section_end !== "undefined") {
		ASSERT(sections.exist(section_end), "Section no. " + section_end + " doesn't exist");
		this.member.section_end = sections[section_end];
	}
};

/**
* Sets tapered at both sides distribution
* @param {Number} 	section_start Number of section at start of member
* @param {Number} 	section_internal Number of section at internal point of member (between start and end)
* @param {Number} 	section_end Number of section at end of member
* @param {String}	reference_type				Reference type (L, XY, XZ), can be undefined
* @param {Array}	section_distance_from_start	Member distance ([distance, is_relative]), can be undefined
* @param {Array}	section_distance_from_end	Member distance ([distance, is_relative]), can be undefined
* @param {String}	section_alignment			Section alignment (Top, Centric, Bottom), can be undefined (top as default)
*/
Member.prototype.SectionDistributionTaperedAtBothSides = function (section_start, section_internal, section_end, reference_type,
	section_distance_from_start,
	section_distance_from_end,
	section_alignment) {
	this.member.section_distribution_type = members.SECTION_DISTRIBUTION_TYPE_TAPERED_AT_BOTH_SIDES;
	if (typeof reference_type !== "undefined") {
		this.member.reference_type = reference_type;
	}
	setDistributionAtStart(this.member, section_distance_from_start);
	setDistributionAtEnd(this.member, section_distance_from_end);
	if (typeof section_alignment !== "undefined") {
		this.member.section_alignment = GetMemberSectionAlignment(section_alignment);
	}
	if (typeof section_start !== "undefined") {
		ASSERT(sections.exist(section_start), "Section no. " + section_start + " doesn't exist");
		this.member.section_start = sections[section_start];
	}
	if (typeof section_internal !== "undefined") {
		ASSERT(sections.exist(section_internal), "Section no. " + section_internal + " doesn't exist");
		this.member.section_internal = sections[section_internal];
	}
	if (typeof section_end !== "undefined") {
		ASSERT(sections.exist(section_end), "Section no. " + section_end + " doesn't exist");
		this.member.section_end = sections[section_end];
	}

};

/**
* Sets tapered at start distribution
* @param {Number} section_start Number of section at start of member
* @param {Number} section_end Number of section at end of member
* @param {String}	reference_type				Reference type (L, XY, XZ), can be undefined
* @param {Array}	section_distance_from_start	Member distance ([distance, is_relative]), can be undefined
* @param {String}	section_alignment			Section alignment (Top, Centric, Bottom), can be undefined (top as default)
*/
Member.prototype.SectionDistributionTaperedAtStart = function (section_start, section_end, reference_type,
	section_distance_from_start,
	section_alignment) {
	this.member.section_distribution_type = members.SECTION_DISTRIBUTION_TYPE_TAPERED_AT_START_OF_MEMBER;
	if (typeof reference_type !== "undefined") {
		this.member.reference_type = reference_type;
	}
	setDistributionAtStart(this.member, section_distance_from_start);
	if (typeof section_alignment !== "undefined") {
		this.member.section_alignment = GetMemberSectionAlignment(section_alignment);
	}
	if (typeof section_start !== "undefined") {
		ASSERT(sections.exist(section_start), "Section no. " + section_start + " doesn't exist");
		this.member.section_start = sections[section_start];
	}
	if (typeof section_end !== "undefined") {
		ASSERT(sections.exist(section_end), "Section no. " + section_end + " doesn't exist");
		this.member.section_end = sections[section_end];
	}
};

/**
* Sets tapered at end distribution
* @param {Number} section_start Number of section at start of member
* @param {Number} section_end Number of section at end of member
* @param {String}	reference_type				Reference type (L, XY, XZ), can be undefined
* @param {Array}	section_distance_from_end	Member distance ([distance, is_relative]), can be undefined
* @param {String}	section_alignment			Section alignment (Top, Centric, Bottom), can be undefined (top as default)
*/
Member.prototype.SectionDistributionTaperedAtEnd = function (section_start, section_end, reference_type,
	section_distance_from_end,
	section_alignment) {
	this.member.section_distribution_type = members.SECTION_DISTRIBUTION_TYPE_TAPERED_AT_END_OF_MEMBER;
	if (typeof reference_type !== "undefined") {
		this.member.reference_type = reference_type;
	}
	setDistributionAtEnd(this.member, section_distance_from_end);
	if (typeof section_alignment !== "undefined") {
		this.member.section_alignment = GetMemberSectionAlignment(section_alignment);
	}
	if (typeof section_start !== "undefined") {
		ASSERT(sections.exist(section_start), "Section no. " + section_start + " doesn't exist");
		this.member.section_start = sections[section_start];
	}
	if (typeof section_end !== "undefined") {
		ASSERT(sections.exist(section_end), "Section no. " + section_end + " doesn't exist");
		this.member.section_end = sections[section_end];
	}
};

/**
* Sets saddle distribution
* @param {Number} 	section_start Number of section at start of member
* @param {Number} 	section_internal Number of section at internal point of member (between start and end)
* @param {Number} 	section_end Number of section at end of member
* @param {String}	reference_type				Reference type (L, XY, XZ), can be undefined
* @param {Array}	section_distance_from_start	Member distance ([distance, is_relative]), can be undefined
* @param {String}	section_alignment			Section alignment (Top, Centric, Bottom), can be undefined (top as default)
*/
Member.prototype.SectionDistributionSaddle = function (section_start, section_internal, section_end, reference_type,
	section_distance_from_start,
	section_alignment) {
	this.member.section_distribution_type = members.SECTION_DISTRIBUTION_TYPE_SADDLE;
	if (typeof reference_type !== "undefined") {
		this.member.reference_type = reference_type;
	}
	setDistributionAtStart(this.member, section_distance_from_start);
	if (typeof section_alignment !== "undefined") {
		this.member.section_alignment = GetMemberSectionAlignment(section_alignment);
	}
	if (typeof section_start !== "undefined") {
		ASSERT(sections.exist(section_start), "Section no. " + section_start + " doesn't exist");
		this.member.section_start = sections[section_start];
	}
	if (typeof section_internal !== "undefined") {
		ASSERT(sections.exist(section_internal), "Section no. " + section_internal + " doesn't exist");
		this.member.section_internal = sections[section_internal];
	}
	if (typeof section_end !== "undefined") {
		ASSERT(sections.exist(section_end), "Section no. " + section_end + " doesn't exist");
		this.member.section_end = sections[section_end];
	}
};

/**
* Sets offset at both sides distribution
* @param {Number} 	section_start Number of section at start of member
* @param {Number} 	section_internal Number of section at internal point of member (between start and end)
* @param {Number} 	section_end Number of section at end of member
* @param {String}	reference_type				Reference type (L, XY, XZ), can be undefined
* @param {Array}	section_offset_from_start	Member offset ([distance, is_relative]), can be undefined
* @param {Array}	section_offset_from_end		Member offset ([distance, is_relative]), can be undefined
* @param {String}	section_alignment			Section alignment (Top, Centric, Bottom), can be undefined (top as default)
*/
Member.prototype.SectionDistributionOffsetAtBothSides = function (section_start, section_internal, section_end, reference_type,
	section_offset_from_start,
	section_offset_from_end,
	section_alignment) {
	this.member.section_distribution_type = members.SECTION_DISTRIBUTION_TYPE_OFFSET_AT_BOTH_SIDES;
	if (typeof reference_type !== "undefined") {
		this.member.reference_type = reference_type;
	}
	setDistributionAtStart(this.member, section_offset_from_start);
	setDistributionAtEnd(this.member, section_offset_from_end);
	if (typeof section_alignment !== "undefined") {
		this.member.section_alignment = GetMemberSectionAlignment(section_alignment);
	}
	if (typeof section_start !== "undefined") {
		ASSERT(sections.exist(section_start), "Section no. " + section_start + " doesn't exist");
		this.member.section_start = sections[section_start];
	}
	if (typeof section_internal !== "undefined") {
		ASSERT(sections.exist(section_internal), "Section no. " + section_internal + " doesn't exist");
		this.member.section_internal = sections[section_internal];
	}
	if (typeof section_end !== "undefined") {
		ASSERT(sections.exist(section_end), "Section no. " + section_end + " doesn't exist");
		this.member.section_end = sections[section_end];
	}
};

/**
* Sets offset at start distribution
* @param {Number} section_start Number of section at start of member
* @param {Number} section_end Number of section at end of member
* @param {String}	reference_type				Reference type (L, XY, XZ), can be undefined
* @param {Array}	section_offset_from_start	Member offset ([distance, is_relative]), can be undefined
* @param {String}	section_alignment			Section alignment (Top, Centric, Bottom), can be undefined (top as default)
*/

Member.prototype.SectionDistributionOffsetAtStart = function (section_start, section_end, reference_type,
	section_offset_from_start,
	section_alignment) {
	this.member.section_distribution_type = members.SECTION_DISTRIBUTION_TYPE_OFFSET_AT_START_OF_MEMBER;
	if (typeof reference_type !== "undefined") {
		this.member.reference_type = reference_type;
	}
	setDistributionAtStart(this.member, section_offset_from_start);
	if (typeof section_alignment !== "undefined") {
		this.member.section_alignment = GetMemberSectionAlignment(section_alignment);
	}
	if (typeof section_start !== "undefined") {
		ASSERT(sections.exist(section_start), "Section no. " + section_start + " doesn't exist");
		this.member.section_start = sections[section_start];
	}
	if (typeof section_end !== "undefined") {
		ASSERT(sections.exist(section_end), "Section no. " + section_end + " doesn't exist");
		this.member.section_end = sections[section_end];
	}
};

/**
* Sets offset at end distribution
* @param {String}	reference_type				Reference type (L, XY, XZ), can be undefined
* @param {Array}	section_offset_from_end		Member offset ([distance, is_relative]), can be undefined
* @param {String}	section_alignment			Section alignment (Top, Centric, Bottom), can be undefined (top as default)
*/
Member.prototype.SectionDistributionOffsetAtEnd = function (section_start, section_end, reference_type,
	section_offset_from_end,
	section_alignment) {
	this.member.section_distribution_type = members.SECTION_DISTRIBUTION_TYPE_OFFSET_AT_END_OF_MEMBER;
	if (typeof reference_type !== "undefined") {
		this.member.reference_type = reference_type;
	}
	setDistributionAtEnd(this.member, section_offset_from_end);
	if (typeof section_alignment !== "undefined") {
		this.member.section_alignment = GetMemberSectionAlignment(section_alignment);
	}
	if (typeof section_start !== "undefined") {
		ASSERT(sections.exist(section_start), "Section no. " + section_start + " doesn't exist");
		this.member.section_start = sections[section_start];
	}
	if (typeof section_end !== "undefined") {
		ASSERT(sections.exist(section_end), "Section no. " + section_end + " doesn't exist");
		this.member.section_end = sections[section_end];
	}
};

/**
 * @returns Number of Member
 */
Member.prototype.GetNo = function(){
	return this.member.no;
};

/**
 * @returns Member object
 */
Member.prototype.GetMember = function (){
	return this.member;
};

/**
 * Enable / disable Steel design support for member (Steel design add-on)
 * @param {Boolean} enabled 	Enable / disable Design properties, can be undefined (true as default)
 */
Member.prototype.SetSteelDesignSupport = function (enabled) {
	ASSERT(STEEL_DESIGN.isActive(), "Steel design add-on must be active");
	ASSERT(__hasSteelSection(this.member.section_start) && __hasSteelSection(this.member.section_end), "Member no. " + this.member.no + " must have section with " + materials.TYPE_STEEL + " material type");
	ASSERT(!this.member.is_deactivated_for_calculation, "Calculation must be deactivated");
	if (typeof enabled === "undefined") {
		enabled = true;
	}
	this.member.design_properties_via_member = enabled;
}

/**
 * Sets Via parent member set
 * @param {Boolean} design_properties_via_parent_member_set 	Via parent member set, can be undefined (true as default)
 */
Member.prototype.SetSteelDesignPropertiesViaParentMemberSet = function (design_properties_via_parent_member_set) {
	ASSERT(STEEL_DESIGN.isActive(), "Steel design add-on must be active");
	ASSERT(__hasSteelSection(this.member.section_start) && __hasSteelSection(this.member.section_end), "Member no. " + this.member.no + " must have section with " + materials.TYPE_STEEL + " material type");
	ASSERT(!this.member.is_deactivated_for_calculation, "Calculation must be deactivated");
	ASSERT(typeof design_properties_via_parent_member_set !== "undefined", "Enable / disable must be defined");
	if (typeof design_properties_via_parent_member_set === "undefined") {
		design_properties_via_parent_member_set = true;
	}
	this.member.design_properties_via_parent_member_set = design_properties_via_parent_member_set;
};

/**
 * Sets Steel design types (Steel design add-on)
 * @param {Number} steel_effective_lengths_no 					Effective length number, can be undefined
 * @param {Number} steel_boundary_conditions_no 				Boundary condition number, can be undefined
 * @param {Number} steel_member_local_section_reduction_no 		Member local section reduction number, can be undefined
 */
Member.prototype.SetSteelDesignTypes = function (steel_effective_lengths_no,
	steel_boundary_conditions_no,
	steel_member_local_section_reduction_no) {
	ASSERT(STEEL_DESIGN.isActive(), "Steel design add-on must be active");
	if (typeof steel_effective_lengths_no !== "undefined" && __objectExists(steel_effective_lengths_no, "Effective length", steel_effective_lengths)) {
		this.member.steel_effective_lengths = steel_effective_lengths_no;
	}
	if (typeof steel_boundary_conditions_no !== "undefined") {
		ASSERT(Member_IsSteelDesignCurrentCodeOfStandard("EN") || Member_IsSteelDesignCurrentCodeOfStandard("NTC"), "Boundary condition can be set only for EN, NTC code of standards");
		if (__objectExists(steel_boundary_conditions_no, "Boundary condition", steel_boundary_conditions)) {
			this.member.steel_boundary_conditions = steel_boundary_conditions_no;
		}
	}
	if (typeof steel_member_local_section_reduction_no !== "undefined" && __objectExists(steel_member_local_section_reduction_no, "Member local section reduction", steel_member_local_section_reductions)) {
		this.member.steel_member_local_section_reduction = steel_member_local_section_reduction_no;
	}
};

/**
 * Sets Design supports
 * @param {Number} design_support_on_member_start 	Design support at member start, can be undefined
 * @param {Number} design_support_on_member_end 	Design support at member end, can be undefined
 */
Member.prototype.SetSteelDesignSupportAtMemberStartAndEnd = function (design_support_on_member_start,
	design_support_on_member_end) {
	ASSERT(STEEL_DESIGN.isActive(), "Steel design add-on must be active");
	if (typeof design_support_on_member_start !== "undefined") {
		if (__objectExists(design_support_on_member_start, "Design support", design_supports)) {
			this.member.design_support_on_member_start = design_support_on_member_start;
		}
	}
	if (typeof design_support_on_member_end !== "undefined") {
		if (__objectExists(design_support_on_member_end, "Design support", design_supports)) {
			this.member.design_support_on_member_end = design_support_on_member_end;
		}
	}
};

/**
 * Enable / disable Concrete design support, can be undefined (true as default)
 * @param {Boolean} design_properties_activated 	Design properties
 */
Member.prototype.SetConcreteDesignSupport = function (design_properties_activated) {
	ASSERT(CONCRETE_DESIGN.isActive(), "Concrete design add-on must be active");
	if (typeof design_properties_activated === "undefined") {
		design_properties_activated = true;
	}
	this.member.design_properties_via_member = design_properties_activated;
};

/**
 * Sets Effective length for stability design using equivalent member method
 * @param {Number} concrete_effective_length_no 	Effective length number
 */
Member.prototype.SetConcreteDesignEffectiveLength = function (concrete_effective_length_no) {
	SetMemberConcreteDesignEffectiveLength(this.member, concrete_effective_length_no);y
};

/**
 * Sets User-defined concrete cover
 * @param {Number} concrete_cover 	Concrete cover
 */
Member.prototype.SetConcreteDesignUserDefineConcreteCoverAllSectionSides = function (concrete_cover) {
	SetMemberConcreteDesignUserDefineConcreteCover(this.member, concrete_cover);
};

/**
 * Sets User-defined concrete cover on each section sides
 * @param {Number} concrete_cover_top 		Concrete cover on top side, can be undefined (is not set, 30 mm as default)
 * @param {Number} concrete_cover_left 		Concrete cover on left side, can be undefined (is not set, 30 mm as default)
 * @param {Number} concrete_cover_right 	Concrete cover on right side, can be undefined (is not set, 30 mm as default)
 * @param {Number} concrete_cover_bottom 	Concrete cover on bottom side, can be undefined (is not set, 30 mm as default)
 */
Member.prototype.SetConcreteDesignUserDefineConcreteCoverOnEachSide = function (concrete_cover_top,
	concrete_cover_left,
	concrete_cover_right,
	concrete_cover_bottom) {
	SetMemberConcreteDesignUserDefineConcreteCoverOnEachSide(this.member, concrete_cover_top, concrete_cover_left, concrete_cover_right, concrete_cover_bottom);
};

/**
 * Sets Concrete durability on all section sides
 * @param {Number} concrete_durability_no 	Concrete durability number
 */
Member.prototype.SetConcreteDesignConcreteDurabilityAllSectionSides = function (concrete_durability_no) {
	SetMemberConcreteDesignConcreteDurabilityAllSectionSides(this.member, concrete_durability_no);
};

/**
 * Sets Concrete durability on each section side
 * @param {Number} concrete_durability_top_no 		Concrete durability on top side, can be undefined (is not set, first concrete durability)
 * @param {Number} concrete_durability_left_no 		Concrete durability on left side, can be undefined (is not set, first concrete durability)
 * @param {Number} concrete_durability_right_no 	Concrete durability on right side, can be undefined (is not set, first concrete durability)
 * @param {Number} concrete_durability_bottom_no 	Concrete durability on bottom side, can be undefined (is not set, first concrete durability)
 */
Member.prototype.SetConcreteDesignConcreteDurabilityOnEachSide = function (concrete_durability_top_no,
	concrete_durability_left_no,
	concrete_durability_right_no,
	concrete_durability_bottom_no) {
	SetMemberConcreteDesignConcreteDurabilityOnEachSide(this.member, concrete_durability_top_no, concrete_durability_left_no, concrete_durability_right_no, concrete_durability_bottom_no);
};

/**
 * Sets Minimum concrete cover according to standard
 * @param {Number} concrete_cover_min 	Minimal concrete cover on all section sides
 */
Member.prototype.SetConcreteDesignMinimumConcreteCoverAllSectionSides = function (concrete_cover_min) {
	SetMemberConcreteDesignMinimumConcreteCoverAllSectionSides(this.member, concrete_cover_min);
};

/**
 * Sets Minimum concrete cover on each section side, according to standard
 * @param {Number} concrete_cover_min_top 		Concrete cover on top section side, can be undefined (is not set, 30 mm as default)
 * @param {Number} concrete_cover_min_left 		Concrete cover on left section side, can be undefined (is not set, 30 mm as default)
 * @param {Number} concrete_cover_min_right 	Concrete cover on right section side, can be undefined (is not set, 30 mm as default)
 * @param {Number} concrete_cover_min_bottom 	Concrete cover on bottom section side, can be undefined (is not set, 30 mm as default)
 */
Member.prototype.SetConcreteDesignMinimumConcreteCoverOnEachSide = function (concrete_cover_min_top,
	concrete_cover_min_left,
	concrete_cover_min_right,
	concrete_cover_min_bottom) {
	SetMemberConcreteDesignMinimumConcreteCoverOnEachSide(this.member, concrete_cover_min_top, concrete_cover_min_left, concrete_cover_min_right, concrete_cover_min_bottom);
};

/**
 * Adds Shear reinforcement
 * @returns 	Number of shear reinforcement
 */
Member.prototype.AddConcreteDesignShearReinforcement = function () {
	return MemberAddConcreteDesignShearReinforcement(this.member);
};

/**
 * Removes shear reinforcement
 * @param {Number} shear_reinforcement_no 	Shear reinforcement number
 */
Member.prototype.RemoveConcreteDesignShearReinforcement = function(shear_reinforcement_no) {
	MemberRemoveConcreteDesignShearReinforcement(this.member, shear_reinforcement_no);
};

/**
 * Sets Shear reinforcement Base data
 * @param {Number} shear_reinforcement_no 	Shear Reinforcement number
 * @param {Number} material_no 				Material number
 * @param {String} stirrup_type 			Stirrup type (TWO_LEGGED_CLOSED_HOOK_135, TWO_LEGGED_CLOSED_HOOK_90, TWO_LEGGED_OPEN, THREE_LEGGED_CLOSED_HOOK_135,
 *												THREE_LEGGED_CLOSED_HOOK_90, FOUR_LEGGED_CLOSED_HOOK_135, FOUR_LEGGED_CLOSED_HOOK_90, TWO_LEGGED_OVERLAP_HOOK_180,
 *												THREE_LEGGED_OVERLAP_HOOK_180, FOUR_LEGGED_OVERLAP_HOOK_180), can be undefined (TWO_LEGGED_CLOSED_HOOK_135 as default)
 */
Member.prototype.SetConcreteDesignShearReinforcementBaseData = function (shear_reinforcement_no,
	material_no,
	stirrup_type) {
	MemberSetConcreteDesignShearReinforcementBaseData(this.member, shear_reinforcement_no, material_no, stirrup_type);
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
Member.prototype.SetConcreteDesignShearReinforcementStirrupParameters = function (shear_reinforcement_no,
	stirrup_diameter,
	stirrup_distances,
	stirrup_count,
	crossties_active,
	crossties_diameter) {
	MemberSetConcreteDesignShearReinforcementStirrupParameters(this.member, shear_reinforcement_no, stirrup_diameter, stirrup_distances, stirrup_count, crossties_active, crossties_diameter);
};

/**
 * Sets Shear reinforcement areas
 * @param {Number} shear_reinforcement_no 	Shear reinforcement number
 * @param {Number} reinforcement_area 		Area
 */
Member.prototype.SetConcreteDesignShearReinforcementAreas = function (shear_reinforcement_no,
	reinforcement_area) {
	MemberSetConcreteDesignShearReinforcementAreas(this.member, shear_reinforcement_no, reinforcement_area);
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
Member.prototype.SetConcreteDesignShearReinforcementSpanLocation = function (shear_reinforcement_no,
	span_position_reference_type,
	span_start,
	span_end,
	span_position_reference_x_location,
	definition_format_absolute) {
	MemberSetConcreteDesignShearReinforcementSpanLocation(this.member, shear_reinforcement_no, span_position_reference_type, span_start, span_end, span_position_reference_x_location, definition_format_absolute);
};

/**
 * Sets Border distance of stirrups
 * @param {Number} shear_reinforcement_no 	Shear reinforcement number
 * @param {String} stirrup_layout_rule 		Layout rule (START_EQUALS_END, START_DEFINED, START_EQUALS_REST_LENGTH_TO_STIRRUP_DISTANCED, END_DEFINED, END_EQUALS_REST_LENGTH_TO_STIRRUP_DISTANCED), can be undefined (START_EQUALS_END as default)
 */
Member.prototype.SetConcreteDesignShearReinforcementBorderDistancesOfStirrups = function (shear_reinforcement_no,
	stirrup_layout_rule) {
	MemberSetConcreteDesignShearReinforcementBorderDistancesOfStirrups(this.member, shear_reinforcement_no, stirrup_layout_rule);
};

/**
 * Adds Longitudinal reinforcement
 * @returns 	Number of longitudinal reinforcement
 */
Member.prototype.AddConcreteDesignLongitudinalReinforcement = function () {
	return MemberAddConcreteDesignLongitudinalReinforcement(this.member);
};

/**
 * Removes longitudinal reinforcement
 * @param {Number} longitudinal_reinforcement_no 	Longitudinal reinforcement number
 */
Member.prototype.RemoveConcreteDesignLongitudinalReinforcement = function(longitudinal_reinforcement_no) {
	MemberRemoveConcreteDesignLongitudinalReinforcement(this.member, longitudinal_reinforcement_no);
};

/**
 * Sets Longitudinal reinforcement Base data
 * @param {Number} longitudinal_reinforcement_no 						Longitudinal reinforcement number
 * @param {String} rebar_type 											Rebar type (SYMMETRICAL, UNSYMMETRICAL, UNIFORMLY_SURROUNDING, LINE, SINGLE), can be undefined (SYMMETRICAL as default)
 * @param {Number} material_no 											Material number
 * @param {Boolean} reinforcement_placed_in_bending_corner_enabled 		Reinforcement placed in the bent corner of thi stirrup (column), can be undefined (is not set, false as default)
 */
Member.prototype.SetConcreteDesignLongitudinalReinforcementBaseData = function (longitudinal_reinforcement_no,
	rebar_type,
	material_no,
	reinforcement_placed_in_bending_corner_enabled) {
	MemberSetConcreteDesignLongitudinalReinforcementBaseData(this.member, longitudinal_reinforcement_no, rebar_type, material_no, reinforcement_placed_in_bending_corner_enabled);
};

/**
 * Sets Longitudinal reinforcement rebar symmetrical parameters
 * @param {Number} longitudinal_reinforcement_no 		Longitudinal reinforcement number
 * @param {Number} bar_count_symmetrical 				Number of bars | Side, can be undefined (is not set, 3 as default)
 * @param {Number} bar_diameter_symmetrical 			Bar diameter | Side, can be undefined (is not set, 20 mm as default)
 * @param {Boolean} corner_reinforcement_enabled 		Corner reinforcement, can be undefined (is not set, false as default)
 * @param {Number} bar_diameter_corner 					Bar diameter | Corner, can be undefined (is not set, 20 mm as default)
 */
Member.prototype.SetConcreteDesignLongitudinalReinforcementSymmetricalRebarParameters = function (longitudinal_reinforcement_no,
	bar_count_symmetrical,
	bar_diameter_symmetrical,
	corner_reinforcement_enabled,
	bar_diameter_corner) {
	MemberSetConcreteDesignLongitudinalReinforcementSymmetricalRebarParameters(this.member, longitudinal_reinforcement_no, bar_count_symmetrical, bar_diameter_symmetrical, corner_reinforcement_enabled, bar_diameter_corner);
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
Member.prototype.SetConcreteDesignLongitudinalReinforcementUnSymmetricalRebarParameters = function (longitudinal_reinforcement_no,
	bar_count_unsymmetrical_top_side,
	bar_diameter_unsymmetrical_top_side,
	bar_count_unsymmetrical_at_side,
	bar_diameter_unsymmetrical_at_side,
	bar_count_unsymmetrical_bottom_side,
	bar_diameter_unsymmetrical_bottom_side,
	corner_reinforcement_enabled,
	bar_diameter_corner) {
	MemberSetConcreteDesignLongitudinalReinforcementUnSymmetricalRebarParameters(this.member, longitudinal_reinforcement_no, bar_count_unsymmetrical_top_side, bar_diameter_unsymmetrical_top_side, 
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
Member.prototype.SetConcreteDesignLongitudinalReinforcementUniformlySurroundingRebarParameters = function (longitudinal_reinforcement_no,
	bar_count_uniformly_surrounding,
	bar_diameter_uniformly_surrounding,
	corner_reinforcement_enabled,
	bar_diameter_corner) {
	MemberSetConcreteDesignLongitudinalReinforcementUniformlySurroundingRebarParameters(this.member, longitudinal_reinforcement_no, bar_count_uniformly_surrounding, bar_diameter_uniformly_surrounding, 
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
Member.prototype.SetConcreteDesignLongitudinalReinforcementLineRebarParameters = function (longitudinal_reinforcement_no,
	bar_count_line,
	bar_diameter_line,
	additional_offset_type_single_line,
	additional_offset_reference_type_at_start,
	additional_horizontal_offset_at_start,
	additional_vertical_offset_at_start,
	additional_offset_reference_type_at_end,
	additional_horizontal_offset_at_end,
	additional_vertical_offset_at_end) {
	MemberSetConcreteDesignLongitudinalReinforcementLineRebarParameters(this.member, longitudinal_reinforcement_no, bar_count_line, bar_diameter_line, additional_offset_type_single_line,
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
Member.prototype.SetConcreteDesignLongitudinalReinforcementSingleRebarParameters = function (longitudinal_reinforcement_no,
	bar_diameter_single,
	additional_offset_type_single_line,
	additional_offset_reference_type,
	additional_horizontal_offset,
	additional_vertical_offset) {
	MemberSetConcreteDesignLongitudinalReinforcementSingleRebarParameters(this.member, longitudinal_reinforcement_no, bar_diameter_single, additional_offset_type_single_line, additional_offset_reference_type,
		additional_horizontal_offset, additional_vertical_offset);
};

/**
 * Sets Longitudinal reinforcement symmetrical areas
 * @param {Number} longitudinal_reinforcement_no 	Longitudinal reinforcement number
 * @param {Number} reinforcement_area_symmetrical 	Side
 */
Member.prototype.SetConcreteDesignLongitudinalReinforcementSymmetricalAreas = function (longitudinal_reinforcement_no,
	reinforcement_area_symmetrical) {
	MemberSetConcreteDesignLongitudinalReinforcementSymmetricalAreas(this.member, longitudinal_reinforcement_no, reinforcement_area_symmetrical);
};

/**
 * Sets Longitudinal reinforcement unsymmetrical areas
 * @param {Number} longitudinal_reinforcement_no 					Longitudinal reinforcement number
 * @param {Number} reinforcement_area_unsymmetrical_top_side 		Top side, can be undefined
 * @param {Number} reinforcement_area_unsymmetrical_at_side 		Lateral sides, can be undefined
 * @param {Number} reinforcement_area_unsymmetrical_bottom_side 	Bottom side, can be undefined
 */
Member.prototype.SetConcreteDesignLongitudinalReinforcementUnSymmetricalAreas = function (longitudinal_reinforcement_no,
	reinforcement_area_unsymmetrical_top_side,
	reinforcement_area_unsymmetrical_at_side,
	reinforcement_area_unsymmetrical_bottom_side) {
	MemberSetConcreteDesignLongitudinalReinforcementUnSymmetricalAreas(this.member, longitudinal_reinforcement_no, reinforcement_area_unsymmetrical_top_side, reinforcement_area_unsymmetrical_at_side,
		reinforcement_area_unsymmetrical_bottom_side);
};

/**
 * Sets Longitudinal reinforcement uniformly surrounding areas
 * @param {Number} longitudinal_reinforcement_no 				Longitudinal reinforcement number
 * @param {Number} reinforcement_area_uniformly_surrounding 	Reinforcement area
 */
Member.prototype.SetConcreteDesignLongitudinalReinforcementUniformlySurroundingAreas = function (longitudinal_reinforcement_no,
	reinforcement_area_uniformly_surrounding) {
	MemberSetConcreteDesignLongitudinalReinforcementUniformlySurroundingAreas(this.member, longitudinal_reinforcement_no, reinforcement_area_uniformly_surrounding);
};

/**
 * Sets Longitudinal reinforcement line areas
 * @param {Number} longitudinal_reinforcement_no 	Longitudinal reinforcement number
 * @param {Number} reinforcement_area_line 			Total
 */
Member.prototype.SetConcreteDesignLongitudinalReinforcementLineAreas = function (longitudinal_reinforcement_no,
	reinforcement_area_line) {
	MemberSetConcreteDesignLongitudinalReinforcementLineAreas(this.member, longitudinal_reinforcement_no, reinforcement_area_line);
};

/**
 * Sets Longitudinal reinforcement single areas
 * @param {Number} longitudinal_reinforcement_no 	Longitudinal reinforcement number
 * @param {Number} reinforcement_area_single 		Total
 */
Member.prototype.SetConcreteDesignLongitudinalReinforcementSingleAreas = function (longitudinal_reinforcement_no,
	reinforcement_area_single) {
	MemberSetConcreteDesignLongitudinalReinforcementSingleAreas(this.member, longitudinal_reinforcement_no, reinforcement_area_single);
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
Member.prototype.SetConcreteDesignLongitudinalReinforcementSpanLocation = function (longitudinal_reinforcement_no,
	span_position_reference_type,
	span_start,
	span_end,
	span_position_reference_x_location,
	definition_format_absolute) {
	MemberSetConcreteDesignLongitudinalReinforcementSpanLocation(this.member, longitudinal_reinforcement_no, span_position_reference_type, span_start, span_end, span_position_reference_x_location,
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
Member.prototype.SetConcreteDesignLongitudinalReinforcementAdditionalOffset = function (longitudinal_reinforcement_no,
	additional_offset_type,
	additional_offset_top_side,
	additional_offset_bottom_side,
	additional_offset_left_side,
	additional_offset_right_side) {
	MemberSetConcreteDesignLongitudinalReinforcementAdditionalOffset(this.member, longitudinal_reinforcement_no, additional_offset_type, additional_offset_top_side, additional_offset_bottom_side,
		additional_offset_left_side, additional_offset_right_side);
};

/**
 * Sets Longitudinal reinforcement anchorage start
 * @param {Number} longitudinal_reinforcement_no 		Longitudinal reinforcement number
 * @param {String} anchorage_start_anchor_type 			Anchorage type (NONE, STRAIGHT, HOOK, BEND, STRAIGHT_WITH_TRANSVERSE_BAR, HOOK_WITH_TRANSVERSE_BAR, STRAIGHT_WITH_TWO_TRANSVERSE_BARS)
 * @param {Number} anchorage_start_anchor_length 		Anchor length, can be undefined
 * @param {Number} anchorage_start_bending_diameter 	Bending diameter, can be undefined
 */
Member.prototype.SetConcreteDesignLongitudinalReinforcementAnchorageStart = function (longitudinal_reinforcement_no,
	anchorage_start_anchor_type,
	anchorage_start_anchor_length,
	anchorage_start_bending_diameter) {
	MemberSetConcreteDesignLongitudinalReinforcementAnchorageStart(this.member, longitudinal_reinforcement_no, anchorage_start_anchor_type, anchorage_start_anchor_length, anchorage_start_bending_diameter);
};

/**
 * Sets Longitudinal reinforcement anchorage end
 * @param {Number} longitudinal_reinforcement_no 	Longitudinal reinforcement number
 * @param {String} anchorage_end_anchor_type 		Anchorage type (NONE, STRAIGHT, HOOK, BEND, STRAIGHT_WITH_TRANSVERSE_BAR, HOOK_WITH_TRANSVERSE_BAR, STRAIGHT_WITH_TWO_TRANSVERSE_BARS)
 * @param {Number} anchorage_end_anchor_length 		Anchor length, can be undefined
 * @param {Number} anchorage_end_bending_diameter 	Bending diameter, can be undefined
 */
Member.prototype.SetConcreteDesignLongitudinalReinforcementAnchorageEnd = function (longitudinal_reinforcement_no,
	anchorage_end_anchor_type,
	anchorage_end_anchor_length,
	anchorage_end_bending_diameter) {
	MemberSetConcreteDesignLongitudinalReinforcementAnchorageEnd(this.member, longitudinal_reinforcement_no, anchorage_end_anchor_type, anchorage_end_anchor_length, anchorage_end_bending_diameter);
};

/**
 * Sets Steel design configurations (Steel design add-on)
 * @param {Number} member_uls_configuration_no 	Ultimate configuration number, can be undefined
 * @param {Number} member_sls_configuration_no 	Serviceability configuration number, can be undefined
 * @param {Number} member_fr_configuration_no 		Fire resistance configuration number, can be undefined
 */
Member.prototype.SetDesignConfigurations = function (member_uls_configuration_no,
	member_sls_configuration_no,
	member_fr_configuration_no) {
	ASSERT(this.member.design_properties_via_member, "Design properties must be on");
	if (STEEL_DESIGN.isActive()) {
		if (typeof member_uls_configuration_no !== "undefined") {
			ASSERT(!Member_IsSteelDesignCurrentCodeOfStandard("AISC"), "Ultimate configuration can't be set for AISC code of standard");
			if (__objectExists(member_uls_configuration_no, "Ultimate configuration", STEEL_DESIGN.steel_design_uls_configurations)) {
				this.member.member_steel_design_uls_configuration = member_uls_configuration_no;
			}
		}
		if (typeof member_sls_configuration_no !== "undefined" && __objectExists(member_sls_configuration_no, "Serviceability configuration", STEEL_DESIGN.steel_design_sls_configurations)) {
			this.member.member_steel_design_sls_configuration = member_sls_configuration_no;
		}
		if (typeof member_fr_configuration_no !== "undefined") {
			ASSERT(Member_IsSteelDesignCurrentCodeOfStandard("EN") || Member_IsSteelDesignCurrentCodeOfStandard("NTC"), "Fire resistance configuration can be set only for EN, NTC code of standards");
			if (__objectExists(member_fr_configuration_no, "Fire resistance configuration", STEEL_DESIGN.steel_design_fr_configurations)) {
				this.member.member_steel_design_fr_configuration = member_fr_configuration_no;
			}
		}
	}
	else if (CONCRETE_DESIGN.isActive()) {
		ASSERT(typeof member_fr_configuration_no === "undefined", "Fire resistance configuration is not supported in Concrete design add-on");
		if (typeof member_uls_configuration_no !== "undefined") {
			ASSERT(!Member_IsConcreteDesignCurrentCodeOfStandard("AISC"), "Ultimate configuration can't be set for AISC code of standard");
			if (__objectExists(member_uls_configuration_no, !Member_IsConcreteDesignCurrentCodeOfStandard("AIC") ? "Ultimate configuration" : "Strength configuration", CONCRETE_DESIGN.concrete_design_uls_configurations)) {
				this.member.member_concrete_design_uls_configuration = member_uls_configuration_no;
			}
		}
		if (typeof member_sls_configuration_no !== "undefined" && __objectExists(member_sls_configuration_no, "Serviceability configuration", CONCRETE_DESIGN.concrete_design_sls_configurations)) {
			this.member.member_concrete_design_sls_configuration = member_sls_configuration_no;
		}
	}
};

/**
 * Sets Deflection analysis
 * @param {String} deflection_check_direction 				Check direction (LOCAL_AXIS_Z, LOCAL_AXIS_Y, LOCAL_AXIS_Z_AND_Y, RESULTING_AXIS), can be undefined (LOCAL_AXIS_Z_AND_Y as default)
 * @param {String} deflection_check_displacement_reference 	Displacement reference (DEFORMED_SEGMENT_ENDS, DEFORMED_UNDEFORMED_SYSTEM), can be undefined (DEFORMED_SEGMENT_ENDS as default)
 * @param {Boolean} active_z 								Segment in z-axis - active, can be undefined (true as default)
 * @param {Number} length_z 								Segment in z-axis - length, can be undefined (member length as default)
 * @param {Number} precamber_z 								Segment in z-axis - precamber, can be undefined (0.0 as default)
 * @param {Boolean} active_y 								Segment in y-axis - active, can be undefined (true as default)
 * @param {Number} length_y 								Segment in y-axis - length, can be undefined (member length as default)
 * @param {Number} precamber_y 								Segment in y-axis - precamber, can be undefined (0.0 as default)
 */
Member.prototype.SetDeflectionAnalysis = function (deflection_check_direction,
	deflection_check_displacement_reference,
	active_z,
	length_z,
	precamber_z,
	active_y,
	length_y,
	precamber_y) {
	ASSERT(this.member.design_properties_via_member, "Design properties must be on");
	this.member.deflection_check_direction = GetMemberDesignSupportCheckDirection(deflection_check_direction);
	this.member.deflection_check_displacement_reference = GetMemberDesignCheckDisplacementDirection(deflection_check_displacement_reference);
	if (typeof active_z !== "undefined") {
		ASSERT(this.member.deflection_check_direction !== members.DEFLECTION_CHECK_DIRECTION_LOCAL_AXIS_Y, "Check direction can't be " + members.DEFLECTION_CHECK_DIRECTION_LOCAL_AXIS_Y);
		this.member.deflection_segments_z_axis[1].active = active_z;
	}
	if (typeof length_z !== "undefined") {
		ASSERT(this.member.deflection_check_direction !== members.DEFLECTION_CHECK_DIRECTION_LOCAL_AXIS_Y, "Check direction can't be " + members.DEFLECTION_CHECK_DIRECTION_LOCAL_AXIS_Y);
		this.member.deflection_segments_defined_length_z_axis_enabled = true;
		this.member.deflection_segments_z_axis[1].length = length_z;
	}
	else {
		this.member.deflection_segments_defined_length_z_axis_enabled = false;
	}
	if (typeof precamber_z !== "undefined") {
		ASSERT(this.member.deflection_check_direction !== members.DEFLECTION_CHECK_DIRECTION_LOCAL_AXIS_Y, "Check direction can't be " + members.DEFLECTION_CHECK_DIRECTION_LOCAL_AXIS_Y);
		this.member.deflection_segments_z_axis[1].precamber = precamber_z;
	}
	if (typeof active_y !== "undefined") {
		ASSERT(this.member.deflection_check_direction !== members.DEFLECTION_CHECK_DIRECTION_LOCAL_AXIS_Z, "Check direction can't be " + members.DEFLECTION_CHECK_DIRECTION_LOCAL_AXIS_Z);
		this.member.deflection_segments_y_axis[1].active = active_y;
	}
	if (typeof length_y !== "undefined") {
		ASSERT(this.member.deflection_check_direction !== members.DEFLECTION_CHECK_DIRECTION_LOCAL_AXIS_Z, "Check direction can't be " + members.DEFLECTION_CHECK_DIRECTION_LOCAL_AXIS_Z);
		this.member.deflection_segments_defined_length_y_axis_enabled = true;
		this.member.deflection_segments_y_axis[1].length = length_y;
	}
	else {
		this.member.deflection_segments_defined_length_y_axis_enabled = false;
	}
	if (typeof precamber_y !== "undefined") {
		ASSERT(this.member.deflection_check_direction !== members.DEFLECTION_CHECK_DIRECTION_LOCAL_AXIS_Z, "Check direction can't be " + members.DEFLECTION_CHECK_DIRECTION_LOCAL_AXIS_Z);
		this.member.deflection_segments_y_axis[1].precamber = precamber_y;
	}
};

/**
* Support function for section distributions (private), more info can be find there
*/
var setDistributionAtStart = function (member,
	atStartValues) {
	if (typeof atStartValues !== "undefined") {
		ASSERT(atStartValues.length === 2, "Section distance from start: [distance, is_relative]");
		member.section_distance_from_start_is_defined_as_relative = atStartValues[1];
		if (member.section_distance_from_start_is_defined_as_relative) {
			member.section_distance_from_start_relative = atStartValues[0];
		}
		else {
			member.section_distance_from_start_absolute = atStartValues[0];
		}
	}
};

/**
* Support function for section distributions (private), more info can be find there
*/
var setDistributionAtEnd = function (member,
	atEndValues) {
	if (typeof atEndValues !== "undefined") {
		ASSERT(atEndValues.length == 2, "Section distance from end: [distance, is_relative]");
		member.section_distance_from_end_is_defined_as_relative = atEndValues[1];
		if (member.section_distance_from_end_is_defined_as_relative) {
			member.section_distance_from_end_relative = atEndValues[0];
		}
		else {
			member.section_distance_from_end_absolute = atEndValues[0];
		}
	}
};

/**
* Sets result beam objects
* @param	{Object}		member			Member to be set
* @param	{String}		param1_to_set	Name of parameter for include/exclude "all" objects
* @param	{String}		param2_to_set	Name of parameter for include/exclude object's indexes
* @param	{Boolean/Array}	value			Value can be specified in two formats, as boolean or array with numbers
* @return	Modified member
*/
var setResultBeamObjects = function (member,
	param1_to_set,
	param2_to_set,
	value) {
	if (typeof value === "boolean") {
		member[param1_to_set] = value;
	}
	else if (typeof value !== "undefined") {
		ASSERT(Array.isArray(value), "It must be specified true or indexes of included objects");
		if (typeof param1_to_set !== "undefined") {
			member[param1_to_set] = false;
		}
		member[param2_to_set] = value;
	}
};

/**
 * Creates member (private)
 * @param	{Number}		no				Index of member, can be undefined
 * @param	{Array/Number}	nodes_or_line	List of node indexes or number of line
 * @param	{String}		type			Type of member, can be undefined
 * @param	{Number}		section_start	Section start, can be undefined. Section end is same as section start by default. To set section end specify distribution type.
 * @param	{String}		comment			Comment, can be undefined
 * @param	{Object}		params  		Member's parameters, can be undefined
 * @returns	Created member
 */
var createBaseMember = function (no,
	nodes_or_line,
	type,
	section_start,
	comment,
	params) {
	ASSERT(typeof nodes_or_line !== "undefined", "Nodes or line must be defined");

	if (Array.isArray(nodes_or_line)) {
		// Member is defined by nodes
		if (RFEM) {
			// Member will be defined by line with defined nodes
			ASSERT(nodes_or_line.length >= 2, "At least two nodes must be set as member's defined nodes");
		}
		else {
			// RSTAB has no lines, therefore member will be defined by two nodes
			ASSERT(nodes_or_line.length === 2, "Two nodes must be set as member's defined nodes");
		}
	}
	else {
		ASSERT(RFEM, "Member can be defined by line only with RFEM");
	}
	var member = undefined;
	if (RFEM) {
		if (Array.isArray(nodes_or_line)) {
			// Member is defined by line created from defined nodes
			var line = engine.create_line(no, nodes_or_line);
			member = engine.create_member(no, line);
		}
		else {
			// Member is defined by line
			member = engine.create_member(no, nodes_or_line);
		}
	}
	else {
		// Member is defined by two nodes
		member = engine.create_member(no, nodes_or_line[0], nodes_or_line[1]);
	}
	if (typeof type !== "undefined") {
		member.type = type;
	}
	if (typeof section_start !== "undefined") {
		ASSERT(sections.exist(section_start), "Section no. " + section_start + " doesn't exist");
		member.section_start = sections[section_start];
	}
	set_comment_and_parameters(member, comment, params);

	return member;
};

function GetResultBeamIntegrationType(direction) {
	const ResultBeamIntegrate_dict = {
		"INTEGRATE_WITHIN_CUBOID_QUADRATIC": members.INTEGRATE_WITHIN_CUBOID_QUADRATIC,
		"INTEGRATE_WITHIN_CUBOID_GENERAL": members.INTEGRATE_WITHIN_CUBOID_GENERAL,
		"INTEGRATE_WITHIN_CYLINDER": members.INTEGRATE_WITHIN_CYLINDER,
		"INTEGRATE_FROM_LISTED_OBJECT": members.INTEGRATE_FROM_LISTED_OBJECT,
	};

	if (direction !== undefined) {
		var ResultBeamIntegrate = ResultBeamIntegrate_dict[direction];
		if (ResultBeamIntegrate === undefined) {
			console.log("Wrong type of result beam integration type. Value was: " + direction);
			console.log("Correct values are: ( " + Object.keys(direction_dict) + ")");
			direction = members.INTEGRATE_WITHIN_CUBOID_QUADRATIC;
		}
		return ResultBeamIntegrate;
	}
	else {
		return members.INTEGRATE_WITHIN_CUBOID_QUADRATIC;
	}
}


function GetRibAlignmentType(alignment) {
	const Alignment_dict = {
		"ALIGNMENT_ON_Z_SIDE_NEGATIVE": members.ALIGNMENT_ON_Z_SIDE_NEGATIVE,
		"ALIGNMENT_CENTRIC": members.ALIGNMENT_CENTRIC,
		"ALIGNMENT_ON_Z_SIDE_POSITIVE": members.ALIGNMENT_ON_Z_SIDE_POSITIVE,
		"ALIGNMENT_USER_DEFINED_VIA_MEMBER_ECCENTRICITY": members.ALIGNMENT_USER_DEFINED_VIA_MEMBER_ECCENTRICITY,
	};

	if (alignment !== undefined) {
		var RibAlignment = Alignment_dict[alignment];
		if (RibAlignment === undefined) {
			console.log("Wrong type of rib alignment type. Value was: " + alignment);
			console.log("Correct values are: ( " + Object.keys(Alignment_dict) + ")");
			direction = members.ALIGNMENT_ON_Z_SIDE_POSITIVE;
		}
		return RibAlignment;
	}
	else {
		return members.ALIGNMENT_ON_Z_SIDE_POSITIVE;
	}
}

function GetReferenceLengthType(referenceLength) {
	const referenceLength_dict = {
		"REFERENCE_LENGTH_TYPE_SEGMENT_LENGTH": members.REFERENCE_LENGTH_TYPE_SEGMENT_LENGTH,
		"REFERENCE_LENGTH_TYPE_MEMBER_LENGTH": members.REFERENCE_LENGTH_TYPE_MEMBER_LENGTH,
		"REFERENCE_LENGTH_TYPE_USER_DEFINED": members.REFERENCE_LENGTH_TYPE_USER_DEFINED,
	};

	if (referenceLength !== undefined) {
		var ReferenceLength = referenceLength_dict[referenceLength];
		if (ReferenceLength === undefined) {
			console.log("Wrong type of reference length type. Value was: " + referenceLength);
			console.log("Correct values are: ( " + Object.keys(referenceLength_dict) + ")");
			direction = members.REFERENCE_LENGTH_TYPE_SEGMENT_LENGTH;
		}
		return ReferenceLength;
	}
	else {
		return members.REFERENCE_LENGTH_TYPE_SEGMENT_LENGTH;
	}
}

function GetReferenceWidthType(width) {
	const widthType_dict = {
		"REFERENCE_LENGTH_WIDTH_NONE": members.REFERENCE_LENGTH_WIDTH_NONE,
		"REFERENCE_LENGTH_WIDTH_SIXTH": members.REFERENCE_LENGTH_WIDTH_SIXTH,
		"REFERENCE_LENGTH_WIDTH_EIGHTH": members.REFERENCE_LENGTH_WIDTH_EIGHTH,
		"REFERENCE_LENGTH_WIDTH_EC2": members.REFERENCE_LENGTH_WIDTH_EC2,
	};

	if (width !== undefined) {
		var WidthType = widthType_dict[width];
		if (WidthType === undefined) {
			console.log("Wrong type of reference width type. Value was: " + width);
			console.log("Correct values are: ( " + Object.keys(widthType_dict) + ")");
			direction = members.REFERENCE_LENGTH_WIDTH_SIXTH;
		}
		return WidthType;
	}
	else {
		return members.REFERENCE_LENGTH_WIDTH_SIXTH;
	}
}

function SetFlangeDimensions(member, flange_dimensions) {
	if (flange_dimensions !== undefined) {
		for (var index = 0; index < flange_dimensions.length; index++) {
			const row = flange_dimensions[index];
			member.flange_dimensions[index + 1].end_ordinate = row[0];
			member.flange_dimensions[index + 1].reference_length_width = GetReferenceWidthType(row[2]);
			member.flange_dimensions[index + 1].width_minus_y_maximal = row[3];
			member.flange_dimensions[index + 1].width_plus_y_maximal = row[4];
			if (member.flange_dimensions[index + 1].reference_length_width !== members.REFERENCE_LENGTH_WIDTH_NONE) {
				member.flange_dimensions[index + 1].reference_length_definition_type = GetReferenceLengthType(row[1]);
				if (member.flange_dimensions[index + 1].reference_length_definition_type === members.REFERENCE_LENGTH_TYPE_USER_DEFINED) {
					if (row[5] !== undefined && typeof row[5] === 'number') {
						member.flange_dimensions[index + 1].reference_length = row[5];
					}
				}
			} else {
				if (row[6] !== undefined && typeof row[6] === 'number') {
					member.flange_dimensions[index + 1].width_minus_y_integrative = row[6];
				}
				if (row[7] !== undefined && typeof row[7] === 'number') {
					member.flange_dimensions[index + 1].width_plus_y_integrative = row[7];
				}
			}
		}
	}
	else {
		member.flange_dimensions[1].end_ordinate = 1.0;
		member.flange_dimensions[1].reference_length_definition_type = GetReferenceLengthType("REFERENCE_LENGTH_TYPE_SEGMENT_LENGTH");
		member.flange_dimensions[1].reference_length_width = GetReferenceWidthType("REFERENCE_LENGTH_WIDTH_SIXTH");
		member.flange_dimensions[1].width_minus_y_maximal = 3.0;
		member.flange_dimensions[1].width_plus_y_maximal = 3.0;
	}
}

function GetMemberSectionAlignment(section_alignment) {
	const section_alignments_dict = {
        "TOP": members.SECTION_ALIGNMENT_TOP,
		"CENTRIC": members.SECTION_ALIGNMENT_CENTRIC,
		"BOTTOM": members.SECTION_ALIGNMENT_BOTTOM
	};

	if (section_alignment === "ALIGN_CENTER") {
		section_alignment = "ALIGN_MIDDLE";
	}

	if (section_alignment !== undefined) {
	  var alignment = section_alignments_dict[section_alignment];
	  if (alignment === undefined) {
		console.log("Wrong alignment type. Value was: " + section_alignment);
		console.log("Correct values are: ( " + Object.keys(section_alignments_dict) + ")");
		alignment = members.SECTION_ALIGNMENT_TOP;
	  }
	  return alignment;
	}
	else {
	  return members.SECTION_ALIGNMENT_TOP;
	}
}

function GetMemberDesignSupportCheckDirection (direction_type) {
	const direction_types_dict = {
        "LOCAL_AXIS_Z": members.DEFLECTION_CHECK_DIRECTION_LOCAL_AXIS_Z,
		"LOCAL_AXIS_Y": members.DEFLECTION_CHECK_DIRECTION_LOCAL_AXIS_Y,
		"LOCAL_AXIS_Z_AND_Y": members.DEFLECTION_CHECK_DIRECTION_LOCAL_AXIS_Z_AND_Y,
		"RESULTING_AXIS": members.DEFLECTION_CHECK_DIRECTION_RESULTING_AXIS
	};

	if (direction_type !== undefined) {
		var type = direction_types_dict[direction_type];
		if (type === undefined) {
			console.log("Wrong design support check direction type. Value was: " + direction_type);
			console.log("Correct values are: ( " + Object.keys(direction_types_dict) + ")");
			type = members.DEFLECTION_CHECK_DIRECTION_LOCAL_AXIS_Z_AND_Y;
		}
		return type;
	}
	else {
		return members.DEFLECTION_CHECK_DIRECTION_LOCAL_AXIS_Z_AND_Y;
	}
}

function GetMemberDesignCheckDisplacementDirection (direction_type) {
	const direction_types_dict = {
        "DEFORMED_SEGMENT_ENDS": members.DEFLECTION_CHECK_DISPLACEMENT_REFERENCE_DEFORMED_SEGMENT_ENDS,
		"DEFORMED_UNDEFORMED_SYSTEM": members.DEFLECTION_CHECK_DISPLACEMENT_REFERENCE_DEFORMED_UNDEFORMED_SYSTEM
	};

	if (direction_type !== undefined) {
		var type = direction_types_dict[direction_type];
		if (type === undefined) {
			console.log("Wrong design support check displacement type. Value was: " + direction_type);
			console.log("Correct values are: ( " + Object.keys(direction_types_dict) + ")");
			type = members.DEFLECTION_CHECK_DISPLACEMENT_REFERENCE_DEFORMED_SEGMENT_ENDS;
		}
		return type;
	}
	else {
		return members.DEFLECTION_CHECK_DISPLACEMENT_REFERENCE_DEFORMED_SEGMENT_ENDS;
	}
}

function Member_GetCurrentSteelDesignCodeOfStandard () {
	ASSERT(STEEL_DESIGN.isActive(), "Steel design add-on must be active");
    return general.current_standard_for_steel_design.match(/\w+/);
}

function Member_IsSteelDesignCurrentCodeOfStandard (current_standard) {
	ASSERT(STEEL_DESIGN.isActive(), "Steel design add-on must be active");
    return Member_GetCurrentSteelDesignCodeOfStandard() == current_standard;  // Don't use === (we don't want compare types of strings)
}

function Member_GetConcreteDesignCurrentCodeOfStandard () {
	ASSERT(CONCRETE_DESIGN.isActive(), "Concrete design add-on must be active");
    return general.current_standard_for_concrete_design.match(/\w+/);
}

function Member_IsConcreteDesignCurrentCodeOfStandard (current_standard) {
    return Member_GetConcreteDesignCurrentCodeOfStandard() == current_standard;  // Don't use === (we don't want compare types of strings)
}