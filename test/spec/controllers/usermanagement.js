'use strict';

describe('Controller: UsermanagementCtrl', function () {

  // load the controller's module
  beforeEach(module('ipoApp'));

  var UsermanagementCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    UsermanagementCtrl = $controller('UsermanagementCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(UsermanagementCtrl.awesomeThings.length).toBe(3);
  });
});
