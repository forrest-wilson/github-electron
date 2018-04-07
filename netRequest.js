const {net} = require("electron");
const config = require("./config");
const baseUrl = "https://api.github.com/user";

function performRequest(request, callback) {
    request.on("response", (response) => {
        let compiledChunks = "";

        response.on("data", (chunk) => {
            compiledChunks += `${chunk}`;
        });

        response.on("end", () => {
            let compiledData = JSON.parse(compiledChunks);
            if (compiledData.message === "Not Found") {
                callback(false, compiledData);
                return;
            }
            if (response.statusCode === 200) callback(true, compiledData);
        });
    });
    request.end();
}

exports.getUser = (callback) => {
    let request = net.request(`${baseUrl}?access_token=${config.get("githubToken").access_token}`);
    performRequest(request, callback);
};

exports.getRepos = (url, callback) => {
    let request = net.request(url);
    performRequest(request, callback);
};