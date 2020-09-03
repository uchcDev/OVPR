using OVPR_Lib.Utils;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Text;

namespace OVPR_Lib.Dat
{
    public class TypeDat
    {

        public class TypeEnt
        {
            public int COMMITTYPE_PK_ID;
            public string COMMITTYPE_Description;
                         

        }


        public static List<TypeEnt> usp_31_CommitType_GetLevel1()
        {
            string procName = "OVPR.usp_31_CommitType_GetLevel1";

            var prms = new List<SqlParameter>();          

            return DataAccessHelpers.GetEnts<TypeEnt>(procName, prms);
        }

        public static List<TypeEnt> usp_32_CommitType_GetLevel2(int Level1_PK)
        {
            string procName = "OVPR.usp_32_CommitType_GetLevel2";

            var prms = new List<SqlParameter>();
            prms.Add(new SqlParameter("@Level1_PK", Level1_PK));

            return DataAccessHelpers.GetEnts<TypeEnt>(procName, prms);
        }

        public class TypeLevel2Ent
        {
            public int Level1_PK;

            public int CommitType_PK;
            public string Description;
            public bool DeleteFlag;            

        }
        public static void usp_33_CommitType_UpdateLevel2(TypeLevel2Ent ent, string userName)
        {
            string procName = "OVPR.usp_33_CommitType_UpdateLevel2";

            var prms = new List<SqlParameter>();
            prms.Add(new SqlParameter("@CommitType_PK", ent.CommitType_PK));
            prms.Add(new SqlParameter("@Description", ent.Description));
            prms.Add(new SqlParameter("@DeleteFlag", ent.DeleteFlag));
            prms.Add(new SqlParameter("@User_Name", userName));

            DataAccessHelpers.ExecuteGetDataTableStoredProc(procName, prms);
        }

        public static void usp_34_CommitType_AddLevel2(TypeLevel2Ent ent, string userName)
        {
            string procName = "OVPR.usp_34_CommitType_AddLevel2";

            var prms = new List<SqlParameter>();
            prms.Add(new SqlParameter("@Level1_PK", ent.Level1_PK));
            prms.Add(new SqlParameter("@Level2Description", ent.Description));         
            prms.Add(new SqlParameter("@User_Name", userName));

            DataAccessHelpers.ExecuteGetDataTableStoredProc(procName, prms);
        }
    }
}
