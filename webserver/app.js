var express = require("express");
var app = express();
var url = require('url');
var http = require('http').Server(app);
//var io = require('socket.io')(http);
var WebSocket = require('ws');

var zerorpc = require("zerorpc");

var client = new zerorpc.Client();
client.connect("tcp://192.168.0.13:6000");

client.on("error", function(error) {
    console.error("RPC client error:", error);
});


//app.use(express.static('public'));
app.use(express.static(__dirname));

app.get(`/`, (req, res) => {
    res.sendFile('index.html');
  });

var server = http.listen(3000, function(){
    console.log("Node.js is listening to PORT:" + server.address().port);
});

var wss = new WebSocket.Server({
    server: server,
    clientTracking: true
});


wss.on('connection', function connection(ws, req) {
    // disconnect old clients
    wss.clients.forEach(function each(client){
        if(client !== ws){
            client.terminate();
            console.log("disconnect");
        }
    });

    client.invoke("toSafeMode");
  
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
        data = JSON.parse(message);
        console.log(data.type);
        switch(data.type){
            case 'moveToward':
                client.invoke("moveToward", data.data.x, data.data.y, function(error, res, more) {});
                break;
      	case 'move':
                client.invoke("move", data.data.x, data.data.y, function(error, res, more) {});
                break;
        }
    });
});
