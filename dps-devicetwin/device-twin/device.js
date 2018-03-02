'use strict';

var device = module.exports = {};

var fs = require('fs');
var config = require("./config.json");
var Client = require('azure-iot-device').Client;
var Protocol = require('azure-iot-device-mqtt').Mqtt;
var sensor = require("./sensor");

device.connect = function (iotHubAddress) {
    var connectionString = 'HostName=' + iotHubAddress + ';DeviceId=' + config.deviceId + ';x509=true';
    var client = Client.fromConnectionString(connectionString, Protocol);

    var options = {
        cert: fs.readFileSync(config.deviceCertificateFile, "utf-8").toString(),
        key: fs.readFileSync(config.deviceCertificateKeyFile, "utf-8").toString(),
        passPhrase: ""
    };
    client.setOptions(options);

    client.open(function (err) {
        if (err) {
            console.error('could not open IotHub client');
        } else {
            client.getTwin(function (err, twin) {
                if (err) {
                    console.error('could not get twin');
                } else {
                    console.log('retrieved device twin');
                    console.log('color =>' + twin.properties.desired.color);
                    sensor.update(twin.properties.desired.color);

                    twin.on('properties.desired', function(desiredChange) {
                        console.log("received change: "+JSON.stringify(desiredChange));
                        sensor.update(twin.properties.desired.color);
                    });
                }
            });
        }
    });
}