//jshint ignore:start
//jscs:disable
'use strict';

/**
 * @ngdoc function
 * @name ipoApp.controller:ResetpasswordCtrl
 * @description
 * # ResetpasswordCtrl
 * Controller of the ipoApp
 */
app.controller('ResetpasswordCtrl', function ($rootScope, $scope, $state, appService) {
    //Password object
    $scope.password = {};

    //------------------Runs first once page loads---------------------------------------------
    $scope.$on('$viewContentLoaded', function () {
        $rootScope.showNav = false;
        $rootScope.showLogin = false;
        $scope.password.usrEmail = appService.getSessionVariable('userEmail');
    });

    //----------------Enter Key Handler-------------------------------
    $scope.resetPassEnterKeyPressed = function (event, password) {
        if (event.which === 13 || event.keyCode === 13) {
            $scope.resetPassword(password);
        }
    };

    //----------------Reset password function-----------------------------
    $scope.resetPassword = function (password) {
        if (!angular.equals(password.usr_password, password.confirm)) {
            appService.showToast("The new passwords do not match. Please enter them again");
        } else {
            appService.genericUnpaginatedRequest(password, appService.UPDATE_PASSWORD).success(function (response) {
                if (angular.equals(response.status, true)) {
                    appService.showToast(response.message);
                    appService.clearSessionStorage();
                    $state.go('login');
                } else {
                    appService.showToast(response.message);
                }
            }).error(function (response) {
                appService.showToast("Error 500. Please try again later");
                console.log(response)
            });
        }
    };

}); //End of controller
