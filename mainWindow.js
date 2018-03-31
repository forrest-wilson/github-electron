const {BrowserWindow} = require("electron")

exports.win

exports.createWindow = () => {
    this.win = new BrowserWindow({
        minWidth: 700,
        minHeight: 500,
        width: 1000,
        height: 700
    })

    this.win.webContents.openDevTools()

    this.win.loadURL(`file://${__dirname}/renderer/main.html`)

    this.win.on("closed", () => {
        this.win = null
    })
}