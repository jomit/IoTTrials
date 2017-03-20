'use strict';

var fs = require("fs");
var Protocol = require("azure-iot-device-mqtt").Mqtt;
//var Protocol = require("azure-iot-device-http").Http;
var Client = require("azure-iot-device").Client;
var Message = require("azure-iot-device").Message;
var ThunderboardReact = require('node-thunderboard-react');
var thunder = new ThunderboardReact();

var connectionString = "HostName=jomitpihub.azure-devices.net;DeviceId=mypi;x509=true";
//var certFile = "mypi-cert.pem";
//var keyFile = "mypi-key.pem";
var deviceId = "mypi";
var passPhrase ="";

var client = Client.fromConnectionString(connectionString,Protocol);

var connectCallBack = function (err) {
    if(err) {
        console.error("Could not connect: " + err.message);
    } else {
        console.log("Client connected");
        client.on("message",function(msg) {
            console.log("Id: " + msg.messageId + "Body: " + msg.data);
            // When using MQTT the following line is a no-op.
            client.complete(msg, sendMessageCallback);
            // The AMQP and HTTP transports also have the notion of completing, rejecting or abandoning the message.
            // When completing a message, the service that sent the C2D message is notified that the message has been processed.
            // When rejecting a message, the service that sent the C2D message is notified that the message won't be processed by the device. the method to use is client.reject(msg, callback).
            // When abandoning the message, IoT Hub will immediately try to resend it. The method to use is client.abandon(msg, callback).
            // MQTT is simpler: it accepts the message by default, and doesn't support rejecting or abandoning a message
        });

        connectDeviceAndStartMonitoring();

        client.on('error', function (err) {
            console.error(err.message);
        });

        client.on("disconnect",function(){
            //clearInterval(sendInterval);
            client.removeAllListeners();
            client.open(connectCallBack);
        });
    }
};

function connectDeviceAndStartMonitoring(){
  thunder.init((error) => {
    thunder.startDiscovery((device) => {
      console.log('- Found ' + device.localName);
      thunder.stopDiscovery();
      device.connect((error) => {
        console.log('- Connected ' + device.localName);
        startMonitorLight(device);
      });
    });
  });
}

function startMonitorLight(device) {
  device.getAmbientLight((error, res) => {
    //console.log(res.lux + ' lux'); // "123.64 lux"
    var data = JSON.stringify({ deviceId : deviceId, ambientlight : res.lux });
    var message = new Message(data);
    console.log("Ambient Light message : " + message.getData());
    client.sendEvent(message, sendMessageCallback);
	setTimeout(() => {
      startMonitorLight(device);
    }, 3000);
  });
}

function sendMessageCallback(err){
  if (err) {
    console.log('Send Message error: ' + err.toString());
  } else{
	console.log('Message Sent..');
	//Blink LED here..
  } 
}

var options = {
    cert : fs.readFileSync(deviceId + "-cert.pem", "utf-8").toString(),
    key : fs.readFileSync(deviceId + "-key.pem", "utf-8").toString(),
    passPhrase : passPhrase
};

client.setOptions(options);
client.open(connectCallBack);