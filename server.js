let path = require("path")
let express = require("express")
let app = express()
let http = require("http").createServer(app)
let io = require("socket.io")(http)
let Game = require("./game-class");

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
        if (games[`${lobbyID}`] != null && io.sockets.adapter.rooms[`${lobbyID}`].length < maxPlayers) {
            console.log("Joining game...")
            socket.join(`${lobbyID}`)
            socket.emit("connection-accept", {ID: lobbyID, GS: games[`${lobbyID}`]})
        } else {
            console.log("Creating new game...")
            games[`${lobbyID}`] = new Game()
            socket.join(`${lobbyID}`)
            socket.emit("connection-accept", {ID: lobbyID, GS: games[`${lobbyID}`]})
        }
    })

    socket.on("disconnecting", () => {
        
    })

    socket.on("make-move", (lobbyID) => {
        io.to(lobbyID).emit("aaa")
    })

    socket.on("disconnect", () => {
        console.log("Byebye")
    })
})

http.listen(PORT, () => console.log(`Started running on port ${PORT}`))