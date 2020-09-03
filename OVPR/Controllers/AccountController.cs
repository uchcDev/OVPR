using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using OVPR.Models.AccountViewModels;
using OVPR_Lib;
using OVPR_Lib.Bus;
using static OVPR_Lib.Dat.UserDat;

namespace OVPR.Controllers
{
    public class AccountController : Controller
    {           

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> Login(string returnUrl = null)
        {
            await HttpContext.SignOutAsync();

            //UserEnt authUser = null;
            //var email = "schwager@uchc.edu"; //log in as julie
            //var password = "schwager";
            //var user = UserBus.Authenticate(email, password, out authUser);

            //if (returnUrl == null || String.IsNullOrEmpty(returnUrl.ToString()))
            //    await _Login("/", authUser);
            //else
            //    await _Login(returnUrl.ToString(), authUser);


            ViewData["ReturnUrl"] = returnUrl;
            return View();            
        }


        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Login(LoginViewModel model, string ReturnUrl)
        {
            try
            {
                if (String.IsNullOrEmpty(ReturnUrl))
                    ReturnUrl = "/";

                await HttpContext.SignOutAsync();

                bool isModelValid = ModelState.IsValid;
                //isModelValid = true;

                if (isModelValid)
                {
                    //String[] errorInfo;
                    //string pidm = "41149";// await AccountBus.AuthenticateUser(model.LoginHandle, model.Password);

                    bool isAuth = false;
                    UserEnt authUser = null;
                    await Task.Run(() =>
                    {
                        isAuth = UserBus.Authenticate(model.LoginHandle, model.Password, out authUser);
                    });

                    if (isAuth)
                    {
                        await _Login(ReturnUrl, authUser);
                    }
                    else
                    {
                        ModelState.AddModelError(string.Empty, "Invalid login attempt.");
                    }
                }
            }
            catch (Exception e)
            {
                ModelState.AddModelError(string.Empty, e.Message);

            }
            ViewData["ReturnUrl"] = ReturnUrl;
            return View();
        }     

        private async Task<IActionResult> _Login(string returnUrl, UserEnt authUser)
        {
            List<Claim> claims = new List<Claim>();
            claims.Add(new Claim("userID", authUser.USER_PK_ID.ToString()));
            claims.Add(new Claim("email", authUser.USER_EmailAddress));

            ClaimsIdentity identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            ClaimsPrincipal principal = new ClaimsPrincipal(identity);

            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme,
            principal,
            new AuthenticationProperties
            {


                IsPersistent = false,
                ExpiresUtc = DateTime.UtcNow.AddMinutes((double)OVPR_System.AuthenticationTimeout_Minutes)
            });

            return Redirect(returnUrl);
        }



        [HttpGet]
        public async Task<IActionResult> SignOut(string returnUrl = null)
        {
            return View();
        }
        [HttpPost]
        public async void SignOut()
        {
            await HttpContext.SignOutAsync();

        }



      

    }
}
 