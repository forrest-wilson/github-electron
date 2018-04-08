const {BrowserWindow} = require("electron");

exports.loadingWin = null;

exports.createWindow = () => {
    let windowSettings = {
        width: 300,
        height: 400,
        frame: false,
        show: false,
        resizable: false
    };

    this.loadingWin = new BrowserWindow(windowSettings);

    this.loadingWin.loadURL(`file://${__dirname}/loadingRenderer/loading.html`);

    this.loadingWin.webContents.openDevTools();

    this.loadingWin.once("ready-to-show", () => {
        this.loadingWin.show();
    });

    this.loadingWin.on("closed", () => {
        this.loadingWin = null;
    });
};