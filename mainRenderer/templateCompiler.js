exports.compileRepos = (repos) => {
    console.log(repos);

    if (!repos.length) repos = [repos];

    repos.forEach(repo => {
        const template = `<div class="repo">
                            <div>
                                <span>${repo.name}</span> - 
                                <span>${repo.language}</span>
                            </div>
                            <button>Clone ${repo.name}</button>
                        </div>`;
        
        $("#reposWrapper").append(template);
    });
};

// exports.compileProfile = (props) => {
//     const template = `<div class="">
                        
//                     </div>`
// };