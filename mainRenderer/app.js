const {ipcRenderer} = require("electron");
const config = require("../config");
const userProps = config.get("userProps");
const templateCompiler = require("./templateCompiler");

$("#profileImage").attr("src", userProps.avatar_url);

// Gets all groups and appends them to the #groups element on page load
let groups = config.get("groups");
if (groups) {
    templateCompiler.compileGroups(groups, "#groups");
}

// Gets all repos and appends them to the #reposWrapper element on page load
let allRepos = config.get("repos");
if (allRepos) {
    templateCompiler.compileRepos(allRepos, "#reposWrapper");
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

$(document).on("click", ".group", function() {
    // Class toggling
    let groupReq = $(this).attr("data-request");

    // Hide/show groups
    $(".group-content").removeClass("is-showing");
    $(`#${groupReq}`).addClass("is-showing");

    // Add/remove selected classes from correct nav items
    $(".group").removeClass("selected");
    $(this).addClass("selected");

    let groupID = $(this).attr("data-id");

    let groups = config.get("groups");

    groups.forEach(group => {
        if (group.id == groupID) {
            let refs = group.repoRef;

            if (refs.length > 0) {
                refs.forEach(ref => {
                    config.get("repos").forEach(repo => {
                        if (repo.id == ref) {
                            templateCompiler.compileRepos([repo], `#${groupReq}Repos`, `#${groupReq}`, true);
                        }
                    });
                });
            }
        }
    });
});

//**** Repo Dragging ****//

$(document).on("dragover", ".group", function(e) {
    e.preventDefault();
});

$(document).on("dragenter", ".group", function(e) {
    e.preventDefault();

    if ($(e.currentTarget).hasClass("group") || $(e.currentTarget).hasClass("group-title")) {
        console.log(e.currentTarget);
        $(e.currentTarget).addClass("selected");
    }
});

$(document).on("dragleave", ".group", function(e) {
    e.preventDefault();

    if ($(e.currentTarget).hasClass("group")) {
        console.log(e);
        // $(e.currentTarget).removeClass("selected");
    }
});

document.addEventListener("drop", function(e) {
    e.preventDefault();

    if ($(e.target).hasClass("group")) {
        let newRepoRef = e.dataTransfer.getData("id");
        let groupID = $(e.target).attr("data-id");
        let groups = config.get("groups");
        let update = [];

        groups.forEach(group => {
            update.push(group);
        });

        update.forEach(group => {
            if (groupID == group.id) {
                group.repoRef.push(parseInt(newRepoRef));
            }
        });

        config.set("groups", update);

        // Remove the selected class
        $(e.target).removeClass("selected");
    }
});

document.addEventListener("dragstart", function(e) {
    if ($(e.srcElement).hasClass("repo")) {
        e.dataTransfer.setData("id", $(e.srcElement).attr("data-repouuid"));
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

$(document).on("click", ".options-dropdown", function(e) {
    e.stopPropagation();
    $(this).toggleClass("is-active");
});

$(document).on("click", function() {
    $(".options-dropdown").removeClass("is-active");
});

//**** Adding Repos to Groups modal management ****//

$(document).on("click", ".open-add-repo-to-group-modal", function(e) {
    e.stopPropagation();

    templateCompiler.compileGroupList(config.get("groups"), "#addRepoToGroupBody", $(e.currentTarget).data("repouuid"));

    $("#addRepoToGroupModal").addClass("is-active");
});

$(document).on("click", ".remove-repo-from-group", function(e) {
    e.stopPropagation();

    console.log(this);
});

$(document).on("click", ".group-option", function() {
    $(".group-option").removeClass("selected-group-option");
    $(this).addClass("selected-group-option");
});

$("#addRepoToGroup").on("click", function(e) {
    let groupID = $(".group-option.selected-group-option").attr("data-groupid");
    let repoID = $(".group-option.selected-group-option").attr("data-repouuid");
    let groups = config.get("groups");
    let update = [];

    groups.forEach(group => {
        update.push(group);
    });

    for (let i = 0; i < update.length; i++) {
        if (update[i].id == groupID) {
            // Add repo id to group
            update[i].repoRef.push(parseInt(repoID));

            config.set("groups", update);

            $("#addRepoToGroupBody").empty();
            $("#addRepoToGroupModal").removeClass("is-active");

            return;
        }
    }
});

$("#cancelAddRepoToGroup").on("click", function() {
    $("#addRepoToGroupModal").removeClass("is-active");

    $("#addRepoToGroupBody").empty();
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

$("#addButton").on("click", () => {
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