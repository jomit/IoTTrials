#Device Discovery
#====================================================================
cd C:\github\iot-hub-node-raspberrypi-getting-started\Lesson3

npm install -g device-discovery-cli gulp

devdisco list --eth
devdisco list --wifi


#Getting started with Sample
#====================================================================

git clone https://github.com/Azure-Samples/iot-hub-node-raspberrypi-getting-started.git
cd iot-hub-node-raspberrypi-getting-started
cd Lesson1
code .


npm install
gulp init

# For Windows command prompt
code %USERPROFILE%\.iot-hub-getting-started\config-raspberrypi.json

gulp install-tools

gulp deploy && gulp run


#Install CLI 2.0   (make sure to install Python before this step)
#====================================================================

pip install --upgrade azure-cli
pip install --upgrade azure-cli-iot


#Create IoT Hub in Azure and register a new Device
#====================================================================

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


# Create Function using ARM Template
#====================================================================

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


# Iot Hub Explorer Monitoring
#===================================================================
npm install -g iothub-explorer

iothub-explorer monitor-events mypi --login '<iot hub connection string>'










