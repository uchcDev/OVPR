using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OVPR_Lib;
using OVPR_Lib.Bus;
using OVPR_Lib.Dat;
using static OVPR_Lib.Dat.UserDat;

namespace OVPR.Controllers
{
    [Authorize]
    [Route("OVPR_API/[controller]")]
    public class UserController : OVPRBaseController
    {
         
        [HttpGet("[action]/{isActive}")]       
        public async Task<Result<List<UserEnt>>> GetAllUsers(bool isActive)
        {
            Result<List<UserEnt>> r = null;
            await Task.Run(() =>
            {

                r = ResultRunner<List<UserEnt>>.Run(delegate () { return UserBus.GetAllUsers(isActive); });
            });
            return r;
        }
       
        [HttpPost("[action]")]       
        public async Task<Result<int>> AddUser([FromBody] UserEnt ent)
        {
           Result<int> r = null;
            await Task.Run(() =>
            {

                r = ResultRunner<int>.Run(delegate () { UserBus.AddUser(ent, LoggededInUserID); });
            });
            return r;
        }
       
        [HttpPost("[action]")]       
        public async Task<Result<int>> UpdateUser([FromBody] UserEnt ent)
        {
            Result<int> r = null;
            await Task.Run(() =>
            {
                r = ResultRunner<int>.Run(delegate () { UserBus.UpdateUser(ent, LoggededInUserID); });
            });
            return r;
        }
      
        [HttpGet("[action]")]        
        public async Task<Result< List<RolesEnt>>> GetRoles()
        {          
            Result<List<RolesEnt>> r = null;
            await Task.Run(() =>
            {

                r = ResultRunner<List<RolesEnt>>.Run(delegate () { return UserBus.GetRoles(); });
            });
            return r;
        }

        [HttpGet("[action]")]
        public async Task<Result<int>>KeepAlive()
        {
             Result<int> r = null;
            await Task.Run(() =>
            {
                r = ResultRunner<int>.Run(delegate () { return 1; });
            });
            return r;
        }

        [HttpGet("[action]")]
        public async Task<Result<int>> GetTimout()
        {
            Result<int> r = null;
            await Task.Run(() =>
            {
                r = ResultRunner<int>.Run(delegate () { return OVPR_System.AuthenticationTimeout_Minutes; });
            });
            return r;
        }

    }
}