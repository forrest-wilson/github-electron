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
})

//**** Event Listeners ****//

// Keypress Events
$(document).on("keydown", (e) => {
    if (e.key === "Enter") $("#usernameSearch").click();
});

// Click Events
$("#usernameSearch").click(() => {
    let usernameToSearch = $("#usernameInput").val();
    if (usernameToSearch) ipcRenderer.send("username", usernameToSearch);
    $("#usernameSearch").addClass("is-loading");
});

$("#makeGithubAccountLink").click((e) => {
    e.preventDefault();
    shell.openExternal($("#makeGithubAccountLink").attr("href"));
});

$("#closeErrorModal").click(() => {
    $("#errorModal").removeClass("is-active");
});