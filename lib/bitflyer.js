"use strict";

//  ---------------------------------------------------------------------------

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Exchange = require('./base/Exchange');

//  ---------------------------------------------------------------------------

module.exports = function (_Exchange) {
    _inherits(bitflyer, _Exchange);

    function bitflyer() {
        _classCallCheck(this, bitflyer);

        return _possibleConstructorReturn(this, (bitflyer.__proto__ || Object.getPrototypeOf(bitflyer)).apply(this, arguments));
    }

    _createClass(bitflyer, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend(_get(bitflyer.prototype.__proto__ || Object.getPrototypeOf(bitflyer.prototype), 'describe', this).call(this), {
                'id': 'bitflyer',
                'name': 'bitFlyer',
                'countries': 'JP',
                'version': 'v1',
                'rateLimit': 500,
                'hasCORS': false,
                'hasWithdraw': true,
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/28051642-56154182-660e-11e7-9b0d-6042d1e6edd8.jpg',
                    'api': 'https://api.bitflyer.jp',
                    'www': 'https://bitflyer.jp',
                    'doc': 'https://bitflyer.jp/API'
                },
                'api': {
                    'public': {
                        'get': ['getmarkets', // or 'markets'
                        'getboard', // or 'board'
                        'getticker', // or 'ticker'
                        'getexecutions', // or 'executions'
                        'gethealth', 'getchats']
                    },
                    'private': {
                        'get': ['getpermissions', 'getbalance', 'getcollateral', 'getcollateralaccounts', 'getaddresses', 'getcoinins', 'getcoinouts', 'getbankaccounts', 'getdeposits', 'getwithdrawals', 'getchildorders', 'getparentorders', 'getparentorder', 'getexecutions', 'getpositions', 'gettradingcommission'],
                        'post': ['sendcoin', 'withdraw', 'sendchildorder', 'cancelchildorder', 'sendparentorder', 'cancelparentorder', 'cancelallchildorders']
                    }
                },
                'fees': {
                    'trading': {
                        'maker': 0.25 / 100,
                        'taker': 0.25 / 100
                    }
                }
            });
        }
    }, {
        key: 'fetchMarkets',
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                var markets, result, p, market, id, currencies, base, quote, symbol, numCurrencies;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.publicGetMarkets();

                            case 2:
                                markets = _context.sent;
                                result = [];

                                for (p = 0; p < markets.length; p++) {
                                    market = markets[p];
                                    id = market['product_code'];
                                    currencies = id.split('_');
                                    base = undefined;
                                    quote = undefined;
                                    symbol = id;
                                    numCurrencies = currencies.length;

                                    if (numCurrencies == 1) {
                                        base = symbol.slice(0, 3);
                                        quote = symbol.slice(3, 6);
                                    } else if (numCurrencies == 2) {
                                        base = currencies[0];
                                        quote = currencies[1];
                                        symbol = base + '/' + quote;
                                    } else {
                                        base = currencies[1];
                                        quote = currencies[2];
                                    }
                                    result.push({
                                        'id': id,
                                        'symbol': symbol,
                                        'base': base,
                                        'quote': quote,
                                        'info': market
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
        key: 'fetchBalance',
        value: function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
                var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                var response, balances, b, account, currency, result, currencies, i, _currency, _account;

                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context2.next = 4;
                                return this.privateGetBalance();

                            case 4:
                                response = _context2.sent;
                                balances = {};

                                for (b = 0; b < response.length; b++) {
                                    account = response[b];
                                    currency = account['currency_code'];

                                    balances[currency] = account;
                                }
                                result = { 'info': response };
                                currencies = Object.keys(this.currencies);

                                for (i = 0; i < currencies.length; i++) {
                                    _currency = currencies[i];
                                    _account = this.account();

                                    if (_currency in balances) {
                                        _account['total'] = balances[_currency]['amount'];
                                        _account['free'] = balances[_currency]['available'];
                                        _account['used'] = _account['total'] - _account['free'];
                                    }
                                    result[_currency] = _account;
                                }
                                return _context2.abrupt('return', this.parseBalance(result));

                            case 11:
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
                var orderbook;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context3.next = 4;
                                return this.publicGetBoard(this.extend({
                                    'product_code': this.marketId(symbol)
                                }, params));

                            case 4:
                                orderbook = _context3.sent;
                                return _context3.abrupt('return', this.parseOrderBook(orderbook, undefined, 'bids', 'asks', 'price', 'size'));

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
            var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var ticker, timestamp;
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context4.next = 4;
                                return this.publicGetTicker(this.extend({
                                    'product_code': this.marketId(symbol)
                                }, params));

                            case 4:
                                ticker = _context4.sent;
                                timestamp = this.parse8601(ticker['timestamp']);
                                return _context4.abrupt('return', {
                                    'symbol': symbol,
                                    'timestamp': timestamp,
                                    'datetime': this.iso8601(timestamp),
                                    'high': undefined,
                                    'low': undefined,
                                    'bid': parseFloat(ticker['best_bid']),
                                    'ask': parseFloat(ticker['best_ask']),
                                    'vwap': undefined,
                                    'open': undefined,
                                    'close': undefined,
                                    'first': undefined,
                                    'last': parseFloat(ticker['ltp']),
                                    'change': undefined,
                                    'percentage': undefined,
                                    'average': undefined,
                                    'baseVolume': parseFloat(ticker['volume_by_product']),
                                    'quoteVolume': undefined,
                                    'info': ticker
                                });

                            case 7:
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
        value: function parseTrade(trade) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var side = undefined;
            var order = undefined;
            if ('side' in trade) if (trade['side']) {
                side = trade['side'].toLowerCase();
                var id = side + '_child_order_acceptance_id';
                if (id in trade) order = trade[id];
            }
            var timestamp = this.parse8601(trade['exec_date']);
            return {
                'id': trade['id'].toString(),
                'info': trade,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'symbol': market['symbol'],
                'order': order,
                'type': undefined,
                'side': side,
                'price': trade['price'],
                'amount': trade['size']
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
                                return this.publicGetExecutions(this.extend({
                                    'product_code': market['id']
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

            function fetchTrades(_x10) {
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
                var order, result;
                return regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                _context6.next = 2;
                                return this.loadMarkets();

                            case 2:
                                order = {
                                    'product_code': this.marketId(symbol),
                                    'child_order_type': type.toUpperCase(),
                                    'side': side.toUpperCase(),
                                    'price': price,
                                    'size': amount
                                };
                                _context6.next = 5;
                                return this.privatePostSendchildorder(this.extend(order, params));

                            case 5:
                                result = _context6.sent;
                                return _context6.abrupt('return', {
                                    'info': result,
                                    'id': result['child_order_acceptance_id']
                                });

                            case 7:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function createOrder(_x13, _x14, _x15, _x16) {
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
                                _context7.next = 4;
                                return this.privatePostCancelchildorder(this.extend({
                                    'parent_order_id': id
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

            function cancelOrder(_x19) {
                return _ref7.apply(this, arguments);
            }

            return cancelOrder;
        }()
    }, {
        key: 'withdraw',
        value: function () {
            var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(currency, amount, address) {
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var response;
                return regeneratorRuntime.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                _context8.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context8.next = 4;
                                return this.privatePostWithdraw(this.extend({
                                    'currency_code': currency,
                                    'amount': amount
                                    // 'bank_account_id': 1234,
                                }, params));

                            case 4:
                                response = _context8.sent;
                                return _context8.abrupt('return', {
                                    'info': response,
                                    'id': response['message_id']
                                });

                            case 6:
                            case 'end':
                                return _context8.stop();
                        }
                    }
                }, _callee8, this);
            }));

            function withdraw(_x21, _x22, _x23) {
                return _ref8.apply(this, arguments);
            }

            return withdraw;
        }()
    }, {
        key: 'sign',
        value: function sign(path) {
            var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var request = '/' + this.version + '/';
            if (api == 'private') request += 'me/';
            request += path;
            if (method == 'GET') {
                if (Object.keys(params).length) request += '?' + this.urlencode(params);
            }
            var url = this.urls['api'] + request;
            if (api == 'private') {
                this.checkRequiredCredentials();
                var nonce = this.nonce().toString();
                body = this.json(params);
                var auth = [nonce, method, request, body].join('');
                headers = {
                    'ACCESS-KEY': this.apiKey,
                    'ACCESS-TIMESTAMP': nonce,
                    'ACCESS-SIGN': this.hmac(this.encode(auth), this.encode(this.secret)),
                    'Content-Type': 'application/json'
                };
            }
            return { 'url': url, 'method': method, 'body': body, 'headers': headers };
        }
    }]);

    return bitflyer;
}(Exchange);