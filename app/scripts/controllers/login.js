//jshint ignore:start
// jscs:disable
'use strict';

/**
 * @ngdoc function
 * @name ipoApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the ipoApp
 */
app.controller('LoginCtrl', function ($rootScope, $scope, $mdSidenav, $state, appService) {
    //User object
    $scope.user = {};

    //Menus to be disabled by default until user logs in
    $rootScope.showNav = false;
    $rootScope.showLogin = false;

    //Shows and Hides the side nav
    $scope.toggleNav = function () {
        $mdSidenav('left').toggle();
    };

    //----------------Enter Key Handler-------------------------------
    $scope.enterKeyPressed = function (event, user) {
        if (event.which === 13 || event.keyCode === 13) {
            $scope.authenticateUser(user);
        }
    };

    //----------------Login function-----------------------------------
    $scope.authenticateUser = function (user) {
        appService.genericUnpaginatedRequest(user, appService.LOGIN).success(function (response) {
            if (angular.equals(response.loginStatus, true)) {
                //Handle first time login
                if(angular.equals(response.usr_status,4)){
                    appService.setSessionVariable('userEmail', response.usr_email);
                    $state.go('updatePassword');
                    //Handle active users
                } else if(angular.equals(response.usr_status,1)){
                    appService.setSessionVariable('token',response.sessID);
                    appService.setSessionVariable('userName', response.names);
                    appService.setSessionVariable('userID', response.userID);
                    appService.showToast("Login "+response.loginMessage);
                    $state.go('viewUsers');
                } else{
                    $state.go('login');
                    appService.showToast("Your account is not authorised to log in. Contact your system administrator");
                }
            } else {
                appService.showToast(response.loginMessage);
            }
        }).error(function (response) {
            appService.showToast("Error 500. Please try again later");
            console.log(response)
        });
    };

    $scope.logout = function(){
        var payload = {};
        payload.token = appService.getSessionVariable('token');
        payload.object = null;

        appService.genericUnpaginatedRequest(payload, appService.LOGOUT).success(function (response) {
            if (angular.equals(response.loginStatus, true)) {
                $rootScope.showNav = false;
                $rootScope.showLogin = false;
                appService.showToast(response.loginMessage);
                appService.clearSessionStorage();
                location.reload();
                $state.go('login');
            } else {
                appService.showToast(response.loginMessage);
            }
        }).error(function (response) {
            appService.showToast("Error 500. Please try again later");
        });
    };

    $rootScope.$on("sessionTimeOut", function(){
        $scope.logout();
    });

});
