// RFEM script: Select members by user input
// Inputs:
// - memberIdsInput: single number, comma list, or range (e.g. "1", "1,3,5", "10-20")

if (typeof memberIdsInput === "undefined") { memberIdsInput = "1"; }

function failAndExit(message) {
    console.log("ERROR: " + message);
    throw new Error(message);
}

function addUnique(list, value) {
    for (var i = 0; i < list.length; ++i) {
        if (list[i] === value) {
            return;
        }
    }
    list.push(value);
}

function parsePositiveInteger(value) {
    var parsed = parseInt(value, 10);
    if (isNaN(parsed) || parsed <= 0) {
        return undefined;
    }
    return parsed;
}

function parseMemberIds(input) {
    var ids = [];
    var invalidParts = [];

    if (Array.isArray(input)) {
        for (var i = 0; i < input.length; ++i) {
            var parsedArrayValue = parsePositiveInteger(input[i]);
            if (typeof parsedArrayValue === "undefined") {
                invalidParts.push(String(input[i]));
            }
            else {
                addUnique(ids, parsedArrayValue);
            }
        }
        return { ids: ids, invalidParts: invalidParts };
    }

    if (typeof input === "number") {
        var parsedNumber = parsePositiveInteger(input);
        if (typeof parsedNumber === "undefined") {
            invalidParts.push(String(input));
        }
        else {
            ids.push(parsedNumber);
        }
        return { ids: ids, invalidParts: invalidParts };
    }

    if (typeof input !== "string") {
        return { ids: ids, invalidParts: [String(input)] };
    }

    var trimmed = input.trim();
    if (trimmed.length === 0) {
        return { ids: ids, invalidParts: [] };
    }

    var segments = trimmed.split(",");

    for (var s = 0; s < segments.length; ++s) {
        var part = segments[s].trim();
        if (part.length === 0) {
            continue;
        }

        var rangeMatch = part.match(/^(\d+)\s*-\s*(\d+)$/);
        if (rangeMatch) {
            var start = parseInt(rangeMatch[1], 10);
            var end = parseInt(rangeMatch[2], 10);
            var step = start <= end ? 1 : -1;

            for (var memberNo = start; memberNo !== end + step; memberNo += step) {
                addUnique(ids, memberNo);
            }
            continue;
        }

        var parsedPart = parsePositiveInteger(part);
        if (typeof parsedPart === "undefined") {
            invalidParts.push(part);
        }
        else {
            addUnique(ids, parsedPart);
        }
    }

    return { ids: ids, invalidParts: invalidParts };
}

function setMemberSelectedFlag(member, selected) {
    if (!member) {
        return false;
    }

    try {
        if (typeof member.is_selected !== "undefined") {
            member.is_selected = selected;
            return true;
        }
    }
    catch (e1) {}

    try {
        if (typeof member.selected !== "undefined") {
            member.selected = selected;
            return true;
        }
    }
    catch (e2) {}

    return false;
}

function applySelection(memberNos) {
    var methodUsed = "";

    try {
        if (typeof members.select === "function") {
            members.select(memberNos);
            return { ok: true, method: "members.select" };
        }
    }
    catch (e1) {}

    try {
        if (typeof members.setSelected === "function") {
            members.setSelected(memberNos);
            return { ok: true, method: "members.setSelected" };
        }
    }
    catch (e2) {}

    try {
        if (typeof selectObjects === "function") {
            selectObjects("members", memberNos);
            return { ok: true, method: "selectObjects" };
        }
    }
    catch (e3) {}

    try {
        if (typeof select_objects === "function") {
            select_objects("members", memberNos);
            return { ok: true, method: "select_objects" };
        }
    }
    catch (e4) {}

    var selectedByFlag = 0;
    for (var i = 0; i < memberNos.length; ++i) {
        var memberNo = memberNos[i];
        try {
            if (setMemberSelectedFlag(members[memberNo], true)) {
                selectedByFlag += 1;
            }
        }
        catch (e5) {}
    }

    if (selectedByFlag > 0) {
        methodUsed = "member.selected/member.is_selected";
        return { ok: true, method: methodUsed, selectedCount: selectedByFlag };
    }

    return { ok: false, method: "none" };
}

var parsedMembers = parseMemberIds(memberIdsInput);
if (parsedMembers.invalidParts.length > 0) {
    console.log("ERROR: Invalid member input part(s): " + parsedMembers.invalidParts.join(", "));
}

if (parsedMembers.ids.length === 0) {
    failAndExit("No valid member IDs were provided.");
}

var validMemberNos = [];
var invalidMemberNos = [];

for (var i = 0; i < parsedMembers.ids.length; ++i) {
    var memberNo = parsedMembers.ids[i];
    if (!members.exist(memberNo)) {
        invalidMemberNos.push(memberNo);
        console.log("ERROR: Member no. " + memberNo + " does not exist. Skipped.");
        continue;
    }
    validMemberNos.push(memberNo);
}

if (validMemberNos.length === 0) {
    failAndExit("No existing members were found for the provided IDs.");
}

var selectionResult = applySelection(validMemberNos);
if (!selectionResult.ok) {
    failAndExit("Could not apply selection. This RFEM scripting environment may not expose a member selection API.");
}

console.log("Member selection finished.");
console.log("Selection method: " + selectionResult.method);
console.log("Members requested: " + parsedMembers.ids.length + " (" + parsedMembers.ids.join(", ") + ")");
console.log("Members selected (existing): " + validMemberNos.length + " (" + validMemberNos.join(", ") + ")");
console.log("Members failed: " + invalidMemberNos.length + (invalidMemberNos.length > 0 ? " (" + invalidMemberNos.join(", ") + ")" : ""));