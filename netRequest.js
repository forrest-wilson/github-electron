const {net} = require("electron");
const config = require("./config");
const baseUrl = "https://api.github.com/user";
const mainWindow = require("./windows/mainWindow");
const loadingWindow = require("./windows/loadingWindow");
const _ = require("lodash");

//**** Helper Methods ****//

function repoCallback(state, repos, index, e) {
    if (state && repos.length) {
        let savedRepos = config.get("repos");
        let savedReposClone = [];
        let potentialNewItems = [];

        if (savedRepos) {
            savedRepos.forEach(savedRepo => {
                savedReposClone.push(savedRepo);
            });

            repos.forEach(repo => {
                savedReposClone.forEach((savedRepoClone, i) => {
                    if (_.isEqual(repo.id, savedRepoClone.id)) {
                        savedReposClone.splice(i, 1, repo);
                    } else {
                        potentialNewItems.push(repo);
                    }
                });
            });

            let uniqPotentialNewItems = _.uniq(potentialNewItems);

            let total = _.uniq(savedReposClone.concat(_.uniq(uniqPotentialNewItems)));

            config.set("repos", total);
        } else {
            console.log("There aren't any saved repos");
            config.set("repos", repos);
        }

        let newIndex = index + 1;
        exports.getRepos(e, newIndex, repoCallback);
    }

    if (state && !repos.length) {
        loadingWindow.loadingWin.close();
        mainWindow.createWindow();
    }

    if (!state) {
        console.log("Loading from saved resources");
        loadingWindow.loadingWin.close();
        mainWindow.createWindow();
    }
}

function performRequest(request, callback, index, e) {
    request.on("response", (response) => {
        let compiledChunks = "";

        response.on("data", (chunk) => {
            compiledChunks += `${chunk}`;
        });

        response.on("end", () => {
            let compiledData = JSON.parse(compiledChunks);
            if (compiledData.message === "Not Found") {
                callback(false, compiledData, index, e);
                return;
            }
            if (response.statusCode === 200) callback(true, compiledData, index, e);
        });
    });
    request.on("error", (err) => {
        if (err == "Error: net::ERR_INTERNET_DISCONNECTED") {
            console.log("No internet connection");
            callback(false, err);
        }
    });
    request.end();
}

exports.getUser = (callback) => {
    let request = net.request(`${baseUrl}?access_token=${config.get("githubToken").access_token}`);
    performRequest(request, callback);
};

exports.getRepos = (e, index) => {
    console.log(`Request #${index}`);
    let request = net.request(`${baseUrl}/repos?page=${index}&per_page=100&access_token=${config.get("githubToken").access_token}`);
    performRequest(request, repoCallback, index, e);
};