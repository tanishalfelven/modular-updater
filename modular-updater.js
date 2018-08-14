"strict mode";

module.exports = {
    /**
     * @param {obj} config an object that has data required to checkForUpdate. 
     * The required portions are :
     *      downloader      : downloadFile(url)      => returns file path
     *                      : getVersionData(url)    => returns response from url
     *                      : on(event, func)        => register func as observer
     *      versionChecker  : needToUpdate(currentVersion, newVersion) => returns boolean
     *                      : on(event, func)        => register func as observer
     *      installer       : install(filePath)
     *                      : on(event, func)        => register func as observer
     * 
     *      versionUrl         : url to version file
     *      updateFileUrl      : url to update file
     *      tempDownloadPath   : path to download file and unzip from
     *      currentVersionInfo : version info of current install
     */
    create(config) {
        return {
            checkForUpdate({ versionUrl, currentVersionInfo, versionResponse = false }) {
                return new Promise(async (response, reject) => {
                    // if versionResponse was sent in, use that, otherwise reach out for it
                    versionResponse = versionResponse ? versionResponse : await config.downloader.getVersionData(versionUrl);

                    response(config.versionChecker.needToUpdate(currentVersionInfo, versionResponse));
                });
            },
            update({ versionUrl, updateFileUrl, currentVersionInfo }) {
                const _this = this;
                return new Promise(async (response, reject) => {
                    const versionResponse = await config.downloader.getVersionData(versionUrl);

                    const updateAvailable = _this.checkForUpdate({
                        currentVersionInfo, 
                        versionResponse
                    });
                    
                    if (updateAvailable) {
                        await config.downloader.downloadFile(updateFileUrl, config.tempDownloadPath);
                        installed = await config.installer.install(config.tempDownloadPath, config.installDirectory);
                        response(versionResponse);
                    }
                    response(false);
                });
            },
            on(event, func) {
                if (config.downloader.on) {
                    config.downloader.on(event, func);
                }
                if (config.versionChecker.on) {
                    config.versionChecker.on(event, func);
                }
                if (config.installer.on) {
                    config.installer.on(event, func);
                }
            }
        }
    } 
};
