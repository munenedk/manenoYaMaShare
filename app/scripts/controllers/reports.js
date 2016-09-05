//jshint ignore:start
// jscs:disable
'use strict';

/**
 * @ngdoc function
 * @name ipoApp.controller:ReportsCtrl
 * @description
 * # ReportsCtrl
 * Controller of the ipoApp
 */
app.controller('ReportsCtrl', function ($rootScope, $scope, $mdDialog, $state, appService) {
  //------------------Setup variables-------------------------------------------
  $rootScope.userLoggedInAs = "";
  $scope.maxSize = 5; //Pagination component size

  //Batch Pagination variables
  $scope.batchTotalItems = 1;
  $scope.batchCurrentPage = 1;
  $scope.batchItemsPerPage = 5;
  $scope.batchNumPages = 1;

  //Brokerage Pagination variables
  $scope.brokerageTotalItems = 1;
  $scope.brokerageCurrentPage = 1;
  $scope.brokerageItemsPerPage = 5;
  $scope.brokerageNumPages = 1;


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

  //------------------------------------Batch report definition---------------------------------
  var batchReportDef = {
    content: [
      { text: 'KCB IPO Batch Summary report', style: 'header' },
      {
        style: 'tableExample',
        color: '#444',
        table: {
          widths: [ 'auto', 'auto', 'auto','auto', 'auto', 'auto' ],
          headerRows: 1,
          body: [
            //Report titles
            [{ text: 'Broker Name', style: 'subheader', alignment: 'center' }, {text: 'Dyer and Blair (DB-1)',style: 'subheader', alignment: 'center',colSpan:5}, {},{},{},{}],
            [{ text: 'No of Applications', style: 'subheader', alignment: 'center' }, {text: '20',style: 'subheader', alignment: 'center',colSpan:5}, {},{},{},{}],
            [{ text: 'No of Shares', style: 'subheader', alignment: 'center' }, {text: '20,000',style: 'subheader', alignment: 'center',colSpan:5}, {},{},{},{}],
            [{ text: 'Total amount', style: 'subheader', alignment: 'center' }, {text: '126,500',style: 'subheader', alignment: 'center',colSpan:5}, {},{},{},{}],
            //Table headers
            [{ text: 'No', style: 'tableHeader', alignment: 'center' },
              { text: 'Serial No', style: 'tableHeader', alignment: 'center' },
              { text: 'Name', style: 'tableHeader', alignment: 'center' },
              { text: 'Shares', style: 'tableHeader', alignment: 'center' },
              { text: 'Amount', style: 'tableHeader', alignment: 'center' },
              { text: 'Payment Mode', style: 'tableHeader', alignment: 'center' }
            ],
            //Table Data
            [{text:'1', alignment: 'center'}, 'Sample value 2', 'Sample value 3','Sample value 4', 'Sample value 5', 'Sample value 6'],
            [{text:'2', alignment: 'center'}, 'Sample value 2', 'Sample value 3','Sample value 4', 'Sample value 5', 'Sample value 6'],
            [{text:'3', alignment: 'center'}, 'Sample value 2', 'Sample value 3','Sample value 4', 'Sample value 5', 'Sample value 6'],
            [{text:'4', alignment: 'center'}, 'Sample value 2', 'Sample value 3','Sample value 4', 'Sample value 5', 'Sample value 6'],
            [{text:'5', alignment: 'center'}, 'Sample value 2', 'Sample value 3','Sample value 4', 'Sample value 5', 'Sample value 6'],
            [{text:'6', alignment: 'center'}, 'Sample value 2', 'Sample value 3','Sample value 4', 'Sample value 5', 'Sample value 6']
          ]
        }
      }
    ],
    //Table Styles
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 10],

      },
      subheader: {
        fontSize: 14,
        bold: true,
        margin: [0, 10, 0, 5]
      },
      tableExample: {
        margin: [0, 5, 0, 15]
      },
      tableHeader: {
        bold: true,
        fontSize: 14,
        color: 'black'
      }
    }
  };

  var brokerageReportDef = {
    content: [
      { text: 'KCB IPO Brokerage report', style: 'header' },
      {
        style: 'tableExample',
        color: '#444',
        table: {
          widths: [ 'auto', 'auto', 'auto','auto', 'auto', 'auto' ],
          headerRows: 1,
          body: [
            //Report titles
            [{ text: 'Broker Name', style: 'subheader', alignment: 'center' }, {text: 'Dyer and Blair (DB-1)',style: 'subheader', alignment: 'center',colSpan:5}, {},{},{},{}],
            [{ text: 'Report for dates', style: 'subheader', alignment: 'center' }, {text: '01-Mar-2016 to 05-Aug-2016',style: 'subheader', alignment: 'center',colSpan:5}, {},{},{},{}],
            [{ text: 'Total Applications', style: 'subheader', alignment: 'center' }, {text: '20',style: 'subheader', alignment: 'center',colSpan:5}, {},{},{},{}],
            [{ text: 'No of Shares', style: 'subheader', alignment: 'center' }, {text: '20,000',style: 'subheader', alignment: 'center',colSpan:5}, {},{},{},{}],
            [{ text: 'Total amount', style: 'subheader', alignment: 'center' }, {text: '126,500',style: 'subheader', alignment: 'center',colSpan:5}, {},{},{},{}],
            //Table headers
            [{ text: 'No', style: 'tableHeader', alignment: 'center' },
              { text: 'Serial No', style: 'tableHeader', alignment: 'center' },
              { text: 'Name', style: 'tableHeader', alignment: 'center' },
              { text: 'Shares', style: 'tableHeader', alignment: 'center' },
              { text: 'Amount', style: 'tableHeader', alignment: 'center' },
              { text: 'Payment Mode', style: 'tableHeader', alignment: 'center' }
            ],
            //Table Data
            [{text:'1', alignment: 'center'}, 'Sample value 2', 'Sample value 3','Sample value 4', 'Sample value 5', 'Sample value 6'],
            [{text:'2', alignment: 'center'}, 'Sample value 2', 'Sample value 3','Sample value 4', 'Sample value 5', 'Sample value 6'],
            [{text:'3', alignment: 'center'}, 'Sample value 2', 'Sample value 3','Sample value 4', 'Sample value 5', 'Sample value 6'],
            [{text:'4', alignment: 'center'}, 'Sample value 2', 'Sample value 3','Sample value 4', 'Sample value 5', 'Sample value 6'],
            [{text:'5', alignment: 'center'}, 'Sample value 2', 'Sample value 3','Sample value 4', 'Sample value 5', 'Sample value 6'],
            [{text:'6', alignment: 'center'}, 'Sample value 2', 'Sample value 3','Sample value 4', 'Sample value 5', 'Sample value 6']
          ]
        }
      }
    ],
    //Table Styles
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 10],

      },
      subheader: {
        fontSize: 14,
        bold: true,
        margin: [0, 10, 0, 5]
      },
      tableExample: {
        margin: [0, 5, 0, 15]
      },
      tableHeader: {
        bold: true,
        fontSize: 14,
        color: 'black'
      }
    }
  };

  $scope.openBatchReportAsPDF = function(){
    pdfMake.createPdf(batchReportDef).open();
  };

  $scope.openBrokerageReportAsPDF = function(){
    pdfMake.createPdf(brokerageReportDef).open();
  };

  $scope.printBatchReport =  function(){
     pdfMake.createPdf(batchReportDef).print();
  };

  $scope.printBrokerageReport =  function(){
    pdfMake.createPdf(brokerageReportDef).print();
  };
});
