using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using System.Reflection;
using System.Linq.Expressions;

namespace OVPR_Lib.Utils
{
    public static class SortingExtensions
    {
        public static IQueryable<T> OrderByFieldName<T>
            (this IQueryable<T> query, string fieldName, bool isSortAscending)
        {
            // Find the field we're sorting on and get it's type
            Type fieldType = typeof(T).GetProperty(fieldName).PropertyType;

            // Find the generic sort method. Note the binding flags 
            // since our particular sort method is marked as private & static
            MethodInfo sortItMethod = typeof(SortingExtensions)
                .GetMethod("SortIt", BindingFlags.Static | BindingFlags.NonPublic);

            // The method returned is an open generic, 
            // so let's close it with the types we need for this operation
            sortItMethod = sortItMethod.MakeGenericMethod(typeof(T), fieldType);

            // Now that we have our closed generic type, 
            // we can invoke it with the specified parameters 
            query = (IQueryable<T>)sortItMethod
                .Invoke(null, new object[] { query, fieldName, isSortAscending });

            return query;
        }

        private static IQueryable<T> SortIt<T, K>
            (IQueryable<T> query, string sortFieldName, bool isSortAscending)
        {
            // The orderby works by examining the lambda passed and looking that the body
            // for the property name and variable type.
            // In order to supply a lambda, we'll need to build one.

            // The parameter will be the left-hand side of the lambda expression
            ParameterExpression param = Expression.Parameter(typeof(T), "x");

            // The body will be the right-hand side of the lambda expression
            MemberExpression body = Expression.Property(param, sortFieldName);

            // We'll build our lambda expression, 
            // first passing in the body and then the parameter
            var sortExpression = Expression.Lambda<Func<T, K>>(body, param);

            // All that's left to do is calling the correct extension method for ordering
            if (isSortAscending)
                return query.OrderBy<T, K>(sortExpression);
            else
                return query.OrderByDescending<T, K>(sortExpression);
        }
    }
}
