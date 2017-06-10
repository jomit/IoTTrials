var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var Registry = require('azure-iothub').Registry;
var Client = require('azure-iothub').Client;

var iothubConnectionString = "";
var registry = Registry.fromConnectionString(iothubConnectionString);
var iothubClient = Client.fromConnectionString(iothubConnectionString);
var deviceToReboot = "simulatedtempsensor";

var EventHubClient = require('azure-event-hubs').Client;
var client = EventHubClient.fromConnectionString(iothubConnectionString);

var port = process.env.PORT || "3000";
console.log("APP LISTENING ON => " + port);
server.listen(port);
app.use(express.static(__dirname + '/public'));
//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.json());

// app.post("/rebootdevice", function (req, res) {
//     deviceToReboot = req.body.deviceId;
//     startRebootDevice();
//     setInterval(queryTwinLastReboot, 2000);
// });


var printError = function (err) {
   console.log(err.message);
};


function getRandomValue(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

io.on('connection', function (socket) {
  socket.emit('connectionstart', { message: 'Started Receiving Temperature Data...' });
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
                       socket.emit('temperaturesensor', message.body);
                    });
                });
            });
        })
        .catch(printError);

    //SIMULATE IOT HUB EVENTS
    //------------------------------------------------------------------
    // setInterval(function(){
    //     var temperature = getRandomValue(10,150);
    //     socket.emit('temperaturesensor', { deviceId: 'simulatedsensor1', temperature: temperature });
    //  }, 1000);
});


var startRebootDevice = function(twin) {

    var methodName = "reboot";

    var methodParams = {
        methodName: methodName,
        payload: null,
        timeoutInSeconds: 30
    };

    iothubClient.invokeDeviceMethod(deviceToReboot, methodParams, function(err, result) {
        if (err) { 
            console.error("Direct method error: "+err.message);
        } else {
            console.log("Successfully invoked the device to reboot.");  
        }
    });
};


var queryTwinLastReboot = function() {

    registry.getTwin(deviceToReboot, function(err, twin){

        if (twin.properties.reported.iothubDM != null)
        {
            if (err) {
                console.error('Could not query twins: ' + err.constructor.name + ': ' + err.message);
            } else {
                var lastRebootTime = twin.properties.reported.iothubDM.reboot.lastReboot;
                console.log('Last reboot time: ' + JSON.stringify(lastRebootTime, null, 2));
            }
        } else 
            console.log('Waiting for device to report last reboot time.');
    });
};
