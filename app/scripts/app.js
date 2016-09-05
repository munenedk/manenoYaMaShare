//jshint ignore:start
//jscs:disable
'use strict';

/**
 * @ngdoc overview
 * @name ipoApp
 * @description
 * # ipoApp
 *
 * Main module of the application.
 * @author munenedk-pc
 */
var app = angular
  .module('ipoApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngMaterial',
    'ui.router',
    'ngStorage',
    'angularUtils.directives.dirPagination',
    'nvd3'
  ])
  .config(function ($stateProvider, $urlRouterProvider, $mdThemingProvider, $mdDateLocaleProvider) {
    //Default Date formatting - for date pickers if needed
    $mdDateLocaleProvider.formatDate = function (date) {
      return moment(date).format('DD-MM-YY');
    };

    //Define KCB Theme
    var kcbGreenMap = $mdThemingProvider.extendPalette('light-green', {'500': '8CC63F'});
    var kcbBlueMap = $mdThemingProvider.extendPalette('light-blue', {
      'A200': '00456A', //Accent - primary Color
      // 'A100':'00456A', //hue-1
      'contrastDefaultColor': 'light'
    });

    $mdThemingProvider.definePalette('kcbGreen', kcbGreenMap);
    $mdThemingProvider.definePalette('kcbBlue', kcbBlueMap);

    //Set KCB Theme
    $mdThemingProvider.theme('default').primaryPalette('kcbGreen').accentPalette('kcbBlue');

    //Redirect to login for unmatched URLs
    $urlRouterProvider.otherwise("/login");

    //States
    $stateProvider
      .state('login', {
        url: "/login",
        controller: 'LoginCtrl',
        templateUrl: "views/login.html"
      })
      .state('updatePassword', {
        url: "/updatePassword",
        controller: 'ResetpasswordCtrl',
        templateUrl: "views/passwordReset.html"
      })
      .state('viewUsers', {
        url: "/users",
        controller: 'UsermanagementCtrl',
        templateUrl: "views/users/userManagement.html"
      })
      .state('viewShareApplications', {
        url: "/shares",
        controller: 'ShareapplicationsCtrl',
        templateUrl: "views/shares/shareApplications.html"
      })
      .state('parameters', {
        url: "/parameters",
        controller: 'ParametersCtrl',
        templateUrl: "views/parameters/parameters.html"
      })
      .state('dashboard', {
        url: "/dashboard",
        controller: 'DashboardCtrl',
        templateUrl: "views/dashboard.html"
      })
      .state('reports', {
        url: "/reports",
        controller: 'ReportsCtrl',
        templateUrl: "views/reports/reports.html"
      })
      .state('brokers', {
        url: "/brokers",
        controller: 'BrokersCtrl',
        templateUrl: "views/brokers/brokers.html"
      });

  });
