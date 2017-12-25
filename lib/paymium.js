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
    (0, _inherits3.default)(paymium, _Exchange);

    function paymium() {
        (0, _classCallCheck3.default)(this, paymium);
        return (0, _possibleConstructorReturn3.default)(this, (paymium.__proto__ || (0, _getPrototypeOf2.default)(paymium)).apply(this, arguments));
    }

    (0, _createClass3.default)(paymium, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend((0, _get3.default)(paymium.prototype.__proto__ || (0, _getPrototypeOf2.default)(paymium.prototype), 'describe', this).call(this), {
                'id': 'paymium',
                'name': 'Paymium',
                'countries': ['FR', 'EU'],
                'rateLimit': 2000,
                'version': 'v1',
                'hasCORS': true,
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/27790564-a945a9d4-5ff9-11e7-9d2d-b635763f2f24.jpg',
                    'api': 'https://paymium.com/api',
                    'www': 'https://www.paymium.com',
                    'doc': ['https://github.com/Paymium/api-documentation', 'https://www.paymium.com/page/developers']
                },
                'api': {
                    'public': {
                        'get': ['countries', 'data/{id}/ticker', 'data/{id}/trades', 'data/{id}/depth', 'bitcoin_charts/{id}/trades', 'bitcoin_charts/{id}/depth']
                    },
                    'private': {
                        'get': ['merchant/get_payment/{UUID}', 'user', 'user/addresses', 'user/addresses/{btc_address}', 'user/orders', 'user/orders/{UUID}', 'user/price_alerts'],
                        'post': ['user/orders', 'user/addresses', 'user/payment_requests', 'user/price_alerts', 'merchant/create_payment'],
                        'delete': ['user/orders/{UUID}/cancel', 'user/price_alerts/{id}']
                    }
                },
                'markets': {
                    'BTC/EUR': { 'id': 'eur', 'symbol': 'BTC/EUR', 'base': 'BTC', 'quote': 'EUR' }
                },
                'fees': {
                    'trading': {
                        'maker': 0.0059,
                        'taker': 0.0059
                    }
                }
            });
        }
    }, {
        key: 'fetchBalance',
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var balances, result, currencies, i, currency, lowercase, account, balance, locked;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.privateGetUser();

                            case 2:
                                balances = _context.sent;
                                result = { 'info': balances };
                                currencies = (0, _keys2.default)(this.currencies);

                                for (i = 0; i < currencies.length; i++) {
                                    currency = currencies[i];
                                    lowercase = currency.toLowerCase();
                                    account = this.account();
                                    balance = 'balance_' + lowercase;
                                    locked = 'locked_' + lowercase;

                                    if (balance in balances) account['free'] = balances[balance];
                                    if (locked in balances) account['used'] = balances[locked];
                                    account['total'] = this.sum(account['free'], account['used']);
                                    result[currency] = account;
                                }
                                return _context.abrupt('return', this.parseBalance(result));

                            case 7:
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
                var orderbook, result;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this.publicGetDataIdDepth(this.extend({
                                    'id': this.marketId(symbol)
                                }, params));

                            case 2:
                                orderbook = _context2.sent;
                                result = this.parseOrderBook(orderbook, undefined, 'bids', 'asks', 'price', 'amount');

                                result['bids'] = this.sortBy(result['bids'], 0, true);
                                return _context2.abrupt('return', result);

                            case 6:
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
                var ticker, timestamp, vwap, baseVolume, quoteVolume;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return this.publicGetDataIdTicker(this.extend({
                                    'id': this.marketId(symbol)
                                }, params));

                            case 2:
                                ticker = _context3.sent;
                                timestamp = ticker['at'] * 1000;
                                vwap = parseFloat(ticker['vwap']);
                                baseVolume = parseFloat(ticker['volume']);
                                quoteVolume = baseVolume * vwap;
                                return _context3.abrupt('return', {
                                    'symbol': symbol,
                                    'timestamp': timestamp,
                                    'datetime': this.iso8601(timestamp),
                                    'high': this.safeFloat(ticker, 'high'),
                                    'low': this.safeFloat(ticker, 'low'),
                                    'bid': this.safeFloat(ticker, 'bid'),
                                    'ask': this.safeFloat(ticker, 'ask'),
                                    'vwap': vwap,
                                    'open': this.safeFloat(ticker, 'open'),
                                    'close': undefined,
                                    'first': undefined,
                                    'last': this.safeFloat(ticker, 'price'),
                                    'change': undefined,
                                    'percentage': this.safeFloat(ticker, 'variation'),
                                    'average': undefined,
                                    'baseVolume': baseVolume,
                                    'quoteVolume': quoteVolume,
                                    'info': ticker
                                });

                            case 8:
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
            var timestamp = parseInt(trade['created_at_int']) * 1000;
            var volume = 'traded_' + market['base'].toLowerCase();
            return {
                'info': trade,
                'id': trade['uuid'],
                'order': undefined,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'symbol': market['symbol'],
                'type': undefined,
                'side': trade['side'],
                'price': trade['price'],
                'amount': trade[volume]
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
                                return this.publicGetDataIdTrades(this.extend({
                                    'id': market['id']
                                }, params));

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
            var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(market, type, side, amount) {
                var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
                var order, response;
                return _regenerator2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                order = {
                                    'type': this.capitalize(type) + 'Order',
                                    'currency': this.marketId(market),
                                    'direction': side,
                                    'amount': amount
                                };

                                if (type == 'market') order['price'] = price;
                                _context5.next = 4;
                                return this.privatePostUserOrders(this.extend(order, params));

                            case 4:
                                response = _context5.sent;
                                return _context5.abrupt('return', {
                                    'info': response,
                                    'id': response['uuid']
                                });

                            case 6:
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
                                return this.privatePostCancelOrder(this.extend({
                                    'orderNumber': id
                                }, params));

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

            var url = this.urls['api'] + '/' + this.version + '/' + this.implodeParams(path, params);
            var query = this.omit(params, this.extractParams(path));
            if (api == 'public') {
                if ((0, _keys2.default)(query).length) url += '?' + this.urlencode(query);
            } else {
                this.checkRequiredCredentials();
                body = this.json(params);
                var nonce = this.nonce().toString();
                var auth = nonce + url + body;
                headers = {
                    'Api-Key': this.apiKey,
                    'Api-Signature': this.hmac(this.encode(auth), this.secret),
                    'Api-Nonce': nonce,
                    'Content-Type': 'application/json'
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

                                if (!('errors' in response)) {
                                    _context7.next = 5;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' ' + this.json(response));

                            case 5:
                                return _context7.abrupt('return', response);

                            case 6:
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
    return paymium;
}(Exchange);