using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Azure.Devices;
using Microsoft.Azure.Devices.Common.Exceptions;


namespace CreateDeviceIdentity
{
    class Program
    {
        static RegistryManager registryManager;
        static string connectionString = "";

        static void Main(string[] args)
        {
            registryManager = RegistryManager.CreateFromConnectionString(connectionString);
            AddDeviceAsync().Wait();
            Console.ReadLine();
        }

        private static async Task AddDeviceAsync()
        {
            string deviceId = "aircraft101";
            Device device;
            try
            {
                //device = await registryManager.AddDeviceAsync(new Device(deviceId));
                device = await registryManager.AddDeviceAsync(new Device(deviceId)
                {
                    Authentication = new AuthenticationMechanism()
                    {
                        X509Thumbprint = new X509Thumbprint()
                        {
                            PrimaryThumbprint = "<>"
                        }
                    }
                });
            }
            catch (DeviceAlreadyExistsException)
            {
                device = await registryManager.GetDeviceAsync(deviceId);
            }
            //catch (Exception ex)
            //{
            //    device = null;
            //    Console.WriteLine(ex.Message);
            //}
            //Console.WriteLine("Generated device key: {0}", device.Authentication.SymmetricKey.PrimaryKey);
            Console.WriteLine("Generated device key: {0}", device.Authentication.X509Thumbprint.PrimaryThumbprint);
        }

    }
}
