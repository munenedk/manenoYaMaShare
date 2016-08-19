//jshint ignore:start
// jscs:disable
'use strict';

/**
 * @ngdoc function
 * @name ipoApp.controller:CustomersCtrl
 * @description
 * # CustomersCtrl
 * Controller of the ipoApp
 * @author munenedk-pc
 */
app.controller('CustomersCtrl', function ($rootScope, $scope, $mdDialog, $state, appService) {
    //------------------Setup variables------------------------------------------------------
    $rootScope.userLoggedInAs = "";

    //Customers table pagination variables
    $scope.customersTotalItems = 1;
    $scope.customersCurrentPage = 1;
    $scope.customersItemsPerPage = 5;
    $scope.customersNumPages = 1;
    $scope.maxSize = 5; //Pagination component size

    //Array to hold customer table data
    $scope.customers = [];

    //Select one/select all models
    $scope.customerSelect = {};
    $scope.customerSelect.all = false;
    $scope.customerSelect.individual = [];
    $scope.customersForAuth = [];
    $scope.disableActions = true;

    //Global payload for all populate methods
    var listingPayload = {};
    listingPayload.token = appService.getSessionVariable('token');
    listingPayload.object = null;

    //------------------Runs first once page loads----------------------------------
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

    //-----------------------------Get customers list -------------------------------
    $scope.populateAllTables = function () {
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
    };

    //-----------------Search customer handler--------------------------------------
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

    //-----------------Select one customer handler--------------------------------------
    $scope.selectIndividualCustomer = function (row, id) {

        //Insert row if it does not exist
        if ($scope.customersForAuth.indexOf(row) === -1 && $scope.customerSelect.individual[id] === true) {
            //Add only pending approvals
            if (row.cusStatus === 2) {
                $scope.customersForAuth.push(row);
                //Check if checker
                //if ($scope.isClosureChecker) {
                $scope.disableActions = false;
                //}
            }

        } else if ($scope.customersForAuth.indexOf(row) > -1 && $scope.customerSelect.individual[id] === false) {
            //Remove it if it exists
            var index = $scope.customersForAuth.indexOf(row);
            $scope.customersForAuth.splice(index, 1);
            //Disable buttons if array has nothing
            if ($scope.customersForAuth.length === 0) {
                $scope.disableActions = true;
            }
        }
    };

    //-----------------Select all customers handler--------------------------------------
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
                        $scope.disableActions = false;
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
            $scope.disableActions = true;

        }
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

    /*************************************************************************************************
     *
     * *********************************MODAL LAUNCHERS AND CONTROLLERS*******************************
     *
     * ***********************************************************************************************/

    //-------------------Add Broker Modal Launcher and Controller---------------------------------
    $scope.addCustomerModal = function () {
        $mdDialog.show({
            controller: addCustomerController,
            templateUrl: 'views/customers/customer_add.html'
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

    //-------------------Edit Broker Modal Launcher and Controller-------------------------------
    $scope.editCustomerModal = function (oldCustomer) {
        $scope.oldCustomer = oldCustomer;
        $mdDialog.show({
            controller: editCustomerController,
            templateUrl: 'views/customers/customer_add.html',
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
                    appService.showToast(response.payload.cusName + " edited successfully");
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

}); //End of controller
