using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace OVPR_Lib.Utils
{
    public class DataAccessHelpers
    {
        public static List<T> GetEnts<T>(string sqlProcName, List<SqlParameter> sqlParameters)
        {
            var dt = ExecuteGetDataTableStoredProc(sqlProcName, sqlParameters);
            return BindDataList<T>(dt);
        }

        public static string ExecuteGetString(string sqlProcName, List<SqlParameter> sqlParameters)
        {
            var dataTable = ExecuteGetDataTableStoredProc(sqlProcName, sqlParameters);

            if (dataTable.Rows.Count > 0 && dataTable.Columns.Count > 0)
                return dataTable.Rows[0][0].ToString();
            else
                return null;
        }
        public static bool ExecuteGetBool(string sqlProcName, List<SqlParameter> sqlParameters)
        {
            var dataTable = ExecuteGetDataTableStoredProc(sqlProcName, sqlParameters);
            return Boolean.Parse(dataTable.Rows[0][0].ToString());
        }
        public static int ExecuteGetInt(string sqlProcName, List<SqlParameter> sqlParameters)
        {
            var dataTable = ExecuteGetDataTableStoredProc(sqlProcName, sqlParameters);
            return Int32.Parse(dataTable.Rows[0][0].ToString());
        }
        public static List<string> ExecuteGetStringList(string sqlProcName, List<SqlParameter> sqlParameters)
        {
            var dt = ExecuteGetDataTableStoredProc(sqlProcName, sqlParameters);
            List<string> list = new List<string>();

            foreach (DataRow dr in dt.Rows)
            {
                list.Add(dr[0].ToString());
            }

            return list;
        }



        public static DataTable ExecuteGetDataTableStoredProc(string sqlProcName, List<SqlParameter> sqlParameters)
        {

            //	Trusted_Connection=true
            
            SqlConnection connection = new SqlConnection(OVPR_System.ConnectionString);
            SqlCommand command = new SqlCommand();
            try
            {
                // configure command
                //ommand.CommandText = sqlString;
                command.CommandText = sqlProcName;
                command.CommandType = System.Data.CommandType.StoredProcedure;
                command.Connection = connection;

                foreach (var param in sqlParameters)
                    if (param.Value == null)
                        param.Value = DBNull.Value;

                if (sqlParameters != null)
                {
                    command.Parameters.AddRange(sqlParameters.ToArray());
                }

                // create DataAdaptor
                SqlDataAdapter dataAdapter = new SqlDataAdapter(command);

                // create empty DataSet
                DataSet dataSet = new DataSet();

                // fill DataSet via commandString
                dataAdapter.Fill(dataSet);



                // extract first DataTable (should be only one)

                if (dataSet.Tables.Count > 0)
                    return dataSet.Tables[0];
                else
                    return null;


            }
            finally
            {
                // if connection is still open, close it
                if (connection.State == System.Data.ConnectionState.Open)
                {
                    connection.Close();
                }

                // cleanup
                command.Dispose();
                connection.Dispose();
            }
        }

        public static List<T> BindDataList<T>(DataTable dt)
        {
            List<string> columns = new List<string>();
            foreach (DataColumn dc in dt.Columns)
            {
                columns.Add(dc.ColumnName);
            }

            var fields = typeof(T).GetFields();
            var properties = typeof(T).GetProperties();

            List<T> lst = new List<T>();

            foreach (DataRow dr in dt.Rows)
            {
                var ob = Activator.CreateInstance<T>();

                foreach (var fieldInfo in fields)
                {
                    if (columns.Contains(fieldInfo.Name))
                    {
                        if (dr[fieldInfo.Name] == DBNull.Value)
                            fieldInfo.SetValue(ob, null);
                        else if (fieldInfo.FieldType == typeof(Int32) || fieldInfo.FieldType == typeof(Int32?))
                            fieldInfo.SetValue(ob, Int32.Parse(dr[fieldInfo.Name].ToString()));
                        else if (fieldInfo.FieldType == typeof(double) || fieldInfo.FieldType == typeof(double?))
                            fieldInfo.SetValue(ob, double.Parse(dr[fieldInfo.Name].ToString()));
                        else if (fieldInfo.FieldType == typeof(DateTime) || fieldInfo.FieldType == typeof(DateTime?))
                            fieldInfo.SetValue(ob, (DateTime)(dr[fieldInfo.Name]));
                        else if (fieldInfo.FieldType == typeof(bool) || fieldInfo.FieldType == typeof(bool?))
                        {
                            var val = dr[fieldInfo.Name].ToString();
                            if (val == "0" || val == "1")
                                val = val == "0" ? "false" : "true";

                            fieldInfo.SetValue(ob, bool.Parse(val));
                        }
                        else
                            fieldInfo.SetValue(ob, dr[fieldInfo.Name].ToString());
                    }
                }

                foreach (var propertyInfo in properties)
                {
                    if (columns.Contains(propertyInfo.Name))
                    {


                        if (dr[propertyInfo.Name] == DBNull.Value)
                            propertyInfo.SetValue(ob, null);
                        else if (propertyInfo.PropertyType == typeof(Int32) || propertyInfo.PropertyType == typeof(Int32?))
                            propertyInfo.SetValue(ob, Int32.Parse(dr[propertyInfo.Name].ToString()));
                        else if (propertyInfo.PropertyType == typeof(double) || propertyInfo.PropertyType == typeof(double?))
                            propertyInfo.SetValue(ob, double.Parse(dr[propertyInfo.Name].ToString()));
                        else if (propertyInfo.PropertyType == typeof(DateTime) || propertyInfo.PropertyType == typeof(DateTime?))
                            propertyInfo.SetValue(ob, (DateTime)(dr[propertyInfo.Name]));
                        else if (propertyInfo.PropertyType == typeof(bool) || propertyInfo.PropertyType == typeof(bool?))
                            propertyInfo.SetValue(ob, bool.Parse(dr[propertyInfo.Name].ToString()));
                        else
                            propertyInfo.SetValue(ob, dr[propertyInfo.Name].ToString());



                    }
                }

                lst.Add(ob);
            }

            return lst;
        }
    }
}
