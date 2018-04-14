# IoT Edge Tracker Module for Blockchain

#### Create Azure Container Registry

- TODO

#### Create IoT Hub

- TODO

#### Create & Setup IoT Edge Device
    
- Using VSCode or Using Portal

- Edit hosts file "127.0.0.1 edgegateway.local"

- Start docker on windows

- `iotedgectl setup --connection-string "HostName=blockchain-hub.azure-devices.net;DeviceId=myedgedevice;SharedAccessKey=<key>" --edge-hostname "edgegateway.local" --auto-cert-gen-force-no-passwords`

- `iotedgectl start`

- `docker ps`

- `docker logs -f edgeAgent`

- Test default route for IoT Edge

    - Click on Iot Edge device in portal

    - Clickc on Set Modules -> Next -> [Make sure default route] -> Submit

    - `docker ps`

    - You should see a new `edgeHub` container

    - `docker logs -f edgeHub`

- Test device connection

    - Create new device on IoT Hub 

    - Update connection string in `device\app.js`

    - `npm start`

    - Start monitoring D2C message

#### Create IoT Edge Module

- `dotnet new -i Microsoft.Azure.IoT.Edge.Module`

- `dotnet new aziotedgemodule -n TrackerModule`

- Update the code in `Program.cs` inside `PipeMessage` function

- Update the `repository` in `module.json` file to point to ACR

- `docker login edgeregistry.azurecr.io -u edgeregistry -p <password>`

- Right click on `module.json` and click `Build and Push IoT Edge Module Image`


#### Deploy IoT Edge Module

- In Azure Portal open the edge device and click on `Set Modules`

- Click on `Add IoT Edge Module`
    - Name : `trackermodule`
    - Image URI :

- Click Next and specify the route :

    ```{
        "routes": {
            "sensorToTrackerModule": "FROM /messages/* WHERE NOT IS_DEFINED($connectionModuleId) INTO BrokeredEndpoint(\"/modules/trackermodule/inputs/input1\")",
            "trackerModuleToIoTHub": "FROM /messages/modules/trackermodule/outputs/output1 INTO $upstream"
        }
    }```

- `iotedgectl login --address edgeregistry.azurecr.io --username edgeregistry --password <password>`

- TODO Next Steps...

# Additional Resources

- https://docs.microsoft.com/en-us/azure/iot-edge/tutorial-csharp-module

- https://docs.microsoft.com/en-us/azure/iot-edge/how-to-vscode-develop-csharp-module

- https://github.com/Nethereum/Nethereum/blob/master/src/Nethereum.Tutorials/Nethereum.Tutorials.Core/CallTransactionEvents/CallTranEvents.cs



