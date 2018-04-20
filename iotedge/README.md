# IoT Edge V2 on Raspberry PI

- `url -sSL https://get.docker.com | sh`

- `sudo apt-get purge wolfram-engine libreoffice* minecraft-pi sonic-pi`

- Use Raspbian Lite : https://www.raspberrypi.org/downloads/raspbian/

- `sudo apt-get autoremove`

- `sudo apt-get clean`

# Build IoT Edge Module on Linux VM

- Prerequisites : https://docs.microsoft.com/en-us/azure/iot-edge/tutorial-simulate-device-linux 

- Install dotnet core : https://www.microsoft.com/net/download/linux

- Follow tutorial : https://docs.microsoft.com/en-us/azure/iot-edge/tutorial-csharp-module
    
    `dotnet new -i Microsoft.Azure.IoT.Edge.Module`

    `dotnet new aziotedgemodule -n FilterModule`

    `cd FilterModule`

    Update `Program.cs` code

    `dotnet publish FilterModule.csproj`

    `docker build -f "./Docker/linux-x64/Dockerfile" --build-arg EXE_DIR="./bin/Debug/netcoreapp2.0/publish" -t "deviceregistry.azurecr.io/jomitfilter:latest"  "/home/jomit/FilterModule"`

    `docker login -u deviceregistry -p "<password>" deviceregistry.azurecr.io`

    `docker push deviceregistry.azurecr.io/jomitfilter`

    `sudo iotedgectl login --address deviceregistry.azurecr.io --username deviceregistry --password "<password>"`