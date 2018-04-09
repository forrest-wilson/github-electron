const {ipcRenderer} = require("electron");

let textOptions = [
    "Getting things ready...",
    "Bouncing balls..."
];

$(document).on("DOMContentLoaded", () => {
    $("#loadingText").text(textOptions[Math.floor(Math.random() * textOptions.length)]);
});

ipcRenderer.send("repo");