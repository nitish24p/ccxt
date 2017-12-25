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
var acx = require('./acx.js');

var _require = require('./base/errors'),
    ExchangeError = _require.ExchangeError,
    InsufficientFunds = _require.InsufficientFunds,
    OrderNotFound = _require.OrderNotFound;

// ---------------------------------------------------------------------------

module.exports = function (_acx) {
    _inherits(kuna, _acx);

    function kuna() {
        _classCallCheck(this, kuna);

        return _possibleConstructorReturn(this, (kuna.__proto__ || _Object$getPrototypeOf(kuna)).apply(this, arguments));
    }

    _createClass(kuna, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend(_get(kuna.prototype.__proto__ || _Object$getPrototypeOf(kuna.prototype), 'describe', this).call(this), {
                'id': 'kuna',
                'name': 'Kuna',
                'countries': 'UA',
                'rateLimit': 1000,
                'version': 'v2',
                'hasCORS': false,
                'hasFetchTickers': false,
                'hasFetchOHLCV': false,
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/31697638-912824fa-b3c1-11e7-8c36-cf9606eb94ac.jpg',
                    'api': 'https://kuna.io',
                    'www': 'https://kuna.io',
                    'doc': 'https://kuna.io/documents/api'
                },
                'api': {
                    'public': {
                        'get': ['tickers/{market}', 'order_book', 'order_book/{market}', 'trades', 'trades/{market}', 'timestamp']
                    },
                    'private': {
                        'get': ['members/me', 'orders', 'trades/my'],
                        'post': ['orders', 'order/delete']
                    }
                },
                'markets': {
                    'BTC/UAH': { 'id': 'btcuah', 'symbol': 'BTC/UAH', 'base': 'BTC', 'quote': 'UAH', 'precision': { 'amount': 6, 'price': 0 }, 'lot': 0.000001, 'limits': { 'amount': { 'min': 0.000001, 'max': undefined }, 'price': { 'min': 1, 'max': undefined } } },
                    'ETH/UAH': { 'id': 'ethuah', 'symbol': 'ETH/UAH', 'base': 'ETH', 'quote': 'UAH', 'precision': { 'amount': 6, 'price': 0 }, 'lot': 0.000001, 'limits': { 'amount': { 'min': 0.000001, 'max': undefined }, 'price': { 'min': 1, 'max': undefined } } },
                    'GBG/UAH': { 'id': 'gbguah', 'symbol': 'GBG/UAH', 'base': 'GBG', 'quote': 'UAH', 'precision': { 'amount': 3, 'price': 2 }, 'lot': 0.001, 'limits': { 'amount': { 'min': 0.000001, 'max': undefined }, 'price': { 'min': 0.01, 'max': undefined } } }, // Golos Gold (GBG != GOLOS)
                    'KUN/BTC': { 'id': 'kunbtc', 'symbol': 'KUN/BTC', 'base': 'KUN', 'quote': 'BTC', 'precision': { 'amount': 6, 'price': 6 }, 'lot': 0.000001, 'limits': { 'amount': { 'min': 0.000001, 'max': undefined }, 'price': { 'min': 0.000001, 'max': undefined } } },
                    'BCH/BTC': { 'id': 'bchbtc', 'symbol': 'BCH/BTC', 'base': 'BCH', 'quote': 'BTC', 'precision': { 'amount': 6, 'price': 6 }, 'lot': 0.000001, 'limits': { 'amount': { 'min': 0.000001, 'max': undefined }, 'price': { 'min': 0.000001, 'max': undefined } } },
                    'WAVES/UAH': { 'id': 'wavesuah', 'symbol': 'WAVES/UAH', 'base': 'WAVES', 'quote': 'UAH', 'precision': { 'amount': 6, 'price': 0 }, 'lot': 0.000001, 'limits': { 'amount': { 'min': 0.000001, 'max': undefined }, 'price': { 'min': 1, 'max': undefined } } }
                },
                'fees': {
                    'trading': {
                        'taker': 0.25 / 100,
                        'maker': 0.25 / 100
                    }
                }
            });
        }
    }, {
        key: 'handleErrors',
        value: function handleErrors(code, reason, url, method, headers, body) {
            if (code == 400) {
                var data = JSON.parse(body);
                var error = data['error'];
                var errorCode = error['code'];
                if (errorCode == 2002) {
                    throw new InsufficientFunds([this.id, method, url, code, reason, body].join(' '));
                } else if (errorCode == 2003) {
                    throw new OrderNotFound([this.id, method, url, code, reason, body].join(' '));
                }
            }
        }
    }, {
        key: 'fetchOrderBook',
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var market, orderBook;
                return _regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                market = this.market(symbol);
                                _context.next = 3;
                                return this.publicGetOrderBook(this.extend({
                                    'market': market['id']
                                }, params));

                            case 3:
                                orderBook = _context.sent;
                                return _context.abrupt('return', this.parseOrderBook(orderBook, undefined, 'bids', 'asks', 'price', 'remaining_volume'));

                            case 5:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function fetchOrderBook(_x2) {
                return _ref.apply(this, arguments);
            }

            return fetchOrderBook;
        }()
    }, {
        key: 'fetchL3OrderBook',
        value: function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(symbol, params) {
                return _regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                return _context2.abrupt('return', this.fetchOrderBook(symbol, params));

                            case 1:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function fetchL3OrderBook(_x3, _x4) {
                return _ref2.apply(this, arguments);
            }

            return fetchL3OrderBook;
        }()
    }, {
        key: 'fetchOpenOrders',
        value: function () {
            var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3() {
                var symbol = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var market, orders;
                return _regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                if (symbol) {
                                    _context3.next = 2;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' fetchOpenOrders requires a symbol argument');

                            case 2:
                                market = this.market(symbol);
                                _context3.next = 5;
                                return this.privateGetOrders(this.extend({
                                    'market': market['id']
                                }, params));

                            case 5:
                                orders = _context3.sent;
                                return _context3.abrupt('return', this.parseOrders(orders, market, since, limit));

                            case 7:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function fetchOpenOrders() {
                return _ref3.apply(this, arguments);
            }

            return fetchOpenOrders;
        }()
    }, {
        key: 'parseTrade',
        value: function parseTrade(trade) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var timestamp = this.parse8601(trade['created_at']);
            var symbol = undefined;
            if (market) symbol = market['symbol'];
            return {
                'id': trade['id'],
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'symbol': symbol,
                'type': undefined,
                'side': undefined,
                'price': parseFloat(trade['price']),
                'amount': parseFloat(trade['volume']),
                'info': trade
            };
        }
    }, {
        key: 'fetchTrades',
        value: function () {
            var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee4(symbol) {
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var market, response;
                return _regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                market = this.market(symbol);
                                _context4.next = 3;
                                return this.publicGetTrades(this.extend({
                                    'market': market['id']
                                }, params));

                            case 3:
                                response = _context4.sent;
                                return _context4.abrupt('return', this.parseTrades(response, market, since, limit));

                            case 5:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function fetchTrades(_x13) {
                return _ref4.apply(this, arguments);
            }

            return fetchTrades;
        }()
    }, {
        key: 'parseMyTrade',
        value: function parseMyTrade(trade, market) {
            var timestamp = this.parse8601(trade['created_at']);
            var symbol = undefined;
            if (market) symbol = market['symbol'];
            return {
                'id': trade['id'],
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'price': trade['price'],
                'amount': trade['volume'],
                'cost': trade['funds'],
                'symbol': symbol,
                'side': trade['side'],
                'order': trade['order_id']
            };
        }
    }, {
        key: 'parseMyTrades',
        value: function parseMyTrades(trades) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var parsedTrades = [];
            for (var i = 0; i < trades.length; i++) {
                var trade = trades[i];
                var parsedTrade = this.parseMyTrade(trade, market);
                parsedTrades.push(parsedTrade);
            }
            return parsedTrades;
        }
    }, {
        key: 'fetchMyTrades',
        value: function () {
            var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee5() {
                var symbol = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var market, response;
                return _regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                if (symbol) {
                                    _context5.next = 2;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' fetchOpenOrders requires a symbol argument');

                            case 2:
                                market = this.market(symbol);
                                _context5.next = 5;
                                return this.privateGetTradesMy({ 'market': market['id'] });

                            case 5:
                                response = _context5.sent;
                                return _context5.abrupt('return', this.parseMyTrades(response, market));

                            case 7:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function fetchMyTrades() {
                return _ref5.apply(this, arguments);
            }

            return fetchMyTrades;
        }()
    }]);

    return kuna;
}(acx);