/* global performance, queryString */
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
      throw 'Gumeshoe: Transport property must be a [String] or [Array].';
    }

    send();
  }

  function collect () {
    var result = {
      // utmcs Character set (e.g. ISO-8859-1)
      characterSet: document.characterSet || document.charset || document.inputEncoding || 'Unknown',

      // utmje Java enabled?
      javaEnabled: navigator.javaEnabled(),

      // utmsc Screen colour depth (e.g. 24-bit)
      colorDepth: screen.colorDepth + '',

      // utmsr Screen resolution
      screenResolution: screen.width + 'x' + screen.height,

      screenWidth: screen.width,
      screenHeight: screen.height,
      screenAvailWidth: screen.availWidth,
      screenAvailHeight: screen.availHeight,
      screenOrientationAngle: '',
      screenOrientationType: '',
      screenPixelDepth: screen.pixelDepth + '',

      // utmul Language code (e.g. en-us)
      language: document.documentElement ? document.documentElement.lang : window.navigator.language || 'Unknown',

      // utmvp Viewport resolution
      viewportResolution: viewport.width + 'x' + viewport.height,

      viewportWidth: viewport.width,
      viewportHeight: viewport.height,

      utmContent: query.utm_content || '',
      utmSource: query.utm_source || '',
      utmMedium: query.utm_medium || '',
      utmCampaign: query.utm_campaign || '',
      utmTerm: query.utm_term || '',

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

      // promotional key: pkey
      promotionKey: query.pkey || '',

      // login key: lk
      loginKey: query.lk || '',

      // utmip IP address
      ipAddress: ''
    };

    // IE 8, 9 don't support this. Yay.
    if (screen.orientation) {
      result.screenOrientationAngle = screen.orientation.angle ? screen.orientation.angle : '';
      result.screenOrientationType = screen.orientation.type ? screen.orientation.type : '';
    }

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
    version: '{package_version}',
    transport: transport,
    uuid: uuidv4
  });
}

));
