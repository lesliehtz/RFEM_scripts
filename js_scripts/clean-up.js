if (!RFEM) {
	throw new Error("This cleanup script is only for RFEM.");
}

var cleanupTolerance = 1e-9;

function getObjectNo(object) {
	if (typeof object === "undefined" || object === null) {
		return undefined;
	}

	if (typeof object === "number") {
		return object;
	}

	if (typeof object.no !== "undefined") {
		return object.no;
	}

	return undefined;
}

function getLineNoFromMember(member) {
	if (typeof member.line === "undefined" || member.line === null) {
		return undefined;
	}

	return getObjectNo(member.line);
}

function getObjectNos(objects) {
	if (!Array.isArray(objects)) {
		return [];
	}

	var objectNos = [];

	for (var i = 0; i < objects.length; ++i) {
		var objectNo = getObjectNo(objects[i]);
		if (typeof objectNo !== "undefined") {
			objectNos.push(objectNo);
		}
	}

	return objectNos;
}

function getNodeCoordinates(nodeNo) {
	if (typeof nodeNo === "undefined" || !nodes.exist(nodeNo)) {
		return undefined;
	}

	var node = nodes[nodeNo];
	return [node.coordinate_1, node.coordinate_2, node.coordinate_3];
}

function squaredDistance(a, b) {
	var dx = a[0] - b[0];
	var dy = a[1] - b[1];
	var dz = a[2] - b[2];
	return dx * dx + dy * dy + dz * dz;
}

function linePathLength(line) {
	if (typeof line === "undefined" || line === null) {
		return 0.0;
	}

	if (line.type === lines.TYPE_CIRCLE) {
		return typeof line.circle_radius === "number" ? Math.abs(line.circle_radius) : Number.POSITIVE_INFINITY;
	}

	if (line.type === lines.TYPE_ELLIPTICAL_ARC) {
		return Number.POSITIVE_INFINITY;
	}

	if (!Array.isArray(line.definition_nodes) || line.definition_nodes.length < 2) {
		return 0.0;
	}

	var totalLength = 0.0;

	for (var i = 0; i < line.definition_nodes.length - 1; ++i) {
		var startNodeNo = getObjectNo(line.definition_nodes[i]);
		var endNodeNo = getObjectNo(line.definition_nodes[i + 1]);

		if (typeof startNodeNo === "undefined" || typeof endNodeNo === "undefined") {
			return 0.0;
		}

		var startCoordinates = getNodeCoordinates(startNodeNo);
		var endCoordinates = getNodeCoordinates(endNodeNo);

		if (typeof startCoordinates === "undefined" || typeof endCoordinates === "undefined") {
			return 0.0;
		}

		totalLength += Math.sqrt(squaredDistance(startCoordinates, endCoordinates));
	}

	return totalLength;
}

function getBoundaryTerminalNodeNos(line) {
	if (typeof line === "undefined" || line === null) {
		return undefined;
	}

	if (!Array.isArray(line.definition_nodes) || line.definition_nodes.length < 2) {
		return undefined;
	}

	var startNodeNo = getObjectNo(line.definition_nodes[0]);
	var endNodeNo = getObjectNo(line.definition_nodes[line.definition_nodes.length - 1]);

	if (typeof startNodeNo === "undefined" || typeof endNodeNo === "undefined") {
		return undefined;
	}

	return [startNodeNo, endNodeNo];
}

function arePointsCollinear(pointA, pointB, pointC) {
	var abx = pointB[0] - pointA[0];
	var aby = pointB[1] - pointA[1];
	var abz = pointB[2] - pointA[2];
	var acx = pointC[0] - pointA[0];
	var acy = pointC[1] - pointA[1];
	var acz = pointC[2] - pointA[2];
	var crossX = aby * acz - abz * acy;
	var crossY = abz * acx - abx * acz;
	var crossZ = abx * acy - aby * acx;
	return crossX * crossX + crossY * crossY + crossZ * crossZ <= cleanupTolerance * cleanupTolerance;
}

function isZeroAreaFromBoundaryNodes(nodeNos) {
	if (nodeNos.length < 3) {
		return true;
	}

	var coordinates = [];

	for (var i = 0; i < nodeNos.length; ++i) {
		var nodeCoordinates = getNodeCoordinates(nodeNos[i]);
		if (typeof nodeCoordinates === "undefined") {
			return true;
		}
		coordinates.push(nodeCoordinates);
	}

	var firstPoint = coordinates[0];
	var secondPoint = undefined;

	for (var secondIndex = 1; secondIndex < coordinates.length; ++secondIndex) {
		if (squaredDistance(firstPoint, coordinates[secondIndex]) > cleanupTolerance * cleanupTolerance) {
			secondPoint = coordinates[secondIndex];
			break;
		}
	}

	if (typeof secondPoint === "undefined") {
		return true;
	}

	for (var pointIndex = 1; pointIndex < coordinates.length; ++pointIndex) {
		if (!arePointsCollinear(firstPoint, secondPoint, coordinates[pointIndex])) {
			return false;
		}
	}

	return true;
}

function inspectSurfaceBoundary(surface, invalidLineLookup) {
	var boundaryLineNos = getObjectNos(surface.boundary_lines);
	if (boundaryLineNos.length === 0) {
		return {
			hasBoundaryLines: false,
			missingOrInvalidLine: false,
			closedLoopCheckApplicable: false,
			isClosedLoop: false,
			uniqueNodeNos: []
		};
	}

	var degreeByNode = {};
	var uniqueNodeLookup = {};
	var uniqueNodeNos = [];
	var closedLoopCheckApplicable = true;

	for (var i = 0; i < boundaryLineNos.length; ++i) {
		var lineNo = boundaryLineNos[i];

		if (invalidLineLookup[lineNo] || !lines.exist(lineNo)) {
			return {
				hasBoundaryLines: true,
				missingOrInvalidLine: true,
				closedLoopCheckApplicable: false,
				isClosedLoop: false,
				uniqueNodeNos: []
			};
		}

		var terminalNodeNos = getBoundaryTerminalNodeNos(lines[lineNo]);
		if (typeof terminalNodeNos === "undefined") {
			closedLoopCheckApplicable = false;
			continue;
		}

		for (var nodeIndex = 0; nodeIndex < terminalNodeNos.length; ++nodeIndex) {
			var nodeNo = terminalNodeNos[nodeIndex];
			degreeByNode[nodeNo] = (degreeByNode[nodeNo] || 0) + 1;
			if (!uniqueNodeLookup[nodeNo]) {
				uniqueNodeLookup[nodeNo] = true;
				uniqueNodeNos.push(nodeNo);
			}
		}
	}

	var isClosedLoop = false;
	if (closedLoopCheckApplicable && uniqueNodeNos.length > 0) {
		isClosedLoop = uniqueNodeNos.length >= 3;
		for (var nodeNoKey in degreeByNode) {
			if (degreeByNode[nodeNoKey] !== 2) {
				isClosedLoop = false;
				break;
			}
		}
	}

	return {
		hasBoundaryLines: true,
		missingOrInvalidLine: false,
		closedLoopCheckApplicable: closedLoopCheckApplicable,
		isClosedLoop: isClosedLoop,
		uniqueNodeNos: uniqueNodeNos
	};
}

function shouldDeleteLine(line) {
	if (typeof line === "undefined" || line === null) {
		return true;
	}

	if (line.type === lines.TYPE_CIRCLE) {
		return typeof line.circle_radius === "number" && Math.abs(line.circle_radius) <= cleanupTolerance;
	}

	if (line.type === lines.TYPE_ELLIPTICAL_ARC) {
		return false;
	}

	return linePathLength(line) <= cleanupTolerance;
}

function shouldDeleteMember(member, invalidLineLookup) {
	if (typeof member === "undefined" || member === null) {
		return true;
	}

	var memberLineNo = getLineNoFromMember(member);
	if (typeof memberLineNo === "undefined") {
		return true;
	}

	if (invalidLineLookup[memberLineNo]) {
		return true;
	}

	if (!lines.exist(memberLineNo)) {
		return true;
	}

	return linePathLength(lines[memberLineNo]) <= cleanupTolerance;
}

function shouldDeleteSurface(surface, invalidLineLookup) {
	if (typeof surface === "undefined" || surface === null) {
		return true;
	}

	var boundary = inspectSurfaceBoundary(surface, invalidLineLookup);

	if (!boundary.hasBoundaryLines) {
		return true;
	}

	if (boundary.missingOrInvalidLine) {
		return true;
	}

	if (boundary.closedLoopCheckApplicable && !boundary.isClosedLoop) {
		return true;
	}

	if (boundary.closedLoopCheckApplicable && isZeroAreaFromBoundaryNodes(boundary.uniqueNodeNos)) {
		return true;
	}

	return false;
}

function eraseObjects(container, objectNos) {
	for (var i = objectNos.length - 1; i >= 0; --i) {
		try {
			container.erase(objectNos[i]);
		}
		catch (err) {
		}
	}
}

var linesToDelete = [];
var invalidLineLookup = {};

for (var lineIndex = 1; lineIndex <= lines.count(); ++lineIndex) {
	var lineNo = lines.getNthObjectId(lineIndex);
	var line = lines[lineNo];

	if (shouldDeleteLine(line)) {
		linesToDelete.push(lineNo);
		invalidLineLookup[lineNo] = true;
	}
}

var membersToDelete = [];

for (var memberIndex = 1; memberIndex <= members.count(); ++memberIndex) {
	var memberNo = members.getNthObjectId(memberIndex);
	var member = members[memberNo];

	if (shouldDeleteMember(member, invalidLineLookup)) {
		membersToDelete.push(memberNo);
	}
}

var surfacesToDelete = [];

for (var surfaceIndex = 1; surfaceIndex <= surfaces.count(); ++surfaceIndex) {
	var surfaceNo = surfaces.getNthObjectId(surfaceIndex);
	var surface = surfaces[surfaceNo];

	if (shouldDeleteSurface(surface, invalidLineLookup)) {
		surfacesToDelete.push(surfaceNo);
	}
}

eraseObjects(members, membersToDelete);
eraseObjects(surfaces, surfacesToDelete);
eraseObjects(lines, linesToDelete);

console.log("Cleanup finished. Deleted: " + membersToDelete.length + " members, " + surfacesToDelete.length + " surfaces, " + linesToDelete.length + " lines.");
