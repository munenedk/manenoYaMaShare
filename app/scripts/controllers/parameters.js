//jshint ignore:start
// jscs:disable
'use strict';

/**
 * @ngdoc function
 * @name ipoApp.controller:ParametersCtrl
 * @description
 * # ParametersCtrl
 * Controller of the ipoApp
 * @author munenedk-pc
 */
app.controller('ParametersCtrl', function ($rootScope, $scope, $mdDialog, $state, appService) {
    //------------------Setup variables-------------------------------------------
    $rootScope.userLoggedInAs = "";

    //Parameters table pagination variables
    $scope.parametersTotalItems = 1;
    $scope.parametersCurrentPage = 1;
    $scope.parametersItemsPerPage = 5;
    $scope.parametersNumPages = 1;
    $scope.maxSize = 5; //Pagination component size

    //Array to hold table data
    $scope.parameters = [];

    //Select one/select all models
    $scope.parameterSelect = {};
    $scope.parameterSelect.all = false;
    $scope.parameterSelect.individual = [];
    $scope.parametersForAuth = [];
    $scope.disableActions = true;

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

    //-----------------------------Get system parameters--------------------------------------
    $scope.populateAllTables = function () {
        //Populate system parameters table
        appService.genericPaginatedRequest(listingPayload, appService.LIST_PARAMETERS, 0, 5).success(function (response) {
            if (response.requestStatus === true) {
                $scope.parameters = [];
                $scope.parameters = response.payload.content;
                $scope.parametersTotalItems = response.payload.totalElements;
                $scope.parametersCurrentPage = (response.payload.number + 1);
                $scope.parametersNumPages = response.payload.totalPages;
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

    //-----------------Search parameter handler--------------------------------------
    $scope.searchParameter = function (search) {
        var payload = {};
        payload.token = appService.getSessionVariable('token');
        payload.object = search;

        appService.genericPaginatedRequest(payload, appService.SEARCH_PARAMETER, 0, 5).success(function (response) {
            if (response.requestStatus === true) {
                appService.showToast(response.message);
                $scope.parameters = [];
                $scope.parameters = response.payload.content;
                $scope.parametersTotalItems = response.payload.totalElements;
                $scope.parametersCurrentPage = (response.payload.number + 1);
                $scope.parametersNumPages = response.payload.totalPages;
            } else {
                appService.showToast(response.message);
                $rootScope.$emit("sessionTimeOut", {});
            }
        }).error(function (response) {
            appService.showToast(response.message);
        });
    };

    //-----------------Select one parameter handler--------------------------------------
    $scope.selectIndividualParameter = function (row, id) {

        //Insert row if it does not exist
        if ($scope.parametersForAuth.indexOf(row) === -1 && $scope.parameterSelect.individual[id] === true) {
            //Add only pending approvals
            if (row.paramStatus === 2) {
                $scope.parametersForAuth.push(row);
                //Check if checker
                //if ($scope.isClosureChecker) {
                $scope.disableActions = false;
                //}
            }

        } else if ($scope.parametersForAuth.indexOf(row) > -1 && $scope.parameterSelect.individual[id] === false) {
            //Remove it if it exists
            var index = $scope.parametersForAuth.indexOf(row);
            $scope.parametersForAuth.splice(index, 1);
            //Disable buttons if array has nothing
            if ($scope.parametersForAuth.length === 0) {
                $scope.disableActions = true;
            }
        }
    };

    //-----------------Select all parameters handler--------------------------------------
    $scope.selectAllParameters = function (rows) {
        //If array is empty it knows you want to select all
        if ($scope.parametersForAuth.length === 0 || $scope.parameterSelect.all) {
            for (var i in rows) {
                //Insert rows if they dont exist
                if ($scope.parametersForAuth.indexOf(rows[i]) === -1) {
                    //Add only pending approvals
                    if (rows[i].paramStatus === 2) {
                        //Mark row as selected
                        $scope.parameterSelect.individual[i] = true;
                        $scope.parametersForAuth.push(rows[i]);
                        //Check if checker
                        //if ($scope.isClosureChecker) {
                        $scope.disableActions = false;
                        //}
                    }

                }
            }
        } else if ($scope.parametersForAuth.length > 0 && $scope.parameterSelect.all === false) {
            //Otherwise it knows you want to remove everything
            for (var i in rows) {
                $scope.parameterSelect.individual[i] = false;
            }
            $scope.parametersForAuth = [];
            $scope.disableActions = true;
        }
    };

    //-----------------Approve brokers handler--------------------------------------
    $scope.approveParameters = function () {
        var finalArray = [];

        var auth = {};
        auth.usrCode = appService.getSessionVariable('userID');

        //Add authoriser property for all objects
        for (var i in $scope.parametersForAuth) {
            $scope.parametersForAuth[i].paramAuthoriser = auth;
            finalArray.push($scope.parametersForAuth[i]);
        }
        var payload = {};
        payload.token = appService.getSessionVariable('token');
        payload.object = finalArray;

        appService.genericUnpaginatedRequest(payload, appService.APPROVE_PARAMETERS).success(function (response) {
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

    //-----------------Reject parameters handler--------------------------------------
    $scope.rejectParameters = function () {
        var finalArray = [];

        var auth = {};
        auth.usrCode = appService.getSessionVariable('userID');

        //Add authoriser property for all objects
        for (var i in $scope.parametersForAuth) {
            $scope.parametersForAuth[i].paramAuthoriser = auth;
            finalArray.push($scope.parametersForAuth[i]);
        }
        var payload = {};
        payload.token = appService.getSessionVariable('token');
        payload.object = finalArray;

        appService.genericUnpaginatedRequest(payload, appService.REJECT_PARAMETERS).success(function (response) {
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

    //-----------------Parameters page change handler--------------------
    $scope.parametersPageChanged = function (currentPage, itemsPerPage) {
        appService.genericPaginatedRequest(listingPayload, appService.LIST_PARAMETERS, currentPage - 1, itemsPerPage).success(function (response) {
            if (response.requestStatus == true) {
                $scope.parameters = [];
                $scope.parameters = response.payload.content;
                $scope.parametersTotalItems = response.payload.totalElements;
                $scope.parametersCurrentPage = (response.payload.number + 1);
                $scope.parametersNumPages = response.payload.totalPages;
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

        //-------------------Add Parameter Modal Launcher and Controller---------------------------------
    $scope.addParameterModal = function () {
        $mdDialog.show({
            controller: addParameterController,
            templateUrl: 'views/parameters/parameter_add.html'
        });
    };

    function addParameterController($scope, $mdDialog, appService) {
        $scope.modalTitle = "New Parameter";

        //---------------Add new parameter method---------------------------
        $scope.saveRecord = function (parameter) {
            var inputter = {};
            inputter.usrCode = appService.getSessionVariable('userID');
            parameter.paramInputter = inputter;

            var newParameter = {};
            newParameter.token = appService.getSessionVariable('token');
            newParameter.object = parameter;

            appService.genericUnpaginatedRequest(newParameter, appService.ADD_PARAMETER).success(function (response) {
                if (response.requestStatus === true) {
                    appService.showToast(response.payload.paramName + " added successfully");
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

    //-------------------Edit Parameter Modal Launcher and Controller-------------------------------
    $scope.editParameterModal = function (oldParameter) {
        $scope.oldParameter = oldParameter;
        $mdDialog.show({
            controller: editParameterController,
            templateUrl: 'views/parameters/parameter_add.html',
            resolve: {
                oldParameter: function () {
                    return $scope.oldParameter;
                }
            }
        });
    };

    function editParameterController($scope, $mdDialog, appService, oldParameter) {
        $scope.modalTitle = "Edit Parameter - " + oldParameter.paramName;
        $scope.parameter = oldParameter;

        //---------------Edit parameter method---------------------------
        $scope.saveRecord = function (parameter) {
            var auth = {};
            auth.usrCode = appService.getSessionVariable('userID');

            parameter.paramInputter = auth;

            var editedParameter = {};
            editedParameter.token = appService.getSessionVariable('token');
            editedParameter.object = parameter;

            console.log(parameter);

            appService.genericUnpaginatedRequest(editedParameter, appService.EDIT_PRAMETER).success(function (response) {
                if (response.requestStatus === true) {
                    appService.showToast(response.payload.paramName + " edited successfully");
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
