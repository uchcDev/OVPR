using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace OVPR.Controllers
{
    [ResponseCache(Duration = 0)]
    public class OVPRBaseController : Controller
    {
        public string LoggededInUserEmail
        {
            get
            {
                var identity = (ClaimsIdentity)User.Identity;
                IEnumerable<Claim> claims = identity.Claims;

                return claims.Where(p => p.Type == "email").First().Value;
            }
        }
        public int LoggededInUserID
        {
            get
            {
                var identity = (ClaimsIdentity)User.Identity;

                //identity.BootstrapContext


                IEnumerable<Claim> claims = identity.Claims;

                return Int32.Parse(claims.Where(p => p.Type == "userID").First().Value);
            }
        }
    }
}