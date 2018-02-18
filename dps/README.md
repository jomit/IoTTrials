# Device Provisioning Service Walkthrough

## Create IoT Hub and Device Provisioning Service in Azure

- https://docs.microsoft.com/en-us/azure/iot-dps/quick-setup-auto-provision 


## Create Certificate Chain

- `cd certs-enrollments`

- `node create_test_cert.js root myrootca`  (create root certificate)

- Add certificate to Device Provisioning Service and Generate Verification Code

- `node create_test_cert.js verification "myrootca" {verification code}`

- Upload the `verification_cert.pem` and Verify the certificate


## Create Enrollment group

- `cd certs-enrollments`

- `node create_enrollment_group.js "home" "{provisioning service connection string}" "myrootca_cert.pem"`  (create enrollment)

## Register the Device using nodejs sdk

- `cd certs-enrollments`

- `node create_test_cert.js device mypi myrootca`  (create device certificate)

- Setup device and copy `device-registration` folder

    - See raspberry pi setup instructions below.

- Copy `mypi_cert.pem` and `mypi_key.pem` into the `device_registration` folder

- SSH into PI and `cd device_registration`

- `npm install`

- Update the `config.json` file

- `node register.js`

    - For raspberry pi auto load on boot, see instructions below.


## Resources

- [Node.js Provisioning Tool](https://github.com/Azure/azure-iot-sdk-node/tree/master/provisioning/tools) 

- [Create Certificate Chain using Powershell or Bash](https://github.com/Azure/azure-iot-sdk-c/blob/master/tools/CACertificates/CACertificateOverview.md)

- [Enroll Device programmatically](https://docs.microsoft.com/en-us/azure/iot-dps/quick-enroll-device-x509-node)

- [Create and provision an X.509 simulated device](https://docs.microsoft.com/en-us/azure/iot-dps/quick-create-simulated-device-x509-node)


## Setup Raspberry PI 

- Initial Setup

    - https://learn.adafruit.com/series/learn-raspberry-pi

    - Once WIFI is enabled, connect PI with laptop via USB

    - `npm install -g device-discovery-cli gulp`

    - `devdisco list --eth` or `devdisco list --wifi`

    - SSH into PI using the IP and Install Node.js

- Using init.d to auto start node app on Boot 

    - `cd /etc/init.d`

    - `sudo nano provisionDeviceService`

    - Copy the content from `provisionDeviceService` file

    - `sudo chmod 755 provisionDeviceService`

    - `sudo sh provisionDeviceService start`  (test)

    - `sudo update-rc.d provisionDeviceService defaults`

    - `sudo update-rc.d -f provisionDeviceService remove` (to remove the service)

- Using Cron to auto start node app on Boot

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






