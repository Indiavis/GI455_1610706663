const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 }); //1.เปิดพอร์ท 8080
console.log("Server is Connect"); 
wss.on('connection', function connection(myself) { //2.ถ้า Cilent ต่อเข้ามา
    myself.on('message', function incoming(data) { //3.ถ้ามีข้อมูลเข้ามา(webSocket.Send(inputField.text);)
        console.log(data);
        wss.clients.forEach(function each(client) { //4.ส่ง Data กลับไปที่ Unity ยกเว้นตัวเราเอง
            if (client !== myself && client.readyState === WebSocket.OPEN) { //ถ้า Cilent ไม่ใช่ myself และ Cilent อยู่ใน state ที่พร้อมจะรับข้อมูล
                client.send(data); //cilent ที่กำจะถูกเซิร์ฟเวอร์ส่งข้อมูลไปหา
            }
        });
    });
});