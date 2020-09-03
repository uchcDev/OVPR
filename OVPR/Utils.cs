using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OVPR
{
    public class Result<T>
    {
        public T ReturnData;
        public bool IsError;
        public string Message;
        public string SQL;
    }

    public class ResultRunner<T>
    {
        public delegate object _return();
        public delegate void _void();

        public static Result<T> Run(_return runThis)
        {
            return _Run(runThis);
        }

        public static Result<T> Run(_void runThis)
        {
            return _Run(runThis);
        }

        private static Result<T> _Run(object aDelegate)
        {
            var result = new Result<T>();

            try
            {
                if (aDelegate is _return)
                {
                    result.ReturnData = (T)((_return)aDelegate)();
                }
                else
                {
                    ((_void)aDelegate)();
                }
            }
            catch (Exception e)
            {
                result.IsError = true;
                result.Message = e.Message;
            }


            return result;
        }
    }
}
