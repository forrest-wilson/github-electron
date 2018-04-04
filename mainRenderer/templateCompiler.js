exports.compileRepos = (repos) => {
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
            $("#reposWrapper").append(template);
        }
    });
};

// exports.compileProfile = (props) => {
//     const template = `<div class="">
                        
//                     </div>`
// };