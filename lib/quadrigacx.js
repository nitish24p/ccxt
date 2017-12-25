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
    _inherits(quadrigacx, _Exchange);

    function quadrigacx() {
        _classCallCheck(this, quadrigacx);

        return _possibleConstructorReturn(this, (quadrigacx.__proto__ || Object.getPrototypeOf(quadrigacx)).apply(this, arguments));
    }

    _createClass(quadrigacx, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend(_get(quadrigacx.prototype.__proto__ || Object.getPrototypeOf(quadrigacx.prototype), 'describe', this).call(this), {
                'id': 'quadrigacx',
                'name': 'QuadrigaCX',
                'countries': 'CA',
                'rateLimit': 1000,
                'version': 'v2',
                'hasCORS': true,
                // obsolete metainfo interface
                'hasWithdraw': true,
                // new metainfo interface
                'has': {
                    'withdraw': true
                },
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/27766825-98a6d0de-5ee7-11e7-9fa4-38e11a2c6f52.jpg',
                    'api': 'https://api.quadrigacx.com',
                    'www': 'https://www.quadrigacx.com',
                    'doc': 'https://www.quadrigacx.com/api_info'
                },
                'requiredCredentials': {
                    'apiKey': true,
                    'secret': true,
                    'uid': true
                },
                'api': {
                    'public': {
                        'get': ['order_book', 'ticker', 'transactions']
                    },
                    'private': {
                        'post': ['balance', 'bitcoin_deposit_address', 'bitcoin_withdrawal', 'buy', 'cancel_order', 'ether_deposit_address', 'ether_withdrawal', 'lookup_order', 'open_orders', 'sell', 'user_transactions']
                    }
                },
                'markets': {
                    'BTC/CAD': { 'id': 'btc_cad', 'symbol': 'BTC/CAD', 'base': 'BTC', 'quote': 'CAD', 'maker': 0.005, 'taker': 0.005 },
                    'BTC/USD': { 'id': 'btc_usd', 'symbol': 'BTC/USD', 'base': 'BTC', 'quote': 'USD', 'maker': 0.005, 'taker': 0.005 },
                    'ETH/BTC': { 'id': 'eth_btc', 'symbol': 'ETH/BTC', 'base': 'ETH', 'quote': 'BTC', 'maker': 0.002, 'taker': 0.002 },
                    'ETH/CAD': { 'id': 'eth_cad', 'symbol': 'ETH/CAD', 'base': 'ETH', 'quote': 'CAD', 'maker': 0.005, 'taker': 0.005 },
                    'LTC/CAD': { 'id': 'ltc_cad', 'symbol': 'LTC/CAD', 'base': 'LTC', 'quote': 'CAD', 'maker': 0.005, 'taker': 0.005 },
                    'BCH/CAD': { 'id': 'btc_cad', 'symbol': 'BCH/CAD', 'base': 'BCH', 'quote': 'CAD', 'maker': 0.005, 'taker': 0.005 },
                    'BTG/CAD': { 'id': 'btg_cad', 'symbol': 'BTG/CAD', 'base': 'BTG', 'quote': 'CAD', 'maker': 0.005, 'taker': 0.005 }
                }
            });
        }
    }, {
        key: 'fetchBalance',
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var balances, result, currencies, i, currency, lowercase, account;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.privatePostBalance();

                            case 2:
                                balances = _context.sent;
                                result = { 'info': balances };
                                currencies = Object.keys(this.currencies);

                                for (i = 0; i < currencies.length; i++) {
                                    currency = currencies[i];
                                    lowercase = currency.toLowerCase();
                                    account = {
                                        'free': parseFloat(balances[lowercase + '_available']),
                                        'used': parseFloat(balances[lowercase + '_reserved']),
                                        'total': parseFloat(balances[lowercase + '_balance'])
                                    };

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
            var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var orderbook, timestamp;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this.publicGetOrderBook(this.extend({
                                    'book': this.marketId(symbol)
                                }, params));

                            case 2:
                                orderbook = _context2.sent;
                                timestamp = parseInt(orderbook['timestamp']) * 1000;
                                return _context2.abrupt('return', this.parseOrderBook(orderbook, timestamp));

                            case 5:
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
            var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var ticker, timestamp, vwap, baseVolume, quoteVolume;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return this.publicGetTicker(this.extend({
                                    'book': this.marketId(symbol)
                                }, params));

                            case 2:
                                ticker = _context3.sent;
                                timestamp = parseInt(ticker['timestamp']) * 1000;
                                vwap = parseFloat(ticker['vwap']);
                                baseVolume = parseFloat(ticker['volume']);
                                quoteVolume = baseVolume * vwap;
                                return _context3.abrupt('return', {
                                    'symbol': symbol,
                                    'timestamp': timestamp,
                                    'datetime': this.iso8601(timestamp),
                                    'high': parseFloat(ticker['high']),
                                    'low': parseFloat(ticker['low']),
                                    'bid': parseFloat(ticker['bid']),
                                    'ask': parseFloat(ticker['ask']),
                                    'vwap': vwap,
                                    'open': undefined,
                                    'close': undefined,
                                    'first': undefined,
                                    'last': parseFloat(ticker['last']),
                                    'change': undefined,
                                    'percentage': undefined,
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
            var timestamp = parseInt(trade['date']) * 1000;
            return {
                'info': trade,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'symbol': market['symbol'],
                'id': trade['tid'].toString(),
                'order': undefined,
                'type': undefined,
                'side': trade['side'],
                'price': parseFloat(trade['price']),
                'amount': parseFloat(trade['amount'])
            };
        }
    }, {
        key: 'fetchTrades',
        value: function () {
            var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(symbol) {
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var market, response;
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                market = this.market(symbol);
                                _context4.next = 3;
                                return this.publicGetTransactions(this.extend({
                                    'book': market['id']
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
            var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(symbol, type, side, amount) {
                var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
                var method, order, response;
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                method = 'privatePost' + this.capitalize(side);
                                order = {
                                    'amount': amount,
                                    'book': this.marketId(symbol)
                                };

                                if (type == 'limit') order['price'] = price;
                                _context5.next = 5;
                                return this[method](this.extend(order, params));

                            case 5:
                                response = _context5.sent;
                                return _context5.abrupt('return', {
                                    'info': response,
                                    'id': response['id'].toString()
                                });

                            case 7:
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
            var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(id) {
                var symbol = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
                return regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                _context6.next = 2;
                                return this.privatePostCancelOrder(this.extend({
                                    'id': id
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
        key: 'fetchDepositAddress',
        value: function () {
            var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(currency) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var method, response, address, status;
                return regeneratorRuntime.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                method = 'privatePost' + this.getCurrencyName(currency) + 'DepositAddress';
                                _context7.next = 3;
                                return this[method](params);

                            case 3:
                                response = _context7.sent;
                                address = undefined;
                                status = undefined;
                                // [E|e]rror

                                if (response.indexOf('rror') >= 0) {
                                    status = 'error';
                                } else {
                                    address = response;
                                    status = 'ok';
                                }
                                return _context7.abrupt('return', {
                                    'currency': currency,
                                    'address': address,
                                    'status': status,
                                    'info': this.last_http_response
                                });

                            case 8:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function fetchDepositAddress(_x20) {
                return _ref7.apply(this, arguments);
            }

            return fetchDepositAddress;
        }()
    }, {
        key: 'getCurrencyName',
        value: function getCurrencyName(currency) {
            if (currency == 'ETH') return 'Ether';
            if (currency == 'BTC') return 'Bitcoin';
        }
    }, {
        key: 'withdraw',
        value: function () {
            var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(currency, amount, address) {
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var request, method, response;
                return regeneratorRuntime.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                _context8.next = 2;
                                return this.loadMarkets();

                            case 2:
                                request = {
                                    'amount': amount,
                                    'address': address
                                };
                                method = 'privatePost' + this.getCurrencyName(currency) + 'Withdrawal';
                                _context8.next = 6;
                                return this[method](this.extend(request, params));

                            case 6:
                                response = _context8.sent;
                                return _context8.abrupt('return', {
                                    'info': response,
                                    'id': undefined
                                });

                            case 8:
                            case 'end':
                                return _context8.stop();
                        }
                    }
                }, _callee8, this);
            }));

            function withdraw(_x22, _x23, _x24) {
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

            var url = this.urls['api'] + '/' + this.version + '/' + path;
            if (api == 'public') {
                url += '?' + this.urlencode(params);
            } else {
                this.checkRequiredCredentials();
                var nonce = this.nonce();
                var request = [nonce.toString(), this.uid, this.apiKey].join('');
                var signature = this.hmac(this.encode(request), this.encode(this.secret));
                var query = this.extend({
                    'key': this.apiKey,
                    'nonce': nonce,
                    'signature': signature
                }, params);
                body = this.json(query);
                headers = {
                    'Content-Type': 'application/json'
                };
            }
            return { 'url': url, 'method': method, 'body': body, 'headers': headers };
        }
    }, {
        key: 'request',
        value: function () {
            var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(path) {
                var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
                var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;
                var response;
                return regeneratorRuntime.wrap(function _callee9$(_context9) {
                    while (1) {
                        switch (_context9.prev = _context9.next) {
                            case 0:
                                _context9.next = 2;
                                return this.fetch2(path, api, method, params, headers, body);

                            case 2:
                                response = _context9.sent;

                                if (!(typeof response == 'string')) {
                                    _context9.next = 5;
                                    break;
                                }

                                return _context9.abrupt('return', response);

                            case 5:
                                if (!('error' in response)) {
                                    _context9.next = 7;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' ' + this.json(response));

                            case 7:
                                return _context9.abrupt('return', response);

                            case 8:
                            case 'end':
                                return _context9.stop();
                        }
                    }
                }, _callee9, this);
            }));

            function request(_x35) {
                return _ref9.apply(this, arguments);
            }

            return request;
        }()
    }]);

    return quadrigacx;
}(Exchange);