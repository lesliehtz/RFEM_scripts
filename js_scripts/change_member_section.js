// RFEM script: Assign one section to selected members
// Inputs:
// - memberIdsInput: single number, comma list, or range (e.g. "1", "1,3,5", "10-20")
// - sectionIdInput: exactly one section number

if (typeof memberIdsInput === "undefined") { memberIdsInput = "1"; }
if (typeof sectionIdInput === "undefined") { sectionIdInput = "1"; }

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

function parseSingleSectionId(input) {
    if (Array.isArray(input)) {
        if (input.length !== 1) {
            return { ok: false, message: "Only one section ID is allowed." };
        }
        return parseSingleSectionId(input[0]);
    }

    if (typeof input === "number") {
        var parsedNumber = parsePositiveInteger(input);
        if (typeof parsedNumber === "undefined") {
            return { ok: false, message: "Section ID must be a positive integer." };
        }
        return { ok: true, value: parsedNumber };
    }

    if (typeof input !== "string") {
        return { ok: false, message: "Section ID must be a single number." };
    }

    var trimmed = input.trim();
    if (trimmed.length === 0) {
        return { ok: false, message: "Section ID is empty." };
    }

    if (trimmed.indexOf(",") !== -1 || trimmed.match(/^\d+\s*-\s*\d+$/)) {
        return { ok: false, message: "Only one section ID is allowed. Multiple values or ranges are not supported." };
    }

    var parsed = parsePositiveInteger(trimmed);
    if (typeof parsed === "undefined") {
        return { ok: false, message: "Section ID must be a positive integer." };
    }

    return { ok: true, value: parsed };
}

function getReferenceNo(reference) {
    if (typeof reference === "number") {
        return reference;
    }

    if (typeof reference === "object" && reference !== null && typeof reference.no !== "undefined") {
        return reference.no;
    }

    return undefined;
}

function assignSectionToMember(member, sectionNo) {
    var updateAttempts = [
        function () {
            member.section_start = sectionNo;
            member.section_end = sectionNo;
            if (typeof member.section_internal !== "undefined") {
                member.section_internal = sectionNo;
            }
        },
        function () {
            member.section_start = sections[sectionNo];
            member.section_end = sections[sectionNo];
            if (typeof member.section_internal !== "undefined") {
                member.section_internal = sections[sectionNo];
            }
        },
        function () {
            member.section_start = sectionNo;
        },
        function () {
            member.section_start = sections[sectionNo];
        }
    ];

    var lastError = undefined;

    for (var i = 0; i < updateAttempts.length; ++i) {
        try {
            if (typeof members.SECTION_DISTRIBUTION_TYPE_UNIFORM !== "undefined") {
                member.section_distribution_type = members.SECTION_DISTRIBUTION_TYPE_UNIFORM;
            }

            updateAttempts[i]();

            var assignedSectionNo = getReferenceNo(member.section_start);
            if (assignedSectionNo === sectionNo) {
                return { ok: true };
            }
        }
        catch (e) {
            lastError = e;
        }
    }

    return { ok: false, error: lastError };
}

var parsedSection = parseSingleSectionId(sectionIdInput);
if (!parsedSection.ok) {
    failAndExit(parsedSection.message);
}

var sectionNo = parsedSection.value;
if (!sections.exist(sectionNo)) {
    failAndExit("Section no. " + sectionNo + " does not exist. No members were changed.");
}

var parsedMembers = parseMemberIds(memberIdsInput);
if (parsedMembers.invalidParts.length > 0) {
    console.log("ERROR: Invalid member input part(s): " + parsedMembers.invalidParts.join(", "));
}

if (parsedMembers.ids.length === 0) {
    failAndExit("No valid member IDs were provided.");
}

var updatedMemberNos = [];
var invalidMemberNos = [];

for (var i = 0; i < parsedMembers.ids.length; ++i) {
    var memberNo = parsedMembers.ids[i];

    if (!members.exist(memberNo)) {
        invalidMemberNos.push(memberNo);
        console.log("ERROR: Member no. " + memberNo + " does not exist. Skipped.");
        continue;
    }

    try {
        var member = members[memberNo];
        var updateResult = assignSectionToMember(member, sectionNo);
        if (!updateResult.ok) {
            invalidMemberNos.push(memberNo);
            console.log("ERROR: Failed to update member no. " + memberNo + (updateResult.error ? ". " + updateResult.error : "."));
            continue;
        }

        updatedMemberNos.push(memberNo);
    }
    catch (e) {
        invalidMemberNos.push(memberNo);
        console.log("ERROR: Failed to update member no. " + memberNo + ". " + e);
    }
}

console.log("Section update finished.");
console.log("Section used: " + sectionNo);
console.log("Members updated: " + updatedMemberNos.length + (updatedMemberNos.length > 0 ? " (" + updatedMemberNos.join(", ") + ")" : ""));
console.log("Members failed: " + invalidMemberNos.length + (invalidMemberNos.length > 0 ? " (" + invalidMemberNos.join(", ") + ")" : ""));

if (updatedMemberNos.length === 0) {
    failAndExit("No members were updated.");
}
