gumshoe.transport({

  name: 'gilt-svc-event',

  send: function (data) {
    var noop = function () {},
      contentType = 'application/vnd.event.gilt.v1+json';

    reqwest({
      url: '/svc-event/streams/web.test.pageview/events/' + data.uuid,
      type: contentType,
      headers: { 'Accept': contentType },
      method: 'XPUT',
      data: store._.stringify(data),
      error: noop,
      success: noop
    });
  },

  map: function (data) {
    return { uuid: '00000000-0000-0000-0000-000000000000' };
  }

});
