const {app, ipcMain} = require("electron")
const mainWindow = require("./mainWindow")
const loginWindow = require("./loginWindow")
const netRequest = require("./netRequest.js")

// Enables electron-reload
require("electron-reload")(__dirname)

ipcMain.on("username", (e, username) => {
    netRequest.getUsername(username, (data) => {
        e.sender.send("username-success", data)
    })
})

app.on("ready", () => {
    loginWindow.createWindow()
})

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit()
})

app.on("activate", () => {
    if (mainWindow === null) mainWindow.createWindow()
})