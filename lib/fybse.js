"use strict";

//  ---------------------------------------------------------------------------

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
    (0, _inherits3.default)(fybse, _Exchange);

    function fybse() {
        (0, _classCallCheck3.default)(this, fybse);
        return (0, _possibleConstructorReturn3.default)(this, (fybse.__proto__ || (0, _getPrototypeOf2.default)(fybse)).apply(this, arguments));
    }

    (0, _createClass3.default)(fybse, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend((0, _get3.default)(fybse.prototype.__proto__ || (0, _getPrototypeOf2.default)(fybse.prototype), 'describe', this).call(this), {
                'id': 'fybse',
                'name': 'FYB-SE',
                'countries': 'SE', // Sweden
                'hasCORS': false,
                'rateLimit': 1500,
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/27766512-31019772-5edb-11e7-8241-2e675e6797f1.jpg',
                    'api': 'https://www.fybse.se/api/SEK',
                    'www': 'https://www.fybse.se',
                    'doc': 'http://docs.fyb.apiary.io'
                },
                'api': {
                    'public': {
                        'get': ['ticker', 'tickerdetailed', 'orderbook', 'trades']
                    },
                    'private': {
                        'post': ['test', 'getaccinfo', 'getpendingorders', 'getorderhistory', 'cancelpendingorder', 'placeorder', 'withdraw']
                    }
                },
                'markets': {
                    'BTC/SEK': { 'id': 'SEK', 'symbol': 'BTC/SEK', 'base': 'BTC', 'quote': 'SEK' }
                }
            });
        }
    }, {
        key: 'fetchBalance',
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var balance, btc, symbol, quote, lowercase, fiat, crypto, result;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.privatePostGetaccinfo();

                            case 2:
                                balance = _context.sent;
                                btc = parseFloat(balance['btcBal']);
                                symbol = this.symbols[0];
                                quote = this.markets[symbol]['quote'];
                                lowercase = quote.toLowerCase() + 'Bal';
                                fiat = parseFloat(balance[lowercase]);
                                crypto = {
                                    'free': btc,
                                    'used': 0.0,
                                    'total': btc
                                };
                                result = { 'BTC': crypto };

                                result[quote] = {
                                    'free': fiat,
                                    'used': 0.0,
                                    'total': fiat
                                };
                                result['info'] = balance;
                                return _context.abrupt('return', this.parseBalance(result));

                            case 13:
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
                var orderbook;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this.publicGetOrderbook(params);

                            case 2:
                                orderbook = _context2.sent;
                                return _context2.abrupt('return', this.parseOrderBook(orderbook));

                            case 4:
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
        key: 'fetchTicker',
        value: function () {
            var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var ticker, timestamp, last, volume;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return this.publicGetTickerdetailed(params);

                            case 2:
                                ticker = _context3.sent;
                                timestamp = this.milliseconds();
                                last = undefined;
                                volume = undefined;

                                if ('last' in ticker) last = parseFloat(ticker['last']);
                                if ('vol' in ticker) volume = parseFloat(ticker['vol']);
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
                                    'last': last,
                                    'change': undefined,
                                    'percentage': undefined,
                                    'average': undefined,
                                    'baseVolume': volume,
                                    'quoteVolume': undefined,
                                    'info': ticker
                                });

                            case 9:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function fetchTicker(_x5) {
                return _ref3.apply(this, arguments);
            }

            return fetchTicker;
        }()
    }, {
        key: 'parseTrade',
        value: function parseTrade(trade, market) {
            var timestamp = parseInt(trade['date']) * 1000;
            return {
                'info': trade,
                'id': trade['tid'].toString(),
                'order': undefined,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'symbol': market['symbol'],
                'type': undefined,
                'side': undefined,
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
                                market = this.market(symbol);
                                _context4.next = 3;
                                return this.publicGetTrades(params);

                            case 3:
                                response = _context4.sent;
                                return _context4.abrupt('return', this.parseTrades(response, market, since, limit));

                            case 5:
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
        key: 'createOrder',
        value: function () {
            var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(symbol, type, side, amount) {
                var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
                var response;
                return _regenerator2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.next = 2;
                                return this.privatePostPlaceorder(this.extend({
                                    'qty': amount,
                                    'price': price,
                                    'type': side[0].toUpperCase()
                                }, params));

                            case 2:
                                response = _context5.sent;
                                return _context5.abrupt('return', {
                                    'info': response,
                                    'id': response['pending_oid']
                                });

                            case 4:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function createOrder(_x12, _x13, _x14, _x15) {
                return _ref5.apply(this, arguments);
            }

            return createOrder;
        }()
    }, {
        key: 'cancelOrder',
        value: function () {
            var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(id) {
                var symbol = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
                return _regenerator2.default.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                _context6.next = 2;
                                return this.privatePostCancelpendingorder({ 'orderNo': id });

                            case 2:
                                return _context6.abrupt('return', _context6.sent);

                            case 3:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function cancelOrder(_x18) {
                return _ref6.apply(this, arguments);
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

            var url = this.urls['api'] + '/' + path;
            if (api == 'public') {
                url += '.json';
            } else {
                this.checkRequiredCredentials();
                var nonce = this.nonce();
                body = this.urlencode(this.extend({ 'timestamp': nonce }, params));
                headers = {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'key': this.apiKey,
                    'sig': this.hmac(this.encode(body), this.encode(this.secret), 'sha1')
                };
            }
            return { 'url': url, 'method': method, 'body': body, 'headers': headers };
        }
    }, {
        key: 'request',
        value: function () {
            var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(path) {
                var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
                var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;
                var response;
                return _regenerator2.default.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                _context7.next = 2;
                                return this.fetch2(path, api, method, params, headers, body);

                            case 2:
                                response = _context7.sent;

                                if (!(api == 'private')) {
                                    _context7.next = 7;
                                    break;
                                }

                                if (!('error' in response)) {
                                    _context7.next = 7;
                                    break;
                                }

                                if (!response['error']) {
                                    _context7.next = 7;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' ' + this.json(response));

                            case 7:
                                return _context7.abrupt('return', response);

                            case 8:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function request(_x29) {
                return _ref7.apply(this, arguments);
            }

            return request;
        }()
    }]);
    return fybse;
}(Exchange);