'use strict';

angular.module('SpaceShipsApp')
  .service('DataBaseService', ['$http', function ($http) {
      // Add Ship
      this.AddShipItem = function (ship) {
          var response = $http({
              method: "post",
              url: "/ships/AddShip",
              data: JSON.stringify(ship),
              dataType: "json"
          });
          return response;
      }

      this.GetShipItem = function (shipID) {
          var response = $http({
              method: "get",
              url: "/ships/GetShipByNo",
              params: {
                  id: JSON.stringify(shipID)
              }
          });
          return response;
      }

      // Update Ship 
      this.UpdateShipItem = function (ship) {
          var response = $http({
              method: "post",
              url: "/ships/UpdateShip",
              data: JSON.stringify(ship),
              dataType: "json"
          });
          return response;
      }

      //Delete Ship
      this.DeleteShipItem = function (ship) {
          var response = $http({
              method: "post",
              url: "/ships/DelShip",
              data: JSON.stringify(ship),
              dataType: "json"
          });
          return response;
      }

      this.GetTotalItems = function (search) {
          var response = $http({
              method: "get",
              url: "/ships/GetTotalItems",
              params: {
                  search: search
              }
          });
          return response;
      }      
  }]);
