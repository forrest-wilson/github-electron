exports.compileRepos = (repos, selector) => {
    console.log(repos);

    if (!repos.length) repos = [repos];

    repos.forEach(repo => {
        if (!document.querySelector(`[data-repouuid="${repo.id}"]`)) {
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
    if (!groups.length) groups = [groups];

    groups.forEach(group => {
        const template = `<div class="group">
                            <span class="group-title">${group.name}</span>
                            <span class="icon is-small">
                                <i class="fa fa-angle-right"></i>
                            </span>
                        </div>`;

        $(selector).append(template);
    });
};