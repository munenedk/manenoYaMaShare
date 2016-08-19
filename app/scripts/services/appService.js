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

    //Role management endpoints
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

    //Customer module
    this.LIST_CUSTOMERS = 'customer/listall';
    this.SEARCH_CUSTOMER = 'customer/search';
    this.ADD_CUSTOMER = 'customer/create';
    this.EDIT_CUSTOMER = 'customer/edit';
    this.APPROVE_CUSTOMERS = 'customer/approve';
    this.REJECT_CUSTOMERS = 'customer/reject';

    //Batches module endpoints
    this.LIST_BATCHES = 'batch/listall';
    this.SEARCH_BATCH = '';
    this.ADD_BATCH = 'batch/create';
    this.EDIT_BATCH = 'batch/edit';
    this.APPROVE_BATCHES = 'batch/approve';
    this.REJECT_BATCHES = 'batch/reject';
    this.GET_APPS_IN_BATCH = 'batch/search';

    //Applications module endpoints
    this.LIST_APPLICATIONS = 'application/listall';
    this.SEARCH_APPLICATION = '';
    this.ADD_APPLICATION = 'application/create';
    this.GET_BATCH_LIST = 'batch/batchlist';
    this.GET_CUSTOMER_LIST = 'customer/custsearch';
    this.EDIT_APPLICATION = 'application/edit';
    this.APPROVE_APPLICATIONS = 'application/approve';
    this.REJECT_APPLICATIONS = 'application/reject';
    this.GET_PAYMENTS_FOR_APPLICATION = '';

    //Payments module endpoints
    this.LIST_PAYMENTS = 'payment/listall';
    this.SEARCH_PAYMENT = '';
    this.ADD_PAYMENT = 'payment/create';
    this.EDIT_PAYMENT = 'payment/edit';
    this.APPROVE_PAYMENTS = 'payment/approve';
    this.REJECT_PAYMENTS = 'payment/reject';

    //Configurations module endpoints
    this.LIST_PARAMETERS = '';
    this.SEARCH_PARAMETER = '';
    this.ADD_PARAMETER = '';
    this.EDIT_PRAMETER = '';

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
