/** @checksum __CHECKSUM__ */
/* eslint-disable */
module.exports = (function(root, payload) {
  var queryStringify = (function () {
    // This code belongs to qs npm package: https://github.com/ljharb/qs
    var hexTable = (function () {
      var array = [];
      for (var i = 0; i < 256; ++i) {
          array.push('%' + ((i < 16 ? '0' : '') + i.toString(16)).toUpperCase());
      }

      return array;
    }());

    var encode = function (str) {
      // This code was originally written by Brian White (mscdex) for the io.js core querystring library.
      // It has been adapted here for stricter adherence to RFC 3986
      if (str.length === 0) {
        return str;
      }

      var string = typeof str === 'string' ? str : String(str);

      var out = '';
      for (var i = 0; i < string.length; ++i) {
        var c = string.charCodeAt(i);

        if (
          c === 0x2D || // -
          c === 0x2E || // .
          c === 0x5F || // _
          c === 0x7E || // ~
          (c >= 0x30 && c <= 0x39) || // 0-9
          (c >= 0x41 && c <= 0x5A) || // a-z
          (c >= 0x61 && c <= 0x7A) // A-Z
        ) {
          out += string.charAt(i);
          continue;
        }

        if (c < 0x80) {
          out = out + hexTable[c];
          continue;
        }

        if (c < 0x800) {
          out = out + (hexTable[0xC0 | (c >> 6)] + hexTable[0x80 | (c & 0x3F)]);
          continue;
        }

        if (c < 0xD800 || c >= 0xE000) {
          out = out + (hexTable[0xE0 | (c >> 12)] + hexTable[0x80 | ((c >> 6) & 0x3F)] + hexTable[0x80 | (c & 0x3F)]);
          continue;
        }

        i += 1;
        c = 0x10000 + (((c & 0x3FF) << 10) | (string.charCodeAt(i) & 0x3FF));
        out += hexTable[0xF0 | (c >> 18)] + hexTable[0x80 | ((c >> 12) & 0x3F)] + hexTable[0x80 | ((c >> 6) & 0x3F)] + hexTable[0x80 | (c & 0x3F)];
      }

      return out;
    };

    var arrayPrefixGenerators = {
        brackets: function brackets(prefix) {
            return prefix + '[]';
        },
        indices: function indices(prefix, key) {
            return prefix + '[' + key + ']';
        },
        repeat: function repeat(prefix) {
            return prefix;
        }
    };

    var toISO = Date.prototype.toISOString;

    var defaults = {
        delimiter: '&',
        encode: true,
        encoder: encode,
        serializeDate: function serializeDate(date) {
            return toISO.call(date);
        },
        skipNulls: false,
        strictNullHandling: false
    };

    var stringify = function stringify(object, prefix, generateArrayPrefix, strictNullHandling, skipNulls, encoder, filter, sort, allowDots, serializeDate) {
      var obj = object;
      if (typeof filter === 'function') {
        obj = filter(prefix, obj);
      } else if (obj instanceof Date) {
        obj = serializeDate(obj);
      } else if (obj === null) {
        if (strictNullHandling) {
          return encoder ? encoder(prefix) : prefix;
        }

        obj = '';
      }

      if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
        if (encoder) {
          return [encoder(prefix) + '=' + encoder(obj)];
        }
        return [prefix + '=' + String(obj)];
      }

      var values = [];

      if (typeof obj === 'undefined') {
        return values;
      }

      var objKeys;
      if (Array.isArray(filter)) {
        objKeys = filter;
      } else {
        var keys = Object.keys(obj);
        objKeys = sort ? keys.sort(sort) : keys;
      }

      for (var i = 0; i < objKeys.length; ++i) {
        var key = objKeys[i];

        if (skipNulls && obj[key] === null) {
          continue;
        }

        if (Array.isArray(obj)) {
          values = values.concat(stringify(
            obj[key],
            generateArrayPrefix(prefix, key),
            generateArrayPrefix,
            strictNullHandling,
            skipNulls,
            encoder,
            filter,
            sort,
            allowDots,
            serializeDate
            ));
        } else {
          values = values.concat(stringify(
            obj[key],
            prefix + (allowDots ? '.' + key : '[' + key + ']'),
            generateArrayPrefix,
            strictNullHandling,
            skipNulls,
            encoder,
            filter,
            sort,
            allowDots,
            serializeDate
            ));
        }
      }

      return values;
    };

    return function (object, opts) {
      var obj = object;
      var options = opts || {};
      var delimiter = typeof options.delimiter === 'undefined' ? defaults.delimiter : options.delimiter;
      var strictNullHandling = typeof options.strictNullHandling === 'boolean' ? options.strictNullHandling : defaults.strictNullHandling;
      var skipNulls = typeof options.skipNulls === 'boolean' ? options.skipNulls : defaults.skipNulls;
      var encode = typeof options.encode === 'boolean' ? options.encode : defaults.encode;
      var encoder = encode ? (typeof options.encoder === 'function' ? options.encoder : defaults.encoder) : null;
      var sort = typeof options.sort === 'function' ? options.sort : null;
      var allowDots = typeof options.allowDots === 'undefined' ? false : options.allowDots;
      var serializeDate = typeof options.serializeDate === 'function' ? options.serializeDate : defaults.serializeDate;
      var objKeys;
      var filter;

      if (options.encoder !== null && options.encoder !== undefined && typeof options.encoder !== 'function') {
        throw new TypeError('Encoder has to be a function.');
      }

      if (typeof options.filter === 'function') {
        filter = options.filter;
        obj = filter('', obj);
      } else if (Array.isArray(options.filter)) {
        filter = options.filter;
        objKeys = filter;
      }

      var keys = [];

      if (typeof obj !== 'object' || obj === null) {
        return '';
      }

      var arrayFormat;
      if (options.arrayFormat in arrayPrefixGenerators) {
        arrayFormat = options.arrayFormat;
      } else if ('indices' in options) {
        arrayFormat = options.indices ? 'indices' : 'repeat';
      } else {
        arrayFormat = 'indices';
      }

      var generateArrayPrefix = arrayPrefixGenerators[arrayFormat];

      if (!objKeys) {
        objKeys = Object.keys(obj);
      }

      if (sort) {
        objKeys.sort(sort);
      }

      for (var i = 0; i < objKeys.length; ++i) {
        var key = objKeys[i];

        if (skipNulls && obj[key] === null) {
          continue;
        }

        keys = keys.concat(stringify(
          obj[key],
          key,
          generateArrayPrefix,
          strictNullHandling,
          skipNulls,
          encoder,
          filter,
          sort,
          allowDots,
          serializeDate
          ));
      }

      return keys.join(delimiter);
    };
  })();

  var Roads = {};
  var camelCase = payload.camelcase;
  var routes = payload.routes;
  var tables = {};

  var toCamelCase = function (str) {
    return str.replace(/\_\w/g, function(matches) {
      return matches[1].toUpperCase();
    });
  }

  var buildPathHelper = function (route) {
    return function() {
      var args = [].slice.call(arguments);
      var _pattern = route.path;

      while(_pattern.match(/\:[1-9a-z_]+/i)) {
        var key = args.shift();
        _pattern = _pattern.replace(/(\:[1-9a-z_]+)/i, key);
      }

      if (args[0]) {
        return _pattern + '?' + queryStringify(args[0], { skipNulls: true });

      } else {
        return _pattern;
      }
    };
  }

  routes.forEach(function (route) {
    var fnName = route.helper + '_path';

    if (camelCase) {
      fnName = toCamelCase(fnName);
    }

    if (!tables[route.helper]) {
      tables[route.helper] = {};
    }

    if (!Roads[fnName]) {
      Roads[fnName] = function () {
        var args = [].slice.call(arguments);
        var action = args.shift();

        return tables[route.helper][action.toString()].apply(null, args);
      }
    }

    tables[route.helper][route.opts] = buildPathHelper(route);
  });

  return Roads;
})(window, __PAYLOAD__);
