exports.compileRepos = (repos, selector, parent) => {
    if (!Array.isArray(repos)) repos = [repos];
    if (parent == null) parent = "body";

    repos.forEach(repo => {
        if (!document.querySelector(parent).querySelector(`[data-repouuid="${repo.id}"]`)) {
            const template = `<div class="repo content" data-repouuid="${repo.id}">
                                <div class="details">
                                    <h2>${repo.name}</h2>
                                    <span>${repo.language}</span>
                                </div>
                                <button class="button is-success clone-button" data-cloneurl="${repo.clone_url}" data-reponame="${repo.name}" data-repouuid="${repo.id}">Clone Repo</button>
                            </div><hr>`;

            $(selector).append(template);
        }
    });
};

exports.compileProfile = (props) => {
    console.log(props);
};

exports.compileGroups = (groups, selector) => {
    if (!Array.isArray(groups)) groups = [groups];

    console.log(groups);

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