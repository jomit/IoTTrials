# IoT Hub Device Management

    npm install -g iothub-explorer@latest

    iothub-explorer login "{iot hub connection string}"

    iothub-explorer create myDeviceId --connection-string

    iothub-explorer list devices --display deviceId

    node device\simulated-device.js

    node sampleclientapp\server.js

# Storage AZCOPY

    azcopy /Source:C:\mydata /Dest:https://jomitml.blob.core.windows.net/test /DestKey:key= /Pattern:"00Z.txt"

    azcopy /Source:C:\mydata /Dest:https://myaccount.blob.core.windows.net/mycontainer /DestKey:key /S


    azcopy /Source:https://myaccount.blob.core.windows.net/mycontainer /Dest:C:\mydata\download /SourceKey:key /Pattern:"00Z.txt"

    azcopy /Source:https://myaccount.blob.core.windows.net/mycontainer /Dest:C:\mydata\download /SourceKey:key /S

# Stream Analytics

    SELECT *
    INTO documentdb
    FROM iothubinput

    SELECT 
        System.Timestamp AS OutputTime,
        DEVICEID AS SensorName,
        Avg(TEMPERATURE) AS AvgTemperature
    INTO
        documentdb
    FROM
        iothubinput TIMESTAMP By EventEnqueuedUtcTime
    GROUP BY 
        TumblingWindow(second,5),DEVICEID
    HAVING 
        Avg(TEMPERATURE)>50