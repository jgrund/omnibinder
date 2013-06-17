describe('Deployd Protocol', function () {
  var protocol, $rootScope, $timeout, dpd;

  beforeEach(module('SyncDeployd', 'SyncResource'));
  beforeEach(inject(function (syncDeployd, _$rootScope_, $injector, _$timeout_, _dpd_) {
    $rootScope = _$rootScope_;
    $timeout = _$timeout_;
    protocol = new syncDeployd();
    dpd = _dpd_;
  }));

  it('should exist', function () {
    expect(!!protocol).toBe(true);
  });

  it('should return a promise when calling read', function () {
    var p = protocol.read({path: 'documents'}, 'myModel');
    expect(typeof p.then).toEqual('function');
  });

  it('should persist data when calling update', function () {
    protocol.update({path: 'documents', id: 1}).then(function (u) {
      expect(u).toEqual('updated');
    });
    $rootScope.$digest();
  });

  it('should unsubscribe from updates when calling unsubscribe', function () {
    protocol.subscribe({path: 'documents'});
    $rootScope.$digest();
    expect(typeof dpd.documents.listeners.create).toEqual('function');
    protocol.unsubscribe({path: 'documents'});
    expect(dpd.documents.listeners.create).toBe(null);
  });

  it('should create an object when calling create', function () {
    protocol.create({path: 'documents'}, {}).then(function (data) {
      expect(data.id).toEqual('A456');
    });
    $rootScope.$digest();
  });

  it('should delete an object when calling delete', function () {
    protocol.delete({path: 'documents', id: 'A456'}).then(function (data) {
      expect(data).toBe(null);
    });
    $rootScope.$digest();
  });

  it('should only fire update events if the data has actually changed', function () {
    expect(false).toBe(true);
  });
});