const {BrowserWindow} = require("electron");

exports.loginWin = null;

exports.createWindow = () => {
    let windowSettings = {
        width: 400,
        height: 300,
        frame: false,
        show: false,
        resizable: false
    };

    this.loginWin = new BrowserWindow(windowSettings);

    this.loginWin.loadURL(`file://${__dirname}/../loginRenderer/login.html`);

    // this.loginWin.webContents.openDevTools();

    this.loginWin.once("ready-to-show", () => {
        this.loginWin.show();
    });

    this.loginWin.on("closed", () => {
        this.loginWin = null;
    });
};