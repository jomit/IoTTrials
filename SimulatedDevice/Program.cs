using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Azure.Devices.Client;
using Newtonsoft.Json;
using System.Security.Cryptography.X509Certificates;

namespace SimulatedDevice
{
    class Program
    {
        static DeviceClient deviceClient;
        static string iotHubUri = "jomitiohub.azure-devices.net";

        static void Main(string[] args)
        {
            var deviceId = "aircraft101";
            Console.WriteLine("Simulated device => {0} \n", deviceId);

            //deviceClient = DeviceClient.Create(iotHubUri, new DeviceAuthenticationWithRegistrySymmetricKey(deviceId, deviceThumbprint));
            deviceClient = DeviceClient.Create(iotHubUri, new DeviceAuthenticationWithX509Certificate(deviceId, new X509Certificate2("boeing.iothub.test.pfx", "pass@word1")));

            SendDeviceToCloudMessagesAsync(deviceId);
            Console.ReadLine();
        }

        private static async void SendDeviceToCloudMessagesAsync(string deviceId)
        {
            double avgWindSpeed = 10; // m/s
            Random rand = new Random();

            while (true)
            {
                double currentWindSpeed = avgWindSpeed + rand.NextDouble() * 4 - 2;

                var telemetryDataPoint = new
                {
                    deviceId = deviceId,
                    windSpeed = currentWindSpeed
                };
                var messageString = JsonConvert.SerializeObject(telemetryDataPoint);
                var message = new Message(Encoding.ASCII.GetBytes(messageString));

                await deviceClient.SendEventAsync(message);
                Console.WriteLine("{0} > Sending message: {1}", DateTime.Now, messageString);

                Task.Delay(1000).Wait();
            }
        }

    }
}
