"use strict";

// ---------------------------------------------------------------------------

import _regeneratorRuntime from 'babel-runtime/regenerator';
import _asyncToGenerator from 'babel-runtime/helpers/asyncToGenerator';
import _Object$getPrototypeOf from 'babel-runtime/core-js/object/get-prototype-of';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _get from 'babel-runtime/helpers/get';
import _inherits from 'babel-runtime/helpers/inherits';
var bittrex = require('./bittrex.js');

// ---------------------------------------------------------------------------

module.exports = function (_bittrex) {
    _inherits(bleutrade, _bittrex);

    function bleutrade() {
        _classCallCheck(this, bleutrade);

        return _possibleConstructorReturn(this, (bleutrade.__proto__ || _Object$getPrototypeOf(bleutrade)).apply(this, arguments));
    }

    _createClass(bleutrade, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend(_get(bleutrade.prototype.__proto__ || _Object$getPrototypeOf(bleutrade.prototype), 'describe', this).call(this), {
                'id': 'bleutrade',
                'name': 'Bleutrade',
                'countries': 'BR', // Brazil
                'rateLimit': 1000,
                'version': 'v2',
                'hasCORS': true,
                'hasFetchTickers': true,
                'hasFetchOHLCV': false,
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/30303000-b602dbe6-976d-11e7-956d-36c5049c01e7.jpg',
                    'api': {
                        'public': 'https://bleutrade.com/api',
                        'account': 'https://bleutrade.com/api',
                        'market': 'https://bleutrade.com/api'
                    },
                    'www': 'https://bleutrade.com',
                    'doc': 'https://bleutrade.com/help/API'
                }
            });
        }
    }, {
        key: 'fetchMarkets',
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
                var markets, result, p, market, id, base, quote, symbol, precision, active;
                return _regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.publicGetMarkets();

                            case 2:
                                markets = _context.sent;
                                result = [];

                                for (p = 0; p < markets['result'].length; p++) {
                                    market = markets['result'][p];
                                    id = market['MarketName'];
                                    base = market['MarketCurrency'];
                                    quote = market['BaseCurrency'];

                                    base = this.commonCurrencyCode(base);
                                    quote = this.commonCurrencyCode(quote);
                                    symbol = base + '/' + quote;
                                    precision = {
                                        'amount': 8,
                                        'price': 8
                                    };
                                    active = market['IsActive'];

                                    result.push(this.extend(this.fees['trading'], {
                                        'id': id,
                                        'symbol': symbol,
                                        'base': base,
                                        'quote': quote,
                                        'active': active,
                                        'info': market,
                                        'lot': Math.pow(10, -precision['amount']),
                                        'precision': precision,
                                        'limits': {
                                            'amount': {
                                                'min': market['MinTradeSize'],
                                                'max': undefined
                                            },
                                            'price': {
                                                'min': undefined,
                                                'max': undefined
                                            },
                                            'cost': {
                                                'min': 0,
                                                'max': undefined
                                            }
                                        }
                                    }));
                                }
                                return _context.abrupt('return', result);

                            case 6:
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
    }, {
        key: 'fetchOrderBook',
        value: function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var response, orderbook;
                return _regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context2.next = 4;
                                return this.publicGetOrderbook(this.extend({
                                    'market': this.marketId(symbol),
                                    'type': 'ALL',
                                    'depth': 50
                                }, params));

                            case 4:
                                response = _context2.sent;
                                orderbook = response['result'];
                                return _context2.abrupt('return', this.parseOrderBook(orderbook, undefined, 'buy', 'sell', 'Rate', 'Quantity'));

                            case 7:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function fetchOrderBook(_x2) {
                return _ref2.apply(this, arguments);
            }

            return fetchOrderBook;
        }()
    }]);

    return bleutrade;
}(bittrex);