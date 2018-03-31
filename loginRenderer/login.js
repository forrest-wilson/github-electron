const {ipcRenderer} = require("electron")

$(document).on("keydown", (e) => {
    if (e.key === "Enter") $("#usernameSearch").click()
})

$("#usernameSearch").on("click", () => {
    let usernameToSearch = $("#usernameInput").val()
    if (usernameToSearch) ipcRenderer.send("username", usernameToSearch)
    $("#usernameSearch").addClass("is-loading")
})

ipcRenderer.on("username:response", (e, state) => {
    $("#usernameSearch").removeClass("is-loading")

    if (!state) {
        $("#errorModal").addClass("is-active")
    }
})

$("#closeErrorModal").click(() => {
    $("#errorModal").removeClass("is-active")
})