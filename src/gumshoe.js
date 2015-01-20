/* global performance, queryString, store */
(function (root, factory) {
  root.gumshoe = factory();
}(this,

function () {

  function extend (obj) {
    if (!isObject(obj)) {
      return obj;
    }
    var source, prop;
    for (var i = 1, length = arguments.length; i < length; i++) {
      source = arguments[i];
      for (prop in source) {
        obj[prop] = source[prop];
      }
    }
    return obj;
  }

  function isArray(obj) {
    return '[object Array]' === Object.prototype.toString.call(obj);
  }

  function isObject (obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  }

  function isString(value) {
    return typeof value == 'string' || (value && typeof value == 'object' &&
      Object.prototype.toString.call(value) == '[object String]') || false;
  }

  function uuidv4 (){
    var d = performance.now();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (d + Math.random()*16)%16 | 0;
      d = Math.floor(d/16);
      return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
  }

  var exports,
    queue = [],
    defaults = {
      transport: '',
      queueTimeout: 100
    },
    storage = store.namespace('gumshoe').session,
    config,
    transports = {},
    query = queryString.parse(location.search),
    viewport = (function viewport() {
      var e = window, a = 'inner';
      if (!('innerWidth' in window )) {
        a = 'client';
        e = document.documentElement || document.body;
      }
      return { width : e[ a+'Width' ] , height : e[ a+'Height' ] };
    })();

  function gumshoe (options) {
    config = extend({}, defaults, options);

    // always ensure options.transport is an array.
    if (isString(config.transport)) {
      config.transport = [config.transport];
    }
    else if (!isArray(config.transport)) {
      throw 'Gumeshoe: Transport property must be a [String] or [Array].';
    }

    // set a session based uuid
    if (!storage('uuid')) {
      storage('uuid', uuidv4());
    }

    // expose this for testing purposes
    exports.__internal__.config = config;
  }

  function collect () {
    var result = {
      // utmcs Character set (e.g. ISO-8859-1)
      characterSet: document.characterSet || document.charset || document.inputEncoding || 'Unknown',

      // utmsc Screen colour depth (e.g. 24-bit)
      colorDepth: screen.colorDepth + '',

      cookie: document.cookie,

      // gclid Gclid is a globally unique tracking parameter (Google Click Identifier)
      googleClickId: query.gclid || '',

      hash: window.location.hash,
      host: window.location.host,

      // utmhn Hostname
      hostName: window.location.hostname,

      // utmip IP address
      ipAddress: '',

      // utmje Java enabled?
      javaEnabled: navigator.javaEnabled(),

      // utmul Language code (e.g. en-us)
      language: document.documentElement ? document.documentElement.lang : window.navigator.language || 'Unknown',

      // login key: ?lk=
      loginKey: query.lk || '',

      origin: window.location.origin,

      // utmp  Page path
      path: window.location.pathname,
      platform: window.navigator.platform,
      port: window.location.port || 80,
      // promotional key: pkey
      promotionKey: query.pkey || '',
      protocol: window.location.protocol,

      queryString: window.location.search,

      // utmr  Full referral URL
      referer: document.referrer,

      screenAvailHeight: screen.availHeight,
      screenAvailWidth: screen.availWidth,
      screenHeight: screen.height,
      screenOrientationAngle: '',
      screenOrientationType: '',
      screenPixelDepth: screen.pixelDepth + '',
      // utmsr Screen resolution
      screenResolution: screen.width + 'x' + screen.height,
      screenWidth: screen.width,

      // utmdt Page title
      title: document.title,

      url: window.location.href,
      userAgent: window.navigator.userAgent,
      utmCampaign: query.utm_campaign || '',
      utmContent: query.utm_content || '',
      utmMedium: query.utm_medium || '',
      utmSource: query.utm_source || '',
      utmTerm: query.utm_term || '',

      // utmvp Viewport resolution
      viewportHeight: viewport.height,
      viewportResolution: viewport.width + 'x' + viewport.height,
      viewportWidth: viewport.width
    };

    // IE 8, 9 don't support this. Yay.
    if (screen.orientation) {
      result.screenOrientationAngle = screen.orientation.angle ? screen.orientation.angle : '';
      result.screenOrientationType = screen.orientation.type ? screen.orientation.type : '';
    }

    return result;
  }

  function send (eventName, eventData) {
    var pageData = collect(),
      baseData = {
        eventName: eventName,
        eventData: eventData || {},
        pageData: pageData,
        sessionUuid: storage('uuid'),
        timestamp: (new Date()).getTime(),
        timezoneOffset: (new Date()).getTimezoneOffset(),
        uuid: uuidv4()
      },
      transportFound = false;

    for(var i = 0; i < config.transport.length; i++) {
      var name = config.transport[i],
        transport,
        data;

      if (name && transports[name]) {
        transportFound = true;
        transport = transports[name];

        // allow each transport to extend the data with more information
        // or transform it how they'd like. transports cannot however,
        // modify eventData sent from the client.
        data = transport.map ? transport.map(baseData) : baseData;
        data = extend(baseData, data);

        if (!isString(data.eventData)) {
          data.eventData = JSON.stringify(data.eventData);
        }

        pushEvent(eventName, name, data);
      }
      else {
        throw 'Gumshoe: The transport name: ' + name + ', doesn\'t map to a valid transport.';
      }
    }

    if (!transportFound) {
      throw 'Gumshoe: No valid transports were found.';
    }
  }

  function nextEvent () {

    if (!queue.length) {
      return;
    }

    // granb the next event from the queue and remove it.
    var nevent = queue.shift(),
      transport = transports[nevent.transportName];

    transport.send(nevent.data);

    // put our newly modified queue in session storage
    // we're doing this after we send the event to mitigate data loss
    // in the event the request doesn't complete before the page changes
    storage('queue', queue);

    setTimeout(nextEvent, config.queueTimeout);
  }

  function pushEvent (eventName, transportName, data) {

    // add the event data to the queue
    queue.push({
      eventName: eventName,
      transportName: transportName,
      data: data
    });

    // put our newly modified queue in session storage
    storage('queue', queue);

    setTimeout(nextEvent, config.queueTimeout);
  }

  function transport (tp) {
    if (!tp.name) {
      throw 'Gumshoe: Transport [Object] must have a name defined.';
    }

    transports[tp.name] = tp;
  }

  exports = extend(gumshoe, {
    version: '{package_version}',
    send: send,
    transport: transport,
    uuid: uuidv4,
    __internal__: {
      collect: collect,
      config: config,
      queue: queue,
      storage: storage,
      transports: transports
    }
  });

  return exports;
}

));
