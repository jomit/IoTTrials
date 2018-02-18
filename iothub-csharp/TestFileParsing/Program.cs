using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TestFileParsing
{
    class LogData
    {
        public string Date1 { get; set; }
        public string Date2 { get; set; }
        public string HostIP { get; set; }
        public string Severity { get; set; }
        public string Message { get; set; }

    }

    class Program
    {
        static void Main(string[] args)
        {
            ICollection<object> ob;
            var reader = File.OpenText("log-sample.txt");
            string line;
            var alllogs = new List<LogData>();
            while ((line = reader.ReadLine()) != null)
            {
                string[] items = line.Split(' ');
                alllogs.Add(new LogData()
                {
                    Date1 = items[0],
                    Date2 = items[1],
                    HostIP = items[2],
                    Severity = items[3],
                    Message = String.Join(" ", items.Skip(4).ToArray())
                });
                Console.WriteLine(alllogs.Count);
                //int myInteger = int.Parse(items[1]); // Here's your integer.
                //                                     // Now let's find the path.
                //string path = null;
                //foreach (string item in items)
                //{
                //    if (item.StartsWith("item\\") && item.EndsWith(".ddj"))
                //    {
                //        path = item;
                //    }
                //}
                // At this point, `myInteger` and `path` contain the values we want
                // for the current line. We can then store those values or print them,
                // or anything else we like.
            }

            Console.ReadLine();
        }
    }
}
