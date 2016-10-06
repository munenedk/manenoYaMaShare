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
  $scope.brokerageReport = [];
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

  //------------------------------------Report definitions--------------------------
  var batchReportBody = [];
  var brokerageReportBody = [
      //Table headers
      [ {text: 'Broker Name', style: 'tableHeader', alignment: 'center'},
        {text: 'No of Batches', style: 'tableHeader', alignment: 'center'},
        {text: 'No of Applications', style: 'tableHeader', alignment: 'center'},
        {text: 'Total Shares', style: 'tableHeader', alignment: 'center'},
        {text: 'Total Amount', style: 'tableHeader', alignment: 'center'}
      ]
  ];

  //------------------------------------Report handlers---------------------------------
  $scope.openBatchReportAsPDF = function () {
    var batchReportDef = {
      content: [
        {text: 'KCB IPO Batch Summary report', style: 'header'},
        {
          style: 'tableExample',
          color: '#444',
          table: {
            widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
            headerRows: 1,
            body: batchReportBody
          }
        }
      ],
      //Table Styles
      styles: {
        header: {
          fontSize: 16,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 10]

        },
        subheader: {
          fontSize: 12,
          bold: true,
          margin: [0, 10, 0, 5]
        },
        tableExample: {
          margin: [0, 5, 0, 15]
        },
        tableHeader: {
          bold: true,
          fontSize: 12,
          color: 'black'
        }
      }
    };
    pdfMake.createPdf(batchReportDef).open();
  };

  $scope.openBrokerageReportAsPDF = function () {
    var brokerageReportDef = {
      content: [
        {text: 'KCB IPO Brokerage report', style: 'header'},
        {
          style: 'tableExample',
          color: '#444',
          table: {
            widths: ['auto', 'auto', 'auto', 'auto', 'auto'],
            headerRows: 1,
            body: brokerageReportBody
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
    pdfMake.createPdf(brokerageReportDef).open();
  };

  $scope.printBatchReport = function () {
    var batchReportDef = {
      content: [
        {text: 'KCB IPO Batch Summary report', style: 'header'},
        {
          style: 'tableExample',
          color: '#444',
          table: {
            widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
            headerRows: 1,
            body: batchReportBody
          }
        }
      ],
      //Table Styles
      styles: {
        header: {
          fontSize: 16,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 10],

        },
        subheader: {
          fontSize: 12,
          bold: true,
          margin: [0, 10, 0, 5]
        },
        tableExample: {
          margin: [0, 5, 0, 15]
        },
        tableHeader: {
          bold: true,
          fontSize: 12,
          color: 'black'
        }
      }
    };
    pdfMake.createPdf(batchReportDef).print();
  };

  $scope.printBrokerageReport = function () {
    var brokerageReportDef = {
      content: [
        {text: 'KCB IPO Brokerage report', style: 'header'},
        {
          style: 'tableExample',
          color: '#444',
          table: {
            widths: ['auto', 'auto', 'auto', 'auto', 'auto'],
            headerRows: 1,
            body: brokerageReportBody
          }
        }
      ],
      //Table Styles
      styles: {
        header: {
          fontSize: 16,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 10]
        },
        subheader: {
          fontSize: 12,
          bold: true,
          margin: [0, 10, 0, 5]
        },
        tableExample: {
          margin: [0, 5, 0, 15]
        },
        tableHeader: {
          bold: true,
          fontSize: 12,
          color: 'black'
        }
      }
    };
    pdfMake.createPdf(brokerageReportDef).print();
  };

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
        console.log(response);

        console.log($scope.batchReport[0][1]);
        $scope.batchReportHeaders.brokerName = $scope.batchReport[0][0].appBatCode.batBrkCode.brkName;
        $scope.batchReportHeaders.totalApplications = $scope.batchReport.length;
        $scope.batchReportHeaders.totalShares = $scope.batchReport[0][0].appBatCode.batTotalShares;
        $scope.batchReportHeaders.totalAmount = (appService.getSessionVariable('sharePrice') *
        $scope.batchReport[0][0].appBatCode.batTotalShares);

        batchBrokerName = $scope.batchReport[0][0].appBatCode.batBrkCode.brkName;
        batchTotalApplications = String($scope.batchReport.length).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        batchTotalShares = String($scope.batchReport[0][0].appBatCode.batTotalShares).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        batchTotalAmount = String($scope.batchReportHeaders.totalAmount).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        batchReportBody = [
          [{text: 'Broker Name', style: 'subheader', alignment: 'center', colSpan: 2}, {},
            {
            text: batchBrokerName,
            style: 'subheader',
            alignment: 'center',
            colSpan: 5
          }, {}, {}, {}, {}],
          [{text: 'No of Applications', style: 'subheader', alignment: 'center', colSpan: 2}, {},
            {
            text: batchTotalApplications,
            style: 'subheader',
            alignment: 'center',
            colSpan: 5
          }, {}, {}, {}, {}],
          [{text: 'No of Shares', style: 'subheader', alignment: 'center', colSpan: 2}, {},
            {
            text: batchTotalShares,
            style: 'subheader',
            alignment: 'center',
            colSpan: 5
          }, {}, {}, {}, {}],
          [{text: 'Total amount', style: 'subheader', alignment: 'center', colSpan: 2},{},
            {
            text: batchTotalAmount,
            style: 'subheader',
            alignment: 'center',
            colSpan: 5
          }, {}, {}, {}, {}],
          //Table headers
          [ {text: 'Serial No', style: 'tableHeader', alignment: 'center'},
            {text: 'Name', style: 'tableHeader', alignment: 'center'},
            {text: 'Shares', style: 'tableHeader', alignment: 'center'},
            {text: 'Applicant Category', style: 'tableHeader', alignment: 'center'},
            {text: 'Amount', style: 'tableHeader', alignment: 'center'},
            {text: 'Payment Mode', style: 'tableHeader', alignment: 'center'},
            {text: 'Cheque/Ref No', style: 'tableHeader', alignment: 'center'}
          ]
        ];

        for(var i in $scope.batchReport){
          var row = [];

          if($scope.batchReport[i][0].appCusPalCode.cusApplicantCategory == 'INDIVIDUAL'){
            if($scope.batchReport[i][1].payType == 'CHEQUE'){
              row = [{text: String($scope.batchReport[i][0].appCusPalCode.cusFormSerialNo), alignment: 'center'},
                String($scope.batchReport[i][0].appCusPalCode.cusSurname +" "+$scope.batchReport[i][0].appCusPalCode.cusOtherNames),
                {text: String($scope.batchReport[i][0].appSharesApplied).replace(/\B(?=(\d{3})+(?!\d))/g, ","), alignment: 'right'},
                String($scope.batchReport[i][0].appCusPalCode.cusApplicantCategory),
                String($scope.batchReport[i][1].payAmount),
                String($scope.batchReport[i][1].payType),
                String($scope.batchReport[i][1].payChequeNo)];
            } else{
              row = [{text: String($scope.batchReport[i][0].appCusPalCode.cusFormSerialNo), alignment: 'center'},
                String($scope.batchReport[i][0].appCusPalCode.cusSurname +" "+$scope.batchReport[i][0].appCusPalCode.cusOtherNames),
                {text: String($scope.batchReport[i][0].appSharesApplied).replace(/\B(?=(\d{3})+(?!\d))/g, ","), alignment: 'right'},
                String($scope.batchReport[i][0].appCusPalCode.cusApplicantCategory),
                String($scope.batchReport[i][1].payAmount),
                String($scope.batchReport[i][1].payType),
                String($scope.batchReport[i][1].payTransRef)];
            }
          } else if($scope.batchReport[i][0].appCusPalCode.cusApplicantCategory == 'JOINT'){
            if($scope.batchReport[i][1].payType == 'CHEQUE'){
              row = [{text: String($scope.batchReport[i][0].appCusPalCode.cusFormSerialNo), alignment: 'center'},
                String($scope.batchReport[i][0].appCusPalCode.cusJointSurname +" "+$scope.batchReport[i][0].appCusPalCode.cusJointOthernames),
                {text: String($scope.batchReport[i][0].appSharesApplied).replace(/\B(?=(\d{3})+(?!\d))/g, ","), alignment: 'right'},
                String($scope.batchReport[i][0].appCusPalCode.cusApplicantCategory),
                String($scope.batchReport[i][1].payAmount),
                String($scope.batchReport[i][1].payType),
                String($scope.batchReport[i][1].payChequeNo)];
            }else{
              row = [{text: String($scope.batchReport[i][0].appCusPalCode.cusFormSerialNo), alignment: 'center'},
                String($scope.batchReport[i][0].appCusPalCode.cusJointSurname +" "+$scope.batchReport[i][0].appCusPalCode.cusJointOthernames),
                {text: String($scope.batchReport[i][0].appSharesApplied).replace(/\B(?=(\d{3})+(?!\d))/g, ","), alignment: 'right'},
                String($scope.batchReport[i][0].appCusPalCode.cusApplicantCategory),
                String($scope.batchReport[i][1].payAmount),
                String($scope.batchReport[i][1].payType),
                String($scope.batchReport[i][1].payTransRef)];
            }
          } else if($scope.batchReport[i][0].appCusPalCode.cusApplicantCategory == 'COMPANY'){
            if($scope.batchReport[i][1].payType == 'CHEQUE'){
              row = [{text: String($scope.batchReport[i][0].appCusPalCode.cusFormSerialNo), alignment: 'center'},
                String($scope.batchReport[i][0].appCusPalCode.cusCompanyName),
                {text: String($scope.batchReport[i][0].appSharesApplied).replace(/\B(?=(\d{3})+(?!\d))/g, ","), alignment: 'right'},
                String($scope.batchReport[i][0].appCusPalCode.cusApplicantCategory),
                String($scope.batchReport[i][1].payAmount),
                String($scope.batchReport[i][1].payType),
                String($scope.batchReport[i][1].payChequeNo)];
            } else{
              row = [{text: String($scope.batchReport[i][0].appCusPalCode.cusFormSerialNo), alignment: 'center'},
                String($scope.batchReport[i][0].appCusPalCode.cusCompanyName),
                {text: String($scope.batchReport[i][0].appSharesApplied).replace(/\B(?=(\d{3})+(?!\d))/g, ","), alignment: 'right'},
                String($scope.batchReport[i][0].appCusPalCode.cusApplicantCategory),
                String($scope.batchReport[i][1].payAmount),
                String($scope.batchReport[i][1].payType),
                String($scope.batchReport[i][1].payTransRef)];
            }
          } else if($scope.batchReport[i][0].appCusPalCode.cusApplicantCategory == 'NOMINEE'){
            if($scope.batchReport[i][1].payType == 'CHEQUE'){
              row = [{text: String($scope.batchReport[i][0].appCusPalCode.cusFormSerialNo), alignment: 'center'},
                String($scope.batchReport[i][0].appCusPalCode.cusNomineeName),
                {text: String($scope.batchReport[i][0].appSharesApplied).replace(/\B(?=(\d{3})+(?!\d))/g, ","), alignment: 'right'},
                String($scope.batchReport[i][0].appCusPalCode.cusApplicantCategory),
                String($scope.batchReport[i][1].payAmount),
                String($scope.batchReport[i][1].payType),
                String($scope.batchReport[i][1].payChequeNo)];
            } else{
              row = [{text: String($scope.batchReport[i][0].appCusPalCode.cusFormSerialNo), alignment: 'center'},
                String($scope.batchReport[i][0].appCusPalCode.cusNomineeName),
                {text: String($scope.batchReport[i][0].appSharesApplied).replace(/\B(?=(\d{3})+(?!\d))/g, ","), alignment: 'right'},
                String($scope.batchReport[i][0].appCusPalCode.cusApplicantCategory),
                String($scope.batchReport[i][1].payAmount),
                String($scope.batchReport[i][1].payType),
                String($scope.batchReport[i][1].payTransRef)];
            }
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
    listing_payload.token = appService.getSessionVariable('token');

    //-----------------Get batch summary-------------------------
    appService.genericUnpaginatedRequest(listing_payload, appService.GET_BROKERAGE_REPORT).success(function (response) {
      if (response.requestStatus === true) {
        $scope.brokerageReport = [];
        $scope.brokerageReport = response.payload;
        $scope.brokerageTotalItems = 1;
        $scope.brokerageCurrentPage = 1;
        $scope.brokerageNumPages = 1;

        for (var i in $scope.brokerageReport){
          var row = [];
          if($scope.brokerageReport[i].totalApplications === null && $scope.brokerageReport[i].totalShares === null
          && $scope.brokerageReport[i].totalAmount === null){
            row = [
              String($scope.brokerageReport[i].brokerName),
              { text: String($scope.brokerageReport[i].batchSize), alignment: 'right'},
              { text: String(0), alignment: 'right'},
              { text: String(0), alignment: 'right'},
              { text: String(0), alignment: 'right'}
            ];
          } else{
            row = [
              String($scope.brokerageReport[i].brokerName),
              { text: String($scope.brokerageReport[i].batchSize), alignment: 'right'},
              { text: String($scope.brokerageReport[i].totalApplications).replace(/\B(?=(\d{3})+(?!\d))/g, ","), alignment: 'right'},
              { text: String($scope.brokerageReport[i].totalShares).replace(/\B(?=(\d{3})+(?!\d))/g, ","), alignment: 'right'},
              { text: String($scope.brokerageReport[i].totalAmount).replace(/\B(?=(\d{3})+(?!\d))/g, ","), alignment: 'right'}
            ];
          }
          brokerageReportBody.push(row);
        }
      } else {
        appService.showToast(response.message);
        $rootScope.$emit("sessionTimeOut", {});
      }
    }).error(function (response) {
      appService.showToast(response.message);
    });
  };

}); //End of controller
