const {ipcRenderer} = require("electron");
const config = require("../config");
const userProps = config.get("userProps");
const repos = config.get("repos");
const netRequest = require("../netRequest");

console.log(userProps);

//**** Helper Functions ****//
function compileRepoTemplate(repos) {
    console.log(repos);
    repos.forEach(repo => {
        const repoTemplate = `<div class="repo inner">
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

$("#navImg").attr("src", userProps.avatar_url);
$("#navName").text(userProps.name);

//**** IPC ****//

ipcRenderer.on("repo:response", (e, repos) => {
    compileRepoTemplate(repos);
});

//**** Click Event Handlers ****//

$(".app-nav-item").click(function() {
    let dataRequest = $(this).data("request");

    // Removes the selected class from the nav item
    $(".app-nav-item.selected").removeClass("selected");

    // Adds the selected class to the clicked element
    $(this).addClass("selected");

    switch(dataRequest) {
        case "repository":
            if (repos) {
                $(`#${dataRequest}Section`);
                compileRepoTemplate(repos);
            } else {
                ipcRenderer.send("repo", userProps.repos_url);
            }
            break;
    }
});