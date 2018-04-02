const {ipcRenderer} = require("electron");
const config = require("../config");
const userProps = config.get("userProps");
const repos = config.get("repos");
const netRequest = require("../netRequest");

//**** Helper Functions ****//

function compileRepoTemplate(repos) {
    console.log(repos);
    repos.forEach(repo => {
        const repoTemplate = `<div class="repo">
                                <div>
                                    <span>${repo.name}</span> - 
                                    <span>${repo.language}</span>
                                </div>
                                <button>Clone ${repo.name}</button>
                            </div>`;

        let doc = new DOMParser().parseFromString(repoTemplate, "text/html");
        let el = doc.body.firstChild;

        $("#reposWrapper").append(el);
    });
}

function compileProfileTemplate(props) {
    console.log(props);
}

$("#navImg").attr("src", userProps.avatar_url);
$("#navName").text(userProps.name);

//**** IPC ****//

ipcRenderer.on("repo:response", (e, repos) => {
    compileRepoTemplate(repos);
});

//**** Click Event Handlers ****//

$(".app-nav-item").click(function() {
    let dataRequest = $(this).data("request");
    console.log(dataRequest);

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
                compileRepoTemplate(repos);
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
});