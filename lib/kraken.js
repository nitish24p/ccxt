"use strict";

//  ---------------------------------------------------------------------------

import _regeneratorRuntime from 'babel-runtime/regenerator';
import _Object$keys from 'babel-runtime/core-js/object/keys';
import _asyncToGenerator from 'babel-runtime/helpers/asyncToGenerator';
import _Object$getPrototypeOf from 'babel-runtime/core-js/object/get-prototype-of';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _get from 'babel-runtime/helpers/get';
import _inherits from 'babel-runtime/helpers/inherits';
var Exchange = require('./base/Exchange');

var _require = require('./base/errors'),
    ExchangeNotAvailable = _require.ExchangeNotAvailable,
    ExchangeError = _require.ExchangeError,
    OrderNotFound = _require.OrderNotFound,
    DDoSProtection = _require.DDoSProtection,
    InvalidNonce = _require.InvalidNonce,
    InsufficientFunds = _require.InsufficientFunds,
    CancelPending = _require.CancelPending,
    InvalidOrder = _require.InvalidOrder;

//  ---------------------------------------------------------------------------

module.exports = function (_Exchange) {
    _inherits(kraken, _Exchange);

    function kraken() {
        _classCallCheck(this, kraken);

        return _possibleConstructorReturn(this, (kraken.__proto__ || _Object$getPrototypeOf(kraken)).apply(this, arguments));
    }

    _createClass(kraken, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend(_get(kraken.prototype.__proto__ || _Object$getPrototypeOf(kraken.prototype), 'describe', this).call(this), {
                'id': 'kraken',
                'name': 'Kraken',
                'countries': 'US',
                'version': '0',
                'rateLimit': 3000,
                'hasCORS': false,
                // obsolete metainfo interface
                'hasFetchTickers': true,
                'hasFetchOHLCV': true,
                'hasFetchOrder': true,
                'hasFetchOpenOrders': true,
                'hasFetchClosedOrders': true,
                'hasFetchMyTrades': true,
                'hasWithdraw': true,
                'hasFetchCurrencies': true,
                // new metainfo interface
                'has': {
                    'fetchCurrencies': true,
                    'fetchTickers': true,
                    'fetchOHLCV': true,
                    'fetchOrder': true,
                    'fetchOpenOrders': true,
                    'fetchClosedOrders': true,
                    'fetchMyTrades': true,
                    'withdraw': true
                },
                'marketsByAltname': {},
                'timeframes': {
                    '1m': '1',
                    '5m': '5',
                    '15m': '15',
                    '30m': '30',
                    '1h': '60',
                    '4h': '240',
                    '1d': '1440',
                    '1w': '10080',
                    '2w': '21600'
                },
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/27766599-22709304-5ede-11e7-9de1-9f33732e1509.jpg',
                    'api': 'https://api.kraken.com',
                    'www': 'https://www.kraken.com',
                    'doc': ['https://www.kraken.com/en-us/help/api', 'https://github.com/nothingisdead/npm-kraken-api'],
                    'fees': ['https://www.kraken.com/en-us/help/fees', 'https://support.kraken.com/hc/en-us/articles/201396777-What-are-the-deposit-fees-', 'https://support.kraken.com/hc/en-us/articles/201893608-What-are-the-withdrawal-fees-']
                },
                'fees': {
                    'trading': {
                        'tierBased': true,
                        'percentage': true,
                        'taker': 0.26 / 100,
                        'maker': 0.16 / 100,
                        'tiers': {
                            'taker': [[0, 0.26 / 100], [50000, 0.24 / 100], [100000, 0.22 / 100], [250000, 0.2 / 100], [500000, 0.18 / 100], [1000000, 0.16 / 100], [2500000, 0.14 / 100], [5000000, 0.12 / 100], [10000000, 0.1 / 100]],
                            'maker': [[0, 0.16 / 100], [50000, 0.14 / 100], [100000, 0.12 / 100], [250000, 0.10 / 100], [500000, 0.8 / 100], [1000000, 0.6 / 100], [2500000, 0.4 / 100], [5000000, 0.2 / 100], [10000000, 0.0 / 100]]
                        }
                    },
                    'funding': {
                        'tierBased': false,
                        'percentage': false,
                        'withdraw': {
                            'BTC': 0.001,
                            'ETH': 0.005,
                            'XRP': 0.02,
                            'XLM': 0.00002,
                            'LTC': 0.02,
                            'DOGE': 2,
                            'ZEC': 0.00010,
                            'ICN': 0.02,
                            'REP': 0.01,
                            'ETC': 0.005,
                            'MLN': 0.003,
                            'XMR': 0.05,
                            'DASH': 0.005,
                            'GNO': 0.01,
                            'EOS': 0.5,
                            'BCH': 0.001,
                            'USD': 5, // if domestic wire
                            'EUR': 5, // if domestic wire
                            'CAD': 10, // CAD EFT Withdrawal
                            'JPY': 300 // if domestic wire
                        },
                        'deposit': {
                            'BTC': 0,
                            'ETH': 0,
                            'XRP': 0,
                            'XLM': 0,
                            'LTC': 0,
                            'DOGE': 0,
                            'ZEC': 0,
                            'ICN': 0,
                            'REP': 0,
                            'ETC': 0,
                            'MLN': 0,
                            'XMR': 0,
                            'DASH': 0,
                            'GNO': 0,
                            'EOS': 0,
                            'BCH': 0,
                            'USD': 5, // if domestic wire
                            'EUR': 0, // free deposit if EUR SEPA Deposit
                            'CAD': 5, // if domestic wire
                            'JPY': 0 // Domestic Deposit (Free, ¥5,000 deposit minimum)
                        }
                    }
                },
                'api': {
                    'public': {
                        'get': ['Assets', 'AssetPairs', 'Depth', 'OHLC', 'Spread', 'Ticker', 'Time', 'Trades']
                    },
                    'private': {
                        'post': ['AddOrder', 'Balance', 'CancelOrder', 'ClosedOrders', 'DepositAddresses', 'DepositMethods', 'DepositStatus', 'Ledgers', 'OpenOrders', 'OpenPositions', 'QueryLedgers', 'QueryOrders', 'QueryTrades', 'TradeBalance', 'TradesHistory', 'TradeVolume', 'Withdraw', 'WithdrawCancel', 'WithdrawInfo', 'WithdrawStatus']
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
            return this.truncate(parseFloat(fee), this.markets[symbol]['precision']['amount']);
        }
    }, {
        key: 'handleErrors',
        value: function handleErrors(code, reason, url, method, headers, body) {
            if (body.indexOf('Invalid nonce') >= 0) throw new InvalidNonce(this.id + ' ' + body);
            if (body.indexOf('Insufficient funds') >= 0) throw new InsufficientFunds(this.id + ' ' + body);
            if (body.indexOf('Cancel pending') >= 0) throw new CancelPending(this.id + ' ' + body);
            if (body.indexOf('Invalid arguments:volume') >= 0) throw new InvalidOrder(this.id + ' ' + body);
        }
    }, {
        key: 'fetchMarkets',
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
                var markets, keys, result, i, id, market, base, quote, darkpool, symbol, maker, precision, lot;
                return _regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.publicGetAssetPairs();

                            case 2:
                                markets = _context.sent;
                                keys = _Object$keys(markets['result']);
                                result = [];

                                for (i = 0; i < keys.length; i++) {
                                    id = keys[i];
                                    market = markets['result'][id];
                                    base = market['base'];
                                    quote = market['quote'];

                                    if (base[0] == 'X' || base[0] == 'Z') base = base.slice(1);
                                    if (quote[0] == 'X' || quote[0] == 'Z') quote = quote.slice(1);
                                    base = this.commonCurrencyCode(base);
                                    quote = this.commonCurrencyCode(quote);
                                    darkpool = id.indexOf('.d') >= 0;
                                    symbol = darkpool ? market['altname'] : base + '/' + quote;
                                    maker = undefined;

                                    if ('fees_maker' in market) {
                                        maker = parseFloat(market['fees_maker'][0][1]) / 100;
                                    }
                                    precision = {
                                        'amount': market['lot_decimals'],
                                        'price': market['pair_decimals']
                                    };
                                    lot = Math.pow(10, -precision['amount']);

                                    result.push({
                                        'id': id,
                                        'symbol': symbol,
                                        'base': base,
                                        'quote': quote,
                                        'darkpool': darkpool,
                                        'info': market,
                                        'altname': market['altname'],
                                        'maker': maker,
                                        'taker': parseFloat(market['fees'][0][1]) / 100,
                                        'lot': lot,
                                        'active': true,
                                        'precision': precision,
                                        'limits': {
                                            'amount': {
                                                'min': lot,
                                                'max': Math.pow(10, precision['amount'])
                                            },
                                            'price': {
                                                'min': Math.pow(10, -precision['price']),
                                                'max': undefined
                                            },
                                            'cost': {
                                                'min': 0,
                                                'max': undefined
                                            }
                                        }
                                    });
                                }
                                result = this.appendInactiveMarkets(result);
                                this.marketsByAltname = this.indexBy(result, 'altname');
                                return _context.abrupt('return', result);

                            case 9:
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
        key: 'appendInactiveMarkets',
        value: function appendInactiveMarkets() {
            var result = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

            var precision = { 'amount': 8, 'price': 8 };
            var costLimits = { 'min': 0, 'max': undefined };
            var priceLimits = { 'min': Math.pow(10, -precision['price']), 'max': undefined };
            var amountLimits = { 'min': Math.pow(10, -precision['amount']), 'max': Math.pow(10, precision['amount']) };
            var limits = { 'amount': amountLimits, 'price': priceLimits, 'cost': costLimits };
            var defaults = {
                'darkpool': false,
                'info': undefined,
                'maker': undefined,
                'taker': undefined,
                'lot': amountLimits['min'],
                'active': false,
                'precision': precision,
                'limits': limits
            };
            var markets = [{ 'id': 'XXLMZEUR', 'symbol': 'XLM/EUR', 'base': 'XLM', 'quote': 'EUR', 'altname': 'XLMEUR' }];
            for (var i = 0; i < markets.length; i++) {
                result.push(this.extend(defaults, markets[i]));
            }
            return result;
        }
    }, {
        key: 'fetchCurrencies',
        value: function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2() {
                var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var response, currencies, ids, result, i, id, currency, code, precision;
                return _regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this.publicGetAssets(params);

                            case 2:
                                response = _context2.sent;
                                currencies = response['result'];
                                ids = _Object$keys(currencies);
                                result = {};

                                for (i = 0; i < ids.length; i++) {
                                    id = ids[i];
                                    currency = currencies[id];
                                    // todo: will need to rethink the fees
                                    // to add support for multiple withdrawal/deposit methods and
                                    // differentiated fees for each particular method

                                    code = this.commonCurrencyCode(currency['altname']);
                                    precision = currency['decimals'];

                                    result[code] = {
                                        'id': id,
                                        'code': code,
                                        'info': currency,
                                        'name': code,
                                        'active': true,
                                        'status': 'ok',
                                        'fee': undefined,
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
                                                'min': undefined,
                                                'max': Math.pow(10, precision)
                                            }
                                        }
                                    };
                                }
                                return _context2.abrupt('return', result);

                            case 8:
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
        key: 'fetchOrderBook',
        value: function () {
            var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var darkpool, market, response, orderbook;
                return _regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return this.loadMarkets();

                            case 2:
                                darkpool = symbol.indexOf('.d') >= 0;

                                if (!darkpool) {
                                    _context3.next = 5;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' does not provide an order book for darkpool symbol ' + symbol);

                            case 5:
                                market = this.market(symbol);
                                _context3.next = 8;
                                return this.publicGetDepth(this.extend({
                                    'pair': market['id']
                                }, params));

                            case 8:
                                response = _context3.sent;
                                orderbook = response['result'][market['id']];
                                return _context3.abrupt('return', this.parseOrderBook(orderbook));

                            case 11:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function fetchOrderBook(_x4) {
                return _ref3.apply(this, arguments);
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
            var baseVolume = parseFloat(ticker['v'][1]);
            var vwap = parseFloat(ticker['p'][1]);
            var quoteVolume = baseVolume * vwap;
            return {
                'symbol': symbol,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'high': parseFloat(ticker['h'][1]),
                'low': parseFloat(ticker['l'][1]),
                'bid': parseFloat(ticker['b'][0]),
                'ask': parseFloat(ticker['a'][0]),
                'vwap': vwap,
                'open': parseFloat(ticker['o']),
                'close': undefined,
                'first': undefined,
                'last': parseFloat(ticker['c'][0]),
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
            var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee4() {
                var symbols = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

                var pairs, s, symbol, market, filter, response, tickers, ids, result, i, id, _market, _symbol, ticker;

                return _regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                return this.loadMarkets();

                            case 2:
                                pairs = [];

                                for (s = 0; s < this.symbols.length; s++) {
                                    symbol = this.symbols[s];
                                    market = this.markets[symbol];

                                    if (market['active']) if (!market['darkpool']) pairs.push(market['id']);
                                }
                                filter = pairs.join(',');
                                _context4.next = 7;
                                return this.publicGetTicker(this.extend({
                                    'pair': filter
                                }, params));

                            case 7:
                                response = _context4.sent;
                                tickers = response['result'];
                                ids = _Object$keys(tickers);
                                result = {};

                                for (i = 0; i < ids.length; i++) {
                                    id = ids[i];
                                    _market = this.markets_by_id[id];
                                    _symbol = _market['symbol'];
                                    ticker = tickers[id];

                                    result[_symbol] = this.parseTicker(ticker, _market);
                                }
                                return _context4.abrupt('return', result);

                            case 13:
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
            var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee5(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var darkpool, market, response, ticker;
                return _regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.next = 2;
                                return this.loadMarkets();

                            case 2:
                                darkpool = symbol.indexOf('.d') >= 0;

                                if (!darkpool) {
                                    _context5.next = 5;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' does not provide a ticker for darkpool symbol ' + symbol);

                            case 5:
                                market = this.market(symbol);
                                _context5.next = 8;
                                return this.publicGetTicker(this.extend({
                                    'pair': market['id']
                                }, params));

                            case 8:
                                response = _context5.sent;
                                ticker = response['result'][market['id']];
                                return _context5.abrupt('return', this.parseTicker(ticker, market));

                            case 11:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function fetchTicker(_x9) {
                return _ref5.apply(this, arguments);
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

            return [ohlcv[0] * 1000, parseFloat(ohlcv[1]), parseFloat(ohlcv[2]), parseFloat(ohlcv[3]), parseFloat(ohlcv[4]), parseFloat(ohlcv[6])];
        }
    }, {
        key: 'fetchOHLCV',
        value: function () {
            var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee6(symbol) {
                var timeframe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '1m';
                var since = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var limit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
                var params = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
                var market, request, response, ohlcvs;
                return _regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                _context6.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                request = {
                                    'pair': market['id'],
                                    'interval': this.timeframes[timeframe]
                                };

                                if (since) request['since'] = parseInt(since / 1000);
                                _context6.next = 7;
                                return this.publicGetOHLC(this.extend(request, params));

                            case 7:
                                response = _context6.sent;
                                ohlcvs = response['result'][market['id']];
                                return _context6.abrupt('return', this.parseOHLCVs(ohlcvs, market, timeframe, since, limit));

                            case 10:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function fetchOHLCV(_x18) {
                return _ref6.apply(this, arguments);
            }

            return fetchOHLCV;
        }()
    }, {
        key: 'parseTrade',
        value: function parseTrade(trade) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var timestamp = undefined;
            var side = undefined;
            var type = undefined;
            var price = undefined;
            var amount = undefined;
            var id = undefined;
            var order = undefined;
            var fee = undefined;
            if (!market) market = this.findMarketByAltnameOrId(trade['pair']);
            if ('ordertxid' in trade) {
                order = trade['ordertxid'];
                id = trade['id'];
                timestamp = parseInt(trade['time'] * 1000);
                side = trade['type'];
                type = trade['ordertype'];
                price = parseFloat(trade['price']);
                amount = parseFloat(trade['vol']);
                if ('fee' in trade) {
                    var currency = undefined;
                    if (market) currency = market['quote'];
                    fee = {
                        'cost': parseFloat(trade['fee']),
                        'currency': currency
                    };
                }
            } else {
                timestamp = parseInt(trade[2] * 1000);
                side = trade[3] == 's' ? 'sell' : 'buy';
                type = trade[4] == 'l' ? 'limit' : 'market';
                price = parseFloat(trade[0]);
                amount = parseFloat(trade[1]);
            }
            var symbol = market ? market['symbol'] : undefined;
            return {
                'id': id,
                'order': order,
                'info': trade,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'symbol': symbol,
                'type': type,
                'side': side,
                'price': price,
                'amount': amount,
                'fee': fee
            };
        }
    }, {
        key: 'fetchTrades',
        value: function () {
            var _ref7 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee7(symbol) {
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var market, id, response, trades;
                return _regeneratorRuntime.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                _context7.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                id = market['id'];
                                _context7.next = 6;
                                return this.publicGetTrades(this.extend({
                                    'pair': id
                                }, params));

                            case 6:
                                response = _context7.sent;
                                trades = response['result'][id];
                                return _context7.abrupt('return', this.parseTrades(trades, market, since, limit));

                            case 9:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function fetchTrades(_x23) {
                return _ref7.apply(this, arguments);
            }

            return fetchTrades;
        }()
    }, {
        key: 'fetchBalance',
        value: function () {
            var _ref8 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee8() {
                var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var response, balances, result, currencies, c, currency, code, balance, account;
                return _regeneratorRuntime.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                _context8.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context8.next = 4;
                                return this.privatePostBalance();

                            case 4:
                                response = _context8.sent;
                                balances = response['result'];
                                result = { 'info': balances };
                                currencies = _Object$keys(balances);

                                for (c = 0; c < currencies.length; c++) {
                                    currency = currencies[c];
                                    code = currency;
                                    // X-ISO4217-A3 standard currency codes

                                    if (code[0] == 'X') {
                                        code = code.slice(1);
                                    } else if (code[0] == 'Z') {
                                        code = code.slice(1);
                                    }
                                    code = this.commonCurrencyCode(code);
                                    balance = parseFloat(balances[currency]);
                                    account = {
                                        'free': balance,
                                        'used': 0.0,
                                        'total': balance
                                    };

                                    result[code] = account;
                                }
                                return _context8.abrupt('return', this.parseBalance(result));

                            case 10:
                            case 'end':
                                return _context8.stop();
                        }
                    }
                }, _callee8, this);
            }));

            function fetchBalance() {
                return _ref8.apply(this, arguments);
            }

            return fetchBalance;
        }()
    }, {
        key: 'createOrder',
        value: function () {
            var _ref9 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee9(symbol, type, side, amount) {
                var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
                var market, order, response, length, id;
                return _regeneratorRuntime.wrap(function _callee9$(_context9) {
                    while (1) {
                        switch (_context9.prev = _context9.next) {
                            case 0:
                                _context9.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                order = {
                                    'pair': market['id'],
                                    'type': side,
                                    'ordertype': type,
                                    'volume': this.amountToPrecision(symbol, amount)
                                };

                                if (type == 'limit') order['price'] = this.priceToPrecision(symbol, price);
                                _context9.next = 7;
                                return this.privatePostAddOrder(this.extend(order, params));

                            case 7:
                                response = _context9.sent;
                                length = response['result']['txid'].length;
                                id = length > 1 ? response['result']['txid'] : response['result']['txid'][0];
                                return _context9.abrupt('return', {
                                    'info': response,
                                    'id': id
                                });

                            case 11:
                            case 'end':
                                return _context9.stop();
                        }
                    }
                }, _callee9, this);
            }));

            function createOrder(_x27, _x28, _x29, _x30) {
                return _ref9.apply(this, arguments);
            }

            return createOrder;
        }()
    }, {
        key: 'findMarketByAltnameOrId',
        value: function findMarketByAltnameOrId(id) {
            var result = undefined;
            if (id in this.marketsByAltname) {
                result = this.marketsByAltname[id];
            } else if (id in this.markets_by_id) {
                result = this.markets_by_id[id];
            }
            return result;
        }
    }, {
        key: 'parseOrder',
        value: function parseOrder(order) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var description = order['descr'];
            var side = description['type'];
            var type = description['ordertype'];
            var symbol = undefined;
            if (!market) market = this.findMarketByAltnameOrId(description['pair']);
            var timestamp = parseInt(order['opentm'] * 1000);
            var amount = parseFloat(order['vol']);
            var filled = parseFloat(order['vol_exec']);
            var remaining = amount - filled;
            var fee = undefined;
            var cost = this.safeFloat(order, 'cost');
            var price = this.safeFloat(description, 'price');
            if (!price) price = this.safeFloat(order, 'price');
            if (market) {
                symbol = market['symbol'];
                if ('fee' in order) {
                    var flags = order['oflags'];
                    var feeCost = this.safeFloat(order, 'fee');
                    fee = {
                        'cost': feeCost,
                        'rate': undefined
                    };
                    if (flags.indexOf('fciq') >= 0) {
                        fee['currency'] = market['quote'];
                    } else if (flags.indexOf('fcib') >= 0) {
                        fee['currency'] = market['base'];
                    }
                }
            }
            return {
                'id': order['id'],
                'info': order,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'status': order['status'],
                'symbol': symbol,
                'type': type,
                'side': side,
                'price': price,
                'cost': cost,
                'amount': amount,
                'filled': filled,
                'remaining': remaining,
                'fee': fee
                // 'trades': this.parseTrades (order['trades'], market),
            };
        }
    }, {
        key: 'parseOrders',
        value: function parseOrders(orders) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
            var since = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
            var limit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;

            var result = [];
            var ids = _Object$keys(orders);
            for (var i = 0; i < ids.length; i++) {
                var id = ids[i];
                var order = this.extend({ 'id': id }, orders[id]);
                result.push(this.parseOrder(order, market));
            }
            return this.filterBySinceLimit(result, since, limit);
        }
    }, {
        key: 'fetchOrder',
        value: function () {
            var _ref10 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee10(id) {
                var symbol = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
                var response, orders, order;
                return _regeneratorRuntime.wrap(function _callee10$(_context10) {
                    while (1) {
                        switch (_context10.prev = _context10.next) {
                            case 0:
                                _context10.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context10.next = 4;
                                return this.privatePostQueryOrders(this.extend({
                                    'trades': true, // whether or not to include trades in output (optional, default false)
                                    'txid': id // comma delimited list of transaction ids to query info about (20 maximum)
                                    // 'userref': 'optional', // restrict results to given user reference id (optional)
                                }, params));

                            case 4:
                                response = _context10.sent;
                                orders = response['result'];
                                order = this.parseOrder(this.extend({ 'id': id }, orders[id]));
                                return _context10.abrupt('return', this.extend({ 'info': response }, order));

                            case 8:
                            case 'end':
                                return _context10.stop();
                        }
                    }
                }, _callee10, this);
            }));

            function fetchOrder(_x37) {
                return _ref10.apply(this, arguments);
            }

            return fetchOrder;
        }()
    }, {
        key: 'fetchMyTrades',
        value: function () {
            var _ref11 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee11() {
                var symbol = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var request, response, trades, ids, i;
                return _regeneratorRuntime.wrap(function _callee11$(_context11) {
                    while (1) {
                        switch (_context11.prev = _context11.next) {
                            case 0:
                                _context11.next = 2;
                                return this.loadMarkets();

                            case 2:
                                request = {
                                    // 'type': 'all', // any position, closed position, closing position, no position
                                    // 'trades': false, // whether or not to include trades related to position in output
                                    // 'start': 1234567890, // starting unix timestamp or trade tx id of results (exclusive)
                                    // 'end': 1234567890, // ending unix timestamp or trade tx id of results (inclusive)
                                    // 'ofs' = result offset
                                };

                                if (since) request['start'] = parseInt(since / 1000);
                                _context11.next = 6;
                                return this.privatePostTradesHistory(this.extend(request, params));

                            case 6:
                                response = _context11.sent;
                                trades = response['result']['trades'];
                                ids = _Object$keys(trades);

                                for (i = 0; i < ids.length; i++) {
                                    trades[ids[i]]['id'] = ids[i];
                                }
                                return _context11.abrupt('return', this.parseTrades(trades, undefined, since, limit));

                            case 11:
                            case 'end':
                                return _context11.stop();
                        }
                    }
                }, _callee11, this);
            }));

            function fetchMyTrades() {
                return _ref11.apply(this, arguments);
            }

            return fetchMyTrades;
        }()
    }, {
        key: 'cancelOrder',
        value: function () {
            var _ref12 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee12(id) {
                var symbol = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
                var response;
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
                                return this.privatePostCancelOrder(this.extend({
                                    'txid': id
                                }, params));

                            case 6:
                                response = _context12.sent;
                                _context12.next = 15;
                                break;

                            case 9:
                                _context12.prev = 9;
                                _context12.t0 = _context12['catch'](3);

                                if (!this.last_http_response) {
                                    _context12.next = 14;
                                    break;
                                }

                                if (!(this.last_http_response.indexOf('EOrder:Unknown order') >= 0)) {
                                    _context12.next = 14;
                                    break;
                                }

                                throw new OrderNotFound(this.id + ' cancelOrder() error ' + this.last_http_response);

                            case 14:
                                throw _context12.t0;

                            case 15:
                                return _context12.abrupt('return', response);

                            case 16:
                            case 'end':
                                return _context12.stop();
                        }
                    }
                }, _callee12, this, [[3, 9]]);
            }));

            function cancelOrder(_x44) {
                return _ref12.apply(this, arguments);
            }

            return cancelOrder;
        }()
    }, {
        key: 'fetchOpenOrders',
        value: function () {
            var _ref13 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee13() {
                var symbol = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var request, response, orders;
                return _regeneratorRuntime.wrap(function _callee13$(_context13) {
                    while (1) {
                        switch (_context13.prev = _context13.next) {
                            case 0:
                                _context13.next = 2;
                                return this.loadMarkets();

                            case 2:
                                request = {};

                                if (since) request['start'] = parseInt(since / 1000);
                                _context13.next = 6;
                                return this.privatePostOpenOrders(this.extend(request, params));

                            case 6:
                                response = _context13.sent;
                                orders = this.parseOrders(response['result']['open'], undefined, since, limit);
                                return _context13.abrupt('return', this.filterOrdersBySymbol(orders, symbol));

                            case 9:
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
                var request, response, orders;
                return _regeneratorRuntime.wrap(function _callee14$(_context14) {
                    while (1) {
                        switch (_context14.prev = _context14.next) {
                            case 0:
                                _context14.next = 2;
                                return this.loadMarkets();

                            case 2:
                                request = {};

                                if (since) request['start'] = parseInt(since / 1000);
                                _context14.next = 6;
                                return this.privatePostClosedOrders(this.extend(request, params));

                            case 6:
                                response = _context14.sent;
                                orders = this.parseOrders(response['result']['closed'], undefined, since, limit);
                                return _context14.abrupt('return', this.filterOrdersBySymbol(orders, symbol));

                            case 9:
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
        key: 'fetchDepositMethods',
        value: function () {
            var _ref15 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee15() {
                var code = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var request, currency, response;
                return _regeneratorRuntime.wrap(function _callee15$(_context15) {
                    while (1) {
                        switch (_context15.prev = _context15.next) {
                            case 0:
                                _context15.next = 2;
                                return this.loadMarkets();

                            case 2:
                                request = {};

                                if (code) {
                                    currency = this.currency(code);

                                    request['asset'] = currency['id'];
                                }
                                _context15.next = 6;
                                return this.privatePostDepositMethods(this.extend(request, params));

                            case 6:
                                response = _context15.sent;
                                return _context15.abrupt('return', response['result']);

                            case 8:
                            case 'end':
                                return _context15.stop();
                        }
                    }
                }, _callee15, this);
            }));

            function fetchDepositMethods() {
                return _ref15.apply(this, arguments);
            }

            return fetchDepositMethods;
        }()
    }, {
        key: 'createDepositAddress',
        value: function () {
            var _ref16 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee16(currency) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var request, response;
                return _regeneratorRuntime.wrap(function _callee16$(_context16) {
                    while (1) {
                        switch (_context16.prev = _context16.next) {
                            case 0:
                                request = {
                                    'new': 'true'
                                };
                                _context16.next = 3;
                                return this.fetchDepositAddress(currency, this.extend(request, params));

                            case 3:
                                response = _context16.sent;
                                return _context16.abrupt('return', {
                                    'currency': currency,
                                    'address': response['address'],
                                    'status': 'ok',
                                    'info': response
                                });

                            case 5:
                            case 'end':
                                return _context16.stop();
                        }
                    }
                }, _callee16, this);
            }));

            function createDepositAddress(_x56) {
                return _ref16.apply(this, arguments);
            }

            return createDepositAddress;
        }()
    }, {
        key: 'fetchDepositAddress',
        value: function () {
            var _ref17 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee17(code) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var method, currency, request, response, result, numResults, address;
                return _regeneratorRuntime.wrap(function _callee17$(_context17) {
                    while (1) {
                        switch (_context17.prev = _context17.next) {
                            case 0:
                                method = this.safeValue(params, 'method');

                                if (method) {
                                    _context17.next = 3;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' fetchDepositAddress() requires an extra `method` parameter');

                            case 3:
                                _context17.next = 5;
                                return this.loadMarkets();

                            case 5:
                                currency = this.currency(code);
                                request = {
                                    'asset': currency['id'],
                                    'method': method,
                                    'new': 'false'
                                };
                                _context17.next = 9;
                                return this.privatePostDepositAddresses(this.extend(request, params));

                            case 9:
                                response = _context17.sent;
                                result = response['result'];
                                numResults = result.length;

                                if (!(numResults < 1)) {
                                    _context17.next = 14;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' privatePostDepositAddresses() returned no addresses');

                            case 14:
                                address = this.safeString(result[0], 'address');
                                return _context17.abrupt('return', {
                                    'currency': code,
                                    'address': address,
                                    'status': 'ok',
                                    'info': response
                                });

                            case 16:
                            case 'end':
                                return _context17.stop();
                        }
                    }
                }, _callee17, this);
            }));

            function fetchDepositAddress(_x58) {
                return _ref17.apply(this, arguments);
            }

            return fetchDepositAddress;
        }()
    }, {
        key: 'withdraw',
        value: function () {
            var _ref18 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee18(currency, amount, address) {
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var response;
                return _regeneratorRuntime.wrap(function _callee18$(_context18) {
                    while (1) {
                        switch (_context18.prev = _context18.next) {
                            case 0:
                                if (!('key' in params)) {
                                    _context18.next = 7;
                                    break;
                                }

                                _context18.next = 3;
                                return this.loadMarkets();

                            case 3:
                                _context18.next = 5;
                                return this.privatePostWithdraw(this.extend({
                                    'asset': currency,
                                    'amount': amount
                                    // 'address': address, // they don't allow withdrawals to direct addresses
                                }, params));

                            case 5:
                                response = _context18.sent;
                                return _context18.abrupt('return', {
                                    'info': response,
                                    'id': response['result']
                                });

                            case 7:
                                throw new ExchangeError(this.id + " withdraw requires a 'key' parameter (withdrawal key name, as set up on your account)");

                            case 8:
                            case 'end':
                                return _context18.stop();
                        }
                    }
                }, _callee18, this);
            }));

            function withdraw(_x60, _x61, _x62) {
                return _ref18.apply(this, arguments);
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

            var url = '/' + this.version + '/' + api + '/' + path;
            if (api == 'public') {
                if (_Object$keys(params).length) url += '?' + this.urlencode(params);
            } else {
                this.checkRequiredCredentials();
                var nonce = this.nonce().toString();
                body = this.urlencode(this.extend({ 'nonce': nonce }, params));
                var auth = this.encode(nonce + body);
                var hash = this.hash(auth, 'sha256', 'binary');
                var binary = this.stringToBinary(this.encode(url));
                var binhash = this.binaryConcat(binary, hash);
                var secret = this.base64ToBinary(this.secret);
                var signature = this.hmac(binhash, secret, 'sha512', 'base64');
                headers = {
                    'API-Key': this.apiKey,
                    'API-Sign': this.decode(signature),
                    'Content-Type': 'application/x-www-form-urlencoded'
                };
            }
            url = this.urls['api'] + url;
            return { 'url': url, 'method': method, 'body': body, 'headers': headers };
        }
    }, {
        key: 'nonce',
        value: function nonce() {
            return this.milliseconds();
        }
    }, {
        key: 'request',
        value: function () {
            var _ref19 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee19(path) {
                var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
                var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;
                var response, numErrors, i;
                return _regeneratorRuntime.wrap(function _callee19$(_context19) {
                    while (1) {
                        switch (_context19.prev = _context19.next) {
                            case 0:
                                _context19.next = 2;
                                return this.fetch2(path, api, method, params, headers, body);

                            case 2:
                                response = _context19.sent;

                                if (!('error' in response)) {
                                    _context19.next = 16;
                                    break;
                                }

                                numErrors = response['error'].length;

                                if (!numErrors) {
                                    _context19.next = 16;
                                    break;
                                }

                                i = 0;

                            case 7:
                                if (!(i < response['error'].length)) {
                                    _context19.next = 15;
                                    break;
                                }

                                if (!(response['error'][i] == 'EService:Unavailable')) {
                                    _context19.next = 10;
                                    break;
                                }

                                throw new ExchangeNotAvailable(this.id + ' ' + this.json(response));

                            case 10:
                                if (!(response['error'][i] == 'EService:Busy')) {
                                    _context19.next = 12;
                                    break;
                                }

                                throw new DDoSProtection(this.id + ' ' + this.json(response));

                            case 12:
                                i++;
                                _context19.next = 7;
                                break;

                            case 15:
                                throw new ExchangeError(this.id + ' ' + this.json(response));

                            case 16:
                                return _context19.abrupt('return', response);

                            case 17:
                            case 'end':
                                return _context19.stop();
                        }
                    }
                }, _callee19, this);
            }));

            function request(_x73) {
                return _ref19.apply(this, arguments);
            }

            return request;
        }()
    }]);

    return kraken;
}(Exchange);