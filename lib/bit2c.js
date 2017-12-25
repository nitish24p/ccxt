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

//  ---------------------------------------------------------------------------

module.exports = function (_Exchange) {
    (0, _inherits3.default)(bit2c, _Exchange);

    function bit2c() {
        (0, _classCallCheck3.default)(this, bit2c);
        return (0, _possibleConstructorReturn3.default)(this, (bit2c.__proto__ || (0, _getPrototypeOf2.default)(bit2c)).apply(this, arguments));
    }

    (0, _createClass3.default)(bit2c, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend((0, _get3.default)(bit2c.prototype.__proto__ || (0, _getPrototypeOf2.default)(bit2c.prototype), 'describe', this).call(this), {
                'id': 'bit2c',
                'name': 'Bit2C',
                'countries': 'IL', // Israel
                'rateLimit': 3000,
                'hasCORS': false,
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/27766119-3593220e-5ece-11e7-8b3a-5a041f6bcc3f.jpg',
                    'api': 'https://www.bit2c.co.il',
                    'www': 'https://www.bit2c.co.il',
                    'doc': ['https://www.bit2c.co.il/home/api', 'https://github.com/OferE/bit2c']
                },
                'api': {
                    'public': {
                        'get': ['Exchanges/{pair}/Ticker', 'Exchanges/{pair}/orderbook', 'Exchanges/{pair}/trades']
                    },
                    'private': {
                        'post': ['Account/Balance', 'Account/Balance/v2', 'Merchant/CreateCheckout', 'Order/AccountHistory', 'Order/AddCoinFundsRequest', 'Order/AddFund', 'Order/AddOrder', 'Order/AddOrderMarketPriceBuy', 'Order/AddOrderMarketPriceSell', 'Order/CancelOrder', 'Order/MyOrders', 'Payment/GetMyId', 'Payment/Send']
                    }
                },
                'markets': {
                    'BTC/NIS': { 'id': 'BtcNis', 'symbol': 'BTC/NIS', 'base': 'BTC', 'quote': 'NIS' },
                    'BCH/NIS': { 'id': 'BchNis', 'symbol': 'BCH/NIS', 'base': 'BCH', 'quote': 'NIS' },
                    'LTC/NIS': { 'id': 'LtcNis', 'symbol': 'LTC/NIS', 'base': 'LTC', 'quote': 'NIS' },
                    'BTG/NIS': { 'id': 'BtgNis', 'symbol': 'BTG/NIS', 'base': 'BTG', 'quote': 'NIS' }
                },
                'fees': {
                    'trading': {
                        'maker': 0.5 / 100,
                        'taker': 0.5 / 100
                    }
                }
            });
        }
    }, {
        key: 'fetchBalance',
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var balance, result, currencies, i, currency, account, available;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.privatePostAccountBalanceV2();

                            case 2:
                                balance = _context.sent;
                                result = { 'info': balance };
                                currencies = (0, _keys2.default)(this.currencies);

                                for (i = 0; i < currencies.length; i++) {
                                    currency = currencies[i];
                                    account = this.account();

                                    if (currency in balance) {
                                        available = 'AVAILABLE_' + currency;

                                        account['free'] = balance[available];
                                        account['total'] = balance[currency];
                                        account['used'] = account['total'] - account['free'];
                                    }
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
                var orderbook;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this.publicGetExchangesPairOrderbook(this.extend({
                                    'pair': this.marketId(symbol)
                                }, params));

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
                var ticker, timestamp, averagePrice, baseVolume, quoteVolume;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return this.publicGetExchangesPairTicker(this.extend({
                                    'pair': this.marketId(symbol)
                                }, params));

                            case 2:
                                ticker = _context3.sent;
                                timestamp = this.milliseconds();
                                averagePrice = parseFloat(ticker['av']);
                                baseVolume = parseFloat(ticker['a']);
                                quoteVolume = baseVolume * averagePrice;
                                return _context3.abrupt('return', {
                                    'symbol': symbol,
                                    'timestamp': timestamp,
                                    'datetime': this.iso8601(timestamp),
                                    'high': undefined,
                                    'low': undefined,
                                    'bid': parseFloat(ticker['h']),
                                    'ask': parseFloat(ticker['l']),
                                    'vwap': undefined,
                                    'open': undefined,
                                    'close': undefined,
                                    'first': undefined,
                                    'last': parseFloat(ticker['ll']),
                                    'change': undefined,
                                    'percentage': undefined,
                                    'average': averagePrice,
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
        value: function parseTrade(trade) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var timestamp = parseInt(trade['date']) * 1000;
            var symbol = undefined;
            if (market) symbol = market['symbol'];
            return {
                'id': trade['tid'].toString(),
                'info': trade,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'symbol': symbol,
                'order': undefined,
                'type': undefined,
                'side': undefined,
                'price': trade['price'],
                'amount': trade['amount']
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
                                return this.publicGetExchangesPairTrades(this.extend({
                                    'pair': market['id']
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

            function fetchTrades(_x10) {
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
                var method, order, result;
                return _regenerator2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                method = 'privatePostOrderAddOrder';
                                order = {
                                    'Amount': amount,
                                    'Pair': this.marketId(symbol)
                                };

                                if (type == 'market') {
                                    method += 'MarketPrice' + this.capitalize(side);
                                } else {
                                    order['Price'] = price;
                                    order['Total'] = amount * price;
                                    order['IsBid'] = side == 'buy';
                                }
                                _context5.next = 5;
                                return this[method](this.extend(order, params));

                            case 5:
                                result = _context5.sent;
                                return _context5.abrupt('return', {
                                    'info': result,
                                    'id': result['NewOrder']['id']
                                });

                            case 7:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function createOrder(_x13, _x14, _x15, _x16) {
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
                                return this.privatePostOrderCancelOrder({ 'id': id });

                            case 2:
                                return _context6.abrupt('return', _context6.sent);

                            case 3:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function cancelOrder(_x19) {
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

            var url = this.urls['api'] + '/' + this.implodeParams(path, params);
            if (api == 'public') {
                url += '.json';
            } else {
                this.checkRequiredCredentials();
                var nonce = this.nonce();
                var query = this.extend({ 'nonce': nonce }, params);
                body = this.urlencode(query);
                var signature = this.hmac(this.encode(body), this.encode(this.secret), 'sha512', 'base64');
                headers = {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'key': this.apiKey,
                    'sign': this.decode(signature)
                };
            }
            return { 'url': url, 'method': method, 'body': body, 'headers': headers };
        }
    }]);
    return bit2c;
}(Exchange);