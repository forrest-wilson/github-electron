const {app, ipcMain, dialog} = require("electron");
const mainWindow = require("./mainWindow");
const loginWindow = require("./loginWindow");
const netRequest = require("./netRequest.js");
const config = require("./config");
const userProps = "userProps";
const gitClone = require("git-clone");

// Enables electron-reload
require("electron-reload")(__dirname);

app.on("ready", () => {
    (config.get(userProps)) ? mainWindow.createWindow() : loginWindow.createWindow();
    // loginWindow.createWindow();
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
    if (loginWindow.mainWin === null) loginWindow.createWindow();
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

    if (path) {
        gitClone(data.url, path, {}, () => {
            e.sender.send("openSaveDialog:complete");
        });
    } else {
       e.sender.send("openSaveDialog:cancelled");
    }
});