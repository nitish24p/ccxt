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
    InsufficientFunds = _require.InsufficientFunds,
    OrderNotFound = _require.OrderNotFound,
    OrderNotCached = _require.OrderNotCached;

//  ---------------------------------------------------------------------------

module.exports = function (_Exchange) {
    _inherits(poloniex, _Exchange);

    function poloniex() {
        _classCallCheck(this, poloniex);

        return _possibleConstructorReturn(this, (poloniex.__proto__ || _Object$getPrototypeOf(poloniex)).apply(this, arguments));
    }

    _createClass(poloniex, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend(_get(poloniex.prototype.__proto__ || _Object$getPrototypeOf(poloniex.prototype), 'describe', this).call(this), {
                'id': 'poloniex',
                'name': 'Poloniex',
                'countries': 'US',
                'rateLimit': 1000, // up to 6 calls per second
                'hasCORS': true,
                // obsolete metainfo interface
                'hasFetchMyTrades': true,
                'hasFetchOrder': true,
                'hasFetchOrders': true,
                'hasFetchOpenOrders': true,
                'hasFetchClosedOrders': true,
                'hasFetchTickers': true,
                'hasFetchCurrencies': true,
                'hasWithdraw': true,
                'hasFetchOHLCV': true,
                // new metainfo interface
                'has': {
                    'fetchOHLCV': true,
                    'fetchMyTrades': true,
                    'fetchOrder': 'emulated',
                    'fetchOrders': 'emulated',
                    'fetchOpenOrders': true,
                    'fetchClosedOrders': 'emulated',
                    'fetchTickers': true,
                    'fetchCurrencies': true,
                    'withdraw': true
                },
                'timeframes': {
                    '5m': 300,
                    '15m': 900,
                    '30m': 1800,
                    '2h': 7200,
                    '4h': 14400,
                    '1d': 86400
                },
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/27766817-e9456312-5ee6-11e7-9b3c-b628ca5626a5.jpg',
                    'api': {
                        'public': 'https://poloniex.com/public',
                        'private': 'https://poloniex.com/tradingApi'
                    },
                    'www': 'https://poloniex.com',
                    'doc': ['https://poloniex.com/support/api/', 'http://pastebin.com/dMX7mZE0'],
                    'fees': 'https://poloniex.com/fees'
                },
                'api': {
                    'public': {
                        'get': ['return24hVolume', 'returnChartData', 'returnCurrencies', 'returnLoanOrders', 'returnOrderBook', 'returnTicker', 'returnTradeHistory']
                    },
                    'private': {
                        'post': ['buy', 'cancelLoanOffer', 'cancelOrder', 'closeMarginPosition', 'createLoanOffer', 'generateNewAddress', 'getMarginPosition', 'marginBuy', 'marginSell', 'moveOrder', 'returnActiveLoans', 'returnAvailableAccountBalances', 'returnBalances', 'returnCompleteBalances', 'returnDepositAddresses', 'returnDepositsWithdrawals', 'returnFeeInfo', 'returnLendingHistory', 'returnMarginAccountSummary', 'returnOpenLoanOffers', 'returnOpenOrders', 'returnOrderTrades', 'returnTradableBalances', 'returnTradeHistory', 'sell', 'toggleAutoRenew', 'transferBalance', 'withdraw']
                    }
                },
                'fees': {
                    'trading': {
                        'maker': 0.0015,
                        'taker': 0.0025
                    },
                    'funding': 0.0
                },
                'limits': {
                    'amount': {
                        'min': 0.00000001,
                        'max': 1000000000
                    },
                    'price': {
                        'min': 0.00000001,
                        'max': 1000000000
                    },
                    'cost': {
                        'min': 0.00000000,
                        'max': 1000000000
                    }
                },
                'precision': {
                    'amount': 8,
                    'price': 8
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
                'cost': parseFloat(this.feeToPrecision(symbol, cost))
            };
        }
    }, {
        key: 'commonCurrencyCode',
        value: function commonCurrencyCode(currency) {
            if (currency == 'BTM') return 'Bitmark';
            if (currency == 'STR') return 'XLM';
            return currency;
        }
    }, {
        key: 'currencyId',
        value: function currencyId(currency) {
            if (currency == 'Bitmark') return 'BTM';
            if (currency == 'XLM') return 'STR';
            return currency;
        }
    }, {
        key: 'parseOHLCV',
        value: function parseOHLCV(ohlcv) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
            var timeframe = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '5m';
            var since = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
            var limit = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;

            return [ohlcv['date'] * 1000, ohlcv['open'], ohlcv['high'], ohlcv['low'], ohlcv['close'], ohlcv['volume']];
        }
    }, {
        key: 'fetchOHLCV',
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(symbol) {
                var timeframe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '5m';
                var since = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var limit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
                var params = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
                var market, request, response;
                return _regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);

                                if (!since) since = 0;
                                request = {
                                    'currencyPair': market['id'],
                                    'period': this.timeframes[timeframe],
                                    'start': parseInt(since / 1000)
                                };

                                if (limit) request['end'] = this.sum(request['start'], limit * this.timeframes[timeframe]);
                                _context.next = 8;
                                return this.publicGetReturnChartData(this.extend(request, params));

                            case 8:
                                response = _context.sent;
                                return _context.abrupt('return', this.parseOHLCVs(response, market, timeframe, since, limit));

                            case 10:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function fetchOHLCV(_x11) {
                return _ref.apply(this, arguments);
            }

            return fetchOHLCV;
        }()
    }, {
        key: 'fetchMarkets',
        value: function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2() {
                var markets, keys, result, p, id, market, _id$split, _id$split2, quote, base, symbol;

                return _regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this.publicGetReturnTicker();

                            case 2:
                                markets = _context2.sent;
                                keys = _Object$keys(markets);
                                result = [];

                                for (p = 0; p < keys.length; p++) {
                                    id = keys[p];
                                    market = markets[id];
                                    _id$split = id.split('_'), _id$split2 = _slicedToArray(_id$split, 2), quote = _id$split2[0], base = _id$split2[1];

                                    base = this.commonCurrencyCode(base);
                                    quote = this.commonCurrencyCode(quote);
                                    symbol = base + '/' + quote;

                                    result.push(this.extend(this.fees['trading'], {
                                        'id': id,
                                        'symbol': symbol,
                                        'base': base,
                                        'quote': quote,
                                        'active': true,
                                        'lot': this.limits['amount']['min'],
                                        'info': market
                                    }));
                                }
                                return _context2.abrupt('return', result);

                            case 7:
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
            var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3() {
                var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var balances, result, currencies, c, id, balance, currency, account;
                return _regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context3.next = 4;
                                return this.privatePostReturnCompleteBalances(this.extend({
                                    'account': 'all'
                                }, params));

                            case 4:
                                balances = _context3.sent;
                                result = { 'info': balances };
                                currencies = _Object$keys(balances);

                                for (c = 0; c < currencies.length; c++) {
                                    id = currencies[c];
                                    balance = balances[id];
                                    currency = this.commonCurrencyCode(id);
                                    account = {
                                        'free': parseFloat(balance['available']),
                                        'used': parseFloat(balance['onOrders']),
                                        'total': 0.0
                                    };

                                    account['total'] = this.sum(account['free'], account['used']);
                                    result[currency] = account;
                                }
                                return _context3.abrupt('return', this.parseBalance(result));

                            case 9:
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
            var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee4() {
                var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var fees;
                return _regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context4.next = 4;
                                return this.privatePostReturnFeeInfo();

                            case 4:
                                fees = _context4.sent;
                                return _context4.abrupt('return', {
                                    'info': fees,
                                    'maker': parseFloat(fees['makerFee']),
                                    'taker': parseFloat(fees['takerFee']),
                                    'withdraw': 0.0
                                });

                            case 6:
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
            var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee5(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var orderbook;
                return _regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context5.next = 4;
                                return this.publicGetReturnOrderBook(this.extend({
                                    'currencyPair': this.marketId(symbol)
                                }, params));

                            case 4:
                                orderbook = _context5.sent;
                                return _context5.abrupt('return', this.parseOrderBook(orderbook));

                            case 6:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function fetchOrderBook(_x15) {
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
            return {
                'symbol': symbol,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'high': parseFloat(ticker['high24hr']),
                'low': parseFloat(ticker['low24hr']),
                'bid': parseFloat(ticker['highestBid']),
                'ask': parseFloat(ticker['lowestAsk']),
                'vwap': undefined,
                'open': undefined,
                'close': undefined,
                'first': undefined,
                'last': parseFloat(ticker['last']),
                'change': parseFloat(ticker['percentChange']),
                'percentage': undefined,
                'average': undefined,
                'baseVolume': parseFloat(ticker['quoteVolume']),
                'quoteVolume': parseFloat(ticker['baseVolume']),
                'info': ticker
            };
        }
    }, {
        key: 'fetchTickers',
        value: function () {
            var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee6() {
                var symbols = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var tickers, ids, result, i, id, market, symbol, ticker;
                return _regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                _context6.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context6.next = 4;
                                return this.publicGetReturnTicker(params);

                            case 4:
                                tickers = _context6.sent;
                                ids = _Object$keys(tickers);
                                result = {};

                                for (i = 0; i < ids.length; i++) {
                                    id = ids[i];
                                    market = this.markets_by_id[id];
                                    symbol = market['symbol'];
                                    ticker = tickers[id];

                                    result[symbol] = this.parseTicker(ticker, market);
                                }
                                return _context6.abrupt('return', result);

                            case 9:
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
        key: 'fetchCurrencies',
        value: function () {
            var _ref7 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee7() {
                var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var currencies, ids, result, i, id, currency, precision, code, active, status;
                return _regeneratorRuntime.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                _context7.next = 2;
                                return this.publicGetReturnCurrencies(params);

                            case 2:
                                currencies = _context7.sent;
                                ids = _Object$keys(currencies);
                                result = {};

                                for (i = 0; i < ids.length; i++) {
                                    id = ids[i];
                                    currency = currencies[id];
                                    // todo: will need to rethink the fees
                                    // to add support for multiple withdrawal/deposit methods and
                                    // differentiated fees for each particular method

                                    precision = 8; // default precision, todo: fix "magic constants"

                                    code = this.commonCurrencyCode(id);
                                    active = currency['delisted'] == 0;
                                    status = currency['disabled'] ? 'disabled' : 'ok';

                                    if (status != 'ok') active = false;
                                    result[code] = {
                                        'id': id,
                                        'code': code,
                                        'info': currency,
                                        'name': currency['name'],
                                        'active': active,
                                        'status': status,
                                        'fee': currency['txFee'], // todo: redesign
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
                                                'min': currency['txFee'],
                                                'max': Math.pow(10, precision)
                                            }
                                        }
                                    };
                                }
                                return _context7.abrupt('return', result);

                            case 7:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function fetchCurrencies() {
                return _ref7.apply(this, arguments);
            }

            return fetchCurrencies;
        }()
    }, {
        key: 'fetchTicker',
        value: function () {
            var _ref8 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee8(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var market, tickers, ticker;
                return _regeneratorRuntime.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                _context8.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                _context8.next = 5;
                                return this.publicGetReturnTicker(params);

                            case 5:
                                tickers = _context8.sent;
                                ticker = tickers[market['id']];
                                return _context8.abrupt('return', this.parseTicker(ticker, market));

                            case 8:
                            case 'end':
                                return _context8.stop();
                        }
                    }
                }, _callee8, this);
            }));

            function fetchTicker(_x21) {
                return _ref8.apply(this, arguments);
            }

            return fetchTicker;
        }()
    }, {
        key: 'parseTrade',
        value: function parseTrade(trade) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var timestamp = this.parse8601(trade['date']);
            var symbol = undefined;
            if (!market && 'currencyPair' in trade) market = this.markets_by_id[trade['currencyPair']];
            if (market) symbol = market['symbol'];
            var side = trade['type'];
            var fee = undefined;
            var cost = this.safeFloat(trade, 'total');
            var amount = parseFloat(trade['amount']);
            if ('fee' in trade) {
                var rate = parseFloat(trade['fee']);
                var feeCost = undefined;
                var currency = undefined;
                if (side == 'buy') {
                    currency = market['base'];
                    feeCost = amount * rate;
                } else {
                    currency = market['quote'];
                    if (typeof cost != 'undefined') feeCost = cost * rate;
                }
                fee = {
                    'type': undefined,
                    'rate': rate,
                    'cost': feeCost,
                    'currency': currency
                };
            }
            return {
                'info': trade,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'symbol': symbol,
                'id': this.safeString(trade, 'tradeID'),
                'order': this.safeString(trade, 'orderNumber'),
                'type': 'limit',
                'side': side,
                'price': parseFloat(trade['rate']),
                'amount': amount,
                'cost': cost,
                'fee': fee
            };
        }
    }, {
        key: 'fetchTrades',
        value: function () {
            var _ref9 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee9(symbol) {
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var market, request, trades;
                return _regeneratorRuntime.wrap(function _callee9$(_context9) {
                    while (1) {
                        switch (_context9.prev = _context9.next) {
                            case 0:
                                _context9.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                request = {
                                    'currencyPair': market['id']
                                };

                                if (since) {
                                    request['start'] = parseInt(since / 1000);
                                    request['end'] = this.seconds(); // last 50000 trades by default
                                }
                                _context9.next = 7;
                                return this.publicGetReturnTradeHistory(this.extend(request, params));

                            case 7:
                                trades = _context9.sent;
                                return _context9.abrupt('return', this.parseTrades(trades, market, since, limit));

                            case 9:
                            case 'end':
                                return _context9.stop();
                        }
                    }
                }, _callee9, this);
            }));

            function fetchTrades(_x26) {
                return _ref9.apply(this, arguments);
            }

            return fetchTrades;
        }()
    }, {
        key: 'fetchMyTrades',
        value: function () {
            var _ref10 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee10() {
                var symbol = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

                var market, pair, request, response, result, ids, i, id, _market, _symbol, trades, j;

                return _regeneratorRuntime.wrap(function _callee10$(_context10) {
                    while (1) {
                        switch (_context10.prev = _context10.next) {
                            case 0:
                                _context10.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = undefined;

                                if (symbol) market = this.market(symbol);
                                pair = market ? market['id'] : 'all';
                                request = { 'currencyPair': pair };

                                if (since) {
                                    request['start'] = parseInt(since / 1000);
                                    request['end'] = this.seconds();
                                }
                                // limit is disabled (does not really work as expected)
                                // if (limit)
                                //     request['limit'] = parseInt (limit);
                                _context10.next = 9;
                                return this.privatePostReturnTradeHistory(this.extend(request, params));

                            case 9:
                                response = _context10.sent;
                                result = [];

                                if (market) {
                                    result = this.parseTrades(response, market);
                                } else {
                                    if (response) {
                                        ids = _Object$keys(response);

                                        for (i = 0; i < ids.length; i++) {
                                            id = ids[i];
                                            _market = this.markets_by_id[id];
                                            _symbol = _market['symbol'];
                                            trades = this.parseTrades(response[id], _market);

                                            for (j = 0; j < trades.length; j++) {
                                                result.push(trades[j]);
                                            }
                                        }
                                    }
                                }
                                return _context10.abrupt('return', this.filterBySinceLimit(result, since, limit));

                            case 13:
                            case 'end':
                                return _context10.stop();
                        }
                    }
                }, _callee10, this);
            }));

            function fetchMyTrades() {
                return _ref10.apply(this, arguments);
            }

            return fetchMyTrades;
        }()
    }, {
        key: 'parseOrder',
        value: function parseOrder(order) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var timestamp = this.safeInteger(order, 'timestamp');
            if (!timestamp) timestamp = this.parse8601(order['date']);
            var trades = undefined;
            if ('resultingTrades' in order) trades = this.parseTrades(order['resultingTrades'], market);
            var symbol = undefined;
            if (market) symbol = market['symbol'];
            var price = parseFloat(order['price']);
            var cost = this.safeFloat(order, 'total', 0.0);
            var remaining = this.safeFloat(order, 'amount');
            var amount = this.safeFloat(order, 'startingAmount', remaining);
            var filled = amount - remaining;
            return {
                'info': order,
                'id': order['orderNumber'],
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'status': order['status'],
                'symbol': symbol,
                'type': order['type'],
                'side': order['side'],
                'price': price,
                'cost': cost,
                'amount': amount,
                'filled': filled,
                'remaining': remaining,
                'trades': trades,
                'fee': undefined
            };
        }
    }, {
        key: 'parseOpenOrders',
        value: function parseOpenOrders(orders, market) {
            var result = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

            for (var i = 0; i < orders.length; i++) {
                var order = orders[i];
                var extended = this.extend(order, {
                    'status': 'open',
                    'type': 'limit',
                    'side': order['type'],
                    'price': order['rate']
                });
                result.push(this.parseOrder(extended, market));
            }
            return result;
        }
    }, {
        key: 'fetchOrders',
        value: function () {
            var _ref11 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee11() {
                var symbol = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

                var market, pair, response, openOrders, marketIds, i, marketId, orders, m, j, openOrdersIndexedById, cachedOrderIds, result, k, id, _order, order;

                return _regeneratorRuntime.wrap(function _callee11$(_context11) {
                    while (1) {
                        switch (_context11.prev = _context11.next) {
                            case 0:
                                _context11.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = undefined;

                                if (symbol) market = this.market(symbol);
                                pair = market ? market['id'] : 'all';
                                _context11.next = 7;
                                return this.privatePostReturnOpenOrders(this.extend({
                                    'currencyPair': pair
                                }));

                            case 7:
                                response = _context11.sent;
                                openOrders = [];

                                if (market) {
                                    openOrders = this.parseOpenOrders(response, market, openOrders);
                                } else {
                                    marketIds = _Object$keys(response);

                                    for (i = 0; i < marketIds.length; i++) {
                                        marketId = marketIds[i];
                                        orders = response[marketId];
                                        m = this.markets_by_id[marketId];

                                        openOrders = this.parseOpenOrders(orders, m, openOrders);
                                    }
                                }
                                for (j = 0; j < openOrders.length; j++) {
                                    this.orders[openOrders[j]['id']] = openOrders[j];
                                }
                                openOrdersIndexedById = this.indexBy(openOrders, 'id');
                                cachedOrderIds = _Object$keys(this.orders);
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

                                    if (market) {
                                        if (order['symbol'] == symbol) result.push(order);
                                    } else {
                                        result.push(order);
                                    }
                                }
                                return _context11.abrupt('return', this.filterBySinceLimit(result, since, limit));

                            case 16:
                            case 'end':
                                return _context11.stop();
                        }
                    }
                }, _callee11, this);
            }));

            function fetchOrders() {
                return _ref11.apply(this, arguments);
            }

            return fetchOrders;
        }()
    }, {
        key: 'fetchOrder',
        value: function () {
            var _ref12 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee12(id) {
                var symbol = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
                var since, limit, request, orders, i;
                return _regeneratorRuntime.wrap(function _callee12$(_context12) {
                    while (1) {
                        switch (_context12.prev = _context12.next) {
                            case 0:
                                since = this.safeValue(params, 'since');
                                limit = this.safeValue(params, 'limit');
                                request = this.omit(params, ['since', 'limit']);
                                _context12.next = 5;
                                return this.fetchOrders(symbol, since, limit, request);

                            case 5:
                                orders = _context12.sent;
                                i = 0;

                            case 7:
                                if (!(i < orders.length)) {
                                    _context12.next = 13;
                                    break;
                                }

                                if (!(orders[i]['id'] == id)) {
                                    _context12.next = 10;
                                    break;
                                }

                                return _context12.abrupt('return', orders[i]);

                            case 10:
                                i++;
                                _context12.next = 7;
                                break;

                            case 13:
                                throw new OrderNotCached(this.id + ' order id ' + id.toString() + ' not found in cache');

                            case 14:
                            case 'end':
                                return _context12.stop();
                        }
                    }
                }, _callee12, this);
            }));

            function fetchOrder(_x39) {
                return _ref12.apply(this, arguments);
            }

            return fetchOrder;
        }()
    }, {
        key: 'filterOrdersByStatus',
        value: function filterOrdersByStatus(orders, status) {
            var result = [];
            for (var i = 0; i < orders.length; i++) {
                if (orders[i]['status'] == status) result.push(orders[i]);
            }
            return result;
        }
    }, {
        key: 'fetchOpenOrders',
        value: function () {
            var _ref13 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee13() {
                var symbol = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var orders;
                return _regeneratorRuntime.wrap(function _callee13$(_context13) {
                    while (1) {
                        switch (_context13.prev = _context13.next) {
                            case 0:
                                _context13.next = 2;
                                return this.fetchOrders(symbol, since, limit, params);

                            case 2:
                                orders = _context13.sent;
                                return _context13.abrupt('return', this.filterOrdersByStatus(orders, 'open'));

                            case 4:
                            case 'end':
                                return _context13.stop();
                        }
                    }
                }, _callee13, this);
            }));

            function fetchOpenOrders() {
                return _ref13.apply(this, arguments);
            }

            return fetchOpenOrders;
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
                                return this.fetchOrders(symbol, since, limit, params);

                            case 2:
                                orders = _context14.sent;
                                return _context14.abrupt('return', this.filterOrdersByStatus(orders, 'closed'));

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
        key: 'createOrder',
        value: function () {
            var _ref15 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee15(symbol, type, side, amount) {
                var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
                var method, market, response, timestamp, order, id;
                return _regeneratorRuntime.wrap(function _callee15$(_context15) {
                    while (1) {
                        switch (_context15.prev = _context15.next) {
                            case 0:
                                if (!(type == 'market')) {
                                    _context15.next = 2;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' allows limit orders only');

                            case 2:
                                _context15.next = 4;
                                return this.loadMarkets();

                            case 4:
                                method = 'privatePost' + this.capitalize(side);
                                market = this.market(symbol);

                                price = parseFloat(price);
                                amount = parseFloat(amount);
                                _context15.next = 10;
                                return this[method](this.extend({
                                    'currencyPair': market['id'],
                                    'rate': this.priceToPrecision(symbol, price),
                                    'amount': this.amountToPrecision(symbol, amount)
                                }, params));

                            case 10:
                                response = _context15.sent;
                                timestamp = this.milliseconds();
                                order = this.parseOrder(this.extend({
                                    'timestamp': timestamp,
                                    'status': 'open',
                                    'type': type,
                                    'side': side,
                                    'price': price,
                                    'amount': amount
                                }, response), market);
                                id = order['id'];

                                this.orders[id] = order;
                                return _context15.abrupt('return', this.extend({ 'info': response }, order));

                            case 16:
                            case 'end':
                                return _context15.stop();
                        }
                    }
                }, _callee15, this);
            }));

            function createOrder(_x50, _x51, _x52, _x53) {
                return _ref15.apply(this, arguments);
            }

            return createOrder;
        }()
    }, {
        key: 'editOrder',
        value: function () {
            var _ref16 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee16(id, symbol, type, side, amount) {
                var price = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;
                var params = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : {};
                var request, response, result, newid;
                return _regeneratorRuntime.wrap(function _callee16$(_context16) {
                    while (1) {
                        switch (_context16.prev = _context16.next) {
                            case 0:
                                _context16.next = 2;
                                return this.loadMarkets();

                            case 2:
                                price = parseFloat(price);
                                amount = parseFloat(amount);
                                request = {
                                    'orderNumber': id,
                                    'rate': this.priceToPrecision(symbol, price),
                                    'amount': this.amountToPrecision(symbol, amount)
                                };
                                _context16.next = 7;
                                return this.privatePostMoveOrder(this.extend(request, params));

                            case 7:
                                response = _context16.sent;
                                result = undefined;

                                if (id in this.orders) {
                                    this.orders[id]['status'] = 'canceled';
                                    newid = response['orderNumber'];

                                    this.orders[newid] = this.extend(this.orders[id], {
                                        'id': newid,
                                        'price': price,
                                        'amount': amount,
                                        'status': 'open'
                                    });
                                    result = this.extend(this.orders[newid], { 'info': response });
                                } else {
                                    result = {
                                        'info': response,
                                        'id': response['orderNumber']
                                    };
                                }
                                return _context16.abrupt('return', result);

                            case 11:
                            case 'end':
                                return _context16.stop();
                        }
                    }
                }, _callee16, this);
            }));

            function editOrder(_x56, _x57, _x58, _x59, _x60) {
                return _ref16.apply(this, arguments);
            }

            return editOrder;
        }()
    }, {
        key: 'cancelOrder',
        value: function () {
            var _ref17 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee17(id) {
                var symbol = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
                var response;
                return _regeneratorRuntime.wrap(function _callee17$(_context17) {
                    while (1) {
                        switch (_context17.prev = _context17.next) {
                            case 0:
                                _context17.next = 2;
                                return this.loadMarkets();

                            case 2:
                                response = undefined;
                                _context17.prev = 3;
                                _context17.next = 6;
                                return this.privatePostCancelOrder(this.extend({
                                    'orderNumber': id
                                }, params));

                            case 6:
                                response = _context17.sent;

                                if (id in this.orders) this.orders[id]['status'] = 'canceled';
                                _context17.next = 16;
                                break;

                            case 10:
                                _context17.prev = 10;
                                _context17.t0 = _context17['catch'](3);

                                if (!this.last_http_response) {
                                    _context17.next = 15;
                                    break;
                                }

                                if (!(this.last_http_response.indexOf('Invalid order') >= 0)) {
                                    _context17.next = 15;
                                    break;
                                }

                                throw new OrderNotFound(this.id + ' cancelOrder() error: ' + this.last_http_response);

                            case 15:
                                throw _context17.t0;

                            case 16:
                                return _context17.abrupt('return', response);

                            case 17:
                            case 'end':
                                return _context17.stop();
                        }
                    }
                }, _callee17, this, [[3, 10]]);
            }));

            function cancelOrder(_x63) {
                return _ref17.apply(this, arguments);
            }

            return cancelOrder;
        }()
    }, {
        key: 'fetchOrderStatus',
        value: function () {
            var _ref18 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee18(id) {
                var symbol = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var orders, indexed;
                return _regeneratorRuntime.wrap(function _callee18$(_context18) {
                    while (1) {
                        switch (_context18.prev = _context18.next) {
                            case 0:
                                _context18.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context18.next = 4;
                                return this.fetchOpenOrders(symbol);

                            case 4:
                                orders = _context18.sent;
                                indexed = this.indexBy(orders, 'id');
                                return _context18.abrupt('return', id in indexed ? 'open' : 'closed');

                            case 7:
                            case 'end':
                                return _context18.stop();
                        }
                    }
                }, _callee18, this);
            }));

            function fetchOrderStatus(_x65) {
                return _ref18.apply(this, arguments);
            }

            return fetchOrderStatus;
        }()
    }, {
        key: 'fetchOrderTrades',
        value: function () {
            var _ref19 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee19(id) {
                var symbol = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
                var trades;
                return _regeneratorRuntime.wrap(function _callee19$(_context19) {
                    while (1) {
                        switch (_context19.prev = _context19.next) {
                            case 0:
                                _context19.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context19.next = 4;
                                return this.privatePostReturnOrderTrades(this.extend({
                                    'orderNumber': id
                                }, params));

                            case 4:
                                trades = _context19.sent;
                                return _context19.abrupt('return', this.parseTrades(trades));

                            case 6:
                            case 'end':
                                return _context19.stop();
                        }
                    }
                }, _callee19, this);
            }));

            function fetchOrderTrades(_x68) {
                return _ref19.apply(this, arguments);
            }

            return fetchOrderTrades;
        }()
    }, {
        key: 'createDepositAddress',
        value: function () {
            var _ref20 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee20(currency) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var currencyId, response, address;
                return _regeneratorRuntime.wrap(function _callee20$(_context20) {
                    while (1) {
                        switch (_context20.prev = _context20.next) {
                            case 0:
                                currencyId = this.currencyId(currency);
                                _context20.next = 3;
                                return this.privatePostGenerateNewAddress({
                                    'currency': currencyId
                                });

                            case 3:
                                response = _context20.sent;
                                address = undefined;

                                if (response['success'] == 1) address = this.safeString(response, 'response');

                                if (address) {
                                    _context20.next = 8;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' createDepositAddress failed: ' + this.last_http_response);

                            case 8:
                                return _context20.abrupt('return', {
                                    'currency': currency,
                                    'address': address,
                                    'status': 'ok',
                                    'info': response
                                });

                            case 9:
                            case 'end':
                                return _context20.stop();
                        }
                    }
                }, _callee20, this);
            }));

            function createDepositAddress(_x70) {
                return _ref20.apply(this, arguments);
            }

            return createDepositAddress;
        }()
    }, {
        key: 'fetchDepositAddress',
        value: function () {
            var _ref21 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee21(currency) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var response, currencyId, address, status;
                return _regeneratorRuntime.wrap(function _callee21$(_context21) {
                    while (1) {
                        switch (_context21.prev = _context21.next) {
                            case 0:
                                _context21.next = 2;
                                return this.privatePostReturnDepositAddresses();

                            case 2:
                                response = _context21.sent;
                                currencyId = this.currencyId(currency);
                                address = this.safeString(response, currencyId);
                                status = address ? 'ok' : 'none';
                                return _context21.abrupt('return', {
                                    'currency': currency,
                                    'address': address,
                                    'status': status,
                                    'info': response
                                });

                            case 7:
                            case 'end':
                                return _context21.stop();
                        }
                    }
                }, _callee21, this);
            }));

            function fetchDepositAddress(_x72) {
                return _ref21.apply(this, arguments);
            }

            return fetchDepositAddress;
        }()
    }, {
        key: 'withdraw',
        value: function () {
            var _ref22 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee22(currency, amount, address) {
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var currencyId, result;
                return _regeneratorRuntime.wrap(function _callee22$(_context22) {
                    while (1) {
                        switch (_context22.prev = _context22.next) {
                            case 0:
                                _context22.next = 2;
                                return this.loadMarkets();

                            case 2:
                                currencyId = this.currencyId(currency);
                                _context22.next = 5;
                                return this.privatePostWithdraw(this.extend({
                                    'currency': currencyId,
                                    'amount': amount,
                                    'address': address
                                }, params));

                            case 5:
                                result = _context22.sent;
                                return _context22.abrupt('return', {
                                    'info': result,
                                    'id': result['response']
                                });

                            case 7:
                            case 'end':
                                return _context22.stop();
                        }
                    }
                }, _callee22, this);
            }));

            function withdraw(_x74, _x75, _x76) {
                return _ref22.apply(this, arguments);
            }

            return withdraw;
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

            var url = this.urls['api'][api];
            var query = this.extend({ 'command': path }, params);
            if (api == 'public') {
                url += '?' + this.urlencode(query);
            } else {
                this.checkRequiredCredentials();
                query['nonce'] = this.nonce();
                body = this.urlencode(query);
                headers = {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Key': this.apiKey,
                    'Sign': this.hmac(this.encode(body), this.encode(this.secret), 'sha512')
                };
            }
            return { 'url': url, 'method': method, 'body': body, 'headers': headers };
        }
    }, {
        key: 'request',
        value: function () {
            var _ref23 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee23(path) {
                var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
                var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;
                var response, error, failed;
                return _regeneratorRuntime.wrap(function _callee23$(_context23) {
                    while (1) {
                        switch (_context23.prev = _context23.next) {
                            case 0:
                                _context23.next = 2;
                                return this.fetch2(path, api, method, params, headers, body);

                            case 2:
                                response = _context23.sent;

                                if (!('error' in response)) {
                                    _context23.next = 9;
                                    break;
                                }

                                error = this.id + ' ' + this.json(response);
                                failed = response['error'].indexOf('Not enough') >= 0;

                                if (!failed) {
                                    _context23.next = 8;
                                    break;
                                }

                                throw new InsufficientFunds(error);

                            case 8:
                                throw new ExchangeError(error);

                            case 9:
                                return _context23.abrupt('return', response);

                            case 10:
                            case 'end':
                                return _context23.stop();
                        }
                    }
                }, _callee23, this);
            }));

            function request(_x87) {
                return _ref23.apply(this, arguments);
            }

            return request;
        }()
    }]);

    return poloniex;
}(Exchange);