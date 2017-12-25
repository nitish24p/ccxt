"use strict";

// ---------------------------------------------------------------------------

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Exchange = require('./base/Exchange');

// ---------------------------------------------------------------------------

module.exports = function (_Exchange) {
    _inherits(vaultoro, _Exchange);

    function vaultoro() {
        _classCallCheck(this, vaultoro);

        return _possibleConstructorReturn(this, (vaultoro.__proto__ || Object.getPrototypeOf(vaultoro)).apply(this, arguments));
    }

    _createClass(vaultoro, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend(_get(vaultoro.prototype.__proto__ || Object.getPrototypeOf(vaultoro.prototype), 'describe', this).call(this), {
                'id': 'vaultoro',
                'name': 'Vaultoro',
                'countries': 'CH',
                'rateLimit': 1000,
                'version': '1',
                'hasCORS': true,
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/27766880-f205e870-5ee9-11e7-8fe2-0d5b15880752.jpg',
                    'api': 'https://api.vaultoro.com',
                    'www': 'https://www.vaultoro.com',
                    'doc': 'https://api.vaultoro.com'
                },
                'api': {
                    'public': {
                        'get': ['bidandask', 'buyorders', 'latest', 'latesttrades', 'markets', 'orderbook', 'sellorders', 'transactions/day', 'transactions/hour', 'transactions/month']
                    },
                    'private': {
                        'get': ['balance', 'mytrades', 'orders'],
                        'post': ['buy/{symbol}/{type}', 'cancel/{id}', 'sell/{symbol}/{type}', 'withdraw']
                    }
                }
            });
        }
    }, {
        key: 'fetchMarkets',
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                var result, markets, market, base, quote, symbol, baseId, quoteId, id;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                result = [];
                                _context.next = 3;
                                return this.publicGetMarkets();

                            case 3:
                                markets = _context.sent;
                                market = markets['data'];
                                base = market['BaseCurrency'];
                                quote = market['MarketCurrency'];
                                symbol = base + '/' + quote;
                                baseId = base;
                                quoteId = quote;
                                id = market['MarketName'];

                                result.push({
                                    'id': id,
                                    'symbol': symbol,
                                    'base': base,
                                    'quote': quote,
                                    'baseId': baseId,
                                    'quoteId': quoteId,
                                    'info': market
                                });
                                return _context.abrupt('return', result);

                            case 13:
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
                var response, balances, result, b, balance, currency, uppercase, free, used, total, account;
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
                                balances = response['data'];
                                result = { 'info': balances };

                                for (b = 0; b < balances.length; b++) {
                                    balance = balances[b];
                                    currency = balance['currency_code'];
                                    uppercase = currency.toUpperCase();
                                    free = balance['cash'];
                                    used = balance['reserved'];
                                    total = this.sum(free, used);
                                    account = {
                                        'free': free,
                                        'used': used,
                                        'total': total
                                    };

                                    result[uppercase] = account;
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
                var response, orderbook, result;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context3.next = 4;
                                return this.publicGetOrderbook(params);

                            case 4:
                                response = _context3.sent;
                                orderbook = {
                                    'bids': response['data'][0]['b'],
                                    'asks': response['data'][1]['s']
                                };
                                result = this.parseOrderBook(orderbook, undefined, 'bids', 'asks', 'Gold_Price', 'Gold_Amount');

                                result['bids'] = this.sortBy(result['bids'], 0, true);
                                return _context3.abrupt('return', result);

                            case 9:
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
                var quote, bidsLength, bid, ask, response, ticker, timestamp;
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context4.next = 4;
                                return this.publicGetBidandask(params);

                            case 4:
                                quote = _context4.sent;
                                bidsLength = quote['bids'].length;
                                bid = quote['bids'][bidsLength - 1];
                                ask = quote['asks'][0];
                                _context4.next = 10;
                                return this.publicGetMarkets(params);

                            case 10:
                                response = _context4.sent;
                                ticker = response['data'];
                                timestamp = this.milliseconds();
                                return _context4.abrupt('return', {
                                    'symbol': symbol,
                                    'timestamp': timestamp,
                                    'datetime': this.iso8601(timestamp),
                                    'high': parseFloat(ticker['24hHigh']),
                                    'low': parseFloat(ticker['24hLow']),
                                    'bid': bid[0],
                                    'ask': ask[0],
                                    'vwap': undefined,
                                    'open': undefined,
                                    'close': undefined,
                                    'first': undefined,
                                    'last': parseFloat(ticker['LastPrice']),
                                    'change': undefined,
                                    'percentage': undefined,
                                    'average': undefined,
                                    'baseVolume': undefined,
                                    'quoteVolume': parseFloat(ticker['24hVolume']),
                                    'info': ticker
                                });

                            case 14:
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
            var timestamp = this.parse8601(trade['Time']);
            return {
                'id': undefined,
                'info': trade,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'symbol': market['symbol'],
                'order': undefined,
                'type': undefined,
                'side': undefined,
                'price': trade['Gold_Price'],
                'amount': trade['Gold_Amount']
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
                                return this.publicGetTransactionsDay(params);

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
                var market, method, response;
                return regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                _context6.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                method = 'privatePost' + this.capitalize(side) + 'SymbolType';
                                _context6.next = 6;
                                return this[method](this.extend({
                                    'symbol': market['quoteId'].toLowerCase(),
                                    'type': type,
                                    'gld': amount,
                                    'price': price || 1
                                }, params));

                            case 6:
                                response = _context6.sent;
                                return _context6.abrupt('return', {
                                    'info': response,
                                    'id': response['data']['Order_ID']
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
                                _context7.next = 4;
                                return this.privatePostCancelId(this.extend({
                                    'id': id
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

            var url = this.urls['api'] + '/';
            if (api == 'public') {
                url += path;
            } else {
                this.checkRequiredCredentials();
                var nonce = this.nonce();
                url += this.version + '/' + this.implodeParams(path, params);
                var query = this.extend({
                    'nonce': nonce,
                    'apikey': this.apiKey
                }, this.omit(params, this.extractParams(path)));
                url += '?' + this.urlencode(query);
                headers = {
                    'Content-Type': 'application/json',
                    'X-Signature': this.hmac(this.encode(url), this.encode(this.secret))
                };
            }
            return { 'url': url, 'method': method, 'body': body, 'headers': headers };
        }
    }]);

    return vaultoro;
}(Exchange);