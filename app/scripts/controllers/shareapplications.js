//jshint ignore:start
// jscs:disable
'use strict';

/**
 * @ngdoc function
 * @name ipoApp.controller:ShareapplicationsCtrl
 * @description
 * # ShareapplicationsCtrl
 * Controller of the ipoApp
 */
app.controller('ShareapplicationsCtrl', function ($rootScope, $scope, $mdDialog, $state, appService) {
//------------------Setup variables------------------------------------------------------
    $scope.batchTotalItems = 1;
    $scope.batchCurrentPage = 1;
    $scope.batchItemsPerPage = 5;
    $scope.batchNumPages = 1;

    $scope.applicationTotalItems = 1;
    $scope.applicationCurrentPage = 1;
    $scope.applicationItemsPerPage = 5;
    $scope.applicationNumPages = 1;

    $scope.paymentsTotalItems = 1;
    $scope.paymentsCurrentPage = 1;
    $scope.paymentsItemsPerPage = 5;
    $scope.paymentsNumPages = 1;

    $scope.dividendsRolesTotalItems = 1;
    $scope.dividendsRolesCurrentPage = 1;
    $scope.dividendsRolesItemsPerPage = 5;
    $scope.dividendsRolesNumPages = 1;

    $scope.maxSize = 5; //Pagination component size

    $rootScope.userLoggedInAs = "";

    $scope.selectedTab = 0;

    //------------------Runs first once page loads---------------------------------------------
    $scope.$on('$viewContentLoaded', function () {
        $rootScope.userLoggedInAs = appService.getSessionVariable('userName');
        if (angular.equals(appService.getSessionVariable('token'), undefined)) {
            $state.go('login');
        } else {
            $rootScope.showNav = true;
            $rootScope.showLogin = true;
            $rootScope.userLoggedInAs = appService.getSessionVariable('userName');
            $scope.populateAllTables();
        }
    });

    //-----------------------------Get Batches, Applications, Payments, Dividends---------------------
    $scope.batches = [];
    $scope.applications = [];
    $scope.payments = [];
    $scope.dividends = [];

    $scope.populateAllTables = function () {
        $scope.batches = [{
            batCode: '10001',
            batCreateDate: '15-Aug-2016',
            batTotalShares: '20000',
            batStatus: '1'
        }];
    };
    //----------------------------- End of Get Users, Roles, Permissions------------------------


});
