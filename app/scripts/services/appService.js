//jshint ignore:start
//jscs:disable
'use strict';

/**
 * @ngdoc service
 * @name ipoApp.appService
 * @description
 * # appService
 * Service in the ipoApp.
 * @author munenedk-pc
 */
app.service('appService', function ($http, $mdToast, $sessionStorage) {
    //------------------------Base URL------------------------------
    var BASE_URL = 'http://172.17.72.150:9004/api/v1/';

    //------------------------Feature Endpoints---------------------
    //Login endpoints
    this.LOGIN = 'users/login';
    this.LOGOUT = 'users/logout';
    this.UPDATE_PASSWORD = 'users/reset';

    //User module endpoints
    this.ADD_USER = 'users/create';
    this.EDIT_USER = 'users/edit';
    this.GET_BROKER_LIST = 'brokers/listbrokers';
    this.LIST_USERS = 'users/listall';
    this.APPROVE_USERS = 'users/approve';
    this.REJECT_USERS = 'users/reject';
    this.SEARCH_USERS = 'users/search';

    this.ADD_ROLE = '';
    this.EDIT_ROLE = '';
    this.ADD_PERMISSION = '';
    this.GET_ROLE_LIST = '';
    this.EDIT_PERMISSION = '';
    this.GET_ASSIGNED_ROLES = '';
    this.GET_AVAILABLE_ROLES = '';

    //Broker module endpoints
    this.LIST_BROKERS = 'brokers/listall';
    this.SEARCH_BROKERS = 'brokers/search';
    this.ADD_BROKER = 'brokers/create';
    this.EDIT_BROKER = 'brokers/edit';
    this.APPROVE_BROKERS = 'brokers/approve';
    this.REJECR_BROKERS = 'brokers/reject';

    //Applications module endpoints
    this.LIST_BATCHES = '';
    this.SEARCH_BATCH = '';
    this.ADD_BATCH = '';
    this.EDIT_BATCH = '';
    this.APPROVE_BATCHES = '';
    this.REJECT_BATCHES = '';
    this.GET_APPS_IN_BATCH = '';

    this.LIST_APPLICATIONS = '';
    this.SEARCH_APPLICATION = '';

    //------------------------Request Types----------------------------
    var POST_REQUEST = 'POST';

    //----------------Session Storage Getters, Setters & Toast Method--------
    this.setSessionVariable = function (key, value) {
        if (key !== null && value !== null) {
            $sessionStorage[key] = value;
        }
    };

    this.getSessionVariable = function (key) {
        var value = $sessionStorage[key];
        if (value !== null) {
            return value;
        }
    };

    this.clearSessionStorage = function () {
        $sessionStorage.$reset();
    };

    this.showToast = function (message) {
        $mdToast.show($mdToast.simple().textContent(message).position('bottom right').hideDelay(3000));
    };

    //------------------------Generic requester---------------------------------
    this.genericPaginatedRequest = function (payload, endpoint, currentPage, itemsPerPage) {
        return $http({
            method: POST_REQUEST,
            url: BASE_URL + endpoint + "?page=" + currentPage + "&size=" + itemsPerPage,
            headers: {'Content-type': 'application/json'},
            data: angular.toJson(payload)
        });
    };

    //------------------------Generic unpaginated requester---------------------------------
    this.genericUnpaginatedRequest = function (payload, endpoint) {
        return $http({
            method: POST_REQUEST,
            url: BASE_URL + endpoint,
            headers: {'Content-type': 'application/json'},
            data: angular.toJson(payload)
        });
    };

});
