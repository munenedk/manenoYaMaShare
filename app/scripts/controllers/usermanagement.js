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

  //Assigned roles table pagination variables
  $scope.assignedRolesTotalItems = 1;
  $scope.assignedRolesCurrentPage = 1;
  $scope.assignedRolesItemsPerPage = 5;
  $scope.assignedRolesNumPages = 1;

  //Available roles table pagination variables
  $scope.availableRolesTotalItems = 1;
  $scope.availableRolesCurrentPage = 1;
  $scope.availableRolesItemsPerPage = 5;
  $scope.availableRolesNumPages = 1;

  $scope.maxSize = 5; //Pagination component size

  //Arrays to hold user, roles and permissions table data
  $scope.users = [];
  $scope.roles = [];
  $scope.permissions = [];

  //User select one/select all models
  $scope.userSelect = {};
  $scope.userSelect.all = false;
  $scope.userSelect.individual = [];
  $scope.usersForAuth = [];
  $scope.disableActions = true;

  //Role select one/select all models
  $scope.roleSelect = {};
  $scope.roleSelect.all = false;
  $scope.roleSelect.individual = [];
  $scope.rolesForAuth = [];
  $scope.disableRoleActions = true;

  //Permission select one/select all models
  $scope.permissionSelect = {};
  $scope.permissionSelect.all = false;
  $scope.permissionSelect.individual = [];
  $scope.permissionsForAuth = [];
  $scope.disablePermisionActions = true;

  //User-roles select one/select all models
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
  $scope.candidate = "";
  $scope.disableRoleAuthActions = true;
  $scope.disableAvailableActions = true;
  $scope.disableAssignedActions = true;

  //Global payload for all populate methods
  var listingPayload = {};
  var listingObject = {};
  listingPayload.token = appService.getSessionVariable('token');
  listingObject.batBrkCode = {};
  listingObject.batBrkCode.brkCode = appService.getSessionVariable('brokerCode');
  listingPayload.object = listingObject;

  //Dynamic tabs
  $scope.tabs = [];
  $scope.tabCollection = [
    {title: 'Assign Roles', content: 'views/users/userRolesTab.html', active: true}
  ];

  //------------------Runs first once page loads---------------------------------------------
  $scope.$on('$viewContentLoaded', function () {
    $rootScope.userLoggedInAs = appService.getSessionVariable('userName');
    if (angular.equals(appService.getSessionVariable('token'), undefined)) {
      $state.go('login');
    } else {
      $rootScope.$emit("authoriseUser", {});
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
      }
    }).error(function (response) {
      appService.showToast(response.message);
    });

    //Populate roles table
    appService.genericPaginatedRequest(listingPayload, appService.LIST_ROLES, 0, 5).success(function (response) {
      if (response.requestStatus === true) {
        $scope.roles = [];
        $scope.roles = response.payload.content;
        $scope.rolesTotalItems = response.payload.totalElements;
        $scope.rolesCurrentPage = (response.payload.number + 1);
        $scope.rolesNumPages = response.payload.totalPages;
      } else {
        appService.showToast(response.message);
        $rootScope.$emit("sessionTimeOut", {});
      }
    }).error(function (response) {
      appService.showToast(response.message);
    });

    //Populate permissions table
    appService.genericPaginatedRequest(listingPayload, appService.LIST_PERMISSIONS, 0, 5).success(function (response) {
      if (response.requestStatus === true) {
        $scope.permissions = [];
        $scope.permissions = response.payload.content;
        $scope.permissionsTotalItems = response.payload.totalElements;
        $scope.permissionsCurrentPage = (response.payload.number + 1);
        $scope.permissionsNumPages = response.payload.totalPages;
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

  //-----------------Select one role handler--------------------------------------
  $scope.selectIndividualRole = function (row, id) {
    //Insert row if it does not exist
    if ($scope.rolesForAuth.indexOf(row) === -1 && $scope.roleSelect.individual[id] === true) {
      //Add only pending approvals
      if (row.roleStatus === 2) {
        $scope.rolesForAuth.push(row);
        //Check if checker
        //if ($scope.isClosureChecker) {
        $scope.disableRoleActions = false;
        //}
      }

    } else if ($scope.rolesForAuth.indexOf(row) > -1 && $scope.roleSelect.individual[id] === false) {
      //Remove it if it exists
      var index = $scope.rolesForAuth.indexOf(row);
      $scope.rolesForAuth.splice(index, 1);
      //Disable buttons if array has nothing
      if ($scope.rolesForAuth.length === 0) {
        $scope.disableRoleActions = true;
      }
    }
  };

  //-----------------Select one permission handler--------------------------------------
  $scope.selectIndividualPermission = function (row, id) {
    //Insert row if it does not exist
    if ($scope.permissionsForAuth.indexOf(row) === -1 && $scope.permissionSelect.individual[id] === true) {
      //Add only pending approvals
      if (row.permStatus === 2) {
        $scope.permissionsForAuth.push(row);
        //Check if checker
        //if ($scope.isClosureChecker) {
        $scope.disablePermisionActions = false;
        //}
      }

    } else if ($scope.permissionsForAuth.indexOf(row) > -1 && $scope.permissionSelect.individual[id] === false) {
      //Remove it if it exists
      var index = $scope.permissionsForAuth.indexOf(row);
      $scope.permissionsForAuth.splice(index, 1);
      //Disable buttons if array has nothing
      if ($scope.permissionsForAuth.length === 0) {
        $scope.disablePermisionActions = true;
      }
    }
  };

  //-----------------Select one assigned role handler--------------------------------
  $scope.selectIndividualAssigned = function (row, id) {
    //Insert row if it does not exist
    if ($scope.assignedRolesForAuth.indexOf(row) === -1 && $scope.select.individual[id] === true) {
      $scope.assignedRolesForAuth.push(row);
      //Check if checker
      //if ($scope.isClosureChecker) {
      $scope.disableAssignedActions = false;
      $scope.disableRoleAuthActions = false;
      //}

    } else if ($scope.assignedRolesForAuth.indexOf(row) > -1 && $scope.select.individual[id] === false) {
      //Remove it if it exists
      var index = $scope.assignedRolesForAuth.indexOf(row);
      $scope.assignedRolesForAuth.splice(index, 1);
      //Disable buttons if array has nothing
      //if ($scope.rolesForAuth.length === 0) {
      $scope.disableAssignedActions = true;
      $scope.disableRoleAuthActions = true;
      //}
    }
  };

  //-----------------Select one available role handler--------------------------------
  $scope.selectIndividualAvailable = function (row, id) {
    //Insert row if it does not exist
    if ($scope.availableRolesForAuth.indexOf(row) === -1 && $scope.selectAvailable.individual[id] === true) {
      $scope.availableRolesForAuth.push(row);
      //Check if checker
      //if ($scope.isClosureChecker) {
      $scope.disableAvailableActions = false;
      //}

    } else if ($scope.availableRolesForAuth.indexOf(row) > -1 && $scope.selectAvailable.individual[id] === false) {
      //Remove it if it exists
      var index = $scope.availableRolesForAuth.indexOf(row);
      $scope.availableRolesForAuth.splice(index, 1);
      //Disable buttons if array has nothing
      //if ($scope.rolesForAuth.length === 0) {
      $scope.disableAvailableActions = true;
      //}
    }
  };

  /*************************************************************************************************
   *
   * *********************************SELECT ALL HANDLERS*******************************
   *
   * ***********************************************************************************************/

    //-----------------Select all users handler-----------------------------------
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

  //-----------------Select all roles handler---------------------------------------
  $scope.selectAllRoles = function (rows) {
    //If array is empty it knows you want to select all
    if ($scope.rolesForAuth.length === 0 || $scope.roleSelect.all) {
      for (var i in rows) {
        //Insert rows if they dont exist
        if ($scope.rolesForAuth.indexOf(rows[i]) === -1) {
          //Add only pending approvals
          if (rows[i].roleStatus === 2) {
            //Mark row as selected
            $scope.roleSelect.individual[i] = true;
            $scope.rolesForAuth.push(rows[i]);
            //Check if checker
            //if ($scope.isClosureChecker) {
            $scope.disableRoleActions = false;
            //}
          }

        }
      }
    } else if ($scope.rolesForAuth.length > 0 && $scope.roleSelect.all === false) {
      //Otherwise it knows you want to remove everything
      for (var i in rows) {
        $scope.roleSelect.individual[i] = false;
      }
      $scope.rolesForAuth = [];
      $scope.disableRoleActions = true;

    }
  };

  //-----------------Select all permissions handler----------------------------------
  $scope.selectAllPermissions = function (rows) {
    //If array is empty it knows you want to select all
    if ($scope.permissionsForAuth.length === 0 || $scope.permissionSelect.all) {
      for (var i in rows) {
        //Insert rows if they dont exist
        if ($scope.permissionsForAuth.indexOf(rows[i]) === -1) {
          //Add only pending approvals
          if (rows[i].permStatus === 2) {
            //Mark row as selected
            $scope.permissionSelect.individual[i] = true;
            $scope.permissionsForAuth.push(rows[i]);
            //Check if checker
            //if ($scope.isClosureChecker) {
            $scope.disablePermisionActions = false;
            //}
          }

        }
      }
    } else if ($scope.permissionsForAuth.length > 0 && $scope.permissionSelect.all === false) {
      //Otherwise it knows you want to remove everything
      for (var i in rows) {
        $scope.permissionSelect.individual[i] = false;
      }
      $scope.permissionsForAuth = [];
      $scope.disablePermisionActions = true;

    }
  };

  //-----------------Select all assigned roles handler--------------------------------
  $scope.selectAllAssignedRoles = function (rows) {
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
          $scope.disableAssignedActions = false;
          $scope.disableRoleAuthActions = false;
          //}

        }
      }
    } else if ($scope.assignedRolesForAuth.length > 0 && $scope.select.all === false) {
      //Otherwise it knows you want to remove everything
      for (var i in rows) {
        $scope.select.individual[i] = false;
      }
      $scope.assignedRolesForAuth = [];
      $scope.disableAssignedActions = true;
      $scope.disableRoleAuthActions = true;

    }
  };

  //-----------------Select all available roles handler-------------------------------
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
          $scope.disableAvailableActions = false;
          //}

        }
      }
    } else if ($scope.availableRolesForAuth.length > 0 && $scope.selectAvailable.all === false) {
      //Otherwise it knows you want to remove everything
      for (var i in rows) {
        $scope.selectAvailable.individual[i] = false;
      }
      $scope.availableRolesForAuth = [];
      $scope.disableAvailableActions = true;
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

  //-----------------Approve roles handler--------------------------------------
  $scope.approveRoles = function () {
    var finalArray = [];

    var auth = {};
    auth.usrCode = appService.getSessionVariable('userID');

    //Add authoriser property for all objects
    for (var i in $scope.rolesForAuth) {
      $scope.rolesForAuth[i].roleAuthoriser = auth;
      finalArray.push($scope.rolesForAuth[i]);
    }
    var payload = {};
    payload.token = appService.getSessionVariable('token');
    payload.object = finalArray;

    appService.genericUnpaginatedRequest(payload, appService.APPROVE_ROLE).success(function (response) {
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

  //-----------------Approve permissions handler--------------------------------
  $scope.approvePermissions = function () {
    var finalArray = [];

    var auth = {};
    auth.usrCode = appService.getSessionVariable('userID');

    //Add authoriser property for all objects
    for (var i in $scope.permissionsForAuth) {
      $scope.permissionsForAuth[i].permAuthoriser = auth;
      finalArray.push($scope.permissionsForAuth[i]);
    }
    var payload = {};
    payload.token = appService.getSessionVariable('token');
    payload.object = finalArray;

    appService.genericUnpaginatedRequest(payload, appService.APPROVE_PERMISSION).success(function (response) {
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

  //-----------------Approve user role assignment handler-----------------------
  $scope.approveRoleAssignments = function () {
    var finalArray = [];

    //Add authoriser, role code, and user code properties for all objects
    for (var i in $scope.assignedRolesForAuth) {
      var objectInArray = {};
      objectInArray.usroleUsrCode = {};
      objectInArray.usroleUsrCode.usrCode = appService.getSessionVariable('userRolesUserObject').usrCode;
      objectInArray.usroleRoleCode = {};
      objectInArray.usroleRoleCode.roleCode = $scope.assignedRolesForAuth[i][2];
      objectInArray.usroleAuthoriser = {};
      objectInArray.usroleAuthoriser.usrCode = appService.getSessionVariable('userID');
      finalArray.push(objectInArray);
      //$scope.assignedRolesForAuth[i].usroleUsrCode = {};
      //$scope.assignedRolesForAuth[i].usroleUsrCode.usrCode = appService.getSessionVariable('userRolesUserObject').usrCode;
      //$scope.assignedRolesForAuth[i].usroleRoleCode = {};
      //$scope.assignedRolesForAuth[i].usroleRoleCode.roleCode = $scope.assignedRolesForAuth[i][2];
      //$scope.assignedRolesForAuth[i].usroleAuthoriser = {};
      //$scope.assignedRolesForAuth[i].usroleAuthoriser.usrCode = appService.getSessionVariable('userID');
    }

    var payload = {};
    payload.token = appService.getSessionVariable('token');
    payload.object = finalArray;

    appService.genericUnpaginatedRequest(payload, appService.APPROVE_ASSIGNMENTS).success(function (response) {
      if (response.requestStatus === true) {
        appService.showToast(response.message);
        //Refresh role lists
        $scope.viewUserRoles(appService.getSessionVariable('userRolesUserObject'));
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

  //-----------------Reject roles handler--------------------------------------
  $scope.rejectRoles = function () {
    var finalArray = [];

    var auth = {};
    auth.usrCode = appService.getSessionVariable('userID');

    //Add authoriser property for all objects
    for (var i in $scope.rolesForAuth) {
      $scope.rolesForAuth[i].roleAuthoriser = auth;
      finalArray.push($scope.rolesForAuth[i]);
    }
    var payload = {};
    payload.token = appService.getSessionVariable('token');
    payload.object = finalArray;

    appService.genericUnpaginatedRequest(payload, appService.REJECT_ROLE).success(function (response) {
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

  //-----------------Reject permissions handler--------------------------------------
  $scope.rejectPermissions = function () {
    var finalArray = [];

    var auth = {};
    auth.usrCode = appService.getSessionVariable('userID');

    //Add authoriser property for all objects
    for (var i in $scope.permissionsForAuth) {
      $scope.permissionsForAuth[i].permAuthoriser = auth;
      finalArray.push($scope.permissionsForAuth[i]);
    }
    var payload = {};
    payload.token = appService.getSessionVariable('token');
    payload.object = finalArray;

    appService.genericUnpaginatedRequest(payload, appService.REJECT_PERMISSION).success(function (response) {
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

  //-----------------Reject user role assignment handler-----------------------------
  $scope.rejectRoleAssignments = function () {
    var finalArray = [];
    var objectInArray = {};
    //Add authoriser, role code, and user code properties for all objects
    for (var i in $scope.assignedRolesForAuth) {
      objectInArray.usroleUsrCode = {};
      objectInArray.usroleUsrCode.usrCode = appService.getSessionVariable('userRolesUserObject').usrCode;
      objectInArray.usroleRoleCode = {};
      objectInArray.usroleRoleCode.roleCode = $scope.assignedRolesForAuth[i][2];
      objectInArray.usroleAuthoriser = {};
      objectInArray.usroleAuthoriser.usrCode = appService.getSessionVariable('userID');
      finalArray.push(objectInArray);
      //$scope.assignedRolesForAuth[i].usroleUsrCode = {};
      //$scope.assignedRolesForAuth[i].usroleUsrCode.usrCode = appService.getSessionVariable('userRolesUserObject').usrCode;
      //$scope.assignedRolesForAuth[i].usroleRoleCode = {};
      //$scope.assignedRolesForAuth[i].usroleRoleCode.roleCode = $scope.assignedRolesForAuth[i].roleCode;
      //$scope.assignedRolesForAuth[i].usroleAuthoriser = {};
      //$scope.assignedRolesForAuth[i].usroleAuthoriser.usrCode = appService.getSessionVariable('userID');
    }

    var payload = {};
    payload.token = appService.getSessionVariable('token');
    payload.object = finalArray;

    appService.genericUnpaginatedRequest(payload, appService.REJECT_ASSIGNMENTS).success(function (response) {
      if (response.requestStatus === true) {
        appService.showToast(response.message);
        //Refresh role lists
        $scope.viewUserRoles(appService.getSessionVariable('userRolesUserObject'));
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
    //-----------------Users page change handler--------------------
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

  //-----------------Roles page change handler--------------------
  $scope.rolesPageChanged = function (currentPage, itemsPerPage) {
    appService.genericPaginatedRequest(listingPayload, appService.LIST_ROLES, currentPage - 1, itemsPerPage).success(function (response) {
      if (response.requestStatus == true) {
        $scope.roles = [];
        $scope.roles = response.payload.content;
        $scope.rolesTotalItems = response.payload.totalElements;
        $scope.rolesCurrentPage = (response.payload.number + 1);
        $scope.rolesNumPages = response.payload.totalPages;
      } else {
        appService.showToast(response.message);
        $rootScope.$emit("sessionTimeOut", {});
      }
    }).error(function (response) {
      appService.showToast(response.message);
    });
  };

  //-----------------Permissions page change handler--------------------
  $scope.permissionsPageChanged = function (currentPage, itemsPerPage) {
    appService.genericPaginatedRequest(listingPayload, appService.LIST_ROLES, currentPage - 1, itemsPerPage).success(function (response) {
      if (response.requestStatus == true) {
        $scope.permissions = [];
        $scope.permissions = response.payload.content;
        $scope.permissionsTotalItems = response.payload.totalElements;
        $scope.permissionsCurrentPage = (response.payload.number + 1);
        $scope.permissionsNumPages = response.payload.totalPages;
      } else {
        appService.showToast(response.message);
        $rootScope.$emit("sessionTimeOut", {});
      }
    }).error(function (response) {
      appService.showToast(response.message);
    });
  };

  //-----------------Assigned roles page change handler--------------------
  $scope.assignedRolesPageChanged = function (currentPage, itemsPerPage) {
    var userRoleCodeObject = {};
    userRoleCodeObject.usroleUsrCode = {};
    userRoleCodeObject.usroleUsrCode.usrCode = appService.getSessionVariable('userRolesUserObject').usrCode;

    var listingPayload = {};
    listingPayload.token = appService.getSessionVariable('token');
    listingPayload.object = userRoleCodeObject;

    appService.genericPaginatedRequest(listingPayload, appService.GET_ASSIGNED_ROLES, currentPage - 1, itemsPerPage).success(function (response) {
      if (response.requestStatus == true) {
        $scope.assignedRoles = [];
        $scope.assignedRoles = response.payload.content;
        $scope.assignedRolesTotalItems = response.payload.totalElements;
        $scope.assignedRolesCurrentPage = (response.payload.number + 1);
        $scope.assignedRolesNumPages = response.payload.totalPages;
      } else {
        appService.showToast(response.message);
        $rootScope.$emit("sessionTimeOut", {});
      }
    }).error(function (response) {
      appService.showToast(response.message);
    });
  };

  //-----------------Available roles page change handler--------------------
  $scope.availableRolesPageChanged = function (currentPage, itemsPerPage) {
    var userRoleCodeObject = {};
    userRoleCodeObject.usroleUsrCode = {};
    userRoleCodeObject.usroleUsrCode.usrCode = appService.getSessionVariable('userRolesUserObject').usrCode;

    var listingPayload = {};
    listingPayload.token = appService.getSessionVariable('token');
    listingPayload.object = userRoleCodeObject;

    appService.genericPaginatedRequest(listingPayload, appService.GET_AVAILABLE_ROLES, currentPage - 1, itemsPerPage).success(function (response) {
      if (response.requestStatus == true) {
        $scope.availableRoles = [];
        $scope.availableRoles = response.payload.content;
        $scope.availableRolesTotalItems = response.payload.totalElements;
        $scope.availableRolesCurrentPage = (response.payload.number + 1);
        $scope.availableRolesNumPages = response.payload.totalPages;
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
   * *********************************USER ROLES HANDLERS*******************************
   *
   * ***********************************************************************************************/
    //-------------------View User Roles Modal Launcher and Controller----------------------------
  $scope.viewUserRoles = function (user) {
    $scope.candidate = user.usrName + " (" + user.usrEmail + ")";

    //Reset all select models
    $scope.select.all = false;
    $scope.select.individual = [];
    $scope.selectAvailable = {};
    $scope.selectAvailable.all = false;
    $scope.selectAvailable.individual = [];
    $scope.assignedRolesForAuth = [];
    $scope.availableRolesForAuth = [];
    $scope.disableRoleAuthActions = true;
    $scope.disableAvailableActions = true;
    $scope.disableAssignedActions = true;

    var userRoleCodeObject = {};
    userRoleCodeObject.usroleUsrCode = {};
    userRoleCodeObject.usroleUsrCode.usrCode = user.usrCode;
    appService.setSessionVariable('userRolesUserObject', user);

    var listing_payload = {};
    listing_payload.token = appService.getSessionVariable('token');
    listing_payload.object = userRoleCodeObject;

    //----------------Get roles list-------------------------
    appService.genericUnpaginatedRequest(listing_payload, appService.GET_ASSIGNED_ROLES).success(function (response) {
      if (response.requestStatus == true) {
        $scope.assignedRoles = [];
        $scope.assignedRoles = response.payload.content;
        $scope.assignedRolesTotalItems = response.payload.totalElements;
        $scope.assignedRolesCurrentPage = (response.payload.number + 1);
        $scope.assignedRolesNumPages = response.payload.totalPages;
      } else {
        appService.showToast(response.message);
        $rootScope.$emit("sessionTimeOut", {});
      }
    }).error(function (response) {
      appService.showToast(response.message);
    });
    appService.genericUnpaginatedRequest(listing_payload, appService.GET_AVAILABLE_ROLES).success(function (response) {
      if (response.requestStatus == true) {
        $scope.availableRoles = [];
        $scope.availableRoles = response.payload.content;
        $scope.availableRolesTotalItems = response.payload.totalElements;
        $scope.availableRolesCurrentPage = (response.payload.number + 1);
        $scope.availableRolesNumPages = response.payload.totalPages;
      } else {
        appService.showToast(response.message);
        $rootScope.$emit("sessionTimeOut", {});
      }
    }).error(function (response) {
      appService.showToast(response.message);
    });

    $scope.tabs = [];
    $scope.tabs.push($scope.tabCollection[0]);
  };

  $scope.cancelViewUserRoles = function () {
    $scope.tabs.pop();
  };

  $scope.grantRole = function () {
    //Add inputter, role code, and grantee user id properties for all objects
    for (var i in $scope.availableRolesForAuth) {
      $scope.availableRolesForAuth[i].usroleInputter = {};
      $scope.availableRolesForAuth[i].usroleInputter.usrCode = appService.getSessionVariable('userID');
      $scope.availableRolesForAuth[i].usroleRoleCode = {};
      $scope.availableRolesForAuth[i].usroleRoleCode.roleCode = $scope.availableRolesForAuth[i].roleCode;
      $scope.availableRolesForAuth[i].usroleUsrCode = {};
      $scope.availableRolesForAuth[i].usroleUsrCode.usrCode = appService.getSessionVariable('userRolesUserObject').usrCode;
    }

    var payload = {};
    payload.token = appService.getSessionVariable('token');
    payload.object = $scope.availableRolesForAuth;

    appService.genericUnpaginatedRequest(payload, appService.GRANT_ROLE).success(function (response) {
      if (response.requestStatus === true) {
        appService.showToast(response.message);
        //Refresh role lists
        $scope.viewUserRoles(appService.getSessionVariable('userRolesUserObject'));
      } else {
        appService.showToast(response.message);
        $rootScope.$emit("sessionTimeOut", {});
      }
    }).error(function (response) {
      appService.showToast(response.message);
    });
  };

  $scope.revokeRole = function () {
    var finalArray = [];

    //Add user code property for all objects
    for (var i in $scope.assignedRolesForAuth) {
      var objectInArray = {};
      objectInArray.usroleUsrCode = {};
      objectInArray.usroleUsrCode.usrCode = appService.getSessionVariable('userRolesUserObject').usrCode;
      objectInArray.usroleRoleCode = {};
      objectInArray.usroleRoleCode.roleCode = $scope.assignedRolesForAuth[i][2];
      finalArray.push(objectInArray);
      //$scope.assignedRolesForAuth[i].usroleUsrCode = {};
      //$scope.assignedRolesForAuth[i].usroleUsrCode.usrCode = appService.getSessionVariable('userRolesUserObject').usrCode;
      //$scope.assignedRolesForAuth[i].usroleRoleCode = {};
      //$scope.assignedRolesForAuth[i].usroleRoleCode.roleCode = $scope.assignedRolesForAuth[i].roleCode;
    }

    var payload = {};
    payload.token = appService.getSessionVariable('token');
    payload.object = finalArray;

    appService.genericUnpaginatedRequest(payload, appService.REVOKE_ROLE).success(function (response) {
      if (response.requestStatus === true) {
        appService.showToast(response.message);
        //Refresh role lists
        $scope.viewUserRoles(appService.getSessionVariable('userRolesUserObject'));
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
    var listingObject = {};
    listing_payload.token = appService.getSessionVariable('token');
    listingObject.batBrkCode = {};
    listingObject.batBrkCode.brkCode = appService.getSessionVariable('brokerCode');
    listing_payload.object = listingObject;

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

  //-------------------Add Role Modal Launcher and Controller---------------------------------
  $scope.addRoleModal = function () {
    $mdDialog.show({
      controller: addRoleController,
      templateUrl: 'views/users/role_add.html'
    });
  };

  function addRoleController($scope, $mdDialog, appService) {
    $scope.modalTitle = "New Role";

    //---------------Add new role method---------------------------
    $scope.saveRecord = function (role) {
      var inputter = {};
      inputter.usrCode = appService.getSessionVariable('userID');
      role.roleInputter = inputter;

      var newRole = {};
      newRole.token = appService.getSessionVariable('token');
      newRole.object = role;

      appService.genericUnpaginatedRequest(newRole, appService.ADD_ROLE).success(function (response) {
        if (response.requestStatus === true) {
          appService.showToast(response.message);
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
    var listingObject = {};
    listing_payload.token = appService.getSessionVariable('token');
    listingObject.batBrkCode = {};
    listingObject.batBrkCode.brkCode = appService.getSessionVariable('brokerCode');
    listing_payload.object = listingObject;

    //----------------Get roles list-------------------------
    appService.genericUnpaginatedRequest(listing_payload, appService.GET_ROLE_LIST).success(function (response) {
      if (response.requestStatus == true) {
        $scope.roleList = response.payload;
      } else {
        appService.showToast(response.message);
        $rootScope.$emit("sessionTimeOut", {});
      }
    }).error(function (response) {
      appService.showToast(response.message);
    });

    //---------------Add new permission method---------------------------
    $scope.saveRecord = function (permission) {
      var inputter = {};
      inputter.usrCode = appService.getSessionVariable('userID');
      permission.permInputter = inputter;

      var roleCodeObject = {};
      roleCodeObject.roleCode = permission.permRoleCode;
      permission.permRoleCode = roleCodeObject;

      var newPermission = {};
      newPermission.token = appService.getSessionVariable('token');
      newPermission.object = permission;

      appService.genericUnpaginatedRequest(newPermission, appService.ADD_PERMISSION).success(function (response) {
        if (response.requestStatus === true) {
          console.log(response);
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
    var listingObject = {};
    listing_payload.token = appService.getSessionVariable('token');
    listingObject.batBrkCode = {};
    listingObject.batBrkCode.brkCode = appService.getSessionVariable('brokerCode');
    listing_payload.object = listingObject;

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
    $scope.modalTitle = "Edit role ";
    $scope.role = oldRole;

    //---------------Edit role method---------------------------
    $scope.saveRecord = function (role) {
      var inputter = {};
      inputter.usrCode = appService.getSessionVariable('userID');
      role.roleInputter = inputter;

      var editedRole = {};
      editedRole.token = appService.getSessionVariable('token');
      editedRole.object = role;

      appService.genericUnpaginatedRequest(editedRole, appService.EDIT_ROLE).success(function (response) {
        if (response.requestStatus === true) {
          console.log(response);
          appService.showToast(response.message);
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
    $scope.modalTitle = "Edit Permission";
    $scope.permission = oldPermission;
    $scope.roleList = [];

    var listing_payload = {};
    var listingObject = {};
    listing_payload.token = appService.getSessionVariable('token');
    listingObject.batBrkCode = {};
    listingObject.batBrkCode.brkCode = appService.getSessionVariable('brokerCode');
    listing_payload.object = listingObject;

    //----------------Get roles list-------------------------
    appService.genericUnpaginatedRequest(listing_payload, appService.GET_ROLE_LIST).success(function (response) {
      if (response.requestStatus === true) {
        $scope.roleList = response.payload;
      } else {
        appService.showToast(response.message);
        $rootScope.$emit("sessionTimeOut", {});
      }
    }).error(function (response) {
      appService.showToast(response.message);
    });

    //---------------Edit permission method---------------------------
    $scope.saveRecord = function (permission) {
      var inputter = {};
      inputter.usrCode = appService.getSessionVariable('userID');
      permission.permInputter = inputter;

      var editedPermission = {};
      editedPermission.token = appService.getSessionVariable('token');
      editedPermission.object = permission;

      appService.genericUnpaginatedRequest(editedPermission, appService.EDIT_PERMISSION).success(function (response) {
        if (response.requestStatus === true) {
          appService.showToast(response.message);
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
