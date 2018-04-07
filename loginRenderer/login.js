//**** Modules ****//

const {ipcRenderer, shell} = require("electron");

//**** IPC ****//

ipcRenderer.on("username:response", (e, state) => {
    $("#usernameSearch").removeClass("is-loading");

    if (!state) {
        $("#errorModal").addClass("is-active");
        return;
    }

    console.log("Username found");
});

ipcRenderer.on("github-oauth:reply", (e, token) => {
    console.log("Received token!");
    console.log(token);
});

//**** Event Listeners ****//

// Click Events
$("#usernameSearch").click(() => {
    // OAuth logic sender
    ipcRenderer.send("github-oauth", "getToken");
});

$("#makeGithubAccountLink").click((e) => {
    e.preventDefault();
    shell.openExternal($("#makeGithubAccountLink").attr("href"));
});

$("#closeErrorModal").click(() => {
    $("#errorModal").removeClass("is-active");
});