"use strict";

//  ---------------------------------------------------------------------------

import _Object$keys from 'babel-runtime/core-js/object/keys';
import _regeneratorRuntime from 'babel-runtime/regenerator';
import _asyncToGenerator from 'babel-runtime/helpers/asyncToGenerator';
import _Object$getPrototypeOf from 'babel-runtime/core-js/object/get-prototype-of';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _get from 'babel-runtime/helpers/get';
import _inherits from 'babel-runtime/helpers/inherits';
var Exchange = require('./base/Exchange');

var _require = require('./base/errors'),
    ExchangeError = _require.ExchangeError;

//  ---------------------------------------------------------------------------

module.exports = function (_Exchange) {
    _inherits(btcmarkets, _Exchange);

    function btcmarkets() {
        _classCallCheck(this, btcmarkets);

        return _possibleConstructorReturn(this, (btcmarkets.__proto__ || _Object$getPrototypeOf(btcmarkets)).apply(this, arguments));
    }

    _createClass(btcmarkets, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend(_get(btcmarkets.prototype.__proto__ || _Object$getPrototypeOf(btcmarkets.prototype), 'describe', this).call(this), {
                'id': 'btcmarkets',
                'name': 'BTC Markets',
                'countries': 'AU', // Australia
                'rateLimit': 1000, // market data cached for 1 second (trades cached for 2 seconds)
                'hasCORS': false,
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/29142911-0e1acfc2-7d5c-11e7-98c4-07d9532b29d7.jpg',
                    'api': 'https://api.btcmarkets.net',
                    'www': 'https://btcmarkets.net/',
                    'doc': 'https://github.com/BTCMarkets/API'
                },
                'api': {
                    'public': {
                        'get': ['market/{id}/tick', 'market/{id}/orderbook', 'market/{id}/trades']
                    },
                    'private': {
                        'get': ['account/balance', 'account/{id}/tradingfee'],
                        'post': ['fundtransfer/withdrawCrypto', 'fundtransfer/withdrawEFT', 'order/create', 'order/cancel', 'order/history', 'order/open', 'order/trade/history', 'order/createBatch', // they promise it's coming soon...
                        'order/detail']
                    }
                },
                'markets': {
                    'BTC/AUD': { 'id': 'BTC/AUD', 'symbol': 'BTC/AUD', 'base': 'BTC', 'quote': 'AUD', 'maker': 0.0085, 'taker': 0.0085 },
                    'LTC/AUD': { 'id': 'LTC/AUD', 'symbol': 'LTC/AUD', 'base': 'LTC', 'quote': 'AUD', 'maker': 0.0085, 'taker': 0.0085 },
                    'ETH/AUD': { 'id': 'ETH/AUD', 'symbol': 'ETH/AUD', 'base': 'ETH', 'quote': 'AUD', 'maker': 0.0085, 'taker': 0.0085 },
                    'ETC/AUD': { 'id': 'ETC/AUD', 'symbol': 'ETC/AUD', 'base': 'ETC', 'quote': 'AUD', 'maker': 0.0085, 'taker': 0.0085 },
                    'XRP/AUD': { 'id': 'XRP/AUD', 'symbol': 'XRP/AUD', 'base': 'XRP', 'quote': 'AUD', 'maker': 0.0085, 'taker': 0.0085 },
                    'BCH/AUD': { 'id': 'BCH/AUD', 'symbol': 'BCH/AUD', 'base': 'BCH', 'quote': 'AUD', 'maker': 0.0085, 'taker': 0.0085 },
                    'LTC/BTC': { 'id': 'LTC/BTC', 'symbol': 'LTC/BTC', 'base': 'LTC', 'quote': 'BTC', 'maker': 0.0022, 'taker': 0.0022 },
                    'ETH/BTC': { 'id': 'ETH/BTC', 'symbol': 'ETH/BTC', 'base': 'ETH', 'quote': 'BTC', 'maker': 0.0022, 'taker': 0.0022 },
                    'ETC/BTC': { 'id': 'ETC/BTC', 'symbol': 'ETC/BTC', 'base': 'ETC', 'quote': 'BTC', 'maker': 0.0022, 'taker': 0.0022 },
                    'XRP/BTC': { 'id': 'XRP/BTC', 'symbol': 'XRP/BTC', 'base': 'XRP', 'quote': 'BTC', 'maker': 0.0022, 'taker': 0.0022 },
                    'BCH/BTC': { 'id': 'BCH/BTC', 'symbol': 'BCH/BTC', 'base': 'BCH', 'quote': 'BTC', 'maker': 0.0022, 'taker': 0.0022 }
                }
            });
        }
    }, {
        key: 'fetchBalance',
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
                var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var balances, result, b, balance, currency, multiplier, total, used, free, account;
                return _regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context.next = 4;
                                return this.privateGetAccountBalance();

                            case 4:
                                balances = _context.sent;
                                result = { 'info': balances };

                                for (b = 0; b < balances.length; b++) {
                                    balance = balances[b];
                                    currency = balance['currency'];
                                    multiplier = 100000000;
                                    total = parseFloat(balance['balance'] / multiplier);
                                    used = parseFloat(balance['pendingFunds'] / multiplier);
                                    free = total - used;
                                    account = {
                                        'free': free,
                                        'used': used,
                                        'total': total
                                    };

                                    result[currency] = account;
                                }
                                return _context.abrupt('return', this.parseBalance(result));

                            case 8:
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
                var market, orderbook, timestamp;
                return _regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                _context2.next = 5;
                                return this.publicGetMarketIdOrderbook(this.extend({
                                    'id': market['id']
                                }, params));

                            case 5:
                                orderbook = _context2.sent;
                                timestamp = orderbook['timestamp'] * 1000;
                                return _context2.abrupt('return', this.parseOrderBook(orderbook, timestamp));

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
        key: 'parseTicker',
        value: function parseTicker(ticker) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var timestamp = ticker['timestamp'] * 1000;
            var symbol = undefined;
            if (market) symbol = market['symbol'];
            return {
                'symbol': symbol,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'high': undefined,
                'low': undefined,
                'bid': parseFloat(ticker['bestBid']),
                'ask': parseFloat(ticker['bestAsk']),
                'vwap': undefined,
                'open': undefined,
                'close': undefined,
                'first': undefined,
                'last': parseFloat(ticker['lastPrice']),
                'change': undefined,
                'percentage': undefined,
                'average': undefined,
                'baseVolume': parseFloat(ticker['volume24h']),
                'quoteVolume': undefined,
                'info': ticker
            };
        }
    }, {
        key: 'fetchTicker',
        value: function () {
            var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var market, ticker;
                return _regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                _context3.next = 5;
                                return this.publicGetMarketIdTick(this.extend({
                                    'id': market['id']
                                }, params));

                            case 5:
                                ticker = _context3.sent;
                                return _context3.abrupt('return', this.parseTicker(ticker, market));

                            case 7:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function fetchTicker(_x6) {
                return _ref3.apply(this, arguments);
            }

            return fetchTicker;
        }()
    }, {
        key: 'parseTrade',
        value: function parseTrade(trade, market) {
            var timestamp = trade['date'] * 1000;
            return {
                'info': trade,
                'id': trade['tid'].toString(),
                'order': undefined,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'symbol': market['symbol'],
                'type': undefined,
                'side': undefined,
                'price': trade['price'],
                'amount': trade['amount']
            };
        }
    }, {
        key: 'fetchTrades',
        value: function () {
            var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee4(symbol) {
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var market, response;
                return _regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                _context4.next = 5;
                                return this.publicGetMarketIdTrades(this.extend({
                                    // 'since': 59868345231,
                                    'id': market['id']
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

            function fetchTrades(_x10) {
                return _ref4.apply(this, arguments);
            }

            return fetchTrades;
        }()
    }, {
        key: 'createOrder',
        value: function () {
            var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee5(symbol, type, side, amount) {
                var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
                var market, multiplier, orderSide, order, response;
                return _regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                multiplier = 100000000; // for price and volume
                                // does BTC Markets support market orders at all?

                                orderSide = side == 'buy' ? 'Bid' : 'Ask';
                                order = this.ordered({
                                    'currency': market['quote'],
                                    'instrument': market['base'],
                                    'price': price * multiplier,
                                    'volume': amount * multiplier,
                                    'orderSide': orderSide,
                                    'ordertype': this.capitalize(type),
                                    'clientRequestId': this.nonce().toString()
                                });
                                _context5.next = 8;
                                return this.privatePostOrderCreate(this.extend(order, params));

                            case 8:
                                response = _context5.sent;
                                return _context5.abrupt('return', {
                                    'info': response,
                                    'id': response['id'].toString()
                                });

                            case 10:
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
        key: 'cancelOrders',
        value: function () {
            var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee6(ids) {
                return _regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                _context6.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context6.next = 4;
                                return this.privatePostOrderCancel({ 'order_ids': ids });

                            case 4:
                                return _context6.abrupt('return', _context6.sent);

                            case 5:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function cancelOrders(_x17) {
                return _ref6.apply(this, arguments);
            }

            return cancelOrders;
        }()
    }, {
        key: 'cancelOrder',
        value: function () {
            var _ref7 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee7(id) {
                var symbol = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
                return _regeneratorRuntime.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                _context7.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context7.next = 4;
                                return this.cancelOrders([id]);

                            case 4:
                                return _context7.abrupt('return', _context7.sent);

                            case 5:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function cancelOrder(_x20) {
                return _ref7.apply(this, arguments);
            }

            return cancelOrder;
        }()
    }, {
        key: 'nonce',
        value: function nonce() {
            return this.milliseconds();
        }
    }, {
        key: 'sign',
        value: function sign(path) {
            var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var uri = '/' + this.implodeParams(path, params);
            var url = this.urls['api'] + uri;
            var query = this.omit(params, this.extractParams(path));
            if (api == 'public') {
                if (_Object$keys(params).length) url += '?' + this.urlencode(params);
            } else {
                this.checkRequiredCredentials();
                var nonce = this.nonce().toString();
                var auth = uri + "\n" + nonce + "\n";
                headers = {
                    'Content-Type': 'application/json',
                    'apikey': this.apiKey,
                    'timestamp': nonce
                };
                if (method == 'POST') {
                    body = this.urlencode(query);
                    auth += body;
                }
                var secret = this.base64ToBinary(this.secret);
                var signature = this.hmac(this.encode(auth), secret, 'sha512', 'base64');
                headers['signature'] = this.decode(signature);
            }
            return { 'url': url, 'method': method, 'body': body, 'headers': headers };
        }
    }, {
        key: 'request',
        value: function () {
            var _ref8 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee8(path) {
                var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
                var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;
                var response;
                return _regeneratorRuntime.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                _context8.next = 2;
                                return this.fetch2(path, api, method, params, headers, body);

                            case 2:
                                response = _context8.sent;

                                if (!(api == 'private')) {
                                    _context8.next = 8;
                                    break;
                                }

                                if (!('success' in response)) {
                                    _context8.next = 7;
                                    break;
                                }

                                if (response['success']) {
                                    _context8.next = 7;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' ' + this.json(response));

                            case 7:
                                return _context8.abrupt('return', response);

                            case 8:
                                return _context8.abrupt('return', response);

                            case 9:
                            case 'end':
                                return _context8.stop();
                        }
                    }
                }, _callee8, this);
            }));

            function request(_x31) {
                return _ref8.apply(this, arguments);
            }

            return request;
        }()
    }]);

    return btcmarkets;
}(Exchange);