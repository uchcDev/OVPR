using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OVPR_Lib.Bus;
using static OVPR_Lib.Dat.TypeDat;

namespace OVPR.Controllers
{
    [Authorize]
    [Route("OVPR_API/[controller]")]
    public class TypeController : OVPRBaseController
    {
        [HttpGet("[action]")]
        public async Task<Result<List<TypeEnt>>> GetLevel1()
        {          
            Result<List<TypeEnt>> r = null;
            await Task.Run(() =>
            {

                r = ResultRunner<List<TypeEnt>>.Run(delegate () { return TypeBus.GetLevel1(); });
            });
            return r;
        }

        [HttpGet("[action]/{Level1_PK}")]        
        public async Task<Result< List<TypeEnt>>> GetLevel2(int Level1_PK)
        {
            Result<List<TypeEnt>> r = null;
            await Task.Run(() =>
            {

                r = ResultRunner<List<TypeEnt>>.Run(delegate () { return TypeBus.GetLevel2(Level1_PK); });
            });
            return r;
        }

        [HttpPost("[action]")]       
        public async Task<Result<int>> UpdateLevel2([FromBody] TypeLevel2Ent ent)
        {
            Result<int> r = null;
            await Task.Run(() =>
            {

                r = ResultRunner<int>.Run(delegate () {TypeBus.UpdateLevel2(ent, LoggededInUserEmail); });
            });
            return r;
        }
        [HttpPost("[action]")]       
        public async Task<Result<int>> AddLevel2([FromBody]TypeLevel2Ent ent)
        {         
            Result<int> r = null;
            await Task.Run(() =>
            {

                r = ResultRunner<int>.Run(delegate () { TypeBus.AddLevel2(ent, LoggededInUserEmail); });
            });
            return r;
        }
    }
}