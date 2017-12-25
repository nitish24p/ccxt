"use strict";

//-----------------------------------------------------------------------------

import _JSON$stringify from 'babel-runtime/core-js/json/stringify';
import _slicedToArray from 'babel-runtime/helpers/slicedToArray';
import _Object$values from 'babel-runtime/core-js/object/values';
import _typeof from 'babel-runtime/helpers/typeof';
import _getIterator from 'babel-runtime/core-js/get-iterator';
import _Object$assign from 'babel-runtime/core-js/object/assign';
import _Object$keys from 'babel-runtime/core-js/object/keys';
import _regeneratorRuntime from 'babel-runtime/regenerator';
import _asyncToGenerator from 'babel-runtime/helpers/asyncToGenerator';
import _Promise from 'babel-runtime/core-js/promise';

var _this = this;

var CryptoJS = require('crypto-js'),
    qs = require('qs'); // querystring

//-----------------------------------------------------------------------------

var _require = require('./errors'),
    RequestTimeout = _require.RequestTimeout;

//-----------------------------------------------------------------------------
// utility helpers

var setTimeout_original = setTimeout;

// setTimeout can fire earlier than specified, so we need to ensure it does not happen...

var setTimeout_safe = function setTimeout_safe(done, ms) {
    var setTimeout = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : setTimeout_original;
    var targetTime = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : Date.now() + ms;


    var clearInnerTimeout = function clearInnerTimeout() {};
    var active = true;

    var id = setTimeout(function () {
        active = true;
        var rest = targetTime - Date.now();
        if (rest > 0) {
            clearInnerTimeout = setTimeout_safe(done, rest, setTimeout, targetTime); // try sleep more
        } else {
            done();
        }
    }, ms);

    return function clear() {
        if (active) {
            active = false; // dunno if IDs are unique on various platforms, so it's better to rely on this flag to exclude the possible cancellation of the wrong timer (if called after completion)
            clearTimeout(id);
        }
        clearInnerTimeout();
    };
};

var sleep = function sleep(ms) {
    return new _Promise(function (resolve) {
        return setTimeout_safe(resolve, ms);
    });
};

var decimal = function decimal(float) {
    return parseFloat(float).toString();
};

var timeout = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(ms, promise) {
        var clear, timeout;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        clear = function clear() {};

                        timeout = new _Promise(function (resolve) {
                            return clear = setTimeout_safe(resolve, ms);
                        });
                        _context.prev = 2;
                        _context.next = 5;
                        return _Promise.race([promise, timeout.then(function () {
                            throw new RequestTimeout('request timed out');
                        })]);

                    case 5:
                        return _context.abrupt('return', _context.sent);

                    case 6:
                        _context.prev = 6;

                        clear(); // fixes https://github.com/ccxt/ccxt/issues/749
                        return _context.finish(6);

                    case 9:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, _this, [[2,, 6, 9]]);
    }));

    return function timeout(_x3, _x4) {
        return _ref.apply(this, arguments);
    };
}();

var capitalize = function capitalize(string) {
    return string.length ? string.charAt(0).toUpperCase() + string.slice(1) : string;
};

var keysort = function keysort(object) {
    var result = {};
    _Object$keys(object).sort().forEach(function (key) {
        return result[key] = object[key];
    });
    return result;
};

var extend = function extend() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
    }

    return _Object$assign.apply(Object, [{}].concat(args));
};

var deepExtend = function deepExtend() {

    // if (args.length < 1)
    //     return args
    // else if (args.length < 2)
    //     return args[0]

    var result = undefined;

    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
    }

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = _getIterator(args), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var arg = _step.value;


            if (arg && (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) == 'object' && (arg.constructor === Object || !('constructor' in arg))) {

                if ((typeof result === 'undefined' ? 'undefined' : _typeof(result)) != 'object') {
                    result = {};
                }

                for (var key in arg) {
                    result[key] = deepExtend(result[key], arg[key]);
                }
            } else {

                result = arg;
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return result;
};

var omit = function omit(object) {
    for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        args[_key3 - 1] = arguments[_key3];
    }

    var result = extend(object);
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = _getIterator(args), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var x = _step2.value;

            if (typeof x === 'string') {
                delete result[x];
            } else if (Array.isArray(x)) {
                var _iteratorNormalCompletion3 = true;
                var _didIteratorError3 = false;
                var _iteratorError3 = undefined;

                try {
                    for (var _iterator3 = _getIterator(x), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                        var k = _step3.value;

                        delete result[k];
                    }
                } catch (err) {
                    _didIteratorError3 = true;
                    _iteratorError3 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion3 && _iterator3.return) {
                            _iterator3.return();
                        }
                    } finally {
                        if (_didIteratorError3) {
                            throw _iteratorError3;
                        }
                    }
                }
            }
        }
    } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
            }
        } finally {
            if (_didIteratorError2) {
                throw _iteratorError2;
            }
        }
    }

    return result;
};

var groupBy = function groupBy(array, key) {
    var result = {};
    _Object$values(array).filter(function (entry) {
        return entry[key] != 'undefined';
    }).forEach(function (entry) {
        if (typeof result[entry[key]] == 'undefined') result[entry[key]] = [];
        result[entry[key]].push(entry);
    });
    return result;
};

var filterBy = function filterBy(array, key) {
    var value = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;

    if (value) {
        var grouped = groupBy(array, key);
        if (value in grouped) return grouped[value];
        return [];
    }
    return array;
};

var indexBy = function indexBy(array, key) {
    var result = {};
    _Object$values(array).filter(function (entry) {
        return entry[key] != 'undefined';
    }).forEach(function (entry) {
        result[entry[key]] = entry;
    });
    return result;
};

var sortBy = function sortBy(array, key) {
    var descending = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    descending = descending ? -1 : 1;
    return array.sort(function (a, b) {
        return a[key] < b[key] ? -descending : a[key] > b[key] ? descending : 0;
    });
};

var flatten = function flatten(array) {
    var result = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    for (var i = 0, length = array.length; i < length; i++) {
        var value = array[i];
        if (Array.isArray(value)) {
            flatten(value, result);
        } else {
            result.push(value);
        }
    }
    return result;
};

var unique = function unique(array) {
    return array.filter(function (value, index, self) {
        return self.indexOf(value) == index;
    });
};

var pluck = function pluck(array, key) {
    return array.filter(function (element) {
        return typeof element[key] != 'undefined';
    }).map(function (element) {
        return element[key];
    });
};

var urlencode = function urlencode(object) {
    return qs.stringify(object);
};
var rawencode = function rawencode(object) {
    return qs.stringify(object, { encode: false });
};

var sum = function sum() {
    for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
    }

    var result = args.filter(function (arg) {
        return typeof arg != 'undefined';
    });
    return result.length > 0 ? result.reduce(function (sum, value) {
        return sum + value;
    }, 0) : undefined;
};

var safeFloat = function safeFloat(object, key) {
    var defaultValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;

    if (key in object) {
        if (typeof object[key] == 'number') return object[key];else if (typeof object[key] == 'string' && object[key]) return parseFloat(object[key]);
    }
    return defaultValue;
};

var safeString = function safeString(object, key) {
    var defaultValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;

    return object && key in object && object[key] ? object[key].toString() : defaultValue;
};

var safeInteger = function safeInteger(object, key) {
    var defaultValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;

    return key in object && object[key] ? parseInt(object[key]) : defaultValue;
};

var safeValue = function safeValue(object, key) {
    var defaultValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;

    return key in object && object[key] ? object[key] : defaultValue;
};

var uuid = function uuid(a) {
    return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, uuid);
};

// See https://stackoverflow.com/questions/1685680/how-to-avoid-scientific-notation-for-large-numbers-in-javascript for discussion

function toFixed(x) {
    // avoid scientific notation for too large and too small numbers

    if (Math.abs(x) < 1.0) {
        var e = parseInt(x.toString().split('e-')[1]);
        if (e) {
            x *= Math.pow(10, e - 1);
            x = '0.' + new Array(e).join('0') + x.toString().substring(2);
        }
    } else {
        var _e = parseInt(x.toString().split('+')[1]);
        if (_e > 20) {
            _e -= 20;
            x /= Math.pow(10, _e);
            x += new Array(_e + 1).join('0');
        }
    }
    return x;
}

// See https://stackoverflow.com/questions/4912788/truncate-not-round-off-decimal-numbers-in-javascript for discussion

// > So, after all it turned out, rounding bugs will always haunt you, no matter how hard you try to compensate them.
// > Hence the problem should be attacked by representing numbers exactly in decimal notation.

var truncate_regExpCache = [],
    truncate = function truncate(num) {
    var precision = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    num = toFixed(num);
    var re = truncate_regExpCache[precision] || (truncate_regExpCache[precision] = new RegExp("([-]*\\d+\\.\\d{" + precision + "})(\\d)"));

    var _ref2 = num.toString().match(re) || [null, num],
        _ref3 = _slicedToArray(_ref2, 2),
        result = _ref3[1];

    return parseFloat(result);
};

var precisionFromString = function precisionFromString(string) {
    var split = string.replace(/0+$/g, '').split('.');
    return split.length > 1 ? split[1].length : 0;
};

var ordered = function ordered(x) {
    return x;
}; // a stub to keep assoc keys in order, in JS it does nothing, it's mostly for Python

var aggregate = function aggregate(bidasks) {

    var result = {};

    bidasks.forEach(function (_ref4) {
        var _ref5 = _slicedToArray(_ref4, 2),
            price = _ref5[0],
            volume = _ref5[1];

        if (volume > 0) result[price] = (result[price] || 0) + volume;
    });

    return _Object$keys(result).map(function (price) {
        return [parseFloat(price), parseFloat(result[price])];
    });
};

//-----------------------------------------------------------------------------
// string ←→ binary ←→ base64 conversion routines

var stringToBinary = function stringToBinary(str) {
    var arr = new Uint8Array(str.length);
    for (var i = 0; i < str.length; i++) {
        arr[i] = str.charCodeAt(i);
    }
    return CryptoJS.lib.WordArray.create(arr);
};

var stringToBase64 = function stringToBase64(string) {
    return CryptoJS.enc.Latin1.parse(string).toString(CryptoJS.enc.Base64);
},
    utf16ToBase64 = function utf16ToBase64(string) {
    return CryptoJS.enc.Utf16.parse(string).toString(CryptoJS.enc.Base64);
},
    base64ToBinary = function base64ToBinary(string) {
    return CryptoJS.enc.Base64.parse(string);
},
    base64ToString = function base64ToString(string) {
    return CryptoJS.enc.Base64.parse(string).toString(CryptoJS.enc.Utf8);
},
    binaryToString = function binaryToString(string) {
    return string;
};

var binaryConcat = function binaryConcat() {
    for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        args[_key5] = arguments[_key5];
    }

    return args.reduce(function (a, b) {
        return a.concat(b);
    });
};

// url-safe-base64 without equals signs, with + replaced by - and slashes replaced by underscores
var urlencodeBase64 = function urlencodeBase64(base64string) {
    return base64string.replace(/[=]+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
};

//-----------------------------------------------------------------------------
// cryptography

var hash = function hash(request) {
    var hash = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'md5';
    var digest = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'hex';

    var result = CryptoJS[hash.toUpperCase()](request);
    return digest == 'binary' ? result : result.toString(CryptoJS.enc[capitalize(digest)]);
};

var hmac = function hmac(request, secret) {
    var hash = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'sha256';
    var digest = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'hex';

    var encoding = digest == 'binary' ? 'Latin1' : capitalize(digest);
    return CryptoJS['Hmac' + hash.toUpperCase()](request, secret).toString(CryptoJS.enc[capitalize(encoding)]);
};

//-----------------------------------------------------------------------------
// a JSON Web Token authentication method

var jwt = function jwt(request, secret) {
    var alg = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'HS256';
    var hash = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'sha256';

    var encodedHeader = urlencodeBase64(stringToBase64(_JSON$stringify({ 'alg': alg, 'typ': 'JWT' }))),
        encodedData = urlencodeBase64(stringToBase64(_JSON$stringify(request))),
        token = [encodedHeader, encodedData].join('.'),
        signature = urlencodeBase64(utf16ToBase64(hmac(token, secret, hash, 'utf16')));
    return [token, signature].join('.');
};

//-----------------------------------------------------------------------------

module.exports = {

    setTimeout_safe: setTimeout_safe,

    // common utility functions

    sleep: sleep,
    timeout: timeout,
    capitalize: capitalize,
    keysort: keysort,
    extend: extend,
    deepExtend: deepExtend,
    omit: omit,
    groupBy: groupBy,
    indexBy: indexBy,
    sortBy: sortBy,
    filterBy: filterBy,
    flatten: flatten,
    unique: unique,
    pluck: pluck,
    urlencode: urlencode,
    rawencode: rawencode,
    sum: sum,
    decimal: decimal,
    safeFloat: safeFloat,
    safeString: safeString,
    safeInteger: safeInteger,
    safeValue: safeValue,
    ordered: ordered,
    aggregate: aggregate,
    truncate: truncate,
    uuid: uuid,
    precisionFromString: precisionFromString,

    // underscore aliases

    index_by: indexBy,
    sort_by: sortBy,
    group_by: groupBy,
    filter_by: filterBy,
    safe_float: safeFloat,
    safe_string: safeString,
    safe_integer: safeInteger,
    safe_value: safeValue,

    // crypto functions

    binaryConcat: binaryConcat,
    stringToBinary: stringToBinary,
    binaryToString: binaryToString,
    stringToBase64: stringToBase64,
    utf16ToBase64: utf16ToBase64,
    base64ToBinary: base64ToBinary,
    base64ToString: base64ToString,
    urlencodeBase64: urlencodeBase64,
    hash: hash,
    hmac: hmac,
    jwt: jwt,

    // json
    json: _JSON$stringify,
    unjson: JSON.parse
};