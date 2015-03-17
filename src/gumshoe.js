/* global performance, queryString, store */
(function (root) {

  var store = root.store;

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

  function isArray (obj) {
    return '[object Array]' === Object.prototype.toString.call(obj);
  }

  function isFunction (obj) {
    return ('' + typeof obj) === 'function';
  }

  function isObject (obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  }

  function isString (value) {
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

  var defaults = {
      transport: '',
      queueTimeout: 100
    },
    storage = store.namespace('gumshoe').session,
    queue = storage('queue') || [],
    transports = {};

  function gumshoe (options) {
    options = extend({}, defaults, options);

    // always ensure options.transport is an array.
    if (isString(options.transport)) {
      options.transport = [options.transport];
    }
    else if (!isArray(options.transport)) {
      throw 'Gumeshoe: Transport property must be a [String] or [Array].';
    }

    // set a session based uuid
    if (!storage('uuid')) {
      storage('uuid', uuidv4());
    }

    // expose this for testing purposes
    gumshoe.options = options;
  }

  function each (obj, iterator, context) {
    if (obj === null) {
      return;
    }

    if (Array.prototype.forEach && obj.forEach === Array.prototype.forEach) {
      obj.forEach(iterator, context);
    }
    else if (obj.length === +obj.length) {
      for (var i = 0, l = obj.length; i < l; i++) {
        if (iterator.call(context, obj[i], i, obj) === {}) {
          return;
        }
      }
    }
    else {
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (iterator.call(context, obj[key], key, obj) === {}) {
            return;
          }
        }
      }
    }
  }

  function map (obj, iterator, context) {
    var results = [];

    if (!obj) {
      return results;
    }

    if (Array.prototype.map && obj.map === Array.prototype.map) {
      return obj.map(iterator, context);
    }

    each(obj, function(value, index, list) {
      results[results.length] = iterator.call(context, value, index, list);
    });

    return results;
  }

  function collectPlugins () {
    var result,
      plugins = navigator.plugins || [];

    result = map(plugins, function (plugin) {
      var mimeTypes = map(plugin, function (mimeType) {
        var type = mimeType.type;

        if (mimeType.suffixes) {
          type += '~' + mimeType.suffixes;
        }

        return type;
      });

      return {
        description: plugin.description,
        filename: plugin.filename,
        mimeTypes: mimeTypes,
        name: plugin.name
      };
    });

    return result;
  }

  function collect () {

    function getViewport() {
      var e = window, a = 'inner';
      if (!('innerWidth' in window )) {
        a = 'client';
        e = document.documentElement || document.body;
      }
      return { width : e[ a+'Width' ] , height : e[ a+'Height' ] };
    }

    var
      viewport = getViewport(),

      query = queryString.parse(location.search),

      result = {
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

        // IE9 doesn't support this
        origin: window.location.origin || '',

        // utmp  Page path
        path: window.location.pathname,
        platform: window.navigator.platform,
        plugins: collectPlugins(),
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
      },

      intFields = [
        'port', 'screenAvailHeight', 'screenAvailWidth', 'screenHeight',
        'screenOrientationAngle', 'screenWidth', 'viewportHeight', 'viewportWidth'
      ],
      prop,
      value;

    // IE 8, 9 don't support this. Yay.
    if (screen.orientation) {
      result.screenOrientationAngle = parseInt(screen.orientation.angle ? screen.orientation.angle : '0');
      result.screenOrientationType = screen.orientation.type ? screen.orientation.type : '';

      if (isNaN(result.screenOrientationAngle)) {
        result.screenOrientationAngle = 0;
      }
    }

    // assert that these values are ints
    for (var i = 0; i < intFields.length; i++) {
      prop = intFields[i];
      value = parseInt(result[prop]);

      if (isNaN(value)) {
        value = 0;
      }

      result[prop] = value;
    }

    return result;
  }

  function send (eventName, eventData) {
    var pageData = collect(),
      baseData = {
        eventName: eventName,
        eventData: eventData || {},
        gumshoe: '{package_version}',
        pageData: pageData,
        sessionUuid: storage('uuid'),
        timestamp: (new Date()).getTime(),
        timezoneOffset: (new Date()).getTimezoneOffset(),
        uuid: uuidv4()
      },
      transportFound = false;

    for(var i = 0; i < gumshoe.options.transport.length; i++) {
      var name = gumshoe.options.transport[i],
        transport,
        data;

      if (name && transports[name]) {
        transportFound = true;
        transport = transports[name];

        // allow each transport to extend the data with more information
        // or transform it how they'd like. transports cannot however,
        // modify eventData sent from the client.
        data = transport.map ? transport.map(baseData) : baseData;

        // extend our data with whatever came back from the transport
        data = extend(baseData, data);

        // TODO: remove this. gumshoe shouldn't care what format this is in
        if (!isString(data.eventData)) {
          data.eventData = JSON.stringify(data.eventData);
        }

        // TODO: remove this. gumshoe shouldn't care what format this is in
        if (!isString(data.pageData.plugins)) {
          data.pageData.plugins = JSON.stringify(data.pageData.plugins);
        }

        // TODO: remove this. temporary bugfix for apps
        if (!data.pageData.ipAddress) {
          data.pageData.ipAddress = '<unknown>';
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

    setTimeout(nextEvent, gumshoe.options.queueTimeout);
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

    setTimeout(nextEvent, gumshoe.options.queueTimeout);
  }

  function transport (tp) {
    if (!tp.name) {
      throw 'Gumshoe: Transport [Object] must have a name defined.';
    }

    transports[tp.name] = tp;
  }

  // setup some static properties
  gumshoe.version = '{package_version}';
  gumshoe.options = {};

  // setup some static methods
  gumshoe.extend = extend;
  gumshoe.send = send,
  gumshoe.transport = transport;
  gumshoe.uuid = uuidv4;

  // setup some internal stuff for access
  gumshoe._ = {
    collect: collect,
    queue: queue,
    storage: storage,
    transports: transports
  };

  if (root.gumshoe) {

    if (root.gumshoe.ready) {
      root.gumshoe.ready = gumshoe.ready = root.gumshoe.ready;
      root.gumshoe = gumshoe;

      if (!isFunction(root.gumshoe.ready.resolve)) {
        throw 'Gumshoe: gumshoe.ready was predefined, but is not a Promise/A deferred.';
      }

      root.gumshoe.ready.resolve();
    }
  }
  else {
    root.gumshoe = gumshoe;
  }


})(this);
