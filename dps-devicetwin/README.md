# Device Provisioning Service + Device Twin Walkthrough

![Device Provisioning Service + Device Twin](https://raw.githubusercontent.com/jomit/IoTTrials/master/dps-devicetwin/dps-twin.png)

## Setup

#### Create IoT Hub and Device Provisioning Service in Azure

- https://docs.microsoft.com/en-us/azure/iot-dps/quick-setup-auto-provision 


#### Create Certificate Chain

- `cd certs-enrollments`

- `node create_test_cert.js root myrootca`  (create root certificate)

- Add certificate to Device Provisioning Service and Generate Verification Code

- `node create_test_cert.js verification "myrootca" {verification code}`

- Upload the `verification_cert.pem` and Verify the certificate


#### Create Enrollment group

- `cd certs-enrollments`

- `node create_enrollment_group.js "home" "{provisioning service connection string}" "myrootca_cert.pem"`  (create enrollment)

#### Create Device Certificate

- `cd certs-enrollments`

- `node create_test_cert.js device mypi myrootca`


#### Setup Raspberry Pi & Thunderboard React

- Update `device-twin\config.json` 

- Copy `mypi_cert.pem` and `mypi_key.pem` from `certs-enrollments` folder into the `device-twin` folder

- Copy `device-twin` folder into the raspberry pi

    - For first time setup, see raspberry pi setup instructions below.

## Run Device Registration and Device Twin code

- SSH into PI

- `cd device-twin`

- `npm install`

- `node app.js`

    - To auto start this node app on Boot for raspberry pi, see instructions below.


## Helpful Resources

- [Node.js Provisioning Tool](https://github.com/Azure/azure-iot-sdk-node/tree/master/provisioning/tools) 

- [Create Certificate Chain using Powershell or Bash](https://github.com/Azure/azure-iot-sdk-c/blob/master/tools/CACertificates/CACertificateOverview.md)

- [Enroll Device programmatically](https://docs.microsoft.com/en-us/azure/iot-dps/quick-enroll-device-x509-node)

- [Create and provision an X.509 simulated device](https://docs.microsoft.com/en-us/azure/iot-dps/quick-create-simulated-device-x509-node)


#### Raspberry PI Initial Setup

- https://learn.adafruit.com/series/learn-raspberry-pi

- Once WIFI is enabled, connect PI with laptop via USB

- `npm install -g device-discovery-cli gulp`

- `devdisco list --eth` or `devdisco list --wifi`

- SSH into PI using the IP and Install Node.js

#### Raspberry PI : Using init.d to auto start node app on Boot

- `cd /etc/init.d`

- `sudo nano provisionDeviceService`

- Copy the content from `device-twin\provisionDeviceService` file

- `sudo chmod 755 provisionDeviceService`

- `sudo sh provisionDeviceService start`  (test)

- `sudo update-rc.d provisionDeviceService defaults`

- `sudo update-rc.d -f provisionDeviceService remove` (to remove the service)

#### Raspberry PI : Using Cron to auto start node app on Boot

- (This instructions may not work for older versions of PI)

    - `which node`

    - `sudo crontab -e`

    - Add this line `@reboot sudo /usr/bin/node <path>/register.js < /dev/null &`

    - `sudo crontab -u root -l`

    - `sudo shutdown -r now;exit`

- Helpful Cron commands:

    - `grep cron /var/log/syslog`

    - `ps aux | grep cron`

- Setup Cron logging

    - `sudo nano /etc/rsyslog.conf`

    - Uncomment line `# cron.*    /var/log/cron.log`

    - `sudo /etc/init.d/rsyslog restart`

    - `sudo cat /var/log/cron.log`