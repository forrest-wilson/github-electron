const {net} = require("electron");
const config = require("./config");
const baseUrl = "https://api.github.com/user";

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

exports.getRepos = (index, callback, e) => {
    console.log(`Request #${index}`);
    let request = net.request(`${baseUrl}/repos?page=${index}&per_page=100&access_token=${config.get("githubToken").access_token}`);
    performRequest(request, callback, index, e);
};