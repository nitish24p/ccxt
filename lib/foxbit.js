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
    (0, _inherits3.default)(foxbit, _Exchange);

    function foxbit() {
        (0, _classCallCheck3.default)(this, foxbit);
        return (0, _possibleConstructorReturn3.default)(this, (foxbit.__proto__ || (0, _getPrototypeOf2.default)(foxbit)).apply(this, arguments));
    }

    (0, _createClass3.default)(foxbit, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend((0, _get3.default)(foxbit.prototype.__proto__ || (0, _getPrototypeOf2.default)(foxbit.prototype), 'describe', this).call(this), {
                'id': 'foxbit',
                'name': 'FoxBit',
                'countries': 'BR',
                'hasCORS': false,
                'rateLimit': 1000,
                'version': 'v1',
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/27991413-11b40d42-647f-11e7-91ee-78ced874dd09.jpg',
                    'api': {
                        'public': 'https://api.blinktrade.com/api',
                        'private': 'https://api.blinktrade.com/tapi'
                    },
                    'www': 'https://foxbit.exchange',
                    'doc': 'https://blinktrade.com/docs'
                },
                'comment': 'Blinktrade API',
                'api': {
                    'public': {
                        'get': ['{currency}/ticker', // ?crypto_currency=BTC
                        '{currency}/orderbook', // ?crypto_currency=BTC
                        '{currency}/trades']
                    },
                    'private': {
                        'post': ['D', // order
                        'F', // cancel order
                        'U2', // balance
                        'U4', // my orders
                        'U6', // withdraw
                        'U18', // deposit
                        'U24', // confirm withdrawal
                        'U26', // list withdrawals
                        'U30', // list deposits
                        'U34', // ledger
                        'U70']
                    }
                },
                'markets': {
                    'BTC/VEF': { 'id': 'BTCVEF', 'symbol': 'BTC/VEF', 'base': 'BTC', 'quote': 'VEF', 'brokerId': 1, 'broker': 'SurBitcoin' },
                    'BTC/VND': { 'id': 'BTCVND', 'symbol': 'BTC/VND', 'base': 'BTC', 'quote': 'VND', 'brokerId': 3, 'broker': 'VBTC' },
                    'BTC/BRL': { 'id': 'BTCBRL', 'symbol': 'BTC/BRL', 'base': 'BTC', 'quote': 'BRL', 'brokerId': 4, 'broker': 'FoxBit' },
                    'BTC/PKR': { 'id': 'BTCPKR', 'symbol': 'BTC/PKR', 'base': 'BTC', 'quote': 'PKR', 'brokerId': 8, 'broker': 'UrduBit' },
                    'BTC/CLP': { 'id': 'BTCCLP', 'symbol': 'BTC/CLP', 'base': 'BTC', 'quote': 'CLP', 'brokerId': 9, 'broker': 'ChileBit' }
                }
            });
        }
    }, {
        key: 'fetchBalance',
        value: function fetchBalance() {
            var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            // todo parse balance
            return this.privatePostU2({
                'BalanceReqID': this.nonce()
            });
        }
    }, {
        key: 'fetchOrderBook',
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var market, orderbook;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                market = this.market(symbol);
                                _context.next = 3;
                                return this.publicGetCurrencyOrderbook(this.extend({
                                    'currency': market['quote'],
                                    'crypto_currency': market['base']
                                }, params));

                            case 3:
                                orderbook = _context.sent;
                                return _context.abrupt('return', this.parseOrderBook(orderbook));

                            case 5:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function fetchOrderBook(_x3) {
                return _ref.apply(this, arguments);
            }

            return fetchOrderBook;
        }()
    }, {
        key: 'fetchTicker',
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var market, ticker, timestamp, lowercaseQuote, quoteVolume;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                market = this.market(symbol);
                                _context2.next = 3;
                                return this.publicGetCurrencyTicker(this.extend({
                                    'currency': market['quote'],
                                    'crypto_currency': market['base']
                                }, params));

                            case 3:
                                ticker = _context2.sent;
                                timestamp = this.milliseconds();
                                lowercaseQuote = market['quote'].toLowerCase();
                                quoteVolume = 'vol_' + lowercaseQuote;
                                return _context2.abrupt('return', {
                                    'symbol': symbol,
                                    'timestamp': timestamp,
                                    'datetime': this.iso8601(timestamp),
                                    'high': parseFloat(ticker['high']),
                                    'low': parseFloat(ticker['low']),
                                    'bid': parseFloat(ticker['buy']),
                                    'ask': parseFloat(ticker['sell']),
                                    'vwap': undefined,
                                    'open': undefined,
                                    'close': undefined,
                                    'first': undefined,
                                    'last': parseFloat(ticker['last']),
                                    'change': undefined,
                                    'percentage': undefined,
                                    'average': undefined,
                                    'baseVolume': parseFloat(ticker['vol']),
                                    'quoteVolume': parseFloat(ticker[quoteVolume]),
                                    'info': ticker
                                });

                            case 8:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function fetchTicker(_x5) {
                return _ref2.apply(this, arguments);
            }

            return fetchTicker;
        }()
    }, {
        key: 'parseTrade',
        value: function parseTrade(trade, market) {
            var timestamp = trade['date'] * 1000;
            return {
                'id': trade['tid'],
                'info': trade,
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
            var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(symbol) {
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var market, response;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                market = this.market(symbol);
                                _context3.next = 3;
                                return this.publicGetCurrencyTrades(this.extend({
                                    'currency': market['quote'],
                                    'crypto_currency': market['base']
                                }, params));

                            case 3:
                                response = _context3.sent;
                                return _context3.abrupt('return', this.parseTrades(response, market, since, limit));

                            case 5:
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
        key: 'createOrder',
        value: function () {
            var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(symbol, type, side, amount) {
                var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
                var market, orderSide, order, response, indexed, execution;
                return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                if (!(type == 'market')) {
                                    _context4.next = 2;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' allows limit orders only');

                            case 2:
                                market = this.market(symbol);
                                orderSide = side == 'buy' ? '1' : '2';
                                order = {
                                    'ClOrdID': this.nonce(),
                                    'Symbol': market['id'],
                                    'Side': orderSide,
                                    'OrdType': '2',
                                    'Price': price,
                                    'OrderQty': amount,
                                    'BrokerID': market['brokerId']
                                };
                                _context4.next = 7;
                                return this.privatePostD(this.extend(order, params));

                            case 7:
                                response = _context4.sent;
                                indexed = this.indexBy(response['Responses'], 'MsgType');
                                execution = indexed['8'];
                                return _context4.abrupt('return', {
                                    'info': response,
                                    'id': execution['OrderID']
                                });

                            case 11:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function createOrder(_x12, _x13, _x14, _x15) {
                return _ref4.apply(this, arguments);
            }

            return createOrder;
        }()
    }, {
        key: 'cancelOrder',
        value: function () {
            var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(id) {
                var symbol = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
                return _regenerator2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.next = 2;
                                return this.privatePostF(this.extend({
                                    'ClOrdID': id
                                }, params));

                            case 2:
                                return _context5.abrupt('return', _context5.sent);

                            case 3:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function cancelOrder(_x18) {
                return _ref5.apply(this, arguments);
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

            var url = this.urls['api'][api] + '/' + this.version + '/' + this.implodeParams(path, params);
            var query = this.omit(params, this.extractParams(path));
            if (api == 'public') {
                if ((0, _keys2.default)(query).length) url += '?' + this.urlencode(query);
            } else {
                this.checkRequiredCredentials();
                var nonce = this.nonce().toString();
                var request = this.extend({ 'MsgType': path }, query);
                body = this.json(request);
                headers = {
                    'APIKey': this.apiKey,
                    'Nonce': nonce,
                    'Signature': this.hmac(this.encode(nonce), this.encode(this.secret)),
                    'Content-Type': 'application/json'
                };
            }
            return { 'url': url, 'method': method, 'body': body, 'headers': headers };
        }
    }, {
        key: 'request',
        value: function () {
            var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(path) {
                var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
                var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;
                var response;
                return _regenerator2.default.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                _context6.next = 2;
                                return this.fetch2(path, api, method, params, headers, body);

                            case 2:
                                response = _context6.sent;

                                if (!('Status' in response)) {
                                    _context6.next = 6;
                                    break;
                                }

                                if (!(response['Status'] != 200)) {
                                    _context6.next = 6;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' ' + this.json(response));

                            case 6:
                                return _context6.abrupt('return', response);

                            case 7:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function request(_x29) {
                return _ref6.apply(this, arguments);
            }

            return request;
        }()
    }]);
    return foxbit;
}(Exchange);