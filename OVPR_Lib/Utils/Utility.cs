using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Text;

namespace OVPR_Lib.Utils
{
    public class Utility
    {
        public static string ExecCall(string procName, List<SqlParameter> prms)
        {

            string execCall = "exec " + procName + "\n";
            for (int index = 0; index < prms.Count; index++)
            {

                var sqlParameter = prms[index];
                string param = sqlParameter + " = {0}";


           

                if (sqlParameter.Value != null && sqlParameter.DbType != System.Data.DbType.Boolean &&
                     sqlParameter.DbType != System.Data.DbType.Int32 &&
                        sqlParameter.DbType != System.Data.DbType.Double
                    )
                {
                    param = String.Format(param, "'{0}'");

                }

                if (index < prms.Count - 1)
                {
                    param += ",";
                }
                param += "\n";

                if (sqlParameter.Value == null)
                    param = String.Format(param, "null");
                else if (sqlParameter.Value is string && ((string)sqlParameter.Value) == "")
                {
                    param = String.Format(param, "");
                }
                else
                    param = String.Format(param, sqlParameter.Value);

                execCall += param;
            }

            return execCall;
        }
    }
}
