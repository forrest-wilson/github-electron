const {BrowserWindow} = require("electron");
const config = require("./config");
const mainWinPosition = "mainWinPosition";

exports.mainWin = null;

exports.createWindow = () => {
    let windowSettings = {
        minWidth: 750,
        minHeight: 500,
        width: 1000,
        height: 700
    }

    let storedSettings = config.get(mainWinPosition);

    if (storedSettings) {
        windowSettings.width = storedSettings.width;
        windowSettings.height = storedSettings.height;
        windowSettings.x = storedSettings.x;
        windowSettings.y = storedSettings.y;
    }

    this.mainWin = new BrowserWindow(windowSettings);

    this.mainWin.webContents.openDevTools();

    this.mainWin.loadURL(`file://${__dirname}/mainRenderer/main.html`);

    this.mainWin.on("closed", () => {
        this.mainWin = null;
    });

    this.mainWin.on("close", () => {
        let size = this.mainWin.getSize();
        let position = this.mainWin.getPosition();
        config.set(mainWinPosition, {x: position[0], y: position[1], width: size[0], height: size[1]});
    });
};