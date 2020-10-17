let path = require("path")
let express = require("express")
let app = express()

const PORT = 80

app.get("/", (req, res) => {
    res.sendFile(path.resolve("./index.html"))
})

app.get("/lobby/:lobbyID", (req, res) => {
    console.log(`Client trying to connect to lobby: ${req.params.lobbyID}`)
    res.send("lmao")
})

app.listen(PORT, () => console.log(`Started running on port ${PORT}`))