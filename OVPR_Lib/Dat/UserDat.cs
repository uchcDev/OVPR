using OVPR_Lib.Utils;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Text;

namespace OVPR_Lib.Dat
{
    public class UserDat
    {
        public class UserEnt
        {
            public string USER_EmailAddress;
            public string USER_Password;

            public int USER_PK_ID;
            public string USER_LastName;
            public string USER_FirstName;
            public string USER_MI;
            public int ROLE_PK_ID;
            public string ROLE_Name;
            public bool USER_IsActive;
        }

      

        public static List<UserEnt> usp_01_User_GetUsers(string email, bool Active)
        {
            string procName = "OVPR.usp_01_User_GetUsers";

            var prms = new List<SqlParameter>();
            prms.Add(new SqlParameter("@Email", email));
            prms.Add(new SqlParameter("@Active", Active));

            return DataAccessHelpers.GetEnts<UserEnt>(procName, prms);
        }

        public static void usp_02_User_AddUsers(UserEnt userEnt, int insertByUserID)
        {
            string procName = "OVPR.usp_02_User_AddUsers";

            var prms = new List<SqlParameter>();
            prms.Add(new SqlParameter("@Email", userEnt.USER_EmailAddress));
            prms.Add(new SqlParameter("@LastName", userEnt.USER_LastName));
            prms.Add(new SqlParameter("@FirstName", userEnt.USER_FirstName));
            prms.Add(new SqlParameter("@MI", userEnt.USER_MI));
            prms.Add(new SqlParameter("@Role", userEnt.ROLE_PK_ID));
            prms.Add(new SqlParameter("@User_PK", insertByUserID));

            DataAccessHelpers.ExecuteGetDataTableStoredProc(procName, prms);
        }

        public static void usp_03_User_UpdateUsers(UserEnt userEnt, int updateByUserID)
        {
            string procName = "OVPR.usp_03_User_UpdateUsers";

            var prms = new List<SqlParameter>();
            prms.Add(new SqlParameter("@PK_ID", userEnt.USER_PK_ID));
            prms.Add(new SqlParameter("@Email", userEnt.USER_EmailAddress));
            prms.Add(new SqlParameter("@LastName", userEnt.USER_LastName));
            prms.Add(new SqlParameter("@FirstName", userEnt.USER_FirstName));
            prms.Add(new SqlParameter("@MI", userEnt.USER_MI));
            prms.Add(new SqlParameter("@Role", userEnt.ROLE_PK_ID));
            prms.Add(new SqlParameter("@Delete", !userEnt.USER_IsActive));
            prms.Add(new SqlParameter("@User_PK", updateByUserID));

            DataAccessHelpers.ExecuteGetDataTableStoredProc(procName, prms);
        }

        public class RolesEnt
        {
            public int ROLE_PK_ID;
            public string ROLE_Name;
        }
        public static List<RolesEnt> usp_04_User_GetRoles()
        {
            string procName = "OVPR.usp_04_User_GetRoles";

            var prms = new List<SqlParameter>();           

            return DataAccessHelpers.GetEnts<RolesEnt>(procName, prms);
        }

    }
}
