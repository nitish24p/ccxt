"use strict";

//  ---------------------------------------------------------------------------

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Exchange = require('./base/Exchange');

var _require = require('./base/errors'),
    ExchangeError = _require.ExchangeError,
    AuthenticationError = _require.AuthenticationError;

//  ---------------------------------------------------------------------------

module.exports = function (_Exchange) {
    _inherits(flowbtc, _Exchange);

    function flowbtc() {
        _classCallCheck(this, flowbtc);

        return _possibleConstructorReturn(this, (flowbtc.__proto__ || Object.getPrototypeOf(flowbtc)).apply(this, arguments));
    }

    _createClass(flowbtc, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend(_get(flowbtc.prototype.__proto__ || Object.getPrototypeOf(flowbtc.prototype), 'describe', this).call(this), {
                'id': 'flowbtc',
                'name': 'flowBTC',
                'countries': 'BR', // Brazil
                'version': 'v1',
                'rateLimit': 1000,
                'hasCORS': true,
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/28162465-cd815d4c-67cf-11e7-8e57-438bea0523a2.jpg',
                    'api': 'https://api.flowbtc.com:8400/ajax',
                    'www': 'https://trader.flowbtc.com',
                    'doc': 'http://www.flowbtc.com.br/api/'
                },
                'requiredCredentials': {
                    'apiKey': true,
                    'secret': true,
                    'uid': true
                },
                'api': {
                    'public': {
                        'post': ['GetTicker', 'GetTrades', 'GetTradesByDate', 'GetOrderBook', 'GetProductPairs', 'GetProducts']
                    },
                    'private': {
                        'post': ['CreateAccount', 'GetUserInfo', 'SetUserInfo', 'GetAccountInfo', 'GetAccountTrades', 'GetDepositAddresses', 'Withdraw', 'CreateOrder', 'ModifyOrder', 'CancelOrder', 'CancelAllOrders', 'GetAccountOpenOrders', 'GetOrderFee']
                    }
                }
            });
        }
    }, {
        key: 'fetchMarkets',
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                var response, markets, result, p, market, id, base, quote, symbol;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.publicPostGetProductPairs();

                            case 2:
                                response = _context.sent;
                                markets = response['productPairs'];
                                result = [];

                                for (p = 0; p < markets.length; p++) {
                                    market = markets[p];
                                    id = market['name'];
                                    base = market['product1Label'];
                                    quote = market['product2Label'];
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
            var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
                var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var response, balances, result, b, balance, currency, account;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
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
                                balances = response['currencies'];
                                result = { 'info': response };

                                for (b = 0; b < balances.length; b++) {
                                    balance = balances[b];
                                    currency = balance['name'];
                                    account = {
                                        'free': balance['balance'],
                                        'used': balance['hold'],
                                        'total': 0.0
                                    };

                                    account['total'] = this.sum(account['free'], account['used']);
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
            var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var market, orderbook;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                _context3.next = 5;
                                return this.publicPostGetOrderBook(this.extend({
                                    'productPair': market['id']
                                }, params));

                            case 5:
                                orderbook = _context3.sent;
                                return _context3.abrupt('return', this.parseOrderBook(orderbook, undefined, 'bids', 'asks', 'px', 'qty'));

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
        key: 'fetchTicker',
        value: function () {
            var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var market, ticker, timestamp;
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                _context4.next = 5;
                                return this.publicPostGetTicker(this.extend({
                                    'productPair': market['id']
                                }, params));

                            case 5:
                                ticker = _context4.sent;
                                timestamp = this.milliseconds();
                                return _context4.abrupt('return', {
                                    'symbol': symbol,
                                    'timestamp': timestamp,
                                    'datetime': this.iso8601(timestamp),
                                    'high': parseFloat(ticker['high']),
                                    'low': parseFloat(ticker['low']),
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
                                    'baseVolume': parseFloat(ticker['volume24hr']),
                                    'quoteVolume': parseFloat(ticker['volume24hrProduct2']),
                                    'info': ticker
                                });

                            case 8:
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
            var timestamp = trade['unixtime'] * 1000;
            var side = trade['incomingOrderSide'] == 0 ? 'buy' : 'sell';
            return {
                'info': trade,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'symbol': market['symbol'],
                'id': trade['tid'].toString(),
                'order': undefined,
                'type': undefined,
                'side': side,
                'price': trade['px'],
                'amount': trade['qty']
            };
        }
    }, {
        key: 'fetchTrades',
        value: function () {
            var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(symbol) {
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var market, response;
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                _context5.next = 5;
                                return this.publicPostGetTrades(this.extend({
                                    'ins': market['id'],
                                    'startIndex': -1
                                }, params));

                            case 5:
                                response = _context5.sent;
                                return _context5.abrupt('return', this.parseTrades(response['trades'], market, since, limit));

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
            var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(symbol, type, side, amount) {
                var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
                var orderType, order, response;
                return regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                _context6.next = 2;
                                return this.loadMarkets();

                            case 2:
                                orderType = type == 'market' ? 1 : 0;
                                order = {
                                    'ins': this.marketId(symbol),
                                    'side': side,
                                    'orderType': orderType,
                                    'qty': amount,
                                    'px': price
                                };
                                _context6.next = 6;
                                return this.privatePostCreateOrder(this.extend(order, params));

                            case 6:
                                response = _context6.sent;
                                return _context6.abrupt('return', {
                                    'info': response,
                                    'id': response['serverOrderId']
                                });

                            case 8:
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
            var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(id) {
                var symbol = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
                return regeneratorRuntime.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                _context7.next = 2;
                                return this.loadMarkets();

                            case 2:
                                if (!('ins' in params)) {
                                    _context7.next = 6;
                                    break;
                                }

                                _context7.next = 5;
                                return this.privatePostCancelOrder(this.extend({
                                    'serverOrderId': id
                                }, params));

                            case 5:
                                return _context7.abrupt('return', _context7.sent);

                            case 6:
                                throw new ExchangeError(this.id + ' requires `ins` symbol parameter for cancelling an order');

                            case 7:
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

            var url = this.urls['api'] + '/' + this.version + '/' + path;
            if (api == 'public') {
                if (Object.keys(params).length) {
                    body = this.json(params);
                }
            } else {
                this.checkRequiredCredentials();
                var nonce = this.nonce();
                var auth = nonce.toString() + this.uid + this.apiKey;
                var signature = this.hmac(this.encode(auth), this.encode(this.secret));
                body = this.json(this.extend({
                    'apiKey': this.apiKey,
                    'apiNonce': nonce,
                    'apiSig': signature.toUpperCase()
                }, params));
                headers = {
                    'Content-Type': 'application/json'
                };
            }
            return { 'url': url, 'method': method, 'body': body, 'headers': headers };
        }
    }, {
        key: 'request',
        value: function () {
            var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(path) {
                var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
                var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;
                var response;
                return regeneratorRuntime.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                _context8.next = 2;
                                return this.fetch2(path, api, method, params, headers, body);

                            case 2:
                                response = _context8.sent;

                                if (!('isAccepted' in response)) {
                                    _context8.next = 6;
                                    break;
                                }

                                if (!response['isAccepted']) {
                                    _context8.next = 6;
                                    break;
                                }

                                return _context8.abrupt('return', response);

                            case 6:
                                throw new ExchangeError(this.id + ' ' + this.json(response));

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

    return flowbtc;
}(Exchange);