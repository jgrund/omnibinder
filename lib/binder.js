angular.module('OmniBinder', [])
  .factory('obBinder', ['$timeout', '$q', '$parse', '$window', 'obSyncEvents', 'obBinderTypes', 'obModelWriter', 'obObserver',
    function ($timeout, $q, $parse, $window, obSyncEvents, obBinderTypes, obModelWriter, obObserver) {
      function Binder(scope, model, protocol, options) {
        options = options || {};
        if (!protocol) throw new Error('protocol is required');
        if (!scope) throw new Error('scope is required');
        if (!model) throw new Error('model is required');
        if (options.key && typeof options.key !== 'string') throw new Error('key must be a string');

        this.protocol = protocol;

        this.scope = scope;
        this.model = model;
        this.query = options.query;
        this.type = options.type;
        this.key = options.key;

        this.bindModel(this.type, scope, model);
        this.protocol.subscribe(this);
        this.ignoreNModelChanges = 0;
        this.ignoreNProtocolChanges = 0;
      }


      Binder.prototype.bindModel = function (type, scope, model) {
        switch(type) {
          case obBinderTypes.COLLECTION:
            this.observer = obObserver.observeCollection(this, scope[model], this.onModelChange);
            break;
        }
      };

      /*
        Respond to local changes to the model
        1. Create a delta object to go through the change pipeline
        2. Send the change to the protocol to finish the cycle
      */
      Binder.prototype.onModelChange = function (changes) {
        console.log('onModelChange', this.ignoreNModelChanges);
        var delta = {
          changes: changes
        };

        if (!delta.changes.length) return;
        if (this.ignoreNModelChanges) return this.ignoreNModelChanges--;

        this.protocol.processChanges(this, delta);
      };

      Binder.prototype.onProtocolChange = function (changes) {
        delta = {
          changes: changes
        };

        if (!changes.length) return;
        if (this.ignoreNProtocolChanges) return this.ignoreNProtocolChanges--;

        obModelWriter.processChanges(this, delta);
      };

      Binder.prototype.val = function () {
        var getter = $parse(this.model);
        return getter(this.scope);
      };

      return function () {
        var binder = Object.create(Binder.prototype);
        Binder.apply(binder, arguments);
        return binder;
      };
    }]);
