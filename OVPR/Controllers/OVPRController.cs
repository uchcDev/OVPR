using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using OVPR_Lib.Bus;
using OVPR_Lib.Dat;
using static OVPR_Lib.Bus.OVPRBus;
using static OVPR_Lib.Dat.OVPRDat;

namespace OVPR.Controllers
{
    [Authorize]
    [Route("OVPR_API/[controller]")]
    public class OVPRController : OVPRBaseController
    {
        //private readonly IOptions<Settings> appSettings;
        //public OVPRController(IOptions<Settings> app)
        //{
        //    appSettings = app;
        //}

        [HttpGet("[action]/{proposalNum}")]
        public async Task<Result<usp_16a_GetProposalDetailByPropNo_Ent>> GetProposalDetailByPropNo(string proposalNum)
        {


          


            Result<usp_16a_GetProposalDetailByPropNo_Ent> r = null;
            await Task.Run(() =>
            {

                r = ResultRunner<usp_16a_GetProposalDetailByPropNo_Ent>.Run(delegate () { return OVPRBus.GetProposalDetailByPropNo(proposalNum); });
            });
            return r;
        }

        

        public class UpdateCommitmentArg
        {
            public CommitmentChangeEnt CommitmentChangeEnt;
            public List<FileToUpload> Files;
        }

        [HttpPost("[action]")]
        public async Task<Result<int>> CreateCommitment([FromBody]UpdateCommitmentArg updateCommitmenArg)
        {

            Result<int> r = null;
            await Task.Run(() =>
            {
                string sql = null;
                r = ResultRunner<int>.Run(delegate () { return OVPRBus.CreateCommitment(LoggededInUserEmail, updateCommitmenArg.CommitmentChangeEnt, updateCommitmenArg.Files, out sql); });
                r.SQL = sql;
            });
            return r;

        }

        [HttpPost("[action]")]
        public async Task<Result<int>> UpdateCommitment([FromBody]UpdateCommitmentArg updateCommitmenArg)
        {
            //var x = "";
            //OVPRBus.UpdateCommitment(LoggededInUserEmail, updateCommitmenArg.CommitmentChangeEnt, updateCommitmenArg.Files, out x);

            Result<int> r = null;
            string sql = null;
            await Task.Run(() =>
            {

                r = ResultRunner<int>.Run(delegate () { OVPRBus.UpdateCommitment(LoggededInUserEmail, updateCommitmenArg.CommitmentChangeEnt, updateCommitmenArg.Files, out sql); });
                r.SQL = sql;
            });
            return r;

           
        }


        [HttpGet("[action]/{Commitment_PK}")]
        public async Task<Result<List<DocumentEnt>>> GetDocuments(int Commitment_PK)
        {

            Result<List<DocumentEnt>> r = null;
            await Task.Run(() =>
            {

                r = ResultRunner<List<DocumentEnt>>.Run(delegate () { return OVPRBus.GetDocuments(Commitment_PK); });
            });
            return r;
        }

        [HttpGet("[action]/{Commitment_PK}")]
        public async Task<Result<CommitmentEnt>> GetCommitment(int Commitment_PK)
        {
            Result<CommitmentEnt> r = null;
            await Task.Run(() =>
            {

                r = ResultRunner<CommitmentEnt>.Run(delegate () { return OVPRBus.GetCommitment(Commitment_PK); });
            });
            return r;
        }

        
        [HttpGet("[action]/{Commitment_PK}")]
        public async Task<Result<string>> GetCommitmentStatus(int Commitment_PK)
        {
            Result<string> r = null;
            await Task.Run(() =>
            {

                r = ResultRunner<string>.Run(delegate () { return OVPRBus.GetCommitmentStatusByCommitPK(Commitment_PK); });
            });
            return r;
        }



        [HttpPost("[action]")]
        public async Task<Result<CommitmentsSearchReturnEnt>> Search([FromBody] CommitmentsSearchArg arg)
        {          

            Result<CommitmentsSearchReturnEnt> r = null;
            await Task.Run(() =>
            {

                r = ResultRunner<CommitmentsSearchReturnEnt>.Run(delegate () { return OVPRBus.Search(arg); });
            });
            return r;
        }

       
        /*
         * https://stackoverflow.com/questions/52154874/angular-6-downloading-file-from-rest-api/52687792
         * 
         */
        [HttpGet("[action]/{docID}")]
        public async Task<IActionResult> GetFile(int docID)
        {
            FileContentResult result = null;

            await Task.Run(() =>
            {

                 var bytes = OVPRBus.GetFile(docID);
                   result =  File(bytes, "application/octet-stream", "");
            });

            return result;

        }

      

    }
}