// RFEM script to create straight lines between closest nodes
// Maximum 2 lines can attach to a single node
// Will not connect the first and last nodes (furthest apart)
// Input: "1-10" (range) or "1,2,3,4,5" (comma-separated) - must use quotes in dialog

// Work in Progress.

/**
 * Parse node list input - supports range and comma-separated formats
 * @param {String|Array} input Node list as "1-10" or "1,2,3,4" or array [1,2,3]
 * @returns {Array} Array of node numbers
 */
function parseNodeList(input) {
    console.log("parseNodeList called with input:", input);
    console.log("Input type:", typeof input);
    
    // If already an array, return it
    if (Array.isArray(input)) {
        console.log("Input is already an array");
        return input;
    }
    
    // Convert to string if it's a number
    if (typeof input === "number") {
        console.log("Input is a number, converting to string");
        input = String(input);
    }
    
    // If string, parse it
    if (typeof input === "string") {
        var trimmed = input.trim();
        console.log("Trimmed input string: '" + trimmed + "'");
        
        // Check for range format: "1-10"
        var rangeMatch = trimmed.match(/^(\d+)\s*-\s*(\d+)$/);
        if (rangeMatch) {
            console.log("Matched range format");
            var start = parseInt(rangeMatch[1]);
            var end = parseInt(rangeMatch[2]);
            var result = [];
            
            if (start <= end) {
                for (var i = start; i <= end; i++) {
                    result.push(i);
                }
            } else {
                for (var i = start; i >= end; i--) {
                    result.push(i);
                }
            }
            console.log("Parsed range '" + trimmed + "' to: [" + result.join(", ") + "]");
            return result;
        }
        
        // Check for comma-separated format: "1,2,3,4"
        if (trimmed.indexOf(",") !== -1) {
            console.log("Matched comma-separated format");
            var parts = trimmed.split(",");
            var result = [];
            for (var i = 0; i < parts.length; i++) {
                var numStr = parts[i].trim();
                var num = parseInt(numStr);
                if (!isNaN(num)) {
                    result.push(num);
                } else {
                    console.log("Warning: Could not parse '" + numStr + "' as a number");
                }
            }
            console.log("Parsed comma-separated list '" + trimmed + "' to: [" + result.join(", ") + "]");
            return result;
        }
        
        // Single number
        var singleNum = parseInt(trimmed);
        if (!isNaN(singleNum)) {
            console.log("Parsed single number: " + singleNum);
            return [singleNum];
        }
    }
    
    // If not recognized format, return empty array
    console.log("ERROR: Could not parse input. Input was:", input);
    console.log("Please use quotes in the dialog: \"1-10\" or \"1,2,3,4\"");
    return [];
}

/**
 * Calculate Euclidean distance between two nodes
 * @param {Object} node1 First node object
 * @param {Object} node2 Second node object
 * @returns {Number} Distance between nodes
 */
function calculateDistance(node1, node2) {
    var dx = node1.coordinate_1 - node2.coordinate_1;
    var dy = node1.coordinate_2 - node2.coordinate_2;
    var dz = node1.coordinate_3 - node2.coordinate_3;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Check if a line already exists between two nodes
 * @param {Number} node1No First node number
 * @param {Number} node2No Second node number
 * @returns {Boolean} True if line exists
 */
function lineExists(node1No, node2No) {
    var lineCount = lines.count();
    for (var i = 1; i <= lineCount; i++) {
        if (lines.exist(i)) {
            var line = lines[i];
            var defNodes = line.definition_nodes;
            if (defNodes.length >= 2) {
                var n1 = (typeof defNodes[0] === 'object' && defNodes[0].no) ? defNodes[0].no : defNodes[0];
                var n2 = (typeof defNodes[1] === 'object' && defNodes[1].no) ? defNodes[1].no : defNodes[1];
                
                if ((n1 === node1No && n2 === node2No) || (n1 === node2No && n2 === node1No)) {
                    return true;
                }
            }
        }
    }
    return false;
}

/**
 * Find the two furthest nodes in the list
 * @param {Array} nodeList List of node numbers
 * @returns {Object} Object with node1 and node2 properties
 */
function findFurthestNodes(nodeList) {
    var maxDistance = 0;
    var furthestPair = { node1: null, node2: null };
    
    for (var i = 0; i < nodeList.length; i++) {
        var nodeNo1 = nodeList[i];
        if (!nodes.exist(nodeNo1)) continue;
        var node1 = nodes[nodeNo1];
        
        for (var j = i + 1; j < nodeList.length; j++) {
            var nodeNo2 = nodeList[j];
            if (!nodes.exist(nodeNo2)) continue;
            var node2 = nodes[nodeNo2];
            
            var distance = calculateDistance(node1, node2);
            if (distance > maxDistance) {
                maxDistance = distance;
                furthestPair.node1 = nodeNo1;
                furthestPair.node2 = nodeNo2;
            }
        }
    }
    
    return furthestPair;
}

// Parameters - will be provided by dialog or can be hardcoded
// Use nodeListInput from dialog, fallback to nodeList for backward compatibility
var inputValue = (typeof nodeListInput !== "undefined") ? nodeListInput : nodeList;

console.log("=== INPUT PARSING ===");
console.log("Initial input value:", inputValue);
console.log("Input type:", typeof inputValue);

if (typeof inputValue === "undefined") { 
    // If not defined, use all existing nodes
    nodeList = [];
    var nodeCount = nodes.count();
    for (var i = 1; i <= nodeCount; i++) {
        if (nodes.exist(i)) {
            nodeList.push(i);
        }
    }
    console.log("No input provided, using all existing nodes");
} else {
    // Parse the input (supports "1-10" or "1,2,3,4")
    nodeList = parseNodeList(inputValue);
}

console.log("Final node list: [" + nodeList.join(", ") + "]");
console.log("Node list length: " + nodeList.length);
console.log("=== END INPUT PARSING ===\n");

// Check if we have valid nodes
if (nodeList.length === 0) {
    console.log("ERROR: No valid nodes found in input.");
    console.log("Please provide nodes in format: \"1-10\" or \"1,2,3,4\" (with quotes)");
    throw new Error("No valid nodes found in input");
}

// Main algorithm
console.log("Starting to create lines between closest nodes...");
console.log("Processing " + nodeList.length + " nodes");

// Find the furthest pair to exclude
var furthestPair = findFurthestNodes(nodeList);
console.log("Furthest nodes: " + furthestPair.node1 + " and " + furthestPair.node2 + " (will not be connected)");

// Track connection count for each node
var connectionCount = {};
for (var i = 0; i < nodeList.length; i++) {
    connectionCount[nodeList[i]] = 0;
}

// Store node pairs with their distances
var nodePairs = [];

// Calculate distances between all node pairs
for (var i = 0; i < nodeList.length; i++) {
    var nodeNo1 = nodeList[i];
    if (!nodes.exist(nodeNo1)) {
        console.log("Warning: Node " + nodeNo1 + " does not exist, skipping");
        continue;
    }
    var node1 = nodes[nodeNo1];
    
    for (var j = i + 1; j < nodeList.length; j++) {
        var nodeNo2 = nodeList[j];
        if (!nodes.exist(nodeNo2)) {
            continue;
        }
        var node2 = nodes[nodeNo2];
        
        var distance = calculateDistance(node1, node2);
        nodePairs.push({
            node1: nodeNo1,
            node2: nodeNo2,
            distance: distance
        });
    }
}

// Sort pairs by distance (closest first)
nodePairs.sort(function(a, b) {
    return a.distance - b.distance;
});

// Create lines, respecting the max 2 connections per node rule
var lineNumber = lines.count() + 1;
var linesCreated = 0;

for (var i = 0; i < nodePairs.length; i++) {
    var pair = nodePairs[i];
    
    // Skip if this is the furthest pair
    if ((pair.node1 === furthestPair.node1 && pair.node2 === furthestPair.node2) ||
        (pair.node1 === furthestPair.node2 && pair.node2 === furthestPair.node1)) {
        console.log("Skipping furthest pair: nodes " + pair.node1 + " and " + pair.node2);
        continue;
    }
    
    // Check if both nodes can accept another connection
    if (connectionCount[pair.node1] < 2 && connectionCount[pair.node2] < 2) {
        // Check if line doesn't already exist
        if (!lineExists(pair.node1, pair.node2)) {
            // Create the line
            var line = new Line();
            line.Polyline(lineNumber, [pair.node1, pair.node2]);
            
            // Update connection counts
            connectionCount[pair.node1]++;
            connectionCount[pair.node2]++;
            
            console.log("Created line " + lineNumber + " between nodes " + pair.node1 + " and " + pair.node2 + 
                       " (distance: " + pair.distance.toFixed(3) + "m)");
            
            lineNumber++;
            linesCreated++;
        }
    }
    
    // Optional: Stop if all nodes have 2 connections
    var allNodesConnected = true;
    for (var key in connectionCount) {
        if (connectionCount[key] < 2) {
            allNodesConnected = false;
            break;
        }
    }
    if (allNodesConnected) {
        console.log("All nodes have reached maximum connections (2)");
        break;
    }
}

console.log("Finished creating lines");
console.log("Total lines created: " + linesCreated);
console.log("Connection summary:");
for (var nodeNo in connectionCount) {
    console.log("  Node " + nodeNo + ": " + connectionCount[nodeNo] + " connection(s)");
}
