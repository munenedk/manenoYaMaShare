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

  $scope.batchReport = [];
  $scope.batchReportHeaders = {};
  var batchBrokerName = "";
  var batchTotalApplications = "";
  var batchTotalShares = "";
  var batchTotalAmount = "";

  //------------------Runs first once page loads---------------------------------------------
  $scope.$on('$viewContentLoaded', function () {
    $rootScope.userLoggedInAs = appService.getSessionVariable('userName');
    if (angular.equals(appService.getSessionVariable('token'), undefined)) {
      $state.go('login');
    } else {
      $rootScope.$emit("authoriseUser", {});
    }
  });


  var batchReportBody = [];
  var batchReportSurplus = [
    //Table Data
    [{text: '1', alignment: 'center'}, 'Sample value 2', 'Sample value 3', 'Sample value 4', 'Sample value 5', 'Sample value 6'],
    [{
      text: '2',
      alignment: 'center'
    }, 'Sample value 2', 'Sample value 3', 'Sample value 4', 'Sample value 5', 'Sample value 6'],
    [{
      text: '3',
      alignment: 'center'
    }, 'Sample value 2', 'Sample value 3', 'Sample value 4', 'Sample value 5', 'Sample value 6'],
    [{
      text: '4',
      alignment: 'center'
    }, 'Sample value 2', 'Sample value 3', 'Sample value 4', 'Sample value 5', 'Sample value 6'],
    [{
      text: '5',
      alignment: 'center'
    }, 'Sample value 2', 'Sample value 3', 'Sample value 4', 'Sample value 5', 'Sample value 6'],
    [{
      text: '6',
      alignment: 'center'
    }, 'Sample value 2', 'Sample value 3', 'Sample value 4', 'Sample value 5', 'Sample value 6']
  ];
  //------------------------------------Brokerage report definition--------------------------
  var brokerageReportBody = [];
  var brokerageReportDef = {
    content: [
      {text: 'KCB IPO Brokerage report', style: 'header'},
      {
        style: 'tableExample',
        color: '#444',
        table: {
          widths: ['auto', 'auto', 'auto', 'auto', 'auto'],
          headerRows: 1,
          body: [
            //Table headers
            [ {text: 'Broker Name', style: 'tableHeader', alignment: 'center'},
              {text: 'Total Batches', style: 'tableHeader', alignment: 'center'},
              {text: 'Total Applications', style: 'tableHeader', alignment: 'center'},
              {text: 'Total Shares', style: 'tableHeader', alignment: 'center'},
              {text: 'Total Amount', style: 'tableHeader', alignment: 'center'}
            ],
            //Table Data
            [{
              text: 'Dyer and Blair',
              alignment: 'center'
            }, '200', '400', '250,000', '1,000,000'],
            [{
              text: 'Old Mutual',
              alignment: 'center'
            }, '200', '400', '250,000', '1,000,000'],
            [{
              text: 'De La Ru',
              alignment: 'center'
            }, '200', '400', '250,000', '1,000,000']
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

  //------------------------------------Report handlers---------------------------------
  $scope.openBatchReportAsPDF = function () {
    var batchReportDef = {
      content: [
        {text: 'KCB IPO Batch Summary report', style: 'header'},
        {
          style: 'tableExample',
          color: '#444',
          table: {
            widths: ['auto', 'auto', 'auto', 'auto'],
            headerRows: 1,
            body: batchReportBody
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
    pdfMake.createPdf(batchReportDef).open();
    //pdfMake.createPdf(batchReportDefinition).open();
  };

  $scope.openBrokerageReportAsPDF = function () {
    pdfMake.createPdf(brokerageReportDef).open();
  };

  $scope.printBatchReport = function () {
    pdfMake.createPdf(batchReportDef).print();
  };

  $scope.printBrokerageReport = function () {
    pdfMake.createPdf(brokerageReportDef).print();
  };

  //$scope.batchReportColumns = [
  //  [{text: 'Broker Name', style: 'subheader', alignment: 'center'}, {
  //    text: 'Dyer and Blair (DB-1)',
  //    style: 'subheader',
  //    alignment: 'center',
  //    colSpan: 5
  //  }, {}, {}, {}, {}],
  //  [{text: 'No of Applications', style: 'subheader', alignment: 'center'}, {
  //    text: '20',
  //    style: 'subheader',
  //    alignment: 'center',
  //    colSpan: 5
  //  }, {}, {}, {}, {}],
  //  [{text: 'No of Shares', style: 'subheader', alignment: 'center'}, {
  //    text: '20,000',
  //    style: 'subheader',
  //    alignment: 'center',
  //    colSpan: 5
  //  }, {}, {}, {}, {}],
  //  [{text: 'Total amount', style: 'subheader', alignment: 'center'}, {
  //    text: '126,500',
  //    style: 'subheader',
  //    alignment: 'center',
  //    colSpan: 5
  //  }, {}, {}, {}, {}],
  //  //Table headers
  //  [{text: 'No', style: 'tableHeader', alignment: 'center'},
  //    {text: 'Serial No', style: 'tableHeader', alignment: 'center'},
  //    {text: 'Name', style: 'tableHeader', alignment: 'center'},
  //    {text: 'Shares', style: 'tableHeader', alignment: 'center'},
  //    {text: 'Amount', style: 'tableHeader', alignment: 'center'},
  //    {text: 'Payment Mode', style: 'tableHeader', alignment: 'center'}
  //  ]
  //];
  //
  //function buildBatchReportBody(data, columns){
  //  var body = [];
  //
  //  body.push(columns);
  //
  //  data.forEach(function(row){
  //    var dataRow = [];
  //
  //    columns.forEach(function(column){
  //      dataRow.push(row[column].toString());
  //    });
  //
  //    body.push(dataRow);
  //  });
  //  return body;
  //}
  //
  //function batchReport(data, columns){
  //  return{
  //    table:{
  //      headerRows: 1,
  //      body: buildBatchReportBody(data,columns)
  //    }
  //  };
  //}
  //
  //var batchReportDefinition = {
  //  content:[
  //    {text: 'KCB IPO Batch Summary report', style: 'header'},
  //    batchReport($scope.batchReportData,$scope.batchReportColumns)
  //  ],
  //  styles: {
  //    header: {
  //      fontSize: 18,
  //      bold: true,
  //      alignment: 'center',
  //      margin: [0, 0, 0, 10],
  //
  //    },
  //    subheader: {
  //      fontSize: 14,
  //      bold: true,
  //      margin: [0, 10, 0, 5]
  //    },
  //    tableExample: {
  //      margin: [0, 5, 0, 15]
  //    },
  //    tableHeader: {
  //      bold: true,
  //      fontSize: 14,
  //      color: 'black'
  //    }
  //  }
  //};

  //------------------------------------Generate batch report method---------------------------------
  $scope.generateBatchReport = function(search){
    var listing_payload = {};
    var listingObject = {};
    listing_payload.token = appService.getSessionVariable('token');
    listingObject.batBrkCode = {};
    listingObject.batBrkCode.brkCode = appService.getSessionVariable('brokerCode');
    listingObject.batNumber = search.batNumber;
    listing_payload.object = listingObject;

    //-----------------Get batch summary-------------------------
    appService.genericPaginatedRequest(listing_payload, appService.GET_BATCH_SUMMARY_REPORT, 0, 5).success(function (response) {
      if (response.requestStatus === true) {
        $scope.batchReport = [];
        $scope.batchReport = response.payload.content;
        $scope.batchTotalItems = response.payload.totalElements;
        $scope.batchCurrentPage = (response.payload.number + 1);
        $scope.batchNumPages = response.payload.totalPages;
        console.log($scope.batchReport);

        $scope.batchReportHeaders.brokerName = $scope.batchReport[0].appBatCode.batBrkCode.brkName;
        $scope.batchReportHeaders.totalApplications = $scope.batchReport.length;
        $scope.batchReportHeaders.totalShares = $scope.batchReport[0].appBatCode.batTotalShares;
        $scope.batchReportHeaders.totalAmount = response.totalAmountBatch;

        batchBrokerName = $scope.batchReport[0].appBatCode.batBrkCode.brkName;
        batchTotalApplications = String($scope.batchReport.length);
        batchTotalShares = String($scope.batchReport[0].appBatCode.batTotalShares);
        batchTotalAmount = String(response.totalAmountBatch);
        batchReportBody = [
          [{text: 'Broker Name', style: 'subheader', alignment: 'center'}, {
            text: batchBrokerName,
            style: 'subheader',
            alignment: 'center',
            colSpan: 3
          }, {}, {}],
          [{text: 'No of Applications', style: 'subheader', alignment: 'center'}, {
            text: batchTotalApplications,
            style: 'subheader',
            alignment: 'center',
            colSpan: 3
          }, {}, {}],
          [{text: 'No of Shares', style: 'subheader', alignment: 'center'}, {
            text: batchTotalShares,
            style: 'subheader',
            alignment: 'center',
            colSpan: 3
          }, {}, {}],
          [{text: 'Total amount', style: 'subheader', alignment: 'center'}, {
            text: batchTotalAmount,
            style: 'subheader',
            alignment: 'center',
            colSpan: 3
          }, {}, {}],
          //Table headers
          [ {text: 'Serial No', style: 'tableHeader', alignment: 'center'},
            {text: 'Name', style: 'tableHeader', alignment: 'center'},
            {text: 'Shares', style: 'tableHeader', alignment: 'center'},
            {text: 'Applicant Category', style: 'tableHeader', alignment: 'center'}
          ]
        ];

        for(var i in $scope.batchReport){
          var row = [];

          if($scope.batchReport[i].appCusPalCode.cusApplicantCategory == 'INDIVIDUAL'){
            row = [{text: String($scope.batchReport[i].appCusPalCode.cusFormSerialNo), alignment: 'center'},
              String($scope.batchReport[i].appCusPalCode.cusSurname +" "+$scope.batchReport[i].appCusPalCode.cusOtherNames),
              String($scope.batchReport[i].appSharesApplied),
              String($scope.batchReport[i].appCusPalCode.cusApplicantCategory)];
          } else if($scope.batchReport[i].appCusPalCode.cusApplicantCategory == 'JOINT'){
            row = [{text: String($scope.batchReport[i].appCusPalCode.cusFormSerialNo), alignment: 'center'},
              String($scope.batchReport[i].appCusPalCode.cusJointSurname +" "+$scope.batchReport[i].appCusPalCode.cusJointOthernames),
              String($scope.batchReport[i].appSharesApplied),
              String($scope.batchReport[i].appCusPalCode.cusApplicantCategory)];
          } else if($scope.batchReport[i].appCusPalCode.cusApplicantCategory == 'COMPANY'){
            row = [{text: String($scope.batchReport[i].appCusPalCode.cusFormSerialNo), alignment: 'center'},
              String($scope.batchReport[i].appCusPalCode.cusCompanyName),
              String($scope.batchReport[i].appSharesApplied),
              String($scope.batchReport[i].appCusPalCode.cusApplicantCategory)];
          } else if($scope.batchReport[i].appCusPalCode.cusApplicantCategory == 'NOMINEE'){
            row = [{text: String($scope.batchReport[i].appCusPalCode.cusFormSerialNo), alignment: 'center'},
              String($scope.batchReport[i].appCusPalCode.cusNomineeName),
              String($scope.batchReport[i].appSharesApplied),
              String($scope.batchReport[i].appCusPalCode.cusApplicantCategory)];
          }
          batchReportBody.push(row);
        }
      } else {
        appService.showToast(response.message);
        $rootScope.$emit("sessionTimeOut", {});
      }
    }).error(function (response) {
      appService.showToast(response.message);
    });
  };

  //------------------------------------Generate brokerage report method---------------------------------
  $scope.generateBrokerageReport = function(){
    var listing_payload = {};
    var listingObject = {};
    listing_payload.token = appService.getSessionVariable('token');
    listingObject.batBrkCode = {};
    listingObject.batBrkCode.brkCode = appService.getSessionVariable('brokerCode');
    listing_payload.object = listingObject;

    //-----------------Get batch summary-------------------------
    appService.genericPaginatedRequest(listing_payload, appService.GET_BROKERAGE_REPORT, 0, 5).success(function (response) {
      if (response.requestStatus === true) {
        $scope.batchReport = [];
        $scope.batchReport = response.payload.content;
        $scope.batchTotalItems = response.payload.totalElements;
        $scope.batchCurrentPage = (response.payload.number + 1);
        $scope.batchNumPages = response.payload.totalPages;
        console.log($scope.batchReport);
      } else {
        appService.showToast(response.message);
        $rootScope.$emit("sessionTimeOut", {});
      }
    }).error(function (response) {
      appService.showToast(response.message);
    });
  };

}); //End of controller
