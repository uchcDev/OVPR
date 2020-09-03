using OVPR_Lib.Dat;
using System;
using System.Collections.Generic;
using System.Text;
using static OVPR_Lib.Dat.TypeDat;

namespace OVPR_Lib.Bus
{
    public class TypeBus
    {
        public static List<TypeEnt> GetLevel1()
        {
            return TypeDat.usp_31_CommitType_GetLevel1();
        }

        public static List<TypeEnt> GetLevel2(int Level1_PK)
        {
            return TypeDat.usp_32_CommitType_GetLevel2(Level1_PK);
        }
       
        public static void UpdateLevel2(TypeLevel2Ent ent, string userName)
        {
            TypeDat.usp_33_CommitType_UpdateLevel2(ent,userName);
        }

        public static void AddLevel2(TypeLevel2Ent ent, string userName)
        {
            TypeDat.usp_34_CommitType_AddLevel2(ent, userName) ;
        }
       
    }
}
