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
    ExchangeError = _require.ExchangeError;

//  ---------------------------------------------------------------------------

module.exports = function (_Exchange) {
    (0, _inherits3.default)(therock, _Exchange);

    function therock() {
        (0, _classCallCheck3.default)(this, therock);
        return (0, _possibleConstructorReturn3.default)(this, (therock.__proto__ || (0, _getPrototypeOf2.default)(therock)).apply(this, arguments));
    }

    (0, _createClass3.default)(therock, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend((0, _get3.default)(therock.prototype.__proto__ || (0, _getPrototypeOf2.default)(therock.prototype), 'describe', this).call(this), {
                'id': 'therock',
                'name': 'TheRockTrading',
                'countries': 'MT',
                'rateLimit': 1000,
                'version': 'v1',
                'hasCORS': false,
                'hasFetchTickers': true,
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/27766869-75057fa2-5ee9-11e7-9a6f-13e641fa4707.jpg',
                    'api': 'https://api.therocktrading.com',
                    'www': 'https://therocktrading.com',
                    'doc': ['https://api.therocktrading.com/doc/v1/index.html', 'https://api.therocktrading.com/doc/']
                },
                'api': {
                    'public': {
                        'get': ['funds/{id}/orderbook', 'funds/{id}/ticker', 'funds/{id}/trades', 'funds/tickers']
                    },
                    'private': {
                        'get': ['balances', 'balances/{id}', 'discounts', 'discounts/{id}', 'funds', 'funds/{id}', 'funds/{id}/trades', 'funds/{fund_id}/orders', 'funds/{fund_id}/orders/{id}', 'funds/{fund_id}/position_balances', 'funds/{fund_id}/positions', 'funds/{fund_id}/positions/{id}', 'transactions', 'transactions/{id}', 'withdraw_limits/{id}', 'withdraw_limits'],
                        'post': ['atms/withdraw', 'funds/{fund_id}/orders'],
                        'delete': ['funds/{fund_id}/orders/{id}', 'funds/{fund_id}/orders/remove_all']
                    }
                },
                'fees': {
                    'trading': {
                        'maker': 0.02 / 100,
                        'taker': 0.2 / 100
                    }
                }
            });
        }
    }, {
        key: 'fetchMarkets',
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                var markets, result, p, market, id, base, quote, symbol;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.publicGetFundsTickers();

                            case 2:
                                markets = _context.sent;
                                result = [];

                                for (p = 0; p < markets['tickers'].length; p++) {
                                    market = markets['tickers'][p];
                                    id = market['fund_id'];
                                    base = id.slice(0, 3);
                                    quote = id.slice(3, 6);
                                    symbol = base + '/' + quote;

                                    result.push({
                                        'id': id,
                                        'symbol': symbol,
                                        'base': base,
                                        'quote': quote,
                                        'info': market
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
        key: 'fetchBalance',
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
                var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var response, balances, result, b, balance, currency, free, total, used, account;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context2.next = 4;
                                return this.privateGetBalances();

                            case 4:
                                response = _context2.sent;
                                balances = response['balances'];
                                result = { 'info': response };

                                for (b = 0; b < balances.length; b++) {
                                    balance = balances[b];
                                    currency = balance['currency'];
                                    free = balance['trading_balance'];
                                    total = balance['balance'];
                                    used = total - free;
                                    account = {
                                        'free': free,
                                        'used': used,
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
        key: 'fetchOrderBook',
        value: function () {
            var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var orderbook, timestamp;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context3.next = 4;
                                return this.publicGetFundsIdOrderbook(this.extend({
                                    'id': this.marketId(symbol)
                                }, params));

                            case 4:
                                orderbook = _context3.sent;
                                timestamp = this.parse8601(orderbook['date']);
                                return _context3.abrupt('return', this.parseOrderBook(orderbook, timestamp, 'bids', 'asks', 'price', 'amount'));

                            case 7:
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
        key: 'parseTicker',
        value: function parseTicker(ticker) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var timestamp = this.parse8601(ticker['date']);
            var symbol = undefined;
            if (market) symbol = market['symbol'];
            return {
                'symbol': symbol,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'high': parseFloat(ticker['high']),
                'low': parseFloat(ticker['low']),
                'bid': parseFloat(ticker['bid']),
                'ask': parseFloat(ticker['ask']),
                'vwap': undefined,
                'open': parseFloat(ticker['open']),
                'close': parseFloat(ticker['close']),
                'first': undefined,
                'last': parseFloat(ticker['last']),
                'change': undefined,
                'percentage': undefined,
                'average': undefined,
                'baseVolume': parseFloat(ticker['volume_traded']),
                'quoteVolume': parseFloat(ticker['volume']),
                'info': ticker
            };
        }
    }, {
        key: 'fetchTickers',
        value: function () {
            var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
                var symbols = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var response, tickers, ids, result, i, id, market, symbol, ticker;
                return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context4.next = 4;
                                return this.publicGetFundsTickers(params);

                            case 4:
                                response = _context4.sent;
                                tickers = this.indexBy(response['tickers'], 'fund_id');
                                ids = (0, _keys2.default)(tickers);
                                result = {};

                                for (i = 0; i < ids.length; i++) {
                                    id = ids[i];
                                    market = this.markets_by_id[id];
                                    symbol = market['symbol'];
                                    ticker = tickers[id];

                                    result[symbol] = this.parseTicker(ticker, market);
                                }
                                return _context4.abrupt('return', result);

                            case 10:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function fetchTickers() {
                return _ref4.apply(this, arguments);
            }

            return fetchTickers;
        }()
    }, {
        key: 'fetchTicker',
        value: function () {
            var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var market, ticker;
                return _regenerator2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                _context5.next = 5;
                                return this.publicGetFundsIdTicker(this.extend({
                                    'id': market['id']
                                }, params));

                            case 5:
                                ticker = _context5.sent;
                                return _context5.abrupt('return', this.parseTicker(ticker, market));

                            case 7:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function fetchTicker(_x8) {
                return _ref5.apply(this, arguments);
            }

            return fetchTicker;
        }()
    }, {
        key: 'parseTrade',
        value: function parseTrade(trade) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            if (!market) market = this.markets_by_id[trade['fund_id']];
            var timestamp = this.parse8601(trade['date']);
            return {
                'info': trade,
                'id': trade['id'].toString(),
                'order': undefined,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'symbol': market['symbol'],
                'type': undefined,
                'side': trade['side'],
                'price': trade['price'],
                'amount': trade['amount']
            };
        }
    }, {
        key: 'fetchTrades',
        value: function () {
            var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(symbol) {
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var market, response;
                return _regenerator2.default.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                _context6.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                _context6.next = 5;
                                return this.publicGetFundsIdTrades(this.extend({
                                    'id': market['id']
                                }, params));

                            case 5:
                                response = _context6.sent;
                                return _context6.abrupt('return', this.parseTrades(response['trades'], market, since, limit));

                            case 7:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function fetchTrades(_x13) {
                return _ref6.apply(this, arguments);
            }

            return fetchTrades;
        }()
    }, {
        key: 'createOrder',
        value: function () {
            var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(symbol, type, side, amount) {
                var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
                var response;
                return _regenerator2.default.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                _context7.next = 2;
                                return this.loadMarkets();

                            case 2:
                                if (!(type == 'market')) {
                                    _context7.next = 4;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' allows limit orders only');

                            case 4:
                                _context7.next = 6;
                                return this.privatePostFundsFundIdOrders(this.extend({
                                    'fund_id': this.marketId(symbol),
                                    'side': side,
                                    'amount': amount,
                                    'price': price
                                }, params));

                            case 6:
                                response = _context7.sent;
                                return _context7.abrupt('return', {
                                    'info': response,
                                    'id': response['id'].toString()
                                });

                            case 8:
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
                return _regenerator2.default.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                _context8.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context8.next = 4;
                                return this.privateDeleteFundsFundIdOrdersId(this.extend({
                                    'id': id
                                }, params));

                            case 4:
                                return _context8.abrupt('return', _context8.sent);

                            case 5:
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
        key: 'sign',
        value: function sign(path) {
            var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var url = this.urls['api'] + '/' + this.version + '/' + this.implodeParams(path, params);
            var query = this.omit(params, this.extractParams(path));
            if (api == 'private') {
                this.checkRequiredCredentials();
                var nonce = this.nonce().toString();
                var auth = nonce + url;
                headers = {
                    'X-TRT-KEY': this.apiKey,
                    'X-TRT-NONCE': nonce,
                    'X-TRT-SIGN': this.hmac(this.encode(auth), this.encode(this.secret), 'sha512')
                };
                if ((0, _keys2.default)(query).length) {
                    body = this.json(query);
                    headers['Content-Type'] = 'application/json';
                }
            }
            return { 'url': url, 'method': method, 'body': body, 'headers': headers };
        }
    }, {
        key: 'request',
        value: function () {
            var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9(path) {
                var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
                var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;
                var response;
                return _regenerator2.default.wrap(function _callee9$(_context9) {
                    while (1) {
                        switch (_context9.prev = _context9.next) {
                            case 0:
                                _context9.next = 2;
                                return this.fetch2(path, api, method, params, headers, body);

                            case 2:
                                response = _context9.sent;

                                if (!('errors' in response)) {
                                    _context9.next = 5;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' ' + this.json(response));

                            case 5:
                                return _context9.abrupt('return', response);

                            case 6:
                            case 'end':
                                return _context9.stop();
                        }
                    }
                }, _callee9, this);
            }));

            function request(_x33) {
                return _ref9.apply(this, arguments);
            }

            return request;
        }()
    }]);
    return therock;
}(Exchange);