//**** Modules ****//

const {ipcRenderer, shell} = require("electron");

//**** Event Listeners ****//

// Click Events
$("#usernameSearch").click(function() {
    $(this).addClass("is-loading");
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