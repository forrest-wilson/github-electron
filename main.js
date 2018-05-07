const {app, ipcMain, dialog, Notification, shell} = require("electron");
const mainWindow = require("./windows/mainWindow");
const loadingWindow = require("./windows/loadingWindow");
const loginWindow = require("./windows/loginWindow");
const netRequest = require("./netRequest");
const config = require("./config");
const gitClone = require("git-clone");
const ElectronOnline = require("electron-online");
const connection = new ElectronOnline();
const notificationsSupported = Notification.isSupported();
const electronOauth2 = require("electron-oauth2");
const oauthConfig = require("./oauth");

// Github token retrieval
const windowParams = {
    alwaysOnTop: true,
    autoHideMenuBar: true,
    webPreferences: {
        nodeIntegration: false
    }
};

const githubOauth = electronOauth2(oauthConfig, windowParams);

// Enables electron-reload
require("electron-reload")(__dirname);

// Internet connection event listener
connection.on("offline", () => {
    const offlineNotification = new Notification({
        title: "No Internet Connection!",
        body: "You can't clone repos without an internet connection!",
        silent: true
    });

    offlineNotification.show();

    connection.once("online", () => {
        const onlineNotification = new Notification({
            title: "Back online!",
            body: "Looks like things are back to normal! As you were.",
            silent: true
        });
    
        onlineNotification.show();
    });
});

app.on("ready", () => {
    (config.get("githubToken")) ? loadingWindow.createWindow() : loginWindow.createWindow();
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
    if (config.get("githubToken")) {
        (mainWindow.mainWin === null) ? mainWindow.createWindow() : mainWindow.mainWin.show();
    } else {
        loginWindow.createWindow();
    }
});

//**** IPC ****//

// Sent from login.js
ipcMain.on("github-oauth", () => {
    const accessOptions = {
        scope: "repo"
    };
    githubOauth.getAccessToken(accessOptions)
        .then(token => {
            config.set("githubToken", token);
            netRequest.getUser((state, data) => {
                if (state) {
                    config.set("userProps", data);
                }
                
                loginWindow.loginWin.close();
                loadingWindow.createWindow();
            });
        }, err => {
            console.log("Error while getting token: ", err);
        });
});

// Sent from app.js & loadingWindow.js
ipcMain.on("repo", (e) => {
    netRequest.getRepos(e, 1);
});

// Sent from loadingWindow.js
ipcMain.on("finishedLoadingRepos", () => {
    mainWindow.createWindow();
});

// Sent from app.js
ipcMain.on("openSaveDialog", (e, data) => {
    let path = dialog.showSaveDialog(mainWindow.mainWin, {buttonLabel: "Clone", defaultPath: data.name});

    if (path && connection.status === "ONLINE") {
        gitClone(data.url, path, () => {
            e.sender.send("openSaveDialog:complete", data.uuid);

            const notifySuccess = new Notification({
                title: "Successfully cloned:",
                body: `${data.name}`,
                silent: true
            });

            // Dispatch notification to the OS if it is supported
            if (notificationsSupported) {
                notifySuccess.show();

                notifySuccess.once("click", () => {
                    // Opens the newly created repo in finder/explorer
                    shell.openItem(`${path}`);
                });
            }
        });
    } else {
        const notifyFail = new Notification({
            title: "Clone failed!",
            body: "Please check your internet connection",
            silent: true
        });

        // Dispatch notification to the OS if it is supported
        if (notificationsSupported) {
            notifyFail.show();
        }

        e.sender.send("openSaveDialog:cancelled", data.uuid);
    }
});

ipcMain.on("newGroup", (e, name) => {
    let savedGroups = config.get("groups");
    let latestGroupID = config.get("latestGroupID");

    let newGroup = {
        id: latestGroupID + 1,
        name: name,
        repoRef: []
    };

    config.set("latestGroupID", latestGroupID + 1);

    if (savedGroups) {
        for (let i = 0; i < savedGroups.length; i++) {
            if (savedGroups[i].name == name) {
                e.sender.send("newGroup:error", "This group name already exists!");
                return;
            }
        }

        let allGroups = [];

        savedGroups.forEach(savedGroup => {
            allGroups.push(savedGroup);
        });

        allGroups.push(newGroup);

        config.set("groups", allGroups);

        e.sender.send("newGroup:complete", newGroup);
    } else {
        config.set("groups", [newGroup]);
        config.set("latestGroupID", 0);
        e.sender.send("newGroup:complete", newGroup);
    }
});