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
    root.returnExports = factory(root['_']);
  }
}(this,

function (_) {

  /**
   * @file perfnow is a 0.14 kb window.performance.now high resolution timer polyfill with Date fallback
   * @author Daniel Lamb <dlamb.open.source@gmail.com>
   */
  function perfnow(window) {
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
  }
  perfnow(window);

  var defaults = {
      transport: '',
    },
    config,
    transports = {};

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

  function uuidv4 (){
    var d = performance.now();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (d + Math.random()*16)%16 | 0;
      d = Math.floor(d/16);
      return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
  };

  function collect () {
    var result = {};

// Enviro­nment Parameters
// utmcs Character set (e.g. ISO-88­59-1)
// utmfl Flash version
// utmip IP address
// utmje Java enabled? (1 = yes, 0 = no)
// utmsc Screen colour depth (e.g. 24-bit)
// utmsr Screen resolution
// utmul Language code (e.g. en-us)
// utmvp Viewport resolution

// Hit / Campaign Parameters
// utmac Account ID (e.g. UA-123­456-1)
// utmcc Analytics Cookie string
// utmcn New campaign visit?
// utmcr Repeat campaign visit?
// utmdt Page title
// utmhn Hostname
// utmp  Page path
// utmr  Full referral URL

// Session
// session guid
// session hits

    return result;
  }

  function send () {
    _.each(config.transport, function (name) {
      var transport,
        data;

      if (name && transports[name]) {
        transport = transports[name];

        data = transport.map();

        transport.send(data);
      }
    });
  }

  function transport (tp) {
    if (!tp.name) {
      throw 'Gumeshoe: Transport [Object] must have a name defined.';
    }

    transports[tp.name] = tp;
  }

  // transports

  transport({

    name: 'gilt',

    collect: function () {

    },

    map: function () {

    },

    send: function () {

    }

  });

  collect();
  send();

  return _.extend(gumshoe, {
    transport: transport
  });
}

));