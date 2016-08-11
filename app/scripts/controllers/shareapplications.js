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
    $scope.usersTotalItems = 1;
    $scope.usersCurrentPage = 1;
    $scope.usersItemsPerPage = 5;
    $scope.usersNumPages = 1;

    $scope.rolesTotalItems = 1;
    $scope.rolesCurrentPage = 1;
    $scope.rolesItemsPerPage = 5;
    $scope.rolesNumPages = 1;

    $scope.permissionsTotalItems = 1;
    $scope.permissionsCurrentPage = 1;
    $scope.permissionsItemsPerPage = 5;
    $scope.permissionsNumPages = 1;

    $scope.assignedRolesTotalItems = 1;
    $scope.assignedRolesCurrentPage = 1;
    $scope.assignedRolesItemsPerPage = 5;
    $scope.assignedRolesNumPages = 1;

    $scope.availableRolesTotalItems = 1;
    $scope.availableRolesCurrentPage = 1;
    $scope.availableRolesItemsPerPage = 5;
    $scope.availableRolesNumPages = 1;

    $scope.maxSize = 5; //Pagination component size

    $rootScope.userLoggedInAs = "";

    //------------------Runs first once page loads---------------------------------------------
    $scope.$on('$viewContentLoaded', function () {

        $rootScope.showNav = true;
        $rootScope.showLogin = true;
        //if(angular.equals(appService.getCookieContent('userLoggedInAs'),undefined)) {
        //    $state.go('login');
        //} else{
        //    $rootScope.showNav = true;
        //    $rootScope.showLogin = true;
        //    $rootScope.userLoggedInAs = appService.getCookieContent('userLoggedInAs');
        $scope.populateAllTables();
        //    appService.showHideActionControls($sessionStorage.institutionRoleAssigned);
        //}
    });

    //-----------------------------Get Users, Roles, Permissions-------------------------------
    $scope.users = [];
    $scope.roles = [];
    $scope.permissions = [];

    $scope.populateAllTables = function () {
        $scope.users = [{
            name: 'John Doe',
            email: 'Jdoe@kcb.co.ke',
            broker: 'Dyer and Blair',
            lastLogin: '08-Aug-16',
            status: '1'
        }];

        $scope.roles = [{
            name: 'Share Maker',
            description: 'Creates share applications',
            status: '1'
        }];

        $scope.permissions = [{
            name: 'CR on Shares',
            description: 'Creates and views shares',
            status: '1'
        }];
    };
    //----------------------------- End of Get Users, Roles, Permissions------------------------


});
