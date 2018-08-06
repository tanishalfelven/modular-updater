# modular-updater

A small modulare updater. The intention of this is to provide a very bare bones module that will allow people to redefine sections of it and have it all just work.

## Use

In order to start updating you have to initiate your modularUpdater.

### example of initialization modular updater
```js
const modularUpdater = require("modular-updater").create({
    downloader     : require("modular-updater/src/simple-url-downloader"),
    versionChecker : require("modular-updater/src/json-version-checker"),
    installer      : require("modular-updater/src/zip-installer"),
    
    tempDownloadPath   : "./",
    installDirectory   : "./app/"
});
```

Then to start an update you just have to call `checkForUpdate` like so with all of the needed data.
```js
modularUpdater.checkForUpdate({
    versionUrl    : "//www.lmao.com/some/version.json",
    updateFileUrl : "//www.lmao.com/some/updateFile.zip",
    // this needs to be saved off. It isn't provided, then 
    // it will always download and install
    currentVersionInfo : {
        version : "0.0.1" // some valid semver
        sha512  : 2403987652 // pretend this is some valid sha512 or some needed data for your versionChecker
    }
});
```

## Events

All of the out of the box modular sections provided (json-version-checker.js, simple-url-downloader.js, zip-installer.js) are able to be hooked into events.
There is safe checking for events, so if your module doesn't support them then there won't be issues. Check out emitter.js to see a simple observer implementation.

### Hooking in

To hook into `modularUpdater` events use `.on`.

#### EX 

This will hook into an event `"download-progress"` and will register it to EACH portion of the updater (updater, installer, and versionChecker) so be careful to not define overlapping events.
```js
modularUpdater.on("download-progress", (evtInfo) => {
    console.log(evtInfo);
})
```