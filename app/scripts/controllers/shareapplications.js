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

    $scope.applicationTotalItems = 1;
    $scope.applicationCurrentPage = 1;
    $scope.applicationItemsPerPage = 5;
    $scope.applicationNumPages = 1;

    $scope.paymentsTotalItems = 1;
    $scope.paymentsCurrentPage = 1;
    $scope.paymentsItemsPerPage = 5;
    $scope.paymentsNumPages = 1;

    $scope.dividendsRolesTotalItems = 1;
    $scope.dividendsRolesCurrentPage = 1;
    $scope.dividendsRolesItemsPerPage = 5;
    $scope.dividendsRolesNumPages = 1;

    //Arrays to hold table data
    $scope.batches = [];
    $scope.applications = [];
    $scope.payments = [];
    $scope.dividends = [];

    //Batch select one/select all models
    $scope.batchSelect = {};
    $scope.batchSelect.all = false;
    $scope.batchSelect.individual = [];
    $scope.batchesForAuth = [];
    $scope.disableActions = true;

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

    //Global payload for all populate methods
    var listingPayload = {};
    listingPayload.token = appService.getSessionVariable('token');
    listingPayload.object = null;

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

    //-----------------------------Get Batches, Applications, Payments, Dividends----------
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
            console.log(response);
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
    };

    /*************************************************************************************************
     *
     * *********************************SEARCH HANDLERS*******************************
     *
     * ***********************************************************************************************/

    //-----------------Search batch handler----------------------------------------
    $scope.searchBatch = function (search) {
        var payload = {};
        payload.token = appService.getSessionVariable('token');
        payload.object = search;

        appService.genericUnpaginatedRequest(payload, appService.SEARCH_BATCH).success(function (response) {
            if (response.requestStatus === true) {
                appService.showToast(response.message);
                $scope.batches = [];
                $scope.batches.push(response.payload);
                $scope.batchTotalItems = 1;
                $scope.batchCurrentPage = 1;
                $scope.batchNumPages = 1;
            } else {
                appService.showToast(response.message);
                $rootScope.$emit("sessionTimeOut", {});
            }
        }).error(function (response) {
            appService.showToast(response.message);
        });
    };

    //-----------------Search application handler-----------------------------------
    $scope.searchApplication = function (search) {
        var payload = {};
        payload.token = appService.getSessionVariable('token');
        payload.object = search;

        appService.genericUnpaginatedRequest(payload, appService.SEARCH_APPLICATION).success(function (response) {
            if (response.requestStatus === true) {
                appService.showToast(response.message);
                $scope.applications = [];
                $scope.applications.push(response.payload);
                $scope.applicationTotalItems = 1;
                $scope.applicationCurrentPage = 1;
                $scope.applicationNumPages = 1;
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
                $scope.payments.push(response.payload);
                $scope.paymentsTotalItems = 1;
                $scope.paymentsCurrentPage = 1;
                $scope.paymentsNumPages = 1;
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

    /*************************************************************************************************
     *
     * *********************************SELECT ALL HANDLERS*******************************
     *
     * ***********************************************************************************************/

        //-----------------Select all batches handler------------------------------------
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

    //-----------------Select all applications handler------------------------------------
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

    /*************************************************************************************************
     *
     * *********************************REJECT HANDLERS*******************************
     *
     * ***********************************************************************************************/

    //-----------------Reject batch handler-------------------------------------------
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

    //-----------------Reject application handler-------------------------------------------
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

    //-----------------Reject payment handler-------------------------------------------
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

    /*************************************************************************************************
     *
     * *********************************VIEW DETAILS HANDLERS*******************************
     *
     * ***********************************************************************************************/

    //-----------------View Batch details handler--------------------------------------
    $scope.viewBatchDetails = function (batch) {
        var batchNumber = {};
        batchNumber.batCode = batch.batCode;

        var detailsPayload = {};
        detailsPayload.token = appService.getSessionVariable('token');
        detailsPayload.object = batchNumber;

        console.log(detailsPayload);

        //Get applications in batch
        appService.genericPaginatedRequest(detailsPayload, appService.GET_APPS_IN_BATCH, 0, 5).success(function (response) {
            console.log(response);
            if (response.requestStatus === true) {
                $scope.applications = [];
                $scope.applications = response.payload.content[0].applicationCollection;
                $scope.applicationTotalItems = response.payload.totalElements;
                $scope.applicationCurrentPage = (response.payload.number + 1);
                $scope.applicationNumPages = response.payload.totalPages;
                for(var i in $scope.applications){
                    $scope.applications[i].appBatCode = batch.batCode;
                }
                //Go to applications tab
                $scope.selectedTab = 1;
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
        console.log(application);

        var detailsPayload = {};
        detailsPayload.token = appService.getSessionVariable('token');
        detailsPayload.object = application;

        //Get payments for applications
        appService.genericPaginatedRequest(detailsPayload, appService.GET_PAYMENTS_FOR_APPLICATION, 0, 5).success(function (response) {
            console.log(response);
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

        //Go to applications tab
        $scope.selectedTab = 2;

    };

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

    //-----------------Applications page change handler(Tab 1)--------------------------------
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

    //-----------------Payments page change handler(Tab 1)--------------------------------
    $scope.paymentsPageChanged = function (currentPage, itemsPerPage) {
        appService.genericPaginatedRequest(listingPayload, appService.LIST_APPLICATIONS, currentPage - 1, itemsPerPage).success(function (response) {
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
                if (response.requestStatus === true) {
                    appService.showToast("Application for " + application.cusName + " added successfully");
                    $rootScope.$emit("requestTableRefresh", {});
                    //Go to applications tab and pop up payments modal
                    $scope.selectedTab = 2;
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
        $scope.modalTitle = "New Payment";

        //---------------Add new payment method---------------------------
        $scope.saveRecord = function (payment) {
            var inputter = {};
            inputter.usrCode = appService.getSessionVariable('userID');
            payment.payInputter = inputter;

            var newPayment = {};
            newPayment.token = appService.getSessionVariable('token');
            newPayment.object = payment;
            console.log(payment);

            appService.genericUnpaginatedRequest(newPayment, appService.ADD_PAYMENT).success(function (response) {
                if (response.requestStatus === true) {
                    appService.showToast("Payment for pal code " +payment.payAppCusPalCode+ " added successfully");
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

    //-------------------Edit Batch Modal Launcher and Controller-------------------------------
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
                    appService.showToast("Batch " + response.payload.batCode + " edited successfully");
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

    //-------------------Edit Application Modal Launcher and Controller-------------------------------
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
                    appService.showToast("Application " + response.payload.appCode + " edited successfully");
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

    //-------------------Edit Application Modal Launcher and Controller-------------------------------
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
        $scope.modalTitle = "Edit payment for application - " + oldPayment.payAppCusPalCode;
        $scope.payment = oldPayment;
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
                    appService.showToast("Payment for application " + response.payload.payAppCusPalCode + " edited successfully");
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
        $scope.addPaymentModal();
    });
});//End of controller
