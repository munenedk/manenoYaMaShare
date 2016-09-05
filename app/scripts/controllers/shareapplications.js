//jshint ignore:start
// jscs:disable
'use strict';

/**
 * @ngdoc function
 * @name ipoApp.controller:ShareapplicationsCtrl
 * @description
 * # ShareapplicationsCtrl
 * Controller of the ipoApp
 * @author munenedk-pc
 */
app.controller('ShareapplicationsCtrl', function ($rootScope, $scope, $mdDialog, $state, appService) {
  //------------------Setup variables-------------------------------------------
  $rootScope.userLoggedInAs = "";
  $scope.selectedTab = 0;
  $scope.maxSize = 5; //Pagination component size

  $scope.batchTotalItems = 1;
  $scope.batchCurrentPage = 1;
  $scope.batchItemsPerPage = 5;
  $scope.batchNumPages = 1;

  $scope.customersTotalItems = 1;
  $scope.customersCurrentPage = 1;
  $scope.customersItemsPerPage = 5;
  $scope.customersNumPages = 1;

  $scope.applicationTotalItems = 1;
  $scope.applicationCurrentPage = 1;
  $scope.applicationItemsPerPage = 5;
  $scope.applicationNumPages = 1;

  $scope.paymentsTotalItems = 1;
  $scope.paymentsCurrentPage = 1;
  $scope.paymentsItemsPerPage = 5;
  $scope.paymentsNumPages = 1;

  $scope.refundsTotalItems = 1;
  $scope.refundsCurrentPage = 1;
  $scope.refundsItemsPerPage = 5;
  $scope.refundsNumPages = 1;

  $scope.receivedTotalItems = 1;
  $scope.receivedCurrentPage = 1;
  $scope.receivedItemsPerPage = 5;
  $scope.receivedNumPages = 1;

  //Arrays to hold table data
  $scope.batches = [];
  $scope.customers = [];
  $scope.applications = [];
  $scope.payments = [];
  $scope.refunds = [];
  $scope.received = [];

  //Batch select one/select all models
  $scope.batchSelect = {};
  $scope.batchSelect.all = false;
  $scope.batchSelect.individual = [];
  $scope.batchesForAuth = [];
  $scope.disableActions = true;

  //Customer select one/select all models
  $scope.customerSelect = {};
  $scope.customerSelect.all = false;
  $scope.customerSelect.individual = [];
  $scope.customersForAuth = [];
  $scope.disableCustomerActions = true;

  //Application select one/select all models
  $scope.applicationSelect = {};
  $scope.applicationSelect.all = false;
  $scope.applicationSelect.individual = [];
  $scope.applicationsForAuth = [];
  $scope.disableApplicationActions = true;

  //Payments select one/select all models
  $scope.paymentSelect = {};
  $scope.paymentSelect.all = false;
  $scope.paymentSelect.individual = [];
  $scope.paymentsForAuth = [];
  $scope.disablePaymentActions = true;

  //Refunds select one/select all models
  $scope.refundSelect = {};
  $scope.refundSelect.all = false;
  $scope.refundSelect.individual = [];
  $scope.refundsForAuth = [];
  $scope.disableRefundActions = true;

  //Received select one/select all models
  $scope.receivedSelect = {};
  $scope.receivedSelect.all = false;
  $scope.receivedSelect.individual = [];
  $scope.receivedForAuth = [];
  $scope.disableReceivedActions = true;

  //Global payload for all populate methods
  var listingPayload = {};
  var listingObject = {};
  listingPayload.token = appService.getSessionVariable('token');
  listingObject.batBrkCode = {};
  listingObject.batBrkCode.brkCode = appService.getSessionVariable('brokerCode');
  listingPayload.object = listingObject;

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

  //-----------------------------Get Batches,Customers, Applications, Payments----------------
  $scope.populateAllTables = function () {
    //Populate batches table
    appService.genericPaginatedRequest(listingPayload, appService.LIST_BATCHES, 0, 5).success(function (response) {
      if (response.requestStatus === true) {
        $scope.batches = [];
        $scope.batches = response.payload.content;
        $scope.batchTotalItems = response.payload.totalElements;
        $scope.batchCurrentPage = (response.payload.number + 1);
        $scope.batchNumPages = response.payload.totalPages;
      } else {
        appService.showToast(response.message);
        $rootScope.$emit("sessionTimeOut", {});
        console.log(response);
      }
    }).error(function (response) {
      appService.showToast(response.message);
      console.log(response);
    });

    //Populate customers table
    appService.genericPaginatedRequest(listingPayload, appService.LIST_CUSTOMERS, 0, 5).success(function (response) {
      if (response.requestStatus === true) {
        $scope.customers = [];
        $scope.customers = response.payload.content;
        $scope.customersTotalItems = response.payload.totalElements;
        $scope.customersCurrentPage = (response.payload.number + 1);
        $scope.customersNumPages = response.payload.totalPages;
      } else {
        appService.showToast(response.message);
        $rootScope.$emit("sessionTimeOut", {});
        console.log(response);
      }
    }).error(function (response) {
      appService.showToast(response.message);
    });

    //Populate applications table
    appService.genericPaginatedRequest(listingPayload, appService.LIST_APPLICATIONS, 0, 5).success(function (response) {
      if (response.requestStatus === true) {
        $scope.applications = [];
        $scope.applications = response.payload.content;
        $scope.applicationTotalItems = response.payload.totalElements;
        $scope.applicationCurrentPage = (response.payload.number + 1);
        $scope.applicationNumPages = response.payload.totalPages;
      } else {
        appService.showToast(response.message);
        $rootScope.$emit("sessionTimeOut", {});
        console.log(response);
      }
    }).error(function (response) {
      appService.showToast(response.message);
    });

    //Populate payments table
    appService.genericPaginatedRequest(listingPayload, appService.LIST_PAYMENTS, 0, 5).success(function (response) {
      if (response.requestStatus === true) {
        $scope.payments = [];
        $scope.payments = response.payload.content;
        $scope.paymentsTotalItems = response.payload.totalElements;
        $scope.paymentsCurrentPage = (response.payload.number + 1);
        $scope.paymentsNumPages = response.payload.totalPages;
      } else {
        appService.showToast(response.message);
        $rootScope.$emit("sessionTimeOut", {});
        console.log(response);
      }
    }).error(function (response) {
      appService.showToast(response.message);
      console.log(response);
    });

    //Populate refunds table
    appService.genericPaginatedRequest(listingPayload, appService.LIST_REFUNDS, 0, 5).success(function (response) {
      if (response.requestStatus === true) {
        $scope.refunds = [];
        $scope.refunds = response.payload.content;
        $scope.refundsTotalItems = response.payload.totalElements;
        $scope.refundsCurrentPage = (response.payload.number + 1);
        $scope.refundsNumPages = response.payload.totalPages;
      } else {
        appService.showToast(response.message);
        $rootScope.$emit("sessionTimeOut", {});
        console.log(response);
      }
    }).error(function (response) {
      appService.showToast(response.message);
      console.log(response);
    });

    //Populate received table
    //appService.genericPaginatedRequest(listingPayload, appService.LIST_RECEIVED, 0, 5).success(function (response) {
    //    if (response.requestStatus === true) {
    //        $scope.received = [];
    //        $scope.received = response.payload.content;
    //        $scope.receivedTotalItems = response.payload.totalElements;
    //        $scope.receivedCurrentPage = (response.payload.number + 1);
    //        $scope.receivedNumPages = response.payload.totalPages;
    //    } else {
    //        appService.showToast(response.message);
    //        $rootScope.$emit("sessionTimeOut", {});
    //        console.log(response);
    //    }
    //}).error(function (response) {
    //    appService.showToast(response.message);
    //    console.log(response);
    //});
  };

  /*************************************************************************************************
   *
   * *********************************SEARCH HANDLERS*******************************
   *
   * ***********************************************************************************************/

    //-----------------Search batch handler-------------------------------------
  $scope.searchBatch = function (search) {
    var payload = {};
    payload.token = appService.getSessionVariable('token');
    payload.object = search;

    appService.genericUnpaginatedRequest(payload, appService.SEARCH_BATCH).success(function (response) {
      if (response.requestStatus === true) {
        appService.showToast(response.message);
        $scope.batches = [];
        $scope.batches = response.payload.content;
        $scope.batchTotalItems = response.payload.totalElements;
        $scope.batchCurrentPage = (response.payload.number + 1);
        $scope.batchNumPages = response.payload.totalPages;
      } else {
        appService.showToast(response.message);
        $rootScope.$emit("sessionTimeOut", {});
      }
    }).error(function (response) {
      appService.showToast(response.message);
    });
  };

  //-----------------Search customer handler----------------------------------
  $scope.searchCustomer = function (search) {
    var payload = {};
    payload.token = appService.getSessionVariable('token');
    payload.object = search;

    appService.genericPaginatedRequest(payload, appService.SEARCH_CUSTOMER, 0, 5).success(function (response) {
      if (response.requestStatus === true) {
        appService.showToast(response.message);
        $scope.customers = [];
        $scope.customers = response.payload.content;
        $scope.customersTotalItems = response.payload.totalElements;
        $scope.customersCurrentPage = (response.payload.number + 1);
        $scope.customersNumPages = response.payload.totalPages;
      } else {
        appService.showToast(response.message);
        $rootScope.$emit("sessionTimeOut", {});
      }
    }).error(function (response) {
      appService.showToast(response.message);
    });
  };

  //-----------------Search application handler-------------------------------
  $scope.searchApplication = function (search) {
    var payload = {};
    payload.token = appService.getSessionVariable('token');
    payload.object = search;

    appService.genericUnpaginatedRequest(payload, appService.SEARCH_APPLICATION).success(function (response) {
      if (response.requestStatus === true) {
        appService.showToast(response.message);
        $scope.applications = [];
        $scope.applications = response.payload.content;
        $scope.applicationTotalItems = response.payload.totalElements;
        $scope.applicationCurrentPage = (response.payload.number + 1);
        $scope.applicationNumPages = response.payload.totalPages;
      } else {
        appService.showToast(response.message);
        $rootScope.$emit("sessionTimeOut", {});
      }
    }).error(function (response) {
      appService.showToast(response.message);
    });
  };

  //-----------------Search payment handler-----------------------------------
  $scope.searchPayment = function (search) {
    var payload = {};
    payload.token = appService.getSessionVariable('token');
    payload.object = search;

    appService.genericUnpaginatedRequest(payload, appService.SEARCH_PAYMENT).success(function (response) {
      if (response.requestStatus === true) {
        appService.showToast(response.message);
        $scope.payments = [];
        $scope.payments = response.payload.content;
        $scope.paymentsTotalItems = response.payload.totalElements;
        $scope.paymentsCurrentPage = (response.payload.number + 1);
        $scope.paymentsNumPages = response.payload.totalPages;
      } else {
        appService.showToast(response.message);
        $rootScope.$emit("sessionTimeOut", {});
      }
    }).error(function (response) {
      appService.showToast(response.message);
    });
  };

  //-----------------Search refund handler-----------------------------------
  $scope.searchRefund = function (search) {
    var payload = {};
    payload.token = appService.getSessionVariable('token');
    payload.object = search;

    appService.genericUnpaginatedRequest(payload, appService.SEARCH_REFUND).success(function (response) {
      if (response.requestStatus === true) {
        appService.showToast(response.message);
        $scope.refunds = [];
        $scope.refunds.push(response.payload);
        $scope.refundsTotalItems = 1;
        $scope.refundsCurrentPage = 1;
        $scope.refundsNumPages = 1;
      } else {
        appService.showToast(response.message);
        $rootScope.$emit("sessionTimeOut", {});
      }
    }).error(function (response) {
      appService.showToast(response.message);
    });
  };

  //-----------------Search received handler-----------------------------------
  $scope.searchReceived = function (search) {
    var payload = {};
    payload.token = appService.getSessionVariable('token');
    payload.object = search;

    appService.genericUnpaginatedRequest(payload, appService.SEARCH_RECEIVED).success(function (response) {
      if (response.requestStatus === true) {
        appService.showToast(response.message);
        $scope.received = [];
        $scope.received.push(response.payload);
        $scope.receivedTotalItems = 1;
        $scope.receivedCurrentPage = 1;
        $scope.receivedNumPages = 1;
      } else {
        appService.showToast(response.message);
        $rootScope.$emit("sessionTimeOut", {});
      }
    }).error(function (response) {
      appService.showToast(response.message);
    });
  };

  /*************************************************************************************************
   *
   * *********************************SELECT INDIVIDUAL HANDLERS*******************************
   *
   * ***********************************************************************************************/

    //-----------------Select one batch handler--------------------------------------
  $scope.selectIndividualBatch = function (row, id) {

    //Insert row if it does not exist
    if ($scope.batchesForAuth.indexOf(row) === -1 && $scope.batchSelect.individual[id] === true) {
      //Add only pending approvals
      if (row.batStatus === 2) {
        $scope.batchesForAuth.push(row);
        //Check if checker
        //if ($scope.isClosureChecker) {
        $scope.disableActions = false;
        //}
      }

    } else if ($scope.batchesForAuth.indexOf(row) > -1 && $scope.batchSelect.individual[id] === false) {
      //Remove it if it exists
      var index = $scope.batchesForAuth.indexOf(row);
      $scope.batchesForAuth.splice(index, 1);
      //Disable buttons if array has nothing
      if ($scope.batchesForAuth.length === 0) {
        $scope.disableActions = true;
      }
    }
  };

  //-----------------Select one customer handler--------------------------------------
  $scope.selectIndividualCustomer = function (row, id) {

    //Insert row if it does not exist
    if ($scope.customersForAuth.indexOf(row) === -1 && $scope.customerSelect.individual[id] === true) {
      //Add only pending approvals
      if (row.cusStatus === 2) {
        $scope.customersForAuth.push(row);
        //Check if checker
        //if ($scope.isClosureChecker) {
        $scope.disableCustomerActions = false;
        //}
      }

    } else if ($scope.customersForAuth.indexOf(row) > -1 && $scope.customerSelect.individual[id] === false) {
      //Remove it if it exists
      var index = $scope.customersForAuth.indexOf(row);
      $scope.customersForAuth.splice(index, 1);
      //Disable buttons if array has nothing
      if ($scope.customersForAuth.length === 0) {
        $scope.disableCustomerActions = true;
      }
    }
  };

  //-----------------Select one application handler--------------------------------
  $scope.selectIndividualApplication = function (row, id) {

    //Insert row if it does not exist
    if ($scope.applicationsForAuth.indexOf(row) === -1 && $scope.applicationSelect.individual[id] === true) {
      //Add only pending approvals
      if (row.appStatus === 2) {
        $scope.applicationsForAuth.push(row);
        //Check if checker
        //if ($scope.isClosureChecker) {
        $scope.disableApplicationActions = false;
        //}
      }

    } else if ($scope.applicationsForAuth.indexOf(row) > -1 && $scope.applicationSelect.individual[id] === false) {
      //Remove it if it exists
      var index = $scope.applicationsForAuth.indexOf(row);
      $scope.applicationsForAuth.splice(index, 1);
      //Disable buttons if array has nothing
      if ($scope.applicationsForAuth.length === 0) {
        $scope.disableApplicationActions = true;
      }
    }
  };

  //-----------------Select one payment handler--------------------------------
  $scope.selectIndividualPayment = function (row, id) {

    //Insert row if it does not exist
    if ($scope.paymentsForAuth.indexOf(row) === -1 && $scope.paymentSelect.individual[id] === true) {
      //Add only pending approvals
      if (row.payStatus === 2) {
        $scope.paymentsForAuth.push(row);
        //Check if checker
        //if ($scope.isClosureChecker) {
        $scope.disablePaymentActions = false;
        //}
      }

    } else if ($scope.paymentsForAuth.indexOf(row) > -1 && $scope.paymentSelect.individual[id] === false) {
      //Remove it if it exists
      var index = $scope.paymentsForAuth.indexOf(row);
      $scope.paymentsForAuth.splice(index, 1);
      //Disable buttons if array has nothing
      if ($scope.paymentsForAuth.length === 0) {
        $scope.disablePaymentActions = true;
      }
    }
  };

  //-----------------Select one refund handler--------------------------------
  $scope.selectIndividualRefund = function (row, id) {

    //Insert row if it does not exist
    if ($scope.refundsForAuth.indexOf(row) === -1 && $scope.refundSelect.individual[id] === true) {
      //Add only pending approvals
      if (row.payStatus === 2) {
        $scope.refundsForAuth.push(row);
        //Check if checker
        //if ($scope.isClosureChecker) {
        $scope.disableRefundActions = false;
        //}
      }

    } else if ($scope.refundsForAuth.indexOf(row) > -1 && $scope.refundSelect.individual[id] === false) {
      //Remove it if it exists
      var index = $scope.refundsForAuth.indexOf(row);
      $scope.refundsForAuth.splice(index, 1);
      //Disable buttons if array has nothing
      if ($scope.refundsForAuth.length === 0) {
        $scope.disableRefundActions = true;
      }
    }
  };

  //-----------------Select one refund handler--------------------------------
  $scope.selectIndividualReceived = function (row, id) {

    //Insert row if it does not exist
    if ($scope.receivedForAuth.indexOf(row) === -1 && $scope.receivedSelect.individual[id] === true) {
      //Add only pending approvals
      if (row.rcvStatus === 2) {
        $scope.receivedForAuth.push(row);
        //Check if checker
        //if ($scope.isClosureChecker) {
        $scope.disableReceivedActions = false;
        //}
      }

    } else if ($scope.receivedForAuth.indexOf(row) > -1 && $scope.receivedSelect.individual[id] === false) {
      //Remove it if it exists
      var index = $scope.receivedForAuth.indexOf(row);
      $scope.receivedForAuth.splice(index, 1);
      //Disable buttons if array has nothing
      if ($scope.receivedForAuth.length === 0) {
        $scope.disableReceivedActions = true;
      }
    }
  };

  /*************************************************************************************************
   *
   * *********************************SELECT ALL HANDLERS*******************************
   *
   * ***********************************************************************************************/

    //-----------------Select all batches handler---------------------------------
  $scope.selectAllBatches = function (rows) {
    //If array is empty it knows you want to select all
    if ($scope.batchesForAuth.length === 0 || $scope.batchSelect.all) {
      for (var i in rows) {
        //Insert rows if they dont exist
        if ($scope.batchesForAuth.indexOf(rows[i]) === -1) {
          //Add only pending approvals
          if (rows[i].batStatus === 2) {
            //Mark row as selected
            $scope.batchSelect.individual[i] = true;
            $scope.batchesForAuth.push(rows[i]);
            //Check if checker
            //if ($scope.isClosureChecker) {
            $scope.disableActions = false;
            //}
          }

        }
      }
    } else if ($scope.batchesForAuth.length > 0 && $scope.batchSelect.all === false) {
      //Otherwise it knows you want to remove everything
      for (var i in rows) {
        $scope.batchSelect.individual[i] = false;
      }
      $scope.batchesForAuth = [];
      $scope.disableActions = true;

    }
  };

  //-----------------Select all customers handler-----------------------------------
  $scope.selectAllCustomers = function (rows) {
    //If array is empty it knows you want to select all
    if ($scope.customersForAuth.length === 0 || $scope.customerSelect.all) {
      for (var i in rows) {
        //Insert rows if they dont exist
        if ($scope.customersForAuth.indexOf(rows[i]) === -1) {
          //Add only pending approvals
          if (rows[i].cusStatus === 2) {
            //Mark row as selected
            $scope.customerSelect.individual[i] = true;
            $scope.customersForAuth.push(rows[i]);
            //Check if checker
            //if ($scope.isClosureChecker) {
            $scope.disableCustomerActions = false;
            //}
          }

        }
      }
    } else if ($scope.customersForAuth.length > 0 && $scope.customerSelect.all === false) {
      //Otherwise it knows you want to remove everything
      for (var i in rows) {
        $scope.customerSelect.individual[i] = false;
      }
      $scope.customersForAuth = [];
      $scope.disableCustomerActions = true;

    }
  };

  //-----------------Select all applications handler--------------------------------
  $scope.selectAllApplications = function (rows) {
    //If array is empty it knows you want to select all
    if ($scope.applicationsForAuth.length === 0 || $scope.applicationSelect.all) {
      for (var i in rows) {
        //Insert rows if they dont exist
        if ($scope.applicationsForAuth.indexOf(rows[i]) === -1) {
          //Add only pending approvals
          if (rows[i].appStatus === 2) {
            //Mark row as selected
            $scope.applicationSelect.individual[i] = true;
            $scope.applicationsForAuth.push(rows[i]);
            //Check if checker
            //if ($scope.isClosureChecker) {
            $scope.disableApplicationActions = false;
            //}
          }

        }
      }
    } else if ($scope.applicationsForAuth.length > 0 && $scope.applicationSelect.all === false) {
      //Otherwise it knows you want to remove everything
      for (var i in rows) {
        $scope.applicationSelect.individual[i] = false;
      }
      $scope.applicationsForAuth = [];
      $scope.disableApplicationActions = true;

    }
  };

  //-----------------Select all payments handler------------------------------------
  $scope.selectAllPayments = function (rows) {
    //If array is empty it knows you want to select all
    if ($scope.paymentsForAuth.length === 0 || $scope.paymentSelect.all) {
      for (var i in rows) {
        //Insert rows if they dont exist
        if ($scope.paymentsForAuth.indexOf(rows[i]) === -1) {
          //Add only pending approvals
          if (rows[i].payStatus === 2) {
            //Mark row as selected
            $scope.paymentSelect.individual[i] = true;
            $scope.paymentsForAuth.push(rows[i]);
            //Check if checker
            //if ($scope.isClosureChecker) {
            $scope.disablePaymentActions = false;
            //}
          }

        }
      }
    } else if ($scope.paymentsForAuth.length > 0 && $scope.paymentSelect.all === false) {
      //Otherwise it knows you want to remove everything
      for (var i in rows) {
        $scope.paymentSelect.individual[i] = false;
      }
      $scope.paymentsForAuth = [];
      $scope.disablePaymentActions = true;

    }
  };

  //-----------------Select all refunds handler------------------------------------
  $scope.selectAllRefunds = function (rows) {
    //If array is empty it knows you want to select all
    if ($scope.refundsForAuth.length === 0 || $scope.refundSelect.all) {
      for (var i in rows) {
        //Insert rows if they dont exist
        if ($scope.refundsForAuth.indexOf(rows[i]) === -1) {
          //Add only pending approvals
          if (rows[i].payStatus === 2) {
            //Mark row as selected
            $scope.refundSelect.individual[i] = true;
            $scope.refundsForAuth.push(rows[i]);
            //Check if checker
            //if ($scope.isClosureChecker) {
            $scope.disableRefundActions = false;
            //}
          }
        }
      }
    } else if ($scope.refundsForAuth.length > 0 && $scope.refundSelect.all === false) {
      //Otherwise it knows you want to remove everything
      for (var i in rows) {
        $scope.refundSelect.individual[i] = false;
      }
      $scope.refundsForAuth = [];
      $scope.disableRefundActions = true;
    }
  };

  //-----------------Select all refunds handler------------------------------------
  $scope.selectAllReceived = function (rows) {
    //If array is empty it knows you want to select all
    if ($scope.receivedForAuth.length === 0 || $scope.receivedSelect.all) {
      for (var i in rows) {
        //Insert rows if they dont exist
        if ($scope.receivedForAuth.indexOf(rows[i]) === -1) {
          //Add only pending approvals
          if (rows[i].rcvStatus === 2) {
            //Mark row as selected
            $scope.receivedSelect.individual[i] = true;
            $scope.receivedForAuth.push(rows[i]);
            //Check if checker
            //if ($scope.isClosureChecker) {
            $scope.disableReceivedActions = false;
            //}
          }
        }
      }
    } else if ($scope.receivedForAuth.length > 0 && $scope.receivedSelect.all === false) {
      //Otherwise it knows you want to remove everything
      for (var i in rows) {
        $scope.receivedSelect.individual[i] = false;
      }
      $scope.receivedForAuth = [];
      $scope.disableReceivedActions = true;
    }
  };

  /*************************************************************************************************
   *
   * *********************************APPROVE HANDLERS*******************************
   *
   * ***********************************************************************************************/

    //-----------------Approve batch handler-----------------------------------------
  $scope.approveBatch = function () {
    var finalArray = [];

    var auth = {};
    auth.usrCode = appService.getSessionVariable('userID');

    //Add authoriser property for all objects
    for (var i in $scope.batchesForAuth) {
      $scope.batchesForAuth[i].batAuthoriser = auth;
      finalArray.push($scope.batchesForAuth[i]);
    }
    var payload = {};
    payload.token = appService.getSessionVariable('token');
    payload.object = finalArray;

    appService.genericUnpaginatedRequest(payload, appService.APPROVE_BATCHES).success(function (response) {
      if (response.requestStatus === true) {
        appService.showToast(response.message);
        $scope.populateAllTables();
      } else {
        appService.showToast(response.message);
        $rootScope.$emit("sessionTimeOut", {});
      }
    }).error(function (response) {
      appService.showToast(response.message);
    });
  };

  //-----------------Approve customers handler--------------------------------------
  $scope.approveCustomers = function () {
    var finalArray = [];

    var auth = {};
    auth.usrCode = appService.getSessionVariable('userID');

    //Add authoriser property for all objects
    for (var i in $scope.customersForAuth) {
      $scope.customersForAuth[i].cusAuthoriser = auth;
      finalArray.push($scope.customersForAuth[i]);
    }
    var payload = {};
    payload.token = appService.getSessionVariable('token');
    payload.object = finalArray;

    appService.genericUnpaginatedRequest(payload, appService.APPROVE_CUSTOMERS).success(function (response) {
      if (response.requestStatus === true) {
        appService.showToast(response.message);
        $scope.populateAllTables();
      } else {
        appService.showToast(response.message);
        $rootScope.$emit("sessionTimeOut", {});
      }
    }).error(function (response) {
      appService.showToast(response.message);
    });
  };

  //-----------------Approve application handler-----------------------------------------
  $scope.approveApplication = function () {
    var finalArray = [];

    var auth = {};
    auth.usrCode = appService.getSessionVariable('userID');

    //Add authoriser property for all objects
    for (var i in $scope.applicationsForAuth) {
      $scope.applicationsForAuth[i].appAuthoriser = auth;
      finalArray.push($scope.applicationsForAuth[i]);
    }
    var payload = {};
    payload.token = appService.getSessionVariable('token');
    payload.object = finalArray;

    appService.genericUnpaginatedRequest(payload, appService.APPROVE_APPLICATIONS).success(function (response) {
      if (response.requestStatus === true) {
        appService.showToast(response.message);
        $scope.populateAllTables();
      } else {
        appService.showToast(response.message);
        $rootScope.$emit("sessionTimeOut", {});
      }
    }).error(function (response) {
      appService.showToast(response.message);
    });
  };

  //-----------------Approve payment handler-----------------------------------------
  $scope.approvePayment = function () {
    var finalArray = [];

    var auth = {};
    auth.usrCode = appService.getSessionVariable('userID');

    //Add authoriser property for all objects
    for (var i in $scope.paymentsForAuth) {
      $scope.paymentsForAuth[i].payAuthoriser = auth;
      finalArray.push($scope.paymentsForAuth[i]);
    }
    var payload = {};
    payload.token = appService.getSessionVariable('token');
    payload.object = finalArray;

    appService.genericUnpaginatedRequest(payload, appService.APPROVE_PAYMENTS).success(function (response) {
      if (response.requestStatus === true) {
        appService.showToast(response.message);
        $scope.populateAllTables();
      } else {
        appService.showToast(response.message);
        $rootScope.$emit("sessionTimeOut", {});
      }
    }).error(function (response) {
      appService.showToast(response.message);
    });
  };

  //-----------------Approve refunds handler-----------------------------------------
  $scope.approveRefunds = function () {
    var finalArray = [];

    var auth = {};
    auth.usrCode = appService.getSessionVariable('userID');

    //Add authoriser property for all objects
    for (var i in $scope.refundsForAuth) {
      $scope.refundsForAuth[i].rfdAuthoriser = auth;
      finalArray.push($scope.refundsForAuth[i]);
    }
    var payload = {};
    payload.token = appService.getSessionVariable('token');
    payload.object = finalArray;

    appService.genericUnpaginatedRequest(payload, appService.APPROVE_REFUND).success(function (response) {
      if (response.requestStatus === true) {
        appService.showToast(response.message);
        $scope.populateAllTables();
      } else {
        appService.showToast(response.message);
        $rootScope.$emit("sessionTimeOut", {});
      }
    }).error(function (response) {
      appService.showToast(response.message);
    });
  };

  //-----------------Approve received handler-----------------------------------------
  $scope.approveReceived = function () {
    var finalArray = [];

    var auth = {};
    auth.usrCode = appService.getSessionVariable('userID');

    //Add authoriser property for all objects
    for (var i in $scope.receivedForAuth) {
      $scope.receivedForAuth[i].payAuthoriser = auth;
      finalArray.push($scope.receivedForAuth[i]);
    }
    var payload = {};
    payload.token = appService.getSessionVariable('token');
    payload.object = finalArray;

    appService.genericUnpaginatedRequest(payload, appService.APPROVE_RECEIVED).success(function (response) {
      if (response.requestStatus === true) {
        appService.showToast(response.message);
        $scope.populateAllTables();
      } else {
        appService.showToast(response.message);
        $rootScope.$emit("sessionTimeOut", {});
      }
    }).error(function (response) {
      appService.showToast(response.message);
    });
  };

  /*************************************************************************************************
   *
   * *********************************REJECT HANDLERS*******************************
   *
   * ***********************************************************************************************/

    //-----------------Reject batch handler-------------------------------------
  $scope.rejectBatch = function () {
    var finalArray = [];

    var auth = {};
    auth.usrCode = appService.getSessionVariable('userID');

    //Add authoriser property for all objects
    for (var i in $scope.batchesForAuth) {
      $scope.batchesForAuth[i].batAuthoriser = auth;
      finalArray.push($scope.batchesForAuth[i]);
    }
    var payload = {};
    payload.token = appService.getSessionVariable('token');
    payload.object = finalArray;

    appService.genericUnpaginatedRequest(payload, appService.REJECT_BATCHES).success(function (response) {
      console.log(response);
      if (response.requestStatus === true) {
        appService.showToast(response.message);
        $scope.populateAllTables();
      } else {
        appService.showToast(response.message);
        $rootScope.$emit("sessionTimeOut", {});
      }
    }).error(function (response) {
      appService.showToast(response.message);
    });
  };

  //-----------------Reject customers handler--------------------------------------
  $scope.rejectCustomers = function () {
    var finalArray = [];

    var auth = {};
    auth.usrCode = appService.getSessionVariable('userID');

    //Add authoriser property for all objects
    for (var i in $scope.customersForAuth) {
      $scope.customersForAuth[i].cusAuthoriser = auth;
      finalArray.push($scope.customersForAuth[i]);
    }
    var payload = {};
    payload.token = appService.getSessionVariable('token');
    payload.object = finalArray;

    appService.genericUnpaginatedRequest(payload, appService.REJECT_CUSTOMERS).success(function (response) {
      console.log(response);
      if (response.requestStatus === true) {
        appService.showToast(response.message);
        $scope.populateAllTables();
      } else {
        appService.showToast(response.message);
        $rootScope.$emit("sessionTimeOut", {});
      }
    }).error(function (response) {
      appService.showToast(response.message);
    });
  };

  //-----------------Reject application handler------------------------------------
  $scope.rejectApplication = function () {
    var finalArray = [];

    var auth = {};
    auth.usrCode = appService.getSessionVariable('userID');

    //Add authoriser property for all objects
    for (var i in $scope.applicationsForAuth) {
      $scope.applicationsForAuth[i].appAuthoriser = auth;
      finalArray.push($scope.applicationsForAuth[i]);
    }
    var payload = {};
    payload.token = appService.getSessionVariable('token');
    payload.object = finalArray;

    appService.genericUnpaginatedRequest(payload, appService.REJECT_APPLICATIONS).success(function (response) {
      console.log(response);
      if (response.requestStatus === true) {
        appService.showToast(response.message);
        $scope.populateAllTables();
      } else {
        appService.showToast(response.message);
        $rootScope.$emit("sessionTimeOut", {});
      }
    }).error(function (response) {
      appService.showToast(response.message);
    });
  };

  //-----------------Reject payment handler-----------------------------------------
  $scope.rejectPayment = function () {
    var finalArray = [];

    var auth = {};
    auth.usrCode = appService.getSessionVariable('userID');

    //Add authoriser property for all objects
    for (var i in $scope.paymentsForAuth) {
      $scope.paymentsForAuth[i].payAuthoriser = auth;
      finalArray.push($scope.paymentsForAuth[i]);
    }
    var payload = {};
    payload.token = appService.getSessionVariable('token');
    payload.object = finalArray;

    appService.genericUnpaginatedRequest(payload, appService.REJECT_PAYMENTS).success(function (response) {
      console.log(response);
      if (response.requestStatus === true) {
        appService.showToast(response.message);
        $scope.populateAllTables();
      } else {
        appService.showToast(response.message);
        $rootScope.$emit("sessionTimeOut", {});
      }
    }).error(function (response) {
      appService.showToast(response.message);
    });
  };

  //-----------------Reject refund handler-------------------------------------------
  $scope.rejectRefunds = function () {
    var finalArray = [];

    var auth = {};
    auth.usrCode = appService.getSessionVariable('userID');

    //Add authoriser property for all objects
    for (var i in $scope.refundsForAuth) {
      $scope.refundsForAuth[i].rfdAuthoriser = auth;
      finalArray.push($scope.refundsForAuth[i]);
    }
    var payload = {};
    payload.token = appService.getSessionVariable('token');
    payload.object = finalArray;

    appService.genericUnpaginatedRequest(payload, appService.REJECT_REFUND).success(function (response) {
      if (response.requestStatus === true) {
        appService.showToast(response.message);
        $scope.populateAllTables();
      } else {
        appService.showToast(response.message);
        $rootScope.$emit("sessionTimeOut", {});
      }
    }).error(function (response) {
      appService.showToast(response.message);
    });
  };

  //-----------------Reject received handler-----------------------------------------
  $scope.rejectReceived = function () {
    var finalArray = [];

    var auth = {};
    auth.usrCode = appService.getSessionVariable('userID');

    //Add authoriser property for all objects
    for (var i in $scope.receivedForAuth) {
      $scope.receivedForAuth[i].payAuthoriser = auth;
      finalArray.push($scope.receivedForAuth[i]);
    }
    var payload = {};
    payload.token = appService.getSessionVariable('token');
    payload.object = finalArray;

    appService.genericUnpaginatedRequest(payload, appService.REJECT_RECEIVED).success(function (response) {
      if (response.requestStatus === true) {
        appService.showToast(response.message);
        $scope.populateAllTables();
      } else {
        appService.showToast(response.message);
        $rootScope.$emit("sessionTimeOut", {});
      }
    }).error(function (response) {
      appService.showToast(response.message);
    });
  };

  /*************************************************************************************************
   *
   * *********************************VIEW DETAILS HANDLERS*******************************
   *
   * ***********************************************************************************************/

    //-----------------View Batch details handler--------------------------------------
  $scope.viewBatchDetails = function (batch) {
    var batchObject = {};
    batchObject.batCode = batch.batCode;

    var appBatCode = {};
    appBatCode.appBatCode = batchObject;

    var detailsPayload = {};
    detailsPayload.token = appService.getSessionVariable('token');
    detailsPayload.object = appBatCode;

    //Get applications in batch
    appService.genericPaginatedRequest(detailsPayload, appService.GET_APPS_IN_BATCH, 0, 5).success(function (response) {
      console.log(response);
      if (response.requestStatus === true) {
        $scope.applications = [];
        $scope.applications = response.payload.content;
        $scope.applicationTotalItems = response.payload.totalElements;
        $scope.applicationCurrentPage = (response.payload.number + 1);
        $scope.applicationNumPages = response.payload.totalPages;
        //Go to applications tab
        $scope.selectedTab = 2;
      } else {
        appService.showToast(response.message);
        $rootScope.$emit("sessionTimeOut", {});
        console.log(response);
      }
    }).error(function (response) {
      appService.showToast(response.message);
      console.log(response);
    });
  };

  //-----------------View Application details handler--------------------------------------
  $scope.viewApplicationDetails = function (application) {
    var palCode = {};
    palCode.payAppCusPalCode = application.appCusPalCode.cusPalCode;

    var detailsPayload = {};
    detailsPayload.token = appService.getSessionVariable('token');
    detailsPayload.object = palCode;

    console.log(detailsPayload);
    //Get payments for applications
    appService.genericPaginatedRequest(detailsPayload, appService.GET_PAYMENTS_FOR_APPLICATION, 0, 5).success(function (response) {
      if (response.requestStatus === true) {
        $scope.payments = [];
        if (!angular.equals(response.payload, null)) {
          appService.showToast(response.message);
          $scope.payments = response.payload.content;
          $scope.paymentsTotalItems = response.payload.totalElements;
          $scope.paymentsCurrentPage = (response.payload.number + 1);
          $scope.paymentsNumPages = response.payload.totalPages;
          //Go to payments tab
          $scope.selectedTab = 3;
        } else {
          appService.showToast(response.message);
        }
      } else {
        appService.showToast(response.message);
        $rootScope.$emit("sessionTimeOut", {});
        console.log(response);
      }
    }).error(function (response) {
      appService.showToast(response.message);
      console.log(response);
    });
  };

  //-----------------View Customer details handler--------------------------------------
  $scope.viewCustomerDetailsModal = function(customer){
    $scope.customer = customer;
    $mdDialog.show({
      controller: customerDetailsController,
      templateUrl: 'views/shares/customer_add.html',
      resolve: {
        customer: function () {
          return $scope.customer;
        }
      }
    });
  };

  function customerDetailsController($scope, $mdDialog, customer) {
    $scope.modalTitle = "Customer Details";
    $scope.customer = customer;
    $scope.customer.cusPhone = parseInt(customer.cusPhone);
    $scope.customer.cusSharesAcNo = parseInt(customer.cusSharesAcNo);
    $scope.customer.cusShareholding = parseInt(customer.cusShareholding);
    console.log( $scope.customer);
    $scope.closeModal = function () {
      $mdDialog.cancel();
    };
  }


  /*************************************************************************************************
   *
   * *********************************PAGE CHANGE HANDLERS*******************************
   *
   * ***********************************************************************************************/

    //-----------------Batch page change handler(Tab 1)--------------------------------
  $scope.batchPageChanged = function (currentPage, itemsPerPage) {
    appService.genericPaginatedRequest(listingPayload, appService.LIST_BATCHES, currentPage - 1, itemsPerPage).success(function (response) {
      if (response.requestStatus == true) {
        $scope.batches = [];
        $scope.batches = response.payload.content;
        $scope.batchTotalItems = response.payload.totalElements;
        $scope.batchCurrentPage = (response.payload.number + 1);
        $scope.batchNumPages = response.payload.totalPages;
      } else {
        appService.showToast(response.message);
        $rootScope.$emit("sessionTimeOut", {});
      }
    }).error(function (response) {
      appService.showToast(response.message);
    });
  };

  //-----------------Customers page change handler--------------------
  $scope.customersPageChanged = function (currentPage, itemsPerPage) {
    appService.genericPaginatedRequest(listingPayload, appService.LIST_CUSTOMERS, currentPage - 1, itemsPerPage).success(function (response) {
      if (response.requestStatus == true) {
        $scope.customers = [];
        $scope.customers = response.payload.content;
        $scope.customersTotalItems = response.payload.totalElements;
        $scope.customersCurrentPage = (response.payload.number + 1);
        $scope.customersNumPages = response.payload.totalPages;
      } else {
        appService.showToast(response.message);
        $rootScope.$emit("sessionTimeOut", {});
      }
    }).error(function (response) {
      appService.showToast(response.message);
    });
  };

  //-----------------Applications page change handler--------------------------------
  $scope.applicationPageChanged = function (currentPage, itemsPerPage) {
    appService.genericPaginatedRequest(listingPayload, appService.LIST_APPLICATIONS, currentPage - 1, itemsPerPage).success(function (response) {
      if (response.requestStatus == true) {
        $scope.applications = [];
        $scope.applications = response.payload.content;
        $scope.applicationTotalItems = response.payload.totalElements;
        $scope.applicationCurrentPage = (response.payload.number + 1);
        $scope.applicationNumPages = response.payload.totalPages;

      } else {
        appService.showToast(response.message);
        $rootScope.$emit("sessionTimeOut", {});
      }
    }).error(function (response) {
      appService.showToast(response.message);
    });
  };

  //-----------------Payments page change handler--------------------------------
  $scope.paymentsPageChanged = function (currentPage, itemsPerPage) {
    appService.genericPaginatedRequest(listingPayload, appService.LIST_PAYMENTS, currentPage - 1, itemsPerPage).success(function (response) {
      if (response.requestStatus == true) {
        $scope.payments = [];
        $scope.payments = response.payload.content;
        $scope.paymentsTotalItems = response.payload.totalElements;
        $scope.paymentsCurrentPage = (response.payload.number + 1);
        $scope.paymentsNumPages = response.payload.totalPages;

      } else {
        appService.showToast(response.message);
        $rootScope.$emit("sessionTimeOut", {});
      }
    }).error(function (response) {
      appService.showToast(response.message);
    });
  };

  //-----------------Refunds page change handler--------------------------------
  $scope.refundsPageChanged = function (currentPage, itemsPerPage) {
    appService.genericPaginatedRequest(listingPayload, appService.LIST_REFUNDS, currentPage - 1, itemsPerPage).success(function (response) {
      if (response.requestStatus == true) {
        $scope.refunds = [];
        $scope.refunds = response.payload.content;
        $scope.refundsTotalItems = response.payload.totalElements;
        $scope.refundsCurrentPage = (response.payload.number + 1);
        $scope.refundsNumPages = response.payload.totalPages;

      } else {
        appService.showToast(response.message);
        $rootScope.$emit("sessionTimeOut", {});
      }
    }).error(function (response) {
      appService.showToast(response.message);
    });
  };

  //-----------------Refunds page change handler--------------------------------
  $scope.receivedPageChanged = function (currentPage, itemsPerPage) {
    appService.genericPaginatedRequest(listingPayload, appService.LIST_RECEIVED, currentPage - 1, itemsPerPage).success(function (response) {
      if (response.requestStatus == true) {
        $scope.received = [];
        $scope.received = response.payload.content;
        $scope.receivedTotalItems = response.payload.totalElements;
        $scope.receivedCurrentPage = (response.payload.number + 1);
        $scope.receivedNumPages = response.payload.totalPages;
      } else {
        appService.showToast(response.message);
        $rootScope.$emit("sessionTimeOut", {});
      }
    }).error(function (response) {
      appService.showToast(response.message);
    });
  };

  /*************************************************************************************************
   *
   * *********************************MODAL LAUNCHERS AND CONTROLLERS*******************************
   *
   * ***********************************************************************************************/

    //-------------------Add Batch Modal Launcher and Controller---------------------------------
  $scope.addBatchModal = function () {
    $mdDialog.show({
      controller: addBatchController,
      templateUrl: 'views/shares/batch_add.html'
    });
  };

  function addBatchController($scope, $mdDialog, appService) {
    $scope.modalTitle = "New Batch";

    //---------------Add new batch method---------------------------
    $scope.saveRecord = function (batch) {
      var broker = {};
      broker.brkCode = appService.getSessionVariable('brokerCode');
      batch.batBrkCode = broker;

      var inputter = {};
      inputter.usrCode = appService.getSessionVariable('userID');
      batch.batInputter = inputter;

      var newBatch = {};
      newBatch.token = appService.getSessionVariable('token');
      newBatch.object = batch;

      appService.genericUnpaginatedRequest(newBatch, appService.ADD_BATCH).success(function (response) {
        if (response.requestStatus === true) {
          appService.showToast("Batch " + response.payload.batCode + " added successfully");
          $rootScope.$emit("requestTableRefresh", {});
        } else {
          appService.showToast(response.message);
          $rootScope.$emit("sessionTimeOut", {});
        }
      }).error(function (response) {
        appService.showToast(response.message);
      });
      $mdDialog.hide();
    };

    $scope.closeModal = function () {
      $mdDialog.cancel();
    };
  }

  //-------------------Add Customer Modal Launcher and Controller---------------------------------
  $scope.addCustomerModal = function () {
    $mdDialog.show({
      controller: addCustomerController,
      templateUrl: 'views/shares/customer_add.html'
    });
  };

  function addCustomerController($scope, $mdDialog, appService) {
    $scope.modalTitle = "New Customer";

    //---------------Add new customer method---------------------------
    $scope.saveRecord = function (customer) {
      var inputter = {};
      inputter.usrCode = appService.getSessionVariable('userID');
      customer.cusInputter = inputter;

      var newCustomer = {};
      newCustomer.token = appService.getSessionVariable('token');
      newCustomer.object = customer;
      console.log(customer);

      appService.genericUnpaginatedRequest(newCustomer, appService.ADD_CUSTOMER).success(function (response) {
        if (response.requestStatus === true) {
          appService.showToast(response.payload.cusName + " added successfully");
          $rootScope.$emit("requestTableRefresh", {});
        } else {
          appService.showToast(response.message);
          $rootScope.$emit("sessionTimeOut", {});
        }
      }).error(function (response) {
        appService.showToast(response.message);
      });
      $mdDialog.hide();
    };

    $scope.closeModal = function () {
      $mdDialog.cancel();
    };
  }

  //-------------------Add Application Modal Launcher and Controller---------------------------------
  $scope.addApplicationModal = function () {
    $mdDialog.show({
      controller: addApplicationController,
      templateUrl: 'views/shares/application_add.html'
    });
  };

  function addApplicationController($scope, $mdDialog, appService) {
    $scope.modalTitle = "New Application";
    $scope.batchList = [];
    $scope.customerList = [];
    $scope.application = {};

    var listing_payload = {};
    listing_payload.token = appService.getSessionVariable('token');
    listing_payload.object = null;

    //----------------Get batch list-------------------------
    appService.genericUnpaginatedRequest(listing_payload, appService.GET_BATCH_LIST).success(function (response) {
      if (response.requestStatus === true) {
        $scope.batchList = response.payload;
      } else {
        appService.showToast(response.message);
        $rootScope.$emit("sessionTimeOut", {});
      }
    }).error(function (response) {
      appService.showToast(response.message);
    });

    //----------------Get customer autocomplete list-------------------------
    $scope.getMatchingCustomers = function (searchText) {
      var searchObj = {};
      searchObj.cusName = searchText;

      var listing_payload = {};
      listing_payload.token = appService.getSessionVariable('token');
      listing_payload.object = searchObj;

      appService.genericUnpaginatedRequest(listing_payload, appService.GET_CUSTOMER_LIST).success(function (response) {
        if (response.requestStatus === true) {
          $scope.customerList = [];
          $scope.customerList = response.payload;
        } else {
          appService.showToast(response.message);
          $rootScope.$emit("sessionTimeOut", {});
        }
      }).error(function (response) {
        appService.showToast(response.message);
      });
    };

    //---------------Add new Application method---------------------------
    $scope.saveRecord = function (application) {
      var finalBatCode = {};
      finalBatCode.batCode = application.appBatCode;
      application.appBatCode = finalBatCode;

      var palCode = {};
      appService.setSessionVariable('palCode', application.lookup.cusPalCode);
      palCode.cusPalCode = application.lookup.cusPalCode;
      application.appCusPalCode = palCode;

      var inputter = {};
      inputter.usrCode = appService.getSessionVariable('userID');
      application.appInputter = inputter;

      var newApplication = {};
      newApplication.token = appService.getSessionVariable('token');
      newApplication.object = application;
      console.log(application);

      appService.genericUnpaginatedRequest(newApplication, appService.ADD_APPLICATION).success(function (response) {
        console.log(response);
        if (response.requestStatus === true) {
          appService.showToast(response.message);
          $rootScope.$emit("requestTableRefresh", {});
          //Go to applications tab and pop up payments modal
          $rootScope.$emit("launchPaymentsModal", {});
        } else {
          appService.showToast(response.message);
          $rootScope.$emit("sessionTimeOut", {});
        }
      }).error(function (response) {
        appService.showToast(response.message);
      });
      $mdDialog.hide();
    };

    $scope.closeModal = function () {
      $mdDialog.cancel();
    };
  }

  //-------------------Add Payment Modal Launcher and Controller---------------------------------
  $scope.addPaymentModal = function () {
    $mdDialog.show({
      controller: addPaymentController,
      templateUrl: 'views/shares/payments_add.html'
    });
  };

  function addPaymentController($scope, $mdDialog, appService) {
    $scope.payment = {};
    $scope.payment.payAppCusPalCode = appService.getSessionVariable('palCode');
    appService.deleteSessionVariable('palCode');
    $scope.modalTitle = "New Payment";

    //---------------Add new payment method---------------------------
    $scope.saveRecord = function (payment) {
      var inputter = {};
      inputter.usrCode = appService.getSessionVariable('userID');
      payment.payInputter = inputter;

      var newPayment = {};
      newPayment.token = appService.getSessionVariable('token');
      newPayment.object = payment;

      appService.genericUnpaginatedRequest(newPayment, appService.ADD_PAYMENT).success(function (response) {
        if (response.requestStatus === true) {
          appService.showToast(response.message);
          $rootScope.$emit("requestTableRefresh", {});
        } else {
          appService.showToast(response.message);
          $rootScope.$emit("sessionTimeOut", {});
        }
      }).error(function (response) {
        appService.showToast(response.message);
      });
      $mdDialog.hide();
    };

    $scope.closeModal = function () {
      $mdDialog.cancel();
    };
  }

  //-------------------Add Refund Modal Launcher and Controller---------------------------------
  $scope.addRefundModal = function () {
    $mdDialog.show({
      controller: addRefundController,
      templateUrl: 'views/shares/refunds_add.html'
    });
  };

  function addRefundController($scope, $mdDialog, appService) {
    $scope.modalTitle = "New Refund";
    $scope.payCodeList = [];
    $scope.appCodeList = [];

    var listing_payload = {};
    listing_payload.token = appService.getSessionVariable('token');
    listing_payload.object = null;

    //----------------Get pay code list-------------------------
    appService.genericUnpaginatedRequest(listing_payload, appService.GET_PAY_CODE_LIST).success(function (response) {
      if (response.requestStatus === true) {
        $scope.payCodeList = response.payload;
      } else {
        appService.showToast(response.message);
        $rootScope.$emit("sessionTimeOut", {});
      }
    }).error(function (response) {
      appService.showToast(response.message);
    });

    //----------------Get application code list-------------------------
    appService.genericUnpaginatedRequest(listing_payload, appService.GET_APP_CODE_LIST).success(function (response) {
      if (response.requestStatus === true) {
        $scope.appCodeList = response.payload;
      } else {
        appService.showToast(response.message);
        $rootScope.$emit("sessionTimeOut", {});
      }
    }).error(function (response) {
      appService.showToast(response.message);
    });

    //---------------Add new refund method---------------------------
    $scope.saveRecord = function (refund) {
      var rfdPayCode = {};
      rfdPayCode.payCode = refund.rfdPayCode;
      refund.rfdPayCode = rfdPayCode;

      var rfdAppCode = {};
      rfdAppCode.appCode = refund.rfdAppCode;
      refund.rfdAppCode = rfdAppCode;

      var inputter = {};
      inputter.usrCode = appService.getSessionVariable('userID');
      refund.rfdInputter = inputter;

      var newRefund = {};
      newRefund.token = appService.getSessionVariable('token');
      newRefund.object = refund;
      console.log(refund);

      appService.genericUnpaginatedRequest(newRefund, appService.ADD_REFUND).success(function (response) {
        if (response.requestStatus === true) {
          appService.showToast(response.message);
          $rootScope.$emit("requestTableRefresh", {});
          //Go to applications tab and pop up payments modal
        } else {
          appService.showToast(response.message);
          $rootScope.$emit("sessionTimeOut", {});
        }
      }).error(function (response) {
        appService.showToast(response.message);
      });
      $mdDialog.hide();
    };

    $scope.closeModal = function () {
      $mdDialog.cancel();
    };
  }

  //-------------------Edit Batch Modal Launcher and Controller----------------------------------
  $scope.editBatchModal = function (oldBatch) {
    $scope.oldBatch = oldBatch;
    $mdDialog.show({
      controller: editBatchController,
      templateUrl: 'views/shares/batch_add.html',
      resolve: {
        oldBatch: function () {
          return $scope.oldBatch;
        }
      }
    });
  };

  function editBatchController($scope, $mdDialog, appService, oldBatch) {
    $scope.modalTitle = "Edit batch - " + oldBatch.batCode;
    $scope.batch = oldBatch;
    $scope.batch.batTotalShares = parseInt(oldBatch.batTotalShares);

    //---------------Edit batch method---------------------------
    $scope.saveRecord = function (batch) {
      var auth = {};
      auth.usrCode = appService.getSessionVariable('userID');

      batch.batInputter = auth;

      var editedBatch = {};
      editedBatch.token = appService.getSessionVariable('token');
      editedBatch.object = batch;

      console.log(batch);

      appService.genericUnpaginatedRequest(editedBatch, appService.EDIT_BATCH).success(function (response) {
        if (response.requestStatus === true) {
          appService.showToast(response.message);
          $rootScope.$emit("requestTableRefresh", {});
        } else {
          appService.showToast(response.message);
          $rootScope.$emit("sessionTimeOut", {});
        }
      }).error(function (response) {
        appService.showToast(response.message);
      });
      $mdDialog.hide();
    };

    $scope.closeModal = function () {
      $mdDialog.cancel();
    };
  }

  //-------------------Edit Customer Modal Launcher and Controller-------------------------------
  $scope.editCustomerModal = function (oldCustomer) {
    $scope.oldCustomer = oldCustomer;
    $mdDialog.show({
      controller: editCustomerController,
      templateUrl: 'views/shares/customer_add.html',
      resolve: {
        oldCustomer: function () {
          return $scope.oldCustomer;
        }
      }
    });
  };

  function editCustomerController($scope, $mdDialog, appService, oldCustomer) {
    $scope.modalTitle = "Edit customer - " + oldCustomer.cusName;
    $scope.customer = oldCustomer;
    $scope.customer.cusPhone = parseInt(oldCustomer.cusPhone);
    $scope.customer.cusSharesAcNo = parseInt(oldCustomer.cusSharesAcNo);
    $scope.customer.cusShareholding = parseInt(oldCustomer.cusShareholding);

    //---------------Edit customer method---------------------------
    $scope.saveRecord = function (customer) {
      var auth = {};
      auth.usrCode = appService.getSessionVariable('userID');

      customer.cusInputter = auth;

      var editedCustomer = {};
      editedCustomer.token = appService.getSessionVariable('token');
      editedCustomer.object = customer;

      appService.genericUnpaginatedRequest(editedCustomer, appService.EDIT_CUSTOMER).success(function (response) {
        if (response.requestStatus === true) {
          appService.showToast(response.message);
          $rootScope.$emit("requestTableRefresh", {});
        } else {
          appService.showToast(response.message);
          $rootScope.$emit("sessionTimeOut", {});
        }
      }).error(function (response) {
        appService.showToast(response.message);
      });
      $mdDialog.hide();
    };

    $scope.closeModal = function () {
      $mdDialog.cancel();
    };
  }

  //-------------------Edit Application Modal Launcher and Controller----------------------------
  $scope.editApplicationModal = function (oldApplication) {
    $scope.oldApplication = oldApplication;
    $mdDialog.show({
      controller: editApplicationController,
      templateUrl: 'views/shares/application_add.html',
      resolve: {
        oldApplication: function () {
          return $scope.oldApplication;
        }
      }
    });
  };

  function editApplicationController($scope, $mdDialog, appService, oldApplication) {
    $scope.batchList = [];
    $scope.modalTitle = "Edit application - " + oldApplication.appCode;
    $scope.application = oldApplication;
    $scope.application.appCustMobileNo = parseInt(oldApplication.appCustMobileNo);
    $scope.application.appSharesApplied = parseInt(oldApplication.appSharesApplied);
    $scope.application.appBatCode = oldApplication.appBatCode.batCode;

    var listing_payload = {};
    listing_payload.token = appService.getSessionVariable('token');
    listing_payload.object = null;

    //----------------Get batch list-------------------------
    appService.genericUnpaginatedRequest(listing_payload, appService.GET_BATCH_LIST).success(function (response) {
      if (response.requestStatus === true) {
        $scope.batchList = response.payload;
      } else {
        appService.showToast(response.message);
        $rootScope.$emit("sessionTimeOut", {});
      }
    }).error(function (response) {
      appService.showToast(response.message);
    });

    //---------------Edit application method---------------------------
    $scope.saveRecord = function (application) {
      var finalBatCode = {};
      finalBatCode.batCode = application.appBatCode;
      application.appBatCode = finalBatCode;

      var auth = {};
      auth.usrCode = appService.getSessionVariable('userID');
      application.appInputter = auth;

      var editedApplication = {};
      editedApplication.token = appService.getSessionVariable('token');
      editedApplication.object = application;

      appService.genericUnpaginatedRequest(editedApplication, appService.EDIT_APPLICATION).success(function (response) {
        if (response.requestStatus === true) {
          appService.showToast(response.message);
          $rootScope.$emit("requestTableRefresh", {});
        } else {
          appService.showToast(response.message);
          $rootScope.$emit("sessionTimeOut", {});
        }
      }).error(function (response) {
        appService.showToast(response.message);
      });
      $mdDialog.hide();
    };

    $scope.closeModal = function () {
      $mdDialog.cancel();
    };
  }

  //-------------------Edit Payments Modal Launcher and Controller-------------------------------
  $scope.editPaymentsModal = function (oldPayment) {
    $scope.oldPayment = oldPayment;
    $mdDialog.show({
      controller: editPaymentsController,
      templateUrl: 'views/shares/payments_add.html',
      resolve: {
        oldPayment: function () {
          return $scope.oldPayment;
        }
      }
    });
  };

  function editPaymentsController($scope, $mdDialog, appService, oldPayment) {
    $scope.modalTitle = "Edit payment for - " + oldPayment.payAppCusPalCode.appCusPalCode.cusName;
    $scope.payment = oldPayment;
    $scope.payment.payAppCusPalCode = oldPayment.payAppCusPalCode.appCusPalCode.cusPalCode;
    $scope.payment.payBankCode = parseInt(oldPayment.payBankCode);
    $scope.payment.payAccountNo = parseInt(oldPayment.payAccountNo);
    $scope.payment.payAmount = parseInt(oldPayment.payAmount);
    $scope.payment.payChequeNo = parseInt(oldPayment.payChequeNo);
    $scope.payment.payPhoneNo = parseInt(oldPayment.payPhoneNo);

    //---------------Edit payment method---------------------------
    $scope.saveRecord = function (payment) {
      var auth = {};
      auth.usrCode = appService.getSessionVariable('userID');

      payment.payInputter = auth;

      var editedPayment = {};
      editedPayment.token = appService.getSessionVariable('token');
      editedPayment.object = payment;

      console.log(payment);

      appService.genericUnpaginatedRequest(editedPayment, appService.EDIT_PAYMENT).success(function (response) {
        if (response.requestStatus === true) {
          appService.showToast(response.message);
          $rootScope.$emit("requestTableRefresh", {});
        } else {
          appService.showToast(response.message);
          $rootScope.$emit("sessionTimeOut", {});
        }
      }).error(function (response) {
        appService.showToast(response.message);
      });
      $mdDialog.hide();
    };

    $scope.closeModal = function () {
      $mdDialog.cancel();
    };
  }

  //-------------------Edit Refunds Modal Launcher and Controller-------------------------------
  $scope.editRefundModal = function (oldRefund) {
    $scope.oldRefund = oldRefund;
    $mdDialog.show({
      controller: editRefundController,
      templateUrl: 'views/shares/refunds_add.html',
      resolve: {
        oldRefund: function () {
          return $scope.oldRefund;
        }
      }
    });
  };

  function editRefundController($scope, $mdDialog, appService, oldRefund) {
    $scope.modalTitle = "Edit refund - " + oldRefund.rfdCode;
    $scope.payCodeList = [];
    $scope.appCodeList = [];
    $scope.refund = oldRefund;
    $scope.refund.rfdBankCode = parseInt(oldRefund.rfdBankCode);
    $scope.refund.rfdAccountNo = parseInt(oldRefund.rfdAccountNo);
    $scope.refund.rfdChequeNo = parseInt(oldRefund.rfdChequeNo);
    $scope.refund.rfdPhoneNo = parseInt(oldRefund.rfdPhoneNo);

    var listing_payload = {};
    listing_payload.token = appService.getSessionVariable('token');
    listing_payload.object = null;

    //----------------Get pay code list-------------------------
    appService.genericUnpaginatedRequest(listing_payload, appService.GET_PAY_CODE_LIST).success(function (response) {
      if (response.requestStatus === true) {
        $scope.payCodeList = response.payload;
      } else {
        appService.showToast(response.message);
        $rootScope.$emit("sessionTimeOut", {});
      }
    }).error(function (response) {
      appService.showToast(response.message);
    });

    //----------------Get application code list-------------------------
    appService.genericUnpaginatedRequest(listing_payload, appService.GET_APP_CODE_LIST).success(function (response) {
      if (response.requestStatus === true) {
        $scope.appCodeList = response.payload;
      } else {
        appService.showToast(response.message);
        $rootScope.$emit("sessionTimeOut", {});
      }
    }).error(function (response) {
      appService.showToast(response.message);
    });

    //---------------Edit refund method---------------------------
    $scope.saveRecord = function (refund) {
      var rfdPayCode = {};
      rfdPayCode.payCode = refund.rfdPayCode;
      refund.rfdPayCode = rfdPayCode;

      var rfdAppCode = {};
      rfdAppCode.appCode = refund.rfdAppCode;
      refund.rfdAppCode = rfdAppCode;

      var auth = {};
      auth.usrCode = appService.getSessionVariable('userID');
      refund.rfdInputter = auth;

      var editedRefund = {};
      editedRefund.token = appService.getSessionVariable('token');
      editedRefund.object = refund;

      console.log(refund);

      appService.genericUnpaginatedRequest(editedRefund, appService.EDIT_REFUND).success(function (response) {
        if (response.requestStatus === true) {
          appService.showToast(response.message);
          $rootScope.$emit("requestTableRefresh", {});
        } else {
          appService.showToast(response.message);
          $rootScope.$emit("sessionTimeOut", {});
        }
      }).error(function (response) {
        appService.showToast(response.message);
      });
      $mdDialog.hide();
    };

    $scope.closeModal = function () {
      $mdDialog.cancel();
    };
  }

  //----------------Event Listeners-----------------------------------
  $rootScope.$on("requestTableRefresh", function () {
    $scope.populateAllTables();
  });

  $rootScope.$on("launchPaymentsModal", function () {
    $scope.selectedTab = 3;
    $scope.addPaymentModal();
  });
});//End of controller
