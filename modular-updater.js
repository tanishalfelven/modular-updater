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
            checkForUpdate : async ({ versionUrl, updateFileUrl, currentVersionInfo }) => {
                const versionResponse = await config.downloader.getVersionData(versionUrl);
                const updateAvailable = config.versionChecker.needToUpdate(currentVersionInfo, versionResponse);
                
                // Assume we want to update if an update is available
                let installed = false;
                if (updateAvailable) {
                    await config.downloader.downloadFile(updateFileUrl, config.tempDownloadPath);
                    installed = await config.installer.install(config.tempDownloadPath);
                }
                
                return installed ? versionResponse : false;
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
