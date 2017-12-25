"use strict";

//  ---------------------------------------------------------------------------

import _Object$keys from 'babel-runtime/core-js/object/keys';
import _regeneratorRuntime from 'babel-runtime/regenerator';
import _asyncToGenerator from 'babel-runtime/helpers/asyncToGenerator';
import _Object$getPrototypeOf from 'babel-runtime/core-js/object/get-prototype-of';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _get from 'babel-runtime/helpers/get';
import _inherits from 'babel-runtime/helpers/inherits';
var Exchange = require('./base/Exchange');

var _require = require('./base/errors'),
    ExchangeError = _require.ExchangeError,
    NotSupported = _require.NotSupported,
    AuthenticationError = _require.AuthenticationError;

//  ---------------------------------------------------------------------------

module.exports = function (_Exchange) {
    _inherits(bitstamp1, _Exchange);

    function bitstamp1() {
        _classCallCheck(this, bitstamp1);

        return _possibleConstructorReturn(this, (bitstamp1.__proto__ || _Object$getPrototypeOf(bitstamp1)).apply(this, arguments));
    }

    _createClass(bitstamp1, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend(_get(bitstamp1.prototype.__proto__ || _Object$getPrototypeOf(bitstamp1.prototype), 'describe', this).call(this), {
                'id': 'bitstamp1',
                'name': 'Bitstamp v1',
                'countries': 'GB',
                'rateLimit': 1000,
                'version': 'v1',
                'hasCORS': true,
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/27786377-8c8ab57e-5fe9-11e7-8ea4-2b05b6bcceec.jpg',
                    'api': 'https://www.bitstamp.net/api',
                    'www': 'https://www.bitstamp.net',
                    'doc': 'https://www.bitstamp.net/api'
                },
                'requiredCredentials': {
                    'apiKey': true,
                    'secret': true,
                    'uid': true
                },
                'api': {
                    'public': {
                        'get': ['ticker', 'ticker_hour', 'order_book', 'transactions', 'eur_usd']
                    },
                    'private': {
                        'post': ['balance', 'user_transactions', 'open_orders', 'order_status', 'cancel_order', 'cancel_all_orders', 'buy', 'sell', 'bitcoin_deposit_address', 'unconfirmed_btc', 'ripple_withdrawal', 'ripple_address', 'withdrawal_requests', 'bitcoin_withdrawal']
                    }
                },
                'markets': {
                    'BTC/USD': { 'id': 'btcusd', 'symbol': 'BTC/USD', 'base': 'BTC', 'quote': 'USD', 'maker': 0.0025, 'taker': 0.0025 },
                    'BTC/EUR': { 'id': 'btceur', 'symbol': 'BTC/EUR', 'base': 'BTC', 'quote': 'EUR', 'maker': 0.0025, 'taker': 0.0025 },
                    'EUR/USD': { 'id': 'eurusd', 'symbol': 'EUR/USD', 'base': 'EUR', 'quote': 'USD', 'maker': 0.0025, 'taker': 0.0025 },
                    'XRP/USD': { 'id': 'xrpusd', 'symbol': 'XRP/USD', 'base': 'XRP', 'quote': 'USD', 'maker': 0.0025, 'taker': 0.0025 },
                    'XRP/EUR': { 'id': 'xrpeur', 'symbol': 'XRP/EUR', 'base': 'XRP', 'quote': 'EUR', 'maker': 0.0025, 'taker': 0.0025 },
                    'XRP/BTC': { 'id': 'xrpbtc', 'symbol': 'XRP/BTC', 'base': 'XRP', 'quote': 'BTC', 'maker': 0.0025, 'taker': 0.0025 },
                    'LTC/USD': { 'id': 'ltcusd', 'symbol': 'LTC/USD', 'base': 'LTC', 'quote': 'USD', 'maker': 0.0025, 'taker': 0.0025 },
                    'LTC/EUR': { 'id': 'ltceur', 'symbol': 'LTC/EUR', 'base': 'LTC', 'quote': 'EUR', 'maker': 0.0025, 'taker': 0.0025 },
                    'LTC/BTC': { 'id': 'ltcbtc', 'symbol': 'LTC/BTC', 'base': 'LTC', 'quote': 'BTC', 'maker': 0.0025, 'taker': 0.0025 },
                    'ETH/USD': { 'id': 'ethusd', 'symbol': 'ETH/USD', 'base': 'ETH', 'quote': 'USD', 'maker': 0.0025, 'taker': 0.0025 },
                    'ETH/EUR': { 'id': 'etheur', 'symbol': 'ETH/EUR', 'base': 'ETH', 'quote': 'EUR', 'maker': 0.0025, 'taker': 0.0025 },
                    'ETH/BTC': { 'id': 'ethbtc', 'symbol': 'ETH/BTC', 'base': 'ETH', 'quote': 'BTC', 'maker': 0.0025, 'taker': 0.0025 }
                }
            });
        }
    }, {
        key: 'fetchOrderBook',
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var orderbook, timestamp;
                return _regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                if (!(symbol != 'BTC/USD')) {
                                    _context.next = 2;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' ' + this.version + " fetchOrderBook doesn't support " + symbol + ', use it for BTC/USD only');

                            case 2:
                                _context.next = 4;
                                return this.publicGetOrderBook(params);

                            case 4:
                                orderbook = _context.sent;
                                timestamp = parseInt(orderbook['timestamp']) * 1000;
                                return _context.abrupt('return', this.parseOrderBook(orderbook, timestamp));

                            case 7:
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
        key: 'fetchTicker',
        value: function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var ticker, timestamp, vwap, baseVolume, quoteVolume;
                return _regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                if (!(symbol != 'BTC/USD')) {
                                    _context2.next = 2;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' ' + this.version + " fetchTicker doesn't support " + symbol + ', use it for BTC/USD only');

                            case 2:
                                _context2.next = 4;
                                return this.publicGetTicker(params);

                            case 4:
                                ticker = _context2.sent;
                                timestamp = parseInt(ticker['timestamp']) * 1000;
                                vwap = parseFloat(ticker['vwap']);
                                baseVolume = parseFloat(ticker['volume']);
                                quoteVolume = baseVolume * vwap;
                                return _context2.abrupt('return', {
                                    'symbol': symbol,
                                    'timestamp': timestamp,
                                    'datetime': this.iso8601(timestamp),
                                    'high': parseFloat(ticker['high']),
                                    'low': parseFloat(ticker['low']),
                                    'bid': parseFloat(ticker['bid']),
                                    'ask': parseFloat(ticker['ask']),
                                    'vwap': vwap,
                                    'open': parseFloat(ticker['open']),
                                    'close': undefined,
                                    'first': undefined,
                                    'last': parseFloat(ticker['last']),
                                    'change': undefined,
                                    'percentage': undefined,
                                    'average': undefined,
                                    'baseVolume': baseVolume,
                                    'quoteVolume': quoteVolume,
                                    'info': ticker
                                });

                            case 10:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function fetchTicker(_x4) {
                return _ref2.apply(this, arguments);
            }

            return fetchTicker;
        }()
    }, {
        key: 'parseTrade',
        value: function parseTrade(trade) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var timestamp = undefined;
            if ('date' in trade) {
                timestamp = parseInt(trade['date']) * 1000;
            } else if ('datetime' in trade) {
                // timestamp = this.parse8601 (trade['datetime']);
                timestamp = parseInt(trade['datetime']) * 1000;
            }
            var side = trade['type'] == 0 ? 'buy' : 'sell';
            var order = undefined;
            if ('order_id' in trade) order = trade['order_id'].toString();
            if ('currency_pair' in trade) {
                if (trade['currency_pair'] in this.markets_by_id) market = this.markets_by_id[trade['currency_pair']];
            }
            return {
                'id': trade['tid'].toString(),
                'info': trade,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'symbol': market['symbol'],
                'order': order,
                'type': undefined,
                'side': side,
                'price': parseFloat(trade['price']),
                'amount': parseFloat(trade['amount'])
            };
        }
    }, {
        key: 'fetchTrades',
        value: function () {
            var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3(symbol) {
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var market, response;
                return _regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                if (!(symbol != 'BTC/USD')) {
                                    _context3.next = 2;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' ' + this.version + " fetchTrades doesn't support " + symbol + ', use it for BTC/USD only');

                            case 2:
                                market = this.market(symbol);
                                _context3.next = 5;
                                return this.publicGetTransactions(this.extend({
                                    'time': 'minute'
                                }, params));

                            case 5:
                                response = _context3.sent;
                                return _context3.abrupt('return', this.parseTrades(response, market, since, limit));

                            case 7:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function fetchTrades(_x9) {
                return _ref3.apply(this, arguments);
            }

            return fetchTrades;
        }()
    }, {
        key: 'fetchBalance',
        value: function () {
            var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee4() {
                var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var balance, result, currencies, i, currency, lowercase, total, free, used, account;
                return _regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                return this.privatePostBalance();

                            case 2:
                                balance = _context4.sent;
                                result = { 'info': balance };
                                currencies = _Object$keys(this.currencies);

                                for (i = 0; i < currencies.length; i++) {
                                    currency = currencies[i];
                                    lowercase = currency.toLowerCase();
                                    total = lowercase + '_balance';
                                    free = lowercase + '_available';
                                    used = lowercase + '_reserved';
                                    account = this.account();

                                    account['free'] = this.safeFloat(balance, free, 0.0);
                                    account['used'] = this.safeFloat(balance, used, 0.0);
                                    account['total'] = this.safeFloat(balance, total, 0.0);
                                    result[currency] = account;
                                }
                                return _context4.abrupt('return', this.parseBalance(result));

                            case 7:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function fetchBalance() {
                return _ref4.apply(this, arguments);
            }

            return fetchBalance;
        }()
    }, {
        key: 'createOrder',
        value: function () {
            var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee5(symbol, type, side, amount) {
                var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
                var method, order, response;
                return _regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                if (!(type != 'limit')) {
                                    _context5.next = 2;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' ' + this.version + ' accepts limit orders only');

                            case 2:
                                if (!(symbol != 'BTC/USD')) {
                                    _context5.next = 4;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' v1 supports BTC/USD orders only');

                            case 4:
                                method = 'privatePost' + this.capitalize(side);
                                order = {
                                    'amount': amount,
                                    'price': price
                                };
                                _context5.next = 8;
                                return this[method](this.extend(order, params));

                            case 8:
                                response = _context5.sent;
                                return _context5.abrupt('return', {
                                    'info': response,
                                    'id': response['id']
                                });

                            case 10:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function createOrder(_x13, _x14, _x15, _x16) {
                return _ref5.apply(this, arguments);
            }

            return createOrder;
        }()
    }, {
        key: 'cancelOrder',
        value: function () {
            var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee6(id) {
                var symbol = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
                return _regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                _context6.next = 2;
                                return this.privatePostCancelOrder({ 'id': id });

                            case 2:
                                return _context6.abrupt('return', _context6.sent);

                            case 3:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function cancelOrder(_x19) {
                return _ref6.apply(this, arguments);
            }

            return cancelOrder;
        }()
    }, {
        key: 'parseOrderStatus',
        value: function parseOrderStatus(order) {
            if (order['status'] == 'Queue' || order['status'] == 'Open') return 'open';
            if (order['status'] == 'Finished') return 'closed';
            return order['status'];
        }
    }, {
        key: 'fetchOrderStatus',
        value: function () {
            var _ref7 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee7(id) {
                var symbol = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var response;
                return _regeneratorRuntime.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                _context7.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context7.next = 4;
                                return this.privatePostOrderStatus({ 'id': id });

                            case 4:
                                response = _context7.sent;
                                return _context7.abrupt('return', this.parseOrderStatus(response));

                            case 6:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function fetchOrderStatus(_x21) {
                return _ref7.apply(this, arguments);
            }

            return fetchOrderStatus;
        }()
    }, {
        key: 'fetchMyTrades',
        value: function () {
            var _ref8 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee8() {
                var symbol = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var market, pair, request, response;
                return _regeneratorRuntime.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                _context8.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = undefined;

                                if (symbol) market = this.market(symbol);
                                pair = market ? market['id'] : 'all';
                                request = this.extend({ 'id': pair }, params);
                                _context8.next = 8;
                                return this.privatePostOpenOrdersId(request);

                            case 8:
                                response = _context8.sent;
                                return _context8.abrupt('return', this.parseTrades(response, market, since, limit));

                            case 10:
                            case 'end':
                                return _context8.stop();
                        }
                    }
                }, _callee8, this);
            }));

            function fetchMyTrades() {
                return _ref8.apply(this, arguments);
            }

            return fetchMyTrades;
        }()
    }, {
        key: 'fetchOrder',
        value: function () {
            var _ref9 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee9(id) {
                var symbol = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
                return _regeneratorRuntime.wrap(function _callee9$(_context9) {
                    while (1) {
                        switch (_context9.prev = _context9.next) {
                            case 0:
                                throw new NotSupported(this.id + ' fetchOrder is not implemented yet');

                            case 3:
                            case 'end':
                                return _context9.stop();
                        }
                    }
                }, _callee9, this);
            }));

            function fetchOrder(_x28) {
                return _ref9.apply(this, arguments);
            }

            return fetchOrder;
        }()
    }, {
        key: 'sign',
        value: function sign(path) {
            var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var url = this.urls['api'] + '/' + this.implodeParams(path, params);
            var query = this.omit(params, this.extractParams(path));
            if (api == 'public') {
                if (_Object$keys(query).length) url += '?' + this.urlencode(query);
            } else {
                this.checkRequiredCredentials();
                var nonce = this.nonce().toString();
                var auth = nonce + this.uid + this.apiKey;
                var signature = this.encode(this.hmac(this.encode(auth), this.encode(this.secret)));
                query = this.extend({
                    'key': this.apiKey,
                    'signature': signature.toUpperCase(),
                    'nonce': nonce
                }, query);
                body = this.urlencode(query);
                headers = {
                    'Content-Type': 'application/x-www-form-urlencoded'
                };
            }
            return { 'url': url, 'method': method, 'body': body, 'headers': headers };
        }
    }, {
        key: 'request',
        value: function () {
            var _ref10 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee10(path) {
                var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
                var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;
                var response;
                return _regeneratorRuntime.wrap(function _callee10$(_context10) {
                    while (1) {
                        switch (_context10.prev = _context10.next) {
                            case 0:
                                _context10.next = 2;
                                return this.fetch2(path, api, method, params, headers, body);

                            case 2:
                                response = _context10.sent;

                                if (!('status' in response)) {
                                    _context10.next = 6;
                                    break;
                                }

                                if (!(response['status'] == 'error')) {
                                    _context10.next = 6;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' ' + this.json(response));

                            case 6:
                                return _context10.abrupt('return', response);

                            case 7:
                            case 'end':
                                return _context10.stop();
                        }
                    }
                }, _callee10, this);
            }));

            function request(_x39) {
                return _ref10.apply(this, arguments);
            }

            return request;
        }()
    }]);

    return bitstamp1;
}(Exchange);