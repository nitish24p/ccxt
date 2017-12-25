"use strict";

//  ---------------------------------------------------------------------------

import _regeneratorRuntime from 'babel-runtime/regenerator';
import _Object$keys from 'babel-runtime/core-js/object/keys';
import _asyncToGenerator from 'babel-runtime/helpers/asyncToGenerator';
import _Object$getPrototypeOf from 'babel-runtime/core-js/object/get-prototype-of';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _get from 'babel-runtime/helpers/get';
import _inherits from 'babel-runtime/helpers/inherits';
var Exchange = require('./base/Exchange');

var _require = require('./base/errors'),
    ExchangeError = _require.ExchangeError;

//  ---------------------------------------------------------------------------

module.exports = function (_Exchange) {
    _inherits(virwox, _Exchange);

    function virwox() {
        _classCallCheck(this, virwox);

        return _possibleConstructorReturn(this, (virwox.__proto__ || _Object$getPrototypeOf(virwox)).apply(this, arguments));
    }

    _createClass(virwox, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend(_get(virwox.prototype.__proto__ || _Object$getPrototypeOf(virwox.prototype), 'describe', this).call(this), {
                'id': 'virwox',
                'name': 'VirWoX',
                'countries': ['AT', 'EU'],
                'rateLimit': 1000,
                'hasCORS': true,
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/27766894-6da9d360-5eea-11e7-90aa-41f2711b7405.jpg',
                    'api': {
                        'public': 'http://api.virwox.com/api/json.php',
                        'private': 'https://www.virwox.com/api/trading.php'
                    },
                    'www': 'https://www.virwox.com',
                    'doc': 'https://www.virwox.com/developers.php'
                },
                'requiredCredentials': {
                    'apiKey': true,
                    'secret': false,
                    'login': true,
                    'password': true
                },
                'api': {
                    'public': {
                        'get': ['getInstruments', 'getBestPrices', 'getMarketDepth', 'estimateMarketOrder', 'getTradedPriceVolume', 'getRawTradeData', 'getStatistics', 'getTerminalList', 'getGridList', 'getGridStatistics'],
                        'post': ['getInstruments', 'getBestPrices', 'getMarketDepth', 'estimateMarketOrder', 'getTradedPriceVolume', 'getRawTradeData', 'getStatistics', 'getTerminalList', 'getGridList', 'getGridStatistics']
                    },
                    'private': {
                        'get': ['cancelOrder', 'getBalances', 'getCommissionDiscount', 'getOrders', 'getTransactions', 'placeOrder'],
                        'post': ['cancelOrder', 'getBalances', 'getCommissionDiscount', 'getOrders', 'getTransactions', 'placeOrder']
                    }
                }
            });
        }
    }, {
        key: 'fetchMarkets',
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
                var markets, keys, result, p, market, id, symbol, base, quote;
                return _regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.publicGetInstruments();

                            case 2:
                                markets = _context.sent;
                                keys = _Object$keys(markets['result']);
                                result = [];

                                for (p = 0; p < keys.length; p++) {
                                    market = markets['result'][keys[p]];
                                    id = market['instrumentID'];
                                    symbol = market['symbol'];
                                    base = market['longCurrency'];
                                    quote = market['shortCurrency'];

                                    result.push({
                                        'id': id,
                                        'symbol': symbol,
                                        'base': base,
                                        'quote': quote,
                                        'info': market
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
    }, {
        key: 'fetchBalance',
        value: function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2() {
                var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var response, balances, result, b, balance, currency, total, account;
                return _regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context2.next = 4;
                                return this.privatePostGetBalances();

                            case 4:
                                response = _context2.sent;
                                balances = response['result']['accountList'];
                                result = { 'info': balances };

                                for (b = 0; b < balances.length; b++) {
                                    balance = balances[b];
                                    currency = balance['currency'];
                                    total = balance['balance'];
                                    account = {
                                        'free': total,
                                        'used': 0.0,
                                        'total': total
                                    };

                                    result[currency] = account;
                                }
                                return _context2.abrupt('return', this.parseBalance(result));

                            case 9:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function fetchBalance() {
                return _ref2.apply(this, arguments);
            }

            return fetchBalance;
        }()
    }, {
        key: 'fetchMarketPrice',
        value: function () {
            var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var response, result;
                return _regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context3.next = 4;
                                return this.publicPostGetBestPrices(this.extend({
                                    'symbols': [symbol]
                                }, params));

                            case 4:
                                response = _context3.sent;
                                result = response['result'];
                                return _context3.abrupt('return', {
                                    'bid': this.safeFloat(result[0], 'bestBuyPrice'),
                                    'ask': this.safeFloat(result[0], 'bestSellPrice')
                                });

                            case 7:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function fetchMarketPrice(_x3) {
                return _ref3.apply(this, arguments);
            }

            return fetchMarketPrice;
        }()
    }, {
        key: 'fetchOrderBook',
        value: function () {
            var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee4(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var response, orderbook;
                return _regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context4.next = 4;
                                return this.publicPostGetMarketDepth(this.extend({
                                    'symbols': [symbol],
                                    'buyDepth': 100,
                                    'sellDepth': 100
                                }, params));

                            case 4:
                                response = _context4.sent;
                                orderbook = response['result'][0];
                                return _context4.abrupt('return', this.parseOrderBook(orderbook, undefined, 'buy', 'sell', 'price', 'volume'));

                            case 7:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function fetchOrderBook(_x5) {
                return _ref4.apply(this, arguments);
            }

            return fetchOrderBook;
        }()
    }, {
        key: 'fetchTicker',
        value: function () {
            var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee5(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var end, start, response, marketPrice, tickers, keys, length, lastKey, ticker, timestamp;
                return _regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.next = 2;
                                return this.loadMarkets();

                            case 2:
                                end = this.milliseconds();
                                start = end - 86400000;
                                _context5.next = 6;
                                return this.publicGetTradedPriceVolume(this.extend({
                                    'instrument': symbol,
                                    'endDate': this.YmdHMS(end),
                                    'startDate': this.YmdHMS(start),
                                    'HLOC': 1
                                }, params));

                            case 6:
                                response = _context5.sent;
                                _context5.next = 9;
                                return this.fetchMarketPrice(symbol, params);

                            case 9:
                                marketPrice = _context5.sent;
                                tickers = response['result']['priceVolumeList'];
                                keys = _Object$keys(tickers);
                                length = keys.length;
                                lastKey = keys[length - 1];
                                ticker = tickers[lastKey];
                                timestamp = this.milliseconds();
                                return _context5.abrupt('return', {
                                    'symbol': symbol,
                                    'timestamp': timestamp,
                                    'datetime': this.iso8601(timestamp),
                                    'high': parseFloat(ticker['high']),
                                    'low': parseFloat(ticker['low']),
                                    'bid': marketPrice['bid'],
                                    'ask': marketPrice['ask'],
                                    'vwap': undefined,
                                    'open': parseFloat(ticker['open']),
                                    'close': parseFloat(ticker['close']),
                                    'first': undefined,
                                    'last': undefined,
                                    'change': undefined,
                                    'percentage': undefined,
                                    'average': undefined,
                                    'baseVolume': parseFloat(ticker['longVolume']),
                                    'quoteVolume': parseFloat(ticker['shortVolume']),
                                    'info': ticker
                                });

                            case 17:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function fetchTicker(_x7) {
                return _ref5.apply(this, arguments);
            }

            return fetchTicker;
        }()
    }, {
        key: 'fetchTrades',
        value: function () {
            var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee6(symbol) {
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var market;
                return _regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                _context6.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                _context6.next = 5;
                                return this.publicGetRawTradeData(this.extend({
                                    'instrument': market['id'],
                                    'timespan': 3600
                                }, params));

                            case 5:
                                return _context6.abrupt('return', _context6.sent);

                            case 6:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function fetchTrades(_x11) {
                return _ref6.apply(this, arguments);
            }

            return fetchTrades;
        }()
    }, {
        key: 'createOrder',
        value: function () {
            var _ref7 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee7(market, type, side, amount) {
                var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
                var order, response;
                return _regeneratorRuntime.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                _context7.next = 2;
                                return this.loadMarkets();

                            case 2:
                                order = {
                                    'instrument': this.symbol(market),
                                    'orderType': side.toUpperCase(),
                                    'amount': amount
                                };

                                if (type == 'limit') order['price'] = price;
                                _context7.next = 6;
                                return this.privatePostPlaceOrder(this.extend(order, params));

                            case 6:
                                response = _context7.sent;
                                return _context7.abrupt('return', {
                                    'info': response,
                                    'id': response['orderID'].toString()
                                });

                            case 8:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function createOrder(_x14, _x15, _x16, _x17) {
                return _ref7.apply(this, arguments);
            }

            return createOrder;
        }()
    }, {
        key: 'cancelOrder',
        value: function () {
            var _ref8 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee8(id) {
                var symbol = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
                return _regeneratorRuntime.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                _context8.next = 2;
                                return this.privatePostCancelOrder(this.extend({
                                    'orderID': id
                                }, params));

                            case 2:
                                return _context8.abrupt('return', _context8.sent);

                            case 3:
                            case 'end':
                                return _context8.stop();
                        }
                    }
                }, _callee8, this);
            }));

            function cancelOrder(_x20) {
                return _ref8.apply(this, arguments);
            }

            return cancelOrder;
        }()
    }, {
        key: 'sign',
        value: function sign(path) {
            var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var url = this.urls['api'][api];
            var auth = {};
            if (api == 'private') {
                this.checkRequiredCredentials();
                auth['key'] = this.apiKey;
                auth['user'] = this.login;
                auth['pass'] = this.password;
            }
            var nonce = this.nonce();
            if (method == 'GET') {
                url += '?' + this.urlencode(this.extend({
                    'method': path,
                    'id': nonce
                }, auth, params));
            } else {
                headers = { 'Content-Type': 'application/json' };
                body = this.json({
                    'method': path,
                    'params': this.extend(auth, params),
                    'id': nonce
                });
            }
            return { 'url': url, 'method': method, 'body': body, 'headers': headers };
        }
    }, {
        key: 'request',
        value: function () {
            var _ref9 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee9(path) {
                var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
                var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;
                var response;
                return _regeneratorRuntime.wrap(function _callee9$(_context9) {
                    while (1) {
                        switch (_context9.prev = _context9.next) {
                            case 0:
                                _context9.next = 2;
                                return this.fetch2(path, api, method, params, headers, body);

                            case 2:
                                response = _context9.sent;

                                if (!('error' in response)) {
                                    _context9.next = 6;
                                    break;
                                }

                                if (!response['error']) {
                                    _context9.next = 6;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' ' + this.json(response));

                            case 6:
                                return _context9.abrupt('return', response);

                            case 7:
                            case 'end':
                                return _context9.stop();
                        }
                    }
                }, _callee9, this);
            }));

            function request(_x31) {
                return _ref9.apply(this, arguments);
            }

            return request;
        }()
    }]);

    return virwox;
}(Exchange);