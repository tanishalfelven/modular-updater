"strict mode";
const semver = require("semver");

function versionNumberIsUpdated(oldVersion, newVersion) {
    return semver.compare(oldVersion, newVersion) === -1;
}

module.exports = class JsonVersionChecker extends require("./emitter") {
    checkVersion(oldVersionData, newVersionData) {
        return versionNumberIsUpdated(oldVersionData.version, newVersionData.version) 
            && oldVersionData.sha !== newVersionData.sha;
    }
}
