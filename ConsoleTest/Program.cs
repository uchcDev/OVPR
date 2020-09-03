using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ConsoleTest
{
    class Program
    {
        static void Main(string[] args)
        {

            var x = OVPRDat.usp_22_Document_GetDocFileByCommitmentPkFileName(32, "Kalichman_Rent.pdf");



            MemoryStream memoryStream = new MemoryStream();
            memoryStream.Write(x, 0, x.Length);



            return File(memoryStream, "application/octet-stream"); // returns a FileStream
        }
    }
}
