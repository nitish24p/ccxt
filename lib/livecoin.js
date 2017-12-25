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
    ExchangeError = _require.ExchangeError,
    AuthenticationError = _require.AuthenticationError,
    NotSupported = _require.NotSupported,
    InvalidOrder = _require.InvalidOrder,
    OrderNotFound = _require.OrderNotFound;

//  ---------------------------------------------------------------------------

module.exports = function (_Exchange) {
    _inherits(livecoin, _Exchange);

    function livecoin() {
        _classCallCheck(this, livecoin);

        return _possibleConstructorReturn(this, (livecoin.__proto__ || Object.getPrototypeOf(livecoin)).apply(this, arguments));
    }

    _createClass(livecoin, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend(_get(livecoin.prototype.__proto__ || Object.getPrototypeOf(livecoin.prototype), 'describe', this).call(this), {
                'id': 'livecoin',
                'name': 'LiveCoin',
                'countries': ['US', 'UK', 'RU'],
                'rateLimit': 1000,
                'hasCORS': false,
                // obsolete metainfo interface
                'hasFetchTickers': true,
                'hasFetchCurrencies': true,
                // new metainfo interface
                'has': {
                    'fetchTickers': true,
                    'fetchCurrencies': true
                },
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/27980768-f22fc424-638a-11e7-89c9-6010a54ff9be.jpg',
                    'api': 'https://api.livecoin.net',
                    'www': 'https://www.livecoin.net',
                    'doc': 'https://www.livecoin.net/api?lang=en'
                },
                'api': {
                    'public': {
                        'get': ['exchange/all/order_book', 'exchange/last_trades', 'exchange/maxbid_minask', 'exchange/order_book', 'exchange/restrictions', 'exchange/ticker', // omit params to get all tickers at once
                        'info/coinInfo']
                    },
                    'private': {
                        'get': ['exchange/client_orders', 'exchange/order', 'exchange/trades', 'exchange/commission', 'exchange/commissionCommonInfo', 'payment/balances', 'payment/balance', 'payment/get/address', 'payment/history/size', 'payment/history/transactions'],
                        'post': ['exchange/buylimit', 'exchange/buymarket', 'exchange/cancellimit', 'exchange/selllimit', 'exchange/sellmarket', 'payment/out/capitalist', 'payment/out/card', 'payment/out/coin', 'payment/out/okpay', 'payment/out/payeer', 'payment/out/perfectmoney', 'payment/voucher/amount', 'payment/voucher/make', 'payment/voucher/redeem']
                    }
                },
                'fees': {
                    'trading': {
                        'tierBased': false,
                        'percentage': true,
                        'maker': 0.18 / 100,
                        'taker': 0.18 / 100
                    }
                }
            });
        }
    }, {
        key: 'fetchMarkets',
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                var markets, restrictions, restrictionsById, result, p, market, id, symbol, _symbol$split, _symbol$split2, base, quote, coinRestrictions, precision, limits;

                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.publicGetExchangeTicker();

                            case 2:
                                markets = _context.sent;
                                _context.next = 5;
                                return this.publicGetExchangeRestrictions();

                            case 5:
                                restrictions = _context.sent;
                                restrictionsById = this.indexBy(restrictions['restrictions'], 'currencyPair');
                                result = [];

                                for (p = 0; p < markets.length; p++) {
                                    market = markets[p];
                                    id = market['symbol'];
                                    symbol = id;
                                    _symbol$split = symbol.split('/'), _symbol$split2 = _slicedToArray(_symbol$split, 2), base = _symbol$split2[0], quote = _symbol$split2[1];
                                    coinRestrictions = this.safeValue(restrictionsById, symbol);
                                    precision = {
                                        'price': 5,
                                        'amount': 8,
                                        'cost': 8
                                    };
                                    limits = {
                                        'amount': {
                                            'min': Math.pow(10, -precision['amount']),
                                            'max': Math.pow(10, precision['amount'])
                                        }
                                    };

                                    if (coinRestrictions) {
                                        precision['price'] = this.safeInteger(coinRestrictions, 'priceScale', 5);
                                        limits['amount']['min'] = this.safeFloat(coinRestrictions, 'minLimitQuantity', limits['amount']['min']);
                                    }
                                    limits['price'] = {
                                        'min': Math.pow(10, -precision['price']),
                                        'max': Math.pow(10, precision['price'])
                                    };
                                    result.push(this.extend(this.fees['trading'], {
                                        'id': id,
                                        'symbol': symbol,
                                        'base': base,
                                        'quote': quote,
                                        'precision': precision,
                                        'limits': limits,
                                        'info': market
                                    }));
                                }
                                return _context.abrupt('return', result);

                            case 10:
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
        key: 'fetchCurrencies',
        value: function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
                var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var response, currencies, result, i, currency, id, code, precision, active;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this.publicGetInfoCoinInfo(params);

                            case 2:
                                response = _context2.sent;
                                currencies = response['info'];
                                result = {};

                                for (i = 0; i < currencies.length; i++) {
                                    currency = currencies[i];
                                    id = currency['symbol'];
                                    // todo: will need to rethink the fees
                                    // to add support for multiple withdrawal/deposit methods and
                                    // differentiated fees for each particular method

                                    code = this.commonCurrencyCode(id);
                                    precision = 8; // default precision, todo: fix "magic constants"

                                    active = currency['walletStatus'] == 'normal';

                                    result[code] = {
                                        'id': id,
                                        'code': code,
                                        'info': currency,
                                        'name': currency['name'],
                                        'active': active,
                                        'status': 'ok',
                                        'fee': currency['withdrawFee'], // todo: redesign
                                        'precision': precision,
                                        'limits': {
                                            'amount': {
                                                'min': currency['minOrderAmount'],
                                                'max': Math.pow(10, precision)
                                            },
                                            'price': {
                                                'min': Math.pow(10, -precision),
                                                'max': Math.pow(10, precision)
                                            },
                                            'cost': {
                                                'min': currency['minOrderAmount'],
                                                'max': undefined
                                            },
                                            'withdraw': {
                                                'min': currency['minWithdrawAmount'],
                                                'max': Math.pow(10, precision)
                                            },
                                            'deposit': {
                                                'min': currency['minDepositAmount'],
                                                'max': undefined
                                            }
                                        }
                                    };
                                }
                                return _context2.abrupt('return', result);

                            case 7:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function fetchCurrencies() {
                return _ref2.apply(this, arguments);
            }

            return fetchCurrencies;
        }()
    }, {
        key: 'fetchBalance',
        value: function () {
            var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
                var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var balances, result, b, balance, currency, account;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context3.next = 4;
                                return this.privateGetPaymentBalances();

                            case 4:
                                balances = _context3.sent;
                                result = { 'info': balances };

                                for (b = 0; b < balances.length; b++) {
                                    balance = balances[b];
                                    currency = balance['currency'];
                                    account = undefined;

                                    if (currency in result) account = result[currency];else account = this.account();
                                    if (balance['type'] == 'total') account['total'] = parseFloat(balance['value']);
                                    if (balance['type'] == 'available') account['free'] = parseFloat(balance['value']);
                                    if (balance['type'] == 'trade') account['used'] = parseFloat(balance['value']);
                                    result[currency] = account;
                                }
                                return _context3.abrupt('return', this.parseBalance(result));

                            case 8:
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
        key: 'fetchFees',
        value: function () {
            var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
                var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var commissionInfo, commission;
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context4.next = 4;
                                return this.privateGetExchangeCommissionCommonInfo();

                            case 4:
                                commissionInfo = _context4.sent;
                                commission = this.safeFloat(commissionInfo, 'commission');
                                return _context4.abrupt('return', {
                                    'info': commissionInfo,
                                    'maker': commission,
                                    'taker': commission,
                                    'withdraw': 0.0
                                });

                            case 7:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function fetchFees() {
                return _ref4.apply(this, arguments);
            }

            return fetchFees;
        }()
    }, {
        key: 'fetchOrderBook',
        value: function () {
            var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var orderbook, timestamp;
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context5.next = 4;
                                return this.publicGetExchangeOrderBook(this.extend({
                                    'currencyPair': this.marketId(symbol),
                                    'groupByPrice': 'false',
                                    'depth': 100
                                }, params));

                            case 4:
                                orderbook = _context5.sent;
                                timestamp = orderbook['timestamp'];
                                return _context5.abrupt('return', this.parseOrderBook(orderbook, timestamp));

                            case 7:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function fetchOrderBook(_x5) {
                return _ref5.apply(this, arguments);
            }

            return fetchOrderBook;
        }()
    }, {
        key: 'parseTicker',
        value: function parseTicker(ticker) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var timestamp = this.milliseconds();
            var symbol = undefined;
            if (market) symbol = market['symbol'];
            var vwap = parseFloat(ticker['vwap']);
            var baseVolume = parseFloat(ticker['volume']);
            var quoteVolume = baseVolume * vwap;
            return {
                'symbol': symbol,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'high': parseFloat(ticker['high']),
                'low': parseFloat(ticker['low']),
                'bid': parseFloat(ticker['best_bid']),
                'ask': parseFloat(ticker['best_ask']),
                'vwap': parseFloat(ticker['vwap']),
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
            };
        }
    }, {
        key: 'fetchTickers',
        value: function () {
            var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
                var symbols = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var response, tickers, ids, result, i, id, market, symbol, ticker;
                return regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                _context6.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context6.next = 4;
                                return this.publicGetExchangeTicker(params);

                            case 4:
                                response = _context6.sent;
                                tickers = this.indexBy(response, 'symbol');
                                ids = Object.keys(tickers);
                                result = {};

                                for (i = 0; i < ids.length; i++) {
                                    id = ids[i];
                                    market = this.markets_by_id[id];
                                    symbol = market['symbol'];
                                    ticker = tickers[id];

                                    result[symbol] = this.parseTicker(ticker, market);
                                }
                                return _context6.abrupt('return', result);

                            case 10:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function fetchTickers() {
                return _ref6.apply(this, arguments);
            }

            return fetchTickers;
        }()
    }, {
        key: 'fetchTicker',
        value: function () {
            var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var market, ticker;
                return regeneratorRuntime.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                _context7.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                _context7.next = 5;
                                return this.publicGetExchangeTicker(this.extend({
                                    'currencyPair': market['id']
                                }, params));

                            case 5:
                                ticker = _context7.sent;
                                return _context7.abrupt('return', this.parseTicker(ticker, market));

                            case 7:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function fetchTicker(_x10) {
                return _ref7.apply(this, arguments);
            }

            return fetchTicker;
        }()
    }, {
        key: 'parseTrade',
        value: function parseTrade(trade, market) {
            var timestamp = trade['time'] * 1000;
            return {
                'info': trade,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'symbol': market['symbol'],
                'id': trade['id'].toString(),
                'order': undefined,
                'type': undefined,
                'side': trade['type'].toLowerCase(),
                'price': trade['price'],
                'amount': trade['quantity']
            };
        }
    }, {
        key: 'fetchTrades',
        value: function () {
            var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(symbol) {
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var market, response;
                return regeneratorRuntime.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                _context8.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                _context8.next = 5;
                                return this.publicGetExchangeLastTrades(this.extend({
                                    'currencyPair': market['id']
                                }, params));

                            case 5:
                                response = _context8.sent;
                                return _context8.abrupt('return', this.parseTrades(response, market, since, limit));

                            case 7:
                            case 'end':
                                return _context8.stop();
                        }
                    }
                }, _callee8, this);
            }));

            function fetchTrades(_x14) {
                return _ref8.apply(this, arguments);
            }

            return fetchTrades;
        }()
    }, {
        key: 'parseOrder',
        value: function parseOrder(order) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var timestamp = this.safeInteger(order, 'lastModificationTime');
            if (!timestamp) timestamp = this.parse8601(order['lastModificationTime']);
            var trades = undefined;
            if ('trades' in order)
                // TODO currently not supported by livecoin
                // trades = this.parseTrades (order['trades'], market, since, limit);
                trades = undefined;
            var status = undefined;
            if (order['orderStatus'] == 'OPEN' || order['orderStatus'] == 'PARTIALLY_FILLED') {
                status = 'open';
            } else if (order['orderStatus'] == 'EXECUTED' || order['orderStatus'] == 'PARTIALLY_FILLED_AND_CANCELLED') {
                status = 'closed';
            } else {
                status = 'canceled';
            }
            var symbol = order['currencyPair'];

            var _symbol$split3 = symbol.split('/'),
                _symbol$split4 = _slicedToArray(_symbol$split3, 2),
                base = _symbol$split4[0],
                quote = _symbol$split4[1];

            var type = undefined;
            var side = undefined;
            if (order['type'].indexOf('MARKET') >= 0) {
                type = 'market';
            } else {
                type = 'limit';
            }
            if (order['type'].indexOf('SELL') >= 0) {
                side = 'sell';
            } else {
                side = 'buy';
            }
            var price = this.safeFloat(order, 'price', 0.0);
            var cost = this.safeFloat(order, 'commissionByTrade', 0.0);
            var remaining = this.safeFloat(order, 'remainingQuantity', 0.0);
            var amount = this.safeFloat(order, 'quantity', remaining);
            var filled = amount - remaining;
            return {
                'info': order,
                'id': order['id'],
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'status': status,
                'symbol': symbol,
                'type': type,
                'side': side,
                'price': price,
                'cost': cost,
                'amount': amount,
                'filled': filled,
                'remaining': remaining,
                'trades': trades,
                'fee': {
                    'cost': cost,
                    'currency': quote
                }
            };
        }
    }, {
        key: 'fetchOrders',
        value: function () {
            var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
                var symbol = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var market, pair, request, response, result, rawOrders, i, order;
                return regeneratorRuntime.wrap(function _callee9$(_context9) {
                    while (1) {
                        switch (_context9.prev = _context9.next) {
                            case 0:
                                _context9.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = undefined;

                                if (symbol) market = this.market(symbol);
                                pair = market ? market['id'] : undefined;
                                request = {};

                                if (pair) request['currencyPair'] = pair;
                                if (since) request['issuedFrom'] = parseInt(since);
                                if (limit) request['endRow'] = limit - 1;
                                _context9.next = 11;
                                return this.privateGetExchangeClientOrders(this.extend(request, params));

                            case 11:
                                response = _context9.sent;
                                result = [];
                                rawOrders = [];

                                if (response['data']) rawOrders = response['data'];
                                for (i = 0; i < rawOrders.length; i++) {
                                    order = rawOrders[i];

                                    result.push(this.parseOrder(order, market));
                                }
                                return _context9.abrupt('return', result);

                            case 17:
                            case 'end':
                                return _context9.stop();
                        }
                    }
                }, _callee9, this);
            }));

            function fetchOrders() {
                return _ref9.apply(this, arguments);
            }

            return fetchOrders;
        }()
    }, {
        key: 'fetchOpenOrders',
        value: function () {
            var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
                var symbol = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var result;
                return regeneratorRuntime.wrap(function _callee10$(_context10) {
                    while (1) {
                        switch (_context10.prev = _context10.next) {
                            case 0:
                                _context10.next = 2;
                                return this.fetchOrders(symbol, since, limit, this.extend({
                                    'openClosed': 'OPEN'
                                }, params));

                            case 2:
                                result = _context10.sent;
                                return _context10.abrupt('return', result);

                            case 4:
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
        key: 'fetchClosedOrders',
        value: function () {
            var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11() {
                var symbol = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var result;
                return regeneratorRuntime.wrap(function _callee11$(_context11) {
                    while (1) {
                        switch (_context11.prev = _context11.next) {
                            case 0:
                                _context11.next = 2;
                                return this.fetchOrders(symbol, since, limit, this.extend({
                                    'openClosed': 'CLOSED'
                                }, params));

                            case 2:
                                result = _context11.sent;
                                return _context11.abrupt('return', result);

                            case 4:
                            case 'end':
                                return _context11.stop();
                        }
                    }
                }, _callee11, this);
            }));

            function fetchClosedOrders() {
                return _ref11.apply(this, arguments);
            }

            return fetchClosedOrders;
        }()
    }, {
        key: 'createOrder',
        value: function () {
            var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(symbol, type, side, amount) {
                var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
                var method, market, order, response;
                return regeneratorRuntime.wrap(function _callee12$(_context12) {
                    while (1) {
                        switch (_context12.prev = _context12.next) {
                            case 0:
                                _context12.next = 2;
                                return this.loadMarkets();

                            case 2:
                                method = 'privatePostExchange' + this.capitalize(side) + type;
                                market = this.market(symbol);
                                order = {
                                    'quantity': this.amountToPrecision(symbol, amount),
                                    'currencyPair': market['id']
                                };

                                if (type == 'limit') order['price'] = this.priceToPrecision(symbol, price);
                                _context12.next = 8;
                                return this[method](this.extend(order, params));

                            case 8:
                                response = _context12.sent;
                                return _context12.abrupt('return', {
                                    'info': response,
                                    'id': response['orderId'].toString()
                                });

                            case 10:
                            case 'end':
                                return _context12.stop();
                        }
                    }
                }, _callee12, this);
            }));

            function createOrder(_x30, _x31, _x32, _x33) {
                return _ref12.apply(this, arguments);
            }

            return createOrder;
        }()
    }, {
        key: 'cancelOrder',
        value: function () {
            var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(id) {
                var symbol = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
                var market, currencyPair, response, message;
                return regeneratorRuntime.wrap(function _callee13$(_context13) {
                    while (1) {
                        switch (_context13.prev = _context13.next) {
                            case 0:
                                if (symbol) {
                                    _context13.next = 2;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' cancelOrder requires a symbol argument');

                            case 2:
                                _context13.next = 4;
                                return this.loadMarkets();

                            case 4:
                                market = this.market(symbol);
                                currencyPair = market['id'];
                                _context13.next = 8;
                                return this.privatePostExchangeCancellimit(this.extend({
                                    'orderId': id,
                                    'currencyPair': currencyPair
                                }, params));

                            case 8:
                                response = _context13.sent;
                                message = this.safeString(response, 'message', this.json(response));

                                if (!('success' in response)) {
                                    _context13.next = 21;
                                    break;
                                }

                                if (response['success']) {
                                    _context13.next = 15;
                                    break;
                                }

                                throw new InvalidOrder(message);

                            case 15:
                                if (!('cancelled' in response)) {
                                    _context13.next = 21;
                                    break;
                                }

                                if (!response['cancelled']) {
                                    _context13.next = 20;
                                    break;
                                }

                                return _context13.abrupt('return', response);

                            case 20:
                                throw new OrderNotFound(message);

                            case 21:
                                throw new ExchangeError(this.id + ' cancelOrder() failed: ' + this.json(response));

                            case 22:
                            case 'end':
                                return _context13.stop();
                        }
                    }
                }, _callee13, this);
            }));

            function cancelOrder(_x36) {
                return _ref13.apply(this, arguments);
            }

            return cancelOrder;
        }()
    }, {
        key: 'fetchDepositAddress',
        value: function () {
            var _ref14 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14(currency) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var request, response, address;
                return regeneratorRuntime.wrap(function _callee14$(_context14) {
                    while (1) {
                        switch (_context14.prev = _context14.next) {
                            case 0:
                                request = {
                                    'currency': currency
                                };
                                _context14.next = 3;
                                return this.privateGetPaymentGetAddress(this.extend(request, params));

                            case 3:
                                response = _context14.sent;
                                address = this.safeString(response, 'wallet');
                                return _context14.abrupt('return', {
                                    'currency': currency,
                                    'address': address,
                                    'status': 'ok',
                                    'info': response
                                });

                            case 6:
                            case 'end':
                                return _context14.stop();
                        }
                    }
                }, _callee14, this);
            }));

            function fetchDepositAddress(_x38) {
                return _ref14.apply(this, arguments);
            }

            return fetchDepositAddress;
        }()
    }, {
        key: 'sign',
        value: function sign(path) {
            var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var url = this.urls['api'] + '/' + path;
            var query = this.urlencode(this.keysort(params));
            if (method == 'GET') {
                if (Object.keys(params).length) {
                    url += '?' + query;
                }
            }
            if (api == 'private') {
                this.checkRequiredCredentials();
                if (method == 'POST') body = query;
                var signature = this.hmac(this.encode(query), this.encode(this.secret), 'sha256');
                headers = {
                    'Api-Key': this.apiKey,
                    'Sign': signature.toUpperCase(),
                    'Content-Type': 'application/x-www-form-urlencoded'
                };
            }
            return { 'url': url, 'method': method, 'body': body, 'headers': headers };
        }
    }, {
        key: 'handleErrors',
        value: function handleErrors(code, reason, url, method, headers, body) {
            if (code >= 300) {
                if (body[0] == "{") {
                    var response = JSON.parse(body);
                    if ('errorCode' in response) {
                        var error = response['errorCode'];
                        if (error == 1) {
                            throw new ExchangeError(this.id + ' ' + this.json(response));
                        } else if (error == 2) {
                            if ('errorMessage' in response) {
                                if (response['errorMessage'] == 'User not found') throw new AuthenticationError(this.id + ' ' + response['errorMessage']);
                            } else {
                                throw new ExchangeError(this.id + ' ' + this.json(response));
                            }
                        } else if (error == 10 || error == 11 || error == 12 || error == 20 || error == 30 || error == 101 || error == 102) {
                            throw new AuthenticationError(this.id + ' ' + this.json(response));
                        } else if (error == 31) {
                            throw new NotSupported(this.id + ' ' + this.json(response));
                        } else if (error == 32) {
                            throw new ExchangeError(this.id + ' ' + this.json(response));
                        } else if (error == 100) {
                            throw new ExchangeError(this.id + ': Invalid parameters ' + this.json(response));
                        } else if (error == 103) {
                            throw new InvalidOrder(this.id + ': Invalid currency ' + this.json(response));
                        } else if (error == 104) {
                            throw new InvalidOrder(this.id + ': Invalid amount ' + this.json(response));
                        } else if (error == 105) {
                            throw new InvalidOrder(this.id + ': Unable to block funds ' + this.json(response));
                        } else {
                            throw new ExchangeError(this.id + ' ' + this.json(response));
                        }
                    }
                }
                throw new ExchangeError(this.id + ' ' + body);
            }
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
                                    _context15.next = 6;
                                    break;
                                }

                                if (response['success']) {
                                    _context15.next = 6;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' error: ' + this.json(response));

                            case 6:
                                return _context15.abrupt('return', response);

                            case 7:
                            case 'end':
                                return _context15.stop();
                        }
                    }
                }, _callee15, this);
            }));

            function request(_x49) {
                return _ref15.apply(this, arguments);
            }

            return request;
        }()
    }]);

    return livecoin;
}(Exchange);