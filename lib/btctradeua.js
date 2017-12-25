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
    ExchangeError = _require.ExchangeError;

//  ---------------------------------------------------------------------------

module.exports = function (_Exchange) {
    _inherits(btctradeua, _Exchange);

    function btctradeua() {
        _classCallCheck(this, btctradeua);

        return _possibleConstructorReturn(this, (btctradeua.__proto__ || Object.getPrototypeOf(btctradeua)).apply(this, arguments));
    }

    _createClass(btctradeua, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend(_get(btctradeua.prototype.__proto__ || Object.getPrototypeOf(btctradeua.prototype), 'describe', this).call(this), {
                'id': 'btctradeua',
                'name': 'BTC Trade UA',
                'countries': 'UA', // Ukraine,
                'rateLimit': 3000,
                'hasCORS': true,
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/27941483-79fc7350-62d9-11e7-9f61-ac47f28fcd96.jpg',
                    'api': 'https://btc-trade.com.ua/api',
                    'www': 'https://btc-trade.com.ua',
                    'doc': 'https://docs.google.com/document/d/1ocYA0yMy_RXd561sfG3qEPZ80kyll36HUxvCRe5GbhE/edit'
                },
                'api': {
                    'public': {
                        'get': ['deals/{symbol}', 'trades/sell/{symbol}', 'trades/buy/{symbol}', 'japan_stat/high/{symbol}']
                    },
                    'private': {
                        'post': ['auth', 'ask/{symbol}', 'balance', 'bid/{symbol}', 'buy/{symbol}', 'my_orders/{symbol}', 'order/status/{id}', 'remove/order/{id}', 'sell/{symbol}']
                    }
                },
                'markets': {
                    'BTC/UAH': { 'id': 'btc_uah', 'symbol': 'BTC/UAH', 'base': 'BTC', 'quote': 'UAH', 'precision': { 'price': 1 }, 'limits': { 'amount': { 'min': 0.0000000001 } } },
                    'ETH/UAH': { 'id': 'eth_uah', 'symbol': 'ETH/UAH', 'base': 'ETH', 'quote': 'UAH' },
                    'LTC/UAH': { 'id': 'ltc_uah', 'symbol': 'LTC/UAH', 'base': 'LTC', 'quote': 'UAH' },
                    'DOGE/UAH': { 'id': 'doge_uah', 'symbol': 'DOGE/UAH', 'base': 'DOGE', 'quote': 'UAH' },
                    'DASH/UAH': { 'id': 'dash_uah', 'symbol': 'DASH/UAH', 'base': 'DASH', 'quote': 'UAH' },
                    'SIB/UAH': { 'id': 'sib_uah', 'symbol': 'SIB/UAH', 'base': 'SIB', 'quote': 'UAH' },
                    'KRB/UAH': { 'id': 'krb_uah', 'symbol': 'KRB/UAH', 'base': 'KRB', 'quote': 'UAH' },
                    'NVC/UAH': { 'id': 'nvc_uah', 'symbol': 'NVC/UAH', 'base': 'NVC', 'quote': 'UAH' },
                    'LTC/BTC': { 'id': 'ltc_btc', 'symbol': 'LTC/BTC', 'base': 'LTC', 'quote': 'BTC' },
                    'NVC/BTC': { 'id': 'nvc_btc', 'symbol': 'NVC/BTC', 'base': 'NVC', 'quote': 'BTC' },
                    'ITI/UAH': { 'id': 'iti_uah', 'symbol': 'ITI/UAH', 'base': 'ITI', 'quote': 'UAH' },
                    'DOGE/BTC': { 'id': 'doge_btc', 'symbol': 'DOGE/BTC', 'base': 'DOGE', 'quote': 'BTC' },
                    'DASH/BTC': { 'id': 'dash_btc', 'symbol': 'DASH/BTC', 'base': 'DASH', 'quote': 'BTC' }
                },
                'fees': {
                    'trading': {
                        'maker': 0.1 / 100,
                        'taker': 0.1 / 100
                    }
                }
            });
        }
    }, {
        key: 'signIn',
        value: function signIn() {
            return this.privatePostAuth();
        }
    }, {
        key: 'fetchBalance',
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var response, result, accounts, b, account, currency, balance;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.privatePostBalance();

                            case 2:
                                response = _context.sent;
                                result = { 'info': response };

                                if ('accounts' in response) {
                                    accounts = response['accounts'];

                                    for (b = 0; b < accounts.length; b++) {
                                        account = accounts[b];
                                        currency = account['currency'];
                                        balance = parseFloat(account['balance']);

                                        result[currency] = {
                                            'free': balance,
                                            'used': 0.0,
                                            'total': balance
                                        };
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
            var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var market, bids, asks, orderbook;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                market = this.market(symbol);
                                _context2.next = 3;
                                return this.publicGetTradesBuySymbol(this.extend({
                                    'symbol': market['id']
                                }, params));

                            case 3:
                                bids = _context2.sent;
                                _context2.next = 6;
                                return this.publicGetTradesSellSymbol(this.extend({
                                    'symbol': market['id']
                                }, params));

                            case 6:
                                asks = _context2.sent;
                                orderbook = {
                                    'bids': [],
                                    'asks': []
                                };

                                if (bids) {
                                    if ('list' in bids) orderbook['bids'] = bids['list'];
                                }
                                if (asks) {
                                    if ('list' in asks) orderbook['asks'] = asks['list'];
                                }
                                return _context2.abrupt('return', this.parseOrderBook(orderbook, undefined, 'bids', 'asks', 'price', 'currency_trade'));

                            case 11:
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
                var response, orderbook, bid, numBids, ask, numAsks, ticker, timestamp, result, tickerLength, start, t, candle, last;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return this.publicGetJapanStatHighSymbol(this.extend({
                                    'symbol': this.marketId(symbol)
                                }, params));

                            case 2:
                                response = _context3.sent;
                                _context3.next = 5;
                                return this.fetchOrderBook(symbol);

                            case 5:
                                orderbook = _context3.sent;
                                bid = undefined;
                                numBids = orderbook['bids'].length;

                                if (numBids > 0) bid = orderbook['bids'][0][0];
                                ask = undefined;
                                numAsks = orderbook['asks'].length;

                                if (numAsks > 0) ask = orderbook['asks'][0][0];
                                ticker = response['trades'];
                                timestamp = this.milliseconds();
                                result = {
                                    'symbol': symbol,
                                    'timestamp': timestamp,
                                    'datetime': this.iso8601(timestamp),
                                    'high': undefined,
                                    'low': undefined,
                                    'bid': bid,
                                    'ask': ask,
                                    'vwap': undefined,
                                    'open': undefined,
                                    'close': undefined,
                                    'first': undefined,
                                    'last': undefined,
                                    'change': undefined,
                                    'percentage': undefined,
                                    'average': undefined,
                                    'baseVolume': undefined,
                                    'quoteVolume': undefined,
                                    'info': ticker
                                };
                                tickerLength = ticker.length;

                                if (tickerLength > 0) {
                                    start = Math.max(tickerLength - 48, 0);

                                    for (t = start; t < ticker.length; t++) {
                                        candle = ticker[t];

                                        if (typeof result['open'] == 'undefined') result['open'] = candle[1];
                                        if (typeof result['high'] == 'undefined' || result['high'] < candle[2]) result['high'] = candle[2];
                                        if (typeof result['low'] == 'undefined' || result['low'] > candle[3]) result['low'] = candle[3];
                                        if (typeof result['baseVolume'] == 'undefined') result['baseVolume'] = -candle[5];else result['baseVolume'] -= candle[5];
                                    }
                                    last = tickerLength - 1;

                                    result['close'] = ticker[last][4];
                                    result['baseVolume'] = -1 * result['baseVolume'];
                                }
                                return _context3.abrupt('return', result);

                            case 18:
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
        key: 'convertCyrillicMonthNameToString',
        value: function convertCyrillicMonthNameToString(cyrillic) {
            var months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
            var month = undefined;
            for (var i = 0; i < months.length; i++) {
                if (cyrillic == months[i]) {
                    month = i + 1;
                    month = month.toString();
                    if (i < 9) month = '0' + month;
                }
            }
            return month;
        }
    }, {
        key: 'parseCyrillicDatetime',
        value: function parseCyrillicDatetime(cyrillic) {
            var parts = cyrillic.split(' ');
            var day = parts[0];
            var month = this.convertCyrillicMonthNameToString(parts[1]);
            if (!month) throw new ExchangeError(this.id + ' parseTrade() undefined month name: ' + cyrillic);
            var year = parts[2];
            var hms = parts[4];
            var hmsLength = hms.length;
            if (hmsLength == 7) {
                hms = '0' + hms;
            }
            var ymd = [year, month, day].join('-');
            var ymdhms = ymd + 'T' + hms;
            var timestamp = this.parse8601(ymdhms);
            timestamp = timestamp - 10800000; // server reports local GMT+3 time, adjust to UTC
            return timestamp;
        }
    }, {
        key: 'parseTrade',
        value: function parseTrade(trade, market) {
            var timestamp = this.parseCyrillicDatetime(trade['pub_date']);
            return {
                'id': trade['id'].toString(),
                'info': trade,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'symbol': market['symbol'],
                'type': undefined,
                'side': undefined,
                'price': parseFloat(trade['price']),
                'amount': parseFloat(trade['amnt_trade'])
            };
        }
    }, {
        key: 'fetchTrades',
        value: function () {
            var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(symbol) {
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var market, response, trades, i;
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                market = this.market(symbol);
                                _context4.next = 3;
                                return this.publicGetDealsSymbol(this.extend({
                                    'symbol': market['id']
                                }, params));

                            case 3:
                                response = _context4.sent;
                                trades = [];

                                for (i = 0; i < response.length; i++) {
                                    if (response[i]['id'] % 2) {
                                        trades.push(response[i]);
                                    }
                                }
                                return _context4.abrupt('return', this.parseTrades(trades, market, since, limit));

                            case 7:
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
                var market, method, order;
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                if (!(type == 'market')) {
                                    _context5.next = 2;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' allows limit orders only');

                            case 2:
                                market = this.market(symbol);
                                method = 'privatePost' + this.capitalize(side) + 'Id';
                                order = {
                                    'count': amount,
                                    'currency1': market['quote'],
                                    'currency': market['base'],
                                    'price': price
                                };
                                return _context5.abrupt('return', this[method](this.extend(order, params)));

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
            var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(id) {
                var symbol = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
                return regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                _context6.next = 2;
                                return this.privatePostRemoveOrderId({ 'id': id });

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
        key: 'parseOrder',
        value: function parseOrder(trade, market) {
            var timestamp = this.milliseconds;
            return {
                'id': trade['id'],
                'timestamp': timestamp, // until they fix their timestamp
                'datetime': this.iso8601(timestamp),
                'status': 'open',
                'symbol': market['symbol'],
                'type': undefined,
                'side': trade['type'],
                'price': trade['price'],
                'amount': trade['amnt_trade'],
                'filled': 0,
                'remaining': trade['amnt_trade'],
                'trades': undefined,
                'info': trade
            };
        }
    }, {
        key: 'fetchOpenOrders',
        value: function () {
            var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
                var symbol = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var market, response, orders;
                return regeneratorRuntime.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                if (symbol) {
                                    _context7.next = 2;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' fetchOpenOrders requires a symbol param');

                            case 2:
                                market = this.market(symbol);
                                _context7.next = 5;
                                return this.privatePostMyOrdersSymbol(this.extend({
                                    'symbol': market['id']
                                }, params));

                            case 5:
                                response = _context7.sent;
                                orders = response['your_open_orders'];
                                return _context7.abrupt('return', this.parseOrders(orders, market, since, limit));

                            case 8:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function fetchOpenOrders() {
                return _ref7.apply(this, arguments);
            }

            return fetchOpenOrders;
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

            var url = this.urls['api'] + '/' + this.implodeParams(path, params);
            var query = this.omit(params, this.extractParams(path));
            if (api == 'public') {
                if (Object.keys(query).length) url += this.implodeParams(path, query);
            } else {
                this.checkRequiredCredentials();
                var nonce = this.nonce();
                body = this.urlencode(this.extend({
                    'out_order_id': nonce,
                    'nonce': nonce
                }, query));
                var auth = body + this.secret;
                headers = {
                    'public-key': this.apiKey,
                    'api-sign': this.hash(this.encode(auth), 'sha256'),
                    'Content-Type': 'application/x-www-form-urlencoded'
                };
            }
            return { 'url': url, 'method': method, 'body': body, 'headers': headers };
        }
    }]);

    return btctradeua;
}(Exchange);