"use strict";

// ---------------------------------------------------------------------------

import _regeneratorRuntime from 'babel-runtime/regenerator';
import _Object$keys from 'babel-runtime/core-js/object/keys';
import _asyncToGenerator from 'babel-runtime/helpers/asyncToGenerator';
import _Object$getPrototypeOf from 'babel-runtime/core-js/object/get-prototype-of';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _get from 'babel-runtime/helpers/get';
import _inherits from 'babel-runtime/helpers/inherits';
var btcbox = require('./btcbox.js');

// ---------------------------------------------------------------------------

module.exports = function (_btcbox) {
    _inherits(jubi, _btcbox);

    function jubi() {
        _classCallCheck(this, jubi);

        return _possibleConstructorReturn(this, (jubi.__proto__ || _Object$getPrototypeOf(jubi)).apply(this, arguments));
    }

    _createClass(jubi, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend(_get(jubi.prototype.__proto__ || _Object$getPrototypeOf(jubi.prototype), 'describe', this).call(this), {
                'id': 'jubi',
                'name': 'jubi.com',
                'countries': 'CN',
                'rateLimit': 1500,
                'version': 'v1',
                'hasCORS': false,
                'hasFetchTickers': true,
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/27766581-9d397d9a-5edd-11e7-8fb9-5d8236c0e692.jpg',
                    'api': 'https://www.jubi.com/api',
                    'www': 'https://www.jubi.com',
                    'doc': 'https://www.jubi.com/help/api.html'
                }
            });
        }
    }, {
        key: 'fetchMarkets',
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
                var markets, keys, result, p, id, base, quote, symbol;
                return _regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.publicGetAllticker();

                            case 2:
                                markets = _context.sent;
                                keys = _Object$keys(markets);
                                result = [];

                                for (p = 0; p < keys.length; p++) {
                                    id = keys[p];
                                    base = id.toUpperCase();
                                    quote = 'CNY'; // todo

                                    symbol = base + '/' + quote;

                                    base = this.commonCurrencyCode(base);
                                    quote = this.commonCurrencyCode(quote);
                                    result.push({
                                        'id': id,
                                        'symbol': symbol,
                                        'base': base,
                                        'quote': quote,
                                        'info': id
                                    });
                                }
                                return _context.abrupt('return', result);

                            case 7:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function fetchMarkets() {
                return _ref.apply(this, arguments);
            }

            return fetchMarkets;
        }()
    }]);

    return jubi;
}(btcbox);