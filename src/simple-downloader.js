"strict mode";
const fs       = require("fs-extra");
const request  = require("request");
const progress = require("request-progress");
const yaml     = require("node-yaml");
const path     = require("path");

module.exports = class UrlDownloader extends require("./emitter") {
    /**
     * Very simply downloads file directly to path
     * @param {string} url 
     * @param {string} tempDownloadPath 
     */
    async downloadFile(url, tempDownloadPath) {
        const _this = this;
        await fs.ensureDir(path.dirname(tempDownloadPath));
        return new Promise((resolve, reject) => {
            progress(request(url)).on("progress", (state) => {
                _this.emit("download-progress", state);
            }).on("error", (err) => {
                reject(err);
            }).on("end", (state) => {
                _this.emit("download-complete");
                resolve();
            }).pipe(fs.createWriteStream(tempDownloadPath)); 
        });
    }
    /**
     * We may move this to the version checker module. Right now this pulls the data down, and
     * returns just the sha512 and the version
     * @param {string} url 
     */
    async getVersionData(url) {
        return new Promise((resolve, reject) => {
            request(url, (err, response, body) => {
                // TODO update parsing to something not yaml
                const data = yaml.parse(body);
                resolve({
                    version : data.version,
                    sha512  : data.sha512
                })
            });
        })
    }
}
