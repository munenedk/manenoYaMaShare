//jshint ignore:start
// jscs:disable
'use strict';

/**
 * @ngdoc function
 * @name ipoApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the ipoApp
 * @author munenedk-pc
 */
app.controller('DashboardCtrl', function ($rootScope, $scope, $mdDialog, $state, appService) {
    //------------------Setup variables-------------------------------------------
    $rootScope.userLoggedInAs = "";

    //------------------Runs first once page loads---------------------------------------------
    $scope.$on('$viewContentLoaded', function () {
        $rootScope.userLoggedInAs = appService.getSessionVariable('userName');
        if (angular.equals(appService.getSessionVariable('token'), undefined)) {
            $state.go('login');
        } else {
            $rootScope.showNav = true;
            $rootScope.showLogin = true;
            $rootScope.userLoggedInAs = appService.getSessionVariable('userName');
        }
    });

    //-----------------------------------Line chart options and data--------------------------
    $scope.lineChartOptions = {
        chart: {
            type: 'lineChart',
            height: 250,
            margin: {
                top: 5,
                right: 20,
                bottom: 40,
                left: 55
            },
            x: function (d) {
                return d.x;
            },
            y: function (d) {
                return d.y;
            },
            useInteractiveGuideline: true,
            dispatch: {
                stateChange: function (e) {
                    console.log("stateChange");
                },
                changeState: function (e) {
                    console.log("changeState");
                },
                tooltipShow: function (e) {
                    console.log("tooltipShow");
                },
                tooltipHide: function (e) {
                    console.log("tooltipHide");
                }
            },
            xAxis: {
                axisLabel: 'Time (ms)'
            },
            yAxis: {
                axisLabel: 'Voltage (v)',
                tickFormat: function (d) {
                    return d3.format('.02f')(d);
                },
                axisLabelDistance: -10
            },
            callback: function (chart) {
                //console.log("!!! lineChart callback !!!");
            }
        },
        title: {
            enable: true,
            text: 'Title for Line Chart'
        },
        subtitle: {
            enable: true,
            text: 'Subtitle for simple line chart.',
            css: {
                'text-align': 'center',
                'margin': '10px 13px 0px 7px'
            }
        },
        caption: {
            enable: true,
            html: '<b>Figure 1.</b> Lorem ipsum dolor sit amet, at eam blandit sadipscing.',
            css: {
                'text-align': 'justify',
                'margin': '10px 13px 0px 7px'
            }
        }
    };

    $scope.lineChartData = sinAndCos();

    /*Random Data Generator */
    function sinAndCos() {
        var sin = [], sin2 = [],
            cos = [];

        //Data is represented as an array of {x,y} pairs.
        for (var i = 0; i < 100; i++) {
            sin.push({x: i, y: Math.sin(i / 10)});
            sin2.push({x: i, y: i % 10 == 5 ? null : Math.sin(i / 10) * 0.25 + 0.5});
            cos.push({x: i, y: .5 * Math.cos(i / 10 + 2) + Math.random() / 10});
        }

        //Line chart data should be sent as an array of series objects.
        return [
            {
                values: sin,      //values - represents the array of {x,y} data points
                key: 'Sine Wave', //key  - the name of the series.
                color: '#ff7f0e'  //color - optional: choose your own line color.
            },
            {
                values: cos,
                key: 'Cosine Wave',
                color: '#2ca02c'
            },
            {
                values: sin2,
                key: 'Another sine wave',
                color: '#7777ff',
                area: true      //area - set to true if you want this line to turn into a filled area chart.
            }
        ];
    };

    //-----------------------------------Bar chart options and data--------------------------
    $scope.barChartOptions = {
        chart: {
            type: 'discreteBarChart',
            height: 350,
            margin: {
                top: 5,
                right: 20,
                bottom: 60,
                left: 55
            },
            x: function (d) {
                return d.label;
            },
            y: function (d) {
                return d.value;
            },
            showValues: true,
            valueFormat: function (d) {
                return d3.format(',.4f')(d);
            },
            transitionDuration: 500,
            xAxis: {
                axisLabel: 'X Axis'
            },
            yAxis: {
                axisLabel: 'Y Axis',
                axisLabelDistance: 30
            }
        }
    };

    $scope.barChartData = [
        {
            key: "Cumulative Return",
            values: [
                {"label": "A", "value": -29.765957771107},
                {"label": "B", "value": 0},
                {"label": "C", "value": 32.807804682612},
                {"label": "D", "value": 196.45946739256},
                {"label": "E", "value": 0.19434030906893},
                {"label": "F", "value": -98.079782601442},
                {"label": "G", "value": -13.925743130903},
                {"label": "H", "value": -5.1387322875705}
            ]
        }
    ];

});
