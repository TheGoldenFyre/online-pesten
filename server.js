let path = require("path")
let express = require("express")
let app = express()
let http = require("http").createServer(app)
let io = require("socket.io")(http)
let Game = require("./gamestate");

const PORT = 80

let games = {}
const maxPlayers = 4

app.use(express.static('public'))

app.get("/", (req, res) => {
    res.send("lmao")
})

app.get("/lobby/:lobbyID", (req, res) => {
    console.log(`Client trying to connect to lobby: ${req.params.lobbyID}`)
    res.sendFile(path.resolve("./index.html"))
})

io.on('connection', (socket) => {
    socket.on("connection-request", (lobbyID) => {
        let playerCount = 0
        if (io.sockets.adapter.rooms[`${lobbyID}`] != undefined) {

            playerCount = io.sockets.adapter.rooms[`${lobbyID}`].length + 1

            if (games[`${lobbyID}`] != null) { 
                if ( playerCount <= maxPlayers ) {
                    console.log("Joining game...")
                    socket.join(`${lobbyID}`)
                    socket.emit("connection-accept", {ID: playerCount, GS: games[`${lobbyID}`]})
                    games[`${lobbyID}`] = new Game(playerCount)
                } 
                else {
                    console.log("Game full")
                }
            } 
        }
        else {
            playerCount = 1
            
            console.log("Creating new game...")
            games[`${lobbyID}`] = new Game(playerCount)
            socket.join(`${lobbyID}`)
            socket.emit("connection-accept", {ID: playerCount, GS: games[`${lobbyID}`]})
        }
    })

    //TODO: fix player numbering after disconnect
    socket.on("disconnecting", () => {
        let lobbyID = Object.keys(socket.rooms)[0].toString()

        if( io.sockets.adapter.rooms[lobbyID].length == 1 ) {
            games[lobbyID] = null;
        };
    })

    socket.on("try-move", (data) => {
        let b = false
        let li = data.lobbyID.toString()
        let gr = games[li].gameRules
        
        for (let i = 0; i < gr.length; i++) {
            if (gr[i](data.pCard, data.sCard))
                b = true
        }

        if (b) {
            games[li].nextTurn(data.pCard, data.cTurn)
            games[li].Move(data.pIndex, data.index)
            io.to(li).emit("update", games[li])
        }
    })

    socket.on("draw-card", (data) => {
        games[data.lobbyID.toString()].GetCard(1, data.pIndex)
        io.to(data.lobbyID).emit("update", games[data.lobbyID.toString()])
    })

    socket.on("start-game", (lobbyID) => {
        games[lobbyID.toString()].Start()
        io.to(lobbyID).emit("update", games[lobbyID.toString()])
    })

    socket.on("end-turn", (data) => {
        games[lobbyID.toString()].EndTurn()
        io.to(lobbyID).emit("update", games[lobbyID.toString()])
    })

    //socket.on("make-move", (data) => {
        
    //})

    socket.on("disconnect", () => {
        console.log("Byebye")
    })
})

http.listen(PORT, () => console.log(`Started running on port ${PORT}`))