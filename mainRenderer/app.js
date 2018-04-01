const {ipcRenderer} = require("electron");
const config = require("../config");
let userProps = config.get("userProps");

console.log(userProps);

$("#navImg").attr("src", userProps.avatar_url);
$("#navName").text(userProps.name);