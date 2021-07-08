using DapperPagination;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Npgsql;
using System.Collections.Generic;
using System.Threading.Tasks;
using static DapperPagination.DapperPagination;
namespace Test.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        private readonly ILogger<WeatherForecastController> _logger;

        public WeatherForecastController(ILogger<WeatherForecastController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public async Task<PagedResult<Address>> Get([FromQuery] string q, [FromQuery] int pno, [FromQuery] int rno, [FromQuery] string order, [FromQuery] OrderDirection dir)
        {
            var f = new Query 
            { 
                noOfRows =rno,
                orderColumn = order,
                orderDirection = dir,
                pageNumber = pno,
                query = "SELECT * FROM ADDRESS",
                searchColumns = new string[] {"address", "district", "postal_code"},
                searchValue = q
            };

            var result = await RunQuery<Address>(f, new NpgsqlConnection("host=localhost;database=local;port=5432;username=postgres;password=password;"));

            return result;

        }

        [HttpGet("about")]
        public async Task<Address> About()
        {
            await Task.Delay(100);
            return new Address();
        }
    }
}
