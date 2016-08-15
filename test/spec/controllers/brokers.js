'use strict';

describe('Controller: BrokersCtrl', function () {

  // load the controller's module
  beforeEach(module('ipoApp'));

  var BrokersCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BrokersCtrl = $controller('BrokersCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(BrokersCtrl.awesomeThings.length).toBe(3);
  });
});
