"use strict";

//  ---------------------------------------------------------------------------

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

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
    (0, _inherits3.default)(btcbox, _Exchange);

    function btcbox() {
        (0, _classCallCheck3.default)(this, btcbox);
        return (0, _possibleConstructorReturn3.default)(this, (btcbox.__proto__ || (0, _getPrototypeOf2.default)(btcbox)).apply(this, arguments));
    }

    (0, _createClass3.default)(btcbox, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend((0, _get3.default)(btcbox.prototype.__proto__ || (0, _getPrototypeOf2.default)(btcbox.prototype), 'describe', this).call(this), {
                'id': 'btcbox',
                'name': 'BtcBox',
                'countries': 'JP',
                'rateLimit': 1000,
                'version': 'v1',
                'hasCORS': false,
                'hasFetchOHLCV': false,
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/31275803-4df755a8-aaa1-11e7-9abb-11ec2fad9f2d.jpg',
                    'api': 'https://www.btcbox.co.jp/api',
                    'www': 'https://www.btcbox.co.jp/',
                    'doc': 'https://www.btcbox.co.jp/help/asm'
                },
                'api': {
                    'public': {
                        'get': ['depth', 'orders', 'ticker', 'allticker']
                    },
                    'private': {
                        'post': ['balance', 'trade_add', 'trade_cancel', 'trade_list', 'trade_view', 'wallet']
                    }
                },
                'markets': {
                    'BTC/JPY': { 'id': 'BTC/JPY', 'symbol': 'BTC/JPY', 'base': 'BTC', 'quote': 'JPY' }
                }
            });
        }
    }, {
        key: 'fetchBalance',
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var balances, result, currencies, i, currency, lowercase, account, free, used;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context.next = 4;
                                return this.privatePostBalance();

                            case 4:
                                balances = _context.sent;
                                result = { 'info': balances };
                                currencies = (0, _keys2.default)(this.currencies);

                                for (i = 0; i < currencies.length; i++) {
                                    currency = currencies[i];
                                    lowercase = currency.toLowerCase();

                                    if (lowercase == 'dash') lowercase = 'drk';
                                    account = this.account();
                                    free = lowercase + '_balance';
                                    used = lowercase + '_lock';

                                    if (free in balances) account['free'] = parseFloat(balances[free]);
                                    if (used in balances) account['used'] = parseFloat(balances[used]);
                                    account['total'] = this.sum(account['free'], account['used']);
                                    result[currency] = account;
                                }
                                return _context.abrupt('return', this.parseBalance(result));

                            case 9:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function fetchBalance() {
                return _ref.apply(this, arguments);
            }

            return fetchBalance;
        }()
    }, {
        key: 'fetchOrderBook',
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var market, request, numSymbols, orderbook, result;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                request = {};
                                numSymbols = this.symbols.length;

                                if (numSymbols > 1) request['coin'] = market['id'];
                                _context2.next = 8;
                                return this.publicGetDepth(this.extend(request, params));

                            case 8:
                                orderbook = _context2.sent;
                                result = this.parseOrderBook(orderbook);

                                result['asks'] = this.sortBy(result['asks'], 0);
                                return _context2.abrupt('return', result);

                            case 12:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function fetchOrderBook(_x3) {
                return _ref2.apply(this, arguments);
            }

            return fetchOrderBook;
        }()
    }, {
        key: 'parseTicker',
        value: function parseTicker(ticker) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var timestamp = this.milliseconds();
            var symbol = undefined;
            if (market) symbol = market['symbol'];
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
                'last': this.safeFloat(ticker, 'last'),
                'change': undefined,
                'percentage': undefined,
                'average': undefined,
                'baseVolume': this.safeFloat(ticker, 'vol'),
                'quoteVolume': this.safeFloat(ticker, 'volume'),
                'info': ticker
            };
        }
    }, {
        key: 'fetchTickers',
        value: function () {
            var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
                var symbols = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var tickers, ids, result, i, id, market, symbol, ticker;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context3.next = 4;
                                return this.publicGetAllticker(params);

                            case 4:
                                tickers = _context3.sent;
                                ids = (0, _keys2.default)(tickers);
                                result = {};

                                for (i = 0; i < ids.length; i++) {
                                    id = ids[i];
                                    market = this.markets_by_id[id];
                                    symbol = market['symbol'];
                                    ticker = tickers[id];

                                    result[symbol] = this.parseTicker(ticker, market);
                                }
                                return _context3.abrupt('return', result);

                            case 9:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function fetchTickers() {
                return _ref3.apply(this, arguments);
            }

            return fetchTickers;
        }()
    }, {
        key: 'fetchTicker',
        value: function () {
            var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var market, request, numSymbols, ticker;
                return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                request = {};
                                numSymbols = this.symbols.length;

                                if (numSymbols > 1) request['coin'] = market['id'];
                                _context4.next = 8;
                                return this.publicGetTicker(this.extend(request, params));

                            case 8:
                                ticker = _context4.sent;
                                return _context4.abrupt('return', this.parseTicker(ticker, market));

                            case 10:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function fetchTicker(_x8) {
                return _ref4.apply(this, arguments);
            }

            return fetchTicker;
        }()
    }, {
        key: 'parseTrade',
        value: function parseTrade(trade, market) {
            var timestamp = parseInt(trade['date']) * 1000;
            return {
                'info': trade,
                'id': trade['tid'],
                'order': undefined,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'symbol': market['symbol'],
                'type': undefined,
                'side': trade['type'],
                'price': trade['price'],
                'amount': trade['amount']
            };
        }
    }, {
        key: 'fetchTrades',
        value: function () {
            var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(symbol) {
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var market, request, numSymbols, response;
                return _regenerator2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                request = {};
                                numSymbols = this.symbols.length;

                                if (numSymbols > 1) request['coin'] = market['id'];
                                _context5.next = 8;
                                return this.publicGetOrders(this.extend(request, params));

                            case 8:
                                response = _context5.sent;
                                return _context5.abrupt('return', this.parseTrades(response, market, since, limit));

                            case 10:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function fetchTrades(_x12) {
                return _ref5.apply(this, arguments);
            }

            return fetchTrades;
        }()
    }, {
        key: 'createOrder',
        value: function () {
            var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(symbol, type, side, amount) {
                var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
                var market, request, numSymbols, response;
                return _regenerator2.default.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                _context6.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                request = {
                                    'amount': amount,
                                    'price': price,
                                    'type': side
                                };
                                numSymbols = this.symbols.length;

                                if (numSymbols > 1) request['coin'] = market['id'];
                                _context6.next = 8;
                                return this.privatePostTradeAdd(this.extend(request, params));

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

            function createOrder(_x15, _x16, _x17, _x18) {
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
                                return this.privatePostTradeCancel(this.extend({
                                    'id': id
                                }, params));

                            case 4:
                                return _context7.abrupt('return', _context7.sent);

                            case 5:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function cancelOrder(_x21) {
                return _ref7.apply(this, arguments);
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

            var url = this.urls['api'] + '/' + this.version + '/' + path;
            if (api == 'public') {
                if ((0, _keys2.default)(params).length) url += '?' + this.urlencode(params);
            } else {
                this.checkRequiredCredentials();
                var nonce = this.nonce().toString();
                var query = this.extend({
                    'key': this.apiKey,
                    'nonce': nonce
                }, params);
                var request = this.urlencode(query);
                var secret = this.hash(this.encode(this.secret));
                query['signature'] = this.hmac(this.encode(request), this.encode(secret));
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
            var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8(path) {
                var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
                var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;
                var response;
                return _regenerator2.default.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                _context8.next = 2;
                                return this.fetch2(path, api, method, params, headers, body);

                            case 2:
                                response = _context8.sent;

                                if (!('result' in response)) {
                                    _context8.next = 6;
                                    break;
                                }

                                if (response['result']) {
                                    _context8.next = 6;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' ' + this.json(response));

                            case 6:
                                return _context8.abrupt('return', response);

                            case 7:
                            case 'end':
                                return _context8.stop();
                        }
                    }
                }, _callee8, this);
            }));

            function request(_x32) {
                return _ref8.apply(this, arguments);
            }

            return request;
        }()
    }]);
    return btcbox;
}(Exchange);