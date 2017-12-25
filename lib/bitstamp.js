"use strict";

//  ---------------------------------------------------------------------------

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

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
    AuthenticationError = _require.AuthenticationError;

//  ---------------------------------------------------------------------------

module.exports = function (_Exchange) {
    (0, _inherits3.default)(bitstamp, _Exchange);

    function bitstamp() {
        (0, _classCallCheck3.default)(this, bitstamp);
        return (0, _possibleConstructorReturn3.default)(this, (bitstamp.__proto__ || (0, _getPrototypeOf2.default)(bitstamp)).apply(this, arguments));
    }

    (0, _createClass3.default)(bitstamp, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend((0, _get3.default)(bitstamp.prototype.__proto__ || (0, _getPrototypeOf2.default)(bitstamp.prototype), 'describe', this).call(this), {
                'id': 'bitstamp',
                'name': 'Bitstamp',
                'countries': 'GB',
                'rateLimit': 1000,
                'version': 'v2',
                'hasCORS': false,
                'hasFetchOrder': true,
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
                        'get': ['order_book/{pair}/', 'ticker_hour/{pair}/', 'ticker/{pair}/', 'transactions/{pair}/', 'trading-pairs-info/']
                    },
                    'private': {
                        'post': ['balance/', 'balance/{pair}/', 'user_transactions/', 'user_transactions/{pair}/', 'open_orders/all/', 'open_orders/{pair}', 'order_status/', 'cancel_order/', 'buy/{pair}/', 'buy/market/{pair}/', 'sell/{pair}/', 'sell/market/{pair}/', 'ltc_withdrawal/', 'ltc_address/', 'eth_withdrawal/', 'eth_address/', 'transfer-to-main/', 'transfer-from-main/', 'xrp_withdrawal/', 'xrp_address/', 'withdrawal/open/', 'withdrawal/status/', 'withdrawal/cancel/', 'liquidation_address/new/', 'liquidation_address/info/']
                    },
                    'v1': {
                        'post': ['bitcoin_deposit_address/', 'unconfirmed_btc/', 'bitcoin_withdrawal/']
                    }
                },
                'fees': {
                    'trading': {
                        'tierBased': true,
                        'percentage': true,
                        'taker': 0.25 / 100,
                        'maker': 0.25 / 100,
                        'tiers': {
                            'taker': [[0, 0.25 / 100], [20000, 0.24 / 100], [100000, 0.22 / 100], [400000, 0.20 / 100], [600000, 0.15 / 100], [1000000, 0.14 / 100], [2000000, 0.13 / 100], [4000000, 0.12 / 100], [20000000, 0.11 / 100], [20000001, 0.10 / 100]],
                            'maker': [[0, 0.25 / 100], [20000, 0.24 / 100], [100000, 0.22 / 100], [400000, 0.20 / 100], [600000, 0.15 / 100], [1000000, 0.14 / 100], [2000000, 0.13 / 100], [4000000, 0.12 / 100], [20000000, 0.11 / 100], [20000001, 0.10 / 100]]
                        }
                    },
                    'funding': {
                        'tierBased': false,
                        'percentage': false,
                        'withdraw': {
                            'BTC': 0,
                            'LTC': 0,
                            'ETH': 0,
                            'XRP': 0,
                            'USD': 25,
                            'EUR': 0.90
                        },
                        'deposit': {
                            'BTC': 0,
                            'LTC': 0,
                            'ETH': 0,
                            'XRP': 0,
                            'USD': 25,
                            'EUR': 0
                        }
                    }
                }
            });
        }
    }, {
        key: 'fetchMarkets',
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                var markets, result, i, market, symbol, _symbol$split, _symbol$split2, base, quote, id, precision, _market$minimum_order, _market$minimum_order2, cost, currency, active, lot;

                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.publicGetTradingPairsInfo();

                            case 2:
                                markets = _context.sent;
                                result = [];

                                for (i = 0; i < markets.length; i++) {
                                    market = markets[i];
                                    symbol = market['name'];
                                    _symbol$split = symbol.split('/'), _symbol$split2 = (0, _slicedToArray3.default)(_symbol$split, 2), base = _symbol$split2[0], quote = _symbol$split2[1];
                                    id = market['url_symbol'];
                                    precision = {
                                        'amount': market['base_decimals'],
                                        'price': market['counter_decimals']
                                    };
                                    _market$minimum_order = market['minimum_order'].split(' '), _market$minimum_order2 = (0, _slicedToArray3.default)(_market$minimum_order, 2), cost = _market$minimum_order2[0], currency = _market$minimum_order2[1];
                                    active = market['trading'] == 'Enabled';
                                    lot = Math.pow(10, -precision['amount']);

                                    result.push({
                                        'id': id,
                                        'symbol': symbol,
                                        'base': base,
                                        'quote': quote,
                                        'info': market,
                                        'lot': lot,
                                        'active': active,
                                        'precision': precision,
                                        'limits': {
                                            'amount': {
                                                'min': lot,
                                                'max': undefined
                                            },
                                            'price': {
                                                'min': Math.pow(10, -precision['price']),
                                                'max': undefined
                                            },
                                            'cost': {
                                                'min': parseFloat(cost),
                                                'max': undefined
                                            }
                                        }
                                    });
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
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var orderbook, timestamp;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context2.next = 4;
                                return this.publicGetOrderBookPair(this.extend({
                                    'pair': this.marketId(symbol)
                                }, params));

                            case 4:
                                orderbook = _context2.sent;
                                timestamp = parseInt(orderbook['timestamp']) * 1000;
                                return _context2.abrupt('return', this.parseOrderBook(orderbook, timestamp));

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
    }, {
        key: 'fetchTicker',
        value: function () {
            var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var ticker, timestamp, vwap, baseVolume, quoteVolume;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context3.next = 4;
                                return this.publicGetTickerPair(this.extend({
                                    'pair': this.marketId(symbol)
                                }, params));

                            case 4:
                                ticker = _context3.sent;
                                timestamp = parseInt(ticker['timestamp']) * 1000;
                                vwap = parseFloat(ticker['vwap']);
                                baseVolume = parseFloat(ticker['volume']);
                                quoteVolume = baseVolume * vwap;
                                return _context3.abrupt('return', {
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
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function fetchTicker(_x4) {
                return _ref3.apply(this, arguments);
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
            var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(symbol) {
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var market, response;
                return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                _context4.next = 5;
                                return this.publicGetTransactionsPair(this.extend({
                                    'pair': market['id'],
                                    'time': 'minute'
                                }, params));

                            case 5:
                                response = _context4.sent;
                                return _context4.abrupt('return', this.parseTrades(response, market, since, limit));

                            case 7:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function fetchTrades(_x9) {
                return _ref4.apply(this, arguments);
            }

            return fetchTrades;
        }()
    }, {
        key: 'fetchBalance',
        value: function () {
            var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
                var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var balance, result, currencies, i, currency, lowercase, total, free, used, account;
                return _regenerator2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context5.next = 4;
                                return this.privatePostBalance();

                            case 4:
                                balance = _context5.sent;
                                result = { 'info': balance };
                                currencies = (0, _keys2.default)(this.currencies);

                                for (i = 0; i < currencies.length; i++) {
                                    currency = currencies[i];
                                    lowercase = currency.toLowerCase();
                                    total = lowercase + '_balance';
                                    free = lowercase + '_available';
                                    used = lowercase + '_reserved';
                                    account = this.account();

                                    if (free in balance) account['free'] = parseFloat(balance[free]);
                                    if (used in balance) account['used'] = parseFloat(balance[used]);
                                    if (total in balance) account['total'] = parseFloat(balance[total]);
                                    result[currency] = account;
                                }
                                return _context5.abrupt('return', this.parseBalance(result));

                            case 9:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function fetchBalance() {
                return _ref5.apply(this, arguments);
            }

            return fetchBalance;
        }()
    }, {
        key: 'createOrder',
        value: function () {
            var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(symbol, type, side, amount) {
                var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
                var method, order, response;
                return _regenerator2.default.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                _context6.next = 2;
                                return this.loadMarkets();

                            case 2:
                                method = 'privatePost' + this.capitalize(side);
                                order = {
                                    'pair': this.marketId(symbol),
                                    'amount': amount
                                };

                                if (type == 'market') method += 'Market';else order['price'] = price;
                                method += 'Pair';
                                _context6.next = 8;
                                return this[method](this.extend(order, params));

                            case 8:
                                response = _context6.sent;
                                return _context6.abrupt('return', {
                                    'info': response,
                                    'id': response['id']
                                });

                            case 10:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function createOrder(_x13, _x14, _x15, _x16) {
                return _ref6.apply(this, arguments);
            }

            return createOrder;
        }()
    }, {
        key: 'cancelOrder',
        value: function () {
            var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(id) {
                var symbol = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
                return _regenerator2.default.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                _context7.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context7.next = 4;
                                return this.privatePostCancelOrder({ 'id': id });

                            case 4:
                                return _context7.abrupt('return', _context7.sent);

                            case 5:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function cancelOrder(_x19) {
                return _ref7.apply(this, arguments);
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
            var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8(id) {
                var symbol = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var response;
                return _regenerator2.default.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                _context8.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context8.next = 4;
                                return this.privatePostOrderStatus({ 'id': id });

                            case 4:
                                response = _context8.sent;
                                return _context8.abrupt('return', this.parseOrderStatus(response));

                            case 6:
                            case 'end':
                                return _context8.stop();
                        }
                    }
                }, _callee8, this);
            }));

            function fetchOrderStatus(_x21) {
                return _ref8.apply(this, arguments);
            }

            return fetchOrderStatus;
        }()
    }, {
        key: 'fetchMyTrades',
        value: function () {
            var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9() {
                var symbol = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var market, pair, request, response;
                return _regenerator2.default.wrap(function _callee9$(_context9) {
                    while (1) {
                        switch (_context9.prev = _context9.next) {
                            case 0:
                                _context9.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = undefined;

                                if (symbol) market = this.market(symbol);
                                pair = market ? market['id'] : 'all';
                                request = this.extend({ 'pair': pair }, params);
                                _context9.next = 8;
                                return this.privatePostOpenOrdersPair(request);

                            case 8:
                                response = _context9.sent;
                                return _context9.abrupt('return', this.parseTrades(response, market, since, limit));

                            case 10:
                            case 'end':
                                return _context9.stop();
                        }
                    }
                }, _callee9, this);
            }));

            function fetchMyTrades() {
                return _ref9.apply(this, arguments);
            }

            return fetchMyTrades;
        }()
    }, {
        key: 'fetchOrder',
        value: function () {
            var _ref10 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10(id) {
                var symbol = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
                return _regenerator2.default.wrap(function _callee10$(_context10) {
                    while (1) {
                        switch (_context10.prev = _context10.next) {
                            case 0:
                                _context10.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context10.next = 4;
                                return this.privatePostOrderStatus({ 'id': id });

                            case 4:
                                return _context10.abrupt('return', _context10.sent);

                            case 5:
                            case 'end':
                                return _context10.stop();
                        }
                    }
                }, _callee10, this);
            }));

            function fetchOrder(_x28) {
                return _ref10.apply(this, arguments);
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

            var url = this.urls['api'] + '/';
            if (api != 'v1') url += this.version + '/';
            url += this.implodeParams(path, params);
            var query = this.omit(params, this.extractParams(path));
            if (api == 'public') {
                if ((0, _keys2.default)(query).length) url += '?' + this.urlencode(query);
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
            var _ref11 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee11(path) {
                var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
                var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;
                var response;
                return _regenerator2.default.wrap(function _callee11$(_context11) {
                    while (1) {
                        switch (_context11.prev = _context11.next) {
                            case 0:
                                _context11.next = 2;
                                return this.fetch2(path, api, method, params, headers, body);

                            case 2:
                                response = _context11.sent;

                                if (!('status' in response)) {
                                    _context11.next = 6;
                                    break;
                                }

                                if (!(response['status'] == 'error')) {
                                    _context11.next = 6;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' ' + this.json(response));

                            case 6:
                                return _context11.abrupt('return', response);

                            case 7:
                            case 'end':
                                return _context11.stop();
                        }
                    }
                }, _callee11, this);
            }));

            function request(_x39) {
                return _ref11.apply(this, arguments);
            }

            return request;
        }()
    }]);
    return bitstamp;
}(Exchange);