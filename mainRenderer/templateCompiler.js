exports.compileRepos = (repos, selector, parent = "body", custom = false) => {
    if (!Array.isArray(repos)) repos = [repos];

    repos.forEach(repo => {
        if (!document.querySelector(parent).querySelector(`[data-repouuid="${repo.id}"]`)) {
            const template = `<div class="repo content" data-repouuid="${repo.id}">
                                <div class="details">
                                    <h2>${repo.name}</h2>
                                    <span>${repo.language}</span>
                                </div>
                                <button class="button is-success clone-button" data-cloneurl="${repo.clone_url}" data-reponame="${repo.name}" data-repouuid="${repo.id}">Clone Repo</button>
                                <div class="options-dropdown dropdown is-right" style="margin-left: 15px">
                                    <div class="dropdown-trigger" style="display: flex; align-items: center;">
                                        <button class="button" aria-haspopup="true" aria-controls="dropdown-menu">
                                            <span class="icon is-small">
                                                <i class="fa fa-angle-down" aria-hidden="true"></i>
                                            </span>
                                        </button>
                                    </div>
                                    <div class="dropdown-menu" id="dropdown-menu" role="menu">
                                        <div class="dropdown-content">
                                            <a class="dropdown-item open-add-repo-to-group-modal" data-repouuid="${repo.id}">Add Repo to Group</a>
                                            ${custom ? `
                                            <a class="dropdown-item remove-repo-from-group" data-repouuid="${repo.id}">Remove this Repo from the Group</a>
                                            ` : ``}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <hr>`;

            $(selector).append(template);
        }
    });
};

exports.compileProfile = (props) => {
    console.log(props);
};

exports.compileGroups = (groups, selector) => {
    if (!Array.isArray(groups)) groups = [groups];

    groups.forEach(group => {
        const template = `<div class="group" data-request="group${group.name.replace(/\s+/g, '')}" data-id="${group.id}">
                            <span class="group-title">${group.name}</span>
                            <span class="icon is-small">
                                <i class="fa fa-angle-right"></i>
                            </span>
                        </div>`;

        $(selector).append(template);
    });

    exports.compileGroup(groups, ".app-repo-groups");
};

exports.compileGroup = (groups, selector) => {
    if (!Array.isArray(groups)) groups = [groups];

    groups.forEach(group => {
        // Removes any whitespace in the group name
        let noSpaceName = group.name.replace(/\s+/g, "");

        const template = `<div id="group${noSpaceName}" class="fit section group-content">
                            <div class="inner">
                                <header class="content">
                                    <h1><i class="fa fa-code"></i> ${group.name}</h1>
                                    <p>Below are your grouped repositories</p>
                                </header>
                                <hr>
                                <main id="group${noSpaceName}Repos"></main>
                            </div>
                        </div>`;

        $(selector).append(template);
    });
};

exports.compileGroupList = (groups, selector, repoID) => {
    if (!Array.isArray(groups)) groups = [groups];

    groups.forEach(group => {
        if (!document.querySelector(selector).querySelector(`[data-id="${group.id}"]`)) {
            const template = `<div class="group-option" data-groupid="${group.id}" data-repouuid="${repoID}">
                                <p>${group.name}</p>
                            </div>`;

            $(selector).append(template);
        }
    });
};