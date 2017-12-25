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
    (0, _inherits3.default)(gemini, _Exchange);

    function gemini() {
        (0, _classCallCheck3.default)(this, gemini);
        return (0, _possibleConstructorReturn3.default)(this, (gemini.__proto__ || (0, _getPrototypeOf2.default)(gemini)).apply(this, arguments));
    }

    (0, _createClass3.default)(gemini, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend((0, _get3.default)(gemini.prototype.__proto__ || (0, _getPrototypeOf2.default)(gemini.prototype), 'describe', this).call(this), {
                'id': 'gemini',
                'name': 'Gemini',
                'countries': 'US',
                'rateLimit': 1500, // 200 for private API
                'version': 'v1',
                'hasCORS': false,
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/27816857-ce7be644-6096-11e7-82d6-3c257263229c.jpg',
                    'api': 'https://api.gemini.com',
                    'www': 'https://gemini.com',
                    'doc': 'https://docs.gemini.com/rest-api'
                },
                'api': {
                    'public': {
                        'get': ['symbols', 'pubticker/{symbol}', 'book/{symbol}', 'trades/{symbol}', 'auction/{symbol}', 'auction/{symbol}/history']
                    },
                    'private': {
                        'post': ['order/new', 'order/cancel', 'order/cancel/session', 'order/cancel/all', 'order/status', 'orders', 'mytrades', 'tradevolume', 'balances', 'deposit/{currency}/newAddress', 'withdraw/{currency}', 'heartbeat']
                    }
                }
            });
        }
    }, {
        key: 'fetchMarkets',
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                var markets, result, p, id, market, uppercase, base, quote, symbol;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.publicGetSymbols();

                            case 2:
                                markets = _context.sent;
                                result = [];

                                for (p = 0; p < markets.length; p++) {
                                    id = markets[p];
                                    market = id;
                                    uppercase = market.toUpperCase();
                                    base = uppercase.slice(0, 3);
                                    quote = uppercase.slice(3, 6);
                                    symbol = base + '/' + quote;

                                    result.push({
                                        'id': id,
                                        'symbol': symbol,
                                        'base': base,
                                        'quote': quote,
                                        'info': market,
                                        'taker': 0.0025
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
                var orderbook;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context2.next = 4;
                                return this.publicGetBookSymbol(this.extend({
                                    'symbol': this.marketId(symbol)
                                }, params));

                            case 4:
                                orderbook = _context2.sent;
                                return _context2.abrupt('return', this.parseOrderBook(orderbook, undefined, 'bids', 'asks', 'price', 'amount'));

                            case 6:
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
                var market, ticker, timestamp, baseVolume, quoteVolume;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                _context3.next = 5;
                                return this.publicGetPubtickerSymbol(this.extend({
                                    'symbol': market['id']
                                }, params));

                            case 5:
                                ticker = _context3.sent;
                                timestamp = ticker['volume']['timestamp'];
                                baseVolume = market['base'];
                                quoteVolume = market['quote'];
                                return _context3.abrupt('return', {
                                    'symbol': symbol,
                                    'timestamp': timestamp,
                                    'datetime': this.iso8601(timestamp),
                                    'high': undefined,
                                    'low': undefined,
                                    'bid': parseFloat(ticker['bid']),
                                    'ask': parseFloat(ticker['ask']),
                                    'vwap': undefined,
                                    'open': undefined,
                                    'close': undefined,
                                    'first': undefined,
                                    'last': parseFloat(ticker['last']),
                                    'change': undefined,
                                    'percentage': undefined,
                                    'average': undefined,
                                    'baseVolume': parseFloat(ticker['volume'][baseVolume]),
                                    'quoteVolume': parseFloat(ticker['volume'][quoteVolume]),
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
        value: function parseTrade(trade, market) {
            var timestamp = trade['timestampms'];
            return {
                'id': trade['tid'].toString(),
                'info': trade,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'symbol': market['symbol'],
                'type': undefined,
                'side': trade['type'],
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
                                return this.publicGetTradesSymbol(this.extend({
                                    'symbol': market['id']
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

            function fetchTrades(_x8) {
                return _ref4.apply(this, arguments);
            }

            return fetchTrades;
        }()
    }, {
        key: 'fetchBalance',
        value: function () {
            var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
                var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var balances, result, b, balance, currency, account;
                return _regenerator2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context5.next = 4;
                                return this.privatePostBalances();

                            case 4:
                                balances = _context5.sent;
                                result = { 'info': balances };

                                for (b = 0; b < balances.length; b++) {
                                    balance = balances[b];
                                    currency = balance['currency'];
                                    account = {
                                        'free': parseFloat(balance['available']),
                                        'used': 0.0,
                                        'total': parseFloat(balance['amount'])
                                    };

                                    account['used'] = account['total'] - account['free'];
                                    result[currency] = account;
                                }
                                return _context5.abrupt('return', this.parseBalance(result));

                            case 8:
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
                var nonce, order, response;
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
                                nonce = this.nonce();
                                order = {
                                    'client_order_id': nonce.toString(),
                                    'symbol': this.marketId(symbol),
                                    'amount': amount.toString(),
                                    'price': price.toString(),
                                    'side': side,
                                    'type': 'exchange limit' // gemini allows limit orders only
                                };
                                _context6.next = 8;
                                return this.privatePostOrderNew(this.extend(order, params));

                            case 8:
                                response = _context6.sent;
                                return _context6.abrupt('return', {
                                    'info': response,
                                    'id': response['order_id']
                                });

                            case 10:
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
                                return this.privatePostCancelOrder({ 'order_id': id });

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
        key: 'sign',
        value: function sign(path) {
            var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var url = '/' + this.version + '/' + this.implodeParams(path, params);
            var query = this.omit(params, this.extractParams(path));
            if (api == 'public') {
                if ((0, _keys2.default)(query).length) url += '?' + this.urlencode(query);
            } else {
                this.checkRequiredCredentials();
                var nonce = this.nonce();
                var request = this.extend({
                    'request': url,
                    'nonce': nonce
                }, query);
                var payload = this.json(request);
                payload = this.stringToBase64(this.encode(payload));
                var signature = this.hmac(payload, this.encode(this.secret), 'sha384');
                headers = {
                    'Content-Type': 'text/plain',
                    'X-GEMINI-APIKEY': this.apiKey,
                    'X-GEMINI-PAYLOAD': this.decode(payload),
                    'X-GEMINI-SIGNATURE': signature
                };
            }
            url = this.urls['api'] + url;
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

                                if (!(response['result'] == 'error')) {
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

            function request(_x29) {
                return _ref8.apply(this, arguments);
            }

            return request;
        }()
    }]);
    return gemini;
}(Exchange);