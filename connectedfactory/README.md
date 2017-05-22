# Deploying a Gateway and proxy

Documentation : https://docs.microsoft.com/en-us/azure/iot-suite/iot-suite-connected-factory-gateway-deployment


# Windows (local laptop)

Start Docker for Windows and Share 'C' drive. If you get firewall error. Try removing and adding the File sharing service from DockerNAT.
Also double check the sharing permission on the drive, make sure local admin is added with full permissions.

    docker network create -d bridge mynetwork

    docker pull microsoft/iot-gateway-opc-ua:1.0.0

    docker pull microsoft/iot-gateway-opc-ua-proxy:0.1.3
 
    docker run -it --rm --network=mynetwork -h publisher.mars01.corp.contoso -v //C/docker:/build/src/GatewayApp.NetCore/bin/Debug/netcoreapp1.0/publish/CertificateStores -v //C/docker:/root/.dotnet/corefx/cryptography/x509stores microsoft/iot-gateway-opc-ua:1.0.0 publisher.mars01.corp.contoso "<IOT hub connection string>"

    docker run -it --rm --network=mynetwork -v //C/docker:/mapped microsoft/iot-gateway-opc-ua-proxy:0.1.3 -i -c "<IOT hub connection string>" -D /mapped/cs.db

    docker run -it --rm --network=mynetwork --name publisher.mars01.corp.contoso -h publisher.mars01.corp.contoso --expose 62222 -p 62222:62222 -v //C/docker:/build/src/GatewayApp.NetCore/bin/Debug/netcoreapp1.0/publish/Logs -v //C/docker:/build/src/GatewayApp.NetCore/bin/Debug/netcoreapp1.0/publish/CertificateStores -v //C/docker:/shared -v //C/docker:/.dotnet/corefx/cryptography/x509stores -e \_GW\_PNFP="/shared/publishednodes.JSON" microsoft/iot-gateway-opc-ua:1.0.0 publisher.mars01.corp.contoso

    docker run -it --rm --network=mynetwork -v //C/docker:/mapped microsoft/iot-gateway-opc-ua-proxy:0.1.3 -D /mapped/cs.db


# Test Client with => opc.tcp://publisher.mars01.corp.contoso:62222