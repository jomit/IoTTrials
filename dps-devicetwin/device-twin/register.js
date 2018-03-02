'use strict';

var register = module.exports = {};

var fs = require('fs');
var retry = require('retry');
var Transport = require('azure-iot-provisioning-device-http').Http;
var X509Security = require('azure-iot-security-x509').X509Security;
var ProvisioningDeviceClient = require('azure-iot-provisioning-device').ProvisioningDeviceClient;

var config = require("./config.json");
var deviceCert = {
  cert: fs.readFileSync(config.deviceCertificateFile).toString(),  // // '<cert file name>.pem';
  key: fs.readFileSync(config.deviceCertificateKeyFile).toString() // // '<cert key file name>.pem';
};

register.registerDevice = function (callback) {
  
  var transport = new Transport();
  var securityClient = new X509Security(config.deviceId, deviceCert);
  var deviceClient = ProvisioningDeviceClient.create(config.deviceEndPoint, config.idScope, transport, securityClient);
  
  var operation = retry.operation({
    retries: 5,
    factor: 3,
    minTimeout: 1 * 1000,
    maxTimeout: 60 * 1000,
    randomize: true,
  });

  operation.attempt(function (currentAttempt) {
    deviceClient.register(function (err, result) {
      if (operation.retry(err)) {
        console.log(err.message);
        console.log("retrying...");
        return;
      }
      callback(err ? operation.mainError() : null, result);
    });
  });
}