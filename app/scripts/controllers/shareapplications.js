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

    //-----------------------------Get Batches, Applications, Payments, Dividends--
    $scope.populateAllTables = function () {
        //Populate batches table
        //appService.genericPaginatedRequest(listingPayload, appService.LIST_BATCHES, 0, 5).success(function (response) {
        //    console.log(response);
        //    if (response.requestStatus === true) {
        //        $scope.batches = [];
        //        $scope.batches = response.payload.content;
        //        $scope.batchTotalItems = response.payload.totalElements;
        //        $scope.batchCurrentPage = (response.payload.number + 1);
        //        $scope.batchNumPages = response.payload.totalPages;
        //    } else {
        //        appService.showToast(response.message);
        //        $rootScope.$emit("sessionTimeOut", {});
        //        console.log(response);
        //    }
        //}).error(function (response) {
        //    appService.showToast(response.message);
        //    console.log(response);
        //});

        //Populate applications table
        //appService.genericPaginatedRequest(listingPayload, appService.LIST_APPLICATIONS, 0, 5).success(function (response) {
        //    console.log(response);
        //    if (response.requestStatus === true) {
        //        $scope.applications = [];
        //        $scope.applications = response.payload.content;
        //        $scope.applicationTotalItems = response.payload.totalElements;
        //        $scope.applicationCurrentPage = (response.payload.number + 1);
        //        $scope.applicationNumPages = response.payload.totalPages;
        //    } else {
        //        appService.showToast(response.message);
        //        $rootScope.$emit("sessionTimeOut", {});
        //        console.log(response);
        //    }
        //}).error(function (response) {
        //    appService.showToast(response.message);
        //    console.log(response);
        //});
        $scope.batches = [{
            batCode: '10001',
            batCreateDate: '15-Aug-2016',
            batTotalShares: '20000',
            batStatus: '1'
        }];
    };

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

    //-----------------Approve batch handler-----------------------------------------
    $scope.approveBatch = function () {
        var finalArray = [];

        var auth = {};
        auth.usrCode = appService.getSessionVariable('userID');

        //Add authoriser property for all objects
        for (var i in $scope.batchesForAuth) {
            $scope.batchesForAuth[i].batInputter = auth;
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

    //-----------------Reject batch handler-------------------------------------------
    $scope.rejectBatch = function () {
        var finalArray = [];

        var auth = {};
        auth.usrCode = appService.getSessionVariable('userID');

        //Add authoriser property for all objects
        for (var i in $scope.batchesForAuth) {
            $scope.batchesForAuth[i].batInputter = auth;
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

    //-----------------View Batch details handler--------------------------------------
    $scope.viewBatchDetails = function (batch) {
        console.log(batch);

        //Get applications in batch
        //appService.genericPaginatedRequest(listingPayload, appService.GET_APPS_IN_BATCH, 0, 5).success(function (response) {
        //    console.log(response);
        //    if (response.requestStatus === true) {
        //        $scope.applications = [];
        //        $scope.applications = response.payload.content;
        //        $scope.applicationTotalItems = response.payload.totalElements;
        //        $scope.applicationCurrentPage = (response.payload.number + 1);
        //        $scope.applicationNumPages = response.payload.totalPages;
        //    } else {
        //        appService.showToast(response.message);
        //        $rootScope.$emit("sessionTimeOut", {});
        //        console.log(response);
        //    }
        //}).error(function (response) {
        //    appService.showToast(response.message);
        //    console.log(response);
        //});

        //Go to applications tab
        $scope.selectedTab = 1;

    };

    //-----------------Batch page change handler(Tab 1)--------------------------------
    $scope.batchPageChanged = function (currentPage, itemsPerPage) {
        appService.genericPaginatedRequest(listingPayload, appService.LIST_BATCHES, currentPage - 1, itemsPerPage).success(function (response) {
            if (response.requestStatus === false) {
                appService.showToast(response.message);
            } else {
                $scope.batches = [];
                $scope.batches = response.payload.content;
                $scope.batchTotalItems = response.payload.totalElements;
                $scope.batchCurrentPage = (response.payload.number + 1);
                $scope.batchNumPages = response.payload.totalPages;
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

        //---------------Add new user method---------------------------
        $scope.saveRecord = function (batch) {
            var inputter = {};
            inputter.usrCode = appService.getSessionVariable('userID');
            batch.batInputter = inputter;

            var newBatch = {};
            newBatch.token = appService.getSessionVariable('token');
            newBatch.object = batch;
            console.log(batch);

            appService.genericUnpaginatedRequest(newBatch, appService.ADD_BATCH).success(function (response) {
                if (response.requestStatus === true) {
                    appService.showToast("Batch " + response.payload.batCode + " added successfully");
                    $rootScope.$emit("requestTableRefresh", {});
                } else {
                    appService.showToast(response.message);
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

    $rootScope.$on("requestTableRefresh", function () {
        $scope.populateAllTables();
    });
});//End of controller
