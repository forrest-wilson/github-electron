const templateLinks = document.querySelectorAll("link[rel='import']");

// Loop through each import link and append to the DOM
templateLinks.forEach(template => {
    let templateNode = template.import.querySelector(".template");
    let clone = document.importNode(templateNode.content, true);
    document.querySelector(".main").appendChild(clone);
});