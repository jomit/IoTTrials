Preparing your Raspberry Pi
-------------------------------------------------
https://learn.adafruit.com/series/learn-raspberry-pi


Device Discovery
------------------------------------------------------------
    npm install -g device-discovery-cli gulp

    devdisco list --eth
    devdisco list --wifi

Start VNC Server on PI
-----------------------------------------------
    sudo apt-get update
    sudo apt-get install tightvncserver

    vncserver :1 -geometry 1920x1080 -depth 24 -dpi 96
    # OR
    tightvncserver

    tightvncserver kill :1   (killing the process at the end)

    ifconfig  (to get the ip address of the PI)

Start VNC Viewer on Laptop
-----------------------------------
Install tightvnc viewer : http://www.tightvnc.com/download.html
Open Tight VNC Viewer -> <PI IP Address>:1


Autostart tightvncserver 
----------------------------------------------
http://raspberrypi.stackexchange.com/questions/27676/auto-start-tightvncserver-on-raspberry-pi-2


Check Disk Space
----------------------------------
    df -Bm


Enable BLE connectivity + Thunderboard React connectivity
---------------------------------------------------
![Thunderboard + RaspberryPi + Azure](https://raw.githubusercontent.com/jomit/IoTTrials/master/pi-gateway/ble-pi.png)

    sudo apt-get update
    sudo apt-get upgrade
    sudo apt-get install nodejs

    # restart the pi

    sudo mkdir thundertest
    cd thundertest

    # copy read-sensor.js and package.json

    sudo npm install noble
    sudo npm install node-thunderboard-react

    sudo node read-sensor.js

    # to connect with IoT Hub

    sudo node read-sensor-iothub.js

Getting started with Samples
------------------------------------------------------------
    git clone https://github.com/Azure-Samples/iot-hub-node-raspberrypi-getting-started.git
    cd iot-hub-node-raspberrypi-getting-started
    cd Lesson1
    code .

    npm install
    gulp init

    # In Windows use below command to open the config file and update the details in it)
    code %USERPROFILE%\.iot-hub-getting-started\config-raspberrypi.json

    gulp install-tools

    gulp deploy && gulp run


Install CLI 2.0   (make sure to install Python before this step)
------------------------------------------------------------

    pip install --upgrade azure-cli
    pip install --upgrade azure-cli-iot


Create IoT Hub in Azure and register a new Device
------------------------------------------------------------

    az login

    az account set --subscription {subscription id or name}

    az provider register -n "Microsoft.Devices"

    az group create --name iot-sample --location westus

    az iot hub create --name {my hub name} --resource-group iot-sample

    # For Windows command prompt
    az iot device create --device-id myraspberrypi --hub-name {my hub name} --x509 --output-dir %USERPROFILE%\.iot-hub-getting-started

    az iot -h

    cd Lesson3
    code .


Create Function using ARM Template
------------------------------------------------------------

    # Replace IoT Hub name and prefix in arm template parameters

    az group deployment create --template-file arm-template.json --parameters @arm-template-param.json -g iot-sample

    az iot hub list -g iot-sample --query [].name

    az iot hub show-connection-string --name jomitpihub -g iot-sample

    az iot device show-connection-string --hub-name jomitpihub --device-id mypi -g iot-sample


    npm install
    gulp init

    # update configuration in the generated filed
    code %USERPROFILE%\.iot-hub-getting-started\config-raspberrypi.json

    gulp deploy && gulp run


Iot Hub Explorer Monitoring
------------------------------------------------------------
    npm install -g iothub-explorer

    iothub-explorer monitor-events mypi --login '<iot hub connection string>'






