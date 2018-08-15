"strict mode";
const createOutputStream = require("create-output-stream");
const fs                 = require("fs-extra");
const path               = require("path");
const { promisify }      = require("util");
const yauzl              = require("yauzl");

module.exports = class ZipInstaller extends require("./emitter") {
    async install(updateFilePath, installDir) {
        const openZip        = promisify(yauzl.open);
        const zipfile        = await openZip(updateFilePath);
        const openReadStream = promisify(zipfile.openReadStream.bind(zipfile));
        const totalSize      = zipfile.fileSize;
        const _this          = this;
        let runningTotal     = 0;
    
        zipfile.on("entry", async (entry) => {
            const { fileName, compressedSize } = entry;
            const fullFilePath = path.join(installDir, fileName);
    
            if(/\/$/.test(fileName)) {
                // directory file names end with '/'
                return;
            }
    
            const outputStream = createOutputStream(fullFilePath);
    
            outputStream.once("close", () => {
                _this.emit("install-progress", { 
                    percent : Math.ceil((runningTotal += compressedSize) / totalSize * 100), 
                    fileName 
                });
            });
    
            (await openReadStream(entry)).pipe(outputStream);
        });
    
        return new Promise((resolve) => {
            zipfile.once("close", () => {
                fs.unlinkSync(updateFilePath);
                resolve();
            });
        });
    }
}
