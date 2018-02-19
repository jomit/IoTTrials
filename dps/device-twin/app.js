"use strict";

var register = require("./register");
var device = require("./device");

register.registerDevice(function (err, result) {
    if (err) {
        console.log("error registering device: " + err);
    } else {
        console.log('registration succeeded');
        console.log('assigned hub=' + result.assignedHub);
        console.log('deviceId=' + result.deviceId);
        device.connect(result.assignedHub);
    }
});