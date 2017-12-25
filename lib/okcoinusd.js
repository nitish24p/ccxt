"use strict";

//  ---------------------------------------------------------------------------

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

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
    _inherits(okcoinusd, _Exchange);

    function okcoinusd() {
        _classCallCheck(this, okcoinusd);

        return _possibleConstructorReturn(this, (okcoinusd.__proto__ || Object.getPrototypeOf(okcoinusd)).apply(this, arguments));
    }

    _createClass(okcoinusd, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend(_get(okcoinusd.prototype.__proto__ || Object.getPrototypeOf(okcoinusd.prototype), 'describe', this).call(this), {
                'id': 'okcoinusd',
                'name': 'OKCoin USD',
                'countries': ['CN', 'US'],
                'hasCORS': false,
                'version': 'v1',
                'rateLimit': 1000, // up to 3000 requests per 5 minutes ≈ 600 requests per minute ≈ 10 requests per second ≈ 100 ms
                // obsolete metainfo interface
                'hasFetchOHLCV': true,
                'hasFetchOrder': true,
                'hasFetchOrders': true,
                'hasFetchOpenOrders': true,
                'hasFetchClosedOrders': true,
                'hasWithdraw': true,
                // new metainfo interface
                'has': {
                    'fetchOHLCV': true,
                    'fetchOrder': true,
                    'fetchOrders': true,
                    'fetchOpenOrders': true,
                    'fetchClosedOrders': true,
                    'withdraw': true
                },
                'extension': '.do', // appended to endpoint URL
                'hasFutureMarkets': false,
                'timeframes': {
                    '1m': '1min',
                    '3m': '3min',
                    '5m': '5min',
                    '15m': '15min',
                    '30m': '30min',
                    '1h': '1hour',
                    '2h': '2hour',
                    '4h': '4hour',
                    '6h': '6hour',
                    '12h': '12hour',
                    '1d': '1day',
                    '3d': '3day',
                    '1w': '1week'
                },
                'api': {
                    'web': {
                        'get': ['markets/currencies', 'markets/products']
                    },
                    'public': {
                        'get': ['depth', 'exchange_rate', 'future_depth', 'future_estimated_price', 'future_hold_amount', 'future_index', 'future_kline', 'future_price_limit', 'future_ticker', 'future_trades', 'kline', 'otcs', 'ticker', 'trades']
                    },
                    'private': {
                        'post': ['account_records', 'batch_trade', 'borrow_money', 'borrow_order_info', 'borrows_info', 'cancel_borrow', 'cancel_order', 'cancel_otc_order', 'cancel_withdraw', 'future_batch_trade', 'future_cancel', 'future_devolve', 'future_explosive', 'future_order_info', 'future_orders_info', 'future_position', 'future_position_4fix', 'future_trade', 'future_trades_history', 'future_userinfo', 'future_userinfo_4fix', 'lend_depth', 'order_fee', 'order_history', 'order_info', 'orders_info', 'otc_order_history', 'otc_order_info', 'repayment', 'submit_otc_order', 'trade', 'trade_history', 'trade_otc_order', 'withdraw', 'withdraw_info', 'unrepayments_info', 'userinfo']
                    }
                },
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/27766791-89ffb502-5ee5-11e7-8a5b-c5950b68ac65.jpg',
                    'api': {
                        'web': 'https://www.okcoin.com/v2',
                        'public': 'https://www.okcoin.com/api',
                        'private': 'https://www.okcoin.com/api'
                    },
                    'www': 'https://www.okcoin.com',
                    'doc': ['https://www.okcoin.com/rest_getStarted.html', 'https://www.npmjs.com/package/okcoin.com']
                }
            });
        }
    }, {
        key: 'fetchMarkets',
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                var response, markets, result, i, id, uppercase, _uppercase$split, _uppercase$split2, base, quote, symbol, precision, lot, market;

                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.webGetMarketsProducts();

                            case 2:
                                response = _context.sent;
                                markets = response['data'];
                                result = [];

                                for (i = 0; i < markets.length; i++) {
                                    id = markets[i]['symbol'];
                                    uppercase = id.toUpperCase();
                                    _uppercase$split = uppercase.split('_'), _uppercase$split2 = _slicedToArray(_uppercase$split, 2), base = _uppercase$split2[0], quote = _uppercase$split2[1];
                                    symbol = base + '/' + quote;
                                    precision = {
                                        'amount': markets[i]['maxSizeDigit'],
                                        'price': markets[i]['maxPriceDigit']
                                    };
                                    lot = Math.pow(10, -precision['amount']);
                                    market = this.extend(this.fees['trading'], {
                                        'id': id,
                                        'symbol': symbol,
                                        'base': base,
                                        'quote': quote,
                                        'info': markets[i],
                                        'type': 'spot',
                                        'spot': true,
                                        'future': false,
                                        'lot': lot,
                                        'active': true,
                                        'precision': precision,
                                        'limits': {
                                            'amount': {
                                                'min': markets[i]['minTradeSize'],
                                                'max': undefined
                                            },
                                            'price': {
                                                'min': undefined,
                                                'max': undefined
                                            },
                                            'cost': {
                                                'min': undefined,
                                                'max': undefined
                                            }
                                        }
                                    });

                                    result.push(market);
                                    if (this.hasFutureMarkets && market['quote'] == 'USDT') {
                                        result.push(this.extend(market, {
                                            'quote': 'USD',
                                            'symbol': market['base'] + '/USD',
                                            'id': market['id'].replace('usdt', 'usd'),
                                            'type': 'future',
                                            'spot': false,
                                            'future': true
                                        }));
                                    }
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
        key: 'fetchOrderBook',
        value: function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var market, method, request, orderbook, timestamp;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                method = 'publicGet';
                                request = {
                                    'symbol': market['id']
                                };

                                if (market['future']) {
                                    method += 'Future';
                                    request['contract_type'] = 'this_week'; // next_week, quarter
                                }
                                method += 'Depth';
                                _context2.next = 9;
                                return this[method](this.extend(request, params));

                            case 9:
                                orderbook = _context2.sent;
                                timestamp = this.milliseconds();
                                return _context2.abrupt('return', {
                                    'bids': orderbook['bids'],
                                    'asks': this.sortBy(orderbook['asks'], 0),
                                    'timestamp': timestamp,
                                    'datetime': this.iso8601(timestamp)
                                });

                            case 12:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function fetchOrderBook(_x2) {
                return _ref2.apply(this, arguments);
            }

            return fetchOrderBook;
        }()
    }, {
        key: 'parseTicker',
        value: function parseTicker(ticker) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var timestamp = ticker['timestamp'];
            var symbol = undefined;
            if (market) symbol = market['symbol'];
            return {
                'symbol': symbol,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'high': parseFloat(ticker['high']),
                'low': parseFloat(ticker['low']),
                'bid': parseFloat(ticker['buy']),
                'ask': parseFloat(ticker['sell']),
                'vwap': undefined,
                'open': undefined,
                'close': undefined,
                'first': undefined,
                'last': parseFloat(ticker['last']),
                'change': undefined,
                'percentage': undefined,
                'average': undefined,
                'baseVolume': parseFloat(ticker['vol']),
                'quoteVolume': undefined,
                'info': ticker
            };
        }
    }, {
        key: 'fetchTicker',
        value: function () {
            var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var market, method, request, response, timestamp, ticker;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                method = 'publicGet';
                                request = {
                                    'symbol': market['id']
                                };

                                if (market['future']) {
                                    method += 'Future';
                                    request['contract_type'] = 'this_week'; // next_week, quarter
                                }
                                method += 'Ticker';
                                _context3.next = 9;
                                return this[method](this.extend(request, params));

                            case 9:
                                response = _context3.sent;
                                timestamp = parseInt(response['date']) * 1000;
                                ticker = this.extend(response['ticker'], { 'timestamp': timestamp });
                                return _context3.abrupt('return', this.parseTicker(ticker, market));

                            case 13:
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

            var symbol = undefined;
            if (market) symbol = market['symbol'];
            return {
                'info': trade,
                'timestamp': trade['date_ms'],
                'datetime': this.iso8601(trade['date_ms']),
                'symbol': symbol,
                'id': trade['tid'].toString(),
                'order': undefined,
                'type': undefined,
                'side': trade['type'],
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
                var market, method, request, response;
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                method = 'publicGet';
                                request = {
                                    'symbol': market['id']
                                };

                                if (market['future']) {
                                    method += 'Future';
                                    request['contract_type'] = 'this_week'; // next_week, quarter
                                }
                                method += 'Trades';
                                _context4.next = 9;
                                return this[method](this.extend(request, params));

                            case 9:
                                response = _context4.sent;
                                return _context4.abrupt('return', this.parseTrades(response, market, since, limit));

                            case 11:
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
        key: 'fetchOHLCV',
        value: function () {
            var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(symbol) {
                var timeframe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '1m';
                var since = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var limit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1440;
                var params = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
                var market, method, request, response;
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                method = 'publicGet';
                                request = {
                                    'symbol': market['id'],
                                    'type': this.timeframes[timeframe]
                                };

                                if (market['future']) {
                                    method += 'Future';
                                    request['contract_type'] = 'this_week'; // next_week, quarter
                                }
                                method += 'Kline';
                                if (limit) request['size'] = parseInt(limit);
                                if (since) {
                                    request['since'] = since;
                                } else {
                                    request['since'] = this.milliseconds() - 86400000; // last 24 hours
                                }
                                _context5.next = 11;
                                return this[method](this.extend(request, params));

                            case 11:
                                response = _context5.sent;
                                return _context5.abrupt('return', this.parseOHLCVs(response, market, timeframe, since, limit));

                            case 13:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function fetchOHLCV(_x15) {
                return _ref5.apply(this, arguments);
            }

            return fetchOHLCV;
        }()
    }, {
        key: 'fetchBalance',
        value: function () {
            var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
                var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var response, balances, result, currencies, i, currency, lowercase, account;
                return regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                _context6.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context6.next = 4;
                                return this.privatePostUserinfo();

                            case 4:
                                response = _context6.sent;
                                balances = response['info']['funds'];
                                result = { 'info': response };
                                currencies = Object.keys(this.currencies);

                                for (i = 0; i < currencies.length; i++) {
                                    currency = currencies[i];
                                    lowercase = currency.toLowerCase();
                                    account = this.account();

                                    account['free'] = this.safeFloat(balances['free'], lowercase, 0.0);
                                    account['used'] = this.safeFloat(balances['freezed'], lowercase, 0.0);
                                    account['total'] = this.sum(account['free'], account['used']);
                                    result[currency] = account;
                                }
                                return _context6.abrupt('return', this.parseBalance(result));

                            case 10:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function fetchBalance() {
                return _ref6.apply(this, arguments);
            }

            return fetchBalance;
        }()
    }, {
        key: 'createOrder',
        value: function () {
            var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(symbol, type, side, amount) {
                var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
                var market, method, order, response;
                return regeneratorRuntime.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                _context7.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                method = 'privatePost';
                                order = {
                                    'symbol': market['id'],
                                    'type': side
                                };

                                if (!market['future']) {
                                    _context7.next = 10;
                                    break;
                                }

                                method += 'Future';
                                order = this.extend(order, {
                                    'contract_type': 'this_week', // next_week, quarter
                                    'match_price': 0, // match best counter party price? 0 or 1, ignores price if 1
                                    'lever_rate': 10, // leverage rate value: 10 or 20 (10 by default)
                                    'price': price,
                                    'amount': amount
                                });
                                _context7.next = 23;
                                break;

                            case 10:
                                if (!(type == 'limit')) {
                                    _context7.next = 15;
                                    break;
                                }

                                order['price'] = price;
                                order['amount'] = amount;
                                _context7.next = 23;
                                break;

                            case 15:
                                order['type'] += '_market';

                                if (!(side == 'buy')) {
                                    _context7.next = 22;
                                    break;
                                }

                                order['price'] = this.safeFloat(params, 'cost');

                                if (order['price']) {
                                    _context7.next = 20;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' market buy orders require an additional cost parameter, cost = price * amount');

                            case 20:
                                _context7.next = 23;
                                break;

                            case 22:
                                order['amount'] = amount;

                            case 23:
                                params = this.omit(params, 'cost');
                                method += 'Trade';
                                _context7.next = 27;
                                return this[method](this.extend(order, params));

                            case 27:
                                response = _context7.sent;
                                return _context7.abrupt('return', {
                                    'info': response,
                                    'id': response['order_id'].toString()
                                });

                            case 29:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function createOrder(_x19, _x20, _x21, _x22) {
                return _ref7.apply(this, arguments);
            }

            return createOrder;
        }()
    }, {
        key: 'cancelOrder',
        value: function () {
            var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(id) {
                var symbol = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
                var market, request, method, response;
                return regeneratorRuntime.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                if (symbol) {
                                    _context8.next = 2;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' cancelOrder() requires a symbol argument');

                            case 2:
                                market = this.market(symbol);
                                request = {
                                    'symbol': market['id'],
                                    'order_id': id
                                };
                                method = 'privatePost';

                                if (market['future']) {
                                    method += 'FutureCancel';
                                    request['contract_type'] = 'this_week'; // next_week, quarter
                                } else {
                                    method += 'CancelOrder';
                                }
                                _context8.next = 8;
                                return this[method](this.extend(request, params));

                            case 8:
                                response = _context8.sent;
                                return _context8.abrupt('return', response);

                            case 10:
                            case 'end':
                                return _context8.stop();
                        }
                    }
                }, _callee8, this);
            }));

            function cancelOrder(_x25) {
                return _ref8.apply(this, arguments);
            }

            return cancelOrder;
        }()
    }, {
        key: 'parseOrderStatus',
        value: function parseOrderStatus(status) {
            if (status == -1) return 'canceled';
            if (status == 0) return 'open';
            if (status == 1) return 'partial';
            if (status == 2) return 'closed';
            if (status == 4) return 'canceled';
            return status;
        }
    }, {
        key: 'parseOrder',
        value: function parseOrder(order) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var side = undefined;
            var type = undefined;
            if ('type' in order) {
                if (order['type'] == 'buy' || order['type'] == 'sell') {
                    side = order['type'];
                    type = 'limit';
                } else {
                    side = order['type'] == 'buy_market' ? 'buy' : 'sell';
                    type = 'market';
                }
            }
            var status = this.parseOrderStatus(order['status']);
            var symbol = undefined;
            if (!market) {
                if ('symbol' in order) if (order['symbol'] in this.markets_by_id) market = this.markets_by_id[order['symbol']];
            }
            if (market) symbol = market['symbol'];
            var timestamp = undefined;
            var createDateField = this.getCreateDateField();
            if (createDateField in order) timestamp = order[createDateField];
            var amount = order['amount'];
            var filled = order['deal_amount'];
            var remaining = amount - filled;
            var average = order['avg_price'];
            var cost = average * filled;
            var result = {
                'info': order,
                'id': order['order_id'],
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'symbol': symbol,
                'type': type,
                'side': side,
                'price': order['price'],
                'average': average,
                'cost': cost,
                'amount': amount,
                'filled': filled,
                'remaining': remaining,
                'status': status,
                'fee': undefined
            };
            return result;
        }
    }, {
        key: 'getCreateDateField',
        value: function getCreateDateField() {
            // needed for derived exchanges
            // allcoin typo create_data instead of create_date
            return 'create_date';
        }
    }, {
        key: 'getOrdersField',
        value: function getOrdersField() {
            // needed for derived exchanges
            // allcoin typo order instead of orders (expected based on their API docs)
            return 'orders';
        }
    }, {
        key: 'fetchOrder',
        value: function () {
            var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(id) {
                var symbol = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
                var market, method, request, response, ordersField;
                return regeneratorRuntime.wrap(function _callee9$(_context9) {
                    while (1) {
                        switch (_context9.prev = _context9.next) {
                            case 0:
                                if (symbol) {
                                    _context9.next = 2;
                                    break;
                                }

                                throw new ExchangeError(this.id + 'fetchOrders requires a symbol parameter');

                            case 2:
                                _context9.next = 4;
                                return this.loadMarkets();

                            case 4:
                                market = this.market(symbol);
                                method = 'privatePost';
                                request = {
                                    'order_id': id,
                                    'symbol': market['id']
                                    // 'status': 0, // 0 for unfilled orders, 1 for filled orders
                                    // 'current_page': 1, // current page number
                                    // 'page_length': 200, // number of orders returned per page, maximum 200
                                };

                                if (market['future']) {
                                    method += 'Future';
                                    request['contract_type'] = 'this_week'; // next_week, quarter
                                }
                                method += 'OrderInfo';
                                _context9.next = 11;
                                return this[method](this.extend(request, params));

                            case 11:
                                response = _context9.sent;
                                ordersField = this.getOrdersField();
                                return _context9.abrupt('return', this.parseOrder(response[ordersField][0]));

                            case 14:
                            case 'end':
                                return _context9.stop();
                        }
                    }
                }, _callee9, this);
            }));

            function fetchOrder(_x29) {
                return _ref9.apply(this, arguments);
            }

            return fetchOrder;
        }()
    }, {
        key: 'fetchOrders',
        value: function () {
            var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
                var symbol = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var market, method, request, order_id_in_params, status, response, ordersField;
                return regeneratorRuntime.wrap(function _callee10$(_context10) {
                    while (1) {
                        switch (_context10.prev = _context10.next) {
                            case 0:
                                if (symbol) {
                                    _context10.next = 2;
                                    break;
                                }

                                throw new ExchangeError(this.id + 'fetchOrders requires a symbol parameter');

                            case 2:
                                _context10.next = 4;
                                return this.loadMarkets();

                            case 4:
                                market = this.market(symbol);
                                method = 'privatePost';
                                request = {
                                    'symbol': market['id']
                                };
                                order_id_in_params = 'order_id' in params;

                                if (!market['future']) {
                                    _context10.next = 15;
                                    break;
                                }

                                method += 'FutureOrdersInfo';
                                request['contract_type'] = 'this_week'; // next_week, quarter

                                if (order_id_in_params) {
                                    _context10.next = 13;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' fetchOrders() requires order_id param for futures market ' + symbol + ' (a string of one or more order ids, comma-separated)');

                            case 13:
                                _context10.next = 29;
                                break;

                            case 15:
                                status = undefined;

                                if (!('type' in params)) {
                                    _context10.next = 20;
                                    break;
                                }

                                status = params['type'];
                                _context10.next = 25;
                                break;

                            case 20:
                                if (!('status' in params)) {
                                    _context10.next = 24;
                                    break;
                                }

                                status = params['status'];
                                _context10.next = 25;
                                break;

                            case 24:
                                throw new ExchangeError(this.id + ' fetchOrders() requires type param or status param for spot market ' + symbol + ' (0 or "open" for unfilled orders, 1 or "closed" for filled orders)');

                            case 25:
                                if (status == 'open') status = 0;
                                if (status == 'closed') status = 1;
                                if (order_id_in_params) {
                                    method += 'OrdersInfo';
                                    request = this.extend(request, {
                                        'type': status
                                    });
                                } else {
                                    method += 'OrderHistory';
                                    request = this.extend(request, {
                                        'status': status,
                                        'current_page': 1, // current page number
                                        'page_length': 200 // number of orders returned per page, maximum 200
                                    });
                                }
                                params = this.omit(params, ['type', 'status']);

                            case 29:
                                _context10.next = 31;
                                return this[method](this.extend(request, params));

                            case 31:
                                response = _context10.sent;
                                ordersField = this.getOrdersField();
                                return _context10.abrupt('return', this.parseOrders(response[ordersField], market, since, limit));

                            case 34:
                            case 'end':
                                return _context10.stop();
                        }
                    }
                }, _callee10, this);
            }));

            function fetchOrders() {
                return _ref10.apply(this, arguments);
            }

            return fetchOrders;
        }()
    }, {
        key: 'fetchOpenOrders',
        value: function () {
            var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11() {
                var symbol = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var open;
                return regeneratorRuntime.wrap(function _callee11$(_context11) {
                    while (1) {
                        switch (_context11.prev = _context11.next) {
                            case 0:
                                open = 0; // 0 for unfilled orders, 1 for filled orders

                                _context11.next = 3;
                                return this.fetchOrders(symbol, undefined, undefined, this.extend({
                                    'status': open
                                }, params));

                            case 3:
                                return _context11.abrupt('return', _context11.sent);

                            case 4:
                            case 'end':
                                return _context11.stop();
                        }
                    }
                }, _callee11, this);
            }));

            function fetchOpenOrders() {
                return _ref11.apply(this, arguments);
            }

            return fetchOpenOrders;
        }()
    }, {
        key: 'fetchClosedOrders',
        value: function () {
            var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12() {
                var symbol = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var closed;
                return regeneratorRuntime.wrap(function _callee12$(_context12) {
                    while (1) {
                        switch (_context12.prev = _context12.next) {
                            case 0:
                                closed = 1; // 0 for unfilled orders, 1 for filled orders

                                _context12.next = 3;
                                return this.fetchOrders(symbol, undefined, undefined, this.extend({
                                    'status': closed
                                }, params));

                            case 3:
                                return _context12.abrupt('return', _context12.sent);

                            case 4:
                            case 'end':
                                return _context12.stop();
                        }
                    }
                }, _callee12, this);
            }));

            function fetchClosedOrders() {
                return _ref12.apply(this, arguments);
            }

            return fetchClosedOrders;
        }()
    }, {
        key: 'withdraw',
        value: function () {
            var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(currency, amount, address) {
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var lowercase, request, query, password, response;
                return regeneratorRuntime.wrap(function _callee13$(_context13) {
                    while (1) {
                        switch (_context13.prev = _context13.next) {
                            case 0:
                                _context13.next = 2;
                                return this.loadMarkets();

                            case 2:
                                lowercase = currency.toLowerCase() + '_usd';
                                // if (amount < 0.01)
                                //     throw new ExchangeError (this.id + ' withdraw() requires amount > 0.01');

                                request = {
                                    'symbol': lowercase,
                                    'withdraw_address': address,
                                    'withdraw_amount': amount,
                                    'target': 'address' // or okcn, okcom, okex
                                };
                                query = params;

                                if (!('chargefee' in query)) {
                                    _context13.next = 10;
                                    break;
                                }

                                request['chargefee'] = query['chargefee'];
                                query = this.omit(query, 'chargefee');
                                _context13.next = 11;
                                break;

                            case 10:
                                throw new ExchangeError(this.id + ' withdraw() requires a `chargefee` parameter');

                            case 11:
                                password = undefined;

                                if (this.password) {
                                    request['trade_pwd'] = this.password;
                                    password = this.password;
                                } else if ('password' in query) {
                                    request['trade_pwd'] = query['password'];
                                    query = this.omit(query, 'password');
                                } else if ('trade_pwd' in query) {
                                    request['trade_pwd'] = query['trade_pwd'];
                                    query = this.omit(query, 'trade_pwd');
                                }

                                if (password) {
                                    _context13.next = 15;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' withdraw() requires this.password set on the exchange instance or a password / trade_pwd parameter');

                            case 15:
                                _context13.next = 17;
                                return this.privatePostWithdraw(this.extend(request, query));

                            case 17:
                                response = _context13.sent;
                                return _context13.abrupt('return', {
                                    'info': response,
                                    'id': this.safeString(response, 'withdraw_id')
                                });

                            case 19:
                            case 'end':
                                return _context13.stop();
                        }
                    }
                }, _callee13, this);
            }));

            function withdraw(_x43, _x44, _x45) {
                return _ref13.apply(this, arguments);
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

            var url = '/';
            if (api != 'web') url += this.version + '/';
            url += path + this.extension;
            if (api == 'private') {
                this.checkRequiredCredentials();
                var query = this.keysort(this.extend({
                    'api_key': this.apiKey
                }, params));
                // secret key must be at the end of query
                var queryString = this.rawencode(query) + '&secret_key=' + this.secret;
                query['sign'] = this.hash(this.encode(queryString)).toUpperCase();
                body = this.urlencode(query);
                headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
            } else {
                if (Object.keys(params).length) url += '?' + this.urlencode(params);
            }
            url = this.urls['api'][api] + url;
            return { 'url': url, 'method': method, 'body': body, 'headers': headers };
        }
    }, {
        key: 'request',
        value: function () {
            var _ref14 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14(path) {
                var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
                var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;
                var response;
                return regeneratorRuntime.wrap(function _callee14$(_context14) {
                    while (1) {
                        switch (_context14.prev = _context14.next) {
                            case 0:
                                _context14.next = 2;
                                return this.fetch2(path, api, method, params, headers, body);

                            case 2:
                                response = _context14.sent;

                                if (!('result' in response)) {
                                    _context14.next = 6;
                                    break;
                                }

                                if (response['result']) {
                                    _context14.next = 6;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' ' + this.json(response));

                            case 6:
                                if (!('error_code' in response)) {
                                    _context14.next = 8;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' ' + this.json(response));

                            case 8:
                                return _context14.abrupt('return', response);

                            case 9:
                            case 'end':
                                return _context14.stop();
                        }
                    }
                }, _callee14, this);
            }));

            function request(_x56) {
                return _ref14.apply(this, arguments);
            }

            return request;
        }()
    }]);

    return okcoinusd;
}(Exchange);