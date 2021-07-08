using Dapper;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DapperPagination
{
    public class DapperPagination
    {
        public static async Task<PagedResult<T>> RunQuery<T>(Query query, IDbConnection dbConnection) where T: class
        {
            string sql = query.query;

            if(query.searchColumns != null && query.searchColumns.AsList<string>().Count > 0  && !string.IsNullOrEmpty(query.searchValue))
            {
                string searchString = null;

                foreach(var col in query.searchColumns.AsList<string>())
                {
                    searchString += $"Lower({col}) like '%{query.searchValue.ToLower()}%' or ";
                }

                searchString  = searchString.Substring(0, searchString.Length - 3);

                if (sql.ToLower().Contains("where"))
                {
                    sql += $" and {searchString}";
                }
                else
                {
                    sql += $" where {searchString}";
                }
            }

            var result = new PagedResult<T>();

                string countQuery = $"select count (*) from {sql.ToLower().Split(new String[] { "from" }, StringSplitOptions.None)[1]}";

                result.count = await dbConnection.QueryFirstOrDefaultAsync<int>(countQuery);

            if (!string.IsNullOrEmpty(query.orderColumn))
            {
      
                sql += $" order by {query.orderColumn} {query.orderDirection} ";
            }

            if (query.pageNumber == 0)
                query.pageNumber = 1;
            if (query.noOfRows == 0)
                query.noOfRows = 10;

            if(query.noOfRows > 0 && query.pageNumber > 0)
            {
                sql += $" offset {(query.pageNumber - 1) * query.noOfRows} rows fetch next {query.noOfRows} rows only";
            }
            
            result.result =  await dbConnection.QueryAsync<T>(sql);

            dbConnection.Close();


            return result;
        }
    }
}
