module.exports = {
    /**
     * @param {obj} config an object that has data required to checkForUpdate. 
     * The required portions are :
     *      downloader      : downloadFile(url)      => returns file path
     *                      : getResponse(url)       => returns response from url
     *                      : on(event, func)        => register func as observer
     *      versionChecker  : checkVersion(filePath) => returns boolean value
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
            checkForUpdate({ versionUrl, updateFileUrl, currentVersionInfo }) {
                const versionResponse = config.downloader.getResponse(versionUrl);
                const updateAvailable = config.versionChecker.checkVersion(currentVersionInfo, versionResponse);
                
                // Assume we want to update if an update is available
                let installed = false;
                if (updateAvailable) {
                    const updateFilePath = config.downloader.downloadFile(updateFileUrl, config.tempDownloadPath);
                    installed = config.installer.install(updateFilePath);
                }
                
                return installed ? versionResponse : false;
            },
            on(event, func) {
                if (config.downloader.on) {
                    config.downloader.on(event, func);
                }
                if (config.verionChecker.on) {
                    config.versionChecker.on(event, func);
                }
                if (config.installer.on) {
                    config.installer.on(event, func);
                }
            }
        }
    }
};
