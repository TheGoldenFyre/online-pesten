let path = require("path")
let express = require("express")
let app = express()
let http = require("http").createServer(app)
let io = require("socket.io")(http)

const PORT = 80

let games = {}
const maxPlayers = 4

app.get("/", (req, res) => {
    res.send("lmao")
})

app.get("/lobby/:lobbyID", (req, res) => {
    console.log(`Client trying to connect to lobby: ${req.params.lobbyID}`)
    res.sendFile(path.resolve("./index.html"))
})

io.on('connection', (socket) => {
    socket.on("connection-request", (lobbyID) => {
        console.log(`LobbyId: ${lobbyID}`)
        if (games[`${lobbyID}`] != null && io.sockets.adapter.rooms[`${lobbyID}`].length < maxPlayers) {
            socket.join(`${lobbyID}`)
            socket.emit("connection-accept", lobbyID)
        } else {
            socket.emit("connection-deny")
        }
    })

    socket.on("make-move", (lobbyID) => {
        io.to(lobbyID).emit("aaa")
    })

    socket.on("disconnect", () => {
        console.log("Byebye")
    })
})

http.listen(PORT, () => console.log(`Started running on port ${PORT}`))