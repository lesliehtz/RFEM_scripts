/*
EN Ultimate configuration is for both standards, both EN and NTC one
SetConcreteDesignMinimumConcreteCover cannot be set?
SetConcreteDesignMinimumConcreteCoverOnEachSide cannot be set?
*/

include("../../includes/Tools/high_level_functions_support.js");
include("../../includes/AddOns/ConcreteDesign/ConcreteDesignSupport.js");
/*********************************************************************************************
****************************************** Main **********************************************
*********************************************************************************************/
run("../includes/Tools/clearAll.js");

var material = new Material(undefined, "C12/15");
var section = new Section(undefined, "R_M1 0.5/1.0", material.GetNo());
if (RFEM) {
    var thickness = new Thickness();
    thickness.Uniform(1, "Uniform thickness", material.GetNo(), 0.250);
}
var memberList = [];
var surfaceList = [];

var nodeForMembers = createNodesGrid(-28, -28, [10, 4], [3, 2]);
for (var i = 0; i < nodeForMembers.length; i+=2) {
    var member = new Member();
    memberList.push(member);
    member.Beam(undefined, [i + 1, i + 2], section.GetNo());
}

var nodesForSurfaces = createNodesGrid(-28, -18, [10, 6], [3, 2]);
if (RFEM) {
    surface_dict = createSurfacesFromNodesGrid(nodesForSurfaces, [5, 3], surfaces.TYPE_STANDARD, thickness.GetNo());
    for (var key in surface_dict) {
        surfaceList.push(surface_dict[key][0]);
    }
}

var t1 = new Date().getTime();

if (standard_index === undefined) {
    standard_index = 0; // EN standard
}

var concrete_design_standards = {
    0: general.NATIONAL_ANNEX_AND_EDITION_EN_1992_CEN_2014_11,
    1: general.NATIONAL_ANNEX_AND_EDITION_ACI_318_2019_CONCRETE_DESIGN,
    2: general.NATIONAL_ANNEX_AND_EDITION_CSA_A23_3_2019,
    3: general.NATIONAL_ANNEX_AND_EDITION_SP_63_13330_2018_12
};

if (PRERELEASE_MODE) {
    concrete_design_standards[4] = general.NATIONAL_ANNEX_AND_EDITION_NTC_2018_01_CONCRETE_DESIGN;
}
else if (standard_index === 4) {
    ASSERT(false, "Only for pre-release mode");
}

if (standard_index >= Object.keys(concrete_design_standards).length) {
    console.log("start_index must be from range 0-" + (Object.keys(concrete_design_standards).length - 1).toString());
}

CONCRETE_DESIGN.setActive(true);
general.current_standard_for_concrete_design = concrete_design_standards[standard_index];

if (RFEM) {
    nodes[31].punching_design = true;
    nodes[32].punching_design = true;
    nodes[33].punching_design = true;
    nodes[34].punching_design = true;
}

var note = engine.create_note(undefined);
note.point_coordinates = $V(-16, -1, 0);
note.text = "Concrete design addon, code of standard: " + GetConcreteDesignCurrentCodeOfStandard();

switch (general.current_standard_for_concrete_design)
{
    case general.NATIONAL_ANNEX_AND_EDITION_EN_1992_CEN_2014_11:
    case general.NATIONAL_ANNEX_AND_EDITION_NTC_2018_01_CONCRETE_DESIGN:
    /****************************************************************** Ultimate configuration ***************************************************************************/
        /*
        EN Ultimate configuration is for both standards, both EN and NTC one
        */
        if (RFEM) {
            var ultimateConfiguration = new ConcreteDesignUltimateConfigurationEN(undefined, [surfaceList[0].no], [memberList[0].GetNo()], [nodes[31].no, nodes[32].no], "Ultimate configuration (" + GetConcreteDesignCurrentCodeOfStandard() + ")");
        }
        else {
            var ultimateConfiguration = new ConcreteDesignUltimateConfigurationEN(undefined, undefined, [memberList[0].GetNo()], undefined, "Ultimate configuration (" + GetConcreteDesignCurrentCodeOfStandard() + ")");
        }
        ultimateConfiguration.SetName("Ultimate conf");
        ultimateConfiguration.SetMembers_ConsiderInternalForces(false, undefined, true, false, false, false);
        ultimateConfiguration.SetMembers_ReductionsOfInternalForcesInZ(true, true, false, true, true);
        ultimateConfiguration.SetMembers_RequiredLongitudinalReinforcement("UNIFORMLY_SURROUNDING", 0.01, true, 0.99, false);
        ultimateConfiguration.SetMembers_DetailingAndParticularRules(false, undefined, undefined, 0.0010, 0.0020, 0.0030, true, 0.05, undefined, true, "MAXIMUM_STIRRUP_SPACING_PROVIDED", false, false);
        ultimateConfiguration.SetMembers_RequiredShearReinforcement("AUTOMATICALLY");
        ultimateConfiguration.SetMembers_ShearJoint(undefined, "GENERAL_INTEGRATION_OF_AXIAL_STRESSES", true, 55000, true);
        ultimateConfiguration.SetMembers_NeutralAxisDepthLimitation(true, 0.55);
        ultimateConfiguration.SetMembers_CalculationSetting();
        if (PRERELEASE_MODE) {
            ultimateConfiguration.SetMembers_FiberConcrete("BENDING_AND_SHEAR_DESIGN", "SDL3", false);
        }
        ultimateConfiguration.SetStability_SlendernessAboutY(true, 0.8, true, 1.2, true, 0.9);
        ultimateConfiguration.SetStability_SlendernessAboutZ(true, 0.8, true, 1.2, true, 0.9);
        ultimateConfiguration.SetStability_LoadDistribution(false, 3);
        ultimateConfiguration.SetStability_BiaxialBending(true, true);
        ultimateConfiguration.SetStability_Curvature("USER_DEFINED", 0.9);
        ultimateConfiguration.SetStability_RequiredReinforcement("UNIFORMLY_SURROUNDING", 0.005);
        if (RFEM) {
            ultimateConfiguration.SetSurfaces_DesignMethod("NO");
            ultimateConfiguration.SetSurfaces_InternalForcesDiagramUsedForDesign(false);
            ultimateConfiguration.SetSurfaces_MinimumLongitudinalReinforcement(undefined, "PLATES", "DEFINED", [false, undefined, false]);
            ultimateConfiguration.SetSurfaces_UserDefinedMinimumLongitudinalReinforcementPercentage(true, 0.1, 0.11, 0.12, 0.13);
            ultimateConfiguration.SetSurfaces_MaximumLongitudinalReinforcement(true, "WALLS");
            ultimateConfiguration.SetSurfaces_UserDefinedMaximumLongitudinalReinforcementPercentage(true, 0.05);
            ultimateConfiguration.SetSurfaces_MinimumShearReinforcement(false);
            ultimateConfiguration.SetSurfaces_UserDefinedMinimumShearReinforcementPercentage(true, 0.01);
            ultimateConfiguration.SetSurfaces_RequiredLongitudinalReinforcement();
            ultimateConfiguration.SetSurfaces_RequiredShearReinforcement("PROVIDED");
            ultimateConfiguration.SetSurfaces_NeutralAxisDepthLimitation(true, 0.55);
            ultimateConfiguration.SetSurfaces_FiberConcrete("SDL2");
            ultimateConfiguration.SetPunching_StructuralElement("SLAB");
            if (PRERELEASE_MODE) {
                ultimateConfiguration.SetPunching_PunchingLoadForColumns("USER_DEFINED", 110E3, "PLUS_Z", true, true, 12E3);
                ultimateConfiguration.SetPunching_PunchingLoadForWalls("UNSMOOTHED_SHEAR_FORCE", true, true, 13E3);
            }
            ultimateConfiguration.SetPunching_DeductibleSurfaceLoadForSlab(true, "USER_DEFINED", undefined, 12E3, "K_D", 2);
            ultimateConfiguration.SetPunching_FactorBeta("USER_DEFINITION", 2);
            ultimateConfiguration.SetPunching_LoadedAreaOfPunchingNode(true, "RECTANGULAR", [0.401, 0.402, Math.PI / 10], true, 0.241, 0.201);
            ultimateConfiguration.SetPunching_BasicControlPerimeter(true, 0.3);
            ultimateConfiguration.SetPunching_MeanEffectiveDepth(true, 0.501, true, 0.021, 0.022);
            if (PRERELEASE_MODE) {
                ultimateConfiguration.SetPunching_PunchingShearReinforcement(0.101, true, true, 3, true, 0.305, 0.302, true, 2.001);
                ultimateConfiguration.SetPunching_AdditionalParameters(0.005, "SELECTED", 2);
                ultimateConfiguration.SetPunching_AxialForceDefinition(15E3);
            }
            ultimateConfiguration.SetPunching_RequiredPunchingReinforcement_PunchingShareCapacity("PROVIDED");
            ultimateConfiguration.SetPunching_MinimumReinforcement(false);
        }
        // Bug? Moved from top, because when line bellows are before line "ultimateConfiguration.SetStability_Curvature("USER_DEFINED", 0.9);", curvature cannot be set??
        if (RFEM) {
            var ultimateConfiguration2 = new ConcreteDesignUltimateConfigurationEN(undefined, [surfaceList[1].no], [memberList[1].GetNo()], [nodes[33].no, nodes[34].no], "Ultimate configuration (" + GetConcreteDesignCurrentCodeOfStandard() + ")");
        }
        else {
            var ultimateConfiguration2 = new ConcreteDesignUltimateConfigurationEN(undefined, undefined, [memberList[1].GetNo()], undefined, "Ultimate configuration (" + GetConcreteDesignCurrentCodeOfStandard() + ")");
        }
        ultimateConfiguration2.SetName("Ultimate conf");
    /****************************************************************** Serviceability configuration ***********************************************************************/
        if (RFEM) {
            var serviceabilityConfiguration = new ConcreteDesignServiceabilityConfigurationEN(undefined, [surfaceList[1].no], [memberList[1].GetNo()], "Serviceability configuration (" + GetConcreteDesignCurrentCodeOfStandard() + ")");
            var serviceabilityConfiguration2 = new ConcreteDesignServiceabilityConfigurationEN(undefined, [surfaceList[2].no], [memberList[2].GetNo()], "Serviceability configuration (" + GetConcreteDesignCurrentCodeOfStandard() + ")");
        }
        else {
            var serviceabilityConfiguration = new ConcreteDesignServiceabilityConfigurationEN(undefined, undefined, [memberList[1].GetNo()], "Serviceability configuration (" + GetConcreteDesignCurrentCodeOfStandard() + ")");
            var serviceabilityConfiguration2 = new ConcreteDesignServiceabilityConfigurationEN(undefined, undefined, [memberList[2].GetNo()], "Serviceability configuration (" + GetConcreteDesignCurrentCodeOfStandard() + ")");
        }
        serviceabilityConfiguration.SetName("Serviceability conf");
        serviceabilityConfiguration2.SetName("Serviceability conf");
        serviceabilityConfiguration.SetStressAnaLysis(true, false);
        serviceabilityConfiguration.SetCrackAnalysisLimitValues(true, "02_EXPOSURE_CLASS_FROM_XC2_TO_XC4_STRUCTURAL_ELEMENT_PRESTRESSING", "03_EXPOSURE_CLASS_FROM_XS1_TO_XS3_STRUCTURAL_ELEMENT_REINFORCEMENT_CONCRETE_UNBONDED_PRESTRESSING");
        serviceabilityConfiguration.SetDesignWithoutDirectCrackWidthCalculation(false, false);
        serviceabilityConfiguration.SetCrackAnalysisOther(0.99, true);
        if (RFEM) {
            serviceabilityConfiguration.SetEffectsDueToRestraint(true, "APPROACH_BENDING_RESTRAINT", "AREA_TOP_BOTTOM", false, false, false, true, true, 0.98);
        }
        else {
            serviceabilityConfiguration.SetEffectsDueToRestraint(true, "APPROACH_BENDING_RESTRAINT", "AREA_TOP_BOTTOM", undefined, undefined, undefined, undefined, true, 0.98);
        }
        serviceabilityConfiguration.SetDeflectionAnalysis(true, 251, 252, false, true, 0.501);
        serviceabilityConfiguration.SetCrackStateDetection("INDEPENDENT_OF_LOAD");
        if (PRERELEASE_MODE) {
            serviceabilityConfiguration.SetFiberConcrete("SDL2", false);
        }
        break;
    case general.NATIONAL_ANNEX_AND_EDITION_ACI_318_2019_CONCRETE_DESIGN:
        /****************************************************************** Strength configuration ***************************************************************************/
        if (RFEM) {
            var strengthConfiguration = new ConcreteDesignStrengthConfigurationACI(undefined, [surfaceList[0].no], [memberList[0].GetNo()], [nodes[31].no, nodes[32].no], "Strength configuration (" + GetConcreteDesignCurrentCodeOfStandard() + ")");
            var strengthConfiguration2 = new ConcreteDesignStrengthConfigurationACI(undefined, [surfaceList[1].no], [memberList[1].GetNo()], [nodes[33].no, nodes[34].no], "Strength configuration (" + GetConcreteDesignCurrentCodeOfStandard() + ")");
        }
        else {
            var strengthConfiguration = new ConcreteDesignStrengthConfigurationACI(undefined, undefined, [memberList[0].GetNo()], undefined, "Strength configuration (" + GetConcreteDesignCurrentCodeOfStandard() + ")");
            var strengthConfiguration2 = new ConcreteDesignStrengthConfigurationACI(undefined, undefined, [memberList[1].GetNo()], undefined, "Strength configuration (" + GetConcreteDesignCurrentCodeOfStandard() + ")");
        }
        strengthConfiguration.SetName("Strength conf");
        strengthConfiguration2.SetName("Strength conf");
        strengthConfiguration.SetMembers_ConsiderInternalForces(false, undefined, true, false, false, false);
        strengthConfiguration.SetMembers_InternalForceReductionZ(true, false);
        strengthConfiguration.SetMembers_RequiredLongitudinalReinforcement("IN_CORNERS_SYMMETRICAL_DISTRIBUTION", 0.05, false);
        if (PRERELEASE_MODE) {
            strengthConfiguration.SetMembers_ProvidedLongitudinalReinforcement(false, true, true);
        }
        strengthConfiguration.SetMembers_Factors(0.75, 0.95, 0.85);
        strengthConfiguration.SetMembers_MinimumReinforcement(false, false, false);
        strengthConfiguration.SetMembers_RequiredShearReinforcement("PROVIDED");
        strengthConfiguration.SetMembers_TorsionCapacity("TORSION_COMPATIBILITY");
        strengthConfiguration.SetMembers_ShearAndTorsionReinforcement("EQUATION_B", 0.8);
        strengthConfiguration.SetMembers_NeutralAxisDepthLimitation(true, 0.7);
        strengthConfiguration.SetMembers_CalculationSetting();
        strengthConfiguration.SetMembers_EpoxyFactor("EPOXY_COATED_OR_ZINC");
        strengthConfiguration.SetStability_UnbracedColumn(0.06, 0.07);
        strengthConfiguration.SetStability_StiffnessReductionCoefficientToConsiderCreep("CALCULATED", 0.15, 0.25);
        strengthConfiguration.SetStability_MomentMagnification("P_METHOD");
        strengthConfiguration.SetStability_RequiredReinforcement("UNIFORMLY_SURROUNDING", 0.015);
        if (RFEM) {
            strengthConfiguration.SetSurfaces_DesignMethod("YES");
            strengthConfiguration.SetSurfaces_InternalForcesDiagramUsedForDesign(false);
            strengthConfiguration.SetSurfaces_Factors(0.75, 0.95, 0.85);
            strengthConfiguration.SetSurfaces_MinimumLongitudinalReinforcement(undefined, "WALLS", undefined, undefined, "DEFINED_IN_REINFORCEMENT_DIRECTION", "PHI_2", 2.6);
            strengthConfiguration.SetSurfaces_UserDefinedMinimumLongitudinalReinforcementPercentage(true, 0.1, 0.11, 0.12, 0.13);
            strengthConfiguration.SetSurfaces_UserDefinedMaximumLongitudinalReinforcementPercentage(true, 0.15);
            strengthConfiguration.SetSurfaces_MinimumShearReinforcement(false);
            strengthConfiguration.SetSurfaces_UserDefinedMinimumShearReinforcementPercentage(true, 0.15);
            strengthConfiguration.SetSurfaces_RequiredShearReinforcement("PROVIDED");
            strengthConfiguration.SetSurfaces_ShearAndTorsionReinforcement("MAX_OF_A_B", Math.PI / 5);
            strengthConfiguration.SetSurfaces_NeutralAxisDepthLimitation(true, 0.795);
            if (PRERELEASE_MODE) {
                strengthConfiguration.SetPunching_PunchingLoad(110E3, "SMOOTHED_SHEAR_FORCE", undefined, 5);
            }
            strengthConfiguration.SetPunching_AdditionalParameters(0.2);
            strengthConfiguration.SetPunching_Factors(1.0, 0.85);
        }
    /****************************************************************** Serviceability configuration ***********************************************************************/
        if (RFEM) {
            var serviceabilityConfiguration = new ConcreteDesignServiceabilityConfigurationACI(undefined, [surfaceList[1].no], [memberList[1].GetNo()], "Serviceability configuration (" + GetConcreteDesignCurrentCodeOfStandard() + ")");
            var serviceabilityConfiguration2 = new ConcreteDesignServiceabilityConfigurationACI(undefined, [surfaceList[1].no], [memberList[1].GetNo()], "Serviceability configuration (" + GetConcreteDesignCurrentCodeOfStandard() + ")");
        }
        else {
            var serviceabilityConfiguration = new ConcreteDesignServiceabilityConfigurationACI(undefined, undefined, [memberList[1].GetNo()], "Serviceability configuration (" + GetConcreteDesignCurrentCodeOfStandard() + ")");
            var serviceabilityConfiguration2 = new ConcreteDesignServiceabilityConfigurationACI(undefined, undefined, [memberList[1].GetNo()], "Serviceability configuration (" + GetConcreteDesignCurrentCodeOfStandard() + ")");
        }
        serviceabilityConfiguration.SetName("Serviceability conf");
        serviceabilityConfiguration2.SetName("Serviceability conf");
        serviceabilityConfiguration.SetCrackAnalysis(true, false, true, true, "01_USE_IN_WATER_RETAINING_STRUCTURES", "04_DRY_AIR_OR_PROTECTIVE_MEMBRANE", undefined, undefined, undefined, true, false, false, false, false);
        serviceabilityConfiguration.SetDeflectionAnalysis(true, 241, 242, false, true, 0.501, undefined, undefined, 137788000); // 52 months in seconds
        serviceabilityConfiguration.SetCrackStateDetection("INDEPENDENT_OF_LOAD");
        break;
    case general.NATIONAL_ANNEX_AND_EDITION_CSA_A23_3_2019:
    /****************************************************************** Ultimate configuration ***************************************************************************/
        if (RFEM) {
            var ultimateConfiguration = new ConcreteDesignUltimateConfigurationCSA(undefined, [surfaceList[0].no], [memberList[0].GetNo()], [nodes[31].no, nodes[32].no], "Ultimate configuration (" + GetConcreteDesignCurrentCodeOfStandard() + ")");
        }
        else {
            var ultimateConfiguration = new ConcreteDesignUltimateConfigurationCSA(undefined, undefined, [memberList[0].GetNo()], undefined, "Ultimate configuration (" + GetConcreteDesignCurrentCodeOfStandard() + ")");
        }
        ultimateConfiguration.SetName("Ultimate conf");
        ultimateConfiguration.SetMembers_ConsiderInternalForces(undefined, undefined, undefined, undefined, false, false);
        ultimateConfiguration.SetMembers_InternalForceReductionZ(true, true, false);
        ultimateConfiguration.SetMembers_RequiredLongitudinalReinforcement("TOP_BOTTOM_OPTIMIZED_DISTRIBUTION", 0.06, false);
        ultimateConfiguration.SetMembers_Factors(0.75, 0.95, 0.96);
        ultimateConfiguration.SetMembers_MinimumReinforcement(false, undefined, false);
        ultimateConfiguration.SetMembers_RequiredShearReinforcement("REQUIRED");
        ultimateConfiguration.SetMembers_ShearAndTorsionReinforcement("SPECIAL_MEMBERS", 0.5, Math.PI / 4);
        ultimateConfiguration.SetMembers_NeutralAxisDepthLimitation(true, "AUTOMATICALLY");
        ultimateConfiguration.SetMembers_CalculationSetting(true);
        ultimateConfiguration.SetMembers_EpoxyFactor("EPOXY_COATED");
        ultimateConfiguration.SetStability_UnbracedColumn(0.09, 0.10);
        ultimateConfiguration.SetStability_RequiredReinforcement("IN_CORNERS_SYMMETRICAL_DISTRIBUTION", 0.035);
        if (RFEM) {
            ultimateConfiguration.SetSurfaces_DesignMethod("YES");
            ultimateConfiguration.SetSurfaces_InternalForcesDiagramUsedForDesign(false);
            ultimateConfiguration.SetSurfaces_Factors(0.75, 0.95, 0.85);
            ultimateConfiguration.SetSurfaces_MinimumLongitudinalReinforcement(true, "PLATES", "DEFINED", [true, false, true, false]);
            ultimateConfiguration.SetSurfaces_UserDefinedMinimumLongitudinalReinforcementPercentage(true, 0.01, 0.02, 0.03, 0.04);
            ultimateConfiguration.SetSurfaces_UserDefinedMaximumLongitudinalReinforcementPercentage(true, 0.15);
            ultimateConfiguration.SetSurfaces_MinimumShearReinforcement(false);
            ultimateConfiguration.SetSurfaces_UserDefinedMinimumShearReinforcementPercentage(true, 0.05);
            ultimateConfiguration.SetSurfaces_RequiredShearReinforcement("PROVIDED");
            ultimateConfiguration.SetSurfaces_ShearReinforcement("SPECIAL_SURFACES", 0.22, Math.PI / 4);
            ultimateConfiguration.SetSurfaces_NeutralAxisDepthLimitation(true, 0.895);
            if (PRERELEASE_MODE) {
                ultimateConfiguration.SetPunching_PunchingLoad(110E3, "SMOOTHED_SHEAR_FORCE", undefined, 5);
            }
            ultimateConfiguration.SetPunching_AdditionalParameters(0.111);
            ultimateConfiguration.SetPunching_Factors(0.651, 0.851);
        }
        // Bug? Moved from top, because when line bellows are before line "ultimateConfiguration.SetSurfaces_ShearReinforcement("SPECIAL_SURFACES", 0.22, Math.PI / 4);", shear reinforcement cannot be set??
        if (RFEM) {
            var ultimateConfiguration2 = new ConcreteDesignUltimateConfigurationCSA(undefined, [surfaceList[1].no], [memberList[1].GetNo()], [nodes[33].no, nodes[34].no], "Ultimate configuration (" + GetConcreteDesignCurrentCodeOfStandard() + ")");
        }
        else {
            var ultimateConfiguration2 = new ConcreteDesignUltimateConfigurationCSA(undefined, undefined, [memberList[1].GetNo()], undefined, "Ultimate configuration (" + GetConcreteDesignCurrentCodeOfStandard() + ")");
        }
        ultimateConfiguration2.SetName("Ultimate conf");
    /****************************************************************** Serviceability configuration ***********************************************************************/
        if (RFEM) {
            var serviceabilityConfiguration = new ConcreteDesignServiceabilityConfigurationCSA(undefined, [surfaceList[1].no], [memberList[1].GetNo()], "Serviceability configuration (" + GetConcreteDesignCurrentCodeOfStandard() + ")");
            var serviceabilityConfiguration2 = new ConcreteDesignServiceabilityConfigurationCSA(undefined, [surfaceList[1].no], [memberList[1].GetNo()], "Serviceability configuration (" + GetConcreteDesignCurrentCodeOfStandard() + ")");
        }
        else {
            var serviceabilityConfiguration = new ConcreteDesignServiceabilityConfigurationCSA(undefined, undefined, [memberList[1].GetNo()], "Serviceability configuration (" + GetConcreteDesignCurrentCodeOfStandard() + ")");
            var serviceabilityConfiguration2 = new ConcreteDesignServiceabilityConfigurationCSA(undefined, undefined, [memberList[1].GetNo()], "Serviceability configuration (" + GetConcreteDesignCurrentCodeOfStandard() + ")");
        }
        serviceabilityConfiguration.SetName("Serviceability conf");
        serviceabilityConfiguration2.SetName("Serviceability conf");
        serviceabilityConfiguration.SetExposure("EXTERIOR", "EXTERIOR", "EXTERIOR", "EXTERIOR", "EXTERIOR", "EXTERIOR");
        serviceabilityConfiguration.SetCrackAnalysis(false);
        serviceabilityConfiguration.SetSkinReinforcement();
        serviceabilityConfiguration.SetDeflectionAnalysis(true, 241, 242, false, true, 0.501, undefined, undefined, 137788000); // 52 months in seconds
        serviceabilityConfiguration.SetCrackStateDetection("DETERMINED_AS_ENVELOPE_FROM_ALL_DESIGN_SITUATIONS");
        break;
    case general.NATIONAL_ANNEX_AND_EDITION_SP_63_13330_2018_12:
    /****************************************************************** Ultimate configuration ***************************************************************************/
        if (RFEM) {
            var ultimateConfiguration = new ConcreteDesignUltimateConfigurationSP(undefined, [surfaceList[0].no], [memberList[0].GetNo()], [nodes[31].no, nodes[32].no], "Ultimate configuration (" + GetConcreteDesignCurrentCodeOfStandard() + ")");
            var ultimateConfiguration2 = new ConcreteDesignUltimateConfigurationSP(undefined, [surfaceList[1].no], [memberList[1].GetNo()], [nodes[33].no, nodes[34].no], "Ultimate configuration (" + GetConcreteDesignCurrentCodeOfStandard() + ")");
        }
        else {
            var ultimateConfiguration = new ConcreteDesignUltimateConfigurationSP(undefined, undefined, [memberList[0].GetNo()], undefined, "Ultimate configuration (" + GetConcreteDesignCurrentCodeOfStandard() + ")");
            var ultimateConfiguration2 = new ConcreteDesignUltimateConfigurationSP(undefined, undefined, [memberList[1].GetNo()], undefined, "Ultimate configuration (" + GetConcreteDesignCurrentCodeOfStandard() + ")");
        }
        ultimateConfiguration.SetName("Ultimate conf");
        ultimateConfiguration2.SetName("Ultimate conf");
        ultimateConfiguration.SetMembers_ConsiderInternalForces(false, false, true, false, false, false);
        ultimateConfiguration.SetMembers_FactorsOfConcreteServiceConditions(true, true, true, true);
        ultimateConfiguration.SetMembers_InternalForceReductionZ(false, true);
        ultimateConfiguration.SetMembers_RequiredLongitudinalReinforcement("IN_CORNERS_SYMMETRICAL_DISTRIBUTION", 0.030);
        ultimateConfiguration.SetMembers_DesignSectionsTypesForShearAndTorsionDesignChecks("NORMAL_SECTION");
        ultimateConfiguration.SetMembers_RequiredReinforcementMomentInInclinedSection("TRANSVERSE", "PROVIDED");
        ultimateConfiguration.SetMembers_MinimumReinforcement(false, false);
        ultimateConfiguration.SetMembers_NeutralAxisDepthLimitation(true, 0.595);
        ultimateConfiguration.SetMembers_CalculationSetting(false);
        ultimateConfiguration.SetStability_Slenderness(201, 202);
        ultimateConfiguration.SetStability_MembersWithRectangularSectionAndLowSlenderness();
        ultimateConfiguration.SetStability_BiaxialBending(true, true, true);
        ultimateConfiguration.SetStability_LoadDirections(0.51, 0.52);
        ultimateConfiguration.SetStability_LongTermLoadComponent(0.53, 0.54);
        ultimateConfiguration.SetStability_RequiredReinforcement("TOP_BOTTOM_SYMMETRICAL_DISTRIBUTION", 0.036);
        if (RFEM) {
            ultimateConfiguration.SetSurfaces_DesignMethod("NO");
            ultimateConfiguration.SetSurfaces_InternalForcesDiagramUsedForDesign(false);
            ultimateConfiguration.SetSurfaces_MinimumLongitudinalReinforcement(true, "PLATES", "DEFINED", [false, false, false, false]);
            ultimateConfiguration.SetSurfaces_UserDefinedMinimumLongitudinalReinforcementPercentage(true, 0.11, 0.12, 0.13, 0.14);
            ultimateConfiguration.SetSurfaces_UserDefinedMaximumLongitudinalReinforcementPercentage(true, 0.06);
            ultimateConfiguration.SetSurfaces_MinimumShearReinforcement(false);
            ultimateConfiguration.SetSurfaces_UserDefinedMinimumShearReinforcementPercentage(true, 0.05);
            ultimateConfiguration.SetSurfaces_NeutralAxisDepthLimitation(true, "AUTOMATICALLY");
            if (PRERELEASE_MODE) {
                ultimateConfiguration.SetPunching_PunchingLoad("SMOOTHED_SHEAR_FORCE", "PLUS_Z", 120E3, "MINUS_Z");
                ultimateConfiguration.SetPunching_AdditionalParameters_Perimeter(true, 0.39, true, 0.49, true, 3, true, 0.31, 0.21, true, 2.01);
                ultimateConfiguration.SetPunching_AdditionalParameters_Thickness(0.02, "SELECTED", 2);
            }
            ultimateConfiguration.SetPunching_NeutralAxisDepthLimitation(true, 0.81);
        }
    /****************************************************************** Serviceability configuration ***********************************************************************/
        if (RFEM) {
            var serviceabilityConfiguration = new ConcreteDesignServiceabilityConfigurationSP(undefined, [surfaceList[1].no], [memberList[1].GetNo()], "Serviceability configuration (" + GetConcreteDesignCurrentCodeOfStandard() + ")");
            var serviceabilityConfiguration2 = new ConcreteDesignServiceabilityConfigurationSP(undefined, [surfaceList[2].no], [memberList[2].GetNo()], "Serviceability configuration (" + GetConcreteDesignCurrentCodeOfStandard() + ")");
        }
        else {
            var serviceabilityConfiguration = new ConcreteDesignServiceabilityConfigurationSP(undefined, undefined, [memberList[1].GetNo()], "Serviceability configuration (" + GetConcreteDesignCurrentCodeOfStandard() + ")");
            var serviceabilityConfiguration2 = new ConcreteDesignServiceabilityConfigurationSP(undefined, undefined, [memberList[2].GetNo()], "Serviceability configuration (" + GetConcreteDesignCurrentCodeOfStandard() + ")");
        }
        serviceabilityConfiguration.SetName("Serviceability conf");
        serviceabilityConfiguration2.SetName("Serviceability conf");
        serviceabilityConfiguration.SetCrackStateDetection("ELASTIC");
        serviceabilityConfiguration.SetCrackWidthAnalysis(0.000201, 0.000202, 0.000203, 0.000204);
        serviceabilityConfiguration.SetDeflectionAnalysis(true, 121, 122, false, undefined, undefined, 0.70);
        break;
    default:
        ASSERT(false, "Unknown code of standard");
}

/********************************************** Types for concrete design - Effective length ********************************************************/
var memberForSetOfMembers = new Member();
memberForSetOfMembers.Beam(undefined, [14, 15], section.GetNo());
var memberSet = new MemberSet();
memberSet.ContinuousMembers(undefined, [memberList[6].GetNo(), memberForSetOfMembers.GetNo(), memberList[7].GetNo()]);

var effectiveLength = new ConcreteDesignEffectiveLength(undefined, [memberList[5].GetNo()], [memberSet.GetNo()], "Concrete design effective length (" + GetConcreteDesignCurrentCodeOfStandard() + ")");
effectiveLength.SetName("Effective length");
effectiveLength.SetDeterminationType(true, true);
if (!IsConcreteDesignCurrentCodeOfStandard("SP")) {
    effectiveLength.SetStructureType("BRACED");
}
else {
    effectiveLength.SetStructureType("COMBINED", "COMBINED");
}
effectiveLength.SetNodalSupportsStartWithSupportType("FIXED_IN_Z");
effectiveLength.SetNodalSupportsEndWithSupportType("FIXED_IN_Y");
effectiveLength.InsertNodalSupportIntermediateNodeWithSupportType("FIXED_IN_Z");
effectiveLength.InsertNodalSupportIntermediateNodeWithSupportType("FIXED_IN_Y");
effectiveLength.InsertNodalSupportIntermediateNodeWithSupportType("FIXED_ALL");
if (!IsConcreteDesignCurrentCodeOfStandard("SP")) {
    effectiveLength.SetOverwriteEffectiveLengths(1, 1.01, 1.02);
    effectiveLength.SetOverwriteEffectiveLengths(2, undefined, 1.02);
    effectiveLength.SetOverwriteEffectiveLengths(3, 1.03);
    effectiveLength.SetOverwriteEffectiveLengths(4, 1.04, 1.05);
}
else {
    effectiveLength.SetOverwriteEffectiveLengths(1, undefined, undefined, 1.12, 1.13, 1.14, 1.15);
    effectiveLength.SetOverwriteEffectiveLengths(2, undefined, undefined, undefined, 1.16, undefined, 1.17);
    effectiveLength.SetOverwriteEffectiveLengths(3, undefined, undefined, 1.18, undefined, 1.19);
    effectiveLength.SetOverwriteEffectiveLengths(4, undefined, undefined, 1.20, 1.21, 1.22, 1.23);
}

var effectiveLength2 = new ConcreteDesignEffectiveLength(undefined, [memberList[6].GetNo(), memberList[7].GetNo()], [memberSet.GetNo()], "Concrete design effective length (" + GetConcreteDesignCurrentCodeOfStandard() + ")");
effectiveLength2.SetName("Effective length");

// For same count of members (all standards)
var memberForSetOfMembers2 = new Member();
memberForSetOfMembers2.Beam(undefined, [18, 19], section.GetNo());

if (IsConcreteDesignCurrentCodeOfStandard("EN") || IsConcreteDesignCurrentCodeOfStandard("NTC")) {
    /********************************************** Types for concrete design - Durabilities ********************************************************/
    var memberSet2 = new MemberSet();
    memberSet2.ContinuousMembers(undefined, [memberList[8].GetNo(), memberForSetOfMembers2.GetNo(), memberList[9].GetNo()]);
    memberSet2.SetName("Member set");

    if (concrete_durabilities.exist(1)) { // Remove default XC1
        concrete_durabilities.erase(1);
    }

    if (RFEM) {
        var concreteDurability = new ConcreteDesignConcreteDurability(1, undefined, [surfaceList[2].no, surfaceList[3].no], undefined, "Concrete design concrete durabilities (" + GetConcreteDesignCurrentCodeOfStandard() + ")")
        var concreteDurability2 = new ConcreteDesignConcreteDurability(2, undefined, [surfaceList[3].no, surfaceList[4].no], undefined, "Concrete design concrete durabilities (" + GetConcreteDesignCurrentCodeOfStandard() + ")")
    }
    else {
        var concreteDurability = new ConcreteDesignConcreteDurability(1, undefined, undefined, undefined, "Concrete design concrete durabilities (" + GetConcreteDesignCurrentCodeOfStandard() + ")")
        var concreteDurability2 = new ConcreteDesignConcreteDurability(2, undefined, undefined, undefined, "Concrete design concrete durabilities (" + GetConcreteDesignCurrentCodeOfStandard() + ")")
    }
    concreteDurability.SetName("Concrete durability");
    concreteDurability2.SetName("Concrete durability");
    concreteDurability.SetNoRiskOfCorrosionOrAttack(undefined, false);
    concreteDurability.SetCorrosionInducedByCarbonation("MODERATE_HUMIDITY");
    concreteDurability.SetCorrosionInducedByChlorides("CYCLIC_WET_AND_DRY");
    concreteDurability.SetCorrosionInducedByChloridesFromSeaWater("SPLASH_AND_SPRAY_ZONES");
    concreteDurability.SetFreezeThawAttack("HIGH_SATURATION_NO_DEICING");
    concreteDurability.SetChemicalAttack("HIGHLY_AGGRESSIVE");
    concreteDurability.SetConcreteCorrosionInducedByWear("HIGH");
    concreteDurability.SetStructuralClassAccordingTo4_4_1_2(true, true, true, true);
    concreteDurability.SetStainlessSteel("STANDARD");
    concreteDurability.SetAdditionalProtection(0.005);
    concreteDurability.SetAllowanceForDeviation("STANDARD", true, "DIRECTLY_AGAINST_SOIL");

    for (var i = 0; i < surfaceList.length; ++i) {
        surfaceList[i].concrete_durability_top = concreteDurability2.GetNo();
        surfaceList[i].concrete_durability_bottom = concreteDurability.GetNo();
    }
}

var reinforcementMaterial = new Material(undefined, "B500B");
var reinforcementSteelMaterial = new Material(undefined, "A240 (transverse reinforcement)");
var reinforcementSteelMaterialSP = new Material(undefined, "A240 (reinforcing steel)");

if (RFEM) {
    /*************************************************** Types for concrete design - Reinforcement direction ****************************************************/
    var reinforcementDirection = new ConcreteDesignReinforcementDirection(undefined, [surfaceList[4].no, surfaceList[5].no], "Concrete design Reinforcement direction (" + GetConcreteDesignCurrentCodeOfStandard() + ")");
    reinforcementDirection.SetName("Reinforcement direction");
    reinforcementDirection.SetDirectionType("ROTATED");
    reinforcementDirection.SetDirectionRotations(Math.PI / 4, Math.PI / 2);

    /**************************************************** Types for concrete design - Surface reinforcement ****************************************************/
    var coordinateSystem = new CoordinateSystem();
    coordinateSystem.Offset(undefined, [1, 1, 0]);

    var surfaceReinforcement = new ConcreteDesignSurfaceReinforcement(undefined, [surfaceList[6].no], reinforcementMaterial.GetNo(), "MESH", "Concrete design Surface reinforcement - mesh (" + GetConcreteDesignCurrentCodeOfStandard() + ")");
    surfaceReinforcement.SetName("Surface reinforcement");
    surfaceReinforcement.SetMesh("CZECH_REPUBLIC", "R_MESH", "R 188A");
    surfaceReinforcement.SetAssignment(0.010, 0.011);
    surfaceReinforcement.SetLocationType("ON_SURFACE");
    surfaceReinforcement.SetReinforcementDirection("PARALLEL_TO_TWO_POINTS", 1.0, 1.0, 2.0, 2.0);
    surfaceReinforcement.SetProjection(coordinateSystem.GetNo(), "XZ_OR_UW");
    var surfaceReinforcement2 = new ConcreteDesignSurfaceReinforcement(undefined, [surfaceList[7].no], reinforcementMaterial.GetNo(), undefined, "Concrete design Surface reinforcement - rebar (" + GetConcreteDesignCurrentCodeOfStandard() + ")");
    surfaceReinforcement2.SetName("Surface reinforcement");
    surfaceReinforcement2.SetLocationType("FREE_RECTANGULAR");
    if (IsConcreteDesignCurrentCodeOfStandard("EN") || IsConcreteDesignCurrentCodeOfStandard("SP") || PRERELEASE_MODE && IsConcreteDesignCurrentCodeOfStandard("NTC")) {
        surfaceReinforcement2.SetRebarDiameter(0.015);
        surfaceReinforcement2.SetAdditionalRebarDiameter(0.009);
    }
    else if (IsConcreteDesignCurrentCodeOfStandard("ACI")) {
        surfaceReinforcement2.SetRebarDiameter("#2.5");
        surfaceReinforcement2.SetAdditionalRebarDiameter("#11");
    }
    else if (IsConcreteDesignCurrentCodeOfStandard("CSA")) {
        surfaceReinforcement2.SetRebarDiameter("45M");
        surfaceReinforcement2.SetAdditionalRebarDiameter("25M");
    }
    else {
        ASSERT(false, "Unknown code standard: " + GetConcreteDesignCurrentCodeOfStandard());
    }
    surfaceReinforcement2.SetRebarSpacingAuto(0.101, 0.301, 0.011, 2);
    surfaceReinforcement2.SetAdditionalRebarSpacingAuto(0.012, 0.022, 0.016, 2);
    surfaceReinforcement2.SetAssignment(0);
    surfaceReinforcement2.SetReinforcementDirection("IN_DESIGN_REINFORCEMENT_DIRECTION", "A_S_2");
    surfaceReinforcement2.SetReinforcementLocationFreeRectangular("CORNER_POINTS", -15.65, -13.63, -13.36, -12.5, Math.PI / 4);
    var surfaceReinforcement3 = new ConcreteDesignSurfaceReinforcement(undefined, [surfaceList[8].no], reinforcementMaterial.GetNo(), undefined, "Concrete design Surface reinforcement - rebar (2) (" + GetConcreteDesignCurrentCodeOfStandard() + ")");
    surfaceReinforcement3.SetName("Surface reinforcement");
    surfaceReinforcement3.SetLocationType("FREE_RECTANGULAR");
    if (IsConcreteDesignCurrentCodeOfStandard("EN") || IsConcreteDesignCurrentCodeOfStandard("SP") || PRERELEASE_MODE && IsConcreteDesignCurrentCodeOfStandard("NTC")) {
        surfaceReinforcement3.SetRebarDiameterAuto(0.011, 0.021, "0.008, 0.010, 0.012, 0.014", 2);
        surfaceReinforcement3.SetAdditionalRebarDiameterAuto(0.012, 0.014, "0.008, 0.010, 0.012, 0.014, 0.016", 2);
    }
    else if (IsConcreteDesignCurrentCodeOfStandard("ACI")) {
        surfaceReinforcement3.SetRebarDiameterAuto("#4", "#7", "#1, #2, #3", 3);
        surfaceReinforcement3.SetAdditionalRebarDiameterAuto("#5", "#10", "#4, #5, #6", 3);
    }
    else if (IsConcreteDesignCurrentCodeOfStandard("CSA")) {
        surfaceReinforcement3.SetRebarDiameterAuto("20M", "30M", "10M, 15M, 20M", 3);
        surfaceReinforcement3.SetAdditionalRebarDiameterAuto("25M", "45M", "15M, 20M", 3);
    }
    else {
        ASSERT(false, "Unknown code standard: " + GetConcreteDesignCurrentCodeOfStandard());
    }
    surfaceReinforcement3.SetRebarSpacing(0.170);
    surfaceReinforcement3.SetAdditionalRebarSpacing(0.008);
    surfaceReinforcement3.SetAssignment(undefined, 0.005);
    surfaceReinforcement3.SetReinforcementLocationFreeRectangular("CENTER_AND_SIDES", 1.0, 1.5, 2.0, 2.5);
    surfaceReinforcement3.SetReinforcementActionRegion(-5, -6);
    var surfaceReinforcement4 = new ConcreteDesignSurfaceReinforcement(undefined, [surfaceList[9].no], reinforcementSteelMaterial.GetNo(), "STIRRUPS", "Concrete design Surface reinforcement - stirrups (" + GetConcreteDesignCurrentCodeOfStandard() + ")");
    surfaceReinforcement4.SetName("Surface reinforcement")
    if (IsConcreteDesignCurrentCodeOfStandard("EN") || IsConcreteDesignCurrentCodeOfStandard("SP") || PRERELEASE_MODE && IsConcreteDesignCurrentCodeOfStandard("NTC")) {
        surfaceReinforcement4.SetStirrupsDiameter(0.021);
    }
    else if (IsConcreteDesignCurrentCodeOfStandard("ACI")) {
        surfaceReinforcement4.SetStirrupsDiameter("#5");
    }
    else if (IsConcreteDesignCurrentCodeOfStandard("CSA")) {
        surfaceReinforcement4.SetStirrupsDiameter("25M");
    }
    else {
        ASSERT(false, "Unknown code standard: " + GetConcreteDesignCurrentCodeOfStandard());
    }
    surfaceReinforcement4.SetStirrupsSpacingAuto(0.101, 0.301, 0.011, 3);
    var surfaceReinforcement5 = new ConcreteDesignSurfaceReinforcement(undefined, [surfaceList[10].no], reinforcementSteelMaterial.GetNo(), "STIRRUPS", "Concrete design Surface reinforcement - stirrups (2) (" + GetConcreteDesignCurrentCodeOfStandard() + ")");
    surfaceReinforcement5.SetName("Surface reinforcement")
    if (IsConcreteDesignCurrentCodeOfStandard("EN") || IsConcreteDesignCurrentCodeOfStandard("SP") || PRERELEASE_MODE && IsConcreteDesignCurrentCodeOfStandard("NTC")) {
        surfaceReinforcement5.SetStirrupsDiameterAuto(0.011, 0.021, "0.008, 0.010", 2);
    }
    else if (IsConcreteDesignCurrentCodeOfStandard("ACI")) {
        surfaceReinforcement5.SetStirrupsDiameterAuto("#11", "#14", "#1, #2", 3);
    }
    else if (IsConcreteDesignCurrentCodeOfStandard("CSA")) {
        surfaceReinforcement5.SetStirrupsDiameterAuto("25M", "30M", "#1, #2", 3);
    }
    else {
        ASSERT(false, "Unknown code standard: " + GetConcreteDesignCurrentCodeOfStandard());
    }
    surfaceReinforcement5.SetStirrupsSpacing(0.020);
    var surfaceReinforcement6 = new ConcreteDesignSurfaceReinforcement(undefined, [surfaceList[8].no], reinforcementMaterial.GetNo(), undefined, "Concrete design Surface reinforcement - rebar (3) (" + GetConcreteDesignCurrentCodeOfStandard() + ")");
    surfaceReinforcement6.SetName("Surface reinforcement");
    surfaceReinforcement6.SetLocationType("FREE_CIRCULAR");
    surfaceReinforcement6.SetReinforcementLocationFreeCircular(-8.5, -13.0, 0.8);
    var surfaceReinforcement7 = new ConcreteDesignSurfaceReinforcement(undefined, [surfaceList[10].no], reinforcementMaterial.GetNo(), undefined, "Concrete design Surface reinforcement - rebar (4) (" + GetConcreteDesignCurrentCodeOfStandard() + ")");
    surfaceReinforcement7.SetName("Surface reinforcement");
    surfaceReinforcement7.SetLocationType("FREE_POLYGON");
    surfaceReinforcement7.SetReinforcementLocationFreePolygon([[-28.0, -10.0, "Comment 1"], [-25.0, -10.0], [-26.5, -8.0, "Comment 2"]]);

    if (PRERELEASE_MODE) {  // RFEM
        /**************************************************** Types for concrete design - Punching reinforcement ****************************************************/
        if (!IsConcreteDesignCurrentCodeOfStandard("SP")) {
            var materialForPunching = new Material(undefined, "Grade 40");
        }
        else {
            var materialForPunching = new Material(undefined, "B500 (transverse reinforcement)");
        }

        var punchingReinforcement = new ConcreteDesignPunchingReinforcement(undefined, [75, 76, 85, 86], materialForPunching.GetNo(), "Punching reinforcement for test (" + GetConcreteDesignCurrentCodeOfStandard() + ")");
        punchingReinforcement.SetName("Punching reinforcement");
        punchingReinforcement.SetType("VERTICAL");
        punchingReinforcement.SetPlacement("DIFFERENT");
        punchingReinforcement.SetBendUpDiameter(0.012);
        punchingReinforcement.SetPerimeterSpacingTypeForDifferentPerimeters("ABSOLUTE");
        for (var i = 0; i < 10; ++i) {
            punchingReinforcement.AddDifferentPerimeters(i + 1, 0.1 * i);
        }

        var punchingReinforcement2 = new ConcreteDesignPunchingReinforcement(undefined, [73, 74, 83, 84], materialForPunching.GetNo(), "Punching reinforcement for test (" + GetConcreteDesignCurrentCodeOfStandard() + ")");
        punchingReinforcement2.SetName("Punching reinforcement");
        punchingReinforcement2.SetPlacement("DIFFERENT");
        punchingReinforcement2.SetPerimeterSpacingTypeForDifferentPerimeters("MULTIPLE_STATIC_DEPTH");
        for (var i = 0; i < 10; ++i) {
            punchingReinforcement2.AddDifferentPerimeters(i + 1, 0.1 * (i + 1));
        }

        var punchingReinforcement3 = new ConcreteDesignPunchingReinforcement(undefined, [77, 78, 87, 88], materialForPunching.GetNo(), "Punching reinforcement for test (" + GetConcreteDesignCurrentCodeOfStandard() + ")");
        punchingReinforcement3.SetName("Punching reinforcement");
        punchingReinforcement3.SetPlacement("UNIFORM");
        punchingReinforcement3.SetBendUpDiameterAutomatically(0.011, 0.021, true, [0.008, 0.010], 2);
        punchingReinforcement3.SetUniformPlacementPerimetersAndLegs(false, 2, true, [4, 12, 5]);
        punchingReinforcement3.SetUniformPerimeterSpacing("MULTIPLE_STATIC_DEPTH");
        punchingReinforcement3.SetUniformMultipleStaticPerimeterSpacing(false, 0.550, true, [0.301, 0.751, 0.011, 2]);

        var punchingReinforcement4 = new ConcreteDesignPunchingReinforcement(undefined, [79, 80, 89, 90], materialForPunching.GetNo(), "Punching reinforcement for test (" + GetConcreteDesignCurrentCodeOfStandard() + ")");
        punchingReinforcement4.SetName("Punching reinforcement");
        punchingReinforcement4.SetPlacement("UNIFORM");
        punchingReinforcement4.SetUniformPerimeterSpacing("ABSOLUTE");
        punchingReinforcement4.SetUniformAbsolutePerimeterSpacing(true, [0.301, 0.751, 0.011, 2], false, 0.550);
    }

    /***************************************** Concrete design for surfaces ****************************************************/
    var nodesForSurfaces2 = createNodesGrid(-28, -4, [4, 2], [3, 2]);
    var surface_dict2 = createSurfacesFromNodesGrid(nodesForSurfaces2, [2, 1], undefined, undefined, true);
    var surfaceList2 = [];
    for (var i = 0; i < Object.keys(surface_dict2).length; ++i) {
        var surface = new Surface();
        surface.Standard(undefined, surface_dict2[i + 1][0], thickness.no);
        surface.SetConcreteDesignProperties();
        surfaceList2.push(surface);
    }

    surfaceList2[0].SetUserDefinedConcreteCover(0.035, 0.036);
    if (IsConcreteDesignCurrentCodeOfStandard("EN") || IsConcreteDesignCurrentCodeOfStandard("NTC")) {
        surfaceList2[0].SetConcreteDesignConcreteDurability(concreteDurability.GetNo(), concreteDurability2.GetNo());
    }
    surfaceList2[0].SetConcreteDesignReinforcementDirections(1, 2);
    surfaceList2[0].SetConcreteDesignSurfaceReinforcement([1, 3, 5, 7]);

    //surfaceList2[1].SetConcreteCoverAccToEn1992();    Cannot be set (top surface side, bottom surface side)?
    if (IsConcreteDesignCurrentCodeOfStandard("EN") || IsConcreteDesignCurrentCodeOfStandard("NTC")) {
        surfaceList2[1].SetConcreteDesignConcreteDurability(concreteDurability2.GetNo(), concreteDurability.GetNo());
    }
    surfaceList2[1].SetConcreteDesignReinforcementDirections(2, 1);
    surfaceList2[1].SetConcreteDesignSurfaceReinforcement([2, 4, 6]);
    surfaceList2[1].SetAssignments(2, 1);
    surfaceList2[1].SetDeflectionAnalysis("CANTILEVER", "DEFORMED_USER_DEFINED_REFERENCE_PLANE", "MANUALLY", 5.0);
    surfaceList2[1].SetUserDefinedReferencePlane([-21.6, -3.7, 0, -19.6, -3.5, 0, -20.5, -2.5, 0]);
}   // RFEM

/***************************************** Concrete design for members ****************************************************/
memberList[0].SetConcreteDesignSupport(false);
memberList[1].SetConcreteDesignEffectiveLength(1);
memberList[1].SetConcreteDesignUserDefineConcreteCoverAllSectionSides(0.040);
if (IsConcreteDesignCurrentCodeOfStandard("EN") || IsConcreteDesignCurrentCodeOfStandard("NTC")) {
    memberList[1].SetConcreteDesignConcreteDurabilityAllSectionSides(concreteDurability2.GetNo());
}
//memberList[1].SetConcreteDesignMinimumConcreteCover(0.035);   Cannot be set?
memberList[1].RemoveConcreteDesignShearReinforcement(1);    // Remove default shear reinforcement
var shear_reinforcement_no = memberList[1].AddConcreteDesignShearReinforcement();
if (!IsConcreteDesignCurrentCodeOfStandard("SP")) {
    memberList[1].SetConcreteDesignShearReinforcementBaseData(shear_reinforcement_no, reinforcementMaterial.GetNo(), "THREE_LEGGED_OVERLAP_HOOK_180");
}
else {
    memberList[1].SetConcreteDesignShearReinforcementBaseData(shear_reinforcement_no, reinforcementSteelMaterial.GetNo(), "THREE_LEGGED_OVERLAP_HOOK_180");
}
memberList[1].SetConcreteDesignShearReinforcementSpanLocation(shear_reinforcement_no, "END", -2.9, -1.5);
memberList[1].RemoveConcreteDesignLongitudinalReinforcement(1); // Remove default longitudinal reinforcement
var longitudinal_reinforcement_no = memberList[1].AddConcreteDesignLongitudinalReinforcement();
if (!IsConcreteDesignCurrentCodeOfStandard("SP")) {
    memberList[1].SetConcreteDesignLongitudinalReinforcementBaseData(longitudinal_reinforcement_no, "SYMMETRICAL", reinforcementSteelMaterial.GetNo())
}
else {
    memberList[1].SetConcreteDesignLongitudinalReinforcementBaseData(longitudinal_reinforcement_no, "SYMMETRICAL", reinforcementSteelMaterialSP.GetNo())
}
memberList[1].SetConcreteDesignLongitudinalReinforcementSymmetricalRebarParameters(longitudinal_reinforcement_no, 4, 0.021, true, 0.022);
memberList[1].SetConcreteDesignLongitudinalReinforcementSymmetricalAreas(longitudinal_reinforcement_no, 0.000943);
memberList[1].SetConcreteDesignLongitudinalReinforcementSpanLocation(longitudinal_reinforcement_no, "END", -2.9, -1.5);

if (IsConcreteDesignCurrentCodeOfStandard("EN") || IsConcreteDesignCurrentCodeOfStandard("NTC")) {
    memberList[2].SetConcreteDesignUserDefineConcreteCoverOnEachSide(0.031, 0.032, undefined, 0.033);
    memberList[2].SetConcreteDesignConcreteDurabilityOnEachSide(concreteDurability2.GetNo(), undefined, concreteDurability2.GetNo(), concreteDurability2.GetNo());
    //memberList[2].SetConcreteDesignMinimumConcreteCoverOnEachSide(0.031, 0.032, 0.033, 0.034);    Cannot be set?
}
memberList[2].RemoveConcreteDesignShearReinforcement(1);    // Remove default shear reinforcement
shear_reinforcement_no = memberList[2].AddConcreteDesignShearReinforcement();
if (!IsConcreteDesignCurrentCodeOfStandard("SP")) {
    memberList[2].SetConcreteDesignShearReinforcementBaseData(shear_reinforcement_no, reinforcementMaterial.GetNo(), "THREE_LEGGED_OVERLAP_HOOK_180");
}
else {
    memberList[2].SetConcreteDesignShearReinforcementBaseData(shear_reinforcement_no, reinforcementSteelMaterial.GetNo(), "THREE_LEGGED_OVERLAP_HOOK_180");
}
memberList[2].SetConcreteDesignShearReinforcementStirrupParameters(shear_reinforcement_no, 0.012, 0.301, 12, true, 0.015);
memberList[2].SetConcreteDesignShearReinforcementAreas(shear_reinforcement_no, 0.00095);
memberList[2].SetConcreteDesignShearReinforcementSpanLocation(shear_reinforcement_no, "X_LOCATION", 0.2, 0.3, 0.1, false);
memberList[2].SetConcreteDesignShearReinforcementBorderDistancesOfStirrups(shear_reinforcement_no, "START_EQUALS_REST_LENGTH_TO_STIRRUP_DISTANCED");
memberList[2].RemoveConcreteDesignLongitudinalReinforcement(1); // Remove default longitudinal reinforcement
longitudinal_reinforcement_no = memberList[2].AddConcreteDesignLongitudinalReinforcement();
if (!IsConcreteDesignCurrentCodeOfStandard("SP")) {
    memberList[2].SetConcreteDesignLongitudinalReinforcementBaseData(longitudinal_reinforcement_no, "UNSYMMETRICAL", reinforcementSteelMaterial.GetNo(), true);
}
else {
    memberList[2].SetConcreteDesignLongitudinalReinforcementBaseData(longitudinal_reinforcement_no, "UNSYMMETRICAL", reinforcementSteelMaterialSP.GetNo(), true);
}
memberList[2].SetConcreteDesignLongitudinalReinforcementUnSymmetricalRebarParameters(longitudinal_reinforcement_no, 5, 0.021, 1, 0.022, 4, 0.023, true, 0.024);
memberList[2].SetConcreteDesignLongitudinalReinforcementUnSymmetricalAreas(longitudinal_reinforcement_no, 0.000944, 0.00011, 0.000945);
memberList[2].SetConcreteDesignLongitudinalReinforcementSpanLocation(longitudinal_reinforcement_no, "X_LOCATION", 0.2, 0.3, 0.1, false);
memberList[2].SetConcreteDesignLongitudinalReinforcementAdditionalOffset(longitudinal_reinforcement_no, "FROM_CONCRETE_COVER", 0.002, 0.004, 0.006, 0.008);
if (!IsConcreteDesignCurrentCodeOfStandard("CSA")) {
    memberList[2].SetConcreteDesignLongitudinalReinforcementAnchorageStart(longitudinal_reinforcement_no, "HOOK_WITH_TRANSVERSE_BAR", 0.201, 0.099);
    memberList[2].SetConcreteDesignLongitudinalReinforcementAnchorageEnd(longitudinal_reinforcement_no, "BEND", 0.202, 0.098);
}
else {
    memberList[2].SetConcreteDesignLongitudinalReinforcementAnchorageStart(longitudinal_reinforcement_no, "BEND", 0.201, 0.099);
    memberList[2].SetConcreteDesignLongitudinalReinforcementAnchorageEnd(longitudinal_reinforcement_no, "HOOK", 0.202, 0.098);
}
if (!IsConcreteDesignCurrentCodeOfStandard("ACI")) {
    memberList[2].SetDesignConfigurations(ultimateConfiguration2.GetNo(), serviceabilityConfiguration2.GetNo());
}
else {
    memberList[2].SetDesignConfigurations(strengthConfiguration2.GetNo(), serviceabilityConfiguration2.GetNo());
}
memberList[2].SetDeflectionAnalysis("LOCAL_AXIS_Z_AND_Y", "DEFORMED_UNDEFORMED_SYSTEM", false, 1.5, 0.02, true, 2.5, 0.05);

memberList[3].RemoveConcreteDesignLongitudinalReinforcement(1); // Remove default longitudinal reinforcement
longitudinal_reinforcement_no = memberList[3].AddConcreteDesignLongitudinalReinforcement();
if (!IsConcreteDesignCurrentCodeOfStandard("SP")) {
    memberList[3].SetConcreteDesignShearReinforcementBaseData(shear_reinforcement_no, reinforcementMaterial.GetNo(), "THREE_LEGGED_OVERLAP_HOOK_180");
}
else {
    memberList[3].SetConcreteDesignShearReinforcementBaseData(shear_reinforcement_no, reinforcementSteelMaterial.GetNo(), "THREE_LEGGED_OVERLAP_HOOK_180");
}
if (!IsConcreteDesignCurrentCodeOfStandard("SP")) {
    memberList[3].SetConcreteDesignLongitudinalReinforcementBaseData(longitudinal_reinforcement_no, "UNIFORMLY_SURROUNDING", reinforcementSteelMaterial.GetNo());
}
else {
    memberList[3].SetConcreteDesignLongitudinalReinforcementBaseData(longitudinal_reinforcement_no, "UNIFORMLY_SURROUNDING", reinforcementSteelMaterialSP.GetNo());
}
memberList[3].SetConcreteDesignLongitudinalReinforcementUniformlySurroundingRebarParameters(longitudinal_reinforcement_no, 5, 0.026, true, 0.027);
memberList[3].SetConcreteDesignLongitudinalReinforcementUniformlySurroundingAreas(longitudinal_reinforcement_no, 0.001258);

memberList[4].RemoveConcreteDesignLongitudinalReinforcement(1); // Remove default longitudinal reinforcement
longitudinal_reinforcement_no = memberList[4].AddConcreteDesignLongitudinalReinforcement();
if (!IsConcreteDesignCurrentCodeOfStandard("SP")) {
    memberList[4].SetConcreteDesignShearReinforcementBaseData(shear_reinforcement_no, reinforcementMaterial.GetNo(), "THREE_LEGGED_OVERLAP_HOOK_180");
}
else {
    memberList[4].SetConcreteDesignShearReinforcementBaseData(shear_reinforcement_no, reinforcementSteelMaterial.GetNo(), "THREE_LEGGED_OVERLAP_HOOK_180");
}
if (!IsConcreteDesignCurrentCodeOfStandard("SP")) {
    memberList[4].SetConcreteDesignLongitudinalReinforcementBaseData(longitudinal_reinforcement_no, "LINE", reinforcementSteelMaterial.GetNo());
}
else {
    memberList[4].SetConcreteDesignLongitudinalReinforcementBaseData(longitudinal_reinforcement_no, "LINE", reinforcementSteelMaterialSP.GetNo());
}
memberList[4].SetConcreteDesignLongitudinalReinforcementLineRebarParameters(longitudinal_reinforcement_no, 3, 0.021, "FROM_SECTION_SURFACE", "CENTER_CENTER", 0.002, 0.042, "RIGHT_BOTTOM", 0.003, 0.043);
memberList[4].SetConcreteDesignLongitudinalReinforcementLineAreas(longitudinal_reinforcement_no, 0.000629);

memberList[5].RemoveConcreteDesignLongitudinalReinforcement(1); // Remove default longitudinal reinforcement
longitudinal_reinforcement_no = memberList[5].AddConcreteDesignLongitudinalReinforcement();
if (!IsConcreteDesignCurrentCodeOfStandard("SP")) {
    memberList[5].SetConcreteDesignLongitudinalReinforcementBaseData(longitudinal_reinforcement_no, "SINGLE", reinforcementSteelMaterial.GetNo());
}
else {
    memberList[5].SetConcreteDesignLongitudinalReinforcementBaseData(longitudinal_reinforcement_no, "SINGLE", reinforcementSteelMaterialSP.GetNo());
}
if (!IsConcreteDesignCurrentCodeOfStandard("SP")) {
    memberList[5].SetConcreteDesignShearReinforcementBaseData(shear_reinforcement_no, reinforcementMaterial.GetNo(), "THREE_LEGGED_OVERLAP_HOOK_180");
}
else {
    memberList[5].SetConcreteDesignShearReinforcementBaseData(shear_reinforcement_no, reinforcementSteelMaterial.GetNo(), "THREE_LEGGED_OVERLAP_HOOK_180");
}
memberList[5].SetConcreteDesignLongitudinalReinforcementSingleRebarParameters(longitudinal_reinforcement_no, 0.025, "FROM_SECTION_SURFACE", "CENTER_TOP", 0.002, 0.043);
memberList[5].SetConcreteDesignLongitudinalReinforcementSingleAreas(longitudinal_reinforcement_no, 0.000414);

/***************************************** Concrete design for member sets *************************************************/
var membersForSetOfMembers3 = [];
var memberSetList = [];
var startNode = 22;
var membersForSetOfMembersCount = 8;

for (var i = 0; i < 8; ++i) {
    var member = new Member();
    member.Beam(undefined, [startNode + i * 2 + (i >= (membersForSetOfMembersCount / 2) ? 2 : 0), startNode + 1 + i * 2 + (i >= (membersForSetOfMembersCount / 2) ? 2 : 0)], section.GetNo());
    membersForSetOfMembers3.push(member);
}

for (var i = 0; i < 4; ++i) {
    memberSetList.push(new MemberSet());
    if (i != 3) {
        memberSetList[i].ContinuousMembers(undefined, [memberList[10 + i].GetNo(), membersForSetOfMembers3[i].GetNo()]);
    }
    else {
        memberSetList[i].ContinuousMembers(undefined, [memberList[10 + i].GetNo(), membersForSetOfMembers3[3].GetNo(), memberList[14].GetNo()]);
    }
    memberSetList[i].SetName("Member set");
    memberSetList[i].SetConcreteDesignSupport();
}
memberSetList.push(new MemberSet());
memberSetList[memberSetList.length - 1].ContinuousMembers(undefined, [memberList[15].GetNo(), membersForSetOfMembers3[4].GetNo(), memberList[16].GetNo(), membersForSetOfMembers3[5].GetNo(), memberList[17].GetNo(), membersForSetOfMembers3[6].GetNo(), memberList[18].GetNo(), membersForSetOfMembers3[7].GetNo(), memberList[19].GetNo()]);
memberSetList[memberSetList.length - 1].SetName("Member set");
memberSetList[memberSetList.length - 1].SetConcreteDesignSupport();

memberSetList[0].SetConcreteDesignEffectiveLength(2);
memberSetList[0].SetConcreteDesignUserDefineConcreteCoverAllSectionSides(0.040);
if (IsConcreteDesignCurrentCodeOfStandard("EN") || IsConcreteDesignCurrentCodeOfStandard("NTC")) {
    memberSetList[0].SetConcreteDesignConcreteDurabilityAllSectionSides(2);
}
memberSetList[0].RemoveConcreteDesignShearReinforcement(1);    // Remove default shear reinforcement
shear_reinforcement_no = memberSetList[0].AddConcreteDesignShearReinforcement();
if (!IsConcreteDesignCurrentCodeOfStandard("SP")) {
    memberSetList[1].SetConcreteDesignShearReinforcementBaseData(shear_reinforcement_no, reinforcementMaterial.GetNo(), "THREE_LEGGED_OVERLAP_HOOK_180");
}
else {
    memberSetList[1].SetConcreteDesignShearReinforcementBaseData(shear_reinforcement_no, reinforcementSteelMaterial.GetNo(), "THREE_LEGGED_OVERLAP_HOOK_180");
}
memberSetList[0].SetConcreteDesignShearReinforcementStirrupParameters(shear_reinforcement_no, 0.012, 0.301, 12, true, 0.015);
memberSetList[0].SetConcreteDesignShearReinforcementAreas(shear_reinforcement_no, 0.00095);
//memberSetList[0].SetConcreteDesignShearReinforcementSpanLocation(shear_reinforcement_no, "X_LOCATION", 0.2, 0.3, 0.1, false);
memberSetList[0].SetConcreteDesignShearReinforcementBorderDistancesOfStirrups(shear_reinforcement_no, "END_EQUALS_REST_LENGTH_TO_STIRRUP_DISTANCED");
memberSetList[0].RemoveConcreteDesignLongitudinalReinforcement(1); // Remove default longitudinal reinforcement
longitudinal_reinforcement_no = memberSetList[0].AddConcreteDesignLongitudinalReinforcement();
if (!IsConcreteDesignCurrentCodeOfStandard("SP")) {
    memberSetList[0].SetConcreteDesignLongitudinalReinforcementBaseData(longitudinal_reinforcement_no, "SYMMETRICAL", reinforcementSteelMaterial.GetNo())
}
else {
    memberSetList[0].SetConcreteDesignLongitudinalReinforcementBaseData(longitudinal_reinforcement_no, "SYMMETRICAL", reinforcementSteelMaterialSP.GetNo())
}
memberSetList[0].SetConcreteDesignLongitudinalReinforcementSymmetricalRebarParameters(longitudinal_reinforcement_no, 4, 0.021, true, 0.022);
memberSetList[0].SetConcreteDesignLongitudinalReinforcementSymmetricalAreas(longitudinal_reinforcement_no, 0.000943);
memberSetList[0].SetConcreteDesignLongitudinalReinforcementSpanLocation(longitudinal_reinforcement_no, "END", -2.9, -1.5);
memberSetList[0].SetConcreteDesignLongitudinalReinforcementAdditionalOffset(longitudinal_reinforcement_no, "FROM_STIRRUP", 0.002, 0.004, 0.006, 0.008);
if (!IsConcreteDesignCurrentCodeOfStandard("CSA")) {
    memberSetList[0].SetConcreteDesignLongitudinalReinforcementAnchorageStart(longitudinal_reinforcement_no, "HOOK_WITH_TRANSVERSE_BAR", 0.201, 0.099);
    memberSetList[0].SetConcreteDesignLongitudinalReinforcementAnchorageEnd(longitudinal_reinforcement_no, "BEND", 0.202, 0.098);
}
else {
    memberSetList[0].SetConcreteDesignLongitudinalReinforcementAnchorageStart(longitudinal_reinforcement_no, "BEND", 0.201, 0.099);
    memberSetList[0].SetConcreteDesignLongitudinalReinforcementAnchorageEnd(longitudinal_reinforcement_no, "HOOK", 0.202, 0.098);
}

if (IsConcreteDesignCurrentCodeOfStandard("EN") || IsConcreteDesignCurrentCodeOfStandard("NTC")) {
    memberSetList[1].SetConcreteDesignUserDefineConcreteCoverOnEachSide(0.031, 0.032, 0.033, 0.034);
    memberSetList[1].SetConcreteDesignConcreteDurabilityOnEachSide(concreteDurability2.GetNo(), concreteDurability2.GetNo(), concreteDurability2.GetNo(), concreteDurability2.GetNo());
    //memberSetList[2].SetConcreteDesignMinimumConcreteCoverOnEachSide(0.031, 0.032, 0.033, 0.034);    Cannot be set?
}
memberSetList[1].RemoveConcreteDesignShearReinforcement(1);    // Remove default shear reinforcement
shear_reinforcement_no = memberSetList[1].AddConcreteDesignShearReinforcement();
if (!IsConcreteDesignCurrentCodeOfStandard("SP")) {
    memberSetList[1].SetConcreteDesignShearReinforcementBaseData(shear_reinforcement_no, reinforcementMaterial.GetNo(), "THREE_LEGGED_OVERLAP_HOOK_180");
}
else {
    memberSetList[1].SetConcreteDesignShearReinforcementBaseData(shear_reinforcement_no, reinforcementSteelMaterial.GetNo(), "THREE_LEGGED_OVERLAP_HOOK_180");
}
memberSetList[1].RemoveConcreteDesignLongitudinalReinforcement(1); // Remove default longitudinal reinforcement
longitudinal_reinforcement_no = memberSetList[1].AddConcreteDesignLongitudinalReinforcement();
if (!IsConcreteDesignCurrentCodeOfStandard("SP")) {
    memberSetList[1].SetConcreteDesignLongitudinalReinforcementBaseData(longitudinal_reinforcement_no, "UNSYMMETRICAL", reinforcementSteelMaterial.GetNo(), true);
}
else {
    memberSetList[1].SetConcreteDesignLongitudinalReinforcementBaseData(longitudinal_reinforcement_no, "UNSYMMETRICAL", reinforcementSteelMaterialSP.GetNo(), true);
}
memberSetList[1].SetConcreteDesignLongitudinalReinforcementUnSymmetricalRebarParameters(longitudinal_reinforcement_no, 5, 0.021, 1, 0.022, 4, 0.023, true, 0.024);
memberSetList[1].SetConcreteDesignLongitudinalReinforcementUnSymmetricalAreas(longitudinal_reinforcement_no, 0.000944, 0.00011, 0.000945);
memberSetList[1].SetConcreteDesignLongitudinalReinforcementSpanLocation(longitudinal_reinforcement_no, "X_LOCATION", 0.2, 0.3, 0.1, false);

memberSetList[2].RemoveConcreteDesignLongitudinalReinforcement(1); // Remove default longitudinal reinforcement
longitudinal_reinforcement_no = memberSetList[2].AddConcreteDesignLongitudinalReinforcement();
if (!IsConcreteDesignCurrentCodeOfStandard("SP")) {
    memberSetList[2].SetConcreteDesignLongitudinalReinforcementBaseData(longitudinal_reinforcement_no, "UNIFORMLY_SURROUNDING", reinforcementSteelMaterial.GetNo());
}
else {
    memberSetList[2].SetConcreteDesignLongitudinalReinforcementBaseData(longitudinal_reinforcement_no, "UNIFORMLY_SURROUNDING", reinforcementSteelMaterialSP.GetNo());
}
memberSetList[2].SetConcreteDesignLongitudinalReinforcementUniformlySurroundingRebarParameters(longitudinal_reinforcement_no, 5, 0.026, true, 0.027);
memberSetList[2].SetConcreteDesignLongitudinalReinforcementUniformlySurroundingAreas(longitudinal_reinforcement_no, 0.001258);

memberSetList[3].RemoveConcreteDesignLongitudinalReinforcement(1); // Remove default longitudinal reinforcement
longitudinal_reinforcement_no = memberSetList[3].AddConcreteDesignLongitudinalReinforcement();
if (!IsConcreteDesignCurrentCodeOfStandard("SP")) {
    memberSetList[3].SetConcreteDesignLongitudinalReinforcementBaseData(longitudinal_reinforcement_no, "LINE", reinforcementSteelMaterial.GetNo());
}
else {
    memberSetList[3].SetConcreteDesignLongitudinalReinforcementBaseData(longitudinal_reinforcement_no, "LINE", reinforcementSteelMaterialSP.GetNo());
}
memberSetList[3].SetConcreteDesignLongitudinalReinforcementLineRebarParameters(longitudinal_reinforcement_no, 3, 0.021, "FROM_SECTION_SURFACE", "RIGHT_TOP", 0.002, 0.042, "LEFT_CENTER", 0.003, 0.043);
memberSetList[3].SetConcreteDesignLongitudinalReinforcementLineAreas(longitudinal_reinforcement_no, 0.000629);

memberSetList[4].RemoveConcreteDesignLongitudinalReinforcement(1); // Remove default longitudinal reinforcement
longitudinal_reinforcement_no = memberSetList[4].AddConcreteDesignLongitudinalReinforcement();
if (!IsConcreteDesignCurrentCodeOfStandard("SP")) {
    memberSetList[4].SetConcreteDesignLongitudinalReinforcementBaseData(longitudinal_reinforcement_no, "SINGLE", reinforcementSteelMaterial.GetNo());
}
else {
    memberSetList[4].SetConcreteDesignLongitudinalReinforcementBaseData(longitudinal_reinforcement_no, "SINGLE", reinforcementSteelMaterialSP.GetNo());
}
memberSetList[4].SetConcreteDesignLongitudinalReinforcementSingleRebarParameters(longitudinal_reinforcement_no, 0.025, "FROM_SECTION_SURFACE", "CENTER_TOP", 0.002, 0.043);
memberSetList[4].SetConcreteDesignLongitudinalReinforcementSingleAreas(longitudinal_reinforcement_no, 0.000414);

/***************************************** Concrete design for surface sets *************************************************/
if (RFEM && PRERELEASE_MODE)
{
    var nodesForSurfaces3 = createNodesGrid(-28, 4, [10, 2], [3, 2]);
    var surface_dict3 = createSurfacesFromNodesGrid(nodesForSurfaces3, [5, 1], surfaces.TYPE_STANDARD, thickness.GetNo(), true);
    var surfaceList3 = [];
    for (var i = 0; i < Object.keys(surface_dict3).length; ++i) {
        var surface = new Surface();
        surface.Standard(undefined, surface_dict3[i + 1][0], thickness.no);
        surface.SetConcreteDesignProperties();
        surfaceList3.push(surface);
    }

    var linesForSurfaceSets = [];
    var row = 0;
    var surfaceList3Count = surfaceList3.length;

    for (var i = 0; i < surfaceList3Count * 2; ++i) {
        if (i === 4) {
            row++;
        }
        linesForSurfaceSets.push((new Line()).Polyline(undefined, [110 + (i + row) * 2, 110 + (i + row) * 2 + 1]));
    }

    for (var i = 0; i < surfaceList3Count - 1; ++i) {
        var surface = new Surface();
        surface.Standard(undefined, [102 + 4 * i, 119 + i, 104 + 4 * i, 123 + i], thickness.GetNo());
        surfaceList3.push(surface);
    }

    var surfaceSet = new SurfaceSet();
    surfaceSet.ContinuousSurfaces(undefined, [surfaceList3[0].GetNo(), surfaceList3[5].GetNo(), surfaceList3[1].GetNo(), surfaceList3[6].GetNo(), surfaceList3[2].GetNo(), surfaceList3[7].GetNo(), surfaceList3[3].GetNo(), surfaceList3[8].GetNo(), surfaceList3[4].GetNo()]);
    surfaceSet.SetName("Surface set");
    surfaceSet.SetConcreteDesignProperties();
    if (IsConcreteDesignCurrentCodeOfStandard("EN") || IsConcreteDesignCurrentCodeOfStandard("NTC")) {
        surfaceSet.SetUserDefinedConcreteCover(0.035, 0.036);
    }
    surfaceSet.SetAssignments(2, 1);
    surfaceSet.SetConcreteDesignReinforcementDirections(2, 2);
    if (IsConcreteDesignCurrentCodeOfStandard("EN") || IsConcreteDesignCurrentCodeOfStandard("NTC")) {
        surfaceSet.SetConcreteDesignConcreteDurability(concreteDurability2.GetNo(), concreteDurability2.GetNo());
    }
    surfaceSet.SetConcreteDesignSurfaceReinforcement([1, 3, 5, 7]);
    surfaceSet.SetDeflectionAnalysis("CANTILEVER", "DEFORMED_USER_DEFINED_REFERENCE_PLANE", "MANUALLY", 5.0);
    surfaceSet.SetUserDefinedReferencePlane([-21.6, -3.7, 0, -19.6, -3.5, 0, -20.5, -2.5, 0]);
}   // RFEM

var t2 = new Date().getTime();
var time = (t2 - t1) / 1000;
console.log("Elapsed time: " + time + "s");