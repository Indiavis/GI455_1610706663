const WebSocket = require('ws');

const ws = new WebSocket('ws://gi455-305013.an.r.appspot.com/');

const object = { eventName: "GetStudentData", studentID: "1610706663" }

ws.on('open', function open() {
    ws.send(JSON.stringify(object));
});

ws.on('message', function incoming(data) {
    console.log(data);
});