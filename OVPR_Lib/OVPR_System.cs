
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.IO;
using System.Text;

namespace OVPR_Lib
{

   
    public class OVPR_System
    {
        private static string connectionString;
        

        public static string ConnectionString
        {
            get
            {
                if (connectionString == null)
                {
                    throw new Exception("ConnectionString is null");
                }
                else
                    return connectionString;
            }

            set
            {
                connectionString = value;
            }
        }

        public static int AuthenticationTimeout_Minutes;



        //public static string ConnectionString = "Data Source=AMSDBFIX.cam.uchc.edu;Initial Catalog=OVPRCommitment; Trusted_Connection=True";

    }
}
