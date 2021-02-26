const WebSocket = require('ws')



const splice = require("sqlite3").verbose();
//if (err) throw err;
console.log("Connected to database");

const server = new WebSocket.Server({ port: 8080 })
console.log("Server is connected");
let rooms = new Map()
let db = new splice.Database("./db/chatDB.db", splice.OPEN_CREATE | splice.OPEN_READWRITE, (err) => {
    server.on('connection', function connect(myself) {
        console.log(server.clients.size);
        myself["my_room"] = ""

        myself.on("message", function receive(json) {
            const obj = JSON.parse(json)
            var id;
            var password;
            var name;
            console.log(obj);
            switch (obj.eventName) {
                case "register":
                    if (obj.eventName == "register") {
                        id = obj.userId;
                        password = obj.userPassword;
                        name = obj.userName;
                        db.run(`INSERT INTO UserData
                        VALUES ( $UserID, $Password, $UserName )`, {
                            $UserID: id,
                            $Password: password,
                            $UserName: name
                        }
                            , (err) => {
                                if (err) {

                                    var resultData =
                                    {
                                        eventName: "register",
                                        data: "400",
                                        userID: obj.userId
                                    }
                                    //Json to string
                                    jsonToStr = JSON.stringify(resultData)

                                    myself.send(jsonToStr);
                                    console.log(err.message);

                                }
                                else {

                                    var resultData =
                                    {
                                        eventName: "register",
                                        data: "200",
                                        userID: obj.userId,
                                        userName: obj.userName

                                    }
                                    //Json to string
                                    jsonToStr = JSON.stringify(resultData)

                                    myself.send(jsonToStr);
                                }

                            })
                    }
                    break;
                    case "login":
                    if (obj.eventName == "login") {
                        id = obj.userId;
                        password = obj.userPassword;
                        //name = obj.userName;
                        db.get(`SELECT UserID AND Password FROM UserData WHERE (UserID=$UserID AND Password=$Password)`, {
                            $UserID: id,
                            $Password: password,
                            //$UserName: name
                        }
                        ,function result(err, row) {
                            if (err || row == undefined) {

                                    var resultData =
                                    {
                                        eventName: "login",
                                        data: "400",
                                        userID: obj.userId
                                    }
                                    //Json to string
                                    jsonToStr = JSON.stringify(resultData)

                                    myself.send(jsonToStr);                                   
                                }
                                else {

                                    var resultData =
                                    {
                                        eventName: "login",
                                        data: "200",
                                        userID: obj.userId,
                                        userName: obj.userName

                                    }
                                    //Json to string
                                    jsonToStr = JSON.stringify(resultData)

                                    myself.send(jsonToStr);
                                }

                            })
                    }
                    break;

                case "createRoom":
                    if (!rooms.has(obj.data)) {
                        rooms.set(obj.data, { clients: new Set([myself]) })
                        myself["my_room"] = obj.data
                        console.log(`on create room: ${myself["my_room"]} ${rooms.get(obj.data).clients.size}`)
                        myself.send(JSON.stringify({
                            eventName: "createRoom",
                            data: "200"
                        }))
                    } else {
                        myself.send(JSON.stringify({
                            eventName: "createRoom",
                            data: "400"
                        }))
                    }
                    break;
                case "joinRoom":
                    if (rooms.has(obj.data)) {
                        rooms.get(obj.data).clients.add(myself)
                        myself["my_room"] = obj.data
                        console.log(`on create room: ${myself["my_room"]} ${rooms.get(obj.data).clients.size}`)
                        myself.send(JSON.stringify({
                            eventName: "joinRoom",
                            data: "200"
                        }))
                    } else {
                        myself.send(JSON.stringify({
                            eventName: "joinRoom",
                            data: "400"
                        }))
                    }
                    break;
                case "sendMessage":
                    const [roomName, message] = obj.data.split("|")
                    if (rooms.has(roomName)) {
                        console.log(`on send: ${myself["my_room"]} ${rooms.get(roomName).clients.size}`)
                        rooms.get(roomName).clients.forEach(function each(client) {
                            console.log(client == myself)
                            if (client != myself && client.readyState == WebSocket.OPEN) {
                                client.send(JSON.stringify({
                                    eventName: "sendMessage",
                                    data: message
                                }))
                            }
                        })
                    }
                    break;
            }
        })

        myself.on("close", function error(code, reason) {
            console.log("error: " + code)
            console.log("reason: " + reason)
            console.log(server.clients.size);

            let my_room = ""
            if (myself.hasOwnProperty("my_room")) {
                my_room = myself["my_room"]
                if (my_room !== "" && rooms.has(my_room)) {
                    console.log(`room name: ${my_room}, current client no. : ${rooms.get(my_room).clients.size} `)
                    rooms.get(my_room).clients.delete(myself)
                    console.log(`room name: ${my_room}, after exit client no. : ${rooms.get(my_room).clients.size} `)
                    if (rooms.get(my_room).clients.size == 0) {
                        rooms.delete(my_room)
                    }
                }
            }
        })
    });
})
