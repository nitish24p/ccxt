"use strict";

// ----------------------------------------------------------------------------

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Exchange = require('./base/Exchange');

var _require = require('./base/errors'),
    ExchangeError = _require.ExchangeError,
    InvalidOrder = _require.InvalidOrder,
    AuthenticationError = _require.AuthenticationError,
    NotSupported = _require.NotSupported;

// ----------------------------------------------------------------------------

module.exports = function (_Exchange) {
    _inherits(gdax, _Exchange);

    function gdax() {
        _classCallCheck(this, gdax);

        return _possibleConstructorReturn(this, (gdax.__proto__ || Object.getPrototypeOf(gdax)).apply(this, arguments));
    }

    _createClass(gdax, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend(_get(gdax.prototype.__proto__ || Object.getPrototypeOf(gdax.prototype), 'describe', this).call(this), {
                'id': 'gdax',
                'name': 'GDAX',
                'countries': 'US',
                'rateLimit': 1000,
                'userAgent': this.userAgents['chrome'],
                'hasCORS': true,
                'hasFetchOHLCV': true,
                'hasDeposit': true,
                'hasWithdraw': true,
                'hasFetchOrder': true,
                'hasFetchOrders': true,
                'hasFetchOpenOrders': true,
                'hasFetchClosedOrders': true,
                'timeframes': {
                    '1m': 60,
                    '5m': 300,
                    '15m': 900,
                    '30m': 1800,
                    '1h': 3600,
                    '2h': 7200,
                    '4h': 14400,
                    '12h': 43200,
                    '1d': 86400,
                    '1w': 604800,
                    '1M': 2592000,
                    '1y': 31536000
                },
                'urls': {
                    'test': 'https://api-public.sandbox.gdax.com',
                    'logo': 'https://user-images.githubusercontent.com/1294454/27766527-b1be41c6-5edb-11e7-95f6-5b496c469e2c.jpg',
                    'api': 'https://api.gdax.com',
                    'www': 'https://www.gdax.com',
                    'doc': 'https://docs.gdax.com'
                },
                'requiredCredentials': {
                    'apiKey': true,
                    'secret': true,
                    'password': true
                },
                'api': {
                    'public': {
                        'get': ['currencies', 'products', 'products/{id}/book', 'products/{id}/candles', 'products/{id}/stats', 'products/{id}/ticker', 'products/{id}/trades', 'time']
                    },
                    'private': {
                        'get': ['accounts', 'accounts/{id}', 'accounts/{id}/holds', 'accounts/{id}/ledger', 'coinbase-accounts', 'fills', 'funding', 'orders', 'orders/{id}', 'payment-methods', 'position', 'reports/{id}', 'users/self/trailing-volume'],
                        'post': ['deposits/coinbase-account', 'deposits/payment-method', 'funding/repay', 'orders', 'position/close', 'profiles/margin-transfer', 'reports', 'withdrawals/coinbase', 'withdrawals/crypto', 'withdrawals/payment-method'],
                        'delete': ['orders', 'orders/{id}']
                    }
                },
                'fees': {
                    'trading': {
                        'tierBased': true, // complicated tier system per coin
                        'percentage': true,
                        'maker': 0.0,
                        'taker': 0.30 / 100 // worst-case scenario: https://www.gdax.com/fees/BTC-USD
                    },
                    'funding': {
                        'tierBased': false,
                        'percentage': false,
                        'withdraw': {
                            'BCH': 0,
                            'BTC': 0,
                            'LTC': 0,
                            'ETH': 0,
                            'EUR': 0.15,
                            'USD': 25
                        },
                        'deposit': {
                            'BCH': 0,
                            'BTC': 0,
                            'LTC': 0,
                            'ETH': 0,
                            'EUR': 0.15,
                            'USD': 10
                        }
                    }
                }
            });
        }
    }, {
        key: 'fetchMarkets',
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                var markets, result, p, market, id, base, quote, symbol, amountLimits, priceLimits, costLimits, limits, precision, taker;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.publicGetProducts();

                            case 2:
                                markets = _context.sent;
                                result = [];

                                for (p = 0; p < markets.length; p++) {
                                    market = markets[p];
                                    id = market['id'];
                                    base = market['base_currency'];
                                    quote = market['quote_currency'];
                                    symbol = base + '/' + quote;
                                    amountLimits = {
                                        'min': market['base_min_size'],
                                        'max': market['base_max_size']
                                    };
                                    priceLimits = {
                                        'min': market['quote_increment'],
                                        'max': undefined
                                    };
                                    costLimits = {
                                        'min': priceLimits['min'],
                                        'max': undefined
                                    };
                                    limits = {
                                        'amount': amountLimits,
                                        'price': priceLimits,
                                        'cost': costLimits
                                    };
                                    precision = {
                                        'amount': -Math.log10(parseFloat(amountLimits['min'])),
                                        'price': -Math.log10(parseFloat(priceLimits['min']))
                                    };
                                    taker = this.fees['trading']['taker'];

                                    if (base == 'ETH' || base == 'LTC') {
                                        taker = 0.003;
                                    }
                                    result.push(this.extend(this.fees['trading'], {
                                        'id': id,
                                        'symbol': symbol,
                                        'base': base,
                                        'quote': quote,
                                        'info': market,
                                        'precision': precision,
                                        'limits': limits,
                                        'taker': taker
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
        key: 'fetchBalance',
        value: function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
                var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var balances, result, b, balance, currency, account;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context2.next = 4;
                                return this.privateGetAccounts();

                            case 4:
                                balances = _context2.sent;
                                result = { 'info': balances };

                                for (b = 0; b < balances.length; b++) {
                                    balance = balances[b];
                                    currency = balance['currency'];
                                    account = {
                                        'free': parseFloat(balance['available']),
                                        'used': parseFloat(balance['hold']),
                                        'total': parseFloat(balance['balance'])
                                    };

                                    result[currency] = account;
                                }
                                return _context2.abrupt('return', this.parseBalance(result));

                            case 8:
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
        key: 'fetchOrderBook',
        value: function () {
            var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var orderbook;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context3.next = 4;
                                return this.publicGetProductsIdBook(this.extend({
                                    'id': this.marketId(symbol),
                                    'level': 2 // 1 best bidask, 2 aggregated, 3 full
                                }, params));

                            case 4:
                                orderbook = _context3.sent;
                                return _context3.abrupt('return', this.parseOrderBook(orderbook));

                            case 6:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function fetchOrderBook(_x3) {
                return _ref3.apply(this, arguments);
            }

            return fetchOrderBook;
        }()
    }, {
        key: 'fetchTicker',
        value: function () {
            var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var market, request, ticker, timestamp, bid, ask;
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                request = this.extend({
                                    'id': market['id']
                                }, params);
                                _context4.next = 6;
                                return this.publicGetProductsIdTicker(request);

                            case 6:
                                ticker = _context4.sent;
                                timestamp = this.parse8601(ticker['time']);
                                bid = undefined;
                                ask = undefined;

                                if ('bid' in ticker) bid = parseFloat(ticker['bid']);
                                if ('ask' in ticker) ask = parseFloat(ticker['ask']);
                                return _context4.abrupt('return', {
                                    'symbol': symbol,
                                    'timestamp': timestamp,
                                    'datetime': this.iso8601(timestamp),
                                    'high': undefined,
                                    'low': undefined,
                                    'bid': bid,
                                    'ask': ask,
                                    'vwap': undefined,
                                    'open': undefined,
                                    'close': undefined,
                                    'first': undefined,
                                    'last': this.safeFloat(ticker, 'price'),
                                    'change': undefined,
                                    'percentage': undefined,
                                    'average': undefined,
                                    'baseVolume': parseFloat(ticker['volume']),
                                    'quoteVolume': undefined,
                                    'info': ticker
                                });

                            case 13:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function fetchTicker(_x5) {
                return _ref4.apply(this, arguments);
            }

            return fetchTicker;
        }()
    }, {
        key: 'parseTrade',
        value: function parseTrade(trade) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var timestamp = this.parse8601(trade['time']);
            var side = trade['side'] == 'buy' ? 'sell' : 'buy';
            var symbol = undefined;
            if (market) symbol = market['symbol'];
            var fee = undefined;
            if ('fill_fees' in trade) {
                fee = {
                    'cost': parseFloat(trade['fill_fees']),
                    'currency': market['quote']
                };
            }
            return {
                'id': trade['trade_id'].toString(),
                'info': trade,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'symbol': symbol,
                'type': undefined,
                'side': side,
                'price': parseFloat(trade['price']),
                'amount': parseFloat(trade['size']),
                'fee': fee
            };
        }
    }, {
        key: 'fetchTrades',
        value: function () {
            var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(symbol) {
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var market, response;
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                _context5.next = 5;
                                return this.publicGetProductsIdTrades(this.extend({
                                    'id': market['id'] // fixes issue #2
                                }, params));

                            case 5:
                                response = _context5.sent;
                                return _context5.abrupt('return', this.parseTrades(response, market, since, limit));

                            case 7:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function fetchTrades(_x10) {
                return _ref5.apply(this, arguments);
            }

            return fetchTrades;
        }()
    }, {
        key: 'parseOHLCV',
        value: function parseOHLCV(ohlcv) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
            var timeframe = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '1m';
            var since = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
            var limit = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;

            return [ohlcv[0] * 1000, ohlcv[3], ohlcv[2], ohlcv[1], ohlcv[4], ohlcv[5]];
        }
    }, {
        key: 'fetchOHLCV',
        value: function () {
            var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(symbol) {
                var timeframe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '1m';
                var since = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var limit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
                var params = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
                var market, granularity, request, response;
                return regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                _context6.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                granularity = this.timeframes[timeframe];
                                request = {
                                    'id': market['id'],
                                    'granularity': granularity
                                };

                                if (since) {
                                    request['start'] = this.iso8601(since);
                                    if (!limit) limit = 200; // max = 200
                                    request['end'] = this.iso8601(limit * granularity * 1000 + since);
                                }
                                _context6.next = 8;
                                return this.publicGetProductsIdCandles(this.extend(request, params));

                            case 8:
                                response = _context6.sent;
                                return _context6.abrupt('return', this.parseOHLCVs(response, market, timeframe, since, limit));

                            case 10:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function fetchOHLCV(_x19) {
                return _ref6.apply(this, arguments);
            }

            return fetchOHLCV;
        }()
    }, {
        key: 'fetchTime',
        value: function () {
            var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
                var response;
                return regeneratorRuntime.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                response = this.publicGetTime();
                                return _context7.abrupt('return', this.parse8601(response['iso']));

                            case 2:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function fetchTime() {
                return _ref7.apply(this, arguments);
            }

            return fetchTime;
        }()
    }, {
        key: 'parseOrderStatus',
        value: function parseOrderStatus(status) {
            var statuses = {
                'pending': 'open',
                'active': 'open',
                'open': 'open',
                'done': 'closed',
                'canceled': 'canceled'
            };
            return this.safeString(statuses, status, status);
        }
    }, {
        key: 'parseOrder',
        value: function parseOrder(order) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var timestamp = this.parse8601(order['created_at']);
            var symbol = undefined;
            if (!market) {
                if (order['product_id'] in this.markets_by_id) market = this.markets_by_id[order['product_id']];
            }
            var status = this.parseOrderStatus(order['status']);
            var price = this.safeFloat(order, 'price');
            var amount = this.safeFloat(order, 'size');
            var filled = this.safeFloat(order, 'filled_size');
            var remaining = amount - filled;
            var cost = this.safeFloat(order, 'executed_value');
            if (market) symbol = market['symbol'];
            return {
                'id': order['id'],
                'info': order,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'status': status,
                'symbol': symbol,
                'type': order['type'],
                'side': order['side'],
                'price': price,
                'cost': cost,
                'amount': amount,
                'filled': filled,
                'remaining': remaining,
                'fee': undefined
            };
        }
    }, {
        key: 'fetchOrder',
        value: function () {
            var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(id) {
                var symbol = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
                var response;
                return regeneratorRuntime.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                _context8.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context8.next = 4;
                                return this.privateGetOrdersId(this.extend({
                                    'id': id
                                }, params));

                            case 4:
                                response = _context8.sent;
                                return _context8.abrupt('return', this.parseOrder(response));

                            case 6:
                            case 'end':
                                return _context8.stop();
                        }
                    }
                }, _callee8, this);
            }));

            function fetchOrder(_x23) {
                return _ref8.apply(this, arguments);
            }

            return fetchOrder;
        }()
    }, {
        key: 'fetchOrders',
        value: function () {
            var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
                var symbol = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var request, market, response;
                return regeneratorRuntime.wrap(function _callee9$(_context9) {
                    while (1) {
                        switch (_context9.prev = _context9.next) {
                            case 0:
                                _context9.next = 2;
                                return this.loadMarkets();

                            case 2:
                                request = {
                                    'status': 'all'
                                };
                                market = undefined;

                                if (symbol) {
                                    market = this.market(symbol);
                                    request['product_id'] = market['id'];
                                }
                                _context9.next = 7;
                                return this.privateGetOrders(this.extend(request, params));

                            case 7:
                                response = _context9.sent;
                                return _context9.abrupt('return', this.parseOrders(response, market, since, limit));

                            case 9:
                            case 'end':
                                return _context9.stop();
                        }
                    }
                }, _callee9, this);
            }));

            function fetchOrders() {
                return _ref9.apply(this, arguments);
            }

            return fetchOrders;
        }()
    }, {
        key: 'fetchOpenOrders',
        value: function () {
            var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
                var symbol = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var request, market, response;
                return regeneratorRuntime.wrap(function _callee10$(_context10) {
                    while (1) {
                        switch (_context10.prev = _context10.next) {
                            case 0:
                                _context10.next = 2;
                                return this.loadMarkets();

                            case 2:
                                request = {};
                                market = undefined;

                                if (symbol) {
                                    market = this.market(symbol);
                                    request['product_id'] = market['id'];
                                }
                                _context10.next = 7;
                                return this.privateGetOrders(this.extend(request, params));

                            case 7:
                                response = _context10.sent;
                                return _context10.abrupt('return', this.parseOrders(response, market, since, limit));

                            case 9:
                            case 'end':
                                return _context10.stop();
                        }
                    }
                }, _callee10, this);
            }));

            function fetchOpenOrders() {
                return _ref10.apply(this, arguments);
            }

            return fetchOpenOrders;
        }()
    }, {
        key: 'fetchClosedOrders',
        value: function () {
            var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11() {
                var symbol = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var request, market, response;
                return regeneratorRuntime.wrap(function _callee11$(_context11) {
                    while (1) {
                        switch (_context11.prev = _context11.next) {
                            case 0:
                                _context11.next = 2;
                                return this.loadMarkets();

                            case 2:
                                request = {
                                    'status': 'done'
                                };
                                market = undefined;

                                if (symbol) {
                                    market = this.market(symbol);
                                    request['product_id'] = market['id'];
                                }
                                _context11.next = 7;
                                return this.privateGetOrders(this.extend(request, params));

                            case 7:
                                response = _context11.sent;
                                return _context11.abrupt('return', this.parseOrders(response, market, since, limit));

                            case 9:
                            case 'end':
                                return _context11.stop();
                        }
                    }
                }, _callee11, this);
            }));

            function fetchClosedOrders() {
                return _ref11.apply(this, arguments);
            }

            return fetchClosedOrders;
        }()
    }, {
        key: 'createOrder',
        value: function () {
            var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(market, type, side, amount) {
                var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
                var order, response;
                return regeneratorRuntime.wrap(function _callee12$(_context12) {
                    while (1) {
                        switch (_context12.prev = _context12.next) {
                            case 0:
                                _context12.next = 2;
                                return this.loadMarkets();

                            case 2:
                                // let oid = this.nonce ().toString ();
                                order = {
                                    'product_id': this.marketId(market),
                                    'side': side,
                                    'size': amount,
                                    'type': type
                                };

                                if (type == 'limit') order['price'] = price;
                                _context12.next = 6;
                                return this.privatePostOrders(this.extend(order, params));

                            case 6:
                                response = _context12.sent;
                                return _context12.abrupt('return', {
                                    'info': response,
                                    'id': response['id']
                                });

                            case 8:
                            case 'end':
                                return _context12.stop();
                        }
                    }
                }, _callee12, this);
            }));

            function createOrder(_x38, _x39, _x40, _x41) {
                return _ref12.apply(this, arguments);
            }

            return createOrder;
        }()
    }, {
        key: 'cancelOrder',
        value: function () {
            var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(id) {
                var symbol = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
                return regeneratorRuntime.wrap(function _callee13$(_context13) {
                    while (1) {
                        switch (_context13.prev = _context13.next) {
                            case 0:
                                _context13.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context13.next = 4;
                                return this.privateDeleteOrdersId({ 'id': id });

                            case 4:
                                return _context13.abrupt('return', _context13.sent);

                            case 5:
                            case 'end':
                                return _context13.stop();
                        }
                    }
                }, _callee13, this);
            }));

            function cancelOrder(_x44) {
                return _ref13.apply(this, arguments);
            }

            return cancelOrder;
        }()
    }, {
        key: 'getPaymentMethods',
        value: function () {
            var _ref14 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14() {
                var response;
                return regeneratorRuntime.wrap(function _callee14$(_context14) {
                    while (1) {
                        switch (_context14.prev = _context14.next) {
                            case 0:
                                _context14.next = 2;
                                return this.privateGetPaymentMethods();

                            case 2:
                                response = _context14.sent;
                                return _context14.abrupt('return', response);

                            case 4:
                            case 'end':
                                return _context14.stop();
                        }
                    }
                }, _callee14, this);
            }));

            function getPaymentMethods() {
                return _ref14.apply(this, arguments);
            }

            return getPaymentMethods;
        }()
    }, {
        key: 'deposit',
        value: function () {
            var _ref15 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15(currency, amount, address) {
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var request, method, response;
                return regeneratorRuntime.wrap(function _callee15$(_context15) {
                    while (1) {
                        switch (_context15.prev = _context15.next) {
                            case 0:
                                _context15.next = 2;
                                return this.loadMarkets();

                            case 2:
                                request = {
                                    'currency': currency,
                                    'amount': amount
                                };
                                method = 'privatePostDeposits';

                                if (!('payment_method_id' in params)) {
                                    _context15.next = 8;
                                    break;
                                }

                                // deposit from a payment_method, like a bank account
                                method += 'PaymentMethod';
                                _context15.next = 13;
                                break;

                            case 8:
                                if (!('coinbase_account_id' in params)) {
                                    _context15.next = 12;
                                    break;
                                }

                                // deposit into GDAX account from a Coinbase account
                                method += 'CoinbaseAccount';
                                _context15.next = 13;
                                break;

                            case 12:
                                throw new NotSupported(this.id + ' deposit() requires one of `coinbase_account_id` or `payment_method_id` extra params');

                            case 13:
                                _context15.next = 15;
                                return this[method](this.extend(request, params));

                            case 15:
                                response = _context15.sent;

                                if (response) {
                                    _context15.next = 18;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' deposit() error: ' + this.json(response));

                            case 18:
                                return _context15.abrupt('return', {
                                    'info': response,
                                    'id': response['id']
                                });

                            case 19:
                            case 'end':
                                return _context15.stop();
                        }
                    }
                }, _callee15, this);
            }));

            function deposit(_x46, _x47, _x48) {
                return _ref15.apply(this, arguments);
            }

            return deposit;
        }()
    }, {
        key: 'withdraw',
        value: function () {
            var _ref16 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee16(currency, amount, address) {
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var request, method, response;
                return regeneratorRuntime.wrap(function _callee16$(_context16) {
                    while (1) {
                        switch (_context16.prev = _context16.next) {
                            case 0:
                                _context16.next = 2;
                                return this.loadMarkets();

                            case 2:
                                request = {
                                    'currency': currency,
                                    'amount': amount
                                };
                                method = 'privatePostWithdrawals';

                                if ('payment_method_id' in params) {
                                    method += 'PaymentMethod';
                                } else if ('coinbase_account_id' in params) {
                                    method += 'CoinbaseAccount';
                                } else {
                                    method += 'Crypto';
                                    request['crypto_address'] = address;
                                }
                                _context16.next = 7;
                                return this[method](this.extend(request, params));

                            case 7:
                                response = _context16.sent;

                                if (response) {
                                    _context16.next = 10;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' withdraw() error: ' + this.json(response));

                            case 10:
                                return _context16.abrupt('return', {
                                    'info': response,
                                    'id': response['id']
                                });

                            case 11:
                            case 'end':
                                return _context16.stop();
                        }
                    }
                }, _callee16, this);
            }));

            function withdraw(_x50, _x51, _x52) {
                return _ref16.apply(this, arguments);
            }

            return withdraw;
        }()
    }, {
        key: 'sign',
        value: function sign(path) {
            var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var request = '/' + this.implodeParams(path, params);
            var query = this.omit(params, this.extractParams(path));
            if (method == 'GET') {
                if (Object.keys(query).length) request += '?' + this.urlencode(query);
            }
            var url = this.urls['api'] + request;
            if (api == 'private') {
                this.checkRequiredCredentials();
                var nonce = this.nonce().toString();
                var payload = '';
                if (method != 'GET') {
                    if (Object.keys(query).length) {
                        body = this.json(query);
                        payload = body;
                    }
                }
                // let payload = (body) ? body : '';
                var what = nonce + method + request + payload;
                var secret = this.base64ToBinary(this.secret);
                var signature = this.hmac(this.encode(what), secret, 'sha256', 'base64');
                headers = {
                    'CB-ACCESS-KEY': this.apiKey,
                    'CB-ACCESS-SIGN': this.decode(signature),
                    'CB-ACCESS-TIMESTAMP': nonce,
                    'CB-ACCESS-PASSPHRASE': this.password,
                    'Content-Type': 'application/json'
                };
            }
            return { 'url': url, 'method': method, 'body': body, 'headers': headers };
        }
    }, {
        key: 'handleErrors',
        value: function handleErrors(code, reason, url, method, headers, body) {
            if (code == 400) {
                if (body[0] == "{") {
                    var response = JSON.parse(body);
                    var message = response['message'];
                    if (message.indexOf('price too small') >= 0) {
                        throw new InvalidOrder(this.id + ' ' + message);
                    } else if (message.indexOf('price too precise') >= 0) {
                        throw new InvalidOrder(this.id + ' ' + message);
                    } else if (message == 'Invalid API Key') {
                        throw new AuthenticationError(this.id + ' ' + message);
                    }
                    throw new ExchangeError(this.id + ' ' + this.json(response));
                }
                throw new ExchangeError(this.id + ' ' + body);
            }
        }
    }, {
        key: 'request',
        value: function () {
            var _ref17 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee17(path) {
                var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
                var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;
                var response;
                return regeneratorRuntime.wrap(function _callee17$(_context17) {
                    while (1) {
                        switch (_context17.prev = _context17.next) {
                            case 0:
                                _context17.next = 2;
                                return this.fetch2(path, api, method, params, headers, body);

                            case 2:
                                response = _context17.sent;

                                if (!('message' in response)) {
                                    _context17.next = 5;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' ' + this.json(response));

                            case 5:
                                return _context17.abrupt('return', response);

                            case 6:
                            case 'end':
                                return _context17.stop();
                        }
                    }
                }, _callee17, this);
            }));

            function request(_x63) {
                return _ref17.apply(this, arguments);
            }

            return request;
        }()
    }]);

    return gdax;
}(Exchange);