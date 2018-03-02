'use strict';
var fs = require('fs');

var provisioningServiceClient = require('azure-iot-provisioning-service').ProvisioningServiceClient;

var serviceClient = provisioningServiceClient.fromConnectionString(process.argv[3]);

var enrollment = {
  enrollmentGroupId: process.argv[2],
  attestation: {
    type: 'x509',
    x509: {
      signingCertificates: {
        primary: {
          certificate: fs.readFileSync(process.argv[4], 'utf-8').toString()
        }
      }
    }
  },
  provisioningStatus: 'disabled',
  initialTwin : {
    properties : {
      "desired" : {
        color : "green"
      }
    }
  }
};

serviceClient.createOrUpdateEnrollmentGroup(enrollment, function(err, enrollmentResponse) {
  if (err) {
    console.log('error creating the group enrollment: ' + err);
  } else {
    console.log("enrollment record returned: " + JSON.stringify(enrollmentResponse, null, 2));
    enrollmentResponse.provisioningStatus = 'enabled';
    serviceClient.createOrUpdateEnrollmentGroup(enrollmentResponse, function(err, enrollmentResponse) {
      if (err) {
        console.log('error updating the group enrollment: ' + err);
      } else {
        console.log("updated enrollment record returned: " + JSON.stringify(enrollmentResponse, null, 2));
      }
    });
  }
});