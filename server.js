let path = require("path")
let express = require("express")
let app = express()
let http = require("http").createServer(app)
let io = require("socket.io")(http)
let Game = require("./gamestate");

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
        if (games[`${lobbyID}`] != null && io.sockets.adapter.rooms[`${lobbyID}`] != undefined && io.sockets.adapter.rooms[`${lobbyID}`].length < maxPlayers ) {
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
        let lobbyID = Object.keys(socket.rooms)[0].toString()

        if( io.sockets.adapter.rooms[lobbyID].length == 1 ) {
            games[lobbyID] = null;
        };
    })

    socket.on("make-move", (lobbyID) => {
        io.to(lobbyID).emit("aaa")
    })

    socket.on("disconnect", () => {
        console.log("Byebye")
    })
})

http.listen(PORT, () => console.log(`Started running on port ${PORT}`))