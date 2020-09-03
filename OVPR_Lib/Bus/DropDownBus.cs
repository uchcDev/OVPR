using OVPR_Lib.Bus;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using static OVPR_Lib.DropDownDat;

namespace OVPR_Lib
{
    public class DropDownBus
    {
       
        public static List<usp_05_Campus_GetCampus_Ent> usp_05_Campus_GetCampus()
        {      
            return DropDownDat.usp_05_Campus_GetCampus();
        }

       
        public static List<usp_05a_School_GetSchoolByCampusEnt> usp_05a_School_GetSchoolByCampus(int? CampusPK)
        {
            return DropDownDat.usp_05a_School_GetSchoolByCampus(CampusPK);
        }

       
        public static List<usp_06_CommittmentStatus_GetStatusEnt> usp_06_CommittmentStatus_GetStatus()
        {
            return DropDownDat.usp_06_CommittmentStatus_GetStatus();
        }


       
        public static List<usp_07_CommittmentType_GetTypesEnt> usp_07_CommittmentType_GetTypes()
        {
            return DropDownDat.usp_07_CommittmentType_GetTypes();
        }

       
        public static List<usp_08_PaymentStatus_GetStatusesEnt> usp_08_PaymentStatus_GetStatuses()
        {
            return DropDownDat.usp_08_PaymentStatus_GetStatuses();
        }


       
        public static List<usp_10_Department_GetDeptsByCampusSchoolEnt> usp_10_Department_GetDeptsByCampusSchool(int CampusPK, int SchoolPK, int? ensureExists_DeptPK)
        {
            return DropDownDat.usp_10_Department_GetDeptsByCampusSchool(CampusPK, SchoolPK, ensureExists_DeptPK);
        }

        public class GetSponsorsEnt
        {
            public bool WasDataTruncated = false;
            public List<usp_11_Sponsor_GetSponsorsByCampusEnt> Data;
        }
        public static GetSponsorsEnt usp_11_Sponsor_GetSponsorsByCampus(int CampusPK, string SponsorNameSearch, int? EnsureExists_SponsorPK)
        {

            if (SponsorNameSearch == "*")
                SponsorNameSearch = null;

            var data= DropDownDat.usp_11_Sponsor_GetSponsorsByCampus(CampusPK, SponsorNameSearch, EnsureExists_SponsorPK);
            var ensureExists = data.Where(p => EnsureExists_SponsorPK.HasValue && p.SPONSOR_PK_ID == EnsureExists_SponsorPK.Value).FirstOrDefault();           

            var toReturn = new GetSponsorsEnt();
            toReturn.WasDataTruncated = data.Count > 500;

            if (data.Count > 500)
            {
                toReturn.Data = data.GetRange(0, 500);
                if (ensureExists != null && toReturn.Data.Where(p => p.SPONSOR_PK_ID == ensureExists.SPONSOR_PK_ID).Count() == 0)
                {
                    toReturn.Data.Insert(0, ensureExists);
                }
            }
            else
                toReturn.Data = data.GetRange(0, data.Count);

            if(ensureExists != null && toReturn.Data.Where(p=> p.SPONSOR_PK_ID == ensureExists.SPONSOR_PK_ID).Count() == 0)
            {
                toReturn.Data.Insert(0,ensureExists);
            }

            return toReturn;

        }



        public class GetProposalsEnt
        {
            public bool WasDataTruncated = false;
            public List<usp_16_GetProposalsByCampusEnt> Data;
        }
        public static GetProposalsEnt GetProposals(int CampusPK, int? SchoolPK, int? DeptPK, string ProposalNumberSearch, string EnsureExists_ProposalNumber)
        {

            if (ProposalNumberSearch == "*")
                ProposalNumberSearch = null;


            if (EnsureExists_ProposalNumber == "*")
                EnsureExists_ProposalNumber = null;


            var data = DropDownDat.usp_16_GetProposalsByCampus(CampusPK, SchoolPK, DeptPK, ProposalNumberSearch, EnsureExists_ProposalNumber);
            var ensureExists = data.Where(p => p.PROPPROP_ProposalNumber == EnsureExists_ProposalNumber).FirstOrDefault();                      

            var toReturn = new GetProposalsEnt();
            toReturn.WasDataTruncated = data.Count > 500;

            if (data.Count > 500)
            {
                toReturn.Data = data.GetRange(0, 500);

                if (ensureExists != null && toReturn.Data.Where(p=> p.PROPPROP_ProposalNumber == ensureExists.PROPPROP_ProposalNumber).Count() == 0)
                {
                    toReturn.Data.Insert(0, ensureExists);
                }

            }
            else
                toReturn.Data = data.GetRange(0, data.Count);

            return toReturn;
        }



        public class GetPIsEnt
        {
            public bool WasDataTruncated = false;
            public List<usp_17_GetPIsByCampusEnt> Data;
        }
        public static GetPIsEnt usp_17_GetPIsByCampus(int? CampusPK, int? SchoolPK, int? DeptPK, string PILastNameSearch, int? EnsureExists_PIPK)
        {

            if (PILastNameSearch == "*")
                PILastNameSearch = null;


            var data = DropDownDat.usp_17_GetPIsByCampus(CampusPK, SchoolPK, DeptPK, PILastNameSearch, EnsureExists_PIPK);
            var ensureExists = data.Where(p => EnsureExists_PIPK.HasValue && p.PI_PK_ID == EnsureExists_PIPK).FirstOrDefault();          

            data.ForEach(p => p.PI_DisplayName = p.PI_LastName + ", " + p.PI_Firstname + " " + p.PI_MI);

            var toReturn = new GetPIsEnt();
            toReturn.WasDataTruncated = data.Count > 500;

            if (data.Count > 500)
            {
                toReturn.Data = data.GetRange(0, 500);
                if (ensureExists != null && toReturn.Data.Where(p => p.PI_PK_ID == ensureExists.PI_PK_ID).Count() == 0)
                {
                    toReturn.Data.Insert(0, ensureExists);
                }
            }
            else
                toReturn.Data = data.GetRange(0, data.Count);

            return toReturn;


        }
    }
}

