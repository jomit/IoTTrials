var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var port = process.env.PORT || "3000";

console.log("APP LISTENING ON => " + port);

server.listen(port);

app.use(express.static(__dirname + '/public'));

var EventHubClient = require('azure-event-hubs').Client;
var connectionString = '';

var printError = function (err) {
   console.log(err.message);
};

var client = EventHubClient.fromConnectionString(connectionString);

function getRandomValue(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

io.on('connection', function (socket) {
  socket.emit('connectionstart', { message: 'Started Receiving...' });
  socket.on('command', function (data) {
    console.log(data);
  });

  client.open()
    .then(client.getPartitionIds.bind(client))
    .then(function (partitionIds) {
        return partitionIds.map(function (partitionId) {
            return client.createReceiver('$Default', partitionId, { 'startAfterTime' : Date.now()}).then(function(receiver) {
                console.log('Created partition receiver: ' + partitionId)
                receiver.on('errorReceived', printError);
                receiver.on('message', function(message){
                   socket.emit('ambientlightsensor', message.body);
                });
            });
        });
    })
    .catch(printError);

    // SIMULATE IOT HUB EVENTS
    // ------------------------------------------------------------------
    // setInterval(function(){
    //     var ambientlight = getRandomValue(500,1200);
    //     socket.emit('ambientlightsensor', { deviceId: 'simulatedsensor1', ambientlight: ambientlight });
    //  }, 250);
});