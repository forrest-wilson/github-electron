const {app, ipcMain, dialog, Notification, shell} = require("electron");
const mainWindow = require("./mainWindow");
const netRequest = require("./netRequest.js");
const config = require("./config");
const userProps = "userProps";
const gitClone = require("git-clone");
const ElectronOnline = require("electron-online");
const connection = new ElectronOnline();
const notificationsSupported = Notification.isSupported();
const electronOauth2 = require("electron-oauth2");
const oauthConfig = require("./oauth");
const _ = require("lodash");

// Github token retrieval
const windowParams = {
    alwaysOnTop: true,
    autoHideMenuBar: true,
    webPreferences: {
        nodeIntegration: false
    }
};

const githubOauth = electronOauth2(oauthConfig, windowParams);

// Enables electron-reload
require("electron-reload")(__dirname);

// Internet connection event listener
connection.on("offline", () => {
    const offlineNotification = new Notification({
        title: "Lost Internet Connection!",
        body: "You won't be able to clone repos without an internet connection!",
        silent: true
    });

    offlineNotification.show();

    connection.once("online", () => {
        const onlineNotification = new Notification({
            title: "Back online!",
            body: "Looks like things are back to normal! As you were.",
            silent: true
        });
    
        onlineNotification.show();
    });
});

app.on("ready", () => {
    mainWindow.createWindow();
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
    (mainWindow.mainWin === null) ? mainWindow.createWindow() : mainWindow.mainWin.show();
});

// Sent from login.js
ipcMain.on("github-oauth", () => {
    const accessOptions = {
        scope: "repo"
    };
    githubOauth.getAccessToken(accessOptions)
        .then(token => {
            config.set("githubToken", token);
            netRequest.getUser((state, data) => {
                if (state) {
                    config.set(userProps, data);
                }
                
                mainWindow.mainWin.loadURL(`file://${__dirname}/mainRenderer/main.html`);
            });
        }, err => {
            console.log("Error while getting token: ", err);
        });
});

function repoCallback(state, repos, index, e) {
    if (state && repos.length) {
        let savedRepos = config.get("repos");
        let savedReposClone = [];

        if (savedRepos) {
            console.log(`Number of Saved Repos: ${savedRepos.length}`);
            savedRepos.forEach(savedRepo => {
                savedReposClone.push(savedRepo);
            });

            repos.forEach(repo => {
                savedReposClone.forEach((savedRepoClone, i) => {
                    if (_.isEqual(repo.id, savedRepoClone.id)) {
                        console.log("We have a match!");
                        savedReposClone.splice(i, 1, repo);
                    }
                });
            });

            console.log(`Clone length: ${savedReposClone.length}`);

            let total = savedReposClone.concat(repos);

            config.set("repos", total);
        } else {
            console.log("There aren't an saved repos");
            config.set("repos", repos);
        }

        console.log(`Total repos: ${config.get("userProps").public_repos}`);
        console.log(`Stored repos: ${config.get("repos").length}`);

        let newIndex = index + 1;
        netRequest.getRepos(newIndex, repoCallback, e);
    }

    if (!repos.length) {
        e.sender.send("repo:response", config.get("repos"));
    }
}

// Sent from app.js
ipcMain.on("repo", (e) => {
    netRequest.getRepos(1, repoCallback, e);
});

// Sent from app.js
ipcMain.on("openSaveDialog", (e, data) => {
    let path = dialog.showSaveDialog(mainWindow.mainWin, {buttonLabel: "Clone", defaultPath: data.name});

    if (path && connection.status === "ONLINE") {
        gitClone(data.url, path, () => {
            e.sender.send("openSaveDialog:complete", data.uuid);

            const notifySuccess = new Notification({
                title: "Successfully cloned:",
                body: `${data.name}`,
                silent: true
            });

            // Dispatch notification to the OS if it is supported
            if (notificationsSupported) {
                notifySuccess.show();

                notifySuccess.once("click", () => {
                    // Opens the newly created repo in finder/explorer
                    shell.openItem(`${path}`);
                });
            }
        });
    } else {
        const notifyFail = new Notification({
            title: "Clone failed!",
            body: "Please check your internet connection",
            silent: true
        });

        // Dispatch notification to the OS if it is supported
        if (notificationsSupported) {
            notifyFail.show();
        }

        e.sender.send("openSaveDialog:cancelled", data.uuid);
    }
});