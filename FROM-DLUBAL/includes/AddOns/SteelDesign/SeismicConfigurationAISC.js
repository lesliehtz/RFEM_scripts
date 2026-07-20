include("../../Tools/high_level_functions_support.js");

/**
 * Creates Steel Design Seismic Configuration
 * @param {Number} no               Seismic Configuration index, can be undefined
 * @param {Array} members_no        List of members assigned, can be undefined
 * @param {Array} member_sets_no    List of member sets assigned, can be undefined
 * @param {String} comment          Comment, can be undefined
 * @param {Object} params           Additional parameters, can be undefined
 */
function SteelDesignSeismicConfigurationAISC(no,
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
SteelDesignSeismicConfigurationAISC.prototype.GetNo = function () {
    return this.addon.no;
};

/**
 * @returns Seismic Configuration object
 */
SteelDesignSeismicConfigurationAISC.prototype.GetSeismicConfiguration = function () {
    return this.addon;
};

/**
 * Sets Name
 * @param {String} name     Seismic Configuration name, can be undefined
 */
SteelDesignSeismicConfigurationAISC.prototype.SetName = function (name) {
    ASSERT(typeof name !== "undefined", "Name must be specified");
    this.addon.name = name;
};

/**
 * Sets General design parameters
 * @param {String} property_seismic_force_resisting_system      Seismic force-resisting system (ORDINARY_MOMENT, INTERMEDIATE_MOMENT, SPECIAL_MOMENT, ORDINARY_CONCENTRICALLY_BRACED, SPECIAL_CONCENTRICALLY_BRACED), can be undefined (is not set, ORDINARY_MOMENT as default)
 * @param {String} property_seismic_member_type                 Seismic member type (BEAM, COLUMN, BRACE, STRUT), can be undefined (is not set, BEAm as default)
 */
SteelDesignSeismicConfigurationAISC.prototype.SetGeneral = function (property_seismic_force_resisting_system,
    property_seismic_member_type) {
    this.addon.settings_aisc.property_seismic_force_resisting_system = EnumValueFromJSHLFTypeName(
        property_seismic_force_resisting_system,
        "seismic force resisting system",
        {
            "ORDINARY_MOMENT": member_seismic_config_steel_design_aisc.E_SEISMIC_FORCE_RESISTING_SYSTEM_TYPE_ORDINARY_MOMENT,
            "INTERMEDIATE_MOMENT": member_seismic_config_steel_design_aisc.E_SEISMIC_FORCE_RESISTING_SYSTEM_TYPE_INTERMEDIATE_MOMENT,
            "SPECIAL_MOMENT": member_seismic_config_steel_design_aisc.E_SEISMIC_FORCE_RESISTING_SYSTEM_TYPE_SPECIAL_MOMENT,
            "ORDINARY_CONCENTRICALLY_BRACED": member_seismic_config_steel_design_aisc.E_SEISMIC_FORCE_RESISTING_SYSTEM_TYPE_ORDINARY_CONCENTRICALLY_BRACED,
            "SPECIAL_CONCENTRICALLY_BRACED": member_seismic_config_steel_design_aisc.E_SEISMIC_FORCE_RESISTING_SYSTEM_TYPE_SPECIAL_CONCENTRICALLY_BRACED
        },
        member_seismic_config_steel_design_aisc.E_SEISMIC_FORCE_RESISTING_SYSTEM_TYPE_ORDINARY_MOMENT);
    if (typeof property_seismic_member_type !== "undefined") {
        switch (this.addon.settings_aisc.property_seismic_force_resisting_system) {
            case member_seismic_config_steel_design_aisc.E_SEISMIC_FORCE_RESISTING_SYSTEM_TYPE_ORDINARY_MOMENT:
            case member_seismic_config_steel_design_aisc.E_SEISMIC_FORCE_RESISTING_SYSTEM_TYPE_INTERMEDIATE_MOMENT:
            case member_seismic_config_steel_design_aisc.E_SEISMIC_FORCE_RESISTING_SYSTEM_TYPE_SPECIAL_MOMENT:
                this.addon.settings_aisc.property_seismic_member_type = EnumValueFromJSHLFTypeName(
                    property_seismic_member_type,
                    "seismic member",
                    {
                        "BEAM": member_seismic_config_steel_design_aisc.E_SEISMIC_MEMBER_TYPE_BEAM,
                        "COLUMN": member_seismic_config_steel_design_aisc.E_SEISMIC_MEMBER_TYPE_COLUMN
                    },
                    member_seismic_config_steel_design_aisc.E_SEISMIC_MEMBER_TYPE_BEAM);
                break;
            case member_seismic_config_steel_design_aisc.E_SEISMIC_FORCE_RESISTING_SYSTEM_TYPE_ORDINARY_CONCENTRICALLY_BRACED:
            case member_seismic_config_steel_design_aisc.E_SEISMIC_FORCE_RESISTING_SYSTEM_TYPE_SPECIAL_CONCENTRICALLY_BRACED:
                this.addon.settings_aisc.property_seismic_member_type = EnumValueFromJSHLFTypeName(
                    property_seismic_member_type,
                    "seismic member",
                    {
                        "BEAM": member_seismic_config_steel_design_aisc.E_SEISMIC_MEMBER_TYPE_BEAM,
                        "COLUMN": member_seismic_config_steel_design_aisc.E_SEISMIC_MEMBER_TYPE_COLUMN,
                        "BRACE": member_seismic_config_steel_design_aisc.E_SEISMIC_MEMBER_TYPE_BRACE,
                        "STRUT": member_seismic_config_steel_design_aisc.E_SEISMIC_MEMBER_TYPE_STRUT
                    },
                    member_seismic_config_steel_design_aisc.E_SEISMIC_MEMBER_TYPE_BEAM);
                break;
            default:
                ASSERT(false, "Unknown seismic force resisting system");
        }
    }
};

/**
 * Sets Include overstrength seismic load
 * @param {Boolean} property_overstrength_required  Include overstrength seismic load, can be undefined (true as default)
 */
SteelDesignSeismicConfigurationAISC.prototype.SetIncludeOverstrengthSeismicLoad = function (property_overstrength_required) {
    ASSERT(this.addon.settings_aisc.property_seismic_member_type === member_seismic_config_steel_design_aisc.E_SEISMIC_MEMBER_TYPE_BEAM &&
        this.addon.settings_aisc.property_seismic_force_resisting_system !== member_seismic_config_steel_design_aisc.E_SEISMIC_FORCE_RESISTING_SYSTEM_TYPE_ORDINARY_CONCENTRICALLY_BRACED ||
        this.addon.settings_aisc.property_seismic_member_type === member_seismic_config_steel_design_aisc.E_SEISMIC_MEMBER_TYPE_BRACE,
        "Incorrectly entered combination of Seismic force-resisting system and Seismic member type");
    if (typeof property_overstrength_required === "undefined") {
        property_overstrength_required = true;
    }
    this.addon.settings_aisc.property_overstrength_required = property_overstrength_required;
};

/**
 * Sets Overstrength only for axial force
 * @param {Boolean} property_overstrength_only_for_axial_force  All bending moments, shear forces and torsional moment are neglected acc. to D1.4a(b), can be undefined (true as default)
 */
SteelDesignSeismicConfigurationAISC.prototype.SetOverstrengthOnlyForAxialForce = function (property_overstrength_only_for_axial_force) {
    ASSERT(this.addon.settings_aisc.property_seismic_member_type === member_seismic_config_steel_design_aisc.E_SEISMIC_MEMBER_TYPE_COLUMN, "Seismic member type must be of COLUMN type");
    if (typeof property_overstrength_only_for_axial_force === "undefined") {
        property_overstrength_only_for_axial_force = true;
    }
    this.addon.settings_aisc.property_overstrength_only_for_axial_force = property_overstrength_only_for_axial_force;
};

/**
 * Sets Check stability bracing of beam
 * @param {Boolean} property_stability_bracing_for_scbf     Check stability bracing of beam for V or inverted-V frames acc. to 341-16, F2.4b(b), can be undefined (true as default)
 */
SteelDesignSeismicConfigurationAISC.prototype.SetCheckStabilityBracing = function (property_stability_bracing_for_scbf) {
    ASSERT(this.addon.settings_aisc.property_seismic_force_resisting_system === member_seismic_config_steel_design_aisc.E_SEISMIC_FORCE_RESISTING_SYSTEM_TYPE_SPECIAL_CONCENTRICALLY_BRACED &&
        this.addon.settings_aisc.property_seismic_member_type === member_seismic_config_steel_design_aisc.E_SEISMIC_MEMBER_TYPE_BEAM,
        "Incorrectly entered combination of Seismic force-resisting system and Seismic member type");
    if (typeof property_stability_bracing_for_scbf === "undefined") {
        property_stability_bracing_for_scbf = true;
    }
    this.addon.settings_aisc.property_stability_bracing_for_scbf = property_stability_bracing_for_scbf;
};

/**
 * Sets Beam parameters
 * @param {Number} property_distance_s_h    Distance from face of column to plastic hinge, can be undefined (is not set, 0.0 m as default)
 * @param {Number} property_column_depth    Depth of column, can be undefined (is not set, 0.0 mm as default)
 */
SteelDesignSeismicConfigurationAISC.prototype.SetBeamParameters = function (property_distance_s_h,
    property_column_depth) {
    const seismic_force_resisting_member_types = [member_seismic_config_steel_design_aisc.E_SEISMIC_FORCE_RESISTING_SYSTEM_TYPE_ORDINARY_MOMENT,
        member_seismic_config_steel_design_aisc.E_SEISMIC_FORCE_RESISTING_SYSTEM_TYPE_INTERMEDIATE_MOMENT, member_seismic_config_steel_design_aisc.E_SEISMIC_FORCE_RESISTING_SYSTEM_TYPE_SPECIAL_MOMENT];
    ASSERT(this.addon.settings_aisc.property_seismic_member_type === member_seismic_config_steel_design_aisc.E_SEISMIC_MEMBER_TYPE_BEAM &&
        seismic_force_resisting_member_types.indexOf(this.addon.settings_aisc.property_seismic_force_resisting_system) !== -1,
        "Seismic force-resisting system type must be one of " + seismic_force_resisting_member_types + " type and Seismic member type must be of BEAM type");
    if (typeof property_distance_s_h !== "undefined") {
        this.addon.settings_aisc.property_distance_s_h = property_distance_s_h;
    }
    if (typeof property_column_depth !== "undefined") {
        this.addon.settings_aisc.property_column_depth = property_column_depth;
    }
};

/**
 * Sets Check slenderness
 * @param {Boolean} property_slenderness_check_60   Check slenderness acc. to 341-16, E3.4c.2(b), can be undefined (true as default)
 */
SteelDesignSeismicConfigurationAISC.prototype.SetCheckSlenderness60 = function (property_slenderness_check_60) {
    ASSERT(this.addon.settings_aisc.property_seismic_force_resisting_system === member_seismic_config_steel_design_aisc.E_SEISMIC_FORCE_RESISTING_SYSTEM_TYPE_SPECIAL_MOMENT &&
        this.addon.settings_aisc.property_seismic_member_type === member_seismic_config_steel_design_aisc.E_SEISMIC_MEMBER_TYPE_COLUMN,
        "Seismic force-resisting system must be of SPECIAL_MOMENT type and Seismic member type must be of COLUMN type");
    if (typeof property_slenderness_check_60 === "undefined") {
        property_slenderness_check_60 = true;
    }
    this.addon.settings_aisc.property_slenderness_check_60 = property_slenderness_check_60;
};

/**
 * Sets Check slenderness
 * @param {Boolean} property_slenderness_check_4_sqrt_e_fy      Check slenderness of V or inverted-V brace acc. to 341-16, Eq. F1-1, can be undefined (true as default)
 */
SteelDesignSeismicConfigurationAISC.prototype.SetCheckSlenderness = function (property_slenderness_check_4_sqrt_e_fy) {
    ASSERT(this.addon.settings_aisc.property_seismic_force_resisting_system === member_seismic_config_steel_design_aisc.E_SEISMIC_FORCE_RESISTING_SYSTEM_TYPE_ORDINARY_CONCENTRICALLY_BRACED &&
        this.addon.settings_aisc.property_seismic_member_type === member_seismic_config_steel_design_aisc.E_SEISMIC_MEMBER_TYPE_BRACE,
        "Seismic force-resisting system must be of ORDINARY_CONCENTRICALLY_BRACED type and Seismic member type must be of BRACE type");
    if (typeof property_slenderness_check_4_sqrt_e_fy === "undefined") {
        property_slenderness_check_4_sqrt_e_fy = true;
    }
    this.addon.settings_aisc.property_slenderness_check_4_sqrt_e_fy = property_slenderness_check_4_sqrt_e_fy;
};