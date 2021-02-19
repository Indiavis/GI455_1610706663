var websocket = require('ws');
var callbackInitServer = ()=>{
    console.log("Server is running.");
}

var wss = new websocket.Server({port:8080}, callbackInitServer);

var wsList = [];
var roomList = [];

wss.on("connection", (ws) => {

    {
    //LobbyZone
        ws.on("message", (data) =>{
            console.log(data);
        
            var toJson = JSON.parse(data);

        //console.log(data["eventName"]);

        
        if(toJson.eventName == "CreateRoom")
        {
            console.log("client request createroom ["+toJson.data+"]")
            var isFoundRoom=false;
            for(var i=0;i<roomList.length;i++)
            {
                if(roomList[i].roomName == toJson.data)
                {
                    isFoundRoom = true;
                    break;
                }
            }

            if(isFoundRoom)
            {
                //Callback to client : room name is exist
                console.log("Create Room : Room is Founded");
            }
            else
            {
                //Create room here
                var newRoom = {
                    roomName: toJson.data,
                }

                roomList.push(newRoom);
                console.log("Create room : room is not Found");
            }
            
        }
        else if (toJson.eventName == "JoinRoom")
        {
            console.log("Joined Room")
        }
       // console.log("send from client :" + data);
        
        
        });
    }
    //CreateRoom
    //JoinRoom


    console.log("client connected.");
    wsList.push(ws);

    


    ws.on("close", ()=>{
        console.log("client disconnected.");
        wsList = ArrayRemove(wsList,ws);
    
    });
});

function ArrayRemove(arr, value)
{
    return arr.filter((element) => {
        return element != value;
    });
}

function Boardcast(data)
{
    for(var i = 0;i < wsList.length; i++)
    {
        wsList[i].send(data);
    }
}