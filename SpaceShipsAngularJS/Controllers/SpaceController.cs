using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using SpaceShipsAngularJS.Models;

namespace SpaceShipsAngularJS.Controllers
{
    [RoutePrefix("ships")]
    public class SpaceController : ApiController
    {
        #region
        /// <summary>
        /// Datastore access context
        /// </summary>
        private SpaceShipsAngularJSDBDataContext db { get; set; }

        /// <summary>
        /// Handles initializing shared properties
        /// </summary>
        public SpaceController()
        {
            // initalize our access to th database
            db = new SpaceShipsAngularJSDBDataContext();
        }

        /// <summary>
        /// Releases managed and unmanaged resources based on parameters
        /// </summary>
        /// <param name="disposing">
        /// True: release managed and unamaged resources,
        /// False: release only unmanaged resources
        /// </param>
        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                // Dispose of our datastore access context
                db.Dispose();
            }
            base.Dispose(disposing);
        }
        #endregion

        
        [Route("ships")]
        public IHttpActionResult GetShips(string sort = null, int numberPage = 1, bool statusSort = false, string search = null)
        {
            // Create a list of view models which we will return
            var shipView = new List<Table>();
            // Change each region into a view model and insert it into the list 
            IQueryable<Table> ships = db.Table;
            switch (sort)
            {
                default:
                    {
                        ships = statusSort ? ships.OrderByDescending(k => k.Id) : ships.OrderBy(k => k.Id);
                    }
                    break;
                case "name":
                    {
                        ships = statusSort ? ships.OrderByDescending(k => k.Name) : ships.OrderBy(k => k.Name);
                    }
                    break;
                case "class":
                    {
                        ships = statusSort ? ships.OrderByDescending(k => k.Class) : ships.OrderBy(k => k.Class);
                    }
                    break;
                case "manufacturer":
                    {
                        ships = statusSort ? ships.OrderByDescending(k => k.Manufacturer) : ships.OrderBy(k => k.Manufacturer);
                    }
                    break;
            }
            if (!string.IsNullOrEmpty(search))
            {
                search = search.ToLower();
                ships = ships.Where(s => s.Name.ToLower().Contains(search) || s.Class.ToLower().Contains(search) || s.Manufacturer.ToLower().Contains(search));
            }
            int pageSize = 5;
            int startIndex = (numberPage - 1) * pageSize;
            ships = ships.Skip(startIndex).Take(pageSize);
            foreach (Table c in ships)
            {
                shipView.Add(new Table
                {
                    Id = c.Id,
                    Name = c.Name,
                    Class = c.Class,
                    Manufacturer = c.Manufacturer
                });
            }
            // Return HTTP 200 with the view model list as body payload
            return Ok(shipView);
        }

        [Route("AddShip")]
        public string AddShip(Table ship)
        {
            if (ship != null)
            {
                db.Table.InsertOnSubmit(ship);
                db.SubmitChanges();
                return "Ships Updated";
            }
            else
            {
                return "Invalid ship";
            }
        }

        [Route("DelShip")]
        public string DelShip(Table ship)
        {
            if (ship != null)
            {
                int no = Convert.ToInt32(ship.Id);
                var shipList = db.Table.Where(x => x.Id == no).FirstOrDefault();
                db.Table.DeleteOnSubmit(shipList);
                db.SubmitChanges();
                return "Ship Deleted"; ;
            }
            else
            {
                return "Invalid ship";
            }
        }

        [Route("UpdateShip")]
        public string UpdateShip(Table ship)
        {
            if (ship != null)
            {
                int no = Convert.ToInt32(ship.Id);
                var shipList = db.Table.Where(x => x.Id == no).FirstOrDefault();
                shipList.Name = ship.Name;
                shipList.Class = ship.Class;
                shipList.Manufacturer = ship.Manufacturer;
                db.SubmitChanges();
                return "Ship Updated";
            }
            else
            {
                return "Invalid ship";
            }
        }

        [Route("GetShipByNo")]
        public IHttpActionResult GetShipByNo(string id)
        {
            int no = Convert.ToInt32(id);
            var shipList = db.Table.Where(w => w.Id == no);
            return Ok(shipList);
        }

        [Route("GetTotalItems")]
        public IHttpActionResult GetTotalItems(string search = null)
        {
            int count = 1;
            if (!string.IsNullOrEmpty(search))
            {
                search = search.ToLower();
                count = db.Table.Where(s => s.Name.ToLower().Contains(search) || s.Class.ToLower().Contains(search) || s.Manufacturer.ToLower().Contains(search)).Count();
            }
            else
            {
                count = db.Table.Count();
            }
            return Ok(count);
        }
        // GET: api/Space
        public List<Table> Get()
        {
            using (SpaceShipsAngularJSDBDataContext db = new SpaceShipsAngularJSDBDataContext())
            {
                List<Table> items = db.Table.ToList();
                return items;
            }            
        }

        // GET: api/Space/5
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/Space
        public void Post([FromBody]string value)
        {
        }

        // PUT: api/Space/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/Space/5
        public void Delete(int id)
        {
        }
    }
}
