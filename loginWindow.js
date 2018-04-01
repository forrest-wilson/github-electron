const {BrowserWindow} = require("electron");

exports.loginWin = null;

exports.createWindow = () => {
    this.loginWin = new BrowserWindow({
        width: 400,
        height: 300,
        resizable: false,
        frame: false
    });

    this.loginWin.webContents.openDevTools();

    this.loginWin.loadURL(`file://${__dirname}/loginRenderer/login.html`);

    this.loginWin.on("closed", () => {
        this.loginWin = null;
    });
};