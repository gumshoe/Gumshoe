(function (root) {

  var gumshoe = root.gumshoe;

  gumshoe.transport({

    name: 'spec-transport-legacy',

    send: function (data) {
    },

    map: function (data) {
      return {
        newProp: 1,
        ipAddress: '192.168.1.1'
      };
    }

  });

  gumshoe.transport({

    name: 'spec-transport-error',

    send: function (data, fn) {
      fn.call(this, {}, null);
    },

    map: function (data) {
      return {
        newProp: 1,
        ipAddress: '192.168.1.1'
      };
    }

  });

  gumshoe.transport({

    name: 'spec-transport',

    send: function (data, fn) {
      fn.call(this, null, {});
    },

    map: function (data) {
      return {
        newProp: 1,
        ipAddress: '192.168.1.1'
      };
    }

  });

})(this);
