"use strict";

//  ---------------------------------------------------------------------------

import _regeneratorRuntime from 'babel-runtime/regenerator';
import _Object$keys from 'babel-runtime/core-js/object/keys';
import _asyncToGenerator from 'babel-runtime/helpers/asyncToGenerator';
import _Object$getPrototypeOf from 'babel-runtime/core-js/object/get-prototype-of';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _get from 'babel-runtime/helpers/get';
import _inherits from 'babel-runtime/helpers/inherits';
var Exchange = require('./base/Exchange');

var _require = require('./base/errors'),
    ExchangeError = _require.ExchangeError,
    AuthenticationError = _require.AuthenticationError;

//  ---------------------------------------------------------------------------

module.exports = function (_Exchange) {
    _inherits(coinspot, _Exchange);

    function coinspot() {
        _classCallCheck(this, coinspot);

        return _possibleConstructorReturn(this, (coinspot.__proto__ || _Object$getPrototypeOf(coinspot)).apply(this, arguments));
    }

    _createClass(coinspot, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend(_get(coinspot.prototype.__proto__ || _Object$getPrototypeOf(coinspot.prototype), 'describe', this).call(this), {
                'id': 'coinspot',
                'name': 'CoinSpot',
                'countries': 'AU', // Australia
                'rateLimit': 1000,
                'hasCORS': false,
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/28208429-3cacdf9a-6896-11e7-854e-4c79a772a30f.jpg',
                    'api': {
                        'public': 'https://www.coinspot.com.au/pubapi',
                        'private': 'https://www.coinspot.com.au/api'
                    },
                    'www': 'https://www.coinspot.com.au',
                    'doc': 'https://www.coinspot.com.au/api'
                },
                'api': {
                    'public': {
                        'get': ['latest']
                    },
                    'private': {
                        'post': ['orders', 'orders/history', 'my/coin/deposit', 'my/coin/send', 'quote/buy', 'quote/sell', 'my/balances', 'my/orders', 'my/buy', 'my/sell', 'my/buy/cancel', 'my/sell/cancel']
                    }
                },
                'markets': {
                    'BTC/AUD': { 'id': 'BTC', 'symbol': 'BTC/AUD', 'base': 'BTC', 'quote': 'AUD' },
                    'LTC/AUD': { 'id': 'LTC', 'symbol': 'LTC/AUD', 'base': 'LTC', 'quote': 'AUD' },
                    'DOGE/AUD': { 'id': 'DOGE', 'symbol': 'DOGE/AUD', 'base': 'DOGE', 'quote': 'AUD' }
                }
            });
        }
    }, {
        key: 'fetchBalance',
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
                var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var response, result, balances, currencies, c, currency, uppercase, account;
                return _regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.privatePostMyBalances();

                            case 2:
                                response = _context.sent;
                                result = { 'info': response };

                                if ('balance' in response) {
                                    balances = response['balance'];
                                    currencies = _Object$keys(balances);

                                    for (c = 0; c < currencies.length; c++) {
                                        currency = currencies[c];
                                        uppercase = currency.toUpperCase();
                                        account = {
                                            'free': balances[currency],
                                            'used': 0.0,
                                            'total': balances[currency]
                                        };

                                        if (uppercase == 'DRK') uppercase = 'DASH';
                                        result[uppercase] = account;
                                    }
                                }
                                return _context.abrupt('return', this.parseBalance(result));

                            case 6:
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
            var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var market, orderbook, result;
                return _regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                market = this.market(symbol);
                                _context2.next = 3;
                                return this.privatePostOrders(this.extend({
                                    'cointype': market['id']
                                }, params));

                            case 3:
                                orderbook = _context2.sent;
                                result = this.parseOrderBook(orderbook, undefined, 'buyorders', 'sellorders', 'rate', 'amount');

                                result['bids'] = this.sortBy(result['bids'], 0, true);
                                result['asks'] = this.sortBy(result['asks'], 0);
                                return _context2.abrupt('return', result);

                            case 8:
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
            var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var response, id, ticker, timestamp;
                return _regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return this.publicGetLatest(params);

                            case 2:
                                response = _context3.sent;
                                id = this.marketId(symbol);

                                id = id.toLowerCase();
                                ticker = response['prices'][id];
                                timestamp = this.milliseconds();
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
                                    'baseVolume': undefined,
                                    'quoteVolume': undefined,
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
        key: 'fetchTrades',
        value: function fetchTrades(symbol) {
            var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
            var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

            return this.privatePostOrdersHistory(this.extend({
                'cointype': this.marketId(symbol)
            }, params));
        }
    }, {
        key: 'createOrder',
        value: function createOrder(market, type, side, amount) {
            var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

            var method = 'privatePostMy' + this.capitalize(side);
            if (type == 'market') throw new ExchangeError(this.id + ' allows limit orders only');
            var order = {
                'cointype': this.marketId(market),
                'amount': amount,
                'rate': price
            };
            return this[method](this.extend(order, params));
        }
    }, {
        key: 'cancelOrder',
        value: function () {
            var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee4(id) {
                var symbol = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
                var method;
                return _regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                throw new ExchangeError(this.id + ' cancelOrder () is not fully implemented yet');

                            case 4:
                                return _context4.abrupt('return', _context4.sent);

                            case 5:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function cancelOrder(_x13) {
                return _ref4.apply(this, arguments);
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

            if (!this.apiKey) throw new AuthenticationError(this.id + ' requires apiKey for all requests');
            var url = this.urls['api'][api] + '/' + path;
            if (api == 'private') {
                this.checkRequiredCredentials();
                var nonce = this.nonce();
                body = this.json(this.extend({ 'nonce': nonce }, params));
                headers = {
                    'Content-Type': 'application/json',
                    'key': this.apiKey,
                    'sign': this.hmac(this.encode(body), this.encode(this.secret), 'sha512')
                };
            }
            return { 'url': url, 'method': method, 'body': body, 'headers': headers };
        }
    }]);

    return coinspot;
}(Exchange);