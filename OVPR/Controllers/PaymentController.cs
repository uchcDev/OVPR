using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OVPR_Lib.Bus;
using static OVPR_Lib.Dat.PaymentDat;

namespace OVPR.Controllers
{
    [Authorize]
    [Route("OVPR_API/[controller]")]
    public class PaymentController : OVPRBaseController
    { 
        [HttpGet("[action]/{CommitPK}/{PayStatus}")]      
        public async Task<Result<List<PaymentEnt>>> GetAllPayments(int CommitPK, string PayStatus)
        {
            Result<List<PaymentEnt>> r = null;
            await Task.Run(() =>
            {

                r = ResultRunner<List<PaymentEnt>>.Run(delegate () { return PaymentBus.GetPayments(CommitPK, PayStatus, null); });
            });
            return r;
        } 

        [HttpGet("[action]")]      
        public async Task<Result<string>> GetCurrentFiscalYear()
        {
            Result<string> r = null;
            await Task.Run(() =>
            {

                r = ResultRunner<string>.Run(delegate () { return PaymentBus.GetCurrentFiscalYear(); });
            });
            return r;
        }

        [HttpGet("[action]/{Commitment_PK}")]
        public async Task<Result<int>> GetNextAvailablePaymentNumber(int Commitment_PK)
        {           
            Result<int> r = null;
            await Task.Run(() =>
            {

                r = ResultRunner<int>.Run(delegate () { return PaymentBus.GetNextAvailablePaymentNumber(Commitment_PK); });
            });
            return r;
        }

        [HttpPost("[action]")]      
        public async Task<Result<int>> AddPayment([FromBody] PaymentChangeEnt ent)
        {
            Result<int> r = null;
            await Task.Run(() =>
            {

                r = ResultRunner<int>.Run(delegate () { PaymentBus.AddPayment(ent); });
            });
            return r;          
        }

        [HttpPost("[action]")]      
        public async Task<Result<int>> EditPayment([FromBody] PaymentChangeEnt ent)
        {

            Result<int> r = null;
            await Task.Run(() =>
            {

                r = ResultRunner<int>.Run(delegate () { PaymentBus.EditPayment(ent); });
            });
            return r; 
          
        }

        [HttpGet("[action]/{Commitment_PK}/{Payment_PK}/{PayStatus}")]      
        public async Task<Result<int>> DeletePayment(int Commitment_PK, int Payment_PK, string PayStatus)
        {         

            Result<int> r = null;
            await Task.Run(() =>
            {

                r = ResultRunner<int>.Run(delegate () { PaymentBus.DeletePayment(Commitment_PK, Payment_PK, PayStatus); });
            });
            return r;



        }

    }
}