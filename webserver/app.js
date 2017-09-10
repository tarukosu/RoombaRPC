var express = require("express");
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

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

var latest_user_socket_id = "";

io.on('connection', function (socket) {

    if(io.sockets.sockets[latest_user_socket_id]){
        io.sockets.sockets[latest_user_socket_id].disconnect();
        console.log("disconnect: " + latest_user_socket_id)
    }
    //var user_socket_id = socket.id;
    latest_user_socket_id = socket.id
    console.log(latest_user_socket_id);

    client.invoke("toSafeMode")
    /*
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
      console.log(data);
    });
    */

    socket.on('moveTo', function (data) {
        //console.log(data.x);
        
        client.invoke("moveTo", data.x, data.y, function(error, res, more) {
            //console.log(res);
        });
    });
});

