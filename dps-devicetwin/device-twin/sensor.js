'use strict';

var sensor = module.exports = {};

var ThunderboardReact = require('node-thunderboard-react');
var thunder = new ThunderboardReact();

var currentDevice = null;

sensor.update = function (color) {
    var isBlue = color == "blue" ? 1 : 0;

    if (currentDevice) {
        var status = { 'led0': isBlue, 'led1': !isBlue };
        currentDevice.setLedStatus(status, (error) => {
            console.log("sensor updated...")
        });
    } else {
        thunder.init((error) => {
            thunder.startDiscovery((device) => {
                console.log('- Found ' + device.localName);
                thunder.stopDiscovery();
                device.connect((error) => {
                    currentDevice = device;
                    var status = { 'led0': isBlue, 'led1': !isBlue };
                    device.setLedStatus(status, (error) => {
                        console.log("sensor updated...")
                    });
                });
            });
        });
    }
}