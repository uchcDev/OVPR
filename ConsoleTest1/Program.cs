using OVPR_Lib;
using System;
using static OVPR_Lib.Dat.OVPRDat;

namespace ConsoleTest1
{
    class Program
    {
        static void Main(string[] args)
        {
            OVPR_System.ConnectionString = "Data Source=AMSDBFIX.cam.uchc.edu;Connection Timeout=300;Initial Catalog=OVPRCommitment;User ID=ResearchApp;Password=Aw@rdMgmtApp!";


            CommitmentsSearchArg arg = new CommitmentsSearchArg();
            arg.pageIndex = 0;
            arg.pageSize = 30;
            arg.sortBy_Property = "Commitment_PK";
            arg.sortBy_IsAsc = true;

            var r = OVPR_Lib.Bus.OVPRBus.Search(arg);

        }
    }
}
