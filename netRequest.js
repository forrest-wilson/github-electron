const {net} = require("electron");

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

exports.getUsername = (username, callback) => {
    let request = net.request(`https://api.github.com/users/${username}`);
    performRequest(request, callback);
}

exports.getRepos = (url, callback) => {
    let request = net.request(url);
    performRequest(request, callback);
}