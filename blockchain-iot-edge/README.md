# IoT Edge Audit Module for Blockchain

#### Prerequisites

- Install [Visual Studio Code](https://code.visualstudio.com/)

- Install [Azure IoT Toolkit](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-toolkit) extension

- Install [Azure IoT Edge](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-edge) extension

- Install [Docker for Windows](https://docs.docker.com/docker-for-windows/install/)

- Install [.NET Core SDK](https://www.microsoft.com/net/core#windowscmd)

- Install [Python](https://www.python.org/downloads/)


#### Setup

- Create IoT Hub

- Create a new IoT Device in the IoT Hub using Portal or VSCode

- Create a new IoT Edge Device in the IoT Hub using Portal or VSCode

- Create Azure Container Registry named `edgeregistry` with Admin User

- Install [Azure IoT Edge Runtime](https://docs.microsoft.com/en-us/azure/iot-edge/quickstart)
    - `pip install -U azure-iot-edge-runtime-ctl`

- Start Docker for Windows

- Login to Azure Container Registry
    - `docker login edgeregistry.azurecr.io -u edgeregistry -p <password>`

#### Configure Certificates for IoT Edge Runtime

- Open Powershell in Administrator mode

- `git clone -b modules-preview https://github.com/Azure/azure-iot-sdk-c.git`

- `cd <edgefolder>`

- `.  C:\azure-iot-sdk-c\tools\CACertificates\ca-certs.ps1`

- `Test-CACertsPrerequisites`

- `New-CACertsCertChain rsa`

- `New-CACertsEdgeDevice myedgegateway`

- Add the `RootCA.pem` certificate to IoT Hub using Azure Portal.

- Edit `c:\windows\system32\drivers\etc\hosts` file and add `127.0.0.1  myedgegateway.test.com`

#### Create & Deploy IoT Edge Solution

- See `\EdgeGateway` sample code

- https://docs.microsoft.com/en-us/azure/iot-edge/tutorial-multiple-modules-in-vscode

- Right click on `deployment.template.json` file and click `Build IoT Edge Solution`. This will build the container images and push to ACR.

- Update the generated `config\deployment.json` file to add additional modules. Use `deployment-with-blockchain.json` for reference

- In the Azure IoT Hub Devices explorer in Visual Studio Code, right click the edge device, click on `Create deployment for edge device` and select the `deployment.json` file.
    - We can also do this using Azure Portal using Set Modules option.
    

#### Start IoT Edge Runtime

- `iotedgectl setup --connection-string "<IoT Edge device connection string >" --edge-hostname "myedgegateway.test.com" --device-ca-cert-file myedgegateway-public.pem --device-ca-chain-cert-file myedgegateway-all.pem --device-ca-private-key-file myedgegateway-private.pem --owner-ca-cert-file RootCA.pem`

- `iotedgectl login --address edgeregistry.azurecr.io --username edgeregistry --password <password>`

- `iotedgectl start`

- `docker ps`

- `docker logs -f AuditModule`

#### Create & Run Simulated Leaf Device

- See `\DotnetDevice`


#### Troubleshooting

- For port related issues, Reset docker to factory defaults.

