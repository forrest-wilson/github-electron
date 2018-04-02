const {ipcRenderer} = require("electron");
const config = require("../config");
const userProps = config.get("userProps");
const repos = config.get("repos");
const templateCompiler = require("./templateCompiler");
const navSelector = "navSelectionID";

//**** Helper Functions ****//

function compileProfileTemplate(props) {
    console.log(props);
}

$("#navImg").attr("src", userProps.avatar_url);
$("#navName").text(userProps.name);

//**** IPC ****//

ipcRenderer.on("repo:response", (e, repos) => {
    templateCompiler.compileRepos(repos);
});

//**** Click Event Handlers ****//

$(".app-nav-item").on("click", function() {
    let dataRequest = $(this).data("request");
    console.log(`Selected data: ${dataRequest}`);

    // Removes the selected class from the nav item
    $(".app-nav-item.selected").removeClass("selected");

    // Removes the current showing section
    $(".section.is-showing").removeClass("is-showing");

    // Shows the corresponding section based on app-nav-item selection
    $(`#${dataRequest}Section`).addClass("is-showing");

    // Adds the selected class to the clicked element
    $(this).addClass("selected");

    switch(dataRequest) {
        case "repositories":
            if (repos) {
                templateCompiler.compileRepos(repos);
            } else {
                ipcRenderer.send("repo", userProps.repos_url);
            }
            break;
        case "profile":
            if (userProps) {
                compileProfileTemplate(userProps);
            }
            break;
    }

    // Persist selected nav item
    config.set(navSelector, `${dataRequest}NavItem`);
});

// Sets the previous sessions' nav as the selected nav item
$(`#${config.get(navSelector)}`).trigger("click");