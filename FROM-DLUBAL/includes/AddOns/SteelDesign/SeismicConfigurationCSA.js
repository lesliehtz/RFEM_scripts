include("../../Tools/high_level_functions_support.js");

/**
 * Creates Steel Design Seismic Configuration
 * @param {Number} no               Seismic Configuration index, can be undefined
 * @param {Array} members_no        List of members assigned, can be undefined
 * @param {Array} member_sets_no    List of member sets assigned, can be undefined
 * @param {String} comment          Comment, can be undefined
 * @param {Object} params           Additional parameters, can be undefined
 */
function SteelDesignSeismicConfigurationCSA (no,
    members_no,
    member_sets_no,
    comment,
    params) {
    ASSERT(STEEL_DESIGN.isActive(), "Steel design add-on must be active");
    this.addon = createBaseSteelDesignConfiguration(STEEL_DESIGN.steel_design_seismic_configurations, no, members_no, member_sets_no, comment, params);
}

/**
 * @returns Seismic Configuration index
 */
SteelDesignSeismicConfigurationCSA.prototype.GetNo = function () {
    return this.addon.no;
};

/**
 * @returns Seismic Configuration object
 */
SteelDesignSeismicConfigurationCSA.prototype.GetSeismicConfiguration = function () {
    return this.addon;
};

/**
 * Sets Name
 * @param {String} name     Seismic Configuration name, can be undefined
 */
SteelDesignSeismicConfigurationCSA.prototype.SetName = function (name) {
    ASSERT(typeof name !== "undefined", "Name must be specified");
    this.addon.name = name;
};

/**
 * Sets General design parameters
 * @param {String} property_seismic_force_resisting_system  Seismic force-resisting system (MOMENT_RESISTING_FRAMES, ECCENTRICALLY_BRACED_FRAMES, BUCKLING_RESTRAINED_BRACED_FRAMES, CONCENTRICALLY_BRACED_FRAMES), can be undefined (is not set, MOMENT_RESISTING_FRAMES as default)
 * @param {String} property_seismic_force_resisting_type    Seismic force-resisting type (DUCTILE_D, MODERATELY_DUCTILE_MD, LIMITED_DUCTILITY_LD), can be undefined (is not set, DUCTILE_D as default)
 * @param {String} property_seismic_member_type             Seismic member type (BEAM, COLUMN), can be undefined (is not set, BEAM as default)
 * @param {String} property_seismic_bracing_system          Bracing system (TENSION_COMPRESSION, CHEVRON, TENSION_ONLY), can be undefined (is not set, TENSION_COMPRESSION as default)
 */
SteelDesignSeismicConfigurationCSA.prototype.SetGeneral = function (property_seismic_force_resisting_system,
    property_seismic_force_resisting_type,
    property_seismic_member_type,
    property_seismic_bracing_system) {
    this.addon.settings_csa.property_seismic_force_resisting_system = EnumValueFromJSHLFTypeName(
        property_seismic_force_resisting_system,
        "seismic force resisting system",
        {
            "MOMENT_RESISTING_FRAMES": member_seismic_config_steel_design_csas16.E_SEISMIC_FORCE_RESISTING_SYSTEM_MOMENT_RESISTING_FRAMES,
            "ECCENTRICALLY_BRACED_FRAMES": member_seismic_config_steel_design_csas16.E_SEISMIC_FORCE_RESISTING_SYSTEM_ECCENTRICALLY_BRACED_FRAMES,
            "BUCKLING_RESTRAINED_BRACED_FRAMES": member_seismic_config_steel_design_csas16.E_SEISMIC_FORCE_RESISTING_SYSTEM_BUCKLING_RESTRAINED_BRACED_FRAMES,
            "CONCENTRICALLY_BRACED_FRAMES": member_seismic_config_steel_design_csas16.E_SEISMIC_FORCE_RESISTING_SYSTEM_CONCENTRICALLY_BRACED_FRAMES
        },
        member_seismic_config_steel_design_csas16.E_SEISMIC_FORCE_RESISTING_SYSTEM_MOMENT_RESISTING_FRAMES);
    if (typeof property_seismic_force_resisting_type !== "undefined") {
        if (this.addon.settings_csa.property_seismic_force_resisting_system === member_seismic_config_steel_design_csas16.E_SEISMIC_FORCE_RESISTING_SYSTEM_MOMENT_RESISTING_FRAMES) {
            var seismic_resisting_types = {
                "DUCTILE_D": member_seismic_config_steel_design_csas16.E_SEISMIC_FORCE_RESISTING_TYPE_DUCTILE_D,
                "MODERATELY_DUCTILE_MD": member_seismic_config_steel_design_csas16.E_SEISMIC_FORCE_RESISTING_TYPE_MODERATELY_DUCTILE_MD,
                "LIMITED_DUCTILITY_LD": member_seismic_config_steel_design_csas16.E_SEISMIC_FORCE_RESISTING_TYPE_LIMITED_DUCTILITY_LD
            }
            var default_resisting_type = member_seismic_config_steel_design_csas16.E_SEISMIC_FORCE_RESISTING_TYPE_DUCTILE_D;
        }
        else if (this.addon.settings_csa.property_seismic_force_resisting_system === member_seismic_config_steel_design_csas16.E_SEISMIC_FORCE_RESISTING_SYSTEM_ECCENTRICALLY_BRACED_FRAMES ||
            this.addon.settings_csa.property_seismic_force_resisting_system === member_seismic_config_steel_design_csas16.E_SEISMIC_FORCE_RESISTING_SYSTEM_BUCKLING_RESTRAINED_BRACED_FRAMES) {
            var seismic_resisting_types = {
                "DUCTILE_D": member_seismic_config_steel_design_csas16.E_SEISMIC_FORCE_RESISTING_TYPE_DUCTILE_D
            }
            var default_resisting_type = member_seismic_config_steel_design_csas16.E_SEISMIC_FORCE_RESISTING_TYPE_DUCTILE_D;
        }
        else {
            ASSERT(this.addon.settings_csa.property_seismic_force_resisting_system === member_seismic_config_steel_design_csas16.E_SEISMIC_FORCE_RESISTING_SYSTEM_CONCENTRICALLY_BRACED_FRAMES, "SteelDesignSeismicConfigurationCSA.prototype.SetGeneral");
            var seismic_resisting_types = {
                "MODERATELY_DUCTILE_MD": member_seismic_config_steel_design_csas16.E_SEISMIC_FORCE_RESISTING_TYPE_MODERATELY_DUCTILE_MD,
                "LIMITED_DUCTILITY_LD": member_seismic_config_steel_design_csas16.E_SEISMIC_FORCE_RESISTING_TYPE_LIMITED_DUCTILITY_LD
            }
            var default_resisting_type = member_seismic_config_steel_design_csas16.E_SEISMIC_FORCE_RESISTING_TYPE_MODERATELY_DUCTILE_MD;
        }
        this.addon.settings_csa.property_seismic_force_resisting_type = EnumValueFromJSHLFTypeName(
            property_seismic_force_resisting_type,
            "seismic force resisting",
            seismic_resisting_types,
            default_resisting_type);
    }
    if (typeof property_seismic_member_type !== "undefined") {
        if (this.addon.settings_csa.property_seismic_force_resisting_system === member_seismic_config_steel_design_csas16.E_SEISMIC_FORCE_RESISTING_SYSTEM_MOMENT_RESISTING_FRAMES) {
            var seismic_member_types = {
                "BEAM": member_seismic_config_steel_design_csas16.E_SEISMIC_MEMBER_TYPE_BEAM,
                "COLUMN": member_seismic_config_steel_design_csas16.E_SEISMIC_MEMBER_TYPE_COLUMN
            }
        }
        else if (this.addon.settings_csa.property_seismic_force_resisting_system === member_seismic_config_steel_design_csas16.E_SEISMIC_FORCE_RESISTING_SYSTEM_ECCENTRICALLY_BRACED_FRAMES) {
            var seismic_member_types = {
                "BEAM": member_seismic_config_steel_design_csas16.E_SEISMIC_MEMBER_TYPE_BEAM,
                "COLUMN": member_seismic_config_steel_design_csas16.E_SEISMIC_MEMBER_TYPE_COLUMN,
                "BRACE": member_seismic_config_steel_design_csas16.E_SEISMIC_MEMBER_TYPE_BRACE,
                "LINK_BEAM": member_seismic_config_steel_design_csas16.E_SEISMIC_MEMBER_TYPE_LINK
            };
        }
        else if (this.addon.settings_csa.property_seismic_force_resisting_system === member_seismic_config_steel_design_csas16.E_SEISMIC_FORCE_RESISTING_SYSTEM_BUCKLING_RESTRAINED_BRACED_FRAMES) {
            var seismic_member_types = {
                "COLUMN": member_seismic_config_steel_design_csas16.E_SEISMIC_MEMBER_TYPE_COLUMN,
                "BRACE": member_seismic_config_steel_design_csas16.E_SEISMIC_MEMBER_TYPE_BRACE
            }
        }
        else {
            ASSERT(this.addon.settings_csa.property_seismic_force_resisting_system === member_seismic_config_steel_design_csas16.E_SEISMIC_FORCE_RESISTING_SYSTEM_CONCENTRICALLY_BRACED_FRAMES, "SteelDesignSeismicConfigurationCSA.prototype.SetGeneral");
            var seismic_member_types = {
                "BEAM": member_seismic_config_steel_design_csas16.E_SEISMIC_MEMBER_TYPE_BEAM,
                "COLUMN": member_seismic_config_steel_design_csas16.E_SEISMIC_MEMBER_TYPE_COLUMN,
                "BRACE": member_seismic_config_steel_design_csas16.E_SEISMIC_MEMBER_TYPE_BRACE
            };
        }
        this.addon.settings_csa.property_seismic_member_type = EnumValueFromJSHLFTypeName(
            property_seismic_member_type,
            "seismic member",
            seismic_member_types,
            member_seismic_config_steel_design_csas16.E_SEISMIC_MEMBER_TYPE_BEAM);
    }
    if (typeof property_seismic_bracing_system !== "undefined") {
        ASSERT(this.addon.settings_csa.property_seismic_force_resisting_system === member_seismic_config_steel_design_csas16.E_SEISMIC_FORCE_RESISTING_SYSTEM_CONCENTRICALLY_BRACED_FRAMES, "Seismic force-resisting system must be of CONCENTRICALLY_BRACED_FRAMES type");
        this.addon.settings_csa.property_seismic_bracing_system = EnumValueFromJSHLFTypeName(
            property_seismic_bracing_system,
            "seismic bracing system",
            {
                "TENSION_COMPRESSION": member_seismic_config_steel_design_csas16.E_SEISMIC_BRACING_SYSTEM_TENSION_COMPRESSION,
                "CHEVRON": member_seismic_config_steel_design_csas16.E_SEISMIC_BRACING_SYSTEM_CHEVRON,
                "TENSION_ONLY": member_seismic_config_steel_design_csas16.E_SEISMIC_BRACING_SYSTEM_TENSION_ONLY
            },
            member_seismic_config_steel_design_csas16.E_SEISMIC_BRACING_SYSTEM_TENSION_COMPRESSION);
    }
};

/**
 * Sets The only expected inelastic behavior is at the column base
 * @param {Boolean} property_inelastic_behavior_at_column_base      The only expected inelastic behavior is at the column base, can be undefined (true as default)
 */
SteelDesignSeismicConfigurationCSA.prototype.SetInelasticBehaviorAtColumnBase = function (property_inelastic_behavior_at_column_base) {
    ASSERT(this.addon.settings_csa.property_seismic_member_type === member_seismic_config_steel_design_csas16.E_SEISMIC_MEMBER_TYPE_COLUMN, "Seismic member type must be of COLUMN type");
    if (typeof property_inelastic_behavior_at_column_base === "undefined") {
        property_inelastic_behavior_at_column_base = true;
    }
    this.addon.settings_csa.property_inelastic_behavior_at_column_base = property_inelastic_behavior_at_column_base;
};

/**
 * Sets The column is expected to develop plastic hinging
 * @param {Boolean} property_column_develops_plastic_hinging    The column is expected to develop plastic hinging, can be undefined (is not set, true as default)
 * @param {Boolean} property_fixed_base_column                  Fixed-base column, can be undefined (is not set, false as default)
 */
SteelDesignSeismicConfigurationCSA.prototype.SetColumnDevelopsPlasticHinging = function (property_column_develops_plastic_hinging,
    property_fixed_base_column) {
    ASSERT(this.addon.settings_csa.property_seismic_force_resisting_system === member_seismic_config_steel_design_csas16.E_SEISMIC_FORCE_RESISTING_SYSTEM_MOMENT_RESISTING_FRAMES &&
        (this.addon.settings_csa.property_seismic_force_resisting_type === member_seismic_config_steel_design_csas16.E_SEISMIC_FORCE_RESISTING_TYPE_DUCTILE_D 
            || this.addon.settings_csa.property_seismic_force_resisting_type === member_seismic_config_steel_design_csas16.E_SEISMIC_FORCE_RESISTING_TYPE_MODERATELY_DUCTILE_MD) &&
            this.addon.settings_csa.property_seismic_member_type === member_seismic_config_steel_design_csas16.E_SEISMIC_MEMBER_TYPE_COLUMN,
            "Incorrectly entered combination of Seismic force-resisting system, Seismic force-resisting type and Seismic member type");
    if (typeof property_column_develops_plastic_hinging !== "undefined") {
        this.addon.settings_csa.property_column_develops_plastic_hinging = property_column_develops_plastic_hinging;
    }
    if (typeof property_fixed_base_column !== "undefined") {
        ASSERT(this.addon.settings_csa.property_column_develops_plastic_hinging, "Column develops plastic hinging must be on");
        this.addon.settings_csa.property_fixed_base_column = property_fixed_base_column;
    }
};

/**
 * Sets Column in braced bay
 * @param {Boolean} property_column_in_braced_bay                                           Column in braced bay, can be undefined (is not set, true as default)
 * @param {Boolean} property_consider_additional_bending_moment_for_column_in_braced_bay    Consider additional bending moment for column in braced bay, can be undefined (is not set, false as default)
 * @param {String} braced_bay_direction                                                     Braced bay direction (XU, YV), can be undefined (is not set, YV as default)
 * @param {Boolean} property_column_in_the_top_two_storeys                                  Column in the top two stories, can be undefined (is not set, false as default)
 */
SteelDesignSeismicConfigurationCSA.prototype.SetColumnInBracedBay = function (property_column_in_braced_bay,
    property_consider_additional_bending_moment_for_column_in_braced_bay,
    braced_bay_direction,
    property_column_in_the_top_two_storeys) {
    ASSERT(this.addon.settings_csa.property_seismic_force_resisting_system !== member_seismic_config_steel_design_csas16.E_SEISMIC_FORCE_RESISTING_SYSTEM_MOMENT_RESISTING_FRAMES &&
        this.addon.settings_csa.property_seismic_member_type === member_seismic_config_steel_design_csas16.E_SEISMIC_MEMBER_TYPE_COLUMN,
        "Incorrectly entered combination of Seismic force-resisting system, Seismic force-resisting type and Seismic member type");
    if (typeof property_column_in_braced_bay !== "undefined") {
        this.addon.settings_csa.property_column_in_braced_bay = property_column_in_braced_bay;
    }
    if (typeof property_consider_additional_bending_moment_for_column_in_braced_bay !== "undefined") {
        ASSERT(this.addon.settings_csa.property_column_in_braced_bay, "Column in braced bay must be on");
        this.addon.settings_csa.property_consider_additional_bending_moment_for_column_in_braced_bay = property_consider_additional_bending_moment_for_column_in_braced_bay;
    }
    if (typeof braced_bay_direction !== "undefined") {
        ASSERT(this.addon.settings_csa.property_consider_additional_bending_moment_for_column_in_braced_bay, "Consider additional bending moment for column in braced bay must be on");
        SetSteelDesignSeismicConfigurationBracedBayType(this.addon.settings_csa, braced_bay_direction);
    }
    if (typeof property_column_in_the_top_two_storeys !== "undefined") {
        ASSERT(this.addon.settings_csa.property_consider_additional_bending_moment_for_column_in_braced_bay, "Consider additional bending moment for column in braced bay must be on");
        this.addon.settings_csa.property_column_in_the_top_two_storeys = property_column_in_the_top_two_storeys;
    }
};

/**
 * Sets Yielding
 * @param {Boolean} property_yielding_is_anticipated_at_link_end_of_outer_beam_segment  Yielding is anticipated at the link end of this outer beam segment, can be undefined (true as default)
 */
SteelDesignSeismicConfigurationCSA.prototype.SetYielding = function (property_yielding_is_anticipated_at_link_end_of_outer_beam_segment) {
    ASSERT(this.addon.settings_csa.property_seismic_force_resisting_system === member_seismic_config_steel_design_csas16.E_SEISMIC_FORCE_RESISTING_SYSTEM_ECCENTRICALLY_BRACED_FRAMES &&
        this.addon.settings_csa.property_seismic_force_resisting_type === member_seismic_config_steel_design_csas16.E_SEISMIC_FORCE_RESISTING_TYPE_DUCTILE_D &&
        this.addon.settings_csa.property_seismic_member_type === member_seismic_config_steel_design_csas16.E_SEISMIC_MEMBER_TYPE_BEAM,
        "Incorrectly entered combination of Seismic force-resisting system, Seismic force-resisting type and Seismic member type");
    if (typeof property_yielding_is_anticipated_at_link_end_of_outer_beam_segment === "undefined") {
        property_yielding_is_anticipated_at_link_end_of_outer_beam_segment = true;
    }
    this.addon.settings_csa.property_yielding_is_anticipated_at_link_end_of_outer_beam_segment = property_yielding_is_anticipated_at_link_end_of_outer_beam_segment;
};

/**
 * Sets Roof level
 * @param {Boolean} property_roof_level     Roof level, can be undefined (true as default)
 */
SteelDesignSeismicConfigurationCSA.prototype.SetRoofLevel = function (property_roof_level) {
    ASSERT(this.addon.settings_csa.property_seismic_force_resisting_system === member_seismic_config_steel_design_csas16.E_SEISMIC_FORCE_RESISTING_SYSTEM_ECCENTRICALLY_BRACED_FRAMES &&
        this.addon.settings_csa.property_seismic_member_type === member_seismic_config_steel_design_csas16.E_SEISMIC_MEMBER_TYPE_LINK,
        "Incorrectly entered combination of Seismic force-resisting system, Seismic force-resisting type and Seismic member type");
    if (typeof property_roof_level === "undefined") {
        property_roof_level = true;
    }
    this.addon.settings_csa.property_roof_level = property_roof_level;
};

/**
 * Sets Link and Connection type
 * @param {String} link_type        Link type (AS_SEGMENT_OF_BEAM, MODULAR), can be undefined (is not set, AS_SEGMENT_OF_BEAM as default)
 * @param {String} connection_type  Connection type (END_PLATE, WEB), can be undefined (is not set, END_PLATE as default)
 */
SteelDesignSeismicConfigurationCSA.prototype.SetLinkType = function (link_type,
    connection_type) {
    ASSERT(this.addon.settings_csa.property_seismic_member_type === member_seismic_config_steel_design_csas16.E_SEISMIC_MEMBER_TYPE_LINK, "Seismic member type must be of Link beam type");
    SetSteelDesignSeismicConfigurationLinkType(this.addon.settings_csa, link_type);
    if (typeof connection_type !== "undefined") {
        ASSERT(this.addon.settings_csa.property_modular_link, "Link type must be of Modular link type");
        SetSteelDesignSeismicConfigurationConnectionType(this.addon.settings_csa, connection_type);
    }
};

function SetSteelDesignSeismicConfigurationBracedBayType (addon_settings,
    braced_bay_direction) {
    const braced_bay_directions = [
        "XU",
        "YV"
    ];
	if (braced_bay_direction !== undefined) {
	  if (braced_bay_directions.indexOf(braced_bay_direction) === -1)
      {
        console.log("Wrong braced bay direction type. Value was: " + braced_bay_direction);
		console.log("Correct values are: " + braced_bay_directions);
		return;
      }
	}
	else {
        braced_bay_direction = "YV";
	}
    switch (braced_bay_direction) {
        case "XU":
            addon_settings.property_braced_bay_in_direction_xu = true;
            break;
        case "YV":
            addon_settings.property_braced_bay_in_direction_yv = true;
            break;
        default:
            ASSERT(false, "SetSteelDesignSeismicConfigurationBracedBayType: unknown crack state detection type");
    }
}

function SetSteelDesignSeismicConfigurationLinkType (addon_settings,
    link_type) {
    const link_types = [
        "AS_SEGMENT_OF_BEAM",
        "MODULAR"
    ];
	if (link_type !== undefined) {
	  if (link_types.indexOf(link_type) === -1)
      {
        console.log("Wrong link type. Value was: " + link_type);
		console.log("Correct values are: " + link_types);
		return;
      }
	}
	else {
        link_type = "AS_SEGMENT_OF_BEAM";
	}
    switch (link_type) {
        case "AS_SEGMENT_OF_BEAM":
            addon_settings.property_link_is_a_segment_of_beam = true;
            break;
        case "MODULAR":
            addon_settings.property_modular_link = true;
            break;
        default:
            ASSERT(false, "SetSteelDesignSeismicConfigurationLinkType: unknown crack state detection type");
    }
}

function SetSteelDesignSeismicConfigurationConnectionType (addon_settings,
    connection_type) {
    const connection_types = [
        "END_PLATE",
        "WEB"
    ];
	if (connection_type !== undefined) {
	  if (connection_types.indexOf(connection_type) === -1)
      {
        console.log("Wrong connection type. Value was: " + connection_type);
		console.log("Correct values are: " + connection_types);
		return;
      }
	}
	else {
        connection_type = "END_PLATE";
	}
    switch (connection_type) {
        case "END_PLATE":
            addon_settings.property_end_plate_connected_link = true;
            break;
        case "WEB":
            addon_settings.property_web_connected_link = true;
            break;
        default:
            ASSERT(false, "SetSteelDesignSeismicConfigurationConnectionType: unknown crack state detection type");
    }
}