const electron = require("electron");
const {app, BrowserWindow, net, ipcMain} = electron;
const path = require("path");
const url = require("url");

const apiUrl = {
    base: "https://api.github.com/users/",
    user: "forrest-wilson"
}

// Global reference to the mainWindow object
let mainWindow;

// Creates the main window
function createWindow() {
    mainWindow = new BrowserWindow({width: 1500, height: 1000, backgroundColor: "#2e2c29", show: true});

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, "mainWindow.html"),
        protocol: "file:",
        slashes: true
    }));

    mainWindow.webContents.openDevTools();

    mainWindow.on("closed", () => {
        mainWindow = null;
    });
}

// Calls the GitHub API
function getGithubData() {
    const request = net.request(apiUrl.base + apiUrl.user + "/repos?type=all");
    request.on("response", (response) => {
        let compiledChunks = "";

        response.on("data", (chunk) => {
            compiledChunks += `${chunk}`;
        });

        response.on("end", () => {
            let parsedChunks = JSON.parse(compiledChunks);
            mainWindow.webContents.send("githubData", parsedChunks);
        });
    });
    request.end();
}

app.on("ready", () => {
    createWindow();
    getGithubData();
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (mainWindow === null) {
        createWindow();
    }
});