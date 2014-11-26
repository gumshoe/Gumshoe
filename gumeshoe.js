(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['lodash', 'underscore'], function (lodash, underscrore) {
      factory(lodash || underscore);
    });
  }
  else if (typeof exports === 'object') {
    module.exports = factory(require('lodash') || require('underscore'));
  }
  else {
    root.gumshoe = factory(root['_']);
  }
}(this,

function (_) {

  /**
   * @file perfnow is a 0.14 kb window.performance.now high resolution timer polyfill with Date fallback
   * @author Daniel Lamb <dlamb.open.source@gmail.com>
   */
  (function perfnow (window) {
    // make sure we have an object to work with
    if (!('performance' in window)) {
      window.performance = {};
    }
    var perf = window.performance;
    // handle vendor prefixing
    window.performance.now = perf.now ||
      perf.mozNow ||
      perf.msNow ||
      perf.oNow ||
      perf.webkitNow ||
      // fallback to Date
      Date.now || function () {
        return new Date().getTime();
      };
  })(window);

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

  function gumeshoe (options) {
    config = _.extend({}, defaults, options);

    // always ensure options.transport is an array.
    if (_.isString(config.transport)) {
      config.transport = [config.transport];
    }
    else if (!_.isArray(config.transport)) {
      throw 'Gumeshoe: Transport property must be a [String] or [Array].'
    }
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
      language: document.documentElement ? document.documentElement.lang : 'Unknown',

      // utmvp Viewport resolution
      viewportResolution: viewport.width + 'x' + viewport.height,

      viewportWidth: viewport.width,
      viewportHeight: viewport.height,

      utmContent: query['utm-content'],
      utmSource: query['utm-source'],
      utmMedium: query['utm-medium'],
      utmCampaign: query['utm-campaign'],

      // utmdt Page title
      title: document.title

      hash: document.hash,
      host: document.host,

      // utmhn Hostname
      hostName: document.hostName,

      url: document.href,
      origin: document.origin,

      // utmp  Page path
      path: document.pathname,

      port: document.port || 80,
      protocol: document.protocol,
      queryString: document.search,

      // utmr  Full referral URL
      referer: document.referrer,

      // gclid Gclid is a globally unique tracking parameter (Google Click Identifier)
      googleClickId: query.gclid,

      // utmip IP address
      ipAddress: ''
    };

    return result;
  }

  function send () {
    var baseData = collect();

    _.each(config.transport, function (name) {
      var transport,
        data;

      if (name && transports[name]) {
        transport = transports[name];

        // allow each transport to extend the data with more information
        // or transform it how they'd like.
        data = transport.map ? transport.map(baseData) : {};

        transport.send(_.extend(baseData, data));
      }
    });
  }

  function transport (tp) {
    if (!tp.name) {
      throw 'Gumeshoe: Transport [Object] must have a name defined.';
    }

    transports[tp.name] = tp;
  }

  send();

  return _.extend(gumshoe, {
    transport: transport
  });
}

));