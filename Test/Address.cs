using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Test
{
	public class Address
	{
		public int address_id { get; set; }
		public string address { get; set; }
		public string district { get; set; }
		public short city_id { get; set; }
		public string postal_code { get; set; }
		public string phone { get; set; }
		public DateTime last_update { get; set; }

	}
}
