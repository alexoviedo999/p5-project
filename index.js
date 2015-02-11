var WebSocketServer = require("ws").Server
var http = require("http")
var express = require("express")
var app = express()
var port = process.env.PORT || 5000
var serialport = require("serialport");
var SerialPort = serialport.SerialPort;

// set up handlebars view engine
var handlebars = require('express3-handlebars').create({ 
	defaultLayout:'main' 
});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');


var server = http.createServer(app);
server.listen(port)

console.log("http server listening on %d", port);

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
	res.render('home');
});

app.get('/about', function(req, res) {
	res.render('about');
});

app.get('/play/play_one', function(req, res) {
	res.render('play_one');
});

app.get('/play/tesseract', function(req, res) {
  res.render('tesseract');
});

// // 404 catch-all handler (middleware)
// app.use(function(req, res, next){
// res.status(404);
// res.render('404');
// });
// // 500 error handler (middleware)
// app.use(function(err, req, res, next){
// console.error(err.stack);
// res.status(500);
// res.render('500');
// });

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
