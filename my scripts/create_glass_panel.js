// RFEM script to generate a rectangle with lines joining the four nodes.
// default units : meters

run("includes/Tools/clearAll.js");  // Clear the model first

// Parameters - height and width will be provided by dialog
if (typeof height === "undefined") { height = 3.0; }
if (typeof width === "undefined") { width = 1.5; }
var thickness = 0.016;  // 16mm thickness
var materialName = "Laminated heat-strengthened glass";

// Create material and thickness
var material = new Material(1, materialName);
var glassThickness = new Thickness();
glassThickness.Uniform(1, "Glass thickness", material.GetNo(), thickness);

// Create nodes at the corners of the rectangle
var node1 = new Node();
node1.Standard(1, [0, 0, 0]);           // top-left
var node2 = new Node();
node2.Standard(2, [width, 0, 0]);       // top-right
var node3 = new Node();
node3.Standard(3, [width, 0, height]);  // bottom-right
var node4 = new Node();
node4.Standard(4, [0, 0, height]);      // bottom-left

// Create lines between the nodes to form the rectangle
var line1 = new Line();
line1.Polyline(1, [1, 2]);  // top edge
var line2 = new Line();
line2.Polyline(2, [2, 3]);  // right edge
var line3 = new Line();
line3.Polyline(3, [3, 4]);  // bottom edge
var line4 = new Line();
line4.Polyline(4, [4, 1]);  // left edge

// Create surface using the four lines and thickness
var surface = new Surface();
surface.Standard(1, [1, 2, 3, 4], glassThickness.GetNo());