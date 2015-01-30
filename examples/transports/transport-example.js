/* global reqwest, store, gilt */
(function (root) {

  var gumshoe = root.gumshoe;

  gumshoe.transport({

    name: 'example-transport',

    send: function (data) {
      console.log('Gumshoe: Test Transport: Sending...');
      console.log(data);
    },

    map: function (data) {
      return {
        customData: {
          someData: true
        },
        ipAddress: '192.168.1.1'
      };
    }

  });

})(this);
