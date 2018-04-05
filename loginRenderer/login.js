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

// Keypress Events
// $(document).on("keydown", (e) => {
//     if (e.key === "Enter") $("#usernameSearch").click();
// });

$("#usernameInput").on("keyup", () => {
    let search = $("#usernameInput").val();

    if (search !== "") {
        $("#usernameInput").removeClass("is-danger");
        $("#usernameWarning").addClass("is-hidden");
    } else {
        $("#usernameInput").addClass("is-danger");
        $("#usernameWarning").removeClass("is-hidden");
    }
});

// Click Events
$("#usernameSearch").click(() => {
    // let usernameToSearch = $("#usernameInput").val();

    // if (usernameToSearch !== "") {
    //     ipcRenderer.send("username", usernameToSearch);
    //     $("#usernameSearch").addClass("is-loading");
    // }

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