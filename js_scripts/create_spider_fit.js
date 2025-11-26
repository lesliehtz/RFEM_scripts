// RFEM script to generate support conditions for a spider glass. 
// Inputs: surface number.

// process descriptions : from surface number, get the nodes at the corners of the surface
// then create nodes inside glass that are 100 mm (both axis) from corners nodes.
// create 4 supports at those nodes with all translation fixed, rotation free

// Parameters - will be provided by dialog
if (typeof surfaceNumber === "undefined") { surfaceNumber = 1; }
if (typeof zAxisUpward === "undefined") { zAxisUpward = false; }

// Distance from corner for spider fitting (in meters)
var spiderOffset = 0.1;  // 100mm

// Get the surface by index
var surface = surfaces[surfaceNumber];
if (!surface) {
    console.log("Error: Surface " + surfaceNumber + " not found");
    throw new Error("Surface not found");
}

// Get boundary lines of the surface
var boundaryLines = surface.boundary_lines;

// Get all unique corner nodes from boundary lines
var cornerNodes = [];
var nodeSet = {};  // Use object instead of Set for compatibility

for (var i = 0; i < boundaryLines.length; i++) {
    var lineObj = boundaryLines[i];
    // Extract line number from line object
    var lineNo = (typeof lineObj === 'object' && lineObj.no) ? lineObj.no : lineObj;
    
    var line = lines[lineNo];
    
    if (!line) {
        console.log("Warning: Line " + lineNo + " not found, skipping");
        continue;
    }
    
    // Get definition nodes (start and end) of each line
    var definitionNodes = line.definition_nodes;
    
    for (var j = 0; j < definitionNodes.length; j++) {
        var nodeObj = definitionNodes[j];
        // Extract node number from node object
        var nodeNo = (typeof nodeObj === 'object' && nodeObj.no) ? nodeObj.no : nodeObj;
        
        if (!nodeSet[nodeNo]) {
            nodeSet[nodeNo] = true;
            var node = nodes[nodeNo];
            if (node) {
                cornerNodes.push(node);
            }
        }
    }
}

// Verify we have 4 corners for a rectangular surface
if (cornerNodes.length !== 4) {
    console.log("Warning: Expected 4 corner nodes, found " + cornerNodes.length);
}

// Calculate center point of the surface (geometric centroid)
var centerX = 0, centerY = 0, centerZ = 0;
for (var i = 0; i < cornerNodes.length; i++) {
    centerX += cornerNodes[i].coordinate_1;
    centerY += cornerNodes[i].coordinate_2;
    centerZ += cornerNodes[i].coordinate_3;
}
centerX /= cornerNodes.length;
centerY /= cornerNodes.length;
centerZ /= cornerNodes.length;

// Sort corner nodes to identify corners properly (bottom-left, bottom-right, top-right, top-left)
// Assuming surface is in XZ plane (Y is constant)
cornerNodes.sort(function(a, b) {
    // Sort by Z first (height), then by X (width)
    if (Math.abs(a.coordinate_3 - b.coordinate_3) > 0.001) {
        return a.coordinate_3 - b.coordinate_3;
    }
    return a.coordinate_1 - b.coordinate_1;
});

// Create spider fitting nodes (offset from corners toward center)
var spiderNodes = [];
var startNodeNumber = nodes.count() + 1;

// Define offset directions for each corner (inward along edges)
// After sorting: [0] = bottom-left, [1] = bottom-right, [2] = top-left, [3] = top-right
// Bottom nodes need +Z (upward), top nodes need -Z (downward)
var offsetDirections = [
    [1, 0, 1],    // bottom-left corner: +X (right), +Z (up)
    [-1, 0, 1],   // bottom-right corner: -X (left), +Z (up)
    [1, 0, -1],   // top-left corner: +X (right), -Z (down)
    [-1, 0, -1]   // top-right corner: -X (left), -Z (down)
];

// Tolerance for comparing node positions (in meters)
var positionTolerance = 0.001;  // 1mm tolerance

for (var i = 0; i < cornerNodes.length; i++) {
    var corner = cornerNodes[i];
    var direction = offsetDirections[i];
    
    // Calculate new node position (100mm from corner along both surface axes)
    var newX = corner.coordinate_1 + direction[0] * spiderOffset;
    var newY = corner.coordinate_2 + direction[1] * spiderOffset;
    var newZ = corner.coordinate_3 + direction[2] * spiderOffset;
    
    // Check if a node already exists at this location
    var existingNodeNo = null;
    var nodeCount = nodes.count();
    
    for (var j = 1; j <= nodeCount; j++) {
        if (nodes.exist(j)) {
            var existingNode = nodes[j];
            var dx = Math.abs(existingNode.coordinate_1 - newX);
            var dy = Math.abs(existingNode.coordinate_2 - newY);
            var dz = Math.abs(existingNode.coordinate_3 - newZ);
            
            // Check if node is at the same location (within tolerance)
            if (dx < positionTolerance && dy < positionTolerance && dz < positionTolerance) {
                existingNodeNo = j;
                break;
            }
        }
    }
    
    // Delete existing node if found
    if (existingNodeNo !== null) {
        try {
            nodes.erase(existingNodeNo);
            console.log("Deleted existing node " + existingNodeNo + " at spider location");
        } catch (e) {
            console.log("Warning: Could not delete node " + existingNodeNo + " - it may be in use");
        }
    }
    
    // Create new node using Standard method
    var spiderNode = new Node();
    spiderNode.Standard(startNodeNumber + i, [newX, newY, newZ]);
    spiderNodes.push(startNodeNumber + i);
}

// Create nodal supports at spider fitting positions with different conditions per corner
// After sorting: [0] = bottom-left, [1] = bottom-right, [2] = top-left, [3] = top-right
// Support assignment depends on Z axis direction
var supportNames = ["", "", "", ""];
for (var i = 0; i < spiderNodes.length; i++) {
    var support = new NodalSupport(undefined, [spiderNodes[i]]);
    
    // Determine which corners get which support type based on Z direction
    var pinnedCorner = zAxisUpward ? 2 : 0;     // Top-left if Z up, Bottom-left if Z down
    var zyCorner = zAxisUpward ? 3 : 1;         // Top-right if Z up, Bottom-right if Z down
    var xyCorner = zAxisUpward ? 0 : 2;         // Bottom-left if Z up, Top-left if Z down
    var windCorner = zAxisUpward ? 1 : 3;       // Bottom-right if Z up, Top-right if Z down
    
    if (i === pinnedCorner) {
        // Pinned support: Fixed translations (X, Y, Z), Free rotations (φx, φy, φz)
        support.Translation(true, true, true);
        support.Rotation(false, false, false);
        supportNames[i] = "PINNED";
    }
    else if (i === zyCorner) {
        // Z+Y support: Fixed on Z and Y translation only
        support.Translation(false, true, true);  // X free, Y fixed, Z fixed
        support.Rotation(false, false, false);
        supportNames[i] = "Z+Y";
    }
    else if (i === xyCorner) {
        // X+Y support: Fixed on X and Y translation only
        support.Translation(true, true, false);  // X fixed, Y fixed, Z free
        support.Rotation(false, false, false);
        supportNames[i] = "X+Y";
    }
    else if (i === windCorner) {
        // Wind support: Fixed on Y translation only
        support.Translation(false, true, false);  // X free, Y fixed, Z free
        support.Rotation(false, false, false);
        supportNames[i] = "WIND";
    }
}

console.log("Spider fitting created for surface " + surfaceNumber + ":");
console.log("  - " + spiderNodes.length + " spider nodes created (100mm inset from corners)");
console.log("  - Support configuration: " + supportNames.join(", "));
console.log("  - Z axis: " + (zAxisUpward ? "Upward" : "Downward"));