const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
http.listen(65080);

var clients = {};

app.get('/', function(req, res) {
    res.send('O servidor está inicializado');
});

io.on("connection", function(client) {
    client.on("join", function(name) {
        clients[client.id] = name;
        clients[client.color] = getRandomColor();
        console.log("Joined: " + name + " Color: " + clients[client.color]);
        client.emit("login", clients[client.color]);
        client.emit("update", "Você entrou no bate-papo.", clients[client.color]);
        client.broadcast.emit("update", name + " entrou no bate-papo.", clients[client.color])
    });

    client.on("send", function(msg) {
        console.log("Message: " + msg + " Color: " + clients[client.color]);
        client.broadcast.emit("chat", clients[client.id], msg, clients[client.color]);
    });

    client.on("disconnect", function() {
        console.log("Disconnect");
        io.emit("update", clients[client.id] + " saiu do bate-papo.", clients[client.color]);
        delete clients[client.id];
    });
});

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}