const {ipcRenderer} = require("electron");
const config = require("../config");
const userProps = config.get("userProps");
const templateCompiler = require("./templateCompiler");

$("#profileImage").attr("src", userProps.avatar_url);

let groups = config.get("groups");
if (groups) {
    templateCompiler.compileGroups(groups, "#groups");
}

//**** Helper Methods ****//

function hideAddGroupModal() {
    $("#groupNameInput").val("");
    $("#addGroupModal").hide();
}

//**** IPC ****//

ipcRenderer.on("repo:response", (e, repos) => {
    templateCompiler.compileRepos(repos, "#reposWrapper");
});

ipcRenderer.on("openSaveDialog:complete", (e, res) => {
    $(".clone-button.is-loading", `[data-repouuid="${res}"]`).removeClass("is-loading");
});

ipcRenderer.on("openSaveDialog:cancelled", () => {
    $(".clone-button.is-loading").removeClass("is-loading");
});

ipcRenderer.on("newGroup:complete", (e, group) => {
    $("#newGroupError").text("");

    hideAddGroupModal();

    templateCompiler.compileGroups(group, "#groups");
});

ipcRenderer.on("newGroup:error", (e, err) => {
    $("#newGroupError").text(err);
});

//**** Click Event Handlers ****//

$(".app-nav-item").on("click", function() {
    let dataRequest = $(this).data("request");
    console.log(`Selected data: ${dataRequest}`);

    switch(dataRequest) {
        case "repositories":
            if (config.get("repos")) {
                templateCompiler.compileRepos(config.get("repos"), "#reposWrapper");
            } else {
                throw new Error("Error getting repos from persistent store");
            }
            break;
    }
});

$(document).on("click", ".clone-button", function(e) {
    e.preventDefault();
    let repoName = $(this).data("reponame");
    let cloneUrl = $(this).data("cloneurl");
    let repoUuid = $(this).data("repouuid");

    $(this).addClass("is-loading");

    ipcRenderer.send("openSaveDialog", {url: cloneUrl, name: repoName, uuid: repoUuid});
});

$(".navigator-icon").on("click", function(e) {
    e.preventDefault();

    // Toggles the active nav item
    $(".navigator-icon.active-nav-item").removeClass("active-nav-item");
    $(this).addClass("active-nav-item");

    // Toggles the active section showing
    let dataAttr = $(this).data("showsection");

    $(".nav-section").removeClass("is-showing");
    $(`#${dataAttr}Section`).addClass("is-showing");

    // Persist the active navigator-icon
    config.set("activeNavigatorIcon", `${dataAttr}`);
});

$("#addButton").on("click", function() {
    $("#addGroupModal").show();
});

$("#cancelAddGroup").on("click", hideAddGroupModal);

$("#addGroup").on("click", function() {
    let groupName = $("#groupNameInput").val();
    ipcRenderer.send("newGroup", groupName);
});

//**** Load Triggers ****//

// Sets the previous sessions' nav as the selected nav item
$(`[data-showsection=${config.get("activeNavigatorIcon")}`).trigger("click");