using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OVPR_Lib;
using static OVPR_Lib.DropDownBus;
using static OVPR_Lib.DropDownDat;

namespace OVPR.Controllers
{
    [Authorize]
    [Route("OVPR_API/[controller]")]
    public class DropDownController : OVPRBaseController
    {
     
        [HttpGet("[action]")]       
        public async Task<Result<List<usp_05_Campus_GetCampus_Ent>>> GetCampus()
        {
            Result<List<usp_05_Campus_GetCampus_Ent>> r = null;
            await Task.Run(() =>
            {

                r = ResultRunner<List<usp_05_Campus_GetCampus_Ent>>.Run(delegate () { return DropDownBus.usp_05_Campus_GetCampus(); });
            });
            return r;
        }

        [HttpGet("[action]/{CampusPK}")]       
        public async Task<Result<List<usp_05a_School_GetSchoolByCampusEnt>>> GetSchoolByCampus(int? CampusPK)
        {
            Result<List<usp_05a_School_GetSchoolByCampusEnt>> r = null;
            await Task.Run(() =>
            {

                r = ResultRunner<List<usp_05a_School_GetSchoolByCampusEnt>>.Run(delegate () { return DropDownBus.usp_05a_School_GetSchoolByCampus(CampusPK); });
            });
            return r;
        }


        [HttpGet("[action]")]        
        public async Task<Result<List<usp_06_CommittmentStatus_GetStatusEnt>>> GetCommittmentStatus()
        {
            Result< List < usp_06_CommittmentStatus_GetStatusEnt >> r = null;
            await Task.Run(() =>
            {

                r = ResultRunner<List<usp_06_CommittmentStatus_GetStatusEnt>>.Run(delegate () { return DropDownBus.usp_06_CommittmentStatus_GetStatus(); });
            });
            return r;
        }

        [HttpGet("[action]")]       
        public async Task<Result<List<usp_07_CommittmentType_GetTypesEnt>>> GetTypes()
        {          
            Result<List<usp_07_CommittmentType_GetTypesEnt>> r = null;
            await Task.Run(() =>
            {

                r = ResultRunner<List<usp_07_CommittmentType_GetTypesEnt>>.Run(delegate () { return DropDownBus.usp_07_CommittmentType_GetTypes(); });
            });
            return r;
        }

        [HttpGet("[action]")]       
        public async Task<Result<List<usp_08_PaymentStatus_GetStatusesEnt>>> GetStatuses()
        {            
            Result<List<usp_08_PaymentStatus_GetStatusesEnt>> r = null;
            await Task.Run(() =>
            {

                r = ResultRunner<List<usp_08_PaymentStatus_GetStatusesEnt>>.Run(delegate () { return DropDownBus.usp_08_PaymentStatus_GetStatuses(); });
            });
            return r;
        }

        [HttpGet("[action]/{CampusPK}/{SchoolPK}/{ensureExists_DeptPK}")]       
        public async Task<Result<List<usp_10_Department_GetDeptsByCampusSchoolEnt>>> GetDeptsByCampusSchool(int CampusPK, int SchoolPK, int? ensureExists_DeptPK)
        {
            Result<List<usp_10_Department_GetDeptsByCampusSchoolEnt>> r = null;
            await Task.Run(() =>
            {

                r = ResultRunner<List<usp_10_Department_GetDeptsByCampusSchoolEnt>>.Run(delegate () { return DropDownBus.usp_10_Department_GetDeptsByCampusSchool(CampusPK, SchoolPK, ensureExists_DeptPK); });
            });
            return r;
        }
        

        [HttpGet("[action]/{CampusPK}/{SponsorNameSearch}/{EnsureExists_SponsorPK}")]       
        public async Task<Result< GetSponsorsEnt>> GetSponsorsByCampus(int CampusPK, string name, string SponsorNameSearch, int? EnsureExists_SponsorPK)
        {
            Result<GetSponsorsEnt> r = null;
            await Task.Run(() =>
            {

                r = ResultRunner<GetSponsorsEnt>.Run(delegate () { return DropDownBus.usp_11_Sponsor_GetSponsorsByCampus(CampusPK, SponsorNameSearch, EnsureExists_SponsorPK); });
            });
            return r;
        }

        [HttpGet("[action]/{CampusPK}/{SchoolPK}/{DeptPK}/{proposalNumberSearch}/{ensureExists_ProposalNumber}")]     
        public async Task<Result<GetProposalsEnt>> GetProposals(int CampusPK, int? SchoolPK, int? DeptPK, string ProposalNumberSearch, string EnsureExists_ProposalNumber)
        {
            Result<GetProposalsEnt> r = null;
            await Task.Run(() =>
            {

                r = ResultRunner<GetProposalsEnt>.Run(delegate () { return DropDownBus.GetProposals(CampusPK, SchoolPK, DeptPK, ProposalNumberSearch, EnsureExists_ProposalNumber); });
            });
            return r;
        }


        [HttpGet("[action]/{CampusPK}/{SchoolPK}/{DeptPK}/{PILastNameSearch}/{EnsureExists_PIPK}")]     
        public async Task<Result<GetPIsEnt>>  GetPIsByLastName(int? CampusPK, int? SchoolPK, int? DeptPK, string PILastNameSearch, int? EnsureExists_PIPK)
        {
            Result<GetPIsEnt> r = null;
            await Task.Run(() =>
            {

                r = ResultRunner<GetPIsEnt>.Run(delegate () { return DropDownBus.usp_17_GetPIsByCampus(CampusPK, SchoolPK, DeptPK, PILastNameSearch, EnsureExists_PIPK); });
            });
            return r;           
        }
    }
}