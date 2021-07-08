using System;
using System.Collections.Generic;

namespace DapperPagination
{
    public class Query
    {
        public int pageNumber { get; set; }

        public int noOfRows { get; set; }

        public IEnumerable<string> searchColumns { get; set; }

        public string orderColumn { get; set; }

        public OrderDirection orderDirection { get; set; }

        public string query { get; set; }

        public string searchValue { get; set; }

    }

    public enum OrderDirection { 
        Asc,
        Desc
    }

}
