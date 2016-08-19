//jshint ignore:start
// jscs:disable
'use strict';

/**
 * @ngdoc function
 * @name ipoApp.controller:UsermanagementCtrl
 * @description
 * # UsermanagementCtrl
 * Controller of the ipoApp
 * @author munenedk-pc
 */
app.controller('UsermanagementCtrl', function ($rootScope, $scope, $mdDialog, $state, appService) {
    //------------------Setup variables------------------------------------------------------
    $rootScope.userLoggedInAs = "";

    //Users table pagination variables
    $scope.usersTotalItems = 1;
    $scope.usersCurrentPage = 1;
    $scope.usersItemsPerPage = 5;
    $scope.usersNumPages = 1;

    //Roles table pagination variables
    $scope.rolesTotalItems = 1;
    $scope.rolesCurrentPage = 1;
    $scope.rolesItemsPerPage = 5;
    $scope.rolesNumPages = 1;

    //Permissions table pagination variables
    $scope.permissionsTotalItems = 1;
    $scope.permissionsCurrentPage = 1;
    $scope.permissionsItemsPerPage = 5;
    $scope.permissionsNumPages = 1;

    //Assigned roles dialog table variables
    $scope.assignedRolesTotalItems = 1;
    $scope.assignedRolesCurrentPage = 1;
    $scope.assignedRolesItemsPerPage = 5;
    $scope.assignedRolesNumPages = 1;

    //Available roles dialog table variables
    $scope.availableRolesTotalItems = 1;
    $scope.availableRolesCurrentPage = 1;
    $scope.availableRolesItemsPerPage = 5;
    $scope.availableRolesNumPages = 1;

    $scope.maxSize = 5; //Pagination component size

    //Arrays to hold user, roles and permissions table data
    $scope.users = [];
    $scope.roles = [];
    $scope.permissions = [];

    //Select one/select all models
    $scope.userSelect = {};
    $scope.userSelect.all = false;
    $scope.userSelect.individual = [];
    $scope.usersForAuth = [];
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

    //-----------------------------Get Users, Roles, Permissions-------------------------------
    $scope.populateAllTables = function () {
        //Populate users table
        appService.genericPaginatedRequest(listingPayload, appService.LIST_USERS, 0, 5).success(function (response) {
            if (response.requestStatus === true) {
                $scope.users = [];
                $scope.users = response.payload.content;
                $scope.usersTotalItems = response.payload.totalElements;
                $scope.usersCurrentPage = (response.payload.number + 1);
                $scope.usersNumPages = response.payload.totalPages;
            } else {
                appService.showToast(response.message);
                $rootScope.$emit("sessionTimeOut", {});
                console.log(response);
            }
        }).error(function (response) {
            appService.showToast(response.message);
            console.log(response);
        });

        $scope.roles = [{
            name: 'Share Maker',
            description: 'Creates share applications',
            status: '1'
        }];

        $scope.permissions = [{
            name: 'CR on Shares',
            description: 'Creates and views shares',
            status: '1'
        }];
    };

    /*************************************************************************************************
     *
     * *********************************SEARCH HANDLERS*******************************
     *
     * ***********************************************************************************************/
    //-----------------Search user handler--------------------------------------
    $scope.searchUser = function (search) {
        var payload = {};
        payload.token = appService.getSessionVariable('token');
        payload.object = search;

        appService.genericUnpaginatedRequest(payload, appService.SEARCH_USERS).success(function (response) {
            if (response.requestStatus === true) {
                appService.showToast(response.message);
                $scope.users = [];
                $scope.users.push(response.payload);
                $scope.usersTotalItems = 1;
                $scope.usersCurrentPage = 1;
                $scope.usersNumPages = 1;
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
    //-----------------Select one user handler--------------------------------------
    $scope.selectIndividualUser = function (row, id) {
        //Insert row if it does not exist
        if ($scope.usersForAuth.indexOf(row) === -1 && $scope.userSelect.individual[id] === true) {
            //Add only pending approvals
            if (row.usrStatus === 2) {
                $scope.usersForAuth.push(row);
                //Check if checker
                //if ($scope.isClosureChecker) {
                $scope.disableActions = false;
                //}
            }

        } else if ($scope.usersForAuth.indexOf(row) > -1 && $scope.userSelect.individual[id] === false) {
            //Remove it if it exists
            var index = $scope.usersForAuth.indexOf(row);
            $scope.usersForAuth.splice(index, 1);
            //Disable buttons if array has nothing
            if ($scope.usersForAuth.length === 0) {
                $scope.disableActions = true;
            }
        }
    };

    /*************************************************************************************************
     *
     * *********************************SELECT ALL HANDLERS*******************************
     *
     * ***********************************************************************************************/
    //-----------------Select all users handler--------------------------------------
    $scope.selectAllUsers = function (rows) {
        //If array is empty it knows you want to select all
        if ($scope.usersForAuth.length === 0 || $scope.userSelect.all) {
            for (var i in rows) {
                //Insert rows if they dont exist
                if ($scope.usersForAuth.indexOf(rows[i]) === -1) {
                    //Add only pending approvals
                    if (rows[i].usrStatus === 2) {
                        //Mark row as selected
                        $scope.userSelect.individual[i] = true;
                        $scope.usersForAuth.push(rows[i]);
                        //Check if checker
                        //if ($scope.isClosureChecker) {
                        $scope.disableActions = false;
                        //}
                    }

                }
            }
        } else if ($scope.usersForAuth.length > 0 && $scope.userSelect.all === false) {
            //Otherwise it knows you want to remove everything
            for (var i in rows) {
                $scope.userSelect.individual[i] = false;
            }
            $scope.usersForAuth = [];
            $scope.disableActions = true;

        }
    };

    /*************************************************************************************************
     *
     * *********************************APPROVE HANDLERS*******************************
     *
     * ***********************************************************************************************/
    //-----------------Approve users handler--------------------------------------
    $scope.approveUsers = function () {
        var finalArray = [];

        //Add authoriser property for all objects
        for (var i in $scope.usersForAuth) {
            $scope.usersForAuth[i].usrAuthoriser = appService.getSessionVariable('userID');
            finalArray.push($scope.usersForAuth[i]);
        }
        var payload = {};
        payload.token = appService.getSessionVariable('token');
        payload.object = finalArray;

        appService.genericUnpaginatedRequest(payload, appService.APPROVE_USERS).success(function (response) {
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
    //-----------------Reject users handler--------------------------------------
    $scope.rejectUsers = function () {
        var finalArray = [];

        //Add authoriser property for all objects
        for (var i in $scope.usersForAuth) {
            $scope.usersForAuth[i].usrAuthoriser = appService.getSessionVariable('userID');
            finalArray.push($scope.usersForAuth[i]);
        }
        var payload = {};
        payload.token = appService.getSessionVariable('token');
        payload.object = finalArray;

        appService.genericUnpaginatedRequest(payload, appService.REJECT_USERS).success(function (response) {
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
     * *********************************PAGE CHANGE HANDLERS*******************************
     *
     * ***********************************************************************************************/
    //-----------------Users page change handler(Tab 1)--------------------
    $scope.usersPageChanged = function (currentPage, itemsPerPage) {
        appService.genericPaginatedRequest(listingPayload, appService.LIST_USERS, currentPage - 1, itemsPerPage).success(function (response) {
            if (response.requestStatus == true) {
                $scope.users = [];
                $scope.users = response.payload.content;
                $scope.usersTotalItems = response.payload.totalElements;
                $scope.usersCurrentPage = (response.payload.number + 1);
                $scope.usersNumPages = response.payload.totalPages;
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

    //-------------------Add User Modal Launcher and Controller---------------------------------
    $scope.addUserModal = function () {
        $mdDialog.show({
            controller: addUserController,
            templateUrl: 'views/users/user_add.html'
        });
    };

    function addUserController($scope, $mdDialog, appService) {
        $scope.modalTitle = "New User";
        $scope.brokerList = [];

        var listing_payload = {};
        listing_payload.token = appService.getSessionVariable('token');
        listing_payload.object = null;

        //----------------Get brokers list-------------------------
        appService.genericUnpaginatedRequest(listing_payload, appService.GET_BROKER_LIST).success(function (response) {
            if (response.requestStatus === true) {
                $scope.brokerList = response.payload;
                console.log($scope.brokerList);
            } else {
                appService.showToast(response.message);
                $rootScope.$emit("sessionTimeOut", {});
            }
        }).error(function (response) {
            appService.showToast(response.message);
        });

        //---------------Add new user method---------------------------
        $scope.saveRecord = function (user) {
            user.usrInputter = appService.getSessionVariable('userID');
            var newUser = {};
            newUser.token = appService.getSessionVariable('token');
            newUser.object = user;

            appService.genericUnpaginatedRequest(newUser, appService.ADD_USER).success(function (response) {
                if (response.requestStatus === true) {
                    appService.showToast(response.payload.usrName + " added successfully");
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

    //-------------------Edit User Modal Launcher and Controller-------------------------------
    $scope.editUserModal = function (oldUser) {
        $scope.oldUser = oldUser;
        $mdDialog.show({
            controller: editUserController,
            templateUrl: 'views/users/user_add.html',
            resolve: {
                oldUser: function () {
                    return $scope.oldUser;
                }
            }
        });
    };

    function editUserController($scope, $mdDialog, appService, oldUser) {
        $scope.modalTitle = "Edit user - " + oldUser.usrName;
        $scope.user = oldUser;
        $scope.brokerList = [];

        var listing_payload = {};
        listing_payload.token = appService.getSessionVariable('token');
        listing_payload.object = null;

        //----------------Get brokers list-------------------------
        appService.genericUnpaginatedRequest(listing_payload, appService.GET_BROKER_LIST).success(function (response) {
            if (response.requestStatus === true) {
                $scope.brokerList = response.payload;
            } else {
                appService.showToast(response.message);
                $rootScope.$emit("sessionTimeOut", {});
            }
        }).error(function (response) {
            appService.showToast(response.message);
        });

        //---------------Edit user method---------------------------
        $scope.saveRecord = function (user) {
            user.usrAuthoriser = appService.getSessionVariable('userID');
            var editedUser = {};
            editedUser.token = appService.getSessionVariable('token');
            editedUser.object = user;

            appService.genericUnpaginatedRequest(editedUser, appService.EDIT_USER).success(function (response) {
                if (response.requestStatus === true) {
                    appService.showToast(response.payload.usrName + " edited successfully");
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

    //-------------------Add Role Modal Launcher and Controller---------------------------------
    $scope.addRoleModal = function () {
        $mdDialog.show({
            controller: addRoleController,
            templateUrl: 'views/users/role_add.html'
        });
    };

    function addRoleController($scope, $mdDialog, appService) {
        $scope.modalTitle = "New Role";
        $scope.brokerList = [];

        //---------------Add new role method---------------------------
        $scope.saveRecord = function (role) {
            var newUser = {};
            newUser.token = appService.getSessionVariable('token');
            newUser.object = role;

            appService.genericUnpaginatedRequest(newUser, appService.ADD_ROLE).success(function (response) {
                if (response.requestStatus === true) {
                    console.log(response);
                    appService.showToast(response.payload.institutionName + " added successfully");
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

    //-------------------Edit Role Modal Launcher and Controller-------------------------------
    $scope.editRoleModal = function (oldRole) {
        $scope.oldRole = oldRole;
        $mdDialog.show({
            controller: editRoleController,
            templateUrl: 'views/users/role_add.html',
            resolve: {
                oldRole: function () {
                    return $scope.oldRole;
                }
            }
        });
    };

    function editRoleController($scope, $mdDialog, appService, oldRole) {
        $scope.modalTitle = "Edit role - " + oldRole.name;
        $scope.role = oldRole;

        //---------------Edit role method---------------------------
        $scope.saveRecord = function (user) {
            var editedUser = {};
            editedUser.token = appService.getSessionVariable('token');
            editedUser.object = user;

            appService.genericUnpaginatedRequest(editedUser, appService.EDIT_ROLE).success(function (response) {
                if (response.requestStatus === true) {
                    console.log(response);
                    appService.showToast(response.payload.name + " edited successfully");
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

    //-------------------Add Permissions Modal Launcher and Controller---------------------------
    $scope.addPermissionModal = function () {
        $mdDialog.show({
            controller: addPermissionController,
            templateUrl: 'views/users/permissions_add.html'
        });
    };

    function addPermissionController($scope, $mdDialog, appService) {
        $scope.modalTitle = "New Permission";
        $scope.roleList = [];

        var listing_payload = {};
        listing_payload.token = appService.getSessionVariable('token');
        listing_payload.object = null;

        //----------------Get roles list-------------------------
        //appService.genericUnpaginatedRequest(listing_payload, appService.GET_ROLE_LIST).success(function (response) {
        //    if (response.requestStatus === false) {
        //        appService.showToast(response.message);
        //    } else {
        //        $scope.roleList = response.payload;
        //    }
        //}).error(function (response) {
        //    appService.showToast(response.message);
        //});

        //---------------Add new permission method---------------------------
        $scope.saveRecord = function (user) {
            var newUser = {};
            newUser.token = appService.getSessionVariable('token');
            newUser.object = user;

            appService.genericUnpaginatedRequest(newUser, appService.ADD_PERMISSION).success(function (response) {
                if (response.requestStatus === true) {
                    console.log(response);
                    appService.showToast(response.payload.name + " added successfully");
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

    //-------------------Edit Permission Modal Launcher and Controller----------------------------
    $scope.editPermissionModal = function (oldPermission) {
        $scope.oldPermission = oldPermission;
        $mdDialog.show({
            controller: editPermissionController,
            templateUrl: 'views/users/permissions_add.html',
            resolve: {
                oldPermission: function () {
                    return $scope.oldPermission;
                }
            }
        });
    };

    function editPermissionController($scope, $mdDialog, appService, oldPermission) {
        $scope.modalTitle = "Edit Permission - " + oldPermission.name;
        $scope.permission = oldPermission;
        $scope.roleList = [];

        var listing_payload = {};
        listing_payload.token = appService.getSessionVariable('token');
        listing_payload.object = null;

        //----------------Get countries list-------------------------
        //appService.genericUnpaginatedRequest(listing_payload,appService.GET_ROLE_LIST).success(function (response) {
        //    if(response.requestStatus === true){
        //      $scope.brokerList = response.payload;
        //    }else{
        //       appService.showToast(response.message);
        //    }
        //}).error(function (response) {
        //    appService.showToast(response.message);
        //});

        //---------------Edit user method---------------------------
        $scope.saveRecord = function (user) {
            var editedUser = {};
            editedUser.token = appService.getSessionVariable('token');
            editedUser.object = user;

            appService.genericUnpaginatedRequest(editedUser, appService.EDIT_USER).success(function (response) {
                if (response.requestStatus === true) {
                    console.log(response);
                    appService.showToast(response.payload.name + " edited successfully");
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

    //-------------------View User Roles Modal Launcher and Controller----------------------------
    $scope.viewUserRolesModal = function (user) {
        $scope.user = user;
        $mdDialog.show({
            controller: viewUserRolesController,
            templateUrl: 'views/users/assign_roles.html',
            resolve: {
                user: function () {
                    return $scope.user;
                }
            }
        });
    };

    function viewUserRolesController($scope, $mdDialog, appService, user) {
        $scope.modalTitle = "Assign " + user.usrName + " permissions";
        $scope.assignedRoles = [];
        $scope.availableRoles = [];
        $scope.select = {};
        $scope.select.all = false;
        $scope.select.individual = [];
        $scope.selectAvailable = {};
        $scope.selectAvailable.all = false;
        $scope.selectAvailable.individual = [];
        $scope.assignedRolesForAuth = [];
        $scope.availableRolesForAuth = [];


        var listing_payload = {};
        listing_payload.token = appService.getSessionVariable('token');
        listing_payload.object = user;


        $scope.assignedRoles = [{
            id: '1',
            name: 'Share Maker'
        }];

        $scope.availableRoles = [{
            id: '2',
            name: 'User Maker'
        }];
        //----------------Get roles list-------------------------
        //appService.genericUnpaginatedRequest(listing_payload, appService.GET_ASSIGNED_ROLES).success(function (response) {
        //    if (response.requestStatus === false) {
        //        appService.showToast(response.message);
        //    } else {
        //        $scope.roleList = response.payload;
        //    }
        //}).error(function (response) {
        //    appService.showToast(response.message);
        //});
        //appService.genericUnpaginatedRequest(listing_payload, appService.GET_AVAILABLE_ROLES).success(function (response) {
        //    if (response.requestStatus === false) {
        //        appService.showToast(response.message);
        //    } else {
        //        $scope.roleList = response.payload;
        //    }
        //}).error(function (response) {
        //    appService.showToast(response.message);
        //});

        //-----------------Select one and select all handlers--------------------------------------
        $scope.selectIndividual = function (row, id) {
            //Insert row if it does not exist
            if ($scope.assignedRolesForAuth.indexOf(row) === -1 && $scope.select.individual[id] === true) {
                $scope.assignedRolesForAuth.push(row);
                //Check if checker
                //if ($scope.isClosureChecker) {
                //    $scope.disableActions = false;
                //}

            } else if ($scope.assignedRolesForAuth.indexOf(row) > -1 && $scope.select.individual[id] === false) {
                //Remove it if it exists
                var index = $scope.assignedRolesForAuth.indexOf(row);
                $scope.assignedRolesForAuth.splice(index, 1);
                //Disable buttons if array has nothing
                //if ($scope.rolesForAuth.length === 0) {
                //    $scope.disableActions = true;
                //}
            }
        };

        $scope.selectAllRoles = function (rows) {
            //If array is empty it knows you want to select all
            if ($scope.assignedRolesForAuth.length === 0 || $scope.select.all) {
                for (var i in rows) {
                    //Insert rows if they dont exist
                    if ($scope.assignedRolesForAuth.indexOf(rows[i]) === -1) {
                        //Mark row as selected
                        $scope.select.individual[i] = true;
                        $scope.assignedRolesForAuth.push(rows[i]);
                        //Check if checker
                        //if ($scope.isClosureChecker) {
                        //    $scope.disableActions = false;
                        //}

                    }
                }
            } else if ($scope.assignedRolesForAuth.length > 0 && $scope.select.all === false) {
                //Otherwise it knows you want to remove everything
                for (var i in rows) {
                    $scope.select.individual[i] = false;
                }
                $scope.assignedRolesForAuth = [];
                //$scope.disableActions = true;

            }
        };

        $scope.selectAvailableIndividual = function (row, id) {
            //Insert row if it does not exist
            if ($scope.availableRolesForAuth.indexOf(row) === -1 && $scope.selectAvailable.individual[id] === true) {
                $scope.availableRolesForAuth.push(row);
                //Check if checker
                //if ($scope.isClosureChecker) {
                //    $scope.disableActions = false;
                //}

            } else if ($scope.availableRolesForAuth.indexOf(row) > -1 && $scope.selectAvailable.individual[id] === false) {
                //Remove it if it exists
                var index = $scope.availableRolesForAuth.indexOf(row);
                $scope.availableRolesForAuth.splice(index, 1);
                //Disable buttons if array has nothing
                //if ($scope.rolesForAuth.length === 0) {
                //    $scope.disableActions = true;
                //}
            }
        };

        $scope.selectAllAvailableRoles = function (rows) {
            //If array is empty it knows you want to select all
            if ($scope.availableRolesForAuth.length === 0 || $scope.selectAvailable.all) {
                for (var i in rows) {
                    //Insert rows if they dont exist
                    if ($scope.availableRolesForAuth.indexOf(rows[i]) === -1) {
                        //Mark row as selected
                        $scope.selectAvailable.individual[i] = true;
                        $scope.availableRolesForAuth.push(rows[i]);
                        //Check if checker
                        //if ($scope.isClosureChecker) {
                        //    $scope.disableActions = false;
                        //}

                    }
                }
            } else if ($scope.availableRolesForAuth.length > 0 && $scope.selectAvailable.all === false) {
                //Otherwise it knows you want to remove everything
                for (var i in rows) {
                    $scope.selectAvailable.individual[i] = false;
                }
                $scope.availableRolesForAuth = [];
                //$scope.disableActions = true;

            }
        };
        //-----------------End of select one and select all handlers-------------------------------

        //---------------Assign user roles method---------------------------
        $scope.saveRecord = function (user) {
            var newUser = {};
            newUser.token = appService.getSessionVariable('token');
            newUser.object = user;

            appService.genericUnpaginatedRequest(newUser, appService.ADD_PERMISSION).success(function (response) {
                if (response.requestStatus === true) {
                    console.log(response);
                    appService.showToast(response.payload.name + " added successfully");
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

    //----------------Event Listeners-----------------------------------
    $rootScope.$on("requestTableRefresh", function () {
        $scope.populateAllTables();
    });
}); //End of controller
