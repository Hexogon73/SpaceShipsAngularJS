'use strict';
angular.module('SpaceShipsApp').controller('SpaceController', ['$scope', '$resource', '$translate', 'DataBaseService', function ($scope, $resource, $translate, DataBaseService) {
    var _cntrl = this;

    _cntrl.setPage = _setPage;
    _cntrl.pageChanged = _pageChanged;
    _cntrl.AddUpdateShip = _AddUpdateShip;
    _cntrl.EditShipItem = _EditShipItem;
    _cntrl.AddShipDiv = _AddShipDiv;
    _cntrl.CancelAddShipDiv = _CancelAddShipDiv;
    _cntrl.DeleteShip = _DeleteShip;
    _cntrl.refreshData = _refreshData;
    _cntrl.enterSearch = _enterSearch;
    _cntrl.cancelSearch = _cancelSearch;

    _cntrl.divShip = false;
    _cntrl.buttonAddShip = true;
    _cntrl.currentPage = 1;
    _cntrl.numPerPage = 5;
    _cntrl.statusSort = false;
    _getTotalItems();
    _cntrl.sortName = "id";
    _RefreshData("id", 1);

    //Смена языка
    _cntrl.changeLanguage = function (langKey) {
        $translate.use(langKey);
        _cntrl.currentLang = langKey;
        if (_cntrl.currentLang == 'ru') {
            if (_cntrl.Action == 'Add') {
                _cntrl.Action2 = "Добавление";
            }
            else {
                _cntrl.Action2 = "Обновление";
            }
        }
        else {
            _cntrl.Action2 = _cntrl.Action;
        }
    };

    function _getTotalItems(sortName, numberPage, statusSort, search) {
        var getData = DataBaseService.GetTotalItems(search);
        getData.then(function (param) {
            _cntrl.totalItems = param.data;
            _RefreshData(sortName, numberPage, statusSort, search);
        },
        function () {
            _cntrl.totalItems = 1;
            _RefreshData();
        });
    }

    function _setPage(pageNo) {
        _cntrl.currentPage = pageNo;
    };

    function _pageChanged() {
        _RefreshData(_cntrl.sortName, _cntrl.currentPage, _cntrl.statusSort, _cntrl.search)
    };

    //метод добавления или обновления корабля
    function _AddUpdateShip() {
        var Ship = {
            Name: _cntrl.shipName,
            Class: _cntrl.shipClass,
            Manufacturer: _cntrl.shipManufacturer
        };
        var getAction = _cntrl.Action;

        if (getAction == "Update") {
            Ship.Id = _cntrl.shipId;
            var getData = DataBaseService.UpdateShipItem(Ship);
            getData.then(function (msg) {
                alert(msg.data);
                _cntrl.divShip = false;
                _cntrl.buttonAddShip = true;
                _RefreshData(_cntrl.sortName, _cntrl.currentPage, _cntrl.statusSort, _cntrl.search);
            }, function () {
                alert('Error in updating record');
            });
        }
        else {
            var getData = DataBaseService.AddShipItem(Ship);
            getData.then(function (msg) {
                alert(msg.data);
                _cntrl.divShip = false;
                _cntrl.buttonAddShip = true;
                _getTotalItems();
                _cntrl.setPage(1);
            }, function () {
                alert('Error in adding record');
            });
        }
    }

    //редактирование корабля
    function _EditShipItem(ship) {
        var getData = DataBaseService.GetShipItem(ship.Id);
        getData.then(function (shipItem) {
            _cntrl.ship = shipItem.data;
            _cntrl.shipId = ship.Id;
            _cntrl.shipName = ship.Name;
            _cntrl.shipClass = ship.Class;
            _cntrl.shipManufacturer = ship.Manufacturer;
            _cntrl.Action = "Update";
            if (_cntrl.currentLang == 'ru') {
                _cntrl.Action2 = "Обновление";
            }
            else {
                _cntrl.Action2 = "Update";
            }
            _cntrl.divShip = true;
            _cntrl.buttonAddShip = false;
        },
        function () {
            alert('Error in getting records');
        });
    }

    function _AddShipDiv() {
        _cntrl.buttonAddShip = false;
        _ClearFields();
        _cntrl.Action = "Add";
        if (_cntrl.currentLang == 'ru') {
            _cntrl.Action2 = "Добавление";
        }
        else {
            _cntrl.Action2 = "Add";
        }
        _cntrl.divShip = true;
    }

    //кнопка "Отмена"
    function _CancelAddShipDiv() {
        _ClearFields();
        _cntrl.buttonAddShip = true;
        _cntrl.divShip = false;
    }

    function _ClearFields() {
        _cntrl.shipId = "";
        _cntrl.shipName = "";
        _cntrl.shipClass = "";
        _cntrl.shipManufacturer = "";
    }

    function _DeleteShip(ship) {
        var getData = DataBaseService.DeleteShipItem(ship);
        getData.then(function (msg) {
            alert('Ship Deleted');
            _getTotalItems();
            _cntrl.setPage(1);
        }, function () {
            alert('Error in Deleting Record');
        });
    }

    //обновление таблицы
    function _RefreshData(sortName, numberPage, statusSort, search) {
        //источник данных таблицы
        _cntrl.allShips = _GetCurrentList(sortName, numberPage, statusSort, search);
    }

    //получение записей всех корбалей с фильтрацией по параметрам
    function _GetCurrentList(sortName, numberPage, statusSort, search) {
        return $resource('/ships/ships').query({ sort: sortName, numberPage: numberPage, statusSort: statusSort, search: search });
    }

    //метод для сортировки по полям таблицы
    function _refreshData(sortName) {
        if (sortName == _cntrl.sortNamePrev) {
            _cntrl.statusSort = !_cntrl.statusSort;
            _cntrl.reverse = !_cntrl.reverse;
        }
        else {
            _cntrl.statusSort = false;
            _cntrl.reverse = false;
        }
        _cntrl.sortName = sortName;
        _cntrl.sortKey = sortName;
        _cntrl.sortNamePrev = sortName;
        _RefreshData(sortName, _cntrl.currentPage, _cntrl.statusSort, _cntrl.search);
    }

    //метод для поиска по записям
    function _enterSearch(keyEvent) {
        if (keyEvent.which === 13) {
            _getTotalItems(_cntrl.sortName, 1, _cntrl.statusSort, _cntrl.search);
        }
    }

    //сброс поиска по записям
    function _cancelSearch(keyEvent) {
        _cntrl.search = "";
        _getTotalItems(_cntrl.sortName, 1, _cntrl.statusSort, _cntrl.search);
        _cntrl.setPage(1);
    }
}]);