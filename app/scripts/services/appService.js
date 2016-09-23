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
    //172.17.74.91
    //172.17.72.150
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
    this.LIST_ROLES = 'roles/listall';
    this.LIST_PERMISSIONS = 'permission/listall';
    this.ADD_ROLE = 'roles/create';
    this.EDIT_ROLE = 'roles/edit';
    this.ADD_PERMISSION = 'permission/create';
    this.GET_ROLE_LIST = 'roles/listallRoles';
    this.EDIT_PERMISSION = 'permission/edit';
    this.GET_ASSIGNED_ROLES = 'userRoles/listall';
    this.GET_AVAILABLE_ROLES = 'roles/getRoles';
    this.APPROVE_ROLE = 'roles/approve';
    this.REJECT_ROLE = 'roles/reject';
    this.APPROVE_PERMISSION = 'permission/approve';
    this.REJECT_PERMISSION = 'permission/reject';
    this.GRANT_ROLE = 'userRoles/create';
    this.REVOKE_ROLE = 'userRoles/remove';
    this.APPROVE_ASSIGNMENTS = 'userRoles/approve';
    this.REJECT_ASSIGNMENTS = 'userRoles/reject';

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
    this.SEARCH_BATCH = 'batch/search';
    this.ADD_BATCH = 'batch/create';
    this.EDIT_BATCH = 'batch/edit';
    this.APPROVE_BATCHES = 'batch/approve';
    this.REJECT_BATCHES = 'batch/reject';
    this.GET_APPS_IN_BATCH = 'application/search';

    //Applications module endpoints
    this.LIST_APPLICATIONS = 'application/listall';
    this.SEARCH_APPLICATION = 'application/searchApp';
    this.ADD_APPLICATION = 'application/create';
    this.GET_BATCH_LIST = 'batch/batchlist';
    //this.GET_CUSTOMER_LIST = 'customer/custsearch';
    this.EDIT_APPLICATION = 'application/edit';
    this.APPROVE_APPLICATIONS = 'application/approve';
    this.REJECT_APPLICATIONS = 'application/reject';
    this.GET_PAYMENTS_FOR_APPLICATION = 'payment/search';

    //Payments module endpoints
    this.LIST_PAYMENTS = 'payment/listall';
    this.SEARCH_PAYMENT = 'payment/searchPay';
    this.ADD_PAYMENT = 'payment/create';
    this.EDIT_PAYMENT = 'payment/edit';
    this.APPROVE_PAYMENTS = 'payment/approve';
    this.REJECT_PAYMENTS = 'payment/reject';
    this.GET_ACCOUNT_LIST = '';
    this.GET_BANK_CODES = 'bank/listall';

    //Configurations module endpoints
    this.LIST_PARAMETERS = 'params/listall';
    this.SEARCH_PARAMETER = 'params/search';
    this.ADD_PARAMETER = 'params/create';
    this.EDIT_PRAMETER = 'params/edit';
    this.APPROVE_PARAMETERS = 'params/approve';
    this.REJECT_PARAMETERS = 'params/reject';

    //Refunds module endpoints
    this.LIST_REFUNDS = 'refund/listall';
    this.SEARCH_REFUND = '';
    this.ADD_REFUND = 'refund/create';
    this.EDIT_REFUND = 'refund/edit';
    this.APPROVE_REFUND = 'refund/approve';
    this.REJECT_REFUND = 'refund/reject';
    this.GET_PAY_CODE_LIST = 'payment/searchPayCode';
    this.GET_APP_CODE_LIST = 'application/searchAppCode';

    //Receiving module endpoints
    this.ADD_RECEIVED = 'recieving/create';
    //this.LIST_RECEIVED = 'recieving/listall';
    this.LIST_RECEIVED = 'batch/listall';
    this.SEARCH_RECEIVED = '';
    this.APPROVE_RECEIVED = '';
    this.REJECT_RECEIVED = '';

    //Reports module
    this.GET_BATCH_SUMMARY_REPORT = 'reports/batchReport';

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

    this.deleteSessionVariable = function (key) {
        if (key !== null) {
            delete $sessionStorage[key];
        }
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
