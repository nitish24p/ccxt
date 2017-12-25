"use strict";

//  ---------------------------------------------------------------------------

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Exchange = require('./base/Exchange');

var _require = require('./base/errors'),
    ExchangeError = _require.ExchangeError,
    InvalidNonce = _require.InvalidNonce,
    AuthenticationError = _require.AuthenticationError;

//  ---------------------------------------------------------------------------

module.exports = function (_Exchange) {
    (0, _inherits3.default)(kucoin, _Exchange);

    function kucoin() {
        (0, _classCallCheck3.default)(this, kucoin);
        return (0, _possibleConstructorReturn3.default)(this, (kucoin.__proto__ || (0, _getPrototypeOf2.default)(kucoin)).apply(this, arguments));
    }

    (0, _createClass3.default)(kucoin, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend((0, _get3.default)(kucoin.prototype.__proto__ || (0, _getPrototypeOf2.default)(kucoin.prototype), 'describe', this).call(this), {
                'id': 'kucoin',
                'name': 'Kucoin',
                'countries': 'HK', // Hong Kong
                'version': 'v1',
                'rateLimit': 2000,
                'hasCORS': false,
                'userAgent': this.userAgents['chrome'],
                // obsolete metainfo interface
                'hasFetchTickers': true,
                'hasFetchOHLCV': false, // see the method implementation below
                'hasFetchOrder': true,
                'hasFetchOrders': true,
                'hasFetchClosedOrders': true,
                'hasFetchOpenOrders': true,
                'hasFetchMyTrades': false,
                'hasFetchCurrencies': true,
                'hasWithdraw': true,
                // new metainfo interface
                'has': {
                    'fetchTickers': true,
                    'fetchOHLCV': true, // see the method implementation below
                    'fetchOrder': true,
                    'fetchOrders': true,
                    'fetchClosedOrders': true,
                    'fetchOpenOrders': true,
                    'fetchMyTrades': false,
                    'fetchCurrencies': true,
                    'withdraw': true
                },
                'timeframes': {
                    '1m': '1',
                    '5m': '5',
                    '15m': '15',
                    '30m': '30',
                    '1h': '60',
                    '8h': '480',
                    '1d': 'D',
                    '1w': 'W'
                },
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/33795655-b3c46e48-dcf6-11e7-8abe-dc4588ba7901.jpg',
                    'api': 'https://api.kucoin.com',
                    'www': 'https://kucoin.com',
                    'doc': 'https://kucoinapidocs.docs.apiary.io',
                    'fees': 'https://news.kucoin.com/en/fee'
                },
                'api': {
                    'public': {
                        'get': ['open/chart/config', 'open/chart/history', 'open/chart/symbol', 'open/currencies', 'open/deal-orders', 'open/kline', 'open/lang-list', 'open/orders', 'open/orders-buy', 'open/orders-sell', 'open/tick', 'market/open/coin-info', 'market/open/coins', 'market/open/coins-trending', 'market/open/symbols']
                    },
                    'private': {
                        'get': ['account/balance', 'account/{coin}/wallet/address', 'account/{coin}/wallet/records', 'account/{coin}/balance', 'account/promotion/info', 'account/promotion/sum', 'deal-orders', 'order/active', 'order/active-map', 'order/dealt', 'referrer/descendant/count', 'user/info'],
                        'post': ['account/{coin}/withdraw/apply', 'account/{coin}/withdraw/cancel', 'cancel-order', 'order', 'user/change-lang']
                    }
                },
                'fees': {
                    'trading': {
                        'maker': 0.0010,
                        'taker': 0.0010
                    }
                }
            });
        }
    }, {
        key: 'fetchMarkets',
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                var response, markets, result, i, market, id, base, quote, symbol, precision, active;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.publicGetMarketOpenSymbols();

                            case 2:
                                response = _context.sent;
                                markets = response['data'];
                                result = [];

                                for (i = 0; i < markets.length; i++) {
                                    market = markets[i];
                                    id = market['symbol'];
                                    base = market['coinType'];
                                    quote = market['coinTypePair'];

                                    base = this.commonCurrencyCode(base);
                                    quote = this.commonCurrencyCode(quote);
                                    symbol = base + '/' + quote;
                                    precision = {
                                        'amount': 8,
                                        'price': 8
                                    };
                                    active = market['trading'];

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
                                                'min': Math.pow(10, -precision['amount']),
                                                'max': undefined
                                            },
                                            'price': {
                                                'min': undefined,
                                                'max': undefined
                                            }
                                        }
                                    }));
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
        key: 'fetchCurrencies',
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
                var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var response, currencies, result, i, currency, id, code, precision, deposit, withdraw, active;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this.publicGetMarketOpenCoins(params);

                            case 2:
                                response = _context2.sent;
                                currencies = response['data'];
                                result = {};

                                for (i = 0; i < currencies.length; i++) {
                                    currency = currencies[i];
                                    id = currency['coin'];
                                    // todo: will need to rethink the fees
                                    // to add support for multiple withdrawal/deposit methods and
                                    // differentiated fees for each particular method

                                    code = this.commonCurrencyCode(id);
                                    precision = currency['tradePrecision'];
                                    deposit = currency['enableDeposit'];
                                    withdraw = currency['enableWithdraw'];
                                    active = deposit && withdraw;

                                    result[code] = {
                                        'id': id,
                                        'code': code,
                                        'info': currency,
                                        'name': currency['name'],
                                        'active': active,
                                        'status': 'ok',
                                        'fee': currency['withdrawFeeRate'], // todo: redesign
                                        'precision': precision,
                                        'limits': {
                                            'amount': {
                                                'min': Math.pow(10, -precision),
                                                'max': Math.pow(10, precision)
                                            },
                                            'price': {
                                                'min': Math.pow(10, -precision),
                                                'max': Math.pow(10, precision)
                                            },
                                            'cost': {
                                                'min': undefined,
                                                'max': undefined
                                            },
                                            'withdraw': {
                                                'min': currency['withdrawMinAmount'],
                                                'max': Math.pow(10, precision)
                                            }
                                        }
                                    };
                                }
                                return _context2.abrupt('return', result);

                            case 7:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function fetchCurrencies() {
                return _ref2.apply(this, arguments);
            }

            return fetchCurrencies;
        }()
    }, {
        key: 'fetchBalance',
        value: function () {
            var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
                var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var response, balances, result, indexed, keys, i, id, currency, account, balance, total, used, free;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context3.next = 4;
                                return this.privateGetAccountBalance(this.extend({
                                    'limit': 20, // default 12, max 20
                                    'page': 1
                                }, params));

                            case 4:
                                response = _context3.sent;
                                balances = response['data'];
                                result = { 'info': balances };
                                indexed = this.indexBy(balances, 'coinType');
                                keys = (0, _keys2.default)(indexed);

                                for (i = 0; i < keys.length; i++) {
                                    id = keys[i];
                                    currency = this.commonCurrencyCode(id);
                                    account = this.account();
                                    balance = indexed[id];
                                    total = parseFloat(balance['balance']);
                                    used = parseFloat(balance['freezeBalance']);
                                    free = total - used;

                                    account['free'] = free;
                                    account['used'] = used;
                                    account['total'] = total;
                                    result[currency] = account;
                                }
                                return _context3.abrupt('return', this.parseBalance(result));

                            case 11:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function fetchBalance() {
                return _ref3.apply(this, arguments);
            }

            return fetchBalance;
        }()
    }, {
        key: 'fetchOrderBook',
        value: function () {
            var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var market, response, orderbook;
                return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                _context4.next = 5;
                                return this.publicGetOpenOrders(this.extend({
                                    'symbol': market['id']
                                }, params));

                            case 5:
                                response = _context4.sent;
                                orderbook = response['data'];
                                return _context4.abrupt('return', this.parseOrderBook(orderbook, undefined, 'BUY', 'SELL'));

                            case 8:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function fetchOrderBook(_x4) {
                return _ref4.apply(this, arguments);
            }

            return fetchOrderBook;
        }()
    }, {
        key: 'parseOrder',
        value: function parseOrder(order) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var symbol = undefined;
            if (market) {
                symbol = market['symbol'];
            } else {
                symbol = order['coinType'] + '/' + order['coinTypePair'];
            }
            var timestamp = order['createdAt'];
            var price = this.safeFloat(order, 'price');
            var amount = this.safeFloat(order, 'amount');
            var filled = this.safeFloat(order, 'dealAmount');
            var remaining = this.safeFloat(order, 'pendingAmount');
            var side = order['type'].toLowerCase();
            var result = {
                'info': order,
                'id': this.safeString(order, 'oid'),
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'symbol': symbol,
                'type': 'limit',
                'side': side,
                'price': price,
                'amount': amount,
                'cost': price * filled,
                'filled': filled,
                'remaining': remaining,
                'status': undefined,
                'fee': this.safeFloat(order, 'fee')
            };
            return result;
        }
    }, {
        key: 'fetchOpenOrders',
        value: function () {
            var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
                var symbol = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var market, request, response, orders;
                return _regenerator2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                if (symbol) {
                                    _context5.next = 2;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' fetchOpenOrders requires a symbol param');

                            case 2:
                                _context5.next = 4;
                                return this.loadMarkets();

                            case 4:
                                market = this.market(symbol);
                                request = {
                                    'symbol': market['id']
                                };
                                _context5.next = 8;
                                return this.privateGetOrderActiveMap(this.extend(request, params));

                            case 8:
                                response = _context5.sent;
                                orders = this.arrayConcat(response['data']['SELL'], response['data']['BUY']);
                                return _context5.abrupt('return', this.parseOrders(orders, market, since, limit));

                            case 11:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function fetchOpenOrders() {
                return _ref5.apply(this, arguments);
            }

            return fetchOpenOrders;
        }()
    }, {
        key: 'fetchClosedOrders',
        value: function () {
            var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6() {
                var symbol = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var request, market, response;
                return _regenerator2.default.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                request = {};
                                _context6.next = 3;
                                return this.loadMarkets();

                            case 3:
                                market = this.market(symbol);

                                if (symbol) {
                                    request['symbol'] = market['id'];
                                }
                                if (since) {
                                    request['since'] = since;
                                }
                                if (limit) {
                                    request['limit'] = limit;
                                }
                                _context6.next = 9;
                                return this.privateGetOrderDealt(this.extend(request, params));

                            case 9:
                                response = _context6.sent;
                                return _context6.abrupt('return', this.parseOrders(response['data']['datas'], market, since, limit));

                            case 11:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function fetchClosedOrders() {
                return _ref6.apply(this, arguments);
            }

            return fetchClosedOrders;
        }()
    }, {
        key: 'createOrder',
        value: function () {
            var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(symbol, type, side, amount) {
                var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
                var market, order, response;
                return _regenerator2.default.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                if (!(type != 'limit')) {
                                    _context7.next = 2;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' allows limit orders only');

                            case 2:
                                _context7.next = 4;
                                return this.loadMarkets();

                            case 4:
                                market = this.market(symbol);
                                order = {
                                    'symbol': market['id'],
                                    'type': side.toUpperCase(),
                                    'price': this.priceToPrecision(symbol, price),
                                    'amount': this.amountToPrecision(symbol, amount)
                                };
                                _context7.next = 8;
                                return this.privatePostOrder(this.extend(order, params));

                            case 8:
                                response = _context7.sent;
                                return _context7.abrupt('return', {
                                    'info': response,
                                    'id': this.safeString(response['data'], 'orderOid')
                                });

                            case 10:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function createOrder(_x16, _x17, _x18, _x19) {
                return _ref7.apply(this, arguments);
            }

            return createOrder;
        }()
    }, {
        key: 'cancelOrder',
        value: function () {
            var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8(id) {
                var symbol = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
                var market, request, response;
                return _regenerator2.default.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                if (symbol) {
                                    _context8.next = 2;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' cancelOrder requires symbol argument');

                            case 2:
                                _context8.next = 4;
                                return this.loadMarkets();

                            case 4:
                                market = this.market(symbol);
                                request = {
                                    'symbol': market['id'],
                                    'orderOid': id
                                };

                                if (!('type' in params)) {
                                    _context8.next = 10;
                                    break;
                                }

                                request['type'] = params['type'].toUpperCase();
                                _context8.next = 11;
                                break;

                            case 10:
                                throw new ExchangeError(this.id + ' cancelOrder requires type (BUY or SELL) param');

                            case 11:
                                _context8.next = 13;
                                return this.privatePostCancelOrder(this.extend(request, params));

                            case 13:
                                response = _context8.sent;
                                return _context8.abrupt('return', response);

                            case 15:
                            case 'end':
                                return _context8.stop();
                        }
                    }
                }, _callee8, this);
            }));

            function cancelOrder(_x22) {
                return _ref8.apply(this, arguments);
            }

            return cancelOrder;
        }()
    }, {
        key: 'parseTicker',
        value: function parseTicker(ticker) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var timestamp = ticker['datetime'];
            var symbol = undefined;
            if (market) {
                symbol = market['symbol'];
            } else {
                symbol = ticker['coinType'] + '/' + ticker['coinTypePair'];
            }
            return {
                'symbol': symbol,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'high': this.safeFloat(ticker, 'high'),
                'low': this.safeFloat(ticker, 'low'),
                'bid': this.safeFloat(ticker, 'buy'),
                'ask': this.safeFloat(ticker, 'sell'),
                'vwap': undefined,
                'open': undefined,
                'close': undefined,
                'first': undefined,
                'last': this.safeFloat(ticker, 'lastDealPrice'),
                'change': undefined,
                'percentage': undefined,
                'average': undefined,
                'baseVolume': this.safeFloat(ticker, 'vol'),
                'quoteVolume': this.safeFloat(ticker, 'volValue'),
                'info': ticker
            };
        }
    }, {
        key: 'fetchTickers',
        value: function () {
            var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9() {
                var symbols = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var response, tickers, result, t, ticker, symbol;
                return _regenerator2.default.wrap(function _callee9$(_context9) {
                    while (1) {
                        switch (_context9.prev = _context9.next) {
                            case 0:
                                _context9.next = 2;
                                return this.publicGetMarketOpenSymbols(params);

                            case 2:
                                response = _context9.sent;
                                tickers = response['data'];
                                result = {};

                                for (t = 0; t < tickers.length; t++) {
                                    ticker = this.parseTicker(tickers[t]);
                                    symbol = ticker['symbol'];

                                    result[symbol] = ticker;
                                }
                                return _context9.abrupt('return', result);

                            case 7:
                            case 'end':
                                return _context9.stop();
                        }
                    }
                }, _callee9, this);
            }));

            function fetchTickers() {
                return _ref9.apply(this, arguments);
            }

            return fetchTickers;
        }()
    }, {
        key: 'fetchTicker',
        value: function () {
            var _ref10 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var market, response, ticker;
                return _regenerator2.default.wrap(function _callee10$(_context10) {
                    while (1) {
                        switch (_context10.prev = _context10.next) {
                            case 0:
                                _context10.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                _context10.next = 5;
                                return this.publicGetOpenTick(this.extend({
                                    'symbol': market['id']
                                }, params));

                            case 5:
                                response = _context10.sent;
                                ticker = response['data'];
                                return _context10.abrupt('return', this.parseTicker(ticker, market));

                            case 8:
                            case 'end':
                                return _context10.stop();
                        }
                    }
                }, _callee10, this);
            }));

            function fetchTicker(_x27) {
                return _ref10.apply(this, arguments);
            }

            return fetchTicker;
        }()
    }, {
        key: 'parseTrade',
        value: function parseTrade(trade) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var timestamp = trade[0];
            var side = undefined;
            if (trade[1] == 'BUY') {
                side = 'buy';
            } else if (trade[1] == 'SELL') {
                side = 'sell';
            }
            return {
                'id': undefined,
                'info': trade,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'symbol': market['symbol'],
                'type': 'limit',
                'side': side,
                'price': trade[2],
                'amount': trade[3]
            };
        }
    }, {
        key: 'fetchTrades',
        value: function () {
            var _ref11 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee11(symbol) {
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var market, response;
                return _regenerator2.default.wrap(function _callee11$(_context11) {
                    while (1) {
                        switch (_context11.prev = _context11.next) {
                            case 0:
                                _context11.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                _context11.next = 5;
                                return this.publicGetOpenDealOrders(this.extend({
                                    'symbol': market['id']
                                }, params));

                            case 5:
                                response = _context11.sent;
                                return _context11.abrupt('return', this.parseTrades(response['data'], market, since, limit));

                            case 7:
                            case 'end':
                                return _context11.stop();
                        }
                    }
                }, _callee11, this);
            }));

            function fetchTrades(_x32) {
                return _ref11.apply(this, arguments);
            }

            return fetchTrades;
        }()
    }, {
        key: 'parseOHLCV',
        value: function parseOHLCV(ohlcv) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
            var timeframe = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '1d';
            var since = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
            var limit = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;

            var timestamp = this.parse8601(ohlcv['T']);
            return [timestamp, ohlcv['O'], ohlcv['H'], ohlcv['L'], ohlcv['C'], ohlcv['V']];
        }
    }, {
        key: 'fetchOHLCV',
        value: function () {
            var _ref12 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee12(symbol) {
                var timeframe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '1m';
                var since = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var limit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
                var params = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
                var market, to, request, response;
                return _regenerator2.default.wrap(function _callee12$(_context12) {
                    while (1) {
                        switch (_context12.prev = _context12.next) {
                            case 0:
                                _context12.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                to = this.seconds();
                                request = {
                                    'symbol': market['id'],
                                    'type': this.timeframes[timeframe],
                                    'from': to - 86400,
                                    'to': to
                                };

                                if (since) {
                                    request['from'] = parseInt(since / 1000);
                                }
                                // limit is not documented in api call, and not respected
                                if (limit) {
                                    request['limit'] = limit;
                                }
                                _context12.next = 9;
                                return this.publicGetOpenChartHistory(this.extend(request, params));

                            case 9:
                                response = _context12.sent;
                                return _context12.abrupt('return', this.parseOHLCVs(response['data'], market, timeframe, since, limit));

                            case 11:
                            case 'end':
                                return _context12.stop();
                        }
                    }
                }, _callee12, this);
            }));

            function fetchOHLCV(_x41) {
                return _ref12.apply(this, arguments);
            }

            return fetchOHLCV;
        }()
    }, {
        key: 'sign',
        value: function sign(path) {
            var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var endpoint = '/' + this.version + '/' + this.implodeParams(path, params);
            var url = this.urls['api'] + endpoint;
            var query = this.omit(params, this.extractParams(path));
            if (api == 'public') {
                if ((0, _keys2.default)(query).length) url += '?' + this.urlencode(query);
            } else {
                this.checkRequiredCredentials();
                // their nonce is always a calibrated synched milliseconds-timestamp
                var nonce = this.milliseconds();
                var queryString = '';
                nonce = nonce.toString();
                if ((0, _keys2.default)(query).length) {
                    queryString = this.rawencode(this.keysort(query));
                    if (method == 'GET') {
                        url += '?' + queryString;
                    } else {
                        body = queryString;
                    }
                }
                var auth = endpoint + '/' + nonce + '/' + queryString;
                var payload = this.stringToBase64(this.encode(auth));
                // payload should be "encoded" as returned from stringToBase64
                var signature = this.hmac(payload, this.encode(this.secret), 'sha256');
                headers = {
                    'KC-API-KEY': this.apiKey,
                    'KC-API-NONCE': nonce,
                    'KC-API-SIGNATURE': signature
                };
            }
            return { 'url': url, 'method': method, 'body': body, 'headers': headers };
        }
    }, {
        key: 'handleErrors',
        value: function handleErrors(code, reason, url, method, headers, body) {
            if (code >= 400) {
                if (body && body[0] == "{") {
                    var response = JSON.parse(body);
                    if ('success' in response) {
                        if (!response['success']) {
                            if ('code' in response) {
                                if (response['code'] == 'UNAUTH') {
                                    var message = this.safeString(response, 'msg');
                                    if (message == 'Invalid nonce') {
                                        throw new InvalidNonce(this.id + ' ' + message);
                                    }
                                    throw new AuthenticationError(this.id + ' ' + this.json(response));
                                }
                            }
                            throw new ExchangeError(this.id + ' ' + this.json(response));
                        }
                    }
                } else {
                    throw new ExchangeError(this.id + ' ' + code.toString() + ' ' + reason);
                }
            }
        }
    }, {
        key: 'request',
        value: function () {
            var _ref13 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee13(path) {
                var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
                var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;
                var response;
                return _regenerator2.default.wrap(function _callee13$(_context13) {
                    while (1) {
                        switch (_context13.prev = _context13.next) {
                            case 0:
                                _context13.next = 2;
                                return this.fetch2(path, api, method, params, headers, body);

                            case 2:
                                response = _context13.sent;
                                return _context13.abrupt('return', response);

                            case 4:
                            case 'end':
                                return _context13.stop();
                        }
                    }
                }, _callee13, this);
            }));

            function request(_x52) {
                return _ref13.apply(this, arguments);
            }

            return request;
        }()
    }]);
    return kucoin;
}(Exchange);