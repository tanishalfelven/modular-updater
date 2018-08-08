# modular-updater

A small modular updater. Some main focuses are simplicity, ease of use, and ease to integrate new processes with it.

# updating

modular-updater works as a configured object they you must initially configure, which you then have a fine-tuned control over the installation process.

To create an updater, `require` then call `.create()`. The only supported options so far are defined below.

```js
const modularUpdater = require("modular-updater").create({
    downloader     : new (require("modular-updater/simple-downloader"))(),
    versionChecker : new (require("modular-updater/semver-checker"))(),
    installer      : new (require("modular-updater/zip-installer"))(),
    
    tempDownloadPath   : "./temp.zip",
    installDirectory   : "./app/"
});
```
`checkForUpdate` will trigger the update process. The `versionUrl` and `updateFileUrl` are sent as paramters so a single updater object can support installation of the same app from multiple places or for multiple platforms.

```js
const newVersionData = await modularUpdater.checkForUpdate({
    versionUrl    : "//some.url.to/some/config.yml",
    updateFileUrl : "//some.url.to/some/version.zip",
    // this needs to be saved off. It isn't provided, then 
    // it will always download and install
    currentVersionInfo : {
        version : "0.0.0",   // some valid semver
        sha512  : 2403987652 // pretend this is some valid sha512 or some needed data for your versionChecker
    }
});
```

# events

Out of the box the following events are supported `download-progress`, `download-completed`, and `install-progress`.

```js
modularUpdater.on("install-progress", (data) => {
    console.log("installing");
    console.log(data);
});
```