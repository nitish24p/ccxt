"use strict";

// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------

module.exports = function (_Exchange) {
    _inherits(_1broker, _Exchange);

    function _1broker() {
        _classCallCheck(this, _1broker);

        return _possibleConstructorReturn(this, (_1broker.__proto__ || Object.getPrototypeOf(_1broker)).apply(this, arguments));
    }

    _createClass(_1broker, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend(_get(_1broker.prototype.__proto__ || Object.getPrototypeOf(_1broker.prototype), 'describe', this).call(this), {
                'id': '_1broker',
                'name': '1Broker',
                'countries': 'US',
                'rateLimit': 1500,
                'version': 'v2',
                'hasPublicAPI': false,
                'hasCORS': true,
                'hasFetchTrades': false,
                'hasFetchOHLCV': true,
                'timeframes': {
                    '1m': '60',
                    '15m': '900',
                    '1h': '3600',
                    '1d': '86400'
                },
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/27766021-420bd9fc-5ecb-11e7-8ed6-56d0081efed2.jpg',
                    'api': 'https://1broker.com/api',
                    'www': 'https://1broker.com',
                    'doc': 'https://1broker.com/?c=en/content/api-documentation'
                },
                'requiredCredentials': {
                    'apiKey': true,
                    'secret': false
                },
                'api': {
                    'private': {
                        'get': ['market/bars', 'market/categories', 'market/details', 'market/list', 'market/quotes', 'market/ticks', 'order/cancel', 'order/create', 'order/open', 'position/close', 'position/close_cancel', 'position/edit', 'position/history', 'position/open', 'position/shared/get', 'social/profile_statistics', 'social/profile_trades', 'user/bitcoin_deposit_address', 'user/details', 'user/overview', 'user/quota_status', 'user/transaction_log']
                    }
                }
            });
        }
    }, {
        key: 'fetchCategories',
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                var response, categories, result, i;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.privateGetMarketCategories();

                            case 2:
                                response = _context.sent;

                                // they return an empty string among their categories, wtf?
                                categories = response['response'];
                                result = [];

                                for (i = 0; i < categories.length; i++) {
                                    if (categories[i]) result.push(categories[i]);
                                }
                                return _context.abrupt('return', result);

                            case 7:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function fetchCategories() {
                return _ref.apply(this, arguments);
            }

            return fetchCategories;
        }()
    }, {
        key: 'fetchMarkets',
        value: function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
                var this_, categories, result, c, category, markets, p, market, id, symbol, base, quote, parts;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                this_ = this; // workaround for Babel bug (not passing `this` to _recursive() call)

                                _context2.next = 3;
                                return this.fetchCategories();

                            case 3:
                                categories = _context2.sent;
                                result = [];
                                c = 0;

                            case 6:
                                if (!(c < categories.length)) {
                                    _context2.next = 15;
                                    break;
                                }

                                category = categories[c];
                                _context2.next = 10;
                                return this_.privateGetMarketList({
                                    'category': category.toLowerCase()
                                });

                            case 10:
                                markets = _context2.sent;

                                for (p = 0; p < markets['response'].length; p++) {
                                    market = markets['response'][p];
                                    id = market['symbol'];
                                    symbol = undefined;
                                    base = undefined;
                                    quote = undefined;

                                    if (category == 'FOREX' || category == 'CRYPTO') {
                                        symbol = market['name'];
                                        parts = symbol.split('/');

                                        base = parts[0];
                                        quote = parts[1];
                                    } else {
                                        base = id;
                                        quote = 'USD';
                                        symbol = base + '/' + quote;
                                    }
                                    base = this_.commonCurrencyCode(base);
                                    quote = this_.commonCurrencyCode(quote);
                                    result.push({
                                        'id': id,
                                        'symbol': symbol,
                                        'base': base,
                                        'quote': quote,
                                        'info': market
                                    });
                                }

                            case 12:
                                c++;
                                _context2.next = 6;
                                break;

                            case 15:
                                return _context2.abrupt('return', result);

                            case 16:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function fetchMarkets() {
                return _ref2.apply(this, arguments);
            }

            return fetchMarkets;
        }()
    }, {
        key: 'fetchBalance',
        value: function () {
            var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
                var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var balance, response, result, currencies, c, currency, total;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context3.next = 4;
                                return this.privateGetUserOverview();

                            case 4:
                                balance = _context3.sent;
                                response = balance['response'];
                                result = {
                                    'info': response
                                };
                                currencies = Object.keys(this.currencies);

                                for (c = 0; c < currencies.length; c++) {
                                    currency = currencies[c];

                                    result[currency] = this.account();
                                }
                                total = parseFloat(response['balance']);

                                result['BTC']['free'] = total;
                                result['BTC']['total'] = total;
                                return _context3.abrupt('return', this.parseBalance(result));

                            case 13:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function fetchBalance() {
                return _ref3.apply(this, arguments);
            }

            return fetchBalance;
        }()
    }, {
        key: 'fetchOrderBook',
        value: function () {
            var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var response, orderbook, timestamp, bidPrice, askPrice, bid, ask;
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context4.next = 4;
                                return this.privateGetMarketQuotes(this.extend({
                                    'symbols': this.marketId(symbol)
                                }, params));

                            case 4:
                                response = _context4.sent;
                                orderbook = response['response'][0];
                                timestamp = this.parse8601(orderbook['updated']);
                                bidPrice = parseFloat(orderbook['bid']);
                                askPrice = parseFloat(orderbook['ask']);
                                bid = [bidPrice, undefined];
                                ask = [askPrice, undefined];
                                return _context4.abrupt('return', {
                                    'timestamp': timestamp,
                                    'datetime': this.iso8601(timestamp),
                                    'bids': [bid],
                                    'asks': [ask]
                                });

                            case 12:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function fetchOrderBook(_x3) {
                return _ref4.apply(this, arguments);
            }

            return fetchOrderBook;
        }()
    }, {
        key: 'fetchTrades',
        value: function () {
            var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(symbol) {
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                throw new ExchangeError(this.id + ' fetchTrades () method not implemented yet');

                            case 1:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function fetchTrades(_x4) {
                return _ref5.apply(this, arguments);
            }

            return fetchTrades;
        }()
    }, {
        key: 'fetchTicker',
        value: function () {
            var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var result, orderbook, ticker, timestamp;
                return regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                _context6.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context6.next = 4;
                                return this.privateGetMarketBars(this.extend({
                                    'symbol': this.marketId(symbol),
                                    'resolution': 60,
                                    'limit': 1
                                }, params));

                            case 4:
                                result = _context6.sent;
                                _context6.next = 7;
                                return this.fetchOrderBook(symbol);

                            case 7:
                                orderbook = _context6.sent;
                                ticker = result['response'][0];
                                timestamp = this.parse8601(ticker['date']);
                                return _context6.abrupt('return', {
                                    'symbol': symbol,
                                    'timestamp': timestamp,
                                    'datetime': this.iso8601(timestamp),
                                    'high': parseFloat(ticker['h']),
                                    'low': parseFloat(ticker['l']),
                                    'bid': orderbook['bids'][0][0],
                                    'ask': orderbook['asks'][0][0],
                                    'vwap': undefined,
                                    'open': parseFloat(ticker['o']),
                                    'close': parseFloat(ticker['c']),
                                    'first': undefined,
                                    'last': undefined,
                                    'change': undefined,
                                    'percentage': undefined,
                                    'average': undefined,
                                    'baseVolume': undefined,
                                    'quoteVolume': undefined,
                                    'info': ticker
                                });

                            case 11:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function fetchTicker(_x6) {
                return _ref6.apply(this, arguments);
            }

            return fetchTicker;
        }()
    }, {
        key: 'parseOHLCV',
        value: function parseOHLCV(ohlcv) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
            var timeframe = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '1m';
            var since = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
            var limit = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;

            return [this.parse8601(ohlcv['date']), parseFloat(ohlcv['o']), parseFloat(ohlcv['h']), parseFloat(ohlcv['l']), parseFloat(ohlcv['c']), undefined];
        }
    }, {
        key: 'fetchOHLCV',
        value: function () {
            var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(symbol) {
                var timeframe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '1m';
                var since = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var limit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
                var params = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
                var market, request, result;
                return regeneratorRuntime.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                _context7.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                request = {
                                    'symbol': market['id'],
                                    'resolution': this.timeframes[timeframe]
                                };

                                if (since) request['date_start'] = this.iso8601(since); // they also support date_end
                                if (limit) request['limit'] = limit;
                                _context7.next = 8;
                                return this.privateGetMarketBars(this.extend(request, params));

                            case 8:
                                result = _context7.sent;
                                return _context7.abrupt('return', this.parseOHLCVs(result['response'], market, timeframe, since, limit));

                            case 10:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function fetchOHLCV(_x15) {
                return _ref7.apply(this, arguments);
            }

            return fetchOHLCV;
        }()
    }, {
        key: 'createOrder',
        value: function () {
            var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(symbol, type, side, amount) {
                var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
                var order, result;
                return regeneratorRuntime.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                _context8.next = 2;
                                return this.loadMarkets();

                            case 2:
                                order = {
                                    'symbol': this.marketId(symbol),
                                    'margin': amount,
                                    'direction': side == 'sell' ? 'short' : 'long',
                                    'leverage': 1,
                                    'type': side
                                };

                                if (type == 'limit') order['price'] = price;else order['type'] += '_market';
                                _context8.next = 6;
                                return this.privateGetOrderCreate(this.extend(order, params));

                            case 6:
                                result = _context8.sent;
                                return _context8.abrupt('return', {
                                    'info': result,
                                    'id': result['response']['order_id']
                                });

                            case 8:
                            case 'end':
                                return _context8.stop();
                        }
                    }
                }, _callee8, this);
            }));

            function createOrder(_x18, _x19, _x20, _x21) {
                return _ref8.apply(this, arguments);
            }

            return createOrder;
        }()
    }, {
        key: 'cancelOrder',
        value: function () {
            var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(id) {
                var symbol = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
                return regeneratorRuntime.wrap(function _callee9$(_context9) {
                    while (1) {
                        switch (_context9.prev = _context9.next) {
                            case 0:
                                _context9.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context9.next = 4;
                                return this.privatePostOrderCancel({ 'order_id': id });

                            case 4:
                                return _context9.abrupt('return', _context9.sent);

                            case 5:
                            case 'end':
                                return _context9.stop();
                        }
                    }
                }, _callee9, this);
            }));

            function cancelOrder(_x24) {
                return _ref9.apply(this, arguments);
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

            this.checkRequiredCredentials();
            var url = this.urls['api'] + '/' + this.version + '/' + path + '.php';
            var query = this.extend({ 'token': this.apiKey }, params);
            url += '?' + this.urlencode(query);
            return { 'url': url, 'method': method, 'body': body, 'headers': headers };
        }
    }, {
        key: 'request',
        value: function () {
            var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(path) {
                var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
                var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;
                var response;
                return regeneratorRuntime.wrap(function _callee10$(_context10) {
                    while (1) {
                        switch (_context10.prev = _context10.next) {
                            case 0:
                                _context10.next = 2;
                                return this.fetch2(path, api, method, params, headers, body);

                            case 2:
                                response = _context10.sent;

                                if (!('warning' in response)) {
                                    _context10.next = 6;
                                    break;
                                }

                                if (!response['warning']) {
                                    _context10.next = 6;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' ' + this.json(response));

                            case 6:
                                if (!('error' in response)) {
                                    _context10.next = 9;
                                    break;
                                }

                                if (!response['error']) {
                                    _context10.next = 9;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' ' + this.json(response));

                            case 9:
                                return _context10.abrupt('return', response);

                            case 10:
                            case 'end':
                                return _context10.stop();
                        }
                    }
                }, _callee10, this);
            }));

            function request(_x35) {
                return _ref10.apply(this, arguments);
            }

            return request;
        }()
    }]);

    return _1broker;
}(Exchange);