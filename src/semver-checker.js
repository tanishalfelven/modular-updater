"strict mode";
const Emitter = require("./emitter");
const semver = require("semver");

function versionNumberIsUpdated(oldVersion, newVersion) {
    return semver.compare(oldVersion, newVersion) === -1;
}

module.exports = class SemverChecker extends Emitter {
    needToUpdate(oldVersionData, newVersionData) {
        // always return true if there is no previous version data
        if (!oldVersionData) {
            return true;
        }

        return versionNumberIsUpdated(oldVersionData.version, newVersionData.version) 
            && oldVersionData.sha512 !== newVersionData.sha512;
    }
}
