'use strict';

describe('Service: appService', function () {

  // load the service's module
  beforeEach(module('ipoApp'));

  // instantiate service
  var appService;
  beforeEach(inject(function (_appService_) {
    appService = _appService_;
  }));

  it('should do something', function () {
    expect(!!appService).toBe(true);
  });

});
