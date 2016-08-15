//jshint ignore:start
// jscs:disable
'use strict';

/**
 * @ngdoc function
 * @name ipoApp.controller:BrokersCtrl
 * @description
 * # BrokersCtrl
 * Controller of the ipoApp
 */
app.controller('BrokersCtrl', function ($rootScope, $scope, $mdDialog, $state, appService) {
    //------------------Setup variables------------------------------------------------------
    $rootScope.userLoggedInAs = "";

    //Brokers table pagination variables
    $scope.brokersTotalItems = 1;
    $scope.brokersCurrentPage = 1;
    $scope.brokersItemsPerPage = 5;
    $scope.brokersNumPages = 1;
    $scope.maxSize = 5; //Pagination component size

    //Array to hold broker table data
    $scope.brokers = [];

    //Select one/select all models
    $scope.brokerSelect = {};
    $scope.brokerSelect.all = false;
    $scope.brokerSelect.individual = [];
    $scope.brokersForAuth = [];
    $scope.disableActions = true;

    //Global payload for all populate methods
    var listingPayload = {};
    listingPayload.token = appService.getSessionVariable('token');
    listingPayload.object = null;

    //------------------Runs first once page loads--------------------------------------------
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

    //-----------------------------Get Brokers list -------------------------------
    $scope.populateAllTables = function () {
        //Populate brokers table
        appService.genericPaginatedRequest(listingPayload, appService.LIST_BROKERS, 0, 5).success(function (response) {
            console.log(response);
            if (response.requestStatus === true) {
                $scope.brokers = [];
                $scope.brokers = response.payload.content;
                $scope.brokersTotalItems = response.payload.totalElements;
                $scope.brokersCurrentPage = (response.payload.number + 1);
                $scope.brokersNumPages = response.payload.totalPages;
            } else {
                appService.showToast(response.message);
                $rootScope.$emit("sessionTimeOut", {});
                console.log(response);
            }
        }).error(function (response) {
            appService.showToast(response.message);
            console.log(response);
        });
        //$scope.brokers = [{
        //    brkName: "Dyer and Blair",
        //    brkAddress: "47154-00100",
        //    brkTown: "Nairobi",
        //    brkPhone: 254722000000,
        //    brkEmail: "db@gmail.com",
        //    brkStatus: "1"
        //}];
    };

    //-----------------Search broker handler--------------------------------------
    $scope.searchBroker = function (search) {
        var payload = {};
        payload.token = appService.getSessionVariable('token');
        payload.object = search;

        appService.genericUnpaginatedRequest(payload, appService.SEARCH_BROKERS).success(function (response) {
            if (response.requestStatus === true) {
                appService.showToast(response.message);
                $scope.brokers = [];
                $scope.brokers.push(response.payload);
                $scope.brokersTotalItems = 1;
                $scope.brokersCurrentPage = 1;
                $scope.brokersNumPages = 1;
            } else {
                appService.showToast(response.message);
                $rootScope.$emit("sessionTimeOut", {});
            }
        }).error(function (response) {
            appService.showToast(response.message);
        });
    };

    //-----------------Select one broker handler--------------------------------------
    $scope.selectIndividualBroker = function (row, id) {

        //Insert row if it does not exist
        if ($scope.brokersForAuth.indexOf(row) === -1 && $scope.brokerSelect.individual[id] === true) {
            //Add only pending approvals
            if (row.brkStatus === 2) {
                $scope.brokersForAuth.push(row);
                //Check if checker
                //if ($scope.isClosureChecker) {
                $scope.disableActions = false;
                //}
            }

        } else if ($scope.brokersForAuth.indexOf(row) > -1 && $scope.brokerSelect.individual[id] === false) {
            //Remove it if it exists
            var index = $scope.brokersForAuth.indexOf(row);
            $scope.brokersForAuth.splice(index, 1);
            //Disable buttons if array has nothing
            if ($scope.brokersForAuth.length === 0) {
                $scope.disableActions = true;
            }
        }
    };

    //-----------------Select all users handler--------------------------------------
    $scope.selectAllBrokers = function (rows) {
        //If array is empty it knows you want to select all
        if ($scope.brokersForAuth.length === 0 || $scope.brokerSelect.all) {
            for (var i in rows) {
                //Insert rows if they dont exist
                if ($scope.brokersForAuth.indexOf(rows[i]) === -1) {
                    //Add only pending approvals
                    if (rows[i].brkStatus === 2) {
                        //Mark row as selected
                        $scope.brokerSelect.individual[i] = true;
                        $scope.brokersForAuth.push(rows[i]);
                        //Check if checker
                        //if ($scope.isClosureChecker) {
                        $scope.disableActions = false;
                        //}
                    }

                }
            }
        } else if ($scope.brokersForAuth.length > 0 && $scope.brokerSelect.all === false) {
            //Otherwise it knows you want to remove everything
            for (var i in rows) {
                $scope.brokerSelect.individual[i] = false;
            }
            $scope.brokersForAuth = [];
            $scope.disableActions = true;

        }
    };

    //-----------------Approve brokers handler--------------------------------------
    $scope.approveBrokers = function () {
        var finalArray = [];

        var auth = {};
        auth.usrCode = appService.getSessionVariable('userID');

        //Add authoriser property for all objects
        for (var i in $scope.brokersForAuth) {
            $scope.brokersForAuth[i].brkInputter = auth;
            finalArray.push($scope.brokersForAuth[i]);
        }
        var payload = {};
        payload.token = appService.getSessionVariable('token');
        payload.object = finalArray;

        appService.genericUnpaginatedRequest(payload, appService.APPROVE_BROKERS).success(function (response) {
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

    //-----------------Reject users handler--------------------------------------
    $scope.rejectBrokers = function () {
        var finalArray = [];

        var auth = {};
        auth.usrCode = appService.getSessionVariable('userID');

        //Add authoriser property for all objects
        for (var i in $scope.brokersForAuth) {
            $scope.brokersForAuth[i].brkInputter = auth;
            finalArray.push($scope.brokersForAuth[i]);
        }
        var payload = {};
        payload.token = appService.getSessionVariable('token');
        payload.object = finalArray;

        appService.genericUnpaginatedRequest(payload, appService.REJECR_BROKERS).success(function (response) {
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

    //-----------------Brokers page change handler--------------------
    $scope.brokersPageChanged = function (currentPage, itemsPerPage) {
        appService.genericPaginatedRequest(listingPayload, appService.LIST_BROKERS, currentPage - 1, itemsPerPage).success(function (response) {
            if (response.requestStatus === false) {
                appService.showToast(response.message);
            } else {
                $scope.brokers = [];
                $scope.brokers = response.payload.content;
                $scope.brokersTotalItems = response.payload.totalElements;
                $scope.brokersCurrentPage = (response.payload.number + 1);
                $scope.brokersNumPages = response.payload.totalPages;
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

        //-------------------Add User Modal Launcher and Controller---------------------------------
    $scope.addBrokerModal = function () {
        $mdDialog.show({
            controller: addBrokerController,
            templateUrl: 'views/brokers/brokers_add.html'
        });
    };

    function addBrokerController($scope, $mdDialog, appService) {
        $scope.modalTitle = "New Broker";
        $scope.brokerList = [];

        //---------------Add new user method---------------------------
        $scope.saveRecord = function (broker) {
            var inputter = {};
            inputter.usrCode = appService.getSessionVariable('userID');
            broker.brkInputter = inputter;

            var newBroker = {};
            newBroker.token = appService.getSessionVariable('token');
            newBroker.object = broker;
            console.log(broker);

            appService.genericUnpaginatedRequest(newBroker, appService.ADD_BROKER).success(function (response) {
                if (response.requestStatus === true) {
                    appService.showToast(response.payload.brkName + " added successfully");
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

    //-------------------Edit User Modal Launcher and Controller-------------------------------
    $scope.editBrokerModal = function (oldBroker) {
        $scope.oldBroker = oldBroker;
        $mdDialog.show({
            controller: editBrokerController,
            templateUrl: 'views/brokers/brokers_add.html',
            resolve: {
                oldBroker: function () {
                    return $scope.oldBroker;
                }
            }
        });
    };

    function editBrokerController($scope, $mdDialog, appService, oldBroker) {
        $scope.modalTitle = "Edit broker - " + oldBroker.brkName;
        $scope.broker = oldBroker;
        $scope.broker.brkPhone = parseInt(oldBroker.brkPhone);

        //---------------Edit broker method---------------------------
        $scope.saveRecord = function (broker) {
            var auth = {};
            auth.usrCode = appService.getSessionVariable('userID');

            broker.brkInputter = auth;

            var editedBroker = {};
            editedBroker.token = appService.getSessionVariable('token');
            editedBroker.object = broker;

            console.log(broker);

            appService.genericUnpaginatedRequest(editedBroker, appService.EDIT_BROKER).success(function (response) {
                if (response.requestStatus === true) {
                    appService.showToast(response.payload.brkName + " edited successfully");
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

}); //End of controller
