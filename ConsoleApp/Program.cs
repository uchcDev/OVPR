using OVPR_Lib.Dat;
using System;
using System.IO;

namespace ConsoleApp
{
    class Program
    {
        static void Main(string[] args)
        {
            var bytes = OVPRDat.usp_22_Document_GetDocFileByCommitmentPkFileName(32, "Kalichman_Rent.pdf");

            //MemoryStream memoryStream = new MemoryStream();
           // /memoryStream.Write(bytes, 0, bytes.Length);

            // FileStream fileStream = new FileStream("test.txt", FileMode.Open, FileAccess.Read);
            //memoryStream.CopyTo(fileStream);


            FileStream fs = new FileStream(@"C:\Kalichman_Rent.pdf", FileMode.Create);
            fs.Write(bytes, 0, bytes.Length);
            fs.Close();

           


        }
    }
}
