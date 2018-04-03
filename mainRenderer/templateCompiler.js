exports.compileRepos = (repos) => {
    console.log(repos);

    if (!repos.length) repos = [repos];

    repos.forEach(repo => {
        const template = `<div class="repo content">
                            <div class="details">
                                <h2>${repo.name}</h2>
                                <span>${repo.language}</span>
                            </div>
                            <button class="button is-success clone-button" data-cloneurl="${repo.clone_url}" data-reponame="${repo.name}">Clone Repo</button>
                        </div><hr>`;
        
        $("#reposWrapper").append(template);
    });
};

// exports.compileProfile = (props) => {
//     const template = `<div class="">
                        
//                     </div>`
// };