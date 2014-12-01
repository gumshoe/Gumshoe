(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], function () {
      factory();
    });
  }
  else if (typeof exports === 'object') {
    module.exports = factory();
  }
  else {
    root.gumshoe = factory();
  }
}(this,

function () {

  function extend (obj) {
    if (!isObject(obj)) return obj;
    var source, prop;
    for (var i = 1, length = arguments.length; i < length; i++) {
      source = arguments[i];
      for (prop in source) {
        obj[prop] = source[prop];
      }
    }
    return obj;
  };

  function isArray(obj) {
    return '[object Array]' === Object.prototype.toString.call(obj);
  }

  function isObject (obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  function isString(value) {
    return typeof value == 'string' || (value && typeof value == 'object' &&
      toString.call(value) == '[object String]') || false;
  }

  var defaults = {
      transport: '',
    },
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
      throw 'Gumeshoe: Transport property must be a [String] or [Array].'
    }

    send();
  }

  function collect () {
    var result = {
      // utmcs Character set (e.g. ISO-88­59-1)
      characterSet: document.characterSet || document.charset || document.inputEncoding || 'Unknown',

      // utmje Java enabled?
      javaEnabled: navigator.javaEnabled(),

      // utmsc Screen colour depth (e.g. 24-bit)
      colorDepth: screen.colorDepth,

      // utmsr Screen resolution
      screenResolution: screen.width + 'x' + screen.height,

      screenWidth: screen.width,
      screenHeight: screen.height,
      screenAvailWidth: screen.availWidth,
      screenAvailHeight: screen.availHeight,
      screenOrientationAngle: screen.orientation.angle,
      screenOrientationType: screen.orientation.type,
      screenPixelDepth: screen.pixelDepth,

      // utmul Language code (e.g. en-us)
      language: document.documentElement ? document.documentElement.lang : window.navigator.language || 'Unknown',

      // utmvp Viewport resolution
      viewportResolution: viewport.width + 'x' + viewport.height,

      viewportWidth: viewport.width,
      viewportHeight: viewport.height,

      utmContent: query['utm-content'] || '',
      utmSource: query['utm-source'] || '',
      utmMedium: query['utm-medium'] || '',
      utmCampaign: query['utm-campaign'] || '',

      // utmdt Page title
      title: document.title,

      hash: window.location.hash,
      host: window.location.host,

      // utmhn Hostname
      hostName: window.location.hostname,

      url: window.location.href,
      origin: window.location.origin,

      // utmp  Page path
      path: window.location.pathname,

      port: window.location.port || 80,
      protocol: window.location.protocol,
      queryString: window.location.search,

      // utmr  Full referral URL
      referer: document.referrer,

      userAgent: window.navigator.userAgent,
      platform: window.navigator.platform,

      // gclid Gclid is a globally unique tracking parameter (Google Click Identifier)
      googleClickId: query.gclid || '',

      // utmip IP address
      ipAddress: ''
    };

    return result;
  }

  function send () {
    var baseData = collect();

    for(var i = 0; i < config.transport.length; i++) {
      var name = config.transport[i],
        transport,
        data;

      if (name && transports[name]) {
        transport = transports[name];

        // allow each transport to extend the data with more information
        // or transform it how they'd like.
        data = transport.map ? transport.map(baseData) : {};

        transport.send(extend(baseData, data));
      }
    }
  }

  function transport (tp) {
    if (!tp.name) {
      throw 'Gumshoe: Transport [Object] must have a name defined.';
    }

    transports[tp.name] = tp;
  }

  return extend(gumshoe, {
    transport: transport
  });
}

));
