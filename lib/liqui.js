"use strict";

// ---------------------------------------------------------------------------

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Exchange = require('./base/Exchange');

var _require = require('./base/errors'),
    ExchangeError = _require.ExchangeError,
    InsufficientFunds = _require.InsufficientFunds,
    OrderNotFound = _require.OrderNotFound,
    DDoSProtection = _require.DDoSProtection;

// ---------------------------------------------------------------------------

module.exports = function (_Exchange) {
    _inherits(liqui, _Exchange);

    function liqui() {
        _classCallCheck(this, liqui);

        return _possibleConstructorReturn(this, (liqui.__proto__ || Object.getPrototypeOf(liqui)).apply(this, arguments));
    }

    _createClass(liqui, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend(_get(liqui.prototype.__proto__ || Object.getPrototypeOf(liqui.prototype), 'describe', this).call(this), {
                'id': 'liqui',
                'name': 'Liqui',
                'countries': 'UA',
                'rateLimit': 2500,
                'version': '3',
                'hasCORS': false,
                // obsolete metainfo interface
                'hasFetchOrder': true,
                'hasFetchOrders': true,
                'hasFetchOpenOrders': true,
                'hasFetchClosedOrders': true,
                'hasFetchTickers': true,
                'hasFetchMyTrades': true,
                'hasWithdraw': true,
                // new metainfo interface
                'has': {
                    'fetchOrder': true,
                    'fetchOrders': 'emulated',
                    'fetchOpenOrders': true,
                    'fetchClosedOrders': 'emulated',
                    'fetchTickers': true,
                    'fetchMyTrades': true,
                    'withdraw': true
                },
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/27982022-75aea828-63a0-11e7-9511-ca584a8edd74.jpg',
                    'api': {
                        'public': 'https://api.liqui.io/api',
                        'private': 'https://api.liqui.io/tapi'
                    },
                    'www': 'https://liqui.io',
                    'doc': 'https://liqui.io/api',
                    'fees': 'https://liqui.io/fee'
                },
                'api': {
                    'public': {
                        'get': ['info', 'ticker/{pair}', 'depth/{pair}', 'trades/{pair}']
                    },
                    'private': {
                        'post': ['getInfo', 'Trade', 'ActiveOrders', 'OrderInfo', 'CancelOrder', 'TradeHistory', 'TransHistory', 'CoinDepositAddress', 'WithdrawCoin', 'CreateCoupon', 'RedeemCoupon']
                    }
                },
                'fees': {
                    'trading': {
                        'maker': 0.001,
                        'taker': 0.0025
                    },
                    'funding': 0.0
                }
            });
        }
    }, {
        key: 'calculateFee',
        value: function calculateFee(symbol, type, side, amount, price) {
            var takerOrMaker = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 'taker';
            var params = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : {};

            var market = this.markets[symbol];
            var key = 'quote';
            var rate = market[takerOrMaker];
            var cost = parseFloat(this.costToPrecision(symbol, amount * rate));
            if (side == 'sell') {
                cost *= price;
            } else {
                key = 'base';
            }
            return {
                'type': takerOrMaker,
                'currency': market[key],
                'rate': rate,
                'cost': cost
            };
        }
    }, {
        key: 'commonCurrencyCode',
        value: function commonCurrencyCode(currency) {
            if (!this.substituteCommonCurrencyCodes) return currency;
            if (currency == 'XBT') return 'BTC';
            if (currency == 'BCC') return 'BCH';
            if (currency == 'DRK') return 'DASH';
            // they misspell DASH as dsh :/
            if (currency == 'DSH') return 'DASH';
            return currency;
        }
    }, {
        key: 'getBaseQuoteFromMarketId',
        value: function getBaseQuoteFromMarketId(id) {
            var uppercase = id.toUpperCase();

            var _uppercase$split = uppercase.split('_'),
                _uppercase$split2 = _slicedToArray(_uppercase$split, 2),
                base = _uppercase$split2[0],
                quote = _uppercase$split2[1];

            base = this.commonCurrencyCode(base);
            quote = this.commonCurrencyCode(quote);
            return [base, quote];
        }
    }, {
        key: 'fetchMarkets',
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                var response, markets, keys, result, p, id, market, _getBaseQuoteFromMark, _getBaseQuoteFromMark2, base, quote, symbol, precision, amountLimits, priceLimits, costLimits, limits, active;

                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.publicGetInfo();

                            case 2:
                                response = _context.sent;
                                markets = response['pairs'];
                                keys = Object.keys(markets);
                                result = [];

                                for (p = 0; p < keys.length; p++) {
                                    id = keys[p];
                                    market = markets[id];
                                    _getBaseQuoteFromMark = this.getBaseQuoteFromMarketId(id), _getBaseQuoteFromMark2 = _slicedToArray(_getBaseQuoteFromMark, 2), base = _getBaseQuoteFromMark2[0], quote = _getBaseQuoteFromMark2[1];
                                    symbol = base + '/' + quote;
                                    precision = {
                                        'amount': this.safeInteger(market, 'decimal_places'),
                                        'price': this.safeInteger(market, 'decimal_places')
                                    };
                                    amountLimits = {
                                        'min': this.safeFloat(market, 'min_amount'),
                                        'max': this.safeFloat(market, 'max_amount')
                                    };
                                    priceLimits = {
                                        'min': this.safeFloat(market, 'min_price'),
                                        'max': this.safeFloat(market, 'max_price')
                                    };
                                    costLimits = {
                                        'min': this.safeFloat(market, 'min_total')
                                    };
                                    limits = {
                                        'amount': amountLimits,
                                        'price': priceLimits,
                                        'cost': costLimits
                                    };
                                    active = market['hidden'] == 0;

                                    result.push(this.extend(this.fees['trading'], {
                                        'id': id,
                                        'symbol': symbol,
                                        'base': base,
                                        'quote': quote,
                                        'active': active,
                                        'taker': market['fee'] / 100,
                                        'lot': amountLimits['min'],
                                        'precision': precision,
                                        'limits': limits,
                                        'info': market
                                    }));
                                }
                                return _context.abrupt('return', result);

                            case 8:
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
                var response, balances, result, funds, currencies, c, currency, uppercase, total, used, account;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context2.next = 4;
                                return this.privatePostGetInfo();

                            case 4:
                                response = _context2.sent;
                                balances = response['return'];
                                result = { 'info': balances };
                                funds = balances['funds'];
                                currencies = Object.keys(funds);

                                for (c = 0; c < currencies.length; c++) {
                                    currency = currencies[c];
                                    uppercase = currency.toUpperCase();

                                    uppercase = this.commonCurrencyCode(uppercase);
                                    total = undefined;
                                    used = undefined;

                                    if (balances['open_orders'] == 0) {
                                        total = funds[currency];
                                        used = 0.0;
                                    }
                                    account = {
                                        'free': funds[currency],
                                        'used': used,
                                        'total': total
                                    };

                                    result[uppercase] = account;
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
                var market, response, market_id_in_reponse, orderbook, result;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                _context3.next = 5;
                                return this.publicGetDepthPair(this.extend({
                                    'pair': market['id']
                                }, params));

                            case 5:
                                response = _context3.sent;
                                market_id_in_reponse = market['id'] in response;

                                if (market_id_in_reponse) {
                                    _context3.next = 9;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' ' + market['symbol'] + ' order book is empty or not available');

                            case 9:
                                orderbook = response[market['id']];
                                result = this.parseOrderBook(orderbook);

                                result['bids'] = this.sortBy(result['bids'], 0, true);
                                result['asks'] = this.sortBy(result['asks'], 0);
                                return _context3.abrupt('return', result);

                            case 14:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function fetchOrderBook(_x5) {
                return _ref3.apply(this, arguments);
            }

            return fetchOrderBook;
        }()
    }, {
        key: 'parseTicker',
        value: function parseTicker(ticker) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var timestamp = ticker['updated'] * 1000;
            var symbol = undefined;
            if (market) symbol = market['symbol'];
            return {
                'symbol': symbol,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'high': this.safeFloat(ticker, 'high'),
                'low': this.safeFloat(ticker, 'low'),
                'bid': this.safeFloat(ticker, 'buy'),
                'ask': this.safeFloat(ticker, 'sell'),
                'vwap': undefined,
                'open': undefined,
                'close': undefined,
                'first': undefined,
                'last': this.safeFloat(ticker, 'last'),
                'change': undefined,
                'percentage': undefined,
                'average': this.safeFloat(ticker, 'avg'),
                'baseVolume': this.safeFloat(ticker, 'vol_cur'),
                'quoteVolume': this.safeFloat(ticker, 'vol'),
                'info': ticker
            };
        }
    }, {
        key: 'fetchTickers',
        value: function () {
            var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
                var symbols = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var ids, tickers, result, keys, k, id, ticker, market, symbol;
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                return this.loadMarkets();

                            case 2:
                                ids = undefined;

                                if (!symbols) {
                                    // let numIds = this.ids.length;
                                    // if (numIds > 256)
                                    //     throw new ExchangeError (this.id + ' fetchTickers() requires symbols argument');
                                    ids = this.ids;
                                } else {
                                    ids = this.marketIds(symbols);
                                }
                                _context4.next = 6;
                                return this.publicGetTickerPair(this.extend({
                                    'pair': ids.join('-')
                                }, params));

                            case 6:
                                tickers = _context4.sent;
                                result = {};
                                keys = Object.keys(tickers);

                                for (k = 0; k < keys.length; k++) {
                                    id = keys[k];
                                    ticker = tickers[id];
                                    market = this.markets_by_id[id];
                                    symbol = market['symbol'];

                                    result[symbol] = this.parseTicker(ticker, market);
                                }
                                return _context4.abrupt('return', result);

                            case 11:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function fetchTickers() {
                return _ref4.apply(this, arguments);
            }

            return fetchTickers;
        }()
    }, {
        key: 'fetchTicker',
        value: function () {
            var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var tickers;
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.next = 2;
                                return this.fetchTickers([symbol], params);

                            case 2:
                                tickers = _context5.sent;
                                return _context5.abrupt('return', tickers[symbol]);

                            case 4:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function fetchTicker(_x10) {
                return _ref5.apply(this, arguments);
            }

            return fetchTicker;
        }()
    }, {
        key: 'parseTrade',
        value: function parseTrade(trade) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var timestamp = trade['timestamp'] * 1000;
            var side = trade['type'];
            if (side == 'ask') side = 'sell';
            if (side == 'bid') side = 'buy';
            var price = this.safeFloat(trade, 'price');
            if ('rate' in trade) price = this.safeFloat(trade, 'rate');
            var id = this.safeString(trade, 'tid');
            if ('trade_id' in trade) id = this.safeString(trade, 'trade_id');
            var order = this.safeString(trade, this.getOrderIdKey());
            if ('pair' in trade) {
                var marketId = trade['pair'];
                market = this.markets_by_id[marketId];
            }
            var symbol = undefined;
            if (market) symbol = market['symbol'];
            var amount = trade['amount'];
            var type = 'limit'; // all trades are still limit trades
            var fee = undefined;
            // this is filled by fetchMyTrades() only
            // is_your_order is always false :\
            // let isYourOrder = this.safeValue (trade, 'is_your_order');
            // let takerOrMaker = 'taker';
            // if (isYourOrder)
            //     takerOrMaker = 'maker';
            // let fee = this.calculateFee (symbol, type, side, amount, price, takerOrMaker);
            return {
                'id': id,
                'order': order,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'symbol': symbol,
                'type': type,
                'side': side,
                'price': price,
                'amount': amount,
                'fee': fee,
                'info': trade
            };
        }
    }, {
        key: 'fetchTrades',
        value: function () {
            var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(symbol) {
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var market, request, response;
                return regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                _context6.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                request = {
                                    'pair': market['id']
                                };

                                if (limit) request['limit'] = limit;
                                _context6.next = 7;
                                return this.publicGetTradesPair(this.extend(request, params));

                            case 7:
                                response = _context6.sent;
                                return _context6.abrupt('return', this.parseTrades(response[market['id']], market, since, limit));

                            case 9:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function fetchTrades(_x15) {
                return _ref6.apply(this, arguments);
            }

            return fetchTrades;
        }()
    }, {
        key: 'createOrder',
        value: function () {
            var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(symbol, type, side, amount) {
                var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
                var market, request, response, id, timestamp, order;
                return regeneratorRuntime.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                if (!(type == 'market')) {
                                    _context7.next = 2;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' allows limit orders only');

                            case 2:
                                _context7.next = 4;
                                return this.loadMarkets();

                            case 4:
                                market = this.market(symbol);
                                request = {
                                    'pair': market['id'],
                                    'type': side,
                                    'amount': this.amountToPrecision(symbol, amount),
                                    'rate': this.priceToPrecision(symbol, price)
                                };
                                _context7.next = 8;
                                return this.privatePostTrade(this.extend(request, params));

                            case 8:
                                response = _context7.sent;
                                id = this.safeString(response['return'], this.getOrderIdKey());

                                if (!id) id = this.safeString(response['return'], 'init_order_id');
                                timestamp = this.milliseconds();

                                price = parseFloat(price);
                                amount = parseFloat(amount);
                                order = {
                                    'id': id,
                                    'timestamp': timestamp,
                                    'datetime': this.iso8601(timestamp),
                                    'status': 'open',
                                    'symbol': symbol,
                                    'type': type,
                                    'side': side,
                                    'price': price,
                                    'cost': price * amount,
                                    'amount': amount,
                                    'remaining': amount,
                                    'filled': 0.0,
                                    'fee': undefined
                                    // 'trades': this.parseTrades (order['trades'], market),
                                };

                                this.orders[id] = order;
                                return _context7.abrupt('return', this.extend({ 'info': response }, order));

                            case 17:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function createOrder(_x18, _x19, _x20, _x21) {
                return _ref7.apply(this, arguments);
            }

            return createOrder;
        }()
    }, {
        key: 'getOrderIdKey',
        value: function getOrderIdKey() {
            return 'order_id';
        }
    }, {
        key: 'cancelOrder',
        value: function () {
            var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(id) {
                var symbol = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
                var response, request, idKey, message;
                return regeneratorRuntime.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                _context8.next = 2;
                                return this.loadMarkets();

                            case 2:
                                response = undefined;
                                _context8.prev = 3;
                                request = {};
                                idKey = this.getOrderIdKey();

                                request[idKey] = id;
                                _context8.next = 9;
                                return this.privatePostCancelOrder(this.extend(request, params));

                            case 9:
                                response = _context8.sent;

                                if (id in this.orders) this.orders[id]['status'] = 'canceled';
                                _context8.next = 21;
                                break;

                            case 13:
                                _context8.prev = 13;
                                _context8.t0 = _context8['catch'](3);

                                if (!this.last_json_response) {
                                    _context8.next = 20;
                                    break;
                                }

                                message = this.safeString(this.last_json_response, 'error');

                                if (!message) {
                                    _context8.next = 20;
                                    break;
                                }

                                if (!(message.indexOf('not found') >= 0)) {
                                    _context8.next = 20;
                                    break;
                                }

                                throw new OrderNotFound(this.id + ' cancelOrder() error: ' + this.last_http_response);

                            case 20:
                                throw _context8.t0;

                            case 21:
                                return _context8.abrupt('return', response);

                            case 22:
                            case 'end':
                                return _context8.stop();
                        }
                    }
                }, _callee8, this, [[3, 13]]);
            }));

            function cancelOrder(_x24) {
                return _ref8.apply(this, arguments);
            }

            return cancelOrder;
        }()
    }, {
        key: 'parseOrder',
        value: function parseOrder(order) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var id = order['id'].toString();
            var status = order['status'];
            if (status == 0) {
                status = 'open';
            } else if (status == 1) {
                status = 'closed';
            } else if (status == 2 || status == 3) {
                status = 'canceled';
            }
            var timestamp = parseInt(order['timestamp_created']) * 1000;
            var symbol = undefined;
            if (!market) market = this.markets_by_id[order['pair']];
            if (market) symbol = market['symbol'];
            var remaining = this.safeFloat(order, 'amount');
            var amount = this.safeFloat(order, 'start_amount', remaining);
            if (typeof amount == 'undefined') {
                if (id in this.orders) {
                    amount = this.safeFloat(this.orders[id], 'amount');
                }
            }
            var price = this.safeFloat(order, 'rate');
            var filled = undefined;
            var cost = undefined;
            if (typeof amount != 'undefined') {
                if (typeof remaining != 'undefined') {
                    filled = amount - remaining;
                    cost = price * filled;
                }
            }
            var fee = undefined;
            var result = {
                'info': order,
                'id': id,
                'symbol': symbol,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'type': 'limit',
                'side': order['type'],
                'price': price,
                'cost': cost,
                'amount': amount,
                'remaining': remaining,
                'filled': filled,
                'status': status,
                'fee': fee
            };
            return result;
        }
    }, {
        key: 'parseOrders',
        value: function parseOrders(orders) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
            var since = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
            var limit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;

            var ids = Object.keys(orders);
            var result = [];
            for (var i = 0; i < ids.length; i++) {
                var id = ids[i];
                var order = orders[id];
                var extended = this.extend(order, { 'id': id });
                result.push(this.parseOrder(extended, market));
            }
            return this.filterBySinceLimit(result, since, limit);
        }
    }, {
        key: 'fetchOrder',
        value: function () {
            var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(id) {
                var symbol = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
                var response, newOrder, oldOrder;
                return regeneratorRuntime.wrap(function _callee9$(_context9) {
                    while (1) {
                        switch (_context9.prev = _context9.next) {
                            case 0:
                                _context9.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context9.next = 4;
                                return this.privatePostOrderInfo(this.extend({
                                    'order_id': parseInt(id)
                                }, params));

                            case 4:
                                response = _context9.sent;

                                id = id.toString();
                                newOrder = this.parseOrder(this.extend({ 'id': id }, response['return'][id]));
                                oldOrder = id in this.orders ? this.orders[id] : {};

                                this.orders[id] = this.extend(oldOrder, newOrder);
                                return _context9.abrupt('return', this.orders[id]);

                            case 10:
                            case 'end':
                                return _context9.stop();
                        }
                    }
                }, _callee9, this);
            }));

            function fetchOrder(_x31) {
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

                var market, request, response, openOrders, j, openOrdersIndexedById, cachedOrderIds, result, k, id, _order, order;

                return regeneratorRuntime.wrap(function _callee10$(_context10) {
                    while (1) {
                        switch (_context10.prev = _context10.next) {
                            case 0:
                                if (symbol) {
                                    _context10.next = 2;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' fetchOrders requires a symbol');

                            case 2:
                                _context10.next = 4;
                                return this.loadMarkets();

                            case 4:
                                market = this.market(symbol);
                                request = { 'pair': market['id'] };
                                _context10.next = 8;
                                return this.privatePostActiveOrders(this.extend(request, params));

                            case 8:
                                response = _context10.sent;
                                openOrders = [];

                                if ('return' in response) openOrders = this.parseOrders(response['return'], market);
                                for (j = 0; j < openOrders.length; j++) {
                                    this.orders[openOrders[j]['id']] = openOrders[j];
                                }
                                openOrdersIndexedById = this.indexBy(openOrders, 'id');
                                cachedOrderIds = Object.keys(this.orders);
                                result = [];

                                for (k = 0; k < cachedOrderIds.length; k++) {
                                    id = cachedOrderIds[k];

                                    if (id in openOrdersIndexedById) {
                                        this.orders[id] = this.extend(this.orders[id], openOrdersIndexedById[id]);
                                    } else {
                                        _order = this.orders[id];

                                        if (_order['status'] == 'open') {
                                            this.orders[id] = this.extend(_order, {
                                                'status': 'closed',
                                                'cost': _order['amount'] * _order['price'],
                                                'filled': _order['amount'],
                                                'remaining': 0.0
                                            });
                                        }
                                    }
                                    order = this.orders[id];

                                    if (order['symbol'] == symbol) result.push(order);
                                }
                                return _context10.abrupt('return', this.filterBySinceLimit(result, since, limit));

                            case 17:
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
                var orders, result, i;
                return regeneratorRuntime.wrap(function _callee11$(_context11) {
                    while (1) {
                        switch (_context11.prev = _context11.next) {
                            case 0:
                                _context11.next = 2;
                                return this.fetchOrders(symbol, since, limit, params);

                            case 2:
                                orders = _context11.sent;
                                result = [];

                                for (i = 0; i < orders.length; i++) {
                                    if (orders[i]['status'] == 'open') result.push(orders[i]);
                                }
                                return _context11.abrupt('return', result);

                            case 6:
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
                var orders, result, i;
                return regeneratorRuntime.wrap(function _callee12$(_context12) {
                    while (1) {
                        switch (_context12.prev = _context12.next) {
                            case 0:
                                _context12.next = 2;
                                return this.fetchOrders(symbol, since, limit, params);

                            case 2:
                                orders = _context12.sent;
                                result = [];

                                for (i = 0; i < orders.length; i++) {
                                    if (orders[i]['status'] == 'closed') result.push(orders[i]);
                                }
                                return _context12.abrupt('return', result);

                            case 6:
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
        key: 'fetchMyTrades',
        value: function () {
            var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13() {
                var symbol = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var market, request, response, trades;
                return regeneratorRuntime.wrap(function _callee13$(_context13) {
                    while (1) {
                        switch (_context13.prev = _context13.next) {
                            case 0:
                                _context13.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = undefined;
                                request = {
                                    // 'from': 123456789, // trade ID, from which the display starts numerical 0
                                    // 'count': 1000, // the number of trades for display numerical, default = 1000
                                    // 'from_id': trade ID, from which the display starts numerical 0
                                    // 'end_id': trade ID on which the display ends numerical ∞
                                    // 'order': 'ASC', // sorting, default = DESC
                                    // 'since': 1234567890, // UTC start time, default = 0
                                    // 'end': 1234567890, // UTC end time, default = ∞
                                    // 'pair': 'eth_btc', // default = all markets
                                };

                                if (symbol) {
                                    market = this.market(symbol);
                                    request['pair'] = market['id'];
                                }
                                if (limit) request['count'] = parseInt(limit);
                                if (since) request['since'] = parseInt(since / 1000);
                                _context13.next = 9;
                                return this.privatePostTradeHistory(this.extend(request, params));

                            case 9:
                                response = _context13.sent;
                                trades = [];

                                if ('return' in response) trades = response['return'];
                                return _context13.abrupt('return', this.parseTrades(trades, market, since, limit));

                            case 13:
                            case 'end':
                                return _context13.stop();
                        }
                    }
                }, _callee13, this);
            }));

            function fetchMyTrades() {
                return _ref13.apply(this, arguments);
            }

            return fetchMyTrades;
        }()
    }, {
        key: 'withdraw',
        value: function () {
            var _ref14 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14(currency, amount, address) {
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var response;
                return regeneratorRuntime.wrap(function _callee14$(_context14) {
                    while (1) {
                        switch (_context14.prev = _context14.next) {
                            case 0:
                                _context14.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context14.next = 4;
                                return this.privatePostWithdrawCoin(this.extend({
                                    'coinName': currency,
                                    'amount': parseFloat(amount),
                                    'address': address
                                }, params));

                            case 4:
                                response = _context14.sent;
                                return _context14.abrupt('return', {
                                    'info': response,
                                    'id': response['return']['tId']
                                });

                            case 6:
                            case 'end':
                                return _context14.stop();
                        }
                    }
                }, _callee14, this);
            }));

            function withdraw(_x49, _x50, _x51) {
                return _ref14.apply(this, arguments);
            }

            return withdraw;
        }()
    }, {
        key: 'signBodyWithSecret',
        value: function signBodyWithSecret(body) {
            return this.hmac(this.encode(body), this.encode(this.secret), 'sha512');
        }
    }, {
        key: 'getVersionString',
        value: function getVersionString() {
            return '/' + this.version;
        }
    }, {
        key: 'sign',
        value: function sign(path) {
            var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var url = this.urls['api'][api];
            var query = this.omit(params, this.extractParams(path));
            if (api == 'private') {
                this.checkRequiredCredentials();
                var nonce = this.nonce();
                body = this.urlencode(this.extend({
                    'nonce': nonce,
                    'method': path
                }, query));
                var signature = this.signBodyWithSecret(body);
                headers = {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Key': this.apiKey,
                    'Sign': signature
                };
            } else {
                url += this.getVersionString() + '/' + this.implodeParams(path, params);
                if (Object.keys(query).length) url += '?' + this.urlencode(query);
            }
            return { 'url': url, 'method': method, 'body': body, 'headers': headers };
        }
    }, {
        key: 'request',
        value: function () {
            var _ref15 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15(path) {
                var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
                var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;
                var response;
                return regeneratorRuntime.wrap(function _callee15$(_context15) {
                    while (1) {
                        switch (_context15.prev = _context15.next) {
                            case 0:
                                _context15.next = 2;
                                return this.fetch2(path, api, method, params, headers, body);

                            case 2:
                                response = _context15.sent;

                                if (!('success' in response)) {
                                    _context15.next = 18;
                                    break;
                                }

                                if (response['success']) {
                                    _context15.next = 18;
                                    break;
                                }

                                if (!(response['error'].indexOf('Not enougth') >= 0)) {
                                    _context15.next = 9;
                                    break;
                                }

                                throw new InsufficientFunds(this.id + ' ' + this.json(response));

                            case 9:
                                if (!(response['error'] == 'Requests too often')) {
                                    _context15.next = 13;
                                    break;
                                }

                                throw new DDoSProtection(this.id + ' ' + this.json(response));

                            case 13:
                                if (!(response['error'] == 'not available' || response['error'] == 'external service unavailable')) {
                                    _context15.next = 17;
                                    break;
                                }

                                throw new DDoSProtection(this.id + ' ' + this.json(response));

                            case 17:
                                throw new ExchangeError(this.id + ' ' + this.json(response));

                            case 18:
                                return _context15.abrupt('return', response);

                            case 19:
                            case 'end':
                                return _context15.stop();
                        }
                    }
                }, _callee15, this);
            }));

            function request(_x62) {
                return _ref15.apply(this, arguments);
            }

            return request;
        }()
    }]);

    return liqui;
}(Exchange);