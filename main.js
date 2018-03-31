const {app, ipcMain, remote} = require("electron");
const mainWindow = require("./mainWindow");
const loginWindow = require("./loginWindow");
const netRequest = require("./netRequest.js");
const Config = require("electron-config");
const config = new Config();
const userProps = "userProps";

// Enables electron-reload
require("electron-reload")(__dirname);

// Sent from login.js
ipcMain.on("username", (e, username) => {
    netRequest.getUsername(username, (state, data) => {
        if (state) {
            config.set(userProps, data);
        }
        
        e.sender.send("username:response", state);
        // loginWindow.loginWin.close();
        // mainWindow.createWindow();
    });
});

app.on("ready", () => {
    // (config.get(userProps)) ? mainWindow.createWindow() : loginWindow.createWindow();
    loginWindow.createWindow();
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
    if (mainWindow.mainWin === null) mainWindow.createWindow();
});