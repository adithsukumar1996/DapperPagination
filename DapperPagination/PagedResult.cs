using System;
using System.Collections.Generic;
using System.Text;

namespace DapperPagination
{
    public class PagedResult<T> where T: class
    {
        public IEnumerable<T> result { get; set; }

        public int count { get; set; }
    }
}
