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
    (0, _inherits3.default)(lakebtc, _Exchange);

    function lakebtc() {
        (0, _classCallCheck3.default)(this, lakebtc);
        return (0, _possibleConstructorReturn3.default)(this, (lakebtc.__proto__ || (0, _getPrototypeOf2.default)(lakebtc)).apply(this, arguments));
    }

    (0, _createClass3.default)(lakebtc, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend((0, _get3.default)(lakebtc.prototype.__proto__ || (0, _getPrototypeOf2.default)(lakebtc.prototype), 'describe', this).call(this), {
                'id': 'lakebtc',
                'name': 'LakeBTC',
                'countries': 'US',
                'version': 'api_v2',
                'hasCORS': true,
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/28074120-72b7c38a-6660-11e7-92d9-d9027502281d.jpg',
                    'api': 'https://api.lakebtc.com',
                    'www': 'https://www.lakebtc.com',
                    'doc': ['https://www.lakebtc.com/s/api_v2', 'https://www.lakebtc.com/s/api']
                },
                'api': {
                    'public': {
                        'get': ['bcorderbook', 'bctrades', 'ticker']
                    },
                    'private': {
                        'post': ['buyOrder', 'cancelOrders', 'getAccountInfo', 'getExternalAccounts', 'getOrders', 'getTrades', 'openOrders', 'sellOrder']
                    }
                },
                'fees': {
                    'trading': {
                        'maker': 0.15 / 100,
                        'taker': 0.2 / 100
                    }
                }
            });
        }
    }, {
        key: 'fetchMarkets',
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                var markets, result, keys, k, id, market, base, quote, symbol;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.publicGetTicker();

                            case 2:
                                markets = _context.sent;
                                result = [];
                                keys = (0, _keys2.default)(markets);

                                for (k = 0; k < keys.length; k++) {
                                    id = keys[k];
                                    market = markets[id];
                                    base = id.slice(0, 3);
                                    quote = id.slice(3, 6);

                                    base = base.toUpperCase();
                                    quote = quote.toUpperCase();
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
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
                var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var response, balances, result, currencies, c, currency, balance, account;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context2.next = 4;
                                return this.privatePostGetAccountInfo();

                            case 4:
                                response = _context2.sent;
                                balances = response['balance'];
                                result = { 'info': response };
                                currencies = (0, _keys2.default)(balances);

                                for (c = 0; c < currencies.length; c++) {
                                    currency = currencies[c];
                                    balance = parseFloat(balances[currency]);
                                    account = {
                                        'free': balance,
                                        'used': 0.0,
                                        'total': balance
                                    };

                                    result[currency] = account;
                                }
                                return _context2.abrupt('return', this.parseBalance(result));

                            case 10:
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
                var orderbook;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context3.next = 4;
                                return this.publicGetBcorderbook(this.extend({
                                    'symbol': this.marketId(symbol)
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
            var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var market, tickers, ticker, timestamp;
                return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                _context4.next = 5;
                                return this.publicGetTicker(this.extend({
                                    'symbol': market['id']
                                }, params));

                            case 5:
                                tickers = _context4.sent;
                                ticker = tickers[market['id']];
                                timestamp = this.milliseconds();
                                return _context4.abrupt('return', {
                                    'symbol': symbol,
                                    'timestamp': timestamp,
                                    'datetime': this.iso8601(timestamp),
                                    'high': this.safeFloat(ticker, 'high'),
                                    'low': this.safeFloat(ticker, 'low'),
                                    'bid': this.safeFloat(ticker, 'bid'),
                                    'ask': this.safeFloat(ticker, 'ask'),
                                    'vwap': undefined,
                                    'open': undefined,
                                    'close': undefined,
                                    'first': undefined,
                                    'last': this.safeFloat(ticker, 'last'),
                                    'change': undefined,
                                    'percentage': undefined,
                                    'average': undefined,
                                    'baseVolume': this.safeFloat(ticker, 'volume'),
                                    'quoteVolume': undefined,
                                    'info': ticker
                                });

                            case 9:
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
        value: function parseTrade(trade, market) {
            var timestamp = trade['date'] * 1000;
            return {
                'info': trade,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'symbol': market['symbol'],
                'id': trade['tid'].toString(),
                'order': undefined,
                'type': undefined,
                'side': undefined,
                'price': parseFloat(trade['price']),
                'amount': parseFloat(trade['amount'])
            };
        }
    }, {
        key: 'fetchTrades',
        value: function () {
            var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(symbol) {
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var market, response;
                return _regenerator2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                _context5.next = 5;
                                return this.publicGetBctrades(this.extend({
                                    'symbol': market['id']
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

            function fetchTrades(_x9) {
                return _ref5.apply(this, arguments);
            }

            return fetchTrades;
        }()
    }, {
        key: 'createOrder',
        value: function () {
            var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(market, type, side, amount) {
                var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
                var method, marketId, order, response;
                return _regenerator2.default.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                _context6.next = 2;
                                return this.loadMarkets();

                            case 2:
                                if (!(type == 'market')) {
                                    _context6.next = 4;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' allows limit orders only');

                            case 4:
                                method = 'privatePost' + this.capitalize(side) + 'Order';
                                marketId = this.marketId(market);
                                order = {
                                    'params': [price, amount, marketId]
                                };
                                _context6.next = 9;
                                return this[method](this.extend(order, params));

                            case 9:
                                response = _context6.sent;
                                return _context6.abrupt('return', {
                                    'info': response,
                                    'id': response['id'].toString()
                                });

                            case 11:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function createOrder(_x12, _x13, _x14, _x15) {
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
                                return this.privatePostCancelOrder({ 'params': id });

                            case 4:
                                return _context7.abrupt('return', _context7.sent);

                            case 5:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function cancelOrder(_x18) {
                return _ref7.apply(this, arguments);
            }

            return cancelOrder;
        }()
    }, {
        key: 'nonce',
        value: function nonce() {
            return this.microseconds();
        }
    }, {
        key: 'sign',
        value: function sign(path) {
            var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var url = this.urls['api'] + '/' + this.version;
            if (api == 'public') {
                url += '/' + path;
                if ((0, _keys2.default)(params).length) url += '?' + this.urlencode(params);
            } else {
                this.checkRequiredCredentials();
                var nonce = this.nonce();
                if ((0, _keys2.default)(params).length) params = params.join(',');else params = '';
                var query = this.urlencode({
                    'tonce': nonce,
                    'accesskey': this.apiKey,
                    'requestmethod': method.toLowerCase(),
                    'id': nonce,
                    'method': path,
                    'params': params
                });
                body = this.json({
                    'method': path,
                    'params': params,
                    'id': nonce
                });
                var signature = this.hmac(this.encode(query), this.encode(this.secret), 'sha1');
                var auth = this.encode(this.apiKey + ':' + signature);
                headers = {
                    'Json-Rpc-Tonce': nonce,
                    'Authorization': "Basic " + this.decode(this.stringToBase64(auth)),
                    'Content-Type': 'application/json'
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

                                if (!('error' in response)) {
                                    _context8.next = 5;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' ' + this.json(response));

                            case 5:
                                return _context8.abrupt('return', response);

                            case 6:
                            case 'end':
                                return _context8.stop();
                        }
                    }
                }, _callee8, this);
            }));

            function request(_x29) {
                return _ref8.apply(this, arguments);
            }

            return request;
        }()
    }]);
    return lakebtc;
}(Exchange);