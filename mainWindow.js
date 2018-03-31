const {BrowserWindow} = require("electron");

exports.mainWin;

exports.createWindow = () => {
    this.mainWin = new BrowserWindow({
        minWidth: 750,
        minHeight: 500,
        width: 1000,
        height: 700
    });

    this.mainWin.webContents.openDevTools();

    this.mainWin.loadURL(`file://${__dirname}/mainRenderer/main.html`);

    this.mainWin.on("closed", () => {
        this.mainWin = null;
    });
}