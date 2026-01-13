// RFEM script to generate a grid of rectangular panels
// default units: meters

run("includes/Tools/clearAll.js");  // Clear the model first

// Parameters - will be provided by dialog
if (typeof panelHeight === "undefined") { panelHeight = 3.0; }
if (typeof panelWidth === "undefined") { panelWidth = 1.5; }
if (typeof numRows === "undefined") { numRows = 3; }
if (typeof numCols === "undefined") { numCols = 3; }

var nodeNumber = 1;
var lineNumber = 1;

// Create nodes for all grid points
for (var row = 0; row <= numRows; row++) {
    for (var col = 0; col <= numCols; col++) {
        var node = new Node();
        node.Standard(nodeNumber++, [col * panelWidth, 0, row * panelHeight]);
    }
}

// Calculate number of nodes per row for line creation
var nodesPerRow = numCols + 1;

// Create horizontal lines (left to right)
for (var row = 0; row <= numRows; row++) {
    for (var col = 0; col < numCols; col++) {
        var baseNode = row * nodesPerRow + col + 1;
        var line = new Line();
        line.Polyline(lineNumber++, [baseNode, baseNode + 1]);
    }
}

// Create vertical lines (bottom to top)
for (var col = 0; col <= numCols; col++) {
    for (var row = 0; row < numRows; row++) {
        var baseNode = row * nodesPerRow + col + 1;
        var line = new Line();
        line.Polyline(lineNumber++, [baseNode, baseNode + nodesPerRow]);
    }
}