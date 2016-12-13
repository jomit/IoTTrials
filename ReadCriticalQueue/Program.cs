using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;
using Microsoft.ServiceBus.Messaging;

namespace ReadCriticalQueue
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Receive critical messages. Ctrl-C to exit.\n");
            var connectionString = "Endpoint=sb://jomitservicebus.servicebus.windows.net/;SharedAccessKeyName=ListenerAccessKey;SharedAccessKey=XCR+SjXIEA9DZCYQEgGdsEica1p6fpjHBUDYPi4LKNs=";
            var queueName = "ac-critial-msg";

            var client = QueueClient.CreateFromConnectionString(connectionString, queueName);

            client.OnMessage(message =>
            {
                //try
                //{
                Stream stream = message.GetBody<Stream>();
                StreamReader reader = new StreamReader(stream, Encoding.ASCII);
                string s = reader.ReadToEnd();
                Console.WriteLine(String.Format("Message Id : {0} => Message body: {1}", message.MessageId, s));
                //}
                //catch (Exception ex)
                //{
                //    Console.WriteLine(ex.Message);
                //}
            });

            Console.ReadLine();

        }
    }
}
