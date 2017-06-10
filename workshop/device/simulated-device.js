'use strict';

var clientFromConnectionString = require('azure-iot-device-http').clientFromConnectionString;
var Message = require('azure-iot-device').Message;

var deviceConnectionString = "";
var client = clientFromConnectionString(deviceConnectionString);

function printResultFor(op) {
   return function printResult(err, res) {
     if (err) console.log(op + ' error: ' + err.toString());
     if (res) console.log(op + ' status: ' + res.constructor.name);
   };
}

function getRandomValue(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

var connectCallback = function (err) {
   if (err) {
     console.log('Could not connect: ' + err);
   } else {
     console.log('Client connected');
     console.log('Sending temperature data.... and waiting for reboot method.');
     //client.onDeviceMethod('reboot', onReboot);

     // Create a message and send it to the IoT Hub every second
     setInterval(function(){
         var temperature =   getRandomValue(0,150);
         var data = JSON.stringify({ deviceId: 'simulatedtempsensor', temperature: temperature });
         var message = new Message(data);
         console.log("Sending message: " + message.getData());
         client.sendEvent(message, printResultFor('send'));
     }, 1000);
   }
};

var onReboot = function(request, response) {

    // Respond the cloud app for the direct method
    response.send(200, 'Reboot started', function(err) {
        if (!err) {
            console.error('An error occured when sending a method response:\n' + err.toString());
        } else {
            console.log('Response to method \'' + request.methodName + '\' sent successfully.');
        }
    });

    // Report the reboot before the physical restart
    var date = new Date();
    var patch = {
        iothubDM : {
            reboot : {
                lastReboot : date.toISOString(),
            }
        }
    };

    // Get device Twin
    client.getTwin(function(err, twin) {
        if (err) {
            console.error('could not get twin');
        } else {
            console.log('twin acquired');
            twin.properties.reported.update(patch, function(err) {
                if (err) throw err;
                console.log('Device reboot twin state reported')
            });  
        }
    });

    // Add your device's reboot API for physical restart.
    // Make sure to add retries with exponential backoff
    console.log('Rebooting!');
};

client.open(connectCallback);
