using OVPR_Lib.Utils;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Text;

namespace OVPR_Lib
{
    public class DropDownDat
    {
        public class usp_05_Campus_GetCampus_Ent
        {
            public int CAMPUS_PK_ID;
            public string CAMPUS_Name;

        }
        public static List<usp_05_Campus_GetCampus_Ent> usp_05_Campus_GetCampus()
        {
            string procName = "OVPR.usp_05_Campus_GetCampus";

            var prms = new List<SqlParameter>();
            //prms.Add(new SqlParameter("@TASK_PK_ID", TaskGrpPKID));

            return DataAccessHelpers.GetEnts<usp_05_Campus_GetCampus_Ent>(procName, prms);
        }

        public class usp_05a_School_GetSchoolByCampusEnt
        {
            public string CAMPUS_PK_ID;
            public string CAMPUS_Name;
            public int SCHOOL_PK_ID;
            public string SCHOOL_Code;
            public string SCHOOL_Name;

        }
        public static List<usp_05a_School_GetSchoolByCampusEnt> usp_05a_School_GetSchoolByCampus(int? CampusPK)
        {
            string procName = "OVPR.usp_05a_School_GetSchoolByCampus";

            var prms = new List<SqlParameter>();
            prms.Add(new SqlParameter("@CampusPK", CampusPK));

            return DataAccessHelpers.GetEnts<usp_05a_School_GetSchoolByCampusEnt>(procName, prms);
        }

        public class usp_06_CommittmentStatus_GetStatusEnt
        {
            public string COMMITSTATUS_PK_ID;
            public string COMMITSTATUS_Description;          

        }
        public static List<usp_06_CommittmentStatus_GetStatusEnt> usp_06_CommittmentStatus_GetStatus()
        {
            string procName = "OVPR.usp_06_CommittmentStatus_GetStatus";

            var prms = new List<SqlParameter>();

            return DataAccessHelpers.GetEnts<usp_06_CommittmentStatus_GetStatusEnt>(procName, prms);
        }


        public class usp_07_CommittmentType_GetTypesEnt
        {
            public int COMMITTYPE_PK_ID;
            public string COMMITTYPE_FK_COMMITTYPE_Parent;
            public string COMMITTYPE_Description; 
            public string Level1_Desc;
        }
        public static List<usp_07_CommittmentType_GetTypesEnt> usp_07_CommittmentType_GetTypes()
        {
            string procName = "OVPR.usp_07_CommittmentType_GetTypes";

            var prms = new List<SqlParameter>();

            return DataAccessHelpers.GetEnts<usp_07_CommittmentType_GetTypesEnt>(procName, prms);
        }

        public class usp_08_PaymentStatus_GetStatusesEnt
        {
            public string PAYMENTSTATUS_PK_ID;
            public string PAYMENTSTATUS_Description;         
        }
        public static List<usp_08_PaymentStatus_GetStatusesEnt> usp_08_PaymentStatus_GetStatuses()
        {
            string procName = "OVPR.usp_08_PaymentStatus_GetStatuses";

            var prms = new List<SqlParameter>();

            return DataAccessHelpers.GetEnts<usp_08_PaymentStatus_GetStatusesEnt>(procName, prms);
        }


        public class usp_10_Department_GetDeptsByCampusSchoolEnt
        {
            public string CAMPUS_PK_ID;
            public string CAMPUS_Name;
            public string SCHOOL_PK_ID;
            public string SCHOOL_Code;
            public string SCHOOL_Name;
            public int DEPT_PK_ID;
            public string DEPT_Code;
            public string DEPT_Name;          
        }
        public static List<usp_10_Department_GetDeptsByCampusSchoolEnt> usp_10_Department_GetDeptsByCampusSchool(int CampusPK, int SchoolPK, int? ensureExists_DeptPK)
        {
            string procName = "OVPR.usp_10_Department_GetDeptsByCampusSchool";

            var prms = new List<SqlParameter>();
            prms.Add(new SqlParameter("@CampusPK", CampusPK));
            prms.Add(new SqlParameter("@SchoolPK", SchoolPK));
            prms.Add(new SqlParameter("@EnsureExists_DeptPK", ensureExists_DeptPK));

            

            return DataAccessHelpers.GetEnts<usp_10_Department_GetDeptsByCampusSchoolEnt>(procName, prms);
        }

        public class usp_11_Sponsor_GetSponsorsByCampusEnt
        {
            public string CAMPUS_PK_ID;
            public string CAMPUS_Name;
            public int SPONSOR_PK_ID;
            public string SPONSOR_Code;
            public string SPONSOR_CrossCampusSponsorID;
            public string SPONSOR_Name;         
        }
        public static List<usp_11_Sponsor_GetSponsorsByCampusEnt> usp_11_Sponsor_GetSponsorsByCampus(int CampusPK, string SponsorNameSearch, int? EnsureExists_SponsorPK)
        {
            string procName = "OVPR.usp_11_Sponsor_GetSponsorsByCampus";

            var prms = new List<SqlParameter>();
            prms.Add(new SqlParameter("@CampusPK", CampusPK));
            prms.Add(new SqlParameter("@SponsorNameSearch", SponsorNameSearch));
            prms.Add(new SqlParameter("@EnsureExists_SponsorPK", EnsureExists_SponsorPK));

            return DataAccessHelpers.GetEnts<usp_11_Sponsor_GetSponsorsByCampusEnt>(procName, prms);
        }

        public class usp_16_GetProposalsByCampusEnt
        {
            public string CAMPUS_PK_ID;
            public string CAMPUS_Name;
            public int PROP_PK_ID;
            public string PROPPROP_InfoEdSurrogateKey;
            public string PROPPROP_ProposalNumber;           
        }
        public static List<usp_16_GetProposalsByCampusEnt> usp_16_GetProposalsByCampus(int CampusPK, int? SchoolPK, int? DeptPK, string ProposalNumberSearch, string EnsureExists_ProposalNumber)
        {
            string procName = "OVPR.usp_16_GetProposalsByCampus";

            var prms = new List<SqlParameter>();
            prms.Add(new SqlParameter("@CampusPK", CampusPK));
            prms.Add(new SqlParameter("@SchoolPK", SchoolPK));
            prms.Add(new SqlParameter("@DeptPK", DeptPK));
            prms.Add(new SqlParameter("@ProposalNumberSearch", ProposalNumberSearch));
            prms.Add(new SqlParameter("@EnsureExists_ProposalNumber", EnsureExists_ProposalNumber));

            return DataAccessHelpers.GetEnts<usp_16_GetProposalsByCampusEnt>(procName, prms);
        }

        public class usp_17_GetPIsByCampusEnt
        {
            public string CAMPUS_PK_ID;
            public string CAMPUS_Name;
            public int SCHOOL_PK_ID;
            public string SCHOOL_Code;
            public string SCHOOL_Name;
            public int DEPT_PK_ID;
            public string DEPT_Code;        
            public string DEPT_Name;

            public int PI_PK_ID;
            public string PI_Code;
            public string PI_LastName;
            public string PI_Firstname;
            public string PI_MI;

            //not returned by proc
            public string PI_DisplayName;
        }
        public static List<usp_17_GetPIsByCampusEnt> usp_17_GetPIsByCampus(int? CampusPK, int? SchoolPK, int? DeptPK, string PILastNameSearch, int? EnsureExists_PIPK)
        {
            string procName = "OVPR.usp_17_GetPIsByCampus";

            var prms = new List<SqlParameter>();
            prms.Add(new SqlParameter("@CampusPK", CampusPK));
            prms.Add(new SqlParameter("@SchoolPK", SchoolPK));
            prms.Add(new SqlParameter("@DeptPK", DeptPK));
            prms.Add(new SqlParameter("@PILastNameSearch", PILastNameSearch));
            prms.Add(new SqlParameter("@EnsureExists_PIPK", EnsureExists_PIPK));

            return DataAccessHelpers.GetEnts<usp_17_GetPIsByCampusEnt>(procName, prms);
        }      

       

    }
}
