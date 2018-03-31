const {BrowserWindow} = require("electron")

exports.win

exports.createWindow = () => {
    this.win = new BrowserWindow({
        width: 400,
        height: 300,
        resizable: false
    })

    this.win.webContents.openDevTools()

    this.win.loadURL(`file://${__dirname}/loginRenderer/login.html`)

    this.win.on("closed", () => {
        this.win = null
    })
}