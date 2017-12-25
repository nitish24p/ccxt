"use strict";

//  ---------------------------------------------------------------------------

import _slicedToArray from 'babel-runtime/helpers/slicedToArray';
import _Object$keys from 'babel-runtime/core-js/object/keys';
import _regeneratorRuntime from 'babel-runtime/regenerator';
import _asyncToGenerator from 'babel-runtime/helpers/asyncToGenerator';
import _Object$getPrototypeOf from 'babel-runtime/core-js/object/get-prototype-of';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _get from 'babel-runtime/helpers/get';
import _inherits from 'babel-runtime/helpers/inherits';
var Exchange = require('./base/Exchange');

var _require = require('./base/errors'),
    ExchangeError = _require.ExchangeError,
    InvalidOrder = _require.InvalidOrder,
    InsufficientFunds = _require.InsufficientFunds,
    OrderNotFound = _require.OrderNotFound,
    DDoSProtection = _require.DDoSProtection;

//  ---------------------------------------------------------------------------

module.exports = function (_Exchange) {
    _inherits(bittrex, _Exchange);

    function bittrex() {
        _classCallCheck(this, bittrex);

        return _possibleConstructorReturn(this, (bittrex.__proto__ || _Object$getPrototypeOf(bittrex)).apply(this, arguments));
    }

    _createClass(bittrex, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend(_get(bittrex.prototype.__proto__ || _Object$getPrototypeOf(bittrex.prototype), 'describe', this).call(this), {
                'id': 'bittrex',
                'name': 'Bittrex',
                'countries': 'US',
                'version': 'v1.1',
                'rateLimit': 1500,
                'hasAlreadyAuthenticatedSuccessfully': false, // a workaround for APIKEY_INVALID
                'hasCORS': false,
                // obsolete metainfo interface
                'hasFetchTickers': true,
                'hasFetchOHLCV': true,
                'hasFetchOrder': true,
                'hasFetchOrders': true,
                'hasFetchClosedOrders': true,
                'hasFetchOpenOrders': true,
                'hasFetchMyTrades': false,
                'hasFetchCurrencies': true,
                'hasWithdraw': true,
                // new metainfo interface
                'has': {
                    'fetchTickers': true,
                    'fetchOHLCV': true,
                    'fetchOrder': true,
                    'fetchOrders': true,
                    'fetchClosedOrders': 'emulated',
                    'fetchOpenOrders': true,
                    'fetchMyTrades': false,
                    'fetchCurrencies': true,
                    'withdraw': true
                },
                'timeframes': {
                    '1m': 'oneMin',
                    '5m': 'fiveMin',
                    '30m': 'thirtyMin',
                    '1h': 'hour',
                    '1d': 'day'
                },
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/27766352-cf0b3c26-5ed5-11e7-82b7-f3826b7a97d8.jpg',
                    'api': {
                        'public': 'https://bittrex.com/api',
                        'account': 'https://bittrex.com/api',
                        'market': 'https://bittrex.com/api',
                        'v2': 'https://bittrex.com/api/v2.0/pub'
                    },
                    'www': 'https://bittrex.com',
                    'doc': ['https://bittrex.com/Home/Api', 'https://www.npmjs.org/package/node.bittrex.api'],
                    'fees': ['https://bittrex.com/Fees', 'https://support.bittrex.com/hc/en-us/articles/115000199651-What-fees-does-Bittrex-charge-']
                },
                'api': {
                    'v2': {
                        'get': ['currencies/GetBTCPrice', 'market/GetTicks', 'market/GetLatestTick', 'Markets/GetMarketSummaries', 'market/GetLatestTick']
                    },
                    'public': {
                        'get': ['currencies', 'markethistory', 'markets', 'marketsummaries', 'marketsummary', 'orderbook', 'ticker']
                    },
                    'account': {
                        'get': ['balance', 'balances', 'depositaddress', 'deposithistory', 'order', 'orderhistory', 'withdrawalhistory', 'withdraw']
                    },
                    'market': {
                        'get': ['buylimit', 'buymarket', 'cancel', 'openorders', 'selllimit', 'sellmarket']
                    }
                },
                'fees': {
                    'trading': {
                        'tierBased': false,
                        'percentage': true,
                        'maker': 0.0025,
                        'taker': 0.0025
                    },
                    'funding': {
                        'tierBased': false,
                        'percentage': false,
                        'withdraw': {
                            'BTC': 0.001,
                            'LTC': 0.01,
                            'DOGE': 2,
                            'VTC': 0.02,
                            'PPC': 0.02,
                            'FTC': 0.2,
                            'RDD': 2,
                            'NXT': 2,
                            'DASH': 0.002,
                            'POT': 0.002
                        },
                        'deposit': {
                            'BTC': 0,
                            'LTC': 0,
                            'DOGE': 0,
                            'VTC': 0,
                            'PPC': 0,
                            'FTC': 0,
                            'RDD': 0,
                            'NXT': 0,
                            'DASH': 0,
                            'POT': 0
                        }
                    }
                }
            });
        }
    }, {
        key: 'costToPrecision',
        value: function costToPrecision(symbol, cost) {
            return this.truncate(parseFloat(cost), this.markets[symbol]['precision']['price']);
        }
    }, {
        key: 'feeToPrecision',
        value: function feeToPrecision(symbol, fee) {
            return this.truncate(parseFloat(fee), this.markets[symbol]['precision']['price']);
        }
    }, {
        key: 'fetchMarkets',
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
                var response, result, i, market, id, base, quote, symbol, precision, active;
                return _regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.v2GetMarketsGetMarketSummaries();

                            case 2:
                                response = _context.sent;
                                result = [];

                                for (i = 0; i < response['result'].length; i++) {
                                    market = response['result'][i]['Market'];
                                    id = market['MarketName'];
                                    base = market['MarketCurrency'];
                                    quote = market['BaseCurrency'];

                                    base = this.commonCurrencyCode(base);
                                    quote = this.commonCurrencyCode(quote);
                                    symbol = base + '/' + quote;
                                    precision = {
                                        'amount': 8,
                                        'price': 8
                                    };
                                    active = market['IsActive'];

                                    result.push(this.extend(this.fees['trading'], {
                                        'id': id,
                                        'symbol': symbol,
                                        'base': base,
                                        'quote': quote,
                                        'active': active,
                                        'info': market,
                                        'lot': Math.pow(10, -precision['amount']),
                                        'precision': precision,
                                        'limits': {
                                            'amount': {
                                                'min': market['MinTradeSize'],
                                                'max': undefined
                                            },
                                            'price': {
                                                'min': undefined,
                                                'max': undefined
                                            }
                                        }
                                    }));
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
            var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2() {
                var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var response, balances, result, indexed, keys, i, id, currency, account, balance, free, total, used;
                return _regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context2.next = 4;
                                return this.accountGetBalances();

                            case 4:
                                response = _context2.sent;
                                balances = response['result'];
                                result = { 'info': balances };
                                indexed = this.indexBy(balances, 'Currency');
                                keys = _Object$keys(indexed);

                                for (i = 0; i < keys.length; i++) {
                                    id = keys[i];
                                    currency = this.commonCurrencyCode(id);
                                    account = this.account();
                                    balance = indexed[id];
                                    free = parseFloat(balance['Available']);
                                    total = parseFloat(balance['Balance']);
                                    used = total - free;

                                    account['free'] = free;
                                    account['used'] = used;
                                    account['total'] = total;
                                    result[currency] = account;
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
            var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var response, orderbook;
                return _regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context3.next = 4;
                                return this.publicGetOrderbook(this.extend({
                                    'market': this.marketId(symbol),
                                    'type': 'both'
                                }, params));

                            case 4:
                                response = _context3.sent;
                                orderbook = response['result'];

                                if ('type' in params) {
                                    if (params['type'] == 'buy') {
                                        orderbook = {
                                            'buy': response['result'],
                                            'sell': []
                                        };
                                    } else if (params['type'] == 'sell') {
                                        orderbook = {
                                            'buy': [],
                                            'sell': response['result']
                                        };
                                    }
                                }
                                return _context3.abrupt('return', this.parseOrderBook(orderbook, undefined, 'buy', 'sell', 'Rate', 'Quantity'));

                            case 8:
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
        key: 'parseTicker',
        value: function parseTicker(ticker) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var timestamp = this.parse8601(ticker['TimeStamp']);
            var symbol = undefined;
            if (market) symbol = market['symbol'];
            return {
                'symbol': symbol,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'high': this.safeFloat(ticker, 'High'),
                'low': this.safeFloat(ticker, 'Low'),
                'bid': this.safeFloat(ticker, 'Bid'),
                'ask': this.safeFloat(ticker, 'Ask'),
                'vwap': undefined,
                'open': undefined,
                'close': undefined,
                'first': undefined,
                'last': this.safeFloat(ticker, 'Last'),
                'change': undefined,
                'percentage': undefined,
                'average': undefined,
                'baseVolume': this.safeFloat(ticker, 'Volume'),
                'quoteVolume': this.safeFloat(ticker, 'BaseVolume'),
                'info': ticker
            };
        }
    }, {
        key: 'fetchCurrencies',
        value: function () {
            var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee4() {
                var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var response, currencies, result, i, currency, id, code, precision;
                return _regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                return this.publicGetCurrencies(params);

                            case 2:
                                response = _context4.sent;
                                currencies = response['result'];
                                result = {};

                                for (i = 0; i < currencies.length; i++) {
                                    currency = currencies[i];
                                    id = currency['Currency'];
                                    // todo: will need to rethink the fees
                                    // to add support for multiple withdrawal/deposit methods and
                                    // differentiated fees for each particular method

                                    code = this.commonCurrencyCode(id);
                                    precision = 8; // default precision, todo: fix "magic constants"

                                    result[code] = {
                                        'id': id,
                                        'code': code,
                                        'info': currency,
                                        'name': currency['CurrencyLong'],
                                        'active': currency['IsActive'],
                                        'status': 'ok',
                                        'fee': currency['TxFee'], // todo: redesign
                                        'precision': precision,
                                        'limits': {
                                            'amount': {
                                                'min': Math.pow(10, -precision),
                                                'max': Math.pow(10, precision)
                                            },
                                            'price': {
                                                'min': Math.pow(10, -precision),
                                                'max': Math.pow(10, precision)
                                            },
                                            'cost': {
                                                'min': undefined,
                                                'max': undefined
                                            },
                                            'withdraw': {
                                                'min': currency['TxFee'],
                                                'max': Math.pow(10, precision)
                                            }
                                        }
                                    };
                                }
                                return _context4.abrupt('return', result);

                            case 7:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function fetchCurrencies() {
                return _ref4.apply(this, arguments);
            }

            return fetchCurrencies;
        }()
    }, {
        key: 'fetchTickers',
        value: function () {
            var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee5() {
                var symbols = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

                var response, tickers, result, t, ticker, id, market, symbol, _id$split, _id$split2, quote, base;

                return _regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context5.next = 4;
                                return this.publicGetMarketsummaries(params);

                            case 4:
                                response = _context5.sent;
                                tickers = response['result'];
                                result = {};

                                for (t = 0; t < tickers.length; t++) {
                                    ticker = tickers[t];
                                    id = ticker['MarketName'];
                                    market = undefined;
                                    symbol = id;

                                    if (id in this.markets_by_id) {
                                        market = this.markets_by_id[id];
                                        symbol = market['symbol'];
                                    } else {
                                        _id$split = id.split('-'), _id$split2 = _slicedToArray(_id$split, 2), quote = _id$split2[0], base = _id$split2[1];

                                        base = this.commonCurrencyCode(base);
                                        quote = this.commonCurrencyCode(quote);
                                        symbol = base + '/' + quote;
                                    }
                                    result[symbol] = this.parseTicker(ticker, market);
                                }
                                return _context5.abrupt('return', result);

                            case 9:
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
            var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee6(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var market, response, ticker;
                return _regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                _context6.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                _context6.next = 5;
                                return this.publicGetMarketsummary(this.extend({
                                    'market': market['id']
                                }, params));

                            case 5:
                                response = _context6.sent;
                                ticker = response['result'][0];
                                return _context6.abrupt('return', this.parseTicker(ticker, market));

                            case 8:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function fetchTicker(_x9) {
                return _ref6.apply(this, arguments);
            }

            return fetchTicker;
        }()
    }, {
        key: 'parseTrade',
        value: function parseTrade(trade) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var timestamp = this.parse8601(trade['TimeStamp']);
            var side = undefined;
            if (trade['OrderType'] == 'BUY') {
                side = 'buy';
            } else if (trade['OrderType'] == 'SELL') {
                side = 'sell';
            }
            var id = undefined;
            if ('Id' in trade) id = trade['Id'].toString();
            return {
                'id': id,
                'info': trade,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'symbol': market['symbol'],
                'type': 'limit',
                'side': side,
                'price': parseFloat(trade['Price']),
                'amount': parseFloat(trade['Quantity'])
            };
        }
    }, {
        key: 'fetchTrades',
        value: function () {
            var _ref7 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee7(symbol) {
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var market, response;
                return _regeneratorRuntime.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                _context7.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                _context7.next = 5;
                                return this.publicGetMarkethistory(this.extend({
                                    'market': market['id']
                                }, params));

                            case 5:
                                response = _context7.sent;

                                if (!('result' in response)) {
                                    _context7.next = 9;
                                    break;
                                }

                                if (!(typeof response['result'] != 'undefined')) {
                                    _context7.next = 9;
                                    break;
                                }

                                return _context7.abrupt('return', this.parseTrades(response['result'], market, since, limit));

                            case 9:
                                throw new ExchangeError(this.id + ' fetchTrades() returned undefined response');

                            case 10:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function fetchTrades(_x14) {
                return _ref7.apply(this, arguments);
            }

            return fetchTrades;
        }()
    }, {
        key: 'parseOHLCV',
        value: function parseOHLCV(ohlcv) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
            var timeframe = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '1d';
            var since = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
            var limit = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;

            var timestamp = this.parse8601(ohlcv['T']);
            return [timestamp, ohlcv['O'], ohlcv['H'], ohlcv['L'], ohlcv['C'], ohlcv['V']];
        }
    }, {
        key: 'fetchOHLCV',
        value: function () {
            var _ref8 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee8(symbol) {
                var timeframe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '1m';
                var since = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var limit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
                var params = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
                var market, request, response;
                return _regeneratorRuntime.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                _context8.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                request = {
                                    'tickInterval': this.timeframes[timeframe],
                                    'marketName': market['id']
                                };
                                _context8.next = 6;
                                return this.v2GetMarketGetTicks(this.extend(request, params));

                            case 6:
                                response = _context8.sent;

                                if (!('result' in response)) {
                                    _context8.next = 10;
                                    break;
                                }

                                if (!response['result']) {
                                    _context8.next = 10;
                                    break;
                                }

                                return _context8.abrupt('return', this.parseOHLCVs(response['result'], market, timeframe, since, limit));

                            case 10:
                                throw new ExchangeError(this.id + ' returned an empty or unrecognized response: ' + this.json(response));

                            case 11:
                            case 'end':
                                return _context8.stop();
                        }
                    }
                }, _callee8, this);
            }));

            function fetchOHLCV(_x23) {
                return _ref8.apply(this, arguments);
            }

            return fetchOHLCV;
        }()
    }, {
        key: 'fetchOpenOrders',
        value: function () {
            var _ref9 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee9() {
                var symbol = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var request, market, response, orders;
                return _regeneratorRuntime.wrap(function _callee9$(_context9) {
                    while (1) {
                        switch (_context9.prev = _context9.next) {
                            case 0:
                                _context9.next = 2;
                                return this.loadMarkets();

                            case 2:
                                request = {};
                                market = undefined;

                                if (symbol) {
                                    market = this.market(symbol);
                                    request['market'] = market['id'];
                                }
                                _context9.next = 7;
                                return this.marketGetOpenorders(this.extend(request, params));

                            case 7:
                                response = _context9.sent;
                                orders = this.parseOrders(response['result'], market, since, limit);
                                return _context9.abrupt('return', this.filterOrdersBySymbol(orders, symbol));

                            case 10:
                            case 'end':
                                return _context9.stop();
                        }
                    }
                }, _callee9, this);
            }));

            function fetchOpenOrders() {
                return _ref9.apply(this, arguments);
            }

            return fetchOpenOrders;
        }()
    }, {
        key: 'createOrder',
        value: function () {
            var _ref10 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee10(symbol, type, side, amount) {
                var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
                var market, method, order, response, result;
                return _regeneratorRuntime.wrap(function _callee10$(_context10) {
                    while (1) {
                        switch (_context10.prev = _context10.next) {
                            case 0:
                                _context10.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                method = 'marketGet' + this.capitalize(side) + type;
                                order = {
                                    'market': market['id'],
                                    'quantity': this.amountToPrecision(symbol, amount)
                                };

                                if (type == 'limit') order['rate'] = this.priceToPrecision(symbol, price);
                                _context10.next = 8;
                                return this[method](this.extend(order, params));

                            case 8:
                                response = _context10.sent;
                                result = {
                                    'info': response,
                                    'id': response['result']['uuid']
                                };
                                return _context10.abrupt('return', result);

                            case 11:
                            case 'end':
                                return _context10.stop();
                        }
                    }
                }, _callee10, this);
            }));

            function createOrder(_x30, _x31, _x32, _x33) {
                return _ref10.apply(this, arguments);
            }

            return createOrder;
        }()
    }, {
        key: 'cancelOrder',
        value: function () {
            var _ref11 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee11(id) {
                var symbol = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
                var response, message;
                return _regeneratorRuntime.wrap(function _callee11$(_context11) {
                    while (1) {
                        switch (_context11.prev = _context11.next) {
                            case 0:
                                _context11.next = 2;
                                return this.loadMarkets();

                            case 2:
                                response = undefined;
                                _context11.prev = 3;
                                _context11.next = 6;
                                return this.marketGetCancel(this.extend({
                                    'uuid': id
                                }, params));

                            case 6:
                                response = _context11.sent;
                                _context11.next = 18;
                                break;

                            case 9:
                                _context11.prev = 9;
                                _context11.t0 = _context11['catch'](3);

                                if (!this.last_json_response) {
                                    _context11.next = 17;
                                    break;
                                }

                                message = this.safeString(this.last_json_response, 'message');

                                if (!(message == 'ORDER_NOT_OPEN')) {
                                    _context11.next = 15;
                                    break;
                                }

                                throw new InvalidOrder(this.id + ' cancelOrder() error: ' + this.last_http_response);

                            case 15:
                                if (!(message == 'UUID_INVALID')) {
                                    _context11.next = 17;
                                    break;
                                }

                                throw new OrderNotFound(this.id + ' cancelOrder() error: ' + this.last_http_response);

                            case 17:
                                throw _context11.t0;

                            case 18:
                                return _context11.abrupt('return', response);

                            case 19:
                            case 'end':
                                return _context11.stop();
                        }
                    }
                }, _callee11, this, [[3, 9]]);
            }));

            function cancelOrder(_x36) {
                return _ref11.apply(this, arguments);
            }

            return cancelOrder;
        }()
    }, {
        key: 'parseOrder',
        value: function parseOrder(order) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var side = undefined;
            if ('OrderType' in order) side = order['OrderType'] == 'LIMIT_BUY' ? 'buy' : 'sell';
            if ('Type' in order) side = order['Type'] == 'LIMIT_BUY' ? 'buy' : 'sell';
            var status = 'open';
            if (order['Closed']) {
                status = 'closed';
            } else if (order['CancelInitiated']) {
                status = 'canceled';
            }
            var symbol = undefined;
            if (!market) {
                if ('Exchange' in order) if (order['Exchange'] in this.markets_by_id) market = this.markets_by_id[order['Exchange']];
            }
            if (market) symbol = market['symbol'];
            var timestamp = undefined;
            if ('Opened' in order) timestamp = this.parse8601(order['Opened']);
            if ('TimeStamp' in order) timestamp = this.parse8601(order['TimeStamp']);
            var fee = undefined;
            var commission = undefined;
            if ('Commission' in order) {
                commission = 'Commission';
            } else if ('CommissionPaid' in order) {
                commission = 'CommissionPaid';
            }
            if (commission) {
                fee = {
                    'cost': parseFloat(order[commission]),
                    'currency': market['quote']
                };
            }
            var price = this.safeFloat(order, 'Limit');
            var cost = this.safeFloat(order, 'Price');
            var amount = this.safeFloat(order, 'Quantity');
            var remaining = this.safeFloat(order, 'QuantityRemaining', 0.0);
            var filled = amount - remaining;
            if (!cost) {
                if (price && amount) cost = price * amount;
            }
            if (!price) {
                if (cost && filled) price = cost / filled;
            }
            var average = this.safeFloat(order, 'PricePerUnit');
            var result = {
                'info': order,
                'id': order['OrderUuid'],
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'symbol': symbol,
                'type': 'limit',
                'side': side,
                'price': price,
                'cost': cost,
                'average': average,
                'amount': amount,
                'filled': filled,
                'remaining': remaining,
                'status': status,
                'fee': fee
            };
            return result;
        }
    }, {
        key: 'fetchOrder',
        value: function () {
            var _ref12 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee12(id) {
                var symbol = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
                var response, message;
                return _regeneratorRuntime.wrap(function _callee12$(_context12) {
                    while (1) {
                        switch (_context12.prev = _context12.next) {
                            case 0:
                                _context12.next = 2;
                                return this.loadMarkets();

                            case 2:
                                response = undefined;
                                _context12.prev = 3;
                                _context12.next = 6;
                                return this.accountGetOrder(this.extend({ 'uuid': id }, params));

                            case 6:
                                response = _context12.sent;
                                _context12.next = 16;
                                break;

                            case 9:
                                _context12.prev = 9;
                                _context12.t0 = _context12['catch'](3);

                                if (!this.last_json_response) {
                                    _context12.next = 15;
                                    break;
                                }

                                message = this.safeString(this.last_json_response, 'message');

                                if (!(message == 'UUID_INVALID')) {
                                    _context12.next = 15;
                                    break;
                                }

                                throw new OrderNotFound(this.id + ' fetchOrder() error: ' + this.last_http_response);

                            case 15:
                                throw _context12.t0;

                            case 16:
                                return _context12.abrupt('return', this.parseOrder(response['result']));

                            case 17:
                            case 'end':
                                return _context12.stop();
                        }
                    }
                }, _callee12, this, [[3, 9]]);
            }));

            function fetchOrder(_x40) {
                return _ref12.apply(this, arguments);
            }

            return fetchOrder;
        }()
    }, {
        key: 'fetchOrders',
        value: function () {
            var _ref13 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee13() {
                var symbol = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var request, market, response, orders;
                return _regeneratorRuntime.wrap(function _callee13$(_context13) {
                    while (1) {
                        switch (_context13.prev = _context13.next) {
                            case 0:
                                _context13.next = 2;
                                return this.loadMarkets();

                            case 2:
                                request = {};
                                market = undefined;

                                if (symbol) {
                                    market = this.market(symbol);
                                    request['market'] = market['id'];
                                }
                                _context13.next = 7;
                                return this.accountGetOrderhistory(this.extend(request, params));

                            case 7:
                                response = _context13.sent;
                                orders = this.parseOrders(response['result'], market, since, limit);
                                return _context13.abrupt('return', this.filterOrdersBySymbol(orders, symbol));

                            case 10:
                            case 'end':
                                return _context13.stop();
                        }
                    }
                }, _callee13, this);
            }));

            function fetchOrders() {
                return _ref13.apply(this, arguments);
            }

            return fetchOrders;
        }()
    }, {
        key: 'fetchClosedOrders',
        value: function () {
            var _ref14 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee14() {
                var symbol = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var orders;
                return _regeneratorRuntime.wrap(function _callee14$(_context14) {
                    while (1) {
                        switch (_context14.prev = _context14.next) {
                            case 0:
                                _context14.next = 2;
                                return this.fetchOrders(symbol, params);

                            case 2:
                                orders = _context14.sent;
                                return _context14.abrupt('return', this.filterBy(orders, 'status', 'closed'));

                            case 4:
                            case 'end':
                                return _context14.stop();
                        }
                    }
                }, _callee14, this);
            }));

            function fetchClosedOrders() {
                return _ref14.apply(this, arguments);
            }

            return fetchClosedOrders;
        }()
    }, {
        key: 'currencyId',
        value: function currencyId(currency) {
            if (currency == 'BCH') return 'BCC';
            return currency;
        }
    }, {
        key: 'fetchDepositAddress',
        value: function () {
            var _ref15 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee15(currency) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var currencyId, response, address, message, status;
                return _regeneratorRuntime.wrap(function _callee15$(_context15) {
                    while (1) {
                        switch (_context15.prev = _context15.next) {
                            case 0:
                                currencyId = this.currencyId(currency);
                                _context15.next = 3;
                                return this.accountGetDepositaddress(this.extend({
                                    'currency': currencyId
                                }, params));

                            case 3:
                                response = _context15.sent;
                                address = this.safeString(response['result'], 'Address');
                                message = this.safeString(response, 'message');
                                status = 'ok';

                                if (!address || message == 'ADDRESS_GENERATING') status = 'pending';
                                return _context15.abrupt('return', {
                                    'currency': currency,
                                    'address': address,
                                    'status': status,
                                    'info': response
                                });

                            case 9:
                            case 'end':
                                return _context15.stop();
                        }
                    }
                }, _callee15, this);
            }));

            function fetchDepositAddress(_x50) {
                return _ref15.apply(this, arguments);
            }

            return fetchDepositAddress;
        }()
    }, {
        key: 'withdraw',
        value: function () {
            var _ref16 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee16(currency, amount, address) {
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var currencyId, response, id;
                return _regeneratorRuntime.wrap(function _callee16$(_context16) {
                    while (1) {
                        switch (_context16.prev = _context16.next) {
                            case 0:
                                currencyId = this.currencyId(currency);
                                _context16.next = 3;
                                return this.accountGetWithdraw(this.extend({
                                    'currency': currencyId,
                                    'quantity': amount,
                                    'address': address
                                }, params));

                            case 3:
                                response = _context16.sent;
                                id = undefined;

                                if ('result' in response) {
                                    if ('uuid' in response['result']) id = response['result']['uuid'];
                                }
                                return _context16.abrupt('return', {
                                    'info': response,
                                    'id': id
                                });

                            case 7:
                            case 'end':
                                return _context16.stop();
                        }
                    }
                }, _callee16, this);
            }));

            function withdraw(_x52, _x53, _x54) {
                return _ref16.apply(this, arguments);
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

            var url = this.urls['api'][api] + '/';
            if (api != 'v2') url += this.version + '/';
            if (api == 'public') {
                url += api + '/' + method.toLowerCase() + path;
                if (_Object$keys(params).length) url += '?' + this.urlencode(params);
            } else if (api == 'v2') {
                url += path;
                if (_Object$keys(params).length) url += '?' + this.urlencode(params);
            } else {
                this.checkRequiredCredentials();
                var nonce = this.nonce();
                url += api + '/';
                if (api == 'account' && path != 'withdraw' || path == 'openorders') url += method.toLowerCase();
                url += path + '?' + this.urlencode(this.extend({
                    'nonce': nonce,
                    'apikey': this.apiKey
                }, params));
                var signature = this.hmac(this.encode(url), this.encode(this.secret), 'sha512');
                headers = { 'apisign': signature };
            }
            return { 'url': url, 'method': method, 'body': body, 'headers': headers };
        }
    }, {
        key: 'handleErrors',
        value: function handleErrors(code, reason, url, method, headers, body) {
            if (code >= 400) {
                if (body[0] == "{") {
                    var response = JSON.parse(body);
                    if ('success' in response) {
                        if (!response['success']) {
                            if ('message' in response) {
                                if (response['message'] == 'MIN_TRADE_REQUIREMENT_NOT_MET') throw new InvalidOrder(this.id + ' ' + this.json(response));
                                if (response['message'] == 'APIKEY_INVALID') {
                                    if (this.hasAlreadyAuthenticatedSuccessfully) {
                                        throw new DDoSProtection(this.id + ' ' + this.json(response));
                                    } else {
                                        throw new AuthenticationError(this.id + ' ' + this.json(response));
                                    }
                                }
                                if (response['message'] == 'DUST_TRADE_DISALLOWED_MIN_VALUE_50K_SAT') throw new InvalidOrder(this.id + ' order cost should be over 50k satoshi ' + this.json(response));
                            }
                            throw new ExchangeError(this.id + ' ' + this.json(response));
                        }
                    }
                }
            }
        }
    }, {
        key: 'request',
        value: function () {
            var _ref17 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee17(path) {
                var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
                var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;
                var response;
                return _regeneratorRuntime.wrap(function _callee17$(_context17) {
                    while (1) {
                        switch (_context17.prev = _context17.next) {
                            case 0:
                                _context17.next = 2;
                                return this.fetch2(path, api, method, params, headers, body);

                            case 2:
                                response = _context17.sent;

                                if (!('success' in response)) {
                                    _context17.next = 7;
                                    break;
                                }

                                if (!response['success']) {
                                    _context17.next = 7;
                                    break;
                                }

                                // a workaround for APIKEY_INVALID
                                if (api == 'account' || api == 'market') this.hasAlreadyAuthenticatedSuccessfully = true;
                                return _context17.abrupt('return', response);

                            case 7:
                                if (!('message' in response)) {
                                    _context17.next = 12;
                                    break;
                                }

                                if (!(response['message'] == 'ADDRESS_GENERATING')) {
                                    _context17.next = 10;
                                    break;
                                }

                                return _context17.abrupt('return', response);

                            case 10:
                                if (!(response['message'] == "INSUFFICIENT_FUNDS")) {
                                    _context17.next = 12;
                                    break;
                                }

                                throw new InsufficientFunds(this.id + ' ' + this.json(response));

                            case 12:
                                throw new ExchangeError(this.id + ' ' + this.json(response));

                            case 13:
                            case 'end':
                                return _context17.stop();
                        }
                    }
                }, _callee17, this);
            }));

            function request(_x65) {
                return _ref17.apply(this, arguments);
            }

            return request;
        }()
    }]);

    return bittrex;
}(Exchange);