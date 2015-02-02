var WebSocketServer = require("ws").Server
var http = require("http")
var express = require("express")
var app = express()
var port = process.env.PORT || 5000
var serialport = require("serialport");
var SerialPort = serialport.SerialPort;

app.use(express.static(__dirname + "/"));
// app.use(express.static(__dirname + "views"));

var server = http.createServer(app)
server.listen(port)

console.log("http server listening on %d", port);

// a convenient variable to refer to the HTML directory
var html_dir = './html/';

// routes to serve the static HTML files
app.get('/test', function(req, res) {
    res.sendfile(html_dir + 'test.html');
});


var wss = new WebSocketServer({server: server})
console.log("websocket server created")

wss.on("connection", function(ws) {
  var id = setInterval(function() {
    ws.send(JSON.stringify(new Date()), function() {  })
  }, 1000)

  console.log("websocket connection open")

  ws.on("close", function() {
    console.log("websocket connection close")
    clearInterval(id)
  })
})
