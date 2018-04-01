const {BrowserWindow} = require("electron");
const config = require("./config");
const loginWinPosition = "loginWinPosition";

exports.loginWin = null;

exports.createWindow = () => {
    let windowSettings = {
        width: 400,
        height: 300,
        resizable: false,
        frame: false
    };

    let pos = config.get(loginWinPosition);

    if (pos) {
        windowSettings.x = pos.x;
        windowSettings.y = pos.y;
    }

    this.loginWin = new BrowserWindow(windowSettings);

    this.loginWin.webContents.openDevTools();

    this.loginWin.loadURL(`file://${__dirname}/loginRenderer/login.html`);

    this.loginWin.on("closed", () => {
        this.loginWin = null;
    });

    this.loginWin.on("close", () => {
        console.log("Closing");
        let position = this.loginWin.getPosition();
        config.set(loginWinPosition, {x: position[0], y: position[1]});
    });
};