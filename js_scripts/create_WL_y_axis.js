// RFEM script to generate a load on y axis on an existing surface. Input are surface number, load in kN/m2.
// Work In Progress -- DO NOT USE YET.

// Parameters - will be provided by dialog
if (typeof surfaceNumber === "undefined") { surfaceNumber = 1; }
if (typeof loadValue === "undefined") { loadValue = 1.5; }

// Get the current load case
var lc = LoadCase(undefined);

// Create surface load in Y direction (uniform force)
var surfaceLoad = new SurfaceLoad();
surfaceLoad.Force(undefined, lc, [surfaceNumber], "UNIFORM", [Number(loadValue)], "GLOBAL_Y_OR_USER_DEFINED_V_TRUE");
