using OVPR_Lib.Dat;
using System;
using System.Collections.Generic;
using System.Text;
using static OVPR_Lib.Dat.UserDat;

namespace OVPR_Lib.Bus
{
    public class UserBus
    {
        public static bool Authenticate(string email, string password, out UserEnt authUser)
        {
            var user =  UserDat.usp_01_User_GetUsers(email, true);
            authUser = null;
            if (user.Count  == 1)
            {
                if (user[0].USER_Password == password)
                {
                    authUser = user[0];
                    return true;
                }
            }

            return false;

        }

        public static List<UserEnt> GetAllUsers(bool isActive)
        {           
            var users = UserDat.usp_01_User_GetUsers("ALL", isActive);
            users.ForEach(p => p.USER_Password = null);

            return users;
        }

        public static void AddUser(UserEnt userEnt, int insertByUserID)
        { 
            UserDat.usp_02_User_AddUsers(userEnt, insertByUserID);
        }

        public static void UpdateUser(UserEnt userEnt, int updateByUserID)
        {
            UserDat.usp_03_User_UpdateUsers(userEnt, updateByUserID);
        }
       
        public static List<RolesEnt> GetRoles()
        {          
            return UserDat.usp_04_User_GetRoles();
        }

    }
}
