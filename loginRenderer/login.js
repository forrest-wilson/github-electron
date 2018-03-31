const {ipcRenderer} = require("electron")
let win = require("../loginWindow")

$(document).on("keydown", (e) => {
    if (e.key === "Enter") $("#usernameSearch").click()
})

$("#usernameSearch").on("click", () => {
    let usernameToSearch = $("#usernameInput").val()
    if (usernameToSearch) ipcRenderer.send("username", usernameToSearch)
})

ipcRenderer.on("username-success", (e, data) => {
    win.quit()
    win === null
})