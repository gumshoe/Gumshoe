/* global reqwest, store, gilt */
(function (root) {

  var gumshoe = root.gumshoe,
    defaults = {
      giltData: {
        abTests: '{}',
        applicationName: '',
        channel: '',
        groups: '',
        hasPurchased: false,
        isBotRequest: false,
        isLoyaltyUser: false,
        loyaltyStatus: '',
        pricer: '{}',
        section: '',
        store: '',
        subsite: '',
        timezone: '',
        vendorUserId: ''
      }
    };

  gumshoe.transport({

    name: 'gilt-svc-event',

    send: function (data) {
      var noop = function () {},
        url = '',
        contentType = 'application/vnd.event.gilt.v1+json';

      try {
        url = '/svc-event/streams/com.gilt.gumshoe.v1.GumshoeEvent/events/' + data.uuid;

        reqwest({
          url: url,
          contentType: contentType,
          type: 'json',
          headers: { 'Accept': contentType },
          method: 'PUT',
          data: store._.stringify(data),
          error: noop,
          success: noop
        });
      }
      catch (e) {
        if (typeof console !== undefined) {
          (console.error || console.log).call(console, 'Gumshoe Error: ' + url + '\n\n' + e);
        }
      }
    },

    map: function (data) {

      var pageController,
        get = function (name) {
          return pageController.getProperty(name) || null;
        },
        result = gumshoe.extend({}, defaults);

      if (typeof gilt !== 'undefined' && gilt && gilt.require) {
        try {
          pageController = gilt.require.get('common.page_controller');
        }
        catch (e) { }

        if (pageController) {
          data.ipAddress = get('ipAddress');

          result = gumshoe.extend(result, {
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
            vendorUserId: get('vendorUserId')
          });
        }
      }

      return gumshoe.extend(data, result);
    }

  });

})(this);
