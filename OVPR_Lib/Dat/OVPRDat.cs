using Microsoft.AspNetCore.Http;
using OVPR_Lib.Utils;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Text;

namespace OVPR_Lib.Dat
{
    public class OVPRDat
    {
        public class usp_16a_GetProposalDetailByPropNo_Ent
        {
            public int PROP_PK_ID;
            public string InfoEdSurrogateKey;
            public string ProposalNumber;
            public string Title;
            public string PROP_Type;
            public string PROP_Status;
            public string ProcessDat;
            public string ProjectStartDate;
            public string ProjectEndDate;
            public string RequestedStartDate;
            public string RequestedEndDate;
            public string OriginalDeptCode;
            public string OriginalDeptName;
            public string OriginalSponsorCode;
            public string OriginalSponsorName;
            public string OriginalPiCode;
            public string OriginalPiName;
            public int CorrectedDeptPK;
            public string CorrectedDeptCode;
            public string CorrectedDeptName;
            public int CorrectedDeptSchoolPK;
            public string CorrectedDeptSchoolCode;
            public string CorrectDeptSchoolName;
            public string CorrectDeptCampusPK;
            public string CorrectedDeptCampusName;
            public int CorrectedSponsorPK;
            public string CorrectedSponsorCode;
            public string CorrectedSponsorName;
            public int CorrectedPiPK;
            public string CorrectedPiName;

        }
        public static usp_16a_GetProposalDetailByPropNo_Ent usp_16a_GetProposalDetailByPropNo(string proposalNum)
        {
            string procName = "OVPR.usp_16a_GetProposalDetailByPropNo";

            var prms = new List<SqlParameter>();
            prms.Add(new SqlParameter("@ProposalNumber", proposalNum));

            return DataAccessHelpers.GetEnts<usp_16a_GetProposalDetailByPropNo_Ent>(procName, prms)[0];
        }


       

        public class CommitmentChangeEnt
        {


            public int? CommitmentPK;

            public int? CampusPK;
            public int? CommitTypePK;
            public int? CommitSchoolPK;
            public int? CommitDeptPK;
            public int? CommitPiPK;
            public string InfoEdID;
            public DateTime CommitDate;
            public string FiscalYear;
            public int? NoOfYears;
            public double? TotalCommitment;
            public int? CommitStatusPK;

            public string Comment;
            public string CommitmentDesc;

            public int? CorrectedPropSchoolPK;
            public int? CorrectedPropOrgnPK;
            public int? CorrectedPropPiPK;
            public int? CorrectedPropSponsorPK;


         
        }

        public static int usp_25_Commitment_CreateCommitmentRequest(string LoginEmail, CommitmentChangeEnt commitment, out string sql)
        {
            string procName = "OVPR.usp_25_Commitment_CreateCommitmentRequest";

            var prms = new List<SqlParameter>();
            prms.Add(new SqlParameter("@LoginEmail", LoginEmail));
            prms.Add(new SqlParameter("@CampusPK", commitment.CampusPK));
            prms.Add(new SqlParameter("@CommitTypePK", commitment.CommitTypePK));
            prms.Add(new SqlParameter("@CommitSchoolPK", commitment.CommitSchoolPK));
            prms.Add(new SqlParameter("@CommitDeptPK", commitment.CommitDeptPK));
            prms.Add(new SqlParameter("@CommitPiPK", commitment.CommitPiPK));
            prms.Add(new SqlParameter("@InfoEdID", commitment.InfoEdID));
            prms.Add(new SqlParameter("@CommitDate", commitment.CommitDate));
            prms.Add(new SqlParameter("@FiscalYear", commitment.FiscalYear));
            prms.Add(new SqlParameter("@NoOfYears", commitment.NoOfYears));
            prms.Add(new SqlParameter("@TotalCommitment", commitment.TotalCommitment));
            prms.Add(new SqlParameter("@CommitStatusPK", commitment.CommitStatusPK));

            prms.Add(new SqlParameter("@Comment", commitment.Comment));
            prms.Add(new SqlParameter("@CommitmentDesc", commitment.CommitmentDesc));
            prms.Add(new SqlParameter("@CorrectedPropSchoolPK", commitment.CorrectedPropSchoolPK));
            prms.Add(new SqlParameter("@CorrectedPropOrgnPK", commitment.CorrectedPropOrgnPK));
            prms.Add(new SqlParameter("@CorrectedPropPiPK", commitment.CorrectedPropPiPK));
            prms.Add(new SqlParameter("@CorrectedPropSponsorPK", commitment.CorrectedPropSponsorPK));

            sql = Utility.ExecCall(procName, prms);

            return DataAccessHelpers.ExecuteGetInt(procName, prms);
        }

        public static void usp_26_Commitment_UpdateBaseCommitmentRequest(string LoginEmail, CommitmentChangeEnt commitment, out string sql)
        {
            //string procName = "OVPR.usp_26a_Commitment_UpdateBaseCommitmentRequest";
            string procName = "OVPR.usp_26a_Commitment_UpdateCommitmentRequestType";

            var prms = new List<SqlParameter>();
            prms.Add(new SqlParameter("@LoginEmail", LoginEmail));

            prms.Add(new SqlParameter("@CommitmentPK", commitment.CommitmentPK));
            prms.Add(new SqlParameter("@CampusPK", commitment.CampusPK));
            prms.Add(new SqlParameter("@CommitmentTypePK", commitment.CommitTypePK));
            prms.Add(new SqlParameter("@CommitSchoolPK", commitment.CommitSchoolPK));
            prms.Add(new SqlParameter("@CommitDeptPK", commitment.CommitDeptPK));
            prms.Add(new SqlParameter("@PI_PK", commitment.CommitPiPK));
            prms.Add(new SqlParameter("@PropNumber", commitment.InfoEdID));
            prms.Add(new SqlParameter("@CommitDate", commitment.CommitDate));
            prms.Add(new SqlParameter("@FiscalYear", commitment.FiscalYear));
            prms.Add(new SqlParameter("@NoOfYears", commitment.NoOfYears));
            prms.Add(new SqlParameter("@TotalCommitment", commitment.TotalCommitment));
            prms.Add(new SqlParameter("@CommitStatusPK", commitment.CommitStatusPK));

            prms.Add(new SqlParameter("@Comment", commitment.Comment));
            prms.Add(new SqlParameter("@CommitmentDesc", commitment.CommitmentDesc));

            //prms.Add(new SqlParameter("@CorrectedPropSchoolPK", commitment.CorrectedPropSchoolPK));
            prms.Add(new SqlParameter("@PropCorrectedOrg_PK", commitment.CorrectedPropOrgnPK));
            prms.Add(new SqlParameter("@PropCorrectedPi_PK", commitment.CorrectedPropPiPK));
            prms.Add(new SqlParameter("@PropCorrectedSponsor_PK", commitment.CorrectedPropSponsorPK));          

            sql = Utility.ExecCall(procName, prms);

            DataAccessHelpers.ExecuteGetDataTableStoredProc(procName, prms);
        }


        public class CommitmentEnt
        {
            public int? Commitment_PK;

            public int? Campus_PK;
            public string Campus;

            public int? COMMITTYPE_PK;
            public string CommitmentType;

            public int? School_PK;
            public string School;

            public int? Dept_PK;
            public string Dept;

            public int? PI_PK;
            public string PI;

            public string Project; //infoed num/
            public string InfoEdStatus;

            public DateTime CommitDate;
            public string StartingFY;
            public int? NumberOfYears;
            public double TotalCommitment;
            public string CommitmentStatus;

            public string ProjectTitle;
            public string Comment;
            public string CommitmentDesc;

            public int? CorrectedDept_PK;
            public int? CorrectedPI_PK;
            public int? CorrectedSponsor_PK;

            public int? COMMITTYPE_PARENT_PK;
            public string CommitmentParent;
            public string FullCommitmentType;

            public DateTime CommitmentDate;


        }

        public static List<CommitmentEnt> usp_27_GetCommitmentDetailByCommitPK(int Commitment_PK)
        {
            string procName = "OVPR.usp_27_GetCommitmentDetailByCommitPK";

            var prms = new List<SqlParameter>();
            prms.Add(new SqlParameter("@Commitment_PK", Commitment_PK));

            return DataAccessHelpers.GetEnts<CommitmentEnt>(procName, prms);
        }
        public static string usp_27b_GetCommitmentStatusByCommitPK(int Commitment_PK)
        {
            string procName = "OVPR.usp_27b_GetCommitmentStatusByCommitPK";

            var prms = new List<SqlParameter>();
            prms.Add(new SqlParameter("@Commitment_PK", Commitment_PK));

            return DataAccessHelpers.ExecuteGetString(procName, prms);
        }

        public class CommitmentsSearchResultEnt
        {
            public int Commitment_PK { get; set; }
            public string CommitmentDesc { get; set; }
            public string PI { get; set; }
            public string Campus { get; set; }
            public string School { get; set; }
            public string Dept { get; set; }
            public string Project { get; set; }
            public string CommitmentType { get; set; }
            public string CommitmentStatus { get; set; }
            public string InfoEdStatus { get; set; }
            public string ProjectTitle { get; set; }
            public DateTime CommitDate { get; set; }
            public int StartingFY { get; set; }
            public int NumberOfYears { get; set; }
            public double TotalCommitment { get; set; }
            public double Paid { get; set; }
            public double NotFunded { get; set; }
            public double OutstandingBalance { get; set; }




        }

        public class CommitmentsSearchArg
        {
            public string sortBy_Property;
            public bool sortBy_IsAsc;
            public int pageIndex;
            public int pageSize;

            public int? CommitmentID;
            public int? CampusID;
            public int? CommTypeID;
            public int? CommStatusID;

            public int? PiID;
            public int? SchoolID;
            public string Description;
            public double? TotalCommitment;
            public string ProjectTitle;
            public string TransactionNumber;
            public string Comment;


        }

        public static List<CommitmentsSearchResultEnt> usp_13_Commitment_GetCommitmentData(CommitmentsSearchArg arg)
        {
            string procName = "OVPR.usp_13_Commitment_GetCommitmentData";

            var prms = new List<SqlParameter>();
            prms.Add(new SqlParameter("@prm_CommitmentID", arg.CommitmentID));
                                     
            prms.Add(new SqlParameter("@prm_CampusID", arg.CampusID));
            prms.Add(new SqlParameter("@prm_CommTypeID", arg.CommTypeID));
            prms.Add(new SqlParameter("@prm_CommStatusID", arg.CommStatusID));

            prms.Add(new SqlParameter("@prm_PiID", arg.PiID));
            prms.Add(new SqlParameter("@prm_SchoolID", arg.SchoolID));
            prms.Add(new SqlParameter("@prm_Description", arg.Description));
            prms.Add(new SqlParameter("@prm_TotalCommitment", arg.TotalCommitment));
            prms.Add(new SqlParameter("@prm_ProjectTitle", arg.ProjectTitle));
            prms.Add(new SqlParameter("@prm_TransactionNumber", arg.TransactionNumber));
            prms.Add(new SqlParameter("@prm_Comment", arg.Comment));


            return DataAccessHelpers.GetEnts<CommitmentsSearchResultEnt>(procName, prms);
        }


        public static void usp_23_Document_InsertDocFile(int Commit_PK, string FileName, int FileSize, string FileType, byte[] bytes, string UpLoadedBy)
        {
            string procName = "OVPR.usp_23_Document_InsertDocFile";

            var prms = new List<SqlParameter>();
            prms.Add(new SqlParameter("@prm_Commit_PK", Commit_PK));
            prms.Add(new SqlParameter("@prm_FileName", FileName));
            prms.Add(new SqlParameter("@prm_FileSize", FileSize));
            prms.Add(new SqlParameter("@prm_FileType", FileType));
            prms.Add(new SqlParameter("@prm_Document", bytes));
            prms.Add(new SqlParameter("@prm_UpLoadedBy", UpLoadedBy));

            DataAccessHelpers.ExecuteGetDataTableStoredProc(procName, prms);
        }


        public class DocumentEnt
        {
            public int COMMIT_PK;
            public string CommitmentDesc;
            public int Document_PK;
            public string DocumentFileName;       

        }


        public static List<DocumentEnt> usp_21_Document_GetDocFileNamesByCommitment_PK(int Commit_PK)
        {
            string procName = "OVPR.usp_21_Document_GetDocFileNamesByCommitment_PK";

            var prms = new List<SqlParameter>();
            prms.Add(new SqlParameter("@prm_COMMIT_PK", Commit_PK));
       

            return DataAccessHelpers.GetEnts<DocumentEnt>(procName, prms);
        }


        public static void usp_24a_Document_DelSpecificDocument(int Document_PK)
        {
            string procName = "OVPR.usp_24a_Document_DelSpecificDocument";

            var prms = new List<SqlParameter>();
            prms.Add(new SqlParameter("@prm_Document_PK", Document_PK));


            DataAccessHelpers.ExecuteGetDataTableStoredProc(procName, prms);
        }

        public static byte[]  usp_22_Document_GetDocFileByCommitmentPkFileName(int Commit_PK, string FileName)
        {
            string procName = "OVPR.usp_22_Document_GetDocFileByCommitmentPkFileName";

            var prms = new List<SqlParameter>();
            prms.Add(new SqlParameter("@prm_Commit_PK", Commit_PK));
            prms.Add(new SqlParameter("@prm_FileName", FileName));

            var dt = DataAccessHelpers.ExecuteGetDataTableStoredProc(procName, prms);
            return (byte[])dt.Rows[0]["BinaryDocument"];
        }

        public static byte[] usp_22a_Document_GetDocFileByDocPK(int DOC_PK_ID)
        {
            string procName = "OVPR.usp_22a_Document_GetDocFileByDocPK";

            var prms = new List<SqlParameter>();
            prms.Add(new SqlParameter("@prm_DOC_PK_ID", DOC_PK_ID));           

            var dt = DataAccessHelpers.ExecuteGetDataTableStoredProc(procName, prms);
            return (byte[])dt.Rows[0]["BinaryDocument"];
        }

        public class demo_GetAllCommitmentsEnt
        {
            public string Commitment_PK;
            public string CommitmentDesc;
            public string PI;
            public string Campus;
            public string School;
            public string Dept;
            public string Project;
            public string CommitmentType;
            public string CommitmentStatus;
            public string CommitDate;
            public string InfoEdStatus;
            public string ProjectTitle;
            public string CommitmentDate;
            public string StartingFY;
            public string NumberOfYears;
            public string TotalCommitment;
            public string Paid;
            public string NotFunded;
            public string OutstandingBalance;        
           

        }


        public static List<demo_GetAllCommitmentsEnt> _demo_GetAllCommitments()
        {
            string procName = "OVPR._demo_GetAllCommitments";

            var prms = new List<SqlParameter>();
           // prms.Add(new SqlParameter("@Commitment_PK", Commitment_PK));

            return DataAccessHelpers.GetEnts<demo_GetAllCommitmentsEnt>(procName, prms);
        }
    }
} 