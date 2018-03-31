const {net} = require("electron")

exports.getUsername = (username, callback) => {
    let request = net.request(`https://api.github.com/users/${username}`)

    request.on("response", (response) => {
        let compiledChunks = ""

        response.on("data", (chunk) => {
            compiledChunks += `${chunk}`
        })

        response.on("end", () => {
            if (response.statusCode === 200) callback(JSON.parse(compiledChunks))
        })
    })
    request.end()
}