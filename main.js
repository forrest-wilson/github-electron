const {app, ipcMain, dialog, Notification, shell} = require("electron");
const mainWindow = require("./mainWindow");
const netRequest = require("./netRequest.js");
const config = require("./config");
const userProps = "userProps";
const gitClone = require("git-clone");
const ElectronOnline = require("electron-online");
const connection = new ElectronOnline();
const notificationsSupported = Notification.isSupported();
const electronOauth2 = require("electron-oauth2");
const oauthConfig = require("./oauth");

// Internet connection event listener
connection.on("offline", () => {
    const offlineNotification = new Notification({
        title: "Lost Internet Connection!",
        body: "You won't be able to clone repos without an internet connection!",
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

// Enables electron-reload
require("electron-reload")(__dirname);

app.on("ready", () => {
    mainWindow.createWindow();
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
    (mainWindow.mainWin === null) ? mainWindow.createWindow() : mainWindow.mainWin.show();
});

// Github token retrieval

const windowParams = {
    alwaysOnTop: true,
    autoHideMenuBar: true,
    webPreferences: {
        nodeIntegration: false
    }
};

const githubOauth = electronOauth2(oauthConfig, windowParams);

// Sent from login.js
ipcMain.on("github-oauth", (e) => {
    const accessOptions = {
        scope: "repo"
    };
    githubOauth.getAccessToken(accessOptions)
        .then(token => {
            e.sender.send("github-oauth:reply", token);
            mainWindow.mainWin.loadURL(`file://${__dirname}/mainRenderer/main.html`);
        }, err => {
            console.log("Error while getting token: ", err);
        });
});

// Sent from login.js
ipcMain.on("username", (e, username) => {
    netRequest.getUsername(username, (state, data) => {
        if (state) {
            config.set(userProps, data);
        }
        
        e.sender.send("username:response", state);
        loginWindow.loginWin.close();
        mainWindow.createWindow();
    });
});

// Sent from app.js
ipcMain.on("repo", (e, reposUrl) => {
    netRequest.getRepos(reposUrl, (state, repos) => {
        if (state) {
            config.set("repos", repos);
            e.sender.send("repo:response", repos);
        }
    });
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