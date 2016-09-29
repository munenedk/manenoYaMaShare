//jshint ignore:start
// jscs:disable
'use strict';

/**
 * @ngdoc function
 * @name ipoApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the ipoApp
 * @author munenedk-pc
 */
app.controller('LoginCtrl', function ($rootScope, $scope, $mdSidenav, $state, appService) {
  //User object
  $scope.user = {};

  //Role management variables
  $rootScope.showNav = false;
  $rootScope.showLogin = false;
  $rootScope.showUsers = false;
  $rootScope.disableUserInputter = true;
  $rootScope.disableUserAuthoriser = true;
  $rootScope.showBrokers = false;
  $rootScope.disableBrokersInputter = true;
  $rootScope.disableBrokersAuthoriser = true;
  $rootScope.showApplications = false;
  $rootScope.disableApplicationsInputter = true;
  $rootScope.disableApplicationsAuthoriser =  true;
  $rootScope.disableRegistrarButtons = true;
  $rootScope.showConfigs = false;
  $rootScope.disableConfigsInputter = true;
  $rootScope.disableConfigsAuthoriser = true;
  $rootScope.showReports = false;
  $rootScope.disableBrokerageReport = true;
  $rootScope.disableManagementReport = true;

  appService.setSessionVariable('userStatus',1);

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
        if (angular.equals(response.usr_status, 4)) {
          appService.setSessionVariable('userStatus',4);
          appService.setSessionVariable('userEmail', response.usr_email);
          $state.go('updatePassword');
          //Handle active users
        } else if (angular.equals(response.usr_status, 1)) {
          appService.setSessionVariable('token', response.sessID);
          appService.setSessionVariable('userName', response.names);
          appService.setSessionVariable('userID', response.userID);
          appService.setSessionVariable('brokerCode', response.batCode.brkCode);
          appService.setSessionVariable('brokerStatus', response.batCode.brkStatus);
          appService.setSessionVariable('permissions', response.permissions);
          appService.showToast("Login " + response.loginMessage);
          $state.go('dashboard');
        } else {
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

  //----------------Logout function-----------------------------------
  $scope.logout = function () {
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

  //----------------Authorise function-----------------------------------
  $scope.authoriseUser = function(){
    $rootScope.showNav = true;
    $rootScope.showLogin = true;
    $rootScope.userLoggedInAs = appService.getSessionVariable('userName');

    var permissions  = appService.getSessionVariable('permissions');

    if(permissions.indexOf('Users View') > -1){
      $rootScope.showUsers = true;
      if(permissions.indexOf('User Inputer') > -1){
        $rootScope.disableUserInputter = false;
      }
      if(permissions.indexOf('User Authoriser') > -1){
        $rootScope.disableUserAuthoriser = false;
      }
    }

    if(permissions.indexOf('Brokers View') > -1){
      $rootScope.showBrokers = true;
      if(permissions.indexOf('Broker Inputter') > -1){
        $rootScope.disableBrokersInputter = false;
      }
      if(permissions.indexOf('Broker Authoriser') > -1){
        $rootScope.disableBrokersAuthoriser = false;
      }
    }

    if(permissions.indexOf('Applications View') > -1){
      $rootScope.showApplications = true;
      if(permissions.indexOf('Application Inputter') > -1){
        $rootScope.disableApplicationsInputter = false;
      }
      if(permissions.indexOf('Application Authoriser') > -1){
        $rootScope.disableApplicationsAuthoriser =  false;
      }
    }

    if(permissions.indexOf('Param View') > -1){
      $rootScope.showConfigs = true;
      if(permissions.indexOf('Param Inputter') > -1){
        $rootScope.disableConfigsInputter = false;
      }
      if(permissions.indexOf('Param Authoriser') > -1){
        $rootScope.disableApplicationsAuthoriser =  false;
      }
    }

    if(permissions.indexOf('Reports View') > -1){
      $rootScope.showReports = true;
    }

    if(permissions.indexOf('Registrar') > -1){
      $rootScope.showApplications = true;
      $rootScope.disableRegistrarButtons = false;
      //$rootScope.disableApplicationsInputter = false;
      //$rootScope.disableApplicationsAuthoriser =  false;
    }

    if(permissions.indexOf('Administrator') > -1){
      $rootScope.showUsers = true;
      $rootScope.disableUserInputter = false;
      $rootScope.disableUserAuthoriser = false;
      $rootScope.showBrokers = true;
      $rootScope.disableBrokersInputter = false;
      $rootScope.disableBrokersAuthoriser = false;
      $rootScope.showApplications = true;
      $rootScope.disableApplicationsInputter = false;
      $rootScope.disableApplicationsAuthoriser =  false;
      $rootScope.disableRegistrarButtons = false;
      $rootScope.showConfigs = true;
      $rootScope.disableConfigsInputter = false;
      $rootScope.disableConfigsAuthoriser = false;
      $rootScope.showReports = true;
      $rootScope.disableBrokerageReport = false;
      $rootScope.disableManagementReport = false;
    }
  };

  //----------------Event Listeners-----------------------------------
  $rootScope.$on("sessionTimeOut", function () {
    $scope.logout();
  });

  $rootScope.$on("authoriseUser", function () {
    $scope.authoriseUser();
  });

});
