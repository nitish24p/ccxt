"use strict";

//  ---------------------------------------------------------------------------

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _log = require('babel-runtime/core-js/math/log10');

var _log2 = _interopRequireDefault(_log);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

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
    ExchangeError = _require.ExchangeError,
    AuthenticationError = _require.AuthenticationError;

//  ---------------------------------------------------------------------------

module.exports = function (_Exchange) {
    (0, _inherits3.default)(cex, _Exchange);

    function cex() {
        (0, _classCallCheck3.default)(this, cex);
        return (0, _possibleConstructorReturn3.default)(this, (cex.__proto__ || (0, _getPrototypeOf2.default)(cex)).apply(this, arguments));
    }

    (0, _createClass3.default)(cex, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend((0, _get3.default)(cex.prototype.__proto__ || (0, _getPrototypeOf2.default)(cex.prototype), 'describe', this).call(this), {
                'id': 'cex',
                'name': 'CEX.IO',
                'countries': ['GB', 'EU', 'CY', 'RU'],
                'rateLimit': 1500,
                'hasCORS': true,
                'hasFetchTickers': true,
                'hasFetchOHLCV': true,
                'hasFetchOpenOrders': true,
                'timeframes': {
                    '1m': '1m'
                },
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/27766442-8ddc33b0-5ed8-11e7-8b98-f786aef0f3c9.jpg',
                    'api': 'https://cex.io/api',
                    'www': 'https://cex.io',
                    'doc': 'https://cex.io/cex-api'
                },
                'requiredCredentials': {
                    'apiKey': true,
                    'secret': true,
                    'uid': true
                },
                'api': {
                    'public': {
                        'get': ['currency_limits/', 'last_price/{pair}/', 'last_prices/{currencies}/', 'ohlcv/hd/{yyyymmdd}/{pair}', 'order_book/{pair}/', 'ticker/{pair}/', 'tickers/{currencies}/', 'trade_history/{pair}/'],
                        'post': ['convert/{pair}', 'price_stats/{pair}']
                    },
                    'private': {
                        'post': ['active_orders_status/', 'archived_orders/{pair}/', 'balance/', 'cancel_order/', 'cancel_orders/{pair}/', 'cancel_replace_order/{pair}/', 'close_position/{pair}/', 'get_address/', 'get_myfee/', 'get_order/', 'get_order_tx/', 'open_orders/{pair}/', 'open_orders/', 'open_position/{pair}/', 'open_positions/{pair}/', 'place_order/{pair}/']
                    }
                },
                'fees': {
                    'trading': {
                        'maker': 0,
                        'taker': 0.2 / 100
                    }
                }
            });
        }
    }, {
        key: 'fetchMarkets',
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                var markets, result, p, market, id, symbol, _symbol$split, _symbol$split2, base, quote;

                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.publicGetCurrencyLimits();

                            case 2:
                                markets = _context.sent;
                                result = [];

                                for (p = 0; p < markets['data']['pairs'].length; p++) {
                                    market = markets['data']['pairs'][p];
                                    id = market['symbol1'] + '/' + market['symbol2'];
                                    symbol = id;
                                    _symbol$split = symbol.split('/'), _symbol$split2 = (0, _slicedToArray3.default)(_symbol$split, 2), base = _symbol$split2[0], quote = _symbol$split2[1];

                                    result.push({
                                        'id': id,
                                        'info': market,
                                        'symbol': symbol,
                                        'base': base,
                                        'quote': quote,
                                        'precision': {
                                            'price': this.precisionFromString(market['minPrice']),
                                            'amount': -1 * (0, _log2.default)(market['minLotSize'])
                                        },
                                        'limits': {
                                            'amount': {
                                                'min': market['minLotSize'],
                                                'max': market['maxLotSize']
                                            },
                                            'price': {
                                                'min': parseFloat(market['minPrice']),
                                                'max': parseFloat(market['maxPrice'])
                                            },
                                            'cost': {
                                                'min': market['minLotSizeS2'],
                                                'max': undefined
                                            }
                                        }
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
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
                var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var response, result, ommited, balances, currencies, i, currency, account;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context2.next = 4;
                                return this.privatePostBalance();

                            case 4:
                                response = _context2.sent;
                                result = { 'info': response };
                                ommited = ['username', 'timestamp'];
                                balances = this.omit(response, ommited);
                                currencies = (0, _keys2.default)(balances);

                                for (i = 0; i < currencies.length; i++) {
                                    currency = currencies[i];

                                    if (currency in balances) {
                                        account = {
                                            'free': this.safeFloat(balances[currency], 'available', 0.0),
                                            'used': this.safeFloat(balances[currency], 'orders', 0.0),
                                            'total': 0.0
                                        };

                                        account['total'] = this.sum(account['free'], account['used']);
                                        result[currency] = account;
                                    }
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
            var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var orderbook, timestamp;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context3.next = 4;
                                return this.publicGetOrderBookPair(this.extend({
                                    'pair': this.marketId(symbol)
                                }, params));

                            case 4:
                                orderbook = _context3.sent;
                                timestamp = orderbook['timestamp'] * 1000;
                                return _context3.abrupt('return', this.parseOrderBook(orderbook, timestamp));

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
        key: 'parseOHLCV',
        value: function parseOHLCV(ohlcv) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
            var timeframe = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '1m';
            var since = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
            var limit = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;

            return [ohlcv[0] * 1000, ohlcv[1], ohlcv[2], ohlcv[3], ohlcv[4], ohlcv[5]];
        }
    }, {
        key: 'fetchOHLCV',
        value: function () {
            var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(symbol) {
                var timeframe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '1m';
                var since = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var limit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
                var params = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
                var market, ymd, request, response, key, ohlcvs;
                return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);

                                if (!since) since = this.milliseconds() - 86400000; // yesterday
                                ymd = this.Ymd(since);

                                ymd = ymd.split('-');
                                ymd = ymd.join('');
                                request = {
                                    'pair': market['id'],
                                    'yyyymmdd': ymd
                                };
                                _context4.next = 10;
                                return this.publicGetOhlcvHdYyyymmddPair(this.extend(request, params));

                            case 10:
                                response = _context4.sent;
                                key = 'data' + this.timeframes[timeframe];
                                ohlcvs = JSON.parse(response[key]);
                                return _context4.abrupt('return', this.parseOHLCVs(ohlcvs, market, timeframe, since, limit));

                            case 14:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function fetchOHLCV(_x12) {
                return _ref4.apply(this, arguments);
            }

            return fetchOHLCV;
        }()
    }, {
        key: 'parseTicker',
        value: function parseTicker(ticker) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var timestamp = undefined;
            var iso8601 = undefined;
            if ('timestamp' in ticker) {
                timestamp = parseInt(ticker['timestamp']) * 1000;
                iso8601 = this.iso8601(timestamp);
            }
            var volume = this.safeFloat(ticker, 'volume');
            var high = this.safeFloat(ticker, 'high');
            var low = this.safeFloat(ticker, 'low');
            var bid = this.safeFloat(ticker, 'bid');
            var ask = this.safeFloat(ticker, 'ask');
            var last = this.safeFloat(ticker, 'last');
            var symbol = undefined;
            if (market) symbol = market['symbol'];
            return {
                'symbol': symbol,
                'timestamp': timestamp,
                'datetime': iso8601,
                'high': high,
                'low': low,
                'bid': bid,
                'ask': ask,
                'vwap': undefined,
                'open': undefined,
                'close': undefined,
                'first': undefined,
                'last': last,
                'change': undefined,
                'percentage': undefined,
                'average': undefined,
                'baseVolume': volume,
                'quoteVolume': undefined,
                'info': ticker
            };
        }
    }, {
        key: 'fetchTickers',
        value: function () {
            var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
                var symbols = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var currencies, response, tickers, result, t, ticker, symbol, market;
                return _regenerator2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.next = 2;
                                return this.loadMarkets();

                            case 2:
                                currencies = (0, _keys2.default)(this.currencies);
                                _context5.next = 5;
                                return this.publicGetTickersCurrencies(this.extend({
                                    'currencies': currencies.join('/')
                                }, params));

                            case 5:
                                response = _context5.sent;
                                tickers = response['data'];
                                result = {};

                                for (t = 0; t < tickers.length; t++) {
                                    ticker = tickers[t];
                                    symbol = ticker['pair'].replace(':', '/');
                                    market = this.markets[symbol];

                                    result[symbol] = this.parseTicker(ticker, market);
                                }
                                return _context5.abrupt('return', result);

                            case 10:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function fetchTickers() {
                return _ref5.apply(this, arguments);
            }

            return fetchTickers;
        }()
    }, {
        key: 'fetchTicker',
        value: function () {
            var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var market, ticker;
                return _regenerator2.default.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                _context6.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                _context6.next = 5;
                                return this.publicGetTickerPair(this.extend({
                                    'pair': market['id']
                                }, params));

                            case 5:
                                ticker = _context6.sent;
                                return _context6.abrupt('return', this.parseTicker(ticker, market));

                            case 7:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function fetchTicker(_x17) {
                return _ref6.apply(this, arguments);
            }

            return fetchTicker;
        }()
    }, {
        key: 'parseTrade',
        value: function parseTrade(trade) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var timestamp = parseInt(trade['date']) * 1000;
            return {
                'info': trade,
                'id': trade['tid'],
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'symbol': market['symbol'],
                'type': undefined,
                'side': trade['type'],
                'price': parseFloat(trade['price']),
                'amount': parseFloat(trade['amount'])
            };
        }
    }, {
        key: 'fetchTrades',
        value: function () {
            var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(symbol) {
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var market, response;
                return _regenerator2.default.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                _context7.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                _context7.next = 5;
                                return this.publicGetTradeHistoryPair(this.extend({
                                    'pair': market['id']
                                }, params));

                            case 5:
                                response = _context7.sent;
                                return _context7.abrupt('return', this.parseTrades(response, market, since, limit));

                            case 7:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function fetchTrades(_x22) {
                return _ref7.apply(this, arguments);
            }

            return fetchTrades;
        }()
    }, {
        key: 'createOrder',
        value: function () {
            var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8(symbol, type, side, amount) {
                var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
                var order, response;
                return _regenerator2.default.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                _context8.next = 2;
                                return this.loadMarkets();

                            case 2:
                                order = {
                                    'pair': this.marketId(symbol),
                                    'type': side,
                                    'amount': amount
                                };

                                if (!(type == 'limit')) {
                                    _context8.next = 7;
                                    break;
                                }

                                order['price'] = price;
                                _context8.next = 12;
                                break;

                            case 7:
                                if (!(side == 'buy')) {
                                    _context8.next = 11;
                                    break;
                                }

                                if (price) {
                                    _context8.next = 10;
                                    break;
                                }

                                throw new InvalidOrder('For market buy orders ' + this.id + " requires the amount of quote currency to spend, to calculate proper costs call createOrder (symbol, 'market', 'buy', amount, price)");

                            case 10:
                                order['amount'] = amount * price;

                            case 11:
                                order['order_type'] = type;

                            case 12:
                                _context8.next = 14;
                                return this.privatePostPlaceOrderPair(this.extend(order, params));

                            case 14:
                                response = _context8.sent;
                                return _context8.abrupt('return', {
                                    'info': response,
                                    'id': response['id']
                                });

                            case 16:
                            case 'end':
                                return _context8.stop();
                        }
                    }
                }, _callee8, this);
            }));

            function createOrder(_x25, _x26, _x27, _x28) {
                return _ref8.apply(this, arguments);
            }

            return createOrder;
        }()
    }, {
        key: 'cancelOrder',
        value: function () {
            var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9(id) {
                var symbol = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
                return _regenerator2.default.wrap(function _callee9$(_context9) {
                    while (1) {
                        switch (_context9.prev = _context9.next) {
                            case 0:
                                _context9.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context9.next = 4;
                                return this.privatePostCancelOrder({ 'id': id });

                            case 4:
                                return _context9.abrupt('return', _context9.sent);

                            case 5:
                            case 'end':
                                return _context9.stop();
                        }
                    }
                }, _callee9, this);
            }));

            function cancelOrder(_x31) {
                return _ref9.apply(this, arguments);
            }

            return cancelOrder;
        }()
    }, {
        key: 'parseOrder',
        value: function parseOrder(order) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var timestamp = parseInt(order['time']);
            var symbol = undefined;
            if (!market) {
                var _symbol = order['symbol1'] + '/' + order['symbol2'];
                if (_symbol in this.markets) market = this.market(_symbol);
            }
            var status = order['status'];
            if (status == 'a') {
                status = 'open'; // the unified status
            } else if (status == 'cd') {
                status = 'canceled';
            } else if (status == 'c') {
                status = 'canceled';
            } else if (status == 'd') {
                status = 'closed';
            }
            var price = this.safeFloat(order, 'price');
            var amount = this.safeFloat(order, 'amount');
            var remaining = this.safeFloat(order, 'pending');
            if (!remaining) remaining = this.safeFloat(order, 'remains');
            var filled = amount - remaining;
            var fee = undefined;
            var cost = undefined;
            if (market) {
                symbol = market['symbol'];
                cost = this.safeFloat(order, 'ta:' + market['quote']);
                var baseFee = 'fa:' + market['base'];
                var quoteFee = 'fa:' + market['quote'];
                var feeRate = this.safeFloat(order, 'tradingFeeMaker');
                if (!feeRate) feeRate = this.safeFloat(order, 'tradingFeeTaker', feeRate);
                if (feeRate) feeRate /= 100.0; // convert to mathematically-correct percentage coefficients: 1.0 = 100%
                if (baseFee in order) {
                    fee = {
                        'currency': market['base'],
                        'rate': feeRate,
                        'cost': this.safeFloat(order, baseFee)
                    };
                } else if (quoteFee in order) {
                    fee = {
                        'currency': market['quote'],
                        'rate': feeRate,
                        'cost': this.safeFloat(order, quoteFee)
                    };
                }
            }
            if (!cost) cost = price * filled;
            return {
                'id': order['id'],
                'datetime': this.iso8601(timestamp),
                'timestamp': timestamp,
                'status': status,
                'symbol': symbol,
                'type': undefined,
                'side': order['type'],
                'price': price,
                'cost': cost,
                'amount': amount,
                'filled': filled,
                'remaining': remaining,
                'trades': undefined,
                'fee': fee,
                'info': order
            };
        }
    }, {
        key: 'fetchOpenOrders',
        value: function () {
            var _ref10 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10() {
                var symbol = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var request, method, market, orders, i;
                return _regenerator2.default.wrap(function _callee10$(_context10) {
                    while (1) {
                        switch (_context10.prev = _context10.next) {
                            case 0:
                                _context10.next = 2;
                                return this.loadMarkets();

                            case 2:
                                request = {};
                                method = 'privatePostOpenOrders';
                                market = undefined;

                                if (symbol) {
                                    market = this.market(symbol);
                                    request['pair'] = market['id'];
                                    method += 'Pair';
                                }
                                _context10.next = 8;
                                return this[method](this.extend(request, params));

                            case 8:
                                orders = _context10.sent;

                                for (i = 0; i < orders.length; i++) {
                                    orders[i] = this.extend(orders[i], { 'status': 'open' });
                                }
                                return _context10.abrupt('return', this.parseOrders(orders, market, since, limit));

                            case 11:
                            case 'end':
                                return _context10.stop();
                        }
                    }
                }, _callee10, this);
            }));

            function fetchOpenOrders() {
                return _ref10.apply(this, arguments);
            }

            return fetchOpenOrders;
        }()
    }, {
        key: 'fetchOrder',
        value: function () {
            var _ref11 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee11(id) {
                var symbol = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
                var response;
                return _regenerator2.default.wrap(function _callee11$(_context11) {
                    while (1) {
                        switch (_context11.prev = _context11.next) {
                            case 0:
                                _context11.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context11.next = 4;
                                return this.privatePostGetOrder(this.extend({
                                    'id': id.toString()
                                }, params));

                            case 4:
                                response = _context11.sent;
                                return _context11.abrupt('return', this.parseOrder(response));

                            case 6:
                            case 'end':
                                return _context11.stop();
                        }
                    }
                }, _callee11, this);
            }));

            function fetchOrder(_x39) {
                return _ref11.apply(this, arguments);
            }

            return fetchOrder;
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
                if ((0, _keys2.default)(query).length) url += '?' + this.urlencode(query);
            } else {
                this.checkRequiredCredentials();
                var nonce = this.nonce().toString();
                var auth = nonce + this.uid + this.apiKey;
                var signature = this.hmac(this.encode(auth), this.encode(this.secret));
                body = this.urlencode(this.extend({
                    'key': this.apiKey,
                    'signature': signature.toUpperCase(),
                    'nonce': nonce
                }, query));
                headers = {
                    'Content-Type': 'application/x-www-form-urlencoded'
                };
            }
            return { 'url': url, 'method': method, 'body': body, 'headers': headers };
        }
    }, {
        key: 'request',
        value: function () {
            var _ref12 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee12(path) {
                var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
                var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;
                var response;
                return _regenerator2.default.wrap(function _callee12$(_context12) {
                    while (1) {
                        switch (_context12.prev = _context12.next) {
                            case 0:
                                _context12.next = 2;
                                return this.fetch2(path, api, method, params, headers, body);

                            case 2:
                                response = _context12.sent;

                                if (response) {
                                    _context12.next = 7;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' returned ' + this.json(response));

                            case 7:
                                if (!(response == true)) {
                                    _context12.next = 11;
                                    break;
                                }

                                return _context12.abrupt('return', response);

                            case 11:
                                if (!('e' in response)) {
                                    _context12.next = 18;
                                    break;
                                }

                                if (!('ok' in response)) {
                                    _context12.next = 15;
                                    break;
                                }

                                if (!(response['ok'] == 'ok')) {
                                    _context12.next = 15;
                                    break;
                                }

                                return _context12.abrupt('return', response);

                            case 15:
                                throw new ExchangeError(this.id + ' ' + this.json(response));

                            case 18:
                                if (!('error' in response)) {
                                    _context12.next = 21;
                                    break;
                                }

                                if (!response['error']) {
                                    _context12.next = 21;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' ' + this.json(response));

                            case 21:
                                return _context12.abrupt('return', response);

                            case 22:
                            case 'end':
                                return _context12.stop();
                        }
                    }
                }, _callee12, this);
            }));

            function request(_x50) {
                return _ref12.apply(this, arguments);
            }

            return request;
        }()
    }]);
    return cex;
}(Exchange);