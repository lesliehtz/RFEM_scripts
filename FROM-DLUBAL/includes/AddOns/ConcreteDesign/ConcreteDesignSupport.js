include("../../Tools/high_level_functions_support.js");

function createBaseConcreteDesignConfiguration (object_to_create,
    no,
    surfaces_no,
    members_no,
    nodes_no,
    comment,
    params) {
    ASSERT(!RSECTION, "This script is only for RFEM or RSTAB");
    ASSERT(CONCRETE_DESIGN.isActive(), "Steel design must be active");
    ASSERT(members.count() > 0 || surfaces.count() > 0, "There must exist at least one member or surface in project");
    if (typeof no === "undefined") {
        addon = object_to_create.create();
    }
    else {
        addon = object_to_create.create(no);
    }
    assignConcreteDesignObjects(addon, surfaces_no, members_no, nodes_no);
    set_comment_and_parameters(addon, comment, params);
    return addon;
}

function assignConcreteDesignObjects (object_to_set,
    surfaces_no,
    members_no,
    nodes_no) {
    if (typeof surfaces_no !== "undefined") {
        ASSERT(Array.isArray(surfaces_no), "Surface list must be array if surface indexes");
        surface_list = surfaces_no;
        surfaces_no = [];
        for (var i = 0; i < surface_list.length; ++i) {
            if (surfaces.exist(surface_list[i])) {
                var material = surfaces[surface_list[i]].material;
                if (material.material_type === materials.TYPE_CONCRETE) {
                    if (surfaces[surface_list[i]].design_properties_via_surface) {
                        surfaces_no.push(surface_list[i]);
                    }
                    else {
                        console.log("Surface no. " + surface_list[i] + " must have design properties active");
                    }
                }
                else {
                    console.log("Material of surface no. " + surface_list[i].toString() + " must be of " + materials.TYPE_CONCRETE + " type");
                }
            }
            else {
                console.log("Surface no. " + surface_list[i] + " doesn't exist");
            }
        }
        object_to_set.assigned_to_surfaces = surfaces_no;
    }
    if (typeof members_no !== "undefined") {
        ASSERT(Array.isArray(members_no), "Member list must be array of member indexes");
        member_list = members_no;
        members_no = [];
        for (var i = 0; i < member_list.length; ++i) {
            if (members.exist(member_list[i])) {
                var material = members[member_list[i]].section_material;
                if (material.material_type === materials.TYPE_CONCRETE) {
                    members_no.push(member_list[i]);
                }
                else {
                    console.log("Material of member no. " + member_list[i].toString() + " must be of " + materials.TYPE_CONCRETE + " type");
                }
            }
            else {
                console.log("Member no. " + member_list[i] + " doesn't exist");
            }
        }
        object_to_set.assigned_to_members = members_no;
    }
    if (typeof nodes_no !== "undefined") {
        ASSERT(Array.isArray(nodes_no), "Nodes list must be array of nodes indexes");
        nodes_list = nodes_no;
        nodes_no = [];
        for (var i = 0; i < nodes_list.length; ++i) {
            if (nodes.exist(nodes_list[i])) {
                if (nodes[nodes_list[i]].punching_design) {
                    nodes_no.push(nodes_list[i]);
                }
                else {
                    console.log("Node no. " + nodes_list[i] + " must have punching design active");
                }
            }
            else {
                console.log("Node no. " + nodes_list[i] + " doesn't exist");
            }
        }
        object_to_set.assigned_to_nodes = nodes_no;
    }
}

function SetConcreteDesignMembersConsiderInternalForces (addon_settings,
    property_member_axial_forces,
    property_member_bending_moments_my,
    property_member_bending_moments_mz,
    property_member_torsional_moments,
    property_member_shear_forces_vy,
    property_member_shear_forces_vz) {
    ASSERT(members.count() > 0, "There must exist at least one member in project");
    if (typeof property_member_axial_forces !== "undefined") {
        addon_settings.property_member_axial_forces = property_member_axial_forces
    }
    if (typeof property_member_bending_moments_my !== "undefined") {
        addon_settings.property_member_bending_moments_my = property_member_bending_moments_my;
    }
    if (typeof property_member_bending_moments_mz !== "undefined") {
        addon_settings.property_member_bending_moments_mz = property_member_bending_moments_mz;
    }
    if (typeof property_member_torsional_moments !== "undefined") {
        addon_settings.property_member_torsional_moments = property_member_torsional_moments;
    }
    if (typeof property_member_shear_forces_vy !== "undefined") {
        addon_settings.property_member_shear_forces_vy = property_member_shear_forces_vy;
    }
    if (typeof property_member_shear_forces_vz !== "undefined") {
        addon_settings.property_member_shear_forces_vz = property_member_shear_forces_vz;
    }
};

function SetConcreteDesignMembersRequiredLongitudinalReinforcement (addon_settings,
    property_member_reinforcement_layout,
    property_member_reinforcement_diameter_for_preliminary_design,
    property_member_reinforcement_distribute_over_slab,
    property_member_reinforcement_distribute_over_slab_reduced_width,
    property_member_include_tensile_force_due_to_shear_in_required_longitudinal_reinforcement,
    property_member_increase_of_tension_required_reinforcement_due_to_shear) {
    ASSERT(members.count() > 0, "There must exist at least one member in project");
    addon_settings.property_member_reinforcement_layout = GetConcreteDesignPropertyMemberReinforcementLayout(property_member_reinforcement_layout);
    if (typeof property_member_reinforcement_diameter_for_preliminary_design !== "undefined") {
        ASSERT(addon_settings.property_member_reinforcement_layout !== GetConcreteDesignPropertyMemberReinforcementLayout("FACTORIZED_PROVIDED_REINFORCEMENT") &&
            addon_settings.property_member_reinforcement_layout !== GetConcreteDesignPropertyMemberReinforcementLayout("OPTIMIZED_PROVIDED_REINFORCEMENT"), "Reinforcement diameter for preliminary design can be set only if not set FACTORIZED_PROVIDED_REINFORCEMENT or OPTIMIZED_PROVIDED_REINFORCEMENT");
        if (typeof property_member_reinforcement_diameter_for_preliminary_design === "string") {
            ASSERT(property_member_reinforcement_diameter_for_preliminary_design === "MAX_OF_ALL", "Reinforcement diameter for preliminary design must be of MAX_OF_ALL type");
            addon_settings.property_member_reinforcement_diameter_for_preliminary_design = GetConcreteDesignPropertyMemberReinforcementDiameterForPreliminaryDesign("MAX_OF_ALL");
        }
        else {
            ASSERT(typeof property_member_reinforcement_diameter_for_preliminary_design === "number", "Reinforcement diameter for preliminary design must be number");
            addon_settings.property_member_reinforcement_diameter_for_preliminary_design = GetConcreteDesignPropertyMemberReinforcementDiameterForPreliminaryDesign("USER_DEFINED");
            addon_settings.property_member_reinforcement_diameter_for_preliminary_design_user_value = property_member_reinforcement_diameter_for_preliminary_design;
        }
    }
    if (typeof property_member_reinforcement_distribute_over_slab !== "undefined") {
        addon_settings.property_member_reinforcement_distribute_over_slab = property_member_reinforcement_distribute_over_slab;
    }
    if (typeof property_member_reinforcement_distribute_over_slab_reduced_width !== "undefined") {
        ASSERT(addon_settings.property_member_reinforcement_distribute_over_slab, "Member reinforcement distribute over slab must be on");
        addon_settings.property_member_reinforcement_distribute_over_slab_reduced_width = property_member_reinforcement_distribute_over_slab_reduced_width;
    }
    if (typeof property_member_include_tensile_force_due_to_shear_in_required_longitudinal_reinforcement !== "undefined") {
        addon_settings.property_member_include_tensile_force_due_to_shear_in_required_longitudinal_reinforcement = property_member_include_tensile_force_due_to_shear_in_required_longitudinal_reinforcement;
    }
    if (typeof property_member_increase_of_tension_required_reinforcement_due_to_shear !== "undefined") {
        addon_settings.property_member_increase_of_tension_required_reinforcement_due_to_shear = property_member_increase_of_tension_required_reinforcement_due_to_shear;
    }
};

function GetConcreteDesignPropertyMemberReinforcementDiameterForPreliminaryDesign(diameter_type) {
    if (IsConcreteDesignCurrentCodeOfStandard("EN") || IsConcreteDesignCurrentCodeOfStandard("NTC")) {
        return EnumValueFromJSHLFTypeName(
            diameter_type,
            "diameter",
            {
                "MAX_OF_ALL": ulsconfig_member_ec2.E_REINFORCEMENT_DIAMETER_MAX_OF_ALL,
                "USER_DEFINED": ulsconfig_member_ec2.E_REINFORCEMENT_DIAMETER_USER_DEFINED
            },
            ulsconfig_member_ec2.E_REINFORCEMENT_DIAMETER_MAX_OF_ALL);
    }
    else if (IsConcreteDesignCurrentCodeOfStandard("ACI")) {
        return EnumValueFromJSHLFTypeName(
            diameter_type,
            "diameter",
            {
                "MAX_OF_ALL": ulsconfig_member_aci318.E_REINFORCEMENT_DIAMETER_MAX_OF_ALL,
                "USER_DEFINED": ulsconfig_member_aci318.E_REINFORCEMENT_DIAMETER_USER_DEFINED
            },
            ulsconfig_member_aci318.E_REINFORCEMENT_DIAMETER_MAX_OF_ALL);
    }
    else if (IsConcreteDesignCurrentCodeOfStandard("CSA")) {
        return EnumValueFromJSHLFTypeName(
            diameter_type,
            "diameter",
            {
                "MAX_OF_ALL": ulsconfig_member_csaa233.E_REINFORCEMENT_DIAMETER_MAX_OF_ALL,
                "USER_DEFINED": ulsconfig_member_csaa233.E_REINFORCEMENT_DIAMETER_USER_DEFINED
            },
            ulsconfig_member_csaa233.E_REINFORCEMENT_DIAMETER_MAX_OF_ALL);
    }
    else if (IsConcreteDesignCurrentCodeOfStandard("SP")) {
        return EnumValueFromJSHLFTypeName(
            diameter_type,
            "diameter",
            {
                "MAX_OF_ALL": ulsconfig_member_sp63.E_REINFORCEMENT_DIAMETER_MAX_OF_ALL,
                "USER_DEFINED": ulsconfig_member_sp63.E_REINFORCEMENT_DIAMETER_USER_DEFINED
            },
            ulsconfig_member_sp63.E_REINFORCEMENT_DIAMETER_MAX_OF_ALL);
    }
    else {
        ASSERT(false, "GetConcreteDesignPropertyMemberReinforcementDiameterForPreliminaryDesign: unsupported standard");
        return;
    }
}

function GetConcreteDesignPropertyMemberReinforcementLayout(layout_type) {
    if (IsConcreteDesignCurrentCodeOfStandard("EN") || IsConcreteDesignCurrentCodeOfStandard("NTC")) {
        return EnumValueFromJSHLFTypeName(
            layout_type,
            "layout",
            {
                "TOP_BOTTOM_OPTIMIZED_DISTRIBUTION": ulsconfig_member_ec2.E_REINFORCEMENT_LAYOUT_TOP_BOTTOM_OPTIMIZED_DISTRIBUTION,
                "TOP_BOTTOM_SYMMETRICAL_DISTRIBUTION": ulsconfig_member_ec2.E_REINFORCEMENT_LAYOUT_TOP_BOTTOM_SYMMETRICAL_DISTRIBUTION,
                "IN_CORNERS_SYMMETRICAL_DISTRIBUTION": ulsconfig_member_ec2.E_REINFORCEMENT_LAYOUT_IN_CORNERS_SYMMETRICAL_DISTRIBUTION,
                "UNIFORMLY_SURROUNDING": ulsconfig_member_ec2.E_REINFORCEMENT_LAYOUT_UNIFORMLY_SURROUNDING,
                "FACTORIZED_PROVIDED_REINFORCEMENT": ulsconfig_member_ec2.E_REINFORCEMENT_LAYOUT_FACTORIZED_PROVIDED_REINFORCEMENT,
                "OPTIMIZED_PROVIDED_REINFORCEMENT": ulsconfig_member_ec2.E_REINFORCEMENT_LAYOUT_OPTIMIZED_PROVIDED_REINFORCEMENT
            },
            ulsconfig_member_ec2.E_REINFORCEMENT_LAYOUT_OPTIMIZED_PROVIDED_REINFORCEMENT);
    }
    else if (IsConcreteDesignCurrentCodeOfStandard("ACI")) {
        return EnumValueFromJSHLFTypeName(
            layout_type,
            "layout",
            {
                "TOP_BOTTOM_OPTIMIZED_DISTRIBUTION": ulsconfig_member_aci318.E_REINFORCEMENT_LAYOUT_TOP_BOTTOM_OPTIMIZED_DISTRIBUTION,
                "TOP_BOTTOM_SYMMETRICAL_DISTRIBUTION": ulsconfig_member_aci318.E_REINFORCEMENT_LAYOUT_TOP_BOTTOM_SYMMETRICAL_DISTRIBUTION,
                "IN_CORNERS_SYMMETRICAL_DISTRIBUTION": ulsconfig_member_aci318.E_REINFORCEMENT_LAYOUT_IN_CORNERS_SYMMETRICAL_DISTRIBUTION,
                "UNIFORMLY_SURROUNDING": ulsconfig_member_aci318.E_REINFORCEMENT_LAYOUT_UNIFORMLY_SURROUNDING,
                "FACTORIZED_PROVIDED_REINFORCEMENT": ulsconfig_member_aci318.E_REINFORCEMENT_LAYOUT_FACTORIZED_PROVIDED_REINFORCEMENT,
                "OPTIMIZED_PROVIDED_REINFORCEMENT": ulsconfig_member_aci318.E_REINFORCEMENT_LAYOUT_OPTIMIZED_PROVIDED_REINFORCEMENT
            },
            ulsconfig_member_aci318.E_REINFORCEMENT_LAYOUT_OPTIMIZED_PROVIDED_REINFORCEMENT);
    }
    else if (IsConcreteDesignCurrentCodeOfStandard("CSA")) {
        return EnumValueFromJSHLFTypeName(
            layout_type,
            "layout",
            {
                "TOP_BOTTOM_OPTIMIZED_DISTRIBUTION": ulsconfig_member_csaa233.E_REINFORCEMENT_LAYOUT_TOP_BOTTOM_OPTIMIZED_DISTRIBUTION,
                "TOP_BOTTOM_SYMMETRICAL_DISTRIBUTION": ulsconfig_member_csaa233.E_REINFORCEMENT_LAYOUT_TOP_BOTTOM_SYMMETRICAL_DISTRIBUTION,
                "IN_CORNERS_SYMMETRICAL_DISTRIBUTION": ulsconfig_member_csaa233.E_REINFORCEMENT_LAYOUT_IN_CORNERS_SYMMETRICAL_DISTRIBUTION,
                "UNIFORMLY_SURROUNDING": ulsconfig_member_csaa233.E_REINFORCEMENT_LAYOUT_UNIFORMLY_SURROUNDING,
                "FACTORIZED_PROVIDED_REINFORCEMENT": ulsconfig_member_csaa233.E_REINFORCEMENT_LAYOUT_FACTORIZED_PROVIDED_REINFORCEMENT,
                "OPTIMIZED_PROVIDED_REINFORCEMENT": ulsconfig_member_csaa233.E_REINFORCEMENT_LAYOUT_OPTIMIZED_PROVIDED_REINFORCEMENT
            },
            ulsconfig_member_csaa233.E_REINFORCEMENT_LAYOUT_OPTIMIZED_PROVIDED_REINFORCEMENT);
    }
    else if (IsConcreteDesignCurrentCodeOfStandard("SP")) {
        return EnumValueFromJSHLFTypeName(
            layout_type,
            "layout",
            {
                "TOP_BOTTOM_OPTIMIZED_DISTRIBUTION": ulsconfig_member_sp63.E_REINFORCEMENT_LAYOUT_TOP_BOTTOM_OPTIMIZED_DISTRIBUTION,
                "TOP_BOTTOM_SYMMETRICAL_DISTRIBUTION": ulsconfig_member_sp63.E_REINFORCEMENT_LAYOUT_TOP_BOTTOM_SYMMETRICAL_DISTRIBUTION,
                "IN_CORNERS_SYMMETRICAL_DISTRIBUTION": ulsconfig_member_sp63.E_REINFORCEMENT_LAYOUT_IN_CORNERS_SYMMETRICAL_DISTRIBUTION,
                "UNIFORMLY_SURROUNDING": ulsconfig_member_sp63.E_REINFORCEMENT_LAYOUT_UNIFORMLY_SURROUNDING,
                "FACTORIZED_PROVIDED_REINFORCEMENT": ulsconfig_member_sp63.E_REINFORCEMENT_LAYOUT_FACTORIZED_PROVIDED_REINFORCEMENT,
                "OPTIMIZED_PROVIDED_REINFORCEMENT": ulsconfig_member_sp63.E_REINFORCEMENT_LAYOUT_OPTIMIZED_PROVIDED_REINFORCEMENT
            },
            ulsconfig_member_sp63.E_REINFORCEMENT_LAYOUT_OPTIMIZED_PROVIDED_REINFORCEMENT);
    }
    else {
        ASSERT(false, "GetConcreteDesignPropertyMemberReinforcementLayout: unsupported standard");
        return;
    }
}

function SetConcreteDesignRequiredShearReinforcementType(addon_settings,
    property_kind,
    shear_reinforcement_types,
    shear_reinforcement_type) {
	if (shear_reinforcement_type !== undefined) {
	  if (shear_reinforcement_types.indexOf(shear_reinforcement_type) === -1)
      {
        console.log("Wrong shear reinforcement type. Value was: " + shear_reinforcement_type);
		console.log("Correct values are: ( " + shear_reinforcement_types + ")");
		return;
      }
	}
	else {
        shear_reinforcement_type = "REQUIRED";
	}
    switch (shear_reinforcement_type) {
        case "REQUIRED":
            if (property_kind === "member") {
                addon_settings.property_member_longitudinal_reinforcement_use_required = true;
            }
            else if (property_kind === "surface") {
                addon_settings.property_surface_longitudinal_reinforcement_use_required = true;
            }
            else {
                ASSERT(false, "SetConcreteDesignRequiredShearReinforcementType");
            }
            break;
        case "PROVIDED":
            if (property_kind === "member") {
                addon_settings.property_member_longitudinal_reinforcement_use_provided = true;
            }
            else if (property_kind === "surface") {
                addon_settings.property_surface_longitudinal_reinforcement_use_provided = true;
            }
            else {
                ASSERT(false, "SetConcreteDesignRequiredShearReinforcementType");
            }
            break;
        case "AUTOMATICALLY":
            if (property_kind === "member") {
                addon_settings.property_member_longitudinal_reinforcement_automatically_increase_required = true;
            }
            else if (property_kind === "surface") {
                addon_settings.property_surface_longitudinal_reinforcement_automatically_increase_required = true;
            }
            else {
                ASSERT(false, "SetConcreteDesignRequiredShearReinforcementType");
            }
            break;
        default:
            ASSERT(false, "SetConcreteDesignRequiredShearReinforcement: unknown shear reinforcement type");
    }
}

function GetConcreteDesignCurrentCodeOfStandard () {
    return general.current_standard_for_concrete_design.match(/\w+/);
}

function IsConcreteDesignCurrentCodeOfStandard (current_standard) {
    return GetConcreteDesignCurrentCodeOfStandard() == current_standard;  // Don't use === (we don't want compare types of strings)
}

function SetConcreteDesignMembersCalculationSetting (addon_settings,
    property_member_net_concrete_area) {
    ASSERT(members.count() > 0, "There must exist at least one member in project");
    if (typeof property_member_net_concrete_area === "undefined") {
        property_member_net_concrete_area = true;
    }
    addon_settings.property_member_net_concrete_area = property_member_net_concrete_area;
}

function SetConcreteDesignStabilityRequiredReinforcement (addon_settings,
    property_stability_reinforcement_layout,
    reinforcement_diameter_for_preliminary_design_user_value) {
    ASSERT(members.count() > 0, "There must exist at least one member in project");
    addon_settings.property_stability_reinforcement_layout = GetConcreteDesignStabilityReinforcementLayout(property_stability_reinforcement_layout);
    if (typeof reinforcement_diameter_for_preliminary_design_user_value !== "undefined") {
        ASSERT(addon_settings.property_stability_reinforcement_layout !== GetConcreteDesignStabilityReinforcementLayout("FACTORIZED_PROVIDED_REINFORCEMENT"), "Reinforcement layout can't be of Factorize provided reinforcement type");
        if (typeof reinforcement_diameter_for_preliminary_design_user_value === "string") {
            ASSERT(reinforcement_diameter_for_preliminary_design_user_value === "MAX_OF_ALL", "reinforcement_diameter_for_preliminary_design_user_value must be of MAX_OF_ALL string type");
            addon_settings.property_stability_reinforcement_diameter_for_preliminary_design = GetConcreteDesignPropertyMemberReinforcementDiameterForPreliminaryDesign("MAX_OF_ALL");
        }
        else {
            ASSERT(typeof reinforcement_diameter_for_preliminary_design_user_value === "number", "reinforcement_diameter_for_preliminary_design_user_value must be number");
            addon_settings.property_stability_reinforcement_diameter_for_preliminary_design = GetConcreteDesignPropertyMemberReinforcementDiameterForPreliminaryDesign("USER_DEFINED");
            addon_settings.property_stability_reinforcement_diameter_for_preliminary_design_user_value = reinforcement_diameter_for_preliminary_design_user_value;
        }
    }
}

function GetConcreteDesignStabilityReinforcementLayout(reinforcement_layout_type) {
    if (IsConcreteDesignCurrentCodeOfStandard("EN") || IsConcreteDesignCurrentCodeOfStandard("NTC")) {
        return EnumValueFromJSHLFTypeName(
            reinforcement_layout_type,
            "reinforcement layout",
            {
                "TOP_BOTTOM_SYMMETRICAL_DISTRIBUTION": ulsconfig_member_ec2.E_REINFORCEMENT_LAYOUT_TOP_BOTTOM_SYMMETRICAL_DISTRIBUTION,
                "IN_CORNERS_SYMMETRICAL_DISTRIBUTION": ulsconfig_member_ec2.E_REINFORCEMENT_LAYOUT_IN_CORNERS_SYMMETRICAL_DISTRIBUTION,
                "UNIFORMLY_SURROUNDING": ulsconfig_member_ec2.E_REINFORCEMENT_LAYOUT_UNIFORMLY_SURROUNDING,
                "FACTORIZED_PROVIDED_REINFORCEMENT": ulsconfig_member_ec2.E_REINFORCEMENT_LAYOUT_FACTORIZED_PROVIDED_REINFORCEMENT
            },
            ulsconfig_member_ec2.E_REINFORCEMENT_LAYOUT_UNIFORMLY_SURROUNDING);
    }
    else if (IsConcreteDesignCurrentCodeOfStandard("ACI")) {
        return EnumValueFromJSHLFTypeName(
            reinforcement_layout_type,
            "reinforcement layout",
            {
                "TOP_BOTTOM_SYMMETRICAL_DISTRIBUTION": ulsconfig_member_aci318.E_REINFORCEMENT_LAYOUT_TOP_BOTTOM_SYMMETRICAL_DISTRIBUTION,
                "IN_CORNERS_SYMMETRICAL_DISTRIBUTION": ulsconfig_member_aci318.E_REINFORCEMENT_LAYOUT_IN_CORNERS_SYMMETRICAL_DISTRIBUTION,
                "UNIFORMLY_SURROUNDING": ulsconfig_member_aci318.E_REINFORCEMENT_LAYOUT_UNIFORMLY_SURROUNDING,
                "FACTORIZED_PROVIDED_REINFORCEMENT": ulsconfig_member_aci318.E_REINFORCEMENT_LAYOUT_FACTORIZED_PROVIDED_REINFORCEMENT
            },
            ulsconfig_member_aci318.E_REINFORCEMENT_LAYOUT_UNIFORMLY_SURROUNDING);
    }
    else if (IsConcreteDesignCurrentCodeOfStandard("CSA")) {
        return EnumValueFromJSHLFTypeName(
            reinforcement_layout_type,
            "reinforcement layout",
            {
                "TOP_BOTTOM_SYMMETRICAL_DISTRIBUTION": ulsconfig_member_csaa233.E_REINFORCEMENT_LAYOUT_TOP_BOTTOM_SYMMETRICAL_DISTRIBUTION,
                "IN_CORNERS_SYMMETRICAL_DISTRIBUTION": ulsconfig_member_csaa233.E_REINFORCEMENT_LAYOUT_IN_CORNERS_SYMMETRICAL_DISTRIBUTION,
                "UNIFORMLY_SURROUNDING": ulsconfig_member_csaa233.E_REINFORCEMENT_LAYOUT_UNIFORMLY_SURROUNDING,
                "FACTORIZED_PROVIDED_REINFORCEMENT": ulsconfig_member_csaa233.E_REINFORCEMENT_LAYOUT_FACTORIZED_PROVIDED_REINFORCEMENT
            },
            ulsconfig_member_csaa233.E_REINFORCEMENT_LAYOUT_UNIFORMLY_SURROUNDING);
    }
    else if (IsConcreteDesignCurrentCodeOfStandard("SP")) {
        return EnumValueFromJSHLFTypeName(
            reinforcement_layout_type,
            "reinforcement layout",
            {
                "TOP_BOTTOM_SYMMETRICAL_DISTRIBUTION": ulsconfig_member_sp63.E_REINFORCEMENT_LAYOUT_TOP_BOTTOM_SYMMETRICAL_DISTRIBUTION,
                "IN_CORNERS_SYMMETRICAL_DISTRIBUTION": ulsconfig_member_sp63.E_REINFORCEMENT_LAYOUT_IN_CORNERS_SYMMETRICAL_DISTRIBUTION,
                "UNIFORMLY_SURROUNDING": ulsconfig_member_sp63.E_REINFORCEMENT_LAYOUT_UNIFORMLY_SURROUNDING,
                "FACTORIZED_PROVIDED_REINFORCEMENT": ulsconfig_member_sp63.E_REINFORCEMENT_LAYOUT_FACTORIZED_PROVIDED_REINFORCEMENT
            },
            ulsconfig_member_sp63.E_REINFORCEMENT_LAYOUT_UNIFORMLY_SURROUNDING);
    }
    else {
        ASSERT(false, "GetConcreteDesignStabilityReinforcementLayout: Unsupported standard");
        return;
    }
}

function SetConcreteDesignSurfacesDesignMethod (settings_addon,
    optimization_type) {
    ASSERT(surfaces.count() > 0, "There must exist at least one surface in project");
    SetConcreteDesignSurfacesOptimizationType(settings_addon, optimization_type);
};

function SetConcreteDesignSurfacesOptimizationType(settings_addon,
    optimization_type) {
        optimization_types = [
            "NO",
            "YES"
    ];
	if (optimization_type !== undefined) {
	  if (optimization_types.indexOf(optimization_type) === -1)
      {
        console.log("Wrong design method optimization type. Value was: " + optimization_type);
		console.log("Correct values are: " + optimization_types);
		return;
      }
	}
	else {
        optimization_type = "YES";
	}
    switch (optimization_type) {
        case "NO":
            settings_addon.property_surface_internal_forces_no_optimization = true;
            break;
        case "YES":
            settings_addon.property_surface_internal_forces_optimization = true;
            break;
        default:
            ASSERT(false, "SetConcreteDesignOptimizationType: unknown design method optimization type");
    }
}

function SetConcreteDesignSurfacesInternalForcesDiagramUsedForDesign (addon_settings,
    property_subtraction_of_rib_components) {
    ASSERT(surfaces.count() > 0, "There must exist at least one surface in project");
    if (typeof property_subtraction_of_rib_components === "undefined") {
        property_subtraction_of_rib_components = true;
    }
    addon_settings.property_subtraction_of_rib_components = property_subtraction_of_rib_components;
}

function SetConcreteDesignSurfacesMinimumLongitudinalReinforcement (addon_settings,
    property_minimum_longitudinal_reinforcement_acc_to_standard,
    reinforcement_type,
    min_reinforcement_direction,
    min_reinforcement_direction_user_values,
    main_compression_reinforcement_direction,
    property_surface_reinforcement_defined_direction_phi,
    property_surface_ratio_b_div_h) {
    ASSERT(surfaces.count() > 0, "There must exist at least one surface in project");
    if (typeof property_minimum_longitudinal_reinforcement_acc_to_standard !== "undefined") {
        addon_settings.property_minimum_longitudinal_reinforcement_acc_to_standard = property_minimum_longitudinal_reinforcement_acc_to_standard;
    }
    if (typeof reinforcement_type !== "undefined") {
        ASSERT(addon_settings.property_minimum_longitudinal_reinforcement_acc_to_standard, "Minimum longitudinal reinforcement acc. to standard must be on");
        SetConcreteDesignSurfacesMinimumLongitudinalReinforcementType(addon_settings, reinforcement_type);
    }
    if (typeof min_reinforcement_direction !== "undefined") {
        ASSERT(addon_settings.property_minimum_longitudinal_reinforcement_for_plates, "Minimum longitudinal reinforcement for plates must be on");
        SetConcreteDesignSurfacesMinDirectionReinforcementType(addon_settings, min_reinforcement_direction);
    }
    if (typeof min_reinforcement_direction_user_values !== "undefined") {
        ASSERT(Array.isArray(min_reinforcement_direction_user_values), "User-defined minimum reinforcement direction values must be array of booleans ([φ1(-z), φ2(-z), φ1(+z), φ2(+z)])");
        if (min_reinforcement_direction_user_values[0] !== undefined) {
            addon_settings.property_surface_top_reinforcement_direction_phi1 = min_reinforcement_direction_user_values[0];
        }
        if (min_reinforcement_direction_user_values[1] !== undefined) {
            addon_settings.property_surface_top_reinforcement_direction_phi2 = min_reinforcement_direction_user_values[1];
        }
        if (min_reinforcement_direction_user_values[2] !== undefined) {
            addon_settings.property_surface_bottom_reinforcement_direction_phi1 = min_reinforcement_direction_user_values[2];
        }
        if (min_reinforcement_direction_user_values[3] !== undefined) {
            addon_settings.property_surface_bottom_reinforcement_direction_phi2 = min_reinforcement_direction_user_values[3];
        }
    }
    if (typeof main_compression_reinforcement_direction !== "undefined") {
        ASSERT(addon_settings.property_minimum_longitudinal_reinforcement_for_walls, "Minimum longitudinal reinforcement for walls must be on");
        SetConcreteDesignSurfacesMainCompressionReinforcementDirectionType(addon_settings, main_compression_reinforcement_direction);
    }
    if (typeof property_surface_reinforcement_defined_direction_phi !== "undefined") {
        ASSERT(addon_settings.property_defined_in_reinforcement_direction, "Defined in reinforcement direction must be on");
        addon_settings.property_surface_reinforcement_defined_direction_phi = GetConcreteDesignSurfacesReinforcementDefinedDirectionType(property_surface_reinforcement_defined_direction_phi);
    }
    if (typeof property_surface_ratio_b_div_h !== "undefined") {
        ASSERT(addon_settings.property_minimum_longitudinal_reinforcement_for_walls, "Minimum longitudinal reinforcement for walls must be on");
        addon_settings.property_surface_ratio_b_div_h = property_surface_ratio_b_div_h;
    }
};

function SetConcreteDesignSurfacesMinimumLongitudinalReinforcementType(addon_settings,
    reinforcement_type) {
        reinforcement_types = [
            "PLATES",
            "WALLS"
    ];
	if (reinforcement_type !== undefined) {
	  if (reinforcement_types.indexOf(reinforcement_type) === -1)
      {
        console.log("Wrong longitudinal reinforcement type. Value was: " + reinforcement_type);
		console.log("Correct values are: " + reinforcement_types);
		return;
      }
	}
	else {
        reinforcement_type = "PLATES";
	}
    switch (reinforcement_type) {
        case "PLATES":
            addon_settings.property_minimum_longitudinal_reinforcement_for_plates = true;
            break;
        case "WALLS":
            addon_settings.property_minimum_longitudinal_reinforcement_for_walls = true;
            break;
        default:
            ASSERT(false, "SetConcreteDesignMinimumLongitudinalReinforcementType: unknown longitudinal reinforcement type");
    }
}

function SetConcreteDesignSurfacesMinDirectionReinforcementType(addon_settings,
    reinforcement_type) {
        reinforcement_types = [
            "MAIN_TENSION_ELEMENT",
            "MAIN_TENSION_SURFACE",
            "DEFINED"
    ];
	if (reinforcement_type !== undefined) {
	  if (reinforcement_types.indexOf(reinforcement_type) === -1)
      {
        console.log("Wrong minimum direction reinforcement type. Value was: " + reinforcement_type);
		console.log("Correct values are: " + reinforcement_types);
		return;
      }
	}
	else {
        reinforcement_type = "MAIN_TENSION_ELEMENT";
	}
    switch (reinforcement_type) {
        case "MAIN_TENSION_ELEMENT":
            addon_settings.property_direction_with_main_tension_in_the_element = true;
            break;
        case "MAIN_TENSION_SURFACE":
            addon_settings.property_direction_with_main_tension_in_the_surface = true;
            break;
        case "DEFINED":
            addon_settings.property_defined = true;
            break;
        default:
            ASSERT(false, "SetConcreteDesignMinDirectionReinforcementType - unknown minimum direction reinforcement type");
    }
}

function SetConcreteDesignSurfacesMainCompressionReinforcementDirectionType(addon_settings,
    direction_type) {
        direction_types = [
            "WITH_MAIN_COMPRESSION_FORCE",
            "DEFINED_IN_REINFORCEMENT_DIRECTION"
    ];
	if (direction_type !== undefined) {
	  if (direction_types.indexOf(direction_type) === -1)
      {
        console.log("Wrong main compression reinforcement direction type. Value was: " + direction_type);
		console.log("Correct values are: " + direction_types);
		return;
      }
	}
	else {
        direction_type = "WITH_MAIN_COMPRESSION_FORCE";
	}
    switch (direction_type) {
        case "WITH_MAIN_COMPRESSION_FORCE":
            addon_settings.property_reinforcement_direction_with_the_main_compression_force = true;
            break;
        case "DEFINED_IN_REINFORCEMENT_DIRECTION":
            addon_settings.property_defined_in_reinforcement_direction = true;
            break;
        default:
            ASSERT(false, "SetConcreteDesignMainCompressionReinforcementDirectionType - unknown main compression reinforcement direction type");
    }
}

function GetConcreteDesignSurfacesReinforcementDefinedDirectionType(direction_type) {
    if (IsConcreteDesignCurrentCodeOfStandard("EN") || IsConcreteDesignCurrentCodeOfStandard("NTC")) {
        return EnumValueFromJSHLFTypeName(
            direction_type,
            "direction",
            {
                "PHI_1": concrete_design_surface_ulsconfig_concrete_design_ec2.E_DIRECTION_PHI_1,
                "PHI_2": concrete_design_surface_ulsconfig_concrete_design_ec2.E_DIRECTION_PHI_2
            },
            concrete_design_surface_ulsconfig_concrete_design_ec2.E_DIRECTION_PHI_1);
    }
    else if (IsConcreteDesignCurrentCodeOfStandard("ACI")) {
        return EnumValueFromJSHLFTypeName(
            direction_type,
            "direction",
            {
                "PHI_1": concrete_design_surface_ulsconfig_concrete_design_aci318.E_DIRECTION_PHI_1,
                "PHI_2": concrete_design_surface_ulsconfig_concrete_design_aci318.E_DIRECTION_PHI_2
            },
            concrete_design_surface_ulsconfig_concrete_design_aci318.E_DIRECTION_PHI_1);
    }
    else {
        ASSERT(false, "GetConcreteDesignSurfacesReinforcementDefinedDirectionType: Unsupported standard");
        return;
    }
}

function SetConcreteDesignSurfacesUserDefinedMinimumLongitudinalReinforcementPercentage (addon_settings,
    property_user_defined_minimum_longitudinal_reinforcement_percentage,
    property_minimum_reinforcement,
    property_minimum_secondary_reinforcement,
    property_minimum_tension_reinforcement,
    property_minimum_compression_reinforcement) {
    ASSERT(surfaces.count() > 0, "There must exist at least one surface in project");
    if (typeof property_user_defined_minimum_longitudinal_reinforcement_percentage !== "undefined") {
        addon_settings.property_user_defined_minimum_longitudinal_reinforcement_percentage = property_user_defined_minimum_longitudinal_reinforcement_percentage;
    }
    if (typeof property_minimum_reinforcement !== "undefined") {
        ASSERT(addon_settings.property_user_defined_minimum_longitudinal_reinforcement_percentage, "User-defined minimum longitudinal reinforcement percentage must be on");
        addon_settings.property_minimum_reinforcement = property_minimum_reinforcement;
    }
    if (typeof property_minimum_secondary_reinforcement !== "undefined") {
        ASSERT(addon_settings.property_user_defined_minimum_longitudinal_reinforcement_percentage, "User-defined minimum longitudinal reinforcement percentage must be on");
        addon_settings.property_minimum_secondary_reinforcement = property_minimum_secondary_reinforcement;
    }
    if (typeof property_minimum_tension_reinforcement !== "undefined") {
        ASSERT(addon_settings.property_user_defined_minimum_longitudinal_reinforcement_percentage, "User-defined minimum longitudinal reinforcement percentage must be on");
        addon_settings.property_minimum_tension_reinforcement = property_minimum_tension_reinforcement;
    }
    if (typeof property_minimum_compression_reinforcement !== "undefined") {
        ASSERT(addon_settings.property_user_defined_minimum_longitudinal_reinforcement_percentage, "User-defined minimum longitudinal reinforcement percentage must be on");
        addon_settings.property_minimum_compression_reinforcement = property_minimum_compression_reinforcement;
    }
}

function SetConcreteDesignSurfacesUserDefinedMaximumLongitudinalReinforcementPercentage (addon_settings,
    property_user_defined_maximum_longitudinal_reinforcement_percentage,
    property_user_defined_maximum_longitudinal_reinforcement_percentage_value) {
    ASSERT(surfaces.count() > 0, "There must exist at least one surface in project");
    if (typeof property_user_defined_maximum_longitudinal_reinforcement_percentage !== "undefined") {
        addon_settings.property_user_defined_maximum_longitudinal_reinforcement_percentage = property_user_defined_maximum_longitudinal_reinforcement_percentage;
    }
    if (typeof property_user_defined_maximum_longitudinal_reinforcement_percentage_value !== "undefined") {
        ASSERT(addon_settings.property_user_defined_maximum_longitudinal_reinforcement_percentage, "User-defined maximum longitudinal reinforcement percentage must be on");
        addon_settings.property_user_defined_maximum_longitudinal_reinforcement_percentage_value = property_user_defined_maximum_longitudinal_reinforcement_percentage_value;
    }
}

function SetConcreteDesignSurfacesMinimumShearReinforcement (addon_settings,
    property_minimum_shear_reinforcement) {
    ASSERT(surfaces.count() > 0, "There must exist at least one surface in project");
    if (typeof property_minimum_shear_reinforcement === "undefined") {
        property_minimum_shear_reinforcement = true;
    }
    addon_settings.property_minimum_shear_reinforcement = property_minimum_shear_reinforcement;
}

function SetConcreteDesignSurfacesUserDefinedMinimumShearReinforcementPercentage (addon_settings,
    property_user_defined_minimum_shear_reinforcement_percentage,
    property_user_defined_minimum_shear_reinforcement_percentage_value) {
    ASSERT(surfaces.count() > 0, "There must exist at least one surface in project");
    if (typeof property_user_defined_minimum_shear_reinforcement_percentage !== "undefined") {
        addon_settings.property_user_defined_minimum_shear_reinforcement_percentage = property_user_defined_minimum_shear_reinforcement_percentage;
    }
    if (typeof property_user_defined_minimum_shear_reinforcement_percentage_value !== "undefined") {
        ASSERT(addon_settings.property_user_defined_minimum_shear_reinforcement_percentage, "User-defined minimum shear reinforcement percentage must be on");
        addon_settings.property_user_defined_minimum_shear_reinforcement_percentage_value = property_user_defined_minimum_shear_reinforcement_percentage_value;
    }
}

function SetConcreteDesignMembersInternalForceReductionZ (addon_settings,
    property_member_redistribution_of_moments_in_continuous_flexural_members,
    property_member_reduction_of_moments_or_dimensioning_for_moments_at_face_of_monolithic_support,
    property_member_reduction_of_shear_at_support) {
    ASSERT(members.count() > 0, "There must exist at least one member in project");
    if (typeof property_member_redistribution_of_moments_in_continuous_flexural_members !== "undefined") {
        addon_settings.property_member_redistribution_of_moments_in_continuous_flexural_members = property_member_redistribution_of_moments_in_continuous_flexural_members;
    }
    if (typeof property_member_reduction_of_shear_at_support !== "undefined") {
        addon_settings.property_member_reduction_of_shear_at_support = property_member_reduction_of_shear_at_support;
    }
    if (typeof property_member_reduction_of_moments_or_dimensioning_for_moments_at_face_of_monolithic_support !== "undefined") {
        addon_settings.property_member_reduction_of_moments_or_dimensioning_for_moments_at_face_of_monolithic_support = property_member_reduction_of_moments_or_dimensioning_for_moments_at_face_of_monolithic_support;
    }
}

function SetConcreteDesignMembersMinimumReinforcement (addon_settings,
    property_member_minimum_longitudinal_reinforcement,
    property_member_minimum_shear_reinforcement,
    property_member_minimum_construction_reinforcement) {
    ASSERT(members.count() > 0, "There must exist at least one member in project");
    if (typeof property_member_minimum_longitudinal_reinforcement !== "undefined") {
        addon_settings.property_member_minimum_longitudinal_reinforcement = property_member_minimum_longitudinal_reinforcement;
    }
    if (typeof property_member_minimum_shear_reinforcement !== "undefined") {
        addon_settings.property_member_minimum_shear_reinforcement = property_member_minimum_shear_reinforcement;
    }
    if (typeof property_member_minimum_construction_reinforcement !== "undefined") {
        addon_settings.property_member_minimum_construction_reinforcement = property_member_minimum_construction_reinforcement;
    }
}

function SetConcreteDesignNeutralAxisDepthLimitation (addon_settings,
    addon_settings_type,
    property_consider_neutral_axis_depth_limitation,
    property_value_of_neutral_axis_depth_limitation_user_value) {
    ASSERT(members.count() > 0, "There must exist at least one member in project");
    if (IsConcreteDesignCurrentCodeOfStandard("EN") || IsConcreteDesignCurrentCodeOfStandard("NTC")) {
        ;   // Only user-defined value set
    }
    else if (IsConcreteDesignCurrentCodeOfStandard("ACI")) {
        if (addon_settings_type === "member") {
            var automaticallyValue = ulsconfig_member_aci318.E_NEUTRAL_AXIS_DEPTH_LIMITATION_AUTOMATICALLY;
            var userDefinedValue = ulsconfig_member_aci318.E_NEUTRAL_AXIS_DEPTH_LIMITATION_USER_DEFINED;
        }
        else {
            ASSERT(addon_settings_type === "surface", "SetConcreteDesignNeutralAxisDepthLimitation");
            var automaticallyValue = concrete_design_surface_ulsconfig_concrete_design_aci318.E_NEUTRAL_AXIS_DEPTH_LIMITATION_AUTOMATICALLY;
            var userDefinedValue = concrete_design_surface_ulsconfig_concrete_design_aci318.E_NEUTRAL_AXIS_DEPTH_LIMITATION_USER_DEFINED;
        }
    }
    else if (IsConcreteDesignCurrentCodeOfStandard("CSA")) {
        if (addon_settings_type === "member") {
            var automaticallyValue = ulsconfig_member_csaa233.E_NEUTRAL_AXIS_DEPTH_LIMITATION_AUTOMATICALLY;
            var userDefinedValue = ulsconfig_member_csaa233.E_NEUTRAL_AXIS_DEPTH_LIMITATION_USER_DEFINED;
        }
        else {
            ASSERT(addon_settings_type === "surface", "SetConcreteDesignNeutralAxisDepthLimitation");
            var automaticallyValue = concrete_design_surface_ulsconfig_concrete_design_csaa233.E_NEUTRAL_AXIS_DEPTH_LIMITATION_AUTOMATICALLY;
            var userDefinedValue = concrete_design_surface_ulsconfig_concrete_design_csaa233.E_NEUTRAL_AXIS_DEPTH_LIMITATION_USER_DEFINED;
        }
    }
    else if (IsConcreteDesignCurrentCodeOfStandard("SP")) {
        if (addon_settings_type === "member") {
            var automaticallyValue = ulsconfig_member_sp63.E_NEUTRAL_AXIS_DEPTH_LIMITATION_AUTOMATICALLY;
            var userDefinedValue = ulsconfig_member_sp63.E_NEUTRAL_AXIS_DEPTH_LIMITATION_USER_DEFINED;
        }
        else {
            ASSERT(addon_settings_type === "surface", "SetConcreteDesignNeutralAxisDepthLimitation");
            var automaticallyValue = concrete_design_surface_concrete_ulsconfig_sp63.E_NEUTRAL_AXIS_DEPTH_LIMITATION_AUTOMATICALLY;
            var userDefinedValue = concrete_design_surface_concrete_ulsconfig_sp63.E_NEUTRAL_AXIS_DEPTH_LIMITATION_USER_DEFINED;
        }
    }
    else {
        ASSERT(false, "SetConcreteDesignNeutralAxisDepthLimitation - unknown code of standard (" + GetConcreteDesignCurrentCodeOfStandard() + ")");
    }
    if (typeof property_consider_neutral_axis_depth_limitation !== "undefined") {
        if (addon_settings_type === "member") {
            addon_settings.property_member_consider_neutral_axis_depth_limitation = property_consider_neutral_axis_depth_limitation;
        }
        else {
            addon_settings.property_surface_consider_neutral_axis_depth_limitation = property_consider_neutral_axis_depth_limitation;
        }
    }
    if (typeof property_value_of_neutral_axis_depth_limitation_user_value !== "undefined") {
        ASSERT(addon_settings_type === "member" ? addon_settings.property_member_consider_neutral_axis_depth_limitation : addon_settings.property_surface_consider_neutral_axis_depth_limitation, "Consider depth limitation of neutral axis acc. to 9.3.3.1 must be on");
        if (!IsConcreteDesignCurrentCodeOfStandard("EN") && !IsConcreteDesignCurrentCodeOfStandard("NTC")) {
            if (typeof property_value_of_neutral_axis_depth_limitation_user_value === "string") {
                ASSERT(property_value_of_neutral_axis_depth_limitation_user_value === "AUTOMATICALLY", "Value of neutral axis depth limitation must equal ti AUTOMATICALLY");
                if (addon_settings_type === "member") {
                    addon_settings.property_member_value_of_neutral_axis_depth_limitation = automaticallyValue;
                }
                else {
                    addon_settings.property_surface_value_of_neutral_axis_depth_limitation = automaticallyValue;
                }
            }
            else {
                ASSERT(typeof property_value_of_neutral_axis_depth_limitation_user_value === "number", "Value of neutral axis depth limitation must be number");
                if (addon_settings_type === "member") {
                    addon_settings.property_member_value_of_neutral_axis_depth_limitation = userDefinedValue;
                    addon_settings.property_member_value_of_neutral_axis_depth_limitation_user_value = property_value_of_neutral_axis_depth_limitation_user_value;
                }
                else {
                    addon_settings.property_surface_value_of_neutral_axis_depth_limitation = userDefinedValue;
                    addon_settings.property_surface_value_of_neutral_axis_depth_limitation_user_value = property_value_of_neutral_axis_depth_limitation_user_value;
                }
            }
        }
        else {
            if (addon_settings_type === "member") {
                addon_settings.property_member_value_of_neutral_axis_depth_limitation = property_value_of_neutral_axis_depth_limitation_user_value;
            }
            else {
                addon_settings.property_surface_value_of_neutral_axis_depth_limitation = property_value_of_neutral_axis_depth_limitation_user_value;
            }
        }
    }
}

function SetConcreteDesignMemberEpoxyFactorType(addon_settings,
    epoxy_factor_type) {
    if (IsConcreteDesignCurrentCodeOfStandard("ACI")) {
        var epoxy_factor_types = [
            "EPOXY_COATED_OR_ZINC",
            "UNCOATED_OR_ZINC_COATED"
        ];
        var default_value = "UNCOATED_OR_ZINC_COATED";
    }
	else if (IsConcreteDesignCurrentCodeOfStandard("CSA")) {
        var epoxy_factor_types = [
            "EPOXY_COATED",
            "UNCOATED"
        ];
        var default_value = "UNCOATED";
    }
    else {
        ASSERT(false, "SetConcreteDesignMemberEpoxyFactorType - unknown code of standard (" + GetConcreteDesignCurrentCodeOfStandard() + ")");
    }
	if (epoxy_factor_type !== undefined) {
	  if (epoxy_factor_types.indexOf(epoxy_factor_type) === -1)
      {
        console.log("Wrong epoxy factor type. Value was: " + epoxy_factor_type);
		console.log("Correct values are: " + epoxy_factor_types);
		return;
      }
	}
	else {
        epoxy_factor_type = default_value;
	}
    switch (epoxy_factor_type) {
        case "EPOXY_COATED_OR_ZINC":
            addon_settings.property_epoxy_coated_or_zinc_and_epoxy_dual_coated_reinforcement = true;
            break;
        case "UNCOATED_OR_ZINC_COATED":
            addon_settings.property_uncoated_or_zinc_coated_galvanized_reinforcement = true;
            break;
        case "EPOXY_COATED":
            addon_settings.property_epoxy_coated_reinforcement = true;
            break;
        case "UNCOATED":
            addon_settings.property_uncoated_reinforcement = true;
            break;
        default:
            ASSERT(false, "SetConcreteDesignMemberEpoxyFactorType - unknown epoxy factor type");
    }
}

function SetConcreteDesignStabilityUnbracedColumn (addon_settings,
    property_stability_index_qy,
    property_stability_index_qz) {
    ASSERT(members.count() > 0, "There must exist at least one member in project");
    if (typeof property_stability_index_qy !== "undefined") {
        addon_settings.property_stability_index_qy = property_stability_index_qy;
    }
    if (typeof property_stability_index_qz !== "undefined") {
        addon_settings.property_stability_index_qz = property_stability_index_qz;
    }
}

function SetConcreteDesignPunchingPunchingLoad (addon_settings,
    property_node_used_punching_load_for_columns,
    property_node_used_punching_load_for_walls,
    property_node_distance_to_perimeter_used_for_integration_for_columns,
    property_node_distance_to_perimeter_used_for_integration_for_walls) {
    ASSERT(surfaces.count() > 0, "There must exist at least one surface in project");
    if (typeof property_node_used_punching_load_for_columns !== "undefined") {
        if (typeof property_node_used_punching_load_for_columns === "string") {
            addon_settings.property_node_used_punching_load_for_columns = GetConcreteDesignPunchingLoadType(property_node_used_punching_load_for_columns, "columns");
        }
        else {
            ASSERT(typeof property_node_used_punching_load_for_columns === "number", "User-defined value is required");
            addon_settings.property_node_used_punching_load_for_columns = concrete_design_node_ulsconfig_concrete_design_aci318.E_USED_PUNCHING_LOAD_TYPE_USER_DEFINED;
            addon_settings.property_node_used_defined_value_of_punching_force_for_columns = property_node_used_punching_load_for_columns;
        }
    }
    if (typeof property_node_used_punching_load_for_walls !== "undefined") {
        if (typeof property_node_used_punching_load_for_walls === "string") {
            addon_settings.property_node_used_punching_load_for_walls = GetConcreteDesignPunchingLoadType(property_node_used_punching_load_for_walls, "walls");
        }
        else {
            ASSERT(typeof property_node_used_punching_load_for_walls === "number", "User-defined value is required");
            addon_settings.property_node_used_punching_load_for_walls = concrete_design_node_ulsconfig_concrete_design_aci318.E_USED_PUNCHING_LOAD_TYPE_USER_DEFINED;
            addon_settings.property_node_used_defined_value_of_punching_force_for_walls = property_node_used_punching_load_for_walls;
        }
    }
    if (typeof property_node_distance_to_perimeter_used_for_integration_for_columns !== "undefined") {
        ASSERT(addon_settings.property_node_used_punching_load_for_columns === GetConcreteDesignPunchingLoadType("SMOOTHED_SHEAR_FORCE", "columns"), "SMOOTHED_SHEAR_FORCE is required");
        addon_settings.property_node_distance_to_perimeter_used_for_integration_for_columns = property_node_distance_to_perimeter_used_for_integration_for_columns;
    }
    if (typeof property_node_distance_to_perimeter_used_for_integration_for_walls !== "undefined") {
        ASSERT(addon_settings.property_node_used_punching_load_for_walls === GetConcreteDesignPunchingLoadType("SMOOTHED_SHEAR_FORCE", "walls"), "SMOOTHED_SHEAR_FORCE is required");
        addon_settings.property_node_distance_to_perimeter_used_for_integration_for_walls = property_node_distance_to_perimeter_used_for_integration_for_walls;
    }
};

function GetConcreteDesignPunchingLoadType(punching_load_type,
    punching_load_for) {
    if (punching_load_for === "walls") {
        if (IsConcreteDesignCurrentCodeOfStandard("ACI")) {
            return EnumValueFromJSHLFTypeName(
                punching_load_type,
                "punching load",
                {
                    "SMOOTHED_SHEAR_FORCE": concrete_design_node_ulsconfig_concrete_design_aci318.E_USED_PUNCHING_LOAD_TYPE_SMOOTHED_SHEAR_FORCE
                },
                concrete_design_node_ulsconfig_concrete_design_aci318.E_USED_PUNCHING_LOAD_TYPE_SMOOTHED_SHEAR_FORCE);
        }
        else if (IsConcreteDesignCurrentCodeOfStandard("CSA")) {
            return EnumValueFromJSHLFTypeName(
                punching_load_type,
                "punching load",
                {
                    "SMOOTHED_SHEAR_FORCE": concrete_design_node_concrete_ulsconfig_csaa233.E_USED_PUNCHING_LOAD_TYPE_SMOOTHED_SHEAR_FORCE
                },
                concrete_design_node_concrete_ulsconfig_csaa233.E_USED_PUNCHING_LOAD_TYPE_SMOOTHED_SHEAR_FORCE);
        }
        else if (IsConcreteDesignCurrentCodeOfStandard("SP")) {
            return EnumValueFromJSHLFTypeName(
                punching_load_type,
                "punching load",
                {
                    "SMOOTHED_SHEAR_FORCE": concrete_design_node_concrete_ulsconfig_sp63.E_USED_PUNCHING_LOAD_TYPE_SMOOTHED_SHEAR_FORCE
                },
                concrete_design_node_concrete_ulsconfig_sp63.E_USED_PUNCHING_LOAD_TYPE_SMOOTHED_SHEAR_FORCE);
        }
        else {
            ASSERT(false, "GetConcreteDesignPunchingLoadType: unsupported code of standard (" + GetConcreteDesignCurrentCodeOfStandard() + ")");
        }
    }
    else if (punching_load_for === "columns") {
        if (IsConcreteDesignCurrentCodeOfStandard("ACI")) {
            return EnumValueFromJSHLFTypeName(
                punching_load_type,
                "punching load",
                {
                    "SINGLE_FORCE": concrete_design_node_ulsconfig_concrete_design_aci318.E_USED_PUNCHING_LOAD_TYPE_SINGLE_FORCE,
                    "SMOOTHED_SHEAR_FORCE": concrete_design_node_ulsconfig_concrete_design_aci318.E_USED_PUNCHING_LOAD_TYPE_SMOOTHED_SHEAR_FORCE
                },
                concrete_design_node_ulsconfig_concrete_design_aci318.E_USED_PUNCHING_LOAD_TYPE_SINGLE_FORCE);
        }
        else if (IsConcreteDesignCurrentCodeOfStandard("CSA")) {
            return EnumValueFromJSHLFTypeName(
                punching_load_type,
                "punching load",
                {
                    "SINGLE_FORCE": concrete_design_node_concrete_ulsconfig_csaa233.E_USED_PUNCHING_LOAD_TYPE_SINGLE_FORCE,
                    "SMOOTHED_SHEAR_FORCE": concrete_design_node_concrete_ulsconfig_csaa233.E_USED_PUNCHING_LOAD_TYPE_SMOOTHED_SHEAR_FORCE
                },
                concrete_design_node_concrete_ulsconfig_csaa233.E_USED_PUNCHING_LOAD_TYPE_SINGLE_FORCE);
        }
        else if (IsConcreteDesignCurrentCodeOfStandard("SP")) {
            return EnumValueFromJSHLFTypeName(
                punching_load_type,
                "punching load",
                {
                    "SINGLE_FORCE": concrete_design_node_concrete_ulsconfig_sp63.E_USED_PUNCHING_LOAD_TYPE_SINGLE_FORCE,
                    "SMOOTHED_SHEAR_FORCE": concrete_design_node_concrete_ulsconfig_sp63.E_USED_PUNCHING_LOAD_TYPE_SMOOTHED_SHEAR_FORCE
                },
                concrete_design_node_concrete_ulsconfig_sp63.E_USED_PUNCHING_LOAD_TYPE_SINGLE_FORCE);
        }
        else {
            ASSERT(false, "GetConcreteDesignPunchingLoadType: unsupported code of standard (" + GetConcreteDesignCurrentCodeOfStandard() + ")");
        }
    }
    else {
        ASSERT(false);
    }
}

function SetConcreteDesignPunchingAdditionalParameters (addon_settings,
    property_node_minimum_spacing_of_reinforcement_perimeters) {
    ASSERT(surfaces.count() > 0, "There must exist at least one surface in project");
    if (typeof property_node_minimum_spacing_of_reinforcement_perimeters !== "undefined") {
        addon_settings.property_node_minimum_spacing_of_reinforcement_perimeters = property_node_minimum_spacing_of_reinforcement_perimeters;
    }
};

function GetConcreteDesignPunchingDirectionForceType(direction_type) {
    if (IsConcreteDesignCurrentCodeOfStandard("EN") || IsConcreteDesignCurrentCodeOfStandard("NTC")) {
        return EnumValueFromJSHLFTypeName(
            direction_type,
            "punching direction force",
            {
                "DETERMINE": concrete_design_node_ulsconfig_concrete_design_ec2.E_DIRECTION_OF_PUNCHING_FORCE_DETERMINE,
                "PLUS_Z": concrete_design_node_ulsconfig_concrete_design_ec2.E_DIRECTION_OF_PUNCHING_FORCE_PLUS_Z,
                "MINUS_Z": concrete_design_node_ulsconfig_concrete_design_ec2.E_DIRECTION_OF_PUNCHING_FORCE_MINUS_Z
            },
            concrete_design_node_ulsconfig_concrete_design_ec2.E_DIRECTION_OF_PUNCHING_FORCE_DETERMINE);
    }
    else if (IsConcreteDesignCurrentCodeOfStandard("SP")) {
        return EnumValueFromJSHLFTypeName(
            direction_type,
            "punching direction force",
            {
                "DETERMINE": concrete_design_node_concrete_ulsconfig_sp63.E_DIRECTION_OF_PUNCHING_FORCE_DETERMINE,
                "PLUS_Z": concrete_design_node_concrete_ulsconfig_sp63.E_DIRECTION_OF_PUNCHING_FORCE_PLUS_Z,
                "MINUS_Z": concrete_design_node_concrete_ulsconfig_sp63.E_DIRECTION_OF_PUNCHING_FORCE_MINUS_Z
            },
            concrete_design_node_concrete_ulsconfig_sp63.E_DIRECTION_OF_PUNCHING_FORCE_DETERMINE);
    }
    else {
        ASSERT(false, "GetConcreteDesignPunchingDirectionForceType: unsupported code standard (" + GetConcreteDesignCurrentCodeOfStandard() + ")");
    }
}

function SetConcreteDesignServiceabilityConfigurationCrackStateDetection (addon_settings,
    crack_state_detection) {
    SetConcreteDesignCrackStateDetectionType(addon_settings, crack_state_detection);
};

function SetConcreteDesignCrackStateDetectionType (addon_settings,
    crack_state_detection_type) {
    const crack_state_detection_types = [
        "CALCULATED_FROM_ASSOCIATED_LOAD",
        "DETERMINED_AS_ENVELOPE_FROM_ALL_DESIGN_SITUATIONS",
        "INDEPENDENT_OF_LOAD"
    ];
	if (crack_state_detection_type !== undefined) {
	  if (crack_state_detection_types.indexOf(crack_state_detection_type) === -1)
      {
        console.log("Wrong crack state detection type. Value was: " + crack_state_detection_type);
		console.log("Correct values are: " + crack_state_detection_types);
		return;
      }
	}
	else {
        crack_state_detection_type = "CALCULATED_FROM_ASSOCIATED_LOAD";
	}
    switch (crack_state_detection_type) {
        case "CALCULATED_FROM_ASSOCIATED_LOAD":
            addon_settings.property_crack_state_from_associated_design_situation = true;
            break;
        case "DETERMINED_AS_ENVELOPE_FROM_ALL_DESIGN_SITUATIONS":
            addon_settings.property_crack_state_from_all_sls_design_situations = true;
            break;
        case "INDEPENDENT_OF_LOAD":
            addon_settings.property_crack_state_independent_of_load = true;
            break;
        default:
            ASSERT(false, "SetConcreteDesignCrackStateDetectionType: unknown crack state detection type");
    }
}

function SetConcreteDesignServiceabilityConfigurationDeflectionAnalysis (addon_settings,
    property_limitation_of_deflection_enabled,
    property_deflection_limit_support_on_both_sides,
    property_deflection_limit_one_sided_support,
    property_tension_stiffening_effect_enabled,
    property_tension_stiffening_effect,
    property_minimum_zeta_enabled,
    property_minimum_zeta_value,
    property_activate_time_dependent_deflections,
    property_time_dependent_factor,
    property_deflection_duration_of_load,
    property_deflection_relative_humidity,
    property_time_dependent_material_properties) {
    if (typeof property_limitation_of_deflection_enabled !== "undefined") {
        addon_settings.property_limitation_of_deflection_enabled = property_limitation_of_deflection_enabled;
    }
    if (typeof property_deflection_limit_support_on_both_sides !== "undefined") {
        ASSERT(addon_settings.property_limitation_of_deflection_enabled, "Limitation of deflection must be on");
        addon_settings.property_deflection_limit_support_on_both_sides = property_deflection_limit_support_on_both_sides;
    }
    if (typeof property_deflection_limit_one_sided_support !== "undefined") {
        ASSERT(addon_settings.property_limitation_of_deflection_enabled, "Limitation of deflection must be on");
        addon_settings.property_deflection_limit_one_sided_support = property_deflection_limit_one_sided_support;
    }
    if (typeof property_tension_stiffening_effect_enabled !== "undefined") {
        ASSERT(addon_settings.property_limitation_of_deflection_enabled, "Limitation of deflection must be on");
        addon_settings.property_tension_stiffening_effect_enabled = property_tension_stiffening_effect_enabled;
    }
    if (typeof property_tension_stiffening_effect !== "undefined") {
        ASSERT(addon_settings.property_limitation_of_deflection_enabled, "Limitation of deflection must be on");
        addon_settings.property_tension_stiffening_effect = property_tension_stiffening_effect;
    }
    if (typeof property_minimum_zeta_enabled !== "undefined") {
        ASSERT(addon_settings.property_limitation_of_deflection_enabled, "Limitation of deflection must be on");
        addon_settings.property_minimum_zeta_enabled = property_minimum_zeta_enabled;
    }
    if (typeof property_minimum_zeta_value !== "undefined") {
        ASSERT(addon_settings.property_minimum_zeta_enabled, "Consider minimum value of distribution factor must be on");
        addon_settings.property_minimum_zeta_value = property_minimum_zeta_value;
    }
    if (typeof property_activate_time_dependent_deflections !== "undefined") {
        ASSERT(addon_settings.property_limitation_of_deflection_enabled, "Limitation of deflection must be on");
        addon_settings.property_activate_time_dependent_deflections = property_activate_time_dependent_deflections;
    }
    if (typeof property_time_dependent_factor !== "undefined") {
        ASSERT(addon_settings.property_activate_time_dependent_deflections, "Calculation of time-dependent deflections must be on");
        addon_settings.property_time_dependent_factor = property_time_dependent_factor;
    }
    if (typeof property_deflection_duration_of_load !== "undefined") {
        ASSERT(addon_settings.property_time_dependent_factor, "Time-dependent factor acc. to table 24.2.4.1.3 must be on");
        addon_settings.property_deflection_duration_of_load = property_deflection_duration_of_load;
    }
    if (typeof property_deflection_relative_humidity !== "undefined") {
        ASSERT(addon_settings.property_time_dependent_factor, "Use of creep factor acc. to table 6.12 and time-dependent concrete strain acc. to table 6.10 acc. to SP63.13330.2018 must be on");
        addon_settings.property_deflection_relative_humidity = property_deflection_relative_humidity;
    }
    if (typeof property_time_dependent_material_properties !== "undefined") {
        ASSERT(addon_settings.property_activate_time_dependent_deflections, "Calculation of time-dependent deflections must be on");
        addon_settings.property_time_dependent_material_properties = property_time_dependent_material_properties;
    }
}

function SetMemberConcreteDesignEffectiveLength (object,
    concrete_effective_length_no) {
	ASSERT(CONCRETE_DESIGN.isActive(), "Concrete design add-on must be active");
	ASSERT(IsMemberOrMemberSetDesignPropertiesActivated(object), "Design properties must be on");
	ASSERT(typeof concrete_effective_lengths !== "undefined", "concrete_effective_length_no must be specified");
	if (typeof concrete_effective_length_no !== "undefined" && __objectExists(concrete_effective_length_no, "Concrete effective length", concrete_effective_lengths)) {
		object.concrete_effective_lengths = concrete_effective_length_no;
	}
}

function SetMemberConcreteDesignUserDefineConcreteCover (object,
    concrete_cover) {
	ASSERT(CONCRETE_DESIGN.isActive(), "Concrete design add-on must be active");
	ASSERT(IsMemberOrMemberSetDesignPropertiesActivated(object), "Design properties must be on");
	ASSERT(typeof concrete_cover !== "undefined", "concrete_cover must be specified");
	object.concrete_cover_user_defined_enabled = true;
	object.concrete_cover = concrete_cover;
};


function SetConcreteDesignPunchingReinforcementPerimeterSpacing (object,
    perimeter_spacing_type,
    spacing_between_support_face_and_first_perimeter_auto_enabled,
    spacing_between_support_face_and_first_perimeter,
    spacing_between_perimeters_auto_enabled,
    spacing_between_perimeters) {
    if (perimeter_spacing_type === "MULTIPLE_STATIC_DEPTH") {
        var multiple_static = true;
    }
    else {
        ASSERT(perimeter_spacing_type === "ABSOLUTE");
        var multiple_static = false;
    }
    if (typeof spacing_between_support_face_and_first_perimeter_auto_enabled !== "undefined") {
        if (multiple_static) {
            object.multiple_static_depth_spacing_between_support_face_and_first_perimeter_auto_enabled = spacing_between_support_face_and_first_perimeter_auto_enabled;
        }
        else {
            object.absolute_spacing_between_support_face_and_first_perimeter_auto_enabled = spacing_between_support_face_and_first_perimeter_auto_enabled;
        }
    }
    if (typeof spacing_between_support_face_and_first_perimeter !== "undefined") {
        if (typeof spacing_between_support_face_and_first_perimeter === "number") {
            ASSERT(!spacing_between_support_face_and_first_perimeter_auto_enabled, "Before support face and first perimeter auto must be off");
            if (multiple_static) {
                object.multiple_static_depth_spacing_between_support_face_and_first_perimeter = spacing_between_support_face_and_first_perimeter;
            }
            else {
                object.absolute_spacing_between_support_face_and_first_perimeter = spacing_between_support_face_and_first_perimeter;
            }
        }
        else {
            ASSERT(spacing_between_support_face_and_first_perimeter_auto_enabled, "Before support face and first perimeter auto must be on");
            ASSERT(Array.isArray(spacing_between_support_face_and_first_perimeter) && spacing_between_support_face_and_first_perimeter.length === 4, "Between support face and first perimeters values must be an array [minimum, maximum, increment, priority]");
            if (multiple_static) {
                object.multiple_static_depth_spacing_between_support_face_and_first_perimeter_auto_minimum  =spacing_between_support_face_and_first_perimeter[0];
            }
            else {
                object.absolute_spacing_between_support_face_and_first_perimeter_auto_minimum = spacing_between_support_face_and_first_perimeter[0];
            }
            if (multiple_static) {
                object.multiple_static_depth_spacing_between_support_face_and_first_perimeter_auto_maximum = spacing_between_support_face_and_first_perimeter[1];
            }
            else {
                object.absolute_spacing_between_support_face_and_first_perimeter_auto_maximum = spacing_between_support_face_and_first_perimeter[1];
            }
            if (multiple_static) {
                object.multiple_static_depth_spacing_between_support_face_and_first_perimeter_auto_increment = spacing_between_support_face_and_first_perimeter[2];
            }
            else {
                object.absolute_spacing_between_support_face_and_first_perimeter_auto_increment = spacing_between_support_face_and_first_perimeter[2];
            }
            if (multiple_static) {
                object.multiple_static_depth_spacing_between_support_face_and_first_perimeter_auto_priority = spacing_between_support_face_and_first_perimeter[3];
            }
            else {
                object.absolute_spacing_between_support_face_and_first_perimeter_auto_priority = spacing_between_support_face_and_first_perimeter[3];
            }
        }
    }
    if (typeof spacing_between_perimeters_auto_enabled !== "undefined") {
        if (multiple_static) {
            object.multiple_static_depth_spacing_between_perimeters_auto_enabled = spacing_between_perimeters_auto_enabled;
        }
        else {
            object.absolute_spacing_between_perimeters_auto_enabled = spacing_between_perimeters_auto_enabled;
        }
    }
    if (typeof spacing_between_perimeters !== "undefined") {
        if (typeof spacing_between_perimeters === "number") {
            ASSERT(!spacing_between_perimeters_auto_enabled, "Between perimeters auto must be off");
            if (multiple_static) {
                object.multiple_static_depth_spacing_between_perimeters = spacing_between_perimeters;
            }
            else {
                object.absolute_spacing_between_perimeters = spacing_between_perimeters;
            }
        }
        else {
            ASSERT(spacing_between_perimeters_auto_enabled, "Between perimeters auto must be on");
            ASSERT(Array.isArray(spacing_between_perimeters) && spacing_between_perimeters.length === 4, "Between perimeters values must be an array [minimum, maximum, increment, priority]");
            if (multiple_static) {
                object.multiple_static_depth_spacing_between_perimeters_auto_minimum = spacing_between_perimeters[0];
            }
            else {
                object.absolute_spacing_between_perimeters_auto_minimum = spacing_between_perimeters[0];
            }
            if (multiple_static) {
                object.multiple_static_depth_spacing_between_perimeters_auto_maximum = spacing_between_perimeters[1];
            }
            else {
                object.absolute_spacing_between_perimeters_auto_maximum = spacing_between_perimeters[1];
            }
            if (multiple_static) {
                object.multiple_static_depth_spacing_between_perimeters_auto_increment = spacing_between_perimeters[2];
            }
            else {
                object.absolute_spacing_between_perimeters_auto_increment = spacing_between_perimeters[2];
            }
            if (multiple_static) {
                object.multiple_static_depth_spacing_between_perimeters_auto_priority = spacing_between_perimeters[3];
            }
            else {
                object.absolute_spacing_between_perimeters_auto_priority = spacing_between_perimeters[3];
            }
        }
    }
}

function AddConcreteDesignPunchingReinforcementDifferentPerimeters (object,
    number_of_legs,
    spacing) {
    var row_count = object.different_placement_perimeters.row_count();
    object.different_placement_perimeters[row_count].number_links_count = number_of_legs;
    object.different_placement_perimeters[row_count].spacing = spacing;
}

function SetMemberConcreteDesignUserDefineConcreteCoverOnEachSide (object,
    concrete_cover_top,
	concrete_cover_left,
	concrete_cover_right,
	concrete_cover_bottom) {
	ASSERT(CONCRETE_DESIGN.isActive(), "Concrete design add-on must be active");
	ASSERT(IsMemberOrMemberSetDesignPropertiesActivated(object), "Design properties must be on");
	object.concrete_cover_user_defined_enabled = true;
	object.concrete_cover_different_at_section_sides_enabled = true;
	if (typeof concrete_cover_top !== "undefined") {
		object.concrete_cover_top = concrete_cover_top;
	}
	if (typeof concrete_cover_left !== "undefined") {
		object.concrete_cover_left = concrete_cover_left;
	}
	if (typeof concrete_cover_right !== "undefined") {
		object.concrete_cover_right = concrete_cover_right;
	}
	if (typeof concrete_cover_bottom !== "undefined") {
		object.concrete_cover_bottom = concrete_cover_bottom;
	}
}

function SetMemberConcreteDesignConcreteDurabilityAllSectionSides (object,
    concrete_durability_no) {
	ASSERT(CONCRETE_DESIGN.isActive(), "Concrete design add-on must be active");
	ASSERT(IsMemberOrMemberSetDesignPropertiesActivated(object), "Design properties must be on");
	ASSERT(typeof concrete_durability_no !== "undefined", "Concrete durability number must be specified");
	if (typeof concrete_durability_no !== "undefined" && __objectExists(concrete_durability_no, "Concrete durability", concrete_durabilities)) {
		object.concrete_durability = concrete_durability_no;
	}
}

function SetMemberConcreteDesignConcreteDurabilityOnEachSide (object,
    concrete_durability_top_no,
	concrete_durability_left_no,
	concrete_durability_right_no,
	concrete_durability_bottom_no) {
	ASSERT(CONCRETE_DESIGN.isActive(), "Concrete design add-on must be active");
	ASSERT(IsMemberOrMemberSetDesignPropertiesActivated(object), "Design properties must be on");
	object.concrete_cover_different_at_section_sides_enabled = true;
	if (typeof concrete_durability_top_no !== "undefined" && __objectExists(concrete_durability_top_no, "Concrete durability", concrete_durabilities)) {
		object.concrete_durability_top = concrete_durability_top_no;
	}
	if (typeof concrete_durability_left_no !== "undefined" && __objectExists(concrete_durability_left_no, "Concrete durability", concrete_durabilities)) {
		object.concrete_durability_left = concrete_durability_left_no;
	}
	if (typeof concrete_durability_right_no !== "undefined" && __objectExists(concrete_durability_right_no, "Concrete durability", concrete_durabilities)) {
		object.concrete_durability_right = concrete_durability_right_no;
	}
	if (typeof concrete_durability_bottom_no !== "undefined" && __objectExists(concrete_durability_bottom_no, "Concrete durability", concrete_durabilities)) {
		object.concrete_durability_bottom = concrete_durability_bottom_no;
	}
}

function SetMemberConcreteDesignMinimumConcreteCoverAllSectionSides (object,
    concrete_cover_min) {
	ASSERT(CONCRETE_DESIGN.isActive(), "Concrete design add-on must be active");
	ASSERT(IsMemberOrMemberSetDesignPropertiesActivated(object), "Design properties must be on");
	ASSERT(typeof concrete_cover_min !== "undefined", "Minimum concrete cover must be specified");
	object.concrete_cover_min = concrete_cover_min;
}

function SetMemberConcreteDesignMinimumConcreteCoverOnEachSide (object,
    concrete_cover_min_top,
	concrete_cover_min_left,
	concrete_cover_min_right,
	concrete_cover_min_bottom) {
	ASSERT(CONCRETE_DESIGN.isActive(), "Concrete design add-on must be active");
	ASSERT(IsMemberOrMemberSetDesignPropertiesActivated(object), "Design properties must be on");
	object.concrete_cover_different_at_section_sides_enabled = true;
	if (typeof concrete_cover_min_top !== "undefined") {
		object.concrete_cover_min_top = concrete_cover_min_top;
	}
	if (typeof concrete_cover_min_left !== "undefined") {
		object.concrete_cover_min_left = concrete_cover_min_left;
	}
	if (typeof concrete_cover_min_right !== "undefined") {
		object.concrete_cover_min_right = concrete_cover_min_right;
	}
	if (typeof concrete_cover_min_bottom !== "undefined") {
		object.concrete_cover_min_bottom = concrete_cover_min_bottom;
	}
}

function MemberAddConcreteDesignShearReinforcement (object) {
	ASSERT(CONCRETE_DESIGN.isActive(), "Concrete design add-on must be active");
	ASSERT(IsMemberOrMemberSetDesignPropertiesActivated(object), "Design properties must be on");
	var rowCount = object.concrete_shear_reinforcement_spans.row_count();
	object.concrete_shear_reinforcement_spans.insert_row(rowCount + 1);
	return rowCount + 1;
}

function MemberRemoveConcreteDesignShearReinforcement (object,
    shear_reinforcement_no) {
	ASSERT(CONCRETE_DESIGN.isActive(), "Concrete design add-on must be active");
	ASSERT(IsMemberOrMemberSetDesignPropertiesActivated(object), "Design properties must be on");
	ASSERT(typeof shear_reinforcement_no !== "undefined" && shear_reinforcement_no >= 1 && shear_reinforcement_no <= object.concrete_shear_reinforcement_spans.row_count(), "Bad shear reinforcement number");
	object.concrete_shear_reinforcement_spans.remove_row(shear_reinforcement_no);
}

function MemberSetConcreteDesignShearReinforcementBaseData (object,
    shear_reinforcement_no,
	material_no,
	stirrup_type) {
	ASSERT(CONCRETE_DESIGN.isActive(), "Concrete design add-on must be active");
	ASSERT(IsMemberOrMemberSetDesignPropertiesActivated(object), "Design properties must be on");
	ASSERT(typeof shear_reinforcement_no !== "undefined" && shear_reinforcement_no >= 1 && shear_reinforcement_no <= object.concrete_shear_reinforcement_spans.row_count(), "Bad shear reinforcement number");
	ASSERT(typeof material_no !== "undefined", "Material number must be specified");
	if (__objectExists(material_no, "Material", materials)) {
		object.concrete_shear_reinforcement_spans[shear_reinforcement_no].material = material_no;
	}
	object.concrete_shear_reinforcement_spans[shear_reinforcement_no].stirrup_type = EnumValueFromJSHLFTypeName(
		stirrup_type,
		"Stirrup type",
        object.objectType() === "member" ?
		{
			"TWO_LEGGED_CLOSED_HOOK_135": members.STIRRUP_TYPE_TWO_LEGGED_CLOSED_HOOK_135,
			"TWO_LEGGED_CLOSED_HOOK_90": members.STIRRUP_TYPE_TWO_LEGGED_CLOSED_HOOK_90,
			"TWO_LEGGED_OPEN": members.STIRRUP_TYPE_TWO_LEGGED_OPEN,
			"THREE_LEGGED_CLOSED_HOOK_135": members.STIRRUP_TYPE_THREE_LEGGED_CLOSED_HOOK_135,
			"THREE_LEGGED_CLOSED_HOOK_90": members.STIRRUP_TYPE_THREE_LEGGED_CLOSED_HOOK_90,
			"FOUR_LEGGED_CLOSED_HOOK_135": members.STIRRUP_TYPE_FOUR_LEGGED_CLOSED_HOOK_135,
			"FOUR_LEGGED_CLOSED_HOOK_90": members.STIRRUP_TYPE_FOUR_LEGGED_CLOSED_HOOK_90,
			"TWO_LEGGED_OVERLAP_HOOK_180": members.STIRRUP_TYPE_TWO_LEGGED_OVERLAP_HOOK_180,
			"THREE_LEGGED_OVERLAP_HOOK_180": members.STIRRUP_TYPE_THREE_LEGGED_OVERLAP_HOOK_180,
			"FOUR_LEGGED_OVERLAP_HOOK_180": members.STIRRUP_TYPE_FOUR_LEGGED_OVERLAP_HOOK_180
		} :
        {
			"TWO_LEGGED_CLOSED_HOOK_135": member_sets.STIRRUP_TYPE_TWO_LEGGED_CLOSED_HOOK_135,
			"TWO_LEGGED_CLOSED_HOOK_90": member_sets.STIRRUP_TYPE_TWO_LEGGED_CLOSED_HOOK_90,
			"TWO_LEGGED_OPEN": member_sets.STIRRUP_TYPE_TWO_LEGGED_OPEN,
			"THREE_LEGGED_CLOSED_HOOK_135": member_sets.STIRRUP_TYPE_THREE_LEGGED_CLOSED_HOOK_135,
			"THREE_LEGGED_CLOSED_HOOK_90": member_sets.STIRRUP_TYPE_THREE_LEGGED_CLOSED_HOOK_90,
			"FOUR_LEGGED_CLOSED_HOOK_135": member_sets.STIRRUP_TYPE_FOUR_LEGGED_CLOSED_HOOK_135,
			"FOUR_LEGGED_CLOSED_HOOK_90": member_sets.STIRRUP_TYPE_FOUR_LEGGED_CLOSED_HOOK_90,
			"TWO_LEGGED_OVERLAP_HOOK_180": member_sets.STIRRUP_TYPE_TWO_LEGGED_OVERLAP_HOOK_180,
			"THREE_LEGGED_OVERLAP_HOOK_180": member_sets.STIRRUP_TYPE_THREE_LEGGED_OVERLAP_HOOK_180,
			"FOUR_LEGGED_OVERLAP_HOOK_180": member_sets.STIRRUP_TYPE_FOUR_LEGGED_OVERLAP_HOOK_180
		},
		object.objectType() === "members" ? members.STIRRUP_TYPE_TWO_LEGGED_CLOSED_HOOK_135 : member_sets.STIRRUP_TYPE_TWO_LEGGED_CLOSED_HOOK_135);
}

function MemberSetConcreteDesignShearReinforcementStirrupParameters (object,
    shear_reinforcement_no,
	stirrup_diameter,
	stirrup_distances,
	stirrup_count,
	crossties_active,
	crossties_diameter) {
	ASSERT(CONCRETE_DESIGN.isActive(), "Concrete design add-on must be active");
	ASSERT(IsMemberOrMemberSetDesignPropertiesActivated(object), "Design properties must be on");
	ASSERT(typeof shear_reinforcement_no !== "undefined" && shear_reinforcement_no >= 1 && shear_reinforcement_no <= object.concrete_shear_reinforcement_spans.row_count(), "Bad shear reinforcement number");
	if (typeof stirrup_diameter !== "undefined") {
		if (IsConcreteDesignCurrentCodeOfStandard("EN") || IsConcreteDesignCurrentCodeOfStandard("NTC") || IsConcreteDesignCurrentCodeOfStandard("SP")) {
			object.concrete_shear_reinforcement_spans[shear_reinforcement_no].stirrup_diameter = stirrup_diameter;
		}
		else if (IsConcreteDesignCurrentCodeOfStandard("ACI")) {

		}
		else {
			ASSERT(IsConcreteDesignCurrentCodeOfStandard("CSA"), "Unknown code of standard: " + GetConcreteDesignCurrentCodeOfStandard());
		}
	}
	if (typeof stirrup_distances !== "undefined") {
		object.concrete_shear_reinforcement_spans[shear_reinforcement_no].stirrup_distances = stirrup_distances;
	}
	if (typeof stirrup_count !== "undefined") {
		object.concrete_shear_reinforcement_spans[shear_reinforcement_no].stirrup_count = stirrup_count;
	}
	if (typeof crossties_active !== "undefined") {
		object.concrete_shear_reinforcement_spans[shear_reinforcement_no].crossties_active = crossties_active;
	}
	if (typeof crossties_diameter !== "undefined") {
		ASSERT(object.concrete_shear_reinforcement_spans[shear_reinforcement_no].crossties_active, "Crossties over free rebars must be on");
		object.concrete_shear_reinforcement_spans[shear_reinforcement_no].crossties_diameter = crossties_diameter;
	}
}

function MemberSetConcreteDesignShearReinforcementAreas (object,
    shear_reinforcement_no,
	reinforcement_area) {
	ASSERT(CONCRETE_DESIGN.isActive(), "Concrete design add-on must be active");
	ASSERT(IsMemberOrMemberSetDesignPropertiesActivated(object), "Design properties must be on");
	ASSERT(typeof shear_reinforcement_no !== "undefined" && shear_reinforcement_no >= 1 && shear_reinforcement_no <= object.concrete_shear_reinforcement_spans.row_count(), "Bad shear reinforcement number");
	ASSERT(typeof reinforcement_area !== "undefined", "Reinforcement area must be specified");
	object.concrete_shear_reinforcement_spans[shear_reinforcement_no].reinforcement_area = reinforcement_area;
}

function MemberSetConcreteDesignShearReinforcementSpanLocation (object,
    shear_reinforcement_no,
	span_position_reference_type,
	span_start,
	span_end,
	span_position_reference_x_location,
	definition_format_absolute) {
	ASSERT(CONCRETE_DESIGN.isActive(), "Concrete design add-on must be active");
	ASSERT(IsMemberOrMemberSetDesignPropertiesActivated(object), "Design properties must be on");
	ASSERT(typeof shear_reinforcement_no !== "undefined" && shear_reinforcement_no >= 1 && shear_reinforcement_no <= object.concrete_shear_reinforcement_spans.row_count(), "Bad shear reinforcement number");
	if (typeof definition_format_absolute === "undefined") {
		definition_format_absolute = true;
	}
	object.concrete_shear_reinforcement_spans[shear_reinforcement_no].span_position_definition_format = definition_format_absolute ? members.SHEAR_REINFORCEMENT_SPAN_DEFINITION_FORMAT_ABSOLUTE : members.SHEAR_REINFORCEMENT_SPAN_DEFINITION_FORMAT_RELATIVE;
	object.concrete_shear_reinforcement_spans[shear_reinforcement_no].span_position_reference_type = EnumValueFromJSHLFTypeName(
		span_position_reference_type,
		"Span position reference type",
        object.objectType() === "members" ?
		{
			"START": members.SHEAR_REINFORCEMENT_SPAN_REFERENCE_START,
			"END": members.SHEAR_REINFORCEMENT_SPAN_REFERENCE_END,
            /*"INTERNAL_NODE": members.SHEAR_REINFORCEMENT_SPAN_INTERNAL_NODE,*/    // not used?
			"X_LOCATION": members.SHEAR_REINFORCEMENT_SPAN_X_LOCATION
		} :
        {
			"START": member_sets.SHEAR_REINFORCEMENT_SPAN_REFERENCE_START,
			"END": member_sets.SHEAR_REINFORCEMENT_SPAN_REFERENCE_END,
            /*"INTERNAL_NODE": member_sets.SHEAR_REINFORCEMENT_SPAN_INTERNAL_NODE,*/    // not used?
			"X_LOCATION": member_sets.SHEAR_REINFORCEMENT_SPAN_X_LOCATION
		},
		object.objectType() === "members" ? members.SHEAR_REINFORCEMENT_SPAN_REFERENCE_START : member_sets.SHEAR_REINFORCEMENT_SPAN_REFERENCE_START
	);
	if (typeof span_start !== "undefined") {
		if (definition_format_absolute) {
			object.concrete_shear_reinforcement_spans[shear_reinforcement_no].span_start_absolute = span_start;
		}
		else {
			ASSERT(span_start >= 0 && span_start <= 1, "Span start must be in range 0; 1");
			object.concrete_shear_reinforcement_spans[shear_reinforcement_no].span_start_relative = span_start;
		}
	}
	if (typeof span_end !== "undefined") {
		if (definition_format_absolute) {
			object.concrete_shear_reinforcement_spans[shear_reinforcement_no].span_end_absolute = span_end;
		}
		else {
			ASSERT(span_end >= 0 && span_end <= 1, "Span end must be in range 0; 1");
			object.concrete_shear_reinforcement_spans[shear_reinforcement_no].span_end_relative = span_end;
		}
	}
	if (typeof span_position_reference_x_location !== "undefined") {
		ASSERT(object.concrete_shear_reinforcement_spans[shear_reinforcement_no].span_position_reference_type === (object.objectType() === "members" ? members.SHEAR_REINFORCEMENT_SPAN_X_LOCATION : member_sets.SHEAR_REINFORCEMENT_SPAN_X_LOCATION), "x-location required Reference set to X_LOCATION");
		if (definition_format_absolute) {
			object.concrete_shear_reinforcement_spans[shear_reinforcement_no].span_position_reference_x_location_absolute = span_position_reference_x_location;
		}
		else {
			ASSERT(span_position_reference_x_location >= 0 && span_position_reference_x_location <= 1, "Span end must be in range 0; 1");
			object.concrete_shear_reinforcement_spans[shear_reinforcement_no].span_position_reference_x_location_relative = span_position_reference_x_location;
		}
	}
}

function MemberSetConcreteDesignShearReinforcementBorderDistancesOfStirrups (object,
    shear_reinforcement_no,
	stirrup_layout_rule) {
	ASSERT(CONCRETE_DESIGN.isActive(), "Concrete design add-on must be active");
	ASSERT(IsMemberOrMemberSetDesignPropertiesActivated(object), "Design properties must be on");
	ASSERT(typeof shear_reinforcement_no !== "undefined" && shear_reinforcement_no >= 1 && shear_reinforcement_no <= object.concrete_shear_reinforcement_spans.row_count(), "Bad shear reinforcement number");
	ASSERT(typeof stirrup_layout_rule !== "undefined", "Stirrup layout rule must be specified");
	object.concrete_shear_reinforcement_spans[shear_reinforcement_no].stirrup_layout_rule = EnumValueFromJSHLFTypeName(
		stirrup_layout_rule,
		"Stirrup layout rule",
        object.objectType() === "member" ?
		{
			"START_EQUALS_END": members.SHEAR_REINFORCEMENT_STIRRUP_LAYOUT_RULE_START_EQUALS_END,
			"START_DEFINED": members.SHEAR_REINFORCEMENT_STIRRUP_LAYOUT_RULE_START_DEFINED,
			"START_EQUALS_REST_LENGTH_TO_STIRRUP_DISTANCED": members.SHEAR_REINFORCEMENT_STIRRUP_LAYOUT_RULE_START_EQUALS_REST_LENGTH_TO_STIRRUP_DISTANCED,
			"END_DEFINED": members.SHEAR_REINFORCEMENT_STIRRUP_LAYOUT_RULE_END_DEFINED,
			"END_EQUALS_REST_LENGTH_TO_STIRRUP_DISTANCED": members.SHEAR_REINFORCEMENT_STIRRUP_LAYOUT_RULE_END_EQUALS_REST_LENGTH_TO_STIRRUP_DISTANCED
		} :
        {
			"START_EQUALS_END": member_sets.SHEAR_REINFORCEMENT_STIRRUP_LAYOUT_RULE_START_EQUALS_END,
			"START_DEFINED": member_sets.SHEAR_REINFORCEMENT_STIRRUP_LAYOUT_RULE_START_DEFINED,
			"START_EQUALS_REST_LENGTH_TO_STIRRUP_DISTANCED": member_sets.SHEAR_REINFORCEMENT_STIRRUP_LAYOUT_RULE_START_EQUALS_REST_LENGTH_TO_STIRRUP_DISTANCED,
			"END_DEFINED": member_sets.SHEAR_REINFORCEMENT_STIRRUP_LAYOUT_RULE_END_DEFINED,
			"END_EQUALS_REST_LENGTH_TO_STIRRUP_DISTANCED": member_sets.SHEAR_REINFORCEMENT_STIRRUP_LAYOUT_RULE_END_EQUALS_REST_LENGTH_TO_STIRRUP_DISTANCED
		},
		object.objectType() === "member" ? members.SHEAR_REINFORCEMENT_STIRRUP_LAYOUT_RULE_START_EQUALS_END : member_sets.SHEAR_REINFORCEMENT_STIRRUP_LAYOUT_RULE_START_EQUALS_END
	);
}

function IsMemberOrMemberSetDesignPropertiesActivated (object) {
    return object.objectType() === "member" ? object.design_properties_via_member : object.design_properties_activated;
}

function IsSurfaceOrSurfaceSetDesignPropertiesActivated (object) {
    return object.objectType() === "surface" ? object.design_properties_via_surface : object.design_properties_activated;
}

function MemberAddConcreteDesignLongitudinalReinforcement (object) {
	ASSERT(CONCRETE_DESIGN.isActive(), "Concrete design add-on must be active");
	ASSERT(IsMemberOrMemberSetDesignPropertiesActivated(object), "Design properties must be on");
	var rowCount = object.concrete_longitudinal_reinforcement_items.row_count();
	object.concrete_longitudinal_reinforcement_items.insert_row(rowCount + 1);
	return rowCount + 1;
}

function MemberRemoveConcreteDesignLongitudinalReinforcement (object,
    longitudinal_reinforcement_no) {
	ASSERT(CONCRETE_DESIGN.isActive(), "Concrete design add-on must be active");
	ASSERT(IsMemberOrMemberSetDesignPropertiesActivated(object), "Design properties must be on");
	ASSERT(typeof longitudinal_reinforcement_no !== "undefined" && longitudinal_reinforcement_no >= 1 && longitudinal_reinforcement_no <= object.concrete_longitudinal_reinforcement_items.row_count(), "Bad longitudinal reinforcement number");
	object.concrete_longitudinal_reinforcement_items.remove_row(longitudinal_reinforcement_no);
}

function MemberSetConcreteDesignLongitudinalReinforcementBaseData (object,
    longitudinal_reinforcement_no,
	rebar_type,
	material_no,
	reinforcement_placed_in_bending_corner_enabled) {
	ASSERT(CONCRETE_DESIGN.isActive(), "Concrete design add-on must be active");
	ASSERT(IsMemberOrMemberSetDesignPropertiesActivated(object), "Design properties must be on");
	ASSERT(typeof longitudinal_reinforcement_no !== "undefined" && longitudinal_reinforcement_no >= 1 && longitudinal_reinforcement_no <= object.concrete_longitudinal_reinforcement_items.row_count(), "Bad longitudinal reinforcement number");
	ASSERT(typeof material_no !== "undefined", "Material number must be specified");
	object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].rebar_type = EnumValueFromJSHLFTypeName(
		rebar_type,
		"Rebar type",
        object.objectType() === "member" ?
		{
			"SYMMETRICAL": members.REBAR_TYPE_SYMMETRICAL,
			"UNSYMMETRICAL": members.REBAR_TYPE_UNSYMMETRICAL,
			"UNIFORMLY_SURROUNDING": members.REBAR_TYPE_UNIFORMLY_SURROUNDING,
			"LINE": members.REBAR_TYPE_LINE,
			"SINGLE": members.REBAR_TYPE_SINGLE
		} :
        {
			"SYMMETRICAL": member_sets.REBAR_TYPE_SYMMETRICAL,
			"UNSYMMETRICAL": member_sets.REBAR_TYPE_UNSYMMETRICAL,
			"UNIFORMLY_SURROUNDING": member_sets.REBAR_TYPE_UNIFORMLY_SURROUNDING,
			"LINE": member_sets.REBAR_TYPE_LINE,
			"SINGLE": member_sets.REBAR_TYPE_SINGLE
		},
		object.objectType() === "member" ? members.REBAR_TYPE_SYMMETRICAL : member_sets.REBAR_TYPE_SYMMETRICAL
	);
	if (__objectExists(material_no, "Material", materials)) {
		object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].material = material_no;
	}
	if (typeof reinforcement_placed_in_bending_corner_enabled !== "undefined") {
		object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].reinforcement_placed_in_bending_corner_enabled = reinforcement_placed_in_bending_corner_enabled;
	}
}

function MemberSetConcreteDesignLongitudinalReinforcementSymmetricalRebarParameters (object,
    longitudinal_reinforcement_no,
	bar_count_symmetrical,
	bar_diameter_symmetrical,
	corner_reinforcement_enabled,
	bar_diameter_corner) {
	ASSERT(CONCRETE_DESIGN.isActive(), "Concrete design add-on must be active");
	ASSERT(IsMemberOrMemberSetDesignPropertiesActivated(object), "Design properties must be on");
	ASSERT(typeof longitudinal_reinforcement_no !== "undefined" && longitudinal_reinforcement_no >= 1 && longitudinal_reinforcement_no <= object.concrete_longitudinal_reinforcement_items.row_count(), "Bad longitudinal reinforcement number");
	ASSERT(object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].rebar_type === (object.objectType() === "member" ? members.REBAR_TYPE_SYMMETRICAL : member_sets.REBAR_TYPE_SYMMETRICAL), "Rebar must be of symmetrical type");
	if (typeof bar_count_symmetrical !== "undefined") {
		object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].bar_count_symmetrical = bar_count_symmetrical;
	}
	if (typeof bar_diameter_symmetrical !== "undefined") {
		if (IsConcreteDesignCurrentCodeOfStandard("EN") || IsConcreteDesignCurrentCodeOfStandard("NTC") || IsConcreteDesignCurrentCodeOfStandard("SP")) {
			object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].bar_diameter_symmetrical = bar_diameter_symmetrical;
		}
		else if (IsConcreteDesignCurrentCodeOfStandard("ACI")) {

		}
		else {
			ASSERT(IsConcreteDesignCurrentCodeOfStandard("CSA"), "Unknown code of standard: " + GetConcreteDesignCurrentCodeOfStandard());
		}
	}
	if (typeof corner_reinforcement_enabled !== "undefined") {
		object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].corner_reinforcement_enabled = corner_reinforcement_enabled;
	}
	if (typeof bar_diameter_corner !== "undefined") {
		ASSERT(object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].corner_reinforcement_enabled, "Corner reinforcement must be on");
		if (IsConcreteDesignCurrentCodeOfStandard("EN") || IsConcreteDesignCurrentCodeOfStandard("NTC") || IsConcreteDesignCurrentCodeOfStandard("SP")) {
			object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].bar_diameter_corner = bar_diameter_corner;
		}
	}
	else if (IsConcreteDesignCurrentCodeOfStandard("ACI")) {

	}
	else {
		ASSERT(IsConcreteDesignCurrentCodeOfStandard("CSA"), "Unknown code of standard: " + GetConcreteDesignCurrentCodeOfStandard());
	}
}

function MemberSetConcreteDesignLongitudinalReinforcementUnSymmetricalRebarParameters (object,
    longitudinal_reinforcement_no,
	bar_count_unsymmetrical_top_side,
	bar_diameter_unsymmetrical_top_side,
	bar_count_unsymmetrical_at_side,
	bar_diameter_unsymmetrical_at_side,
	bar_count_unsymmetrical_bottom_side,
	bar_diameter_unsymmetrical_bottom_side,
	corner_reinforcement_enabled,
	bar_diameter_corner) {
	ASSERT(CONCRETE_DESIGN.isActive(), "Concrete design add-on must be active");
	ASSERT(IsMemberOrMemberSetDesignPropertiesActivated(object), "Design properties must be on");
	ASSERT(typeof longitudinal_reinforcement_no !== "undefined" && longitudinal_reinforcement_no >= 1 && longitudinal_reinforcement_no <= object.concrete_longitudinal_reinforcement_items.row_count(), "Bad longitudinal reinforcement number");
	ASSERT(object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].rebar_type === (object.objectType() === "member" ? members.REBAR_TYPE_UNSYMMETRICAL : member_sets.REBAR_TYPE_UNSYMMETRICAL), "Rebar must be of unsymmetrical type");
	object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].bar_count_unsymmetrical_top_side = bar_count_unsymmetrical_top_side;
	if (typeof bar_count_unsymmetrical_top_side !== "undefined") {
		if (IsConcreteDesignCurrentCodeOfStandard("EN") || IsConcreteDesignCurrentCodeOfStandard("NTC") || IsConcreteDesignCurrentCodeOfStandard("SP")) {
			object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].bar_diameter_unsymmetrical_top_side = bar_diameter_unsymmetrical_top_side;
		}
		else if (IsConcreteDesignCurrentCodeOfStandard("ACI")) {

		}
		else {
			ASSERT(IsConcreteDesignCurrentCodeOfStandard("CSA"), "Unknown code of standard: " + GetConcreteDesignCurrentCodeOfStandard());
		}
	}
	if (typeof bar_count_unsymmetrical_at_side !== "undefined") {
		object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].bar_count_unsymmetrical_at_side = bar_count_unsymmetrical_at_side;
	}
	if (typeof bar_diameter_unsymmetrical_at_side !== "undefined") {
		if (IsConcreteDesignCurrentCodeOfStandard("EN") || IsConcreteDesignCurrentCodeOfStandard("NTC") || IsConcreteDesignCurrentCodeOfStandard("SP")) {
			object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].bar_diameter_unsymmetrical_at_side = bar_diameter_unsymmetrical_at_side;
		}
		else if (IsConcreteDesignCurrentCodeOfStandard("ACI")) {

		}
		else {
			ASSERT(IsConcreteDesignCurrentCodeOfStandard("CSA"), "Unknown code of standard: " + GetConcreteDesignCurrentCodeOfStandard());
		}
	}
	if (typeof bar_count_unsymmetrical_bottom_side !== "undefined") {
		object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].bar_count_unsymmetrical_bottom_side = bar_count_unsymmetrical_bottom_side;
	}
	if (typeof bar_diameter_unsymmetrical_bottom_side !== "undefined") {
		if (IsConcreteDesignCurrentCodeOfStandard("EN") || IsConcreteDesignCurrentCodeOfStandard("NTC") || IsConcreteDesignCurrentCodeOfStandard("SP")) {
			object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].bar_diameter_unsymmetrical_bottom_side = bar_diameter_unsymmetrical_bottom_side;
		}
		else if (IsConcreteDesignCurrentCodeOfStandard("ACI")) {

		}
		else {
			ASSERT(IsConcreteDesignCurrentCodeOfStandard("CSA"), "Unknown code of standard: " + GetConcreteDesignCurrentCodeOfStandard());
		}
	}
	if (typeof corner_reinforcement_enabled !== "undefined") {
		object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].corner_reinforcement_enabled = corner_reinforcement_enabled;
	}
	if (typeof bar_diameter_corner !== "undefined") {
		ASSERT(object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].corner_reinforcement_enabled, "Corner reinforcement must be on");
		if (IsConcreteDesignCurrentCodeOfStandard("EN") || IsConcreteDesignCurrentCodeOfStandard("NTC") || IsConcreteDesignCurrentCodeOfStandard("SP")) {
			object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].bar_diameter_corner = bar_diameter_corner;
		}
		else if (IsConcreteDesignCurrentCodeOfStandard("ACI")) {

		}
		else {
			ASSERT(IsConcreteDesignCurrentCodeOfStandard("CSA"), "Unknown code of standard: " + GetConcreteDesignCurrentCodeOfStandard());
		}
	}
}

function MemberSetConcreteDesignLongitudinalReinforcementUniformlySurroundingRebarParameters (object,
    longitudinal_reinforcement_no,
	bar_count_uniformly_surrounding,
	bar_diameter_uniformly_surrounding,
	corner_reinforcement_enabled,
	bar_diameter_corner) {
	ASSERT(CONCRETE_DESIGN.isActive(), "Concrete design add-on must be active");
	ASSERT(IsMemberOrMemberSetDesignPropertiesActivated(object), "Design properties must be on");
	ASSERT(typeof longitudinal_reinforcement_no !== "undefined" && longitudinal_reinforcement_no >= 1 && longitudinal_reinforcement_no <= object.concrete_longitudinal_reinforcement_items.row_count(), "Bad longitudinal reinforcement number");
	ASSERT(object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].rebar_type === (object.objectType() === "member" ? members.REBAR_TYPE_UNIFORMLY_SURROUNDING : member_sets.REBAR_TYPE_UNIFORMLY_SURROUNDING), "Rebar must be of uniformly surrounding type");
	if (typeof bar_count_uniformly_surrounding !== "undefined") {
		object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].bar_count_uniformly_surrounding = bar_count_uniformly_surrounding;
	}
	if (typeof bar_diameter_uniformly_surrounding !== "undefined") {
		if (IsConcreteDesignCurrentCodeOfStandard("EN") || IsConcreteDesignCurrentCodeOfStandard("NTC") || IsConcreteDesignCurrentCodeOfStandard("SP")) {
			object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].bar_diameter_uniformly_surrounding = bar_diameter_uniformly_surrounding;
		}
		else if (IsConcreteDesignCurrentCodeOfStandard("ACI")) {

		}
		else {
			ASSERT(IsConcreteDesignCurrentCodeOfStandard("CSA"), "Unknown code of standard: " + GetConcreteDesignCurrentCodeOfStandard());
		}
	}
	if (typeof corner_reinforcement_enabled !== "undefined") {
		object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].corner_reinforcement_enabled = corner_reinforcement_enabled;
	}
	if (typeof bar_diameter_corner !== "undefined") {
		ASSERT(object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].corner_reinforcement_enabled, "Corner reinforcement must be on");
		if (IsConcreteDesignCurrentCodeOfStandard("EN") || IsConcreteDesignCurrentCodeOfStandard("NTC") || IsConcreteDesignCurrentCodeOfStandard("SP")) {
			object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].bar_diameter_corner = bar_diameter_corner;
		}
		else if (IsConcreteDesignCurrentCodeOfStandard("ACI")) {

		}
		else {
			ASSERT(IsConcreteDesignCurrentCodeOfStandard("CSA"), "Unknown code of standard: " + GetConcreteDesignCurrentCodeOfStandard());
		}
	}
}

function MemberSetConcreteDesignLongitudinalReinforcementLineRebarParameters (object,
    longitudinal_reinforcement_no,
	bar_count_line,
	bar_diameter_line,
	additional_offset_type_single_line,
	additional_offset_reference_type_at_start,
	additional_horizontal_offset_at_start,
	additional_vertical_offset_at_start,
	additional_offset_reference_type_at_end,
	additional_horizontal_offset_at_end,
	additional_vertical_offset_at_end) {
	ASSERT(CONCRETE_DESIGN.isActive(), "Concrete design add-on must be active");
	ASSERT(IsMemberOrMemberSetDesignPropertiesActivated(object), "Design properties must be on");
	ASSERT(typeof longitudinal_reinforcement_no !== "undefined" && longitudinal_reinforcement_no >= 1 && longitudinal_reinforcement_no <= object.concrete_longitudinal_reinforcement_items.row_count(), "Bad longitudinal reinforcement number");
	ASSERT(object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].rebar_type === (object.objectType() === "member" ? members.REBAR_TYPE_LINE : member_sets.REBAR_TYPE_LINE), "Rebar must be of line type");
	if (typeof bar_count_line !== "undefined") {
		object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].bar_count_line = bar_count_line;
	}
	if (typeof bar_diameter_line !== "undefined") {
		if (IsConcreteDesignCurrentCodeOfStandard("EN") || IsConcreteDesignCurrentCodeOfStandard("NTC") || IsConcreteDesignCurrentCodeOfStandard("SP")) {
			object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].bar_diameter_line = bar_diameter_line;
		}
		else if (IsConcreteDesignCurrentCodeOfStandard("ACI")) {

		}
		else {
			ASSERT(IsConcreteDesignCurrentCodeOfStandard("CSA"), "Unknown code of standard: " + GetConcreteDesignCurrentCodeOfStandard());
		}
	}
	object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].additional_offset_type_single_line = GetMemberConcreteDesignLongitudinalReinforcementRebarParametersOffsetType(object, additional_offset_type_single_line);
	if (typeof additional_offset_reference_type_at_start !== "undefined") {
		ASSERT(object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].additional_offset_type_single_line != (object.objectType() ? members.LONGITUDINAL_REINFORCEMENT_ADDITIONAL_OFFSET_TYPE_NONE : member_sets.LONGITUDINAL_REINFORCEMENT_ADDITIONAL_OFFSET_TYPE_NONE), "Offset type must be set");
		object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].additional_offset_reference_type_at_start = GetMemberConcreteDesignLongitudinalReinforcementRebarParametersReference(
            object,
			additional_offset_reference_type_at_start,
			"Start reference",
			object.objectType() === "member" ? members.LONGITUDINAL_REINFORCEMENT_ADDITIONAL_OFFSET_REFERENCE_TYPE_LEFT_BOTTOM : member_sets.LONGITUDINAL_REINFORCEMENT_ADDITIONAL_OFFSET_REFERENCE_TYPE_LEFT_BOTTOM);
	}
	if (typeof additional_horizontal_offset_at_start !== "undefined") {
		ASSERT(object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].additional_offset_type_single_line != (object.objectType() === "mmeber" ? members.LONGITUDINAL_REINFORCEMENT_ADDITIONAL_OFFSET_TYPE_NONE : member_sets.LONGITUDINAL_REINFORCEMENT_ADDITIONAL_OFFSET_TYPE_NONE), "Offset type must be set");
		object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].additional_horizontal_offset_at_start = additional_horizontal_offset_at_start;
	}
	if (typeof additional_vertical_offset_at_start !== "undefined") {
		ASSERT(object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].additional_offset_type_single_line != (object.objectType() === "member" ? members.LONGITUDINAL_REINFORCEMENT_ADDITIONAL_OFFSET_TYPE_NONE : member_sets.LONGITUDINAL_REINFORCEMENT_ADDITIONAL_OFFSET_TYPE_NONE), "Offset type must be set");
		object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].additional_vertical_offset_at_start = additional_vertical_offset_at_start;
	}
	if (typeof additional_offset_reference_type_at_end !== "undefined") {
		ASSERT(object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].additional_offset_type_single_line != (object.objectType() === "member" ? members.LONGITUDINAL_REINFORCEMENT_ADDITIONAL_OFFSET_TYPE_NONE : member_sets.LONGITUDINAL_REINFORCEMENT_ADDITIONAL_OFFSET_TYPE_NONE), "Offset type must be set");
		object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].additional_offset_reference_type_at_end = GetMemberConcreteDesignLongitudinalReinforcementRebarParametersReference(
            object,
			additional_offset_reference_type_at_end,
			"End reference",
			object.objectType() === "member" ? members.LONGITUDINAL_REINFORCEMENT_ADDITIONAL_OFFSET_REFERENCE_TYPE_LEFT_TOP : member_sets.LONGITUDINAL_REINFORCEMENT_ADDITIONAL_OFFSET_REFERENCE_TYPE_LEFT_TOP);
	}
	if (typeof additional_horizontal_offset_at_end !== "undefined") {
		ASSERT(object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].additional_offset_type_single_line != members.LONGITUDINAL_REINFORCEMENT_ADDITIONAL_OFFSET_TYPE_NONE, "Offset type must be set");
		object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].additional_horizontal_offset_at_end = additional_horizontal_offset_at_end;
	}
	if (typeof additional_vertical_offset_at_end !== "undefined") {
		ASSERT(object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].additional_offset_type_single_line != (object.objectType() === "member" ? members.LONGITUDINAL_REINFORCEMENT_ADDITIONAL_OFFSET_TYPE_NONE : member_sets.LONGITUDINAL_REINFORCEMENT_ADDITIONAL_OFFSET_TYPE_NONE), "Offset type must be set");
		object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].additional_vertical_offset_at_end = additional_vertical_offset_at_end;
	}
}

function MemberSetConcreteDesignLongitudinalReinforcementSingleRebarParameters (object,
    longitudinal_reinforcement_no,
	bar_diameter_single,
	additional_offset_type_single_line,
	additional_offset_reference_type,
	additional_horizontal_offset,
	additional_vertical_offset) {
	ASSERT(CONCRETE_DESIGN.isActive(), "Concrete design add-on must be active");
	ASSERT(IsMemberOrMemberSetDesignPropertiesActivated(object), "Design properties must be on");
	ASSERT(typeof longitudinal_reinforcement_no !== "undefined" && longitudinal_reinforcement_no >= 1 && longitudinal_reinforcement_no <= object.concrete_longitudinal_reinforcement_items.row_count(), "Bad longitudinal reinforcement number");
	ASSERT(object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].rebar_type === (object.objectType() === "member" ? members.REBAR_TYPE_SINGLE : member_sets.REBAR_TYPE_SINGLE), "Rebar must be of single type");	
	if (typeof bar_diameter_single !== "undefined") {
		if (IsConcreteDesignCurrentCodeOfStandard("EN") || IsConcreteDesignCurrentCodeOfStandard("NTC") || IsConcreteDesignCurrentCodeOfStandard("SP")) {
			object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].bar_diameter_single = bar_diameter_single;
		}
		else if (IsConcreteDesignCurrentCodeOfStandard("ACI")) {

		}
		else {
			ASSERT(IsConcreteDesignCurrentCodeOfStandard("CSA"), "Unknown code of standard: " + GetConcreteDesignCurrentCodeOfStandard());
		}
	}
	object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].additional_offset_type_single_line = GetMemberConcreteDesignLongitudinalReinforcementRebarParametersOffsetType(object, additional_offset_type_single_line);
	if (typeof additional_offset_reference_type !== "undefined") {
		ASSERT(object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].additional_offset_type_single_line != (object.objectType() === "member" ? members.LONGITUDINAL_REINFORCEMENT_ADDITIONAL_OFFSET_TYPE_NONE : member_sets.LONGITUDINAL_REINFORCEMENT_ADDITIONAL_OFFSET_TYPE_NONE), "Offset type must be set");
		object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].additional_offset_reference_type = GetMemberConcreteDesignLongitudinalReinforcementRebarParametersReference(
            object,
			additional_offset_reference_type,
			"Reference",
			object.objectType() === "member" ? members.LONGITUDINAL_REINFORCEMENT_ADDITIONAL_OFFSET_REFERENCE_TYPE_CENTER_BOTTOM : member_sets.LONGITUDINAL_REINFORCEMENT_ADDITIONAL_OFFSET_REFERENCE_TYPE_CENTER_BOTTOM);
	}
	if (typeof additional_horizontal_offset !== "undefined") {
		ASSERT(object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].additional_offset_type_single_line != (object.objectType() === "member" ? members.LONGITUDINAL_REINFORCEMENT_ADDITIONAL_OFFSET_TYPE_NONE : member_sets.LONGITUDINAL_REINFORCEMENT_ADDITIONAL_OFFSET_TYPE_NONE), "Offset type must be set");
		object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].additional_horizontal_offset = additional_horizontal_offset;
	}
	if (typeof additional_vertical_offset !== "undefined") {
		ASSERT(object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].additional_offset_type_single_line != (object.objectType() === "member" ? members.LONGITUDINAL_REINFORCEMENT_ADDITIONAL_OFFSET_TYPE_NONE : member_sets.LONGITUDINAL_REINFORCEMENT_ADDITIONAL_OFFSET_TYPE_NONE), "Offset type must be set");
		object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].additional_vertical_offset = additional_vertical_offset;
	}
}

function MemberSetConcreteDesignLongitudinalReinforcementSymmetricalAreas (object,
    longitudinal_reinforcement_no,
	reinforcement_area_symmetrical) {
	ASSERT(CONCRETE_DESIGN.isActive(), "Concrete design add-on must be active");
	ASSERT(IsMemberOrMemberSetDesignPropertiesActivated(object), "Design properties must be on");
	ASSERT(typeof longitudinal_reinforcement_no !== "undefined" && longitudinal_reinforcement_no >= 1 && longitudinal_reinforcement_no <= object.concrete_longitudinal_reinforcement_items.row_count(), "Bad longitudinal reinforcement number");
	ASSERT(object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].rebar_type === (object.objectType() === "member" ? members.REBAR_TYPE_SYMMETRICAL : member_sets.REBAR_TYPE_SYMMETRICAL), "Rebar must be of symmetrical type");
	ASSERT(typeof reinforcement_area_symmetrical !== "undefined", "Side must be specified");
	object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].reinforcement_area_symmetrical = reinforcement_area_symmetrical;
}

function MemberSetConcreteDesignLongitudinalReinforcementUnSymmetricalAreas (object,
    longitudinal_reinforcement_no,
	reinforcement_area_unsymmetrical_top_side,
	reinforcement_area_unsymmetrical_at_side,
	reinforcement_area_unsymmetrical_bottom_side) {
	ASSERT(CONCRETE_DESIGN.isActive(), "Concrete design add-on must be active");
	ASSERT(IsMemberOrMemberSetDesignPropertiesActivated(object), "Design properties must be on");
	ASSERT(typeof longitudinal_reinforcement_no !== "undefined" && longitudinal_reinforcement_no >= 1 && longitudinal_reinforcement_no <= object.concrete_longitudinal_reinforcement_items.row_count(), "Bad longitudinal reinforcement number");
	ASSERT(object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].rebar_type === (object.objectType() === "member" ? members.REBAR_TYPE_UNSYMMETRICAL : member_sets.REBAR_TYPE_UNSYMMETRICAL), "Rebar must be of unsymmetrical type");	
	if (typeof reinforcement_area_unsymmetrical_top_side !== "undefined") {
		object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].reinforcement_area_unsymmetrical_top_side = reinforcement_area_unsymmetrical_top_side;
	}
	if (typeof reinforcement_area_unsymmetrical_at_side !== "undefined") {
		object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].reinforcement_area_unsymmetrical_at_side = reinforcement_area_unsymmetrical_at_side;
	}
	if (typeof reinforcement_area_unsymmetrical_bottom_side !== "undefined") {
		object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].reinforcement_area_unsymmetrical_bottom_side = reinforcement_area_unsymmetrical_bottom_side;
	}
}

function MemberSetConcreteDesignLongitudinalReinforcementUniformlySurroundingAreas (object,
    longitudinal_reinforcement_no,
	reinforcement_area_uniformly_surrounding) {
	ASSERT(CONCRETE_DESIGN.isActive(), "Concrete design add-on must be active");
	ASSERT(IsMemberOrMemberSetDesignPropertiesActivated(object), "Design properties must be on");
	ASSERT(typeof longitudinal_reinforcement_no !== "undefined" && longitudinal_reinforcement_no >= 1 && longitudinal_reinforcement_no <= object.concrete_longitudinal_reinforcement_items.row_count(), "Bad longitudinal reinforcement number");
	ASSERT(object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].rebar_type === (object.objectType() === "member" ? members.REBAR_TYPE_UNIFORMLY_SURROUNDING : member_sets.REBAR_TYPE_UNIFORMLY_SURROUNDING), "Rebar must be of uniformly surrounding type");	
	ASSERT(typeof reinforcement_area_uniformly_surrounding !== "undefined", "Reinforcement area must be specified");
	object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].reinforcement_area_uniformly_surrounding = reinforcement_area_uniformly_surrounding;
}

function MemberSetConcreteDesignLongitudinalReinforcementLineAreas (object,
    longitudinal_reinforcement_no,
	reinforcement_area_line) {
	ASSERT(CONCRETE_DESIGN.isActive(), "Concrete design add-on must be active");
	ASSERT(IsMemberOrMemberSetDesignPropertiesActivated(object), "Design properties must be on");
	ASSERT(typeof longitudinal_reinforcement_no !== "undefined" && longitudinal_reinforcement_no >= 1 && longitudinal_reinforcement_no <= object.concrete_longitudinal_reinforcement_items.row_count(), "Bad longitudinal reinforcement number");
	ASSERT(object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].rebar_type === (object.objectType() === "member" ? members.REBAR_TYPE_LINE : member_sets.REBAR_TYPE_LINE), "Rebar must be of line type");	
	ASSERT(typeof reinforcement_area_line !== "undefined", "Total must be specified");
	object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].reinforcement_area_line = reinforcement_area_line;
}

function MemberSetConcreteDesignLongitudinalReinforcementSingleAreas (object,
    longitudinal_reinforcement_no,
	reinforcement_area_single) {
	ASSERT(CONCRETE_DESIGN.isActive(), "Concrete design add-on must be active");
	ASSERT(IsMemberOrMemberSetDesignPropertiesActivated(object), "Design properties must be on");
	ASSERT(typeof longitudinal_reinforcement_no !== "undefined" && longitudinal_reinforcement_no >= 1 && longitudinal_reinforcement_no <= object.concrete_longitudinal_reinforcement_items.row_count(), "Bad longitudinal reinforcement number");
	ASSERT(object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].rebar_type === (object.objectType() === "member" ? members.REBAR_TYPE_SINGLE : member_sets.REBAR_TYPE_SINGLE), "Rebar must be of single type");	
	ASSERT(typeof reinforcement_area_single !== "undefined", "Total must be specified");
	object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].reinforcement_area_single = reinforcement_area_single;
}

function MemberSetConcreteDesignLongitudinalReinforcementSpanLocation (object,
    longitudinal_reinforcement_no,
	span_position_reference_type,
	span_start,
	span_end,
	span_position_reference_x_location,
	definition_format_absolute) {
	ASSERT(CONCRETE_DESIGN.isActive(), "Concrete design add-on must be active");
	ASSERT(IsMemberOrMemberSetDesignPropertiesActivated(object), "Design properties must be on");
	ASSERT(typeof longitudinal_reinforcement_no !== "undefined" && longitudinal_reinforcement_no >= 1 && longitudinal_reinforcement_no <= object.concrete_longitudinal_reinforcement_items.row_count(), "Bad longitudinal reinforcement number");
	if (typeof definition_format_absolute === "undefined") {
		definition_format_absolute = true;
	}
    if (object.objectType() === "member") {
	    object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].span_position_definition_format = definition_format_absolute ? members.LONGITUDINAL_REINFORCEMENT_SPAN_DEFINITION_FORMAT_ABSOLUTE : members.LONGITUDINAL_REINFORCEMENT_SPAN_DEFINITION_FORMAT_RELATIVE;
    }
    else {
        object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].span_position_definition_format = definition_format_absolute ? member_sets.LONGITUDINAL_REINFORCEMENT_SPAN_DEFINITION_FORMAT_ABSOLUTE : member_sets.LONGITUDINAL_REINFORCEMENT_SPAN_DEFINITION_FORMAT_RELATIVE;
    }
	object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].span_position_reference_type = EnumValueFromJSHLFTypeName(
		span_position_reference_type,
		"Span position reference type",
		object.objectType() === "member" ?
        {
			"START": members.LONGITUDINAL_REINFORCEMENT_ITEM_REFERENCE_START,
			"END": members.LONGITUDINAL_REINFORCEMENT_ITEM_REFERENCE_END,
            /*"INTERNAL_NODE": members.LONGITUDINAL_REINFORCEMENT_ITEM_INTERNAL_NODE,*/    // not used?
			"X_LOCATION": members.LONGITUDINAL_REINFORCEMENT_ITEM_X_LOCATION
		} :
        {
			"START": member_sets.LONGITUDINAL_REINFORCEMENT_ITEM_REFERENCE_START,
			"END": member_sets.LONGITUDINAL_REINFORCEMENT_ITEM_REFERENCE_END,
            /*"INTERNAL_NODE": member_sets.LONGITUDINAL_REINFORCEMENT_ITEM_INTERNAL_NODE,*/    // not used?
			"X_LOCATION": member_sets.LONGITUDINAL_REINFORCEMENT_ITEM_X_LOCATION
		},
		object.objectType() === "member" ? members.LONGITUDINAL_REINFORCEMENT_ITEM_REFERENCE_START : member_sets.LONGITUDINAL_REINFORCEMENT_ITEM_REFERENCE_START
	);
	if (typeof span_start !== "undefined") {
		if (definition_format_absolute) {
			object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].span_start_absolute = span_start;
		}
		else {
			ASSERT(span_start >= 0 && span_start <= 1, "Span start must be in range 0; 1");
			object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].span_start_relative = span_start;
		}
	}
	if (typeof span_end !== "undefined") {
		if (definition_format_absolute) {
			object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].span_end_absolute = span_end;
		}
		else {
			ASSERT(span_end >= 0 && span_end <= 1, "Span end must be in range 0; 1");
			object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].span_end_relative = span_end;
		}
	}
	if (typeof span_position_reference_x_location !== "undefined") {
		ASSERT(object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].span_position_reference_type === (object.objectType() === "member" ? members.LONGITUDINAL_REINFORCEMENT_ITEM_X_LOCATION : member_sets.LONGITUDINAL_REINFORCEMENT_ITEM_X_LOCATION), "x-location required Reference set to X_LOCATION");
		if (definition_format_absolute) {
			object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].span_position_reference_x_location_absolute = span_position_reference_x_location;
		}
		else {
			ASSERT(span_position_reference_x_location >= 0 && span_position_reference_x_location <= 1, "Span end must be in range 0; 1");
			object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].span_position_reference_x_location_relative = span_position_reference_x_location;
		}
	}
}

function MemberSetConcreteDesignLongitudinalReinforcementAdditionalOffset (object,
    longitudinal_reinforcement_no,
	additional_offset_type,
	additional_offset_top_side,
	additional_offset_bottom_side,
	additional_offset_left_side,
	additional_offset_right_side) {
	ASSERT(CONCRETE_DESIGN.isActive(), "Concrete design add-on must be active");
	ASSERT(IsMemberOrMemberSetDesignPropertiesActivated(object), "Design properties must be on");
	ASSERT(typeof longitudinal_reinforcement_no !== "undefined" && longitudinal_reinforcement_no >= 1 && longitudinal_reinforcement_no <= object.concrete_longitudinal_reinforcement_items.row_count(), "Bad longitudinal reinforcement number");
	ASSERT(typeof additional_offset_type !== "undefined", "Additional offset type must be specified");
	object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].additional_offset_type = GetMemberConcreteDesignLongitudinalReinforcementRebarParametersOffsetType(object, additional_offset_type);
	if (typeof additional_offset_top_side !== "undefined" || typeof additional_offset_bottom_side !== "undefined" || typeof additional_offset_left_side !== "undefined" || typeof additional_offset_right_side !== "undefined") {
		ASSERT(object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].additional_offset_type !== (object.objectType() === "member" ? members.LONGITUDINAL_REINFORCEMENT_ADDITIONAL_OFFSET_TYPE_NONE : member_sets.LONGITUDINAL_REINFORCEMENT_ADDITIONAL_OFFSET_TYPE_NONE), "Additional offset type must be set");
	}
	if (typeof additional_offset_top_side !== "undefined") {
		object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].additional_offset_top_side = additional_offset_top_side;
	}
	if (typeof additional_offset_bottom_side !== "undefined") {
		object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].additional_offset_bottom_side = additional_offset_bottom_side;
	}
	if (typeof additional_offset_left_side !== "undefined") {
		object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].additional_offset_left_side = additional_offset_left_side;
	}
	if (typeof additional_offset_right_side !== "undefined") {
		object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].additional_offset_right_side = additional_offset_right_side;
	}
}

function MemberSetConcreteDesignLongitudinalReinforcementAnchorageStart (object,
    longitudinal_reinforcement_no,
	anchorage_start_anchor_type,
	anchorage_start_anchor_length,
	anchorage_start_bending_diameter) {
	ASSERT(CONCRETE_DESIGN.isActive(), "Concrete design add-on must be active");
	ASSERT(IsMemberOrMemberSetDesignPropertiesActivated(object), "Design properties must be on");
	ASSERT(typeof longitudinal_reinforcement_no !== "undefined" && longitudinal_reinforcement_no >= 1 && longitudinal_reinforcement_no <= object.concrete_longitudinal_reinforcement_items.row_count(), "Bad longitudinal reinforcement number");
	ASSERT(typeof anchorage_start_anchor_type !== "undefined", "Start anchor type must be specified");
	object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].anchorage_start_anchor_type = GetMemberConcreteDesignLongitudinalReinforcementAnchorageType(object, anchorage_start_anchor_type);
	if (typeof anchorage_start_anchor_length !== "undefined" || typeof anchorage_start_bending_diameter !== "undefined") {
		ASSERT(object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].anchorage_start_anchor_type !== (object.objectType() === "member" ? members.ANCHORAGE_TYPE_NONE : member_sets.ANCHORAGE_TYPE_NONE), "Anchor type must be set");
	}
	if (typeof anchorage_start_anchor_length !== "undefined") {
		object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].anchorage_start_anchor_length = anchorage_start_anchor_length;
	}
	if (typeof anchorage_start_bending_diameter !== "undefined") {
		if (!IsConcreteDesignCurrentCodeOfStandard("CSA")) {
			var anchorTypes = object.objectType() === "member" ? [members.ANCHORAGE_TYPE_HOOK, members.ANCHORAGE_TYPE_BEND, members.ANCHORAGE_TYPE_HOOK_WITH_TRANSVERSE_BAR] : [member_sets.ANCHORAGE_TYPE_HOOK, member_sets.ANCHORAGE_TYPE_BEND, member_sets.ANCHORAGE_TYPE_HOOK_WITH_TRANSVERSE_BAR];
		}
		else {
			var anchorTypes = object.objectType() === "member" ? [members.ANCHORAGE_TYPE_HOOK, members.ANCHORAGE_TYPE_BEND] : [member_sets.ANCHORAGE_TYPE_HOOK, member_sets.ANCHORAGE_TYPE_BEND];
		}
		ASSERT(anchorTypes.indexOf(object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].anchorage_start_anchor_type) != -1,
			"Anchor type must be of these types: " + anchorTypes);
		object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].anchorage_start_bending_diameter = anchorage_start_bending_diameter;
	}
}

function MemberSetConcreteDesignLongitudinalReinforcementAnchorageEnd (object,
    longitudinal_reinforcement_no,
	anchorage_end_anchor_type,
	anchorage_end_anchor_length,
	anchorage_end_bending_diameter) {
	ASSERT(CONCRETE_DESIGN.isActive(), "Concrete design add-on must be active");
	ASSERT(IsMemberOrMemberSetDesignPropertiesActivated(object), "Design properties must be on");
	ASSERT(typeof longitudinal_reinforcement_no !== "undefined" && longitudinal_reinforcement_no >= 1 && longitudinal_reinforcement_no <= object.concrete_longitudinal_reinforcement_items.row_count(), "Bad longitudinal reinforcement number");
	ASSERT(typeof anchorage_end_anchor_type !== "undefined", "End anchor type must be specified");
	object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].anchorage_end_anchor_type = GetMemberConcreteDesignLongitudinalReinforcementAnchorageType(object, anchorage_end_anchor_type);
	if (typeof anchorage_end_anchor_length !== "undefined" || typeof anchorage_end_bending_diameter !== "undefined") {
		ASSERT(object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].anchorage_end_anchor_type !== (object.objectType() === "member" ? members.ANCHORAGE_TYPE_NONE : member_sets.ANCHORAGE_TYPE_NONE), "Anchor type must be set");
	}
	if (typeof anchorage_end_anchor_length !== "undefined") {
		object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].anchorage_end_anchor_length = anchorage_end_anchor_length;
	}
	if (typeof anchorage_end_bending_diameter !== "undefined") {
		var anchorTypes = object.objectType() === "member" ? [members.ANCHORAGE_TYPE_HOOK, members.ANCHORAGE_TYPE_BEND, members.ANCHORAGE_TYPE_HOOK_WITH_TRANSVERSE_BAR] : [member_sets.ANCHORAGE_TYPE_HOOK, member_sets.ANCHORAGE_TYPE_BEND, member_sets.ANCHORAGE_TYPE_HOOK_WITH_TRANSVERSE_BAR];
		ASSERT(anchorTypes.indexOf(object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].anchorage_end_anchor_type) != -1,
			"Anchor type must be of these types: " + anchorTypes);
		object.concrete_longitudinal_reinforcement_items[longitudinal_reinforcement_no].anchorage_end_bending_diameter = anchorage_end_bending_diameter;
	}
}

function GetMemberConcreteDesignLongitudinalReinforcementRebarParametersReference (object,
    reference_type, reference_name, default_value) {
	return EnumValueFromJSHLFTypeName (
		reference_type,
		reference_name,
		object.objectType() === "member" ?
        {
			"LEFT_TOP": members.LONGITUDINAL_REINFORCEMENT_ADDITIONAL_OFFSET_REFERENCE_TYPE_LEFT_TOP,
			"LEFT_CENTER": members.LONGITUDINAL_REINFORCEMENT_ADDITIONAL_OFFSET_REFERENCE_TYPE_LEFT_CENTER,
			"LEFT_BOTTOM": members.LONGITUDINAL_REINFORCEMENT_ADDITIONAL_OFFSET_REFERENCE_TYPE_LEFT_BOTTOM,
			"CENTER_TOP": members.LONGITUDINAL_REINFORCEMENT_ADDITIONAL_OFFSET_REFERENCE_TYPE_CENTER_TOP,
			"CENTER_CENTER": members.LONGITUDINAL_REINFORCEMENT_ADDITIONAL_OFFSET_REFERENCE_TYPE_CENTER_CENTER,
			"CENTER_BOTTOM": members.LONGITUDINAL_REINFORCEMENT_ADDITIONAL_OFFSET_REFERENCE_TYPE_CENTER_BOTTOM,
			"RIGHT_TOP": members.LONGITUDINAL_REINFORCEMENT_ADDITIONAL_OFFSET_REFERENCE_TYPE_RIGHT_TOP,
			"RIGHT_CENTER": members.LONGITUDINAL_REINFORCEMENT_ADDITIONAL_OFFSET_REFERENCE_TYPE_RIGHT_CENTER,
			"RIGHT_BOTTOM": members.LONGITUDINAL_REINFORCEMENT_ADDITIONAL_OFFSET_REFERENCE_TYPE_RIGHT_BOTTOM
		} :
        {
			"LEFT_TOP": member_sets.LONGITUDINAL_REINFORCEMENT_ADDITIONAL_OFFSET_REFERENCE_TYPE_LEFT_TOP,
			"LEFT_CENTER": member_sets.LONGITUDINAL_REINFORCEMENT_ADDITIONAL_OFFSET_REFERENCE_TYPE_LEFT_CENTER,
			"LEFT_BOTTOM": member_sets.LONGITUDINAL_REINFORCEMENT_ADDITIONAL_OFFSET_REFERENCE_TYPE_LEFT_BOTTOM,
			"CENTER_TOP": member_sets.LONGITUDINAL_REINFORCEMENT_ADDITIONAL_OFFSET_REFERENCE_TYPE_CENTER_TOP,
			"CENTER_CENTER": member_sets.LONGITUDINAL_REINFORCEMENT_ADDITIONAL_OFFSET_REFERENCE_TYPE_CENTER_CENTER,
			"CENTER_BOTTOM": member_sets.LONGITUDINAL_REINFORCEMENT_ADDITIONAL_OFFSET_REFERENCE_TYPE_CENTER_BOTTOM,
			"RIGHT_TOP": member_sets.LONGITUDINAL_REINFORCEMENT_ADDITIONAL_OFFSET_REFERENCE_TYPE_RIGHT_TOP,
			"RIGHT_CENTER": member_sets.LONGITUDINAL_REINFORCEMENT_ADDITIONAL_OFFSET_REFERENCE_TYPE_RIGHT_CENTER,
			"RIGHT_BOTTOM": member_sets.LONGITUDINAL_REINFORCEMENT_ADDITIONAL_OFFSET_REFERENCE_TYPE_RIGHT_BOTTOM
		},
		default_value
	);
}

function GetMemberConcreteDesignLongitudinalReinforcementRebarParametersOffsetType (object,
    offset_type) {
	return EnumValueFromJSHLFTypeName (
		offset_type,
		"Offset type",
		object.objectType() === "member" ?
        {
			"NONE": members.LONGITUDINAL_REINFORCEMENT_ADDITIONAL_OFFSET_TYPE_NONE,
			"FROM_STIRRUP": members.LONGITUDINAL_REINFORCEMENT_ADDITIONAL_OFFSET_TYPE_FROM_STIRRUP,
			"FROM_CONCRETE_COVER": members.LONGITUDINAL_REINFORCEMENT_ADDITIONAL_OFFSET_TYPE_FROM_CONCRETE_COVER,
			"FROM_SECTION_SURFACE": members.LONGITUDINAL_REINFORCEMENT_ADDITIONAL_OFFSET_TYPE_FROM_SECTION_SURFACE
		} :
        {
			"NONE": member_sets.LONGITUDINAL_REINFORCEMENT_ADDITIONAL_OFFSET_TYPE_NONE,
			"FROM_STIRRUP": member_sets.LONGITUDINAL_REINFORCEMENT_ADDITIONAL_OFFSET_TYPE_FROM_STIRRUP,
			"FROM_CONCRETE_COVER": member_sets.LONGITUDINAL_REINFORCEMENT_ADDITIONAL_OFFSET_TYPE_FROM_CONCRETE_COVER,
			"FROM_SECTION_SURFACE": member_sets.LONGITUDINAL_REINFORCEMENT_ADDITIONAL_OFFSET_TYPE_FROM_SECTION_SURFACE
		},
		object.objectType() === "member" ? members.LONGITUDINAL_REINFORCEMENT_ADDITIONAL_OFFSET_TYPE_FROM_STIRRUP : member_sets.LONGITUDINAL_REINFORCEMENT_ADDITIONAL_OFFSET_TYPE_FROM_STIRRUP
	);
}

function GetMemberConcreteDesignLongitudinalReinforcementAnchorageType (object,
    anchorage_type) {
	if (!IsConcreteDesignCurrentCodeOfStandard("CSA")) {
		return EnumValueFromJSHLFTypeName (
			anchorage_type,
			"Anchorage type",
			object.objectType() === "member" ?
            {
				"NONE": members.ANCHORAGE_TYPE_NONE,
				"STRAIGHT": members.ANCHORAGE_TYPE_STRAIGHT,
				"HOOK": members.ANCHORAGE_TYPE_HOOK,
				"BEND": members.ANCHORAGE_TYPE_BEND,
				"STRAIGHT_WITH_TRANSVERSE_BAR": members.ANCHORAGE_TYPE_STRAIGHT_WITH_TRANSVERSE_BAR,
				"HOOK_WITH_TRANSVERSE_BAR": members.ANCHORAGE_TYPE_HOOK_WITH_TRANSVERSE_BAR,
				"STRAIGHT_WITH_TWO_TRANSVERSE_BARS": members.ANCHORAGE_TYPE_STRAIGHT_WITH_TWO_TRANSVERSE_BARS
			} :
            {
				"NONE": member_sets.ANCHORAGE_TYPE_NONE,
				"STRAIGHT": member_sets.ANCHORAGE_TYPE_STRAIGHT,
				"HOOK": member_sets.ANCHORAGE_TYPE_HOOK,
				"BEND": member_sets.ANCHORAGE_TYPE_BEND,
				"STRAIGHT_WITH_TRANSVERSE_BAR": member_sets.ANCHORAGE_TYPE_STRAIGHT_WITH_TRANSVERSE_BAR,
				"HOOK_WITH_TRANSVERSE_BAR": member_sets.ANCHORAGE_TYPE_HOOK_WITH_TRANSVERSE_BAR,
				"STRAIGHT_WITH_TWO_TRANSVERSE_BARS": member_sets.ANCHORAGE_TYPE_STRAIGHT_WITH_TWO_TRANSVERSE_BARS
			},
			object.objectType() === "member" ? members.ANCHORAGE_TYPE_NONE : member_sets.ANCHORAGE_TYPE_NONE
		);
	}
	else {
		return EnumValueFromJSHLFTypeName (
			anchorage_type,
			"Anchorage type",
			object.objectType() === "member" ?
            {
				"NONE": members.ANCHORAGE_TYPE_NONE,
				"STRAIGHT": members.ANCHORAGE_TYPE_STRAIGHT,
				"HOOK": members.ANCHORAGE_TYPE_HOOK,
				"BEND": members.ANCHORAGE_TYPE_BEND
			} :
            {
				"NONE": member_sets.ANCHORAGE_TYPE_NONE,
				"STRAIGHT": member_sets.ANCHORAGE_TYPE_STRAIGHT,
				"HOOK": member_sets.ANCHORAGE_TYPE_HOOK,
				"BEND": member_sets.ANCHORAGE_TYPE_BEND
			},
			object.objectType() === "member" ? members.ANCHORAGE_TYPE_NONE : member_sets.ANCHORAGE_TYPE_NONE
		);
	}
}

function SetSurfaceConcreteDesignProperties (object,
    enabled) {
	ASSERT(CONCRETE_DESIGN.isActive(), "Concrete design add-on must be active");
	if (typeof enabled === "undefined") {
		enabled = true;
	}
    if (object.objectType() === "surface") {
	    object.design_properties_via_surface = enabled;
    }
    else {
        object.design_properties_activated = enabled;
    }
}

function SurfaceSetUserDefinedConcreteCover (object,
    concrete_cover_top,
	concrete_cover_bottom,
	is_user_defined_concrete_cover_enabled) {
	ASSERT(CONCRETE_DESIGN.isActive(), "Concrete design must be active");
	ASSERT(IsSurfaceOrSurfaceSetDesignPropertiesActivated(object), "Design properties must be on");
	if (IsConcreteDesignCurrentCodeOfStandard("EN") || IsConcreteDesignCurrentCodeOfStandard("NTC")) {
		if (typeof is_user_defined_concrete_cover_enabled === "undefined") {
			is_user_defined_concrete_cover_enabled = true;
		}
		object.is_user_defined_concrete_cover_enabled = is_user_defined_concrete_cover_enabled;
	}
	if (typeof concrete_cover_top !== "undefined") {
		ASSERT(object.is_user_defined_concrete_cover_enabled, "User-defined must be true");
		object.user_defined_concrete_cover_top = concrete_cover_top;
	}
	if (typeof concrete_cover_bottom !== "undefined") {
		ASSERT(object.is_user_defined_concrete_cover_enabled, "User-defined must be true");
		object.user_defined_concrete_cover_bottom = concrete_cover_bottom;
	}
}

/*function SurfaceSetConcreteCoverAccToEn1992 (object) {
	ASSERT(CONCRETE_DESIGN.isActive(), "Concrete design must be active");
	ASSERTIsSurfaceOrSurfaceSetDesignPropertiesActivated(object), "Design properties must be on");
	object.is_user_defined_concrete_cover_enabled = false;
};*/    // Cannot be set Cannot be set (top surface side, bottom surface side)?

function SurfaceSetAssignments (object,
    surface_concrete_design_uls_configuration,
	surface_concrete_design_sls_configuration) {
	ASSERT(CONCRETE_DESIGN.isActive(), "Concrete design must be active");
	ASSERT(IsSurfaceOrSurfaceSetDesignPropertiesActivated(object), "Design properties must be on");
	function setAssignment (object,
		assignment_no,
		assignment_type) {
			if (assignment_type === "uls") {
				if (CONCRETE_DESIGN.concrete_design_uls_configurations.exist(assignment_no)) {
					object.surface_concrete_design_uls_configuration = assignment_no;
				}
				else {
					console.log("Ultimate configuration no. " + assignment_no + " doesn't exist");
				}
			}
			else if (assignment_type === "sls") {
				if (CONCRETE_DESIGN.concrete_design_sls_configurations.exist(assignment_no)) {
					object.surface_concrete_design_sls_configuration = assignment_no;
				}
				else {
					console.log("Serviceability configuration no. " + assignment_no + " doesn't exist");
				}
			}
			else {
				ASSERT(false);
			}
		}
	if (typeof surface_concrete_design_uls_configuration !== "undefined") {
		setAssignment(object, surface_concrete_design_uls_configuration, "uls");
	}
	if (typeof surface_concrete_design_sls_configuration !== "undefined") {
		setAssignment(object, surface_concrete_design_sls_configuration, "sls");
	}
}

function SurfaceSetConcreteDesignReinforcementDirections (object,
    reinforcement_direction_top,
	reinforcement_direction_bottom) {
	ASSERT(CONCRETE_DESIGN.isActive(), "Concrete design must be active");
	ASSERT(IsSurfaceOrSurfaceSetDesignPropertiesActivated(object), "Design properties must be on");
	ASSERT(typeof reinforcement_direction_top !== "undefined", "Reinforcement direction top must be specified");
	ASSERT(typeof reinforcement_direction_bottom !== "undefined", "Reinforcement direction bottom must be specified");
	function SetReinforcementDirection (object,
		reinforcement_direction_no,
		top) {
		if (reinforcement_directions.exist(reinforcement_direction_no)) {
			if (top) {
				object.reinforcement_direction_top = reinforcement_direction_no;
			}
			else {
				object.reinforcement_direction_bottom = reinforcement_direction_no;
			}
		}
		else {
			console.log("Reinforcement direction no. " + reinforcement_direction_no + " doesn't exist");
		}
	}
	SetReinforcementDirection(object, reinforcement_direction_top, true);
	SetReinforcementDirection(object, reinforcement_direction_bottom, false);
}

function SurfaceSetConcreteDesignConcreteDurability (object,
    concrete_durability_top,
	concrete_durability_bottom) {
	ASSERT(CONCRETE_DESIGN.isActive(), "Concrete design must be active");
	ASSERT(IsSurfaceOrSurfaceSetDesignPropertiesActivated(object), "Design properties must be on");
	ASSERT(IsConcreteDesignCurrentCodeOfStandard("EN") || IsConcreteDesignCurrentCodeOfStandard("NTC"), "Concrete durabilities can be set only for EN and NTC");
	ASSERT(typeof concrete_durability_top !== "undefined", "Concrete durability top must be specified");
	ASSERT(typeof concrete_durability_bottom !== "undefined", "Concrete durability bottom must be specified");
	function SetConcreteDurability (object,
		concrete_durability_no,
		top) {
		if (concrete_durabilities.exist(concrete_durability_no)) {
			if (top) {
				object.concrete_durability_top = concrete_durability_no;
			}
			else {
				object.concrete_durability_bottom = concrete_durability_no;
			}
		}
		else {
			console.log("Concrete durability no. " + concrete_durability_no + " doesn't exist");
		}
	}
	SetConcreteDurability(object, concrete_durability_top, true);
	SetConcreteDurability(object, concrete_durability_bottom, false);
}

function SurfaceSetConcreteDesignSurfaceReinforcement (object,
    surface_reinforcement_nos) {
	ASSERT(CONCRETE_DESIGN.isActive(), "Concrete design must be active");
	ASSERT(IsSurfaceOrSurfaceSetDesignPropertiesActivated(object), "Design properties must be on");
	ASSERT(typeof surface_reinforcement_nos !== "undefined", "Surface reinforcement must be specified");
	ASSERT(Array.isArray(surface_reinforcement_nos), "Surface reinforcements must be an array of numbers");
	var reinforcements_list = surface_reinforcement_nos;
	surface_reinforcement_nos = [];
	for (var i = 0; i < reinforcements_list.length; ++i) {
		if (surface_reinforcements.exist(reinforcements_list[i])) {
			surface_reinforcement_nos.push(reinforcements_list[i]);
		}
		else {
			console.log("Surface reinforcement no. " + reinforcements_list[i] + " doesn't exist");
		}
	}
	object.surface_reinforcements = surface_reinforcement_nos;
}

function SurfaceSetDeflectionAnalysis (object,
    deflection_check_surface_type,
	deflection_check_displacement_reference,
	deflection_check_reference_length_z_definition_type,
	deflection_check_reference_length_z) {
	ASSERT(CONCRETE_DESIGN.isActive(), "Concrete design must be active");
	ASSERT(IsSurfaceOrSurfaceSetDesignPropertiesActivated(object), "Design properties must be on");
	object.deflection_check_surface_type = EnumValueFromJSHLFTypeName(
		deflection_check_surface_type,
		"surface type",
		object.objectType() === "surface" ? {
			"DOUBLE_SUPPORTED": surfaces.DEFLECTION_CHECK_SURFACE_TYPE_DOUBLE_SUPPORTED,
			"CANTILEVER": surfaces.DEFLECTION_CHECK_SURFACE_TYPE_CANTILEVER
		} :
        {
			"DOUBLE_SUPPORTED": surface_sets.DEFLECTION_CHECK_SURFACE_TYPE_DOUBLE_SUPPORTED,
			"CANTILEVER": surface_sets.DEFLECTION_CHECK_SURFACE_TYPE_CANTILEVER
		},
		object.objectType() === "surface" ? surfaces.DEFLECTION_CHECK_SURFACE_TYPE_DOUBLE_SUPPORTED : surface_sets.DEFLECTION_CHECK_SURFACE_TYPE_DOUBLE_SUPPORTED);
	object.deflection_check_displacement_reference = EnumValueFromJSHLFTypeName(
		deflection_check_displacement_reference,
		"displacement reference",
		object.objectType() === "surface" ? {
			"DEFORMED_USER_DEFINED_REFERENCE_PLANE": surfaces.DEFLECTION_CHECK_DISPLACEMENT_REFERENCE_DEFORMED_USER_DEFINED_REFERENCE_PLANE,
			"PARALLEL_SURFACE": surfaces.DEFLECTION_CHECK_DISPLACEMENT_REFERENCE_PARALLEL_SURFACE,
			"UNDEFORMED_SYSTEM": surfaces.DEFLECTION_CHECK_DISPLACEMENT_REFERENCE_UNDEFORMED_SYSTEM
		} :
        {
			"DEFORMED_USER_DEFINED_REFERENCE_PLANE": surface_sets.DEFLECTION_CHECK_DISPLACEMENT_REFERENCE_DEFORMED_USER_DEFINED_REFERENCE_PLANE,
			"PARALLEL_SURFACE": surface_sets.DEFLECTION_CHECK_DISPLACEMENT_REFERENCE_PARALLEL_SURFACE,
			"UNDEFORMED_SYSTEM": surface_sets.DEFLECTION_CHECK_DISPLACEMENT_REFERENCE_UNDEFORMED_SYSTEM
		},
		object.objectType() === "surface" ? surfaces.DEFLECTION_CHECK_DISPLACEMENT_REFERENCE_UNDEFORMED_SYSTEM : surface_sets.DEFLECTION_CHECK_DISPLACEMENT_REFERENCE_UNDEFORMED_SYSTEM);
	object.deflection_check_reference_length_z_definition_type = EnumValueFromJSHLFTypeName(
		deflection_check_reference_length_z_definition_type,
		"reference length z definition type",
		object.objectType() === "surface" ? {
			"MANUALLY": surfaces.DEFLECTION_CHECK_REFERENCE_LENGTH_DEFINITION_TYPE_MANUALLY,
			"BY_MAXIMUM_BOUNDARY_LINE": surfaces.DEFLECTION_CHECK_REFERENCE_LENGTH_DEFINITION_TYPE_BY_MAXIMUM_BOUNDARY_LINE,
			"BY_MINIMUM_BOUNDARY_LINE": surfaces.DEFLECTION_CHECK_REFERENCE_LENGTH_DEFINITION_TYPE_BY_MINIMUM_BOUNDARY_LINE
		} :
        {
			"MANUALLY": surface_sets.DEFLECTION_CHECK_REFERENCE_LENGTH_DEFINITION_TYPE_MANUALLY,
			"BY_MAXIMUM_BOUNDARY_LINE": surface_sets.DEFLECTION_CHECK_REFERENCE_LENGTH_DEFINITION_TYPE_BY_MAXIMUM_BOUNDARY_LINE,
			"BY_MINIMUM_BOUNDARY_LINE": surface_sets.DEFLECTION_CHECK_REFERENCE_LENGTH_DEFINITION_TYPE_BY_MINIMUM_BOUNDARY_LINE
		},
		object.objectType() === "surface" ? surfaces.DEFLECTION_CHECK_REFERENCE_LENGTH_DEFINITION_TYPE_BY_MAXIMUM_BOUNDARY_LINE : surface_sets.DEFLECTION_CHECK_REFERENCE_LENGTH_DEFINITION_TYPE_BY_MAXIMUM_BOUNDARY_LINE);
	if (typeof deflection_check_reference_length_z !== "undefined") {
		ASSERT(object.deflection_check_reference_length_z_definition_type === (object.objectType() === "surface" ? surfaces.DEFLECTION_CHECK_REFERENCE_LENGTH_DEFINITION_TYPE_MANUALLY : surface_sets.DEFLECTION_CHECK_REFERENCE_LENGTH_DEFINITION_TYPE_MANUALLY), "Definition must be of MANUALLY type");
		object.deflection_check_reference_length_z = deflection_check_reference_length_z;
	}
}

function SurfaceSetUserDefinedReferencePlane (object,
    reference_plane) {
	ASSERT(CONCRETE_DESIGN.isActive(), "Concrete design must be active");
    ASSERT(IsSurfaceOrSurfaceSetDesignPropertiesActivated(object), "Design properties must be on");
	ASSERT(object.deflection_check_displacement_reference === (object.objectType() === "member" ? surfaces.DEFLECTION_CHECK_DISPLACEMENT_REFERENCE_DEFORMED_USER_DEFINED_REFERENCE_PLANE : surface_sets.DEFLECTION_CHECK_DISPLACEMENT_REFERENCE_DEFORMED_USER_DEFINED_REFERENCE_PLANE), "Displacement reference must be of DEFORMED_USER_DEFINED_REFERENCE_PLANE type");
	ASSERT(typeof reference_plane !== "undefined", "reference_plane must be specified");
	ASSERT(Array.isArray(reference_plane), "reference_plane must be an array");
	ASSERT(reference_plane.length === 9, "reference_plane must be an array: [AX, AY, AZ, BX, BY, BZ, CX, CY, CZ]");
	object.deflection_check_reference_plane_point_1 = $V(reference_plane.slice(0, 3));
	object.deflection_check_reference_plane_point_2 = $V(reference_plane.slice(3, 6));
	object.deflection_check_reference_plane_point_3 = $V(reference_plane.slice(6, 9));
}