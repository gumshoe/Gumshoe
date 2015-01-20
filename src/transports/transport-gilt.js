/* global reqwest, store, gilt */
(function (root) {

  var gumshoe = root.gumshoe;

  gumshoe.transport({

    name: 'gilt-svc-event',

    send: function (data) {
      var noop = function () {},
        contentType = 'application/vnd.event.gilt.v1+json';

      reqwest({
        url: '/svc-event/streams/com.gilt.gumshoe.v1.GumshoeEvent/events/' + data.uuid,
        contentType: contentType,
        type: 'json',
        headers: { 'Accept': contentType },
        method: 'PUT',
        data: store._.stringify(data),
        error: noop,
        success: noop
      });
    },

    map: function (data) {

      var pageController,
        get;

      if (typeof gilt !== 'undefined' && gilt && gilt.require) {
        pageController = gilt.require.get('common.page_controller');
        get = function (name) {
          return pageController.getProperty(name) || null;
        };

        if (pageController) {
          data.ipAddress = get('ipAddress');

          data.giltData = {
            abTests: JSON.stringify(get('abTests') || '{}'),
            applicationName: get('applicationName'),
            channel: get('channelKey'),
            groups: get('groups'),
            hasPurchased: get('hasPurchased'),
            isBotRequest: get('isBotRequest'),
            isLoyaltyUser: get('isLoyaltyUser'),
            loyaltyStatus: get('loyaltyStatus'),
            pricer: JSON.stringify(get('pricer') || '{}'),
            section: get('section'),
            store: get('store') || get('storeKey'),
            subsite: get('subsiteKey'),
            timezone: get('timezone'),
            vendorUserId: get('vendorUserId'),
          };
        }
      }

      return data;
    }

  });

})(this);
