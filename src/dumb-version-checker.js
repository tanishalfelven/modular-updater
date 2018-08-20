"strict mode";
const Emitter = require("./emitter");
/**
 * This is a simple version checker. It is non-standard and is used for parsing
 * versions setup similar to https://docs.microsoft.com/en-us/dotnet/framework/app-domains/assembly-versioning
 * Valid:
 *      1.0.2.1234
 *      1.1.1.1
 *      0.0.0.0
 *      1.1.1.1-someData (metadata is ignored for comparisons)
 * Invalid:
 *      1.1.1 (must be 4 digits)
 *      1,0,9,1 (must separate by period)
 *      1a.0.1.234 (must not contain non-numeric characters except for metadata)
 */

/**
 * Returns version segment with any included metatdata removed ("1-dev" => "1")
 * @param {string} versionSegment segment of version string that optionally contains metadata. 
 */
function stripMetaData(versionSegment) {
    if (versionSegment.indexOf("-") >= 0) {
        return versionSegment.split("-")[0];
    }

    return versionSegment;
} 

/**
 * validates and parses version string to an array ("1.2.1.2345-dev" => [1, 2, 1, 2345])
 * @param {string} versionString
 */
function parse(versionString) {
    versionSegments = versionString.split(".");
    
    if (versionSegments.length !== 4) {
        throw "Version must have 4 segments";
    }

    versionSegments[3] = stripMetaData(versionSegments[3]);

    versionSegments.some((segment) => {
        if (isNaN(segment)) {
            throw `Version segment "${segment}" of version "${versionString}" is invalid.`;
        }
    });

    versionSegments = versionSegments.map((segment) => {
        return parseInt(segment);
    })

    return versionSegments;
}

function versionIsSame(version1, version2) {
    let sameCounter = 0;

    for (let i = 0; i < 4; i++) {
        if (version1[i] === version2[i]) {
            sameCounter++;
        }
    }

    return sameCounter === version1.length;
}

/**
 * Get downgrade of two versions. If neither version is a downgrade, return null;
 * Tricky because in cases of "1.1.1.2" vs "1.1.2.1" the second
 * @param {array} version1 
 * @param {array} version2 
 */
function getDowngrade(version1, version2) {
    for (let i = 0; i < 4; i++) {
        if (version1[i] < version2[i]) {
            return version1;
        }

        if (version2[i] < version1[i]) {
            return version2;
        }
    }

    return null;
}

function compareVersion(currentVersionString, newVersionString) {
    const currentVersion = parse(currentVersionString);
    const newVersion = parse(newVersionString);

    if (versionIsSame(currentVersion, newVersion)) {
        // versions are the same
        return 0;
    }

    if (getDowngrade(currentVersion, newVersion) === newVersion) {
        // newVersion is older than currentVersion
        return -1;
    }

    // newVersion is an upgrade from currentVersion
    return 1;
}

function isUpdate(currentVersion, newVersion) {
    return compareVersion(currentVersion.version, newVersion.version) === 1;
}

module.exports = class SemverChecker extends Emitter {
    needToUpdate(currentVersion, newVersion) {
        return isUpdate(currentVersion, newVersion) && oldVersionData.sha512 !== newVersionData.sha512;
    }
}
