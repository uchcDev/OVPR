using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json.Serialization;
using OVPR_Lib;
using System;
using System.IO;
using System.Threading.Tasks;

namespace OVPR
{
    public class Settings
    {
        public string ConnectionString { get; set; }
        public int AuthenticationTimeout_Minutes { get; set; }
        public string Arg2 { get; set; }
    }

    public class Startup
    {
        /*
         * to configure setting to be injectable
         * 
         *   services.Configure<Settings>(Configuration.GetSection("Settings")); 
         *   
         *   in a controller:
         *    public AccountController(IOptions<Settings> settings)
        {
            this.settings = settings.Value;
        }
         * 
         */

        //public IConfiguration Configuration { get; }
        public Startup(IConfiguration configuration)
        {
            //Configuration = configuration;

            Settings settings = new Settings();
            configuration.Bind("Settings", settings);
           
            OVPR_System.ConnectionString = settings.ConnectionString;
            OVPR_System.AuthenticationTimeout_Minutes = settings.AuthenticationTimeout_Minutes;
        }





        public async Task ValidateAsync(CookieValidatePrincipalContext context)
        {
            var utc = context.Properties.ExpiresUtc.Value.DateTime;

            context.Response.Cookies.Delete("AuthCookieExpiration_UTC");
            context.Response.Cookies.Append("AuthCookieExpiration_UTC", utc.ToString());
            
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
              

            services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)            

            .AddCookie(options =>
                {

                    options.Events = new CookieAuthenticationEvents
                    {
                        OnValidatePrincipal = ValidateAsync
                    };

                    options.SlidingExpiration = true;

                  

                 
                   // options.


                }
            );

           






            services.AddMvc()
        
            .AddJsonOptions(options => options.SerializerSettings.ContractResolver = new DefaultContractResolver());



            //In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/dist";
                //
            });

            

                  
        }


        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
                app.UseHsts();
            }


            app.UseAuthentication();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
            });

            app.Use(async (context, next) =>
            {
                /*
                   if(context.Request.Path.ToString().StartsWith("/OVPR") || (context.Response.Status`ode == 404 && !Path.HasExtension(context.Request.Path.Value)))
                   {

                       context.Request.Path = "index.html";
                   }
                   */
             



                if (context.Request.Path.Value.StartsWith("/OVPR"))
               {
                    context.Request.Path = new PathString("/index.html");

               }                       


               if (!context.User.Identity.IsAuthenticated)
               {
                   var p = context.Request.Path;
                   if (context.Request.Path.ToString().StartsWith("/Images"))
                       await next();

                   else
                       await context.ChallengeAsync(CookieAuthenticationDefaults.AuthenticationScheme);
               }
               else
               {
                   await next();
               }          


           });

           app.UseMvcWithDefaultRoute();
           app.UseDefaultFiles();
           app.UseStaticFiles();

           app.UseSpa(spa =>
           {
               // To learn more about options for serving an Angular SPA from ASP.NET Core,
               // see https://go.microsoft.com/fwlink/?linkid=864501

               spa.Options.SourcePath = "wwwroot";

               if (env.IsDevelopment())
               {
                   spa.Options.SourcePath = "ClientApp";
                   spa.UseAngularCliServer(npmScript: "start");
               }







           });


        }
    }
}
