"use strict";

// ---------------------------------------------------------------------------

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var bitfinex = require('./bitfinex.js');

var _require = require('./base/errors'),
    ExchangeError = _require.ExchangeError,
    NotSupported = _require.NotSupported,
    InsufficientFunds = _require.InsufficientFunds;

// ---------------------------------------------------------------------------

module.exports = function (_bitfinex) {
    _inherits(bitfinex2, _bitfinex);

    function bitfinex2() {
        _classCallCheck(this, bitfinex2);

        return _possibleConstructorReturn(this, (bitfinex2.__proto__ || Object.getPrototypeOf(bitfinex2)).apply(this, arguments));
    }

    _createClass(bitfinex2, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend(_get(bitfinex2.prototype.__proto__ || Object.getPrototypeOf(bitfinex2.prototype), 'describe', this).call(this), {
                'id': 'bitfinex2',
                'name': 'Bitfinex v2',
                'countries': 'VG',
                'version': 'v2',
                'hasCORS': true,
                // old metainfo interface
                'hasFetchOrder': true,
                'hasFetchTickers': true,
                'hasFetchOHLCV': true,
                'hasWithdraw': true,
                'hasDeposit': false,
                'hasFetchOpenOrders': false,
                'hasFetchClosedOrders': false,
                // new metainfo interface
                'has': {
                    'fetchOHLCV': true,
                    'fetchTickers': true,
                    'fetchOrder': true,
                    'fetchOpenOrders': false,
                    'fetchClosedOrders': false,
                    'withdraw': true,
                    'deposit': false
                },
                'timeframes': {
                    '1m': '1m',
                    '5m': '5m',
                    '15m': '15m',
                    '30m': '30m',
                    '1h': '1h',
                    '3h': '3h',
                    '6h': '6h',
                    '12h': '12h',
                    '1d': '1D',
                    '1w': '7D',
                    '2w': '14D',
                    '1M': '1M'
                },
                'rateLimit': 1500,
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/27766244-e328a50c-5ed2-11e7-947b-041416579bb3.jpg',
                    'api': 'https://api.bitfinex.com',
                    'www': 'https://www.bitfinex.com',
                    'doc': ['https://bitfinex.readme.io/v2/docs', 'https://github.com/bitfinexcom/bitfinex-api-node'],
                    'fees': 'https://www.bitfinex.com/fees'
                },
                'api': {
                    'public': {
                        'get': ['platform/status', 'tickers', 'ticker/{symbol}', 'trades/{symbol}/hist', 'book/{symbol}/{precision}', 'book/{symbol}/P0', 'book/{symbol}/P1', 'book/{symbol}/P2', 'book/{symbol}/P3', 'book/{symbol}/R0', 'symbols_details', 'stats1/{key}:{size}:{symbol}/{side}/{section}', 'stats1/{key}:{size}:{symbol}/long/last', 'stats1/{key}:{size}:{symbol}/long/hist', 'stats1/{key}:{size}:{symbol}/short/last', 'stats1/{key}:{size}:{symbol}/short/hist', 'candles/trade:{timeframe}:{symbol}/{section}', 'candles/trade:{timeframe}:{symbol}/last', 'candles/trade:{timeframe}:{symbol}/hist'],
                        'post': ['calc/trade/avg']
                    },
                    'private': {
                        'post': ['auth/r/wallets', 'auth/r/orders/{symbol}', 'auth/r/orders/{symbol}/new', 'auth/r/orders/{symbol}/hist', 'auth/r/order/{symbol}:{id}/trades', 'auth/r/trades/{symbol}/hist', 'auth/r/positions', 'auth/r/funding/offers/{symbol}', 'auth/r/funding/offers/{symbol}/hist', 'auth/r/funding/loans/{symbol}', 'auth/r/funding/loans/{symbol}/hist', 'auth/r/funding/credits/{symbol}', 'auth/r/funding/credits/{symbol}/hist', 'auth/r/funding/trades/{symbol}/hist', 'auth/r/info/margin/{key}', 'auth/r/info/funding/{key}', 'auth/r/movements/{currency}/hist', 'auth/r/stats/perf:{timeframe}/hist', 'auth/r/alerts', 'auth/w/alert/set', 'auth/w/alert/{type}:{symbol}:{price}/del', 'auth/calc/order/avail']
                    }
                },
                'markets': {
                    'AVT/BTC': { 'id': 'tAVTBTC', 'symbol': 'AVT/BTC', 'base': 'AVT', 'quote': 'BTC' },
                    'AVT/ETH': { 'id': 'tAVTETH', 'symbol': 'AVT/ETH', 'base': 'AVT', 'quote': 'ETH' },
                    'AVT/USD': { 'id': 'tAVTUSD', 'symbol': 'AVT/USD', 'base': 'AVT', 'quote': 'USD' },
                    'CST_BCC/BTC': { 'id': 'tBCCBTC', 'symbol': 'CST_BCC/BTC', 'base': 'CST_BCC', 'quote': 'BTC' },
                    'CST_BCC/USD': { 'id': 'tBCCUSD', 'symbol': 'CST_BCC/USD', 'base': 'CST_BCC', 'quote': 'USD' },
                    'BCH/BTC': { 'id': 'tBCHBTC', 'symbol': 'BCH/BTC', 'base': 'BCH', 'quote': 'BTC' },
                    'BCH/ETH': { 'id': 'tBCHETH', 'symbol': 'BCH/ETH', 'base': 'BCH', 'quote': 'ETH' },
                    'BCH/USD': { 'id': 'tBCHUSD', 'symbol': 'BCH/USD', 'base': 'BCH', 'quote': 'USD' },
                    'CST_BCU/BTC': { 'id': 'tBCUBTC', 'symbol': 'CST_BCU/BTC', 'base': 'CST_BCU', 'quote': 'BTC' },
                    'CST_BCU/USD': { 'id': 'tBCUUSD', 'symbol': 'CST_BCU/USD', 'base': 'CST_BCU', 'quote': 'USD' },
                    'BT1/BTC': { 'id': 'tBT1BTC', 'symbol': 'BT1/BTC', 'base': 'BT1', 'quote': 'BTC' },
                    'BT1/USD': { 'id': 'tBT1USD', 'symbol': 'BT1/USD', 'base': 'BT1', 'quote': 'USD' },
                    'BT2/BTC': { 'id': 'tBT2BTC', 'symbol': 'BT2/BTC', 'base': 'BT2', 'quote': 'BTC' },
                    'BT2/USD': { 'id': 'tBT2USD', 'symbol': 'BT2/USD', 'base': 'BT2', 'quote': 'USD' },
                    'BTC/USD': { 'id': 'tBTCUSD', 'symbol': 'BTC/USD', 'base': 'BTC', 'quote': 'USD' },
                    'BTC/EUR': { 'id': 'tBTCEUR', 'symbol': 'BTC/EUR', 'base': 'BTC', 'quote': 'EUR' },
                    'BTG/BTC': { 'id': 'tBTGBTC', 'symbol': 'BTG/BTC', 'base': 'BTG', 'quote': 'BTC' },
                    'BTG/USD': { 'id': 'tBTGUSD', 'symbol': 'BTG/USD', 'base': 'BTG', 'quote': 'USD' },
                    'DASH/BTC': { 'id': 'tDSHBTC', 'symbol': 'DASH/BTC', 'base': 'DASH', 'quote': 'BTC' },
                    'DASH/USD': { 'id': 'tDSHUSD', 'symbol': 'DASH/USD', 'base': 'DASH', 'quote': 'USD' },
                    'DAT/BTC': { 'id': 'tDATBTC', 'symbol': 'DAT/BTC', 'base': 'DAT', 'quote': 'BTC' },
                    'DAT/ETH': { 'id': 'tDATETH', 'symbol': 'DAT/ETH', 'base': 'DAT', 'quote': 'ETH' },
                    'DAT/USD': { 'id': 'tDATUSD', 'symbol': 'DAT/USD', 'base': 'DAT', 'quote': 'USD' },
                    'EDO/BTC': { 'id': 'tEDOBTC', 'symbol': 'EDO/BTC', 'base': 'EDO', 'quote': 'BTC' },
                    'EDO/ETH': { 'id': 'tEDOETH', 'symbol': 'EDO/ETH', 'base': 'EDO', 'quote': 'ETH' },
                    'EDO/USD': { 'id': 'tEDOUSD', 'symbol': 'EDO/USD', 'base': 'EDO', 'quote': 'USD' },
                    'EOS/BTC': { 'id': 'tEOSBTC', 'symbol': 'EOS/BTC', 'base': 'EOS', 'quote': 'BTC' },
                    'EOS/ETH': { 'id': 'tEOSETH', 'symbol': 'EOS/ETH', 'base': 'EOS', 'quote': 'ETH' },
                    'EOS/USD': { 'id': 'tEOSUSD', 'symbol': 'EOS/USD', 'base': 'EOS', 'quote': 'USD' },
                    'ETC/BTC': { 'id': 'tETCBTC', 'symbol': 'ETC/BTC', 'base': 'ETC', 'quote': 'BTC' },
                    'ETC/USD': { 'id': 'tETCUSD', 'symbol': 'ETC/USD', 'base': 'ETC', 'quote': 'USD' },
                    'ETH/BTC': { 'id': 'tETHBTC', 'symbol': 'ETH/BTC', 'base': 'ETH', 'quote': 'BTC' },
                    'ETH/USD': { 'id': 'tETHUSD', 'symbol': 'ETH/USD', 'base': 'ETH', 'quote': 'USD' },
                    'ETP/BTC': { 'id': 'tETPBTC', 'symbol': 'ETP/BTC', 'base': 'ETP', 'quote': 'BTC' },
                    'ETP/ETH': { 'id': 'tETPETH', 'symbol': 'ETP/ETH', 'base': 'ETP', 'quote': 'ETH' },
                    'ETP/USD': { 'id': 'tETPUSD', 'symbol': 'ETP/USD', 'base': 'ETP', 'quote': 'USD' },
                    'IOTA/BTC': { 'id': 'tIOTBTC', 'symbol': 'IOTA/BTC', 'base': 'IOTA', 'quote': 'BTC' },
                    'IOTA/ETH': { 'id': 'tIOTETH', 'symbol': 'IOTA/ETH', 'base': 'IOTA', 'quote': 'ETH' },
                    'IOTA/USD': { 'id': 'tIOTUSD', 'symbol': 'IOTA/USD', 'base': 'IOTA', 'quote': 'USD' },
                    'LTC/BTC': { 'id': 'tLTCBTC', 'symbol': 'LTC/BTC', 'base': 'LTC', 'quote': 'BTC' },
                    'LTC/USD': { 'id': 'tLTCUSD', 'symbol': 'LTC/USD', 'base': 'LTC', 'quote': 'USD' },
                    'NEO/BTC': { 'id': 'tNEOBTC', 'symbol': 'NEO/BTC', 'base': 'NEO', 'quote': 'BTC' },
                    'NEO/ETH': { 'id': 'tNEOETH', 'symbol': 'NEO/ETH', 'base': 'NEO', 'quote': 'ETH' },
                    'NEO/USD': { 'id': 'tNEOUSD', 'symbol': 'NEO/USD', 'base': 'NEO', 'quote': 'USD' },
                    'OMG/BTC': { 'id': 'tOMGBTC', 'symbol': 'OMG/BTC', 'base': 'OMG', 'quote': 'BTC' },
                    'OMG/ETH': { 'id': 'tOMGETH', 'symbol': 'OMG/ETH', 'base': 'OMG', 'quote': 'ETH' },
                    'OMG/USD': { 'id': 'tOMGUSD', 'symbol': 'OMG/USD', 'base': 'OMG', 'quote': 'USD' },
                    'QTUM/BTC': { 'id': 'tQTMBTC', 'symbol': 'QTUM/BTC', 'base': 'QTUM', 'quote': 'BTC' },
                    'QTUM/ETH': { 'id': 'tQTMETH', 'symbol': 'QTUM/ETH', 'base': 'QTUM', 'quote': 'ETH' },
                    'QTUM/USD': { 'id': 'tQTMUSD', 'symbol': 'QTUM/USD', 'base': 'QTUM', 'quote': 'USD' },
                    'RRT/BTC': { 'id': 'tRRTBTC', 'symbol': 'RRT/BTC', 'base': 'RRT', 'quote': 'BTC' },
                    'RRT/USD': { 'id': 'tRRTUSD', 'symbol': 'RRT/USD', 'base': 'RRT', 'quote': 'USD' },
                    'SAN/BTC': { 'id': 'tSANBTC', 'symbol': 'SAN/BTC', 'base': 'SAN', 'quote': 'BTC' },
                    'SAN/ETH': { 'id': 'tSANETH', 'symbol': 'SAN/ETH', 'base': 'SAN', 'quote': 'ETH' },
                    'SAN/USD': { 'id': 'tSANUSD', 'symbol': 'SAN/USD', 'base': 'SAN', 'quote': 'USD' },
                    'XMR/BTC': { 'id': 'tXMRBTC', 'symbol': 'XMR/BTC', 'base': 'XMR', 'quote': 'BTC' },
                    'XMR/USD': { 'id': 'tXMRUSD', 'symbol': 'XMR/USD', 'base': 'XMR', 'quote': 'USD' },
                    'XRP/BTC': { 'id': 'tXRPBTC', 'symbol': 'XRP/BTC', 'base': 'XRP', 'quote': 'BTC' },
                    'XRP/USD': { 'id': 'tXRPUSD', 'symbol': 'XRP/USD', 'base': 'XRP', 'quote': 'USD' },
                    'ZEC/BTC': { 'id': 'tZECBTC', 'symbol': 'ZEC/BTC', 'base': 'ZEC', 'quote': 'BTC' },
                    'ZEC/USD': { 'id': 'tZECUSD', 'symbol': 'ZEC/USD', 'base': 'ZEC', 'quote': 'USD' }
                },
                'fees': {
                    'trading': {
                        'maker': 0.1 / 100,
                        'taker': 0.2 / 100
                    },
                    'funding': {
                        'withdraw': {
                            'BTC': 0.0005,
                            'BCH': 0.0005,
                            'ETH': 0.01,
                            'EOS': 0.1,
                            'LTC': 0.001,
                            'OMG': 0.1,
                            'IOT': 0.0,
                            'NEO': 0.0,
                            'ETC': 0.01,
                            'XRP': 0.02,
                            'ETP': 0.01,
                            'ZEC': 0.001,
                            'BTG': 0.0,
                            'DASH': 0.01,
                            'XMR': 0.04,
                            'QTM': 0.01,
                            'EDO': 0.5,
                            'DAT': 1.0,
                            'AVT': 0.5,
                            'SAN': 0.1,
                            'USDT': 5.0
                        }
                    }
                }
            });
        }
    }, {
        key: 'commonCurrencyCode',
        value: function commonCurrencyCode(currency) {
            // issue #4 Bitfinex names Dash as DSH, instead of DASH
            if (currency == 'DSH') return 'DASH';
            if (currency == 'QTM') return 'QTUM';
            // issue #796
            if (currency == 'IOT') return 'IOTA';
            return currency;
        }
    }, {
        key: 'fetchBalance',
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                var response, balanceType, result, b, balance, _balance, accountType, currency, total, interest, available, uppercase, account;

                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.privatePostAuthRWallets();

                            case 2:
                                response = _context.sent;
                                balanceType = this.safeString(params, 'type', 'exchange');
                                result = { 'info': response };

                                for (b = 0; b < response.length; b++) {
                                    balance = response[b];
                                    _balance = _slicedToArray(balance, 5), accountType = _balance[0], currency = _balance[1], total = _balance[2], interest = _balance[3], available = _balance[4];

                                    if (accountType == balanceType) {
                                        if (currency[0] == 't') currency = currency.slice(1);
                                        uppercase = currency.toUpperCase();

                                        uppercase = this.commonCurrencyCode(uppercase);
                                        account = this.account();

                                        account['free'] = available;
                                        account['total'] = total;
                                        if (account['free']) account['used'] = account['total'] - account['free'];
                                        result[uppercase] = account;
                                    }
                                }
                                return _context.abrupt('return', this.parseBalance(result));

                            case 7:
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
                var orderbook, timestamp, result, i, order, price, amount, side;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this.publicGetBookSymbolPrecision(this.extend({
                                    'symbol': this.marketId(symbol),
                                    'precision': 'R0'
                                }, params));

                            case 2:
                                orderbook = _context2.sent;
                                timestamp = this.milliseconds();
                                result = {
                                    'bids': [],
                                    'asks': [],
                                    'timestamp': timestamp,
                                    'datetime': this.iso8601(timestamp)
                                };

                                for (i = 0; i < orderbook.length; i++) {
                                    order = orderbook[i];
                                    price = order[1];
                                    amount = order[2];
                                    side = amount > 0 ? 'bids' : 'asks';

                                    amount = Math.abs(amount);
                                    result[side].push([price, amount]);
                                }
                                result['bids'] = this.sortBy(result['bids'], 0, true);
                                result['asks'] = this.sortBy(result['asks'], 0);
                                return _context2.abrupt('return', result);

                            case 9:
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
        key: 'parseTicker',
        value: function parseTicker(ticker) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var timestamp = this.milliseconds();
            var symbol = undefined;
            if (market) symbol = market['symbol'];
            var length = ticker.length;
            return {
                'symbol': symbol,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'high': ticker[length - 2],
                'low': ticker[length - 1],
                'bid': ticker[length - 10],
                'ask': ticker[length - 8],
                'vwap': undefined,
                'open': undefined,
                'close': undefined,
                'first': undefined,
                'last': ticker[length - 4],
                'change': ticker[length - 6],
                'percentage': ticker[length - 5],
                'average': undefined,
                'baseVolume': ticker[length - 3],
                'quoteVolume': undefined,
                'info': ticker
            };
        }
    }, {
        key: 'fetchTickers',
        value: function () {
            var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
                var symbols = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var tickers, result, i, ticker, id, market, symbol;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return this.publicGetTickers(this.extend({
                                    'symbols': this.ids.join(',')
                                }, params));

                            case 2:
                                tickers = _context3.sent;
                                result = {};

                                for (i = 0; i < tickers.length; i++) {
                                    ticker = tickers[i];
                                    id = ticker[0];
                                    market = this.markets_by_id[id];
                                    symbol = market['symbol'];

                                    result[symbol] = this.parseTicker(ticker, market);
                                }
                                return _context3.abrupt('return', result);

                            case 6:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function fetchTickers() {
                return _ref3.apply(this, arguments);
            }

            return fetchTickers;
        }()
    }, {
        key: 'fetchTicker',
        value: function () {
            var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var market, ticker;
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                market = this.markets[symbol];
                                _context4.next = 3;
                                return this.publicGetTickerSymbol(this.extend({
                                    'symbol': market['id']
                                }, params));

                            case 3:
                                ticker = _context4.sent;
                                return _context4.abrupt('return', this.parseTicker(ticker, market));

                            case 5:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function fetchTicker(_x8) {
                return _ref4.apply(this, arguments);
            }

            return fetchTicker;
        }()
    }, {
        key: 'parseTrade',
        value: function parseTrade(trade, market) {
            var _trade = _slicedToArray(trade, 4),
                id = _trade[0],
                timestamp = _trade[1],
                amount = _trade[2],
                price = _trade[3];

            var side = amount < 0 ? 'sell' : 'buy';
            if (amount < 0) {
                amount = -amount;
            }
            return {
                'id': id.toString(),
                'info': trade,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'symbol': market['symbol'],
                'type': undefined,
                'side': side,
                'price': price,
                'amount': amount
            };
        }
    }, {
        key: 'fetchTrades',
        value: function () {
            var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(symbol) {
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var market, request, response;
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                market = this.market(symbol);
                                request = {
                                    'symbol': market['id']
                                };

                                if (since) {
                                    request['start'] = since;
                                }
                                if (limit) {
                                    request['limit'] = limit;
                                }
                                _context5.next = 6;
                                return this.publicGetTradesSymbolHist(this.extend(request, params));

                            case 6:
                                response = _context5.sent;
                                return _context5.abrupt('return', this.parseTrades(response, market, since, limit));

                            case 8:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function fetchTrades(_x12) {
                return _ref5.apply(this, arguments);
            }

            return fetchTrades;
        }()
    }, {
        key: 'fetchOHLCV',
        value: function () {
            var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(symbol) {
                var timeframe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '1m';
                var since = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var limit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
                var params = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
                var market, request, response;
                return regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                market = this.market(symbol);
                                request = {
                                    'symbol': market['id'],
                                    'timeframe': this.timeframes[timeframe]
                                };

                                if (limit) request['limit'] = limit;
                                if (since) request['start'] = since;
                                request = this.extend(request, params);
                                _context6.next = 7;
                                return this.publicGetCandlesTradeTimeframeSymbolHist(request);

                            case 7:
                                response = _context6.sent;
                                return _context6.abrupt('return', this.parseOHLCVs(response, market, timeframe, since, limit));

                            case 9:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function fetchOHLCV(_x17) {
                return _ref6.apply(this, arguments);
            }

            return fetchOHLCV;
        }()
    }, {
        key: 'createOrder',
        value: function () {
            var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(symbol, type, side, amount) {
                var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
                return regeneratorRuntime.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                throw new NotSupported(this.id + ' createOrder not implemented yet');

                            case 1:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function createOrder(_x20, _x21, _x22, _x23) {
                return _ref7.apply(this, arguments);
            }

            return createOrder;
        }()
    }, {
        key: 'cancelOrder',
        value: function cancelOrder(id) {
            var symbol = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
            var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

            throw new NotSupported(this.id + ' cancelOrder not implemented yet');
        }
    }, {
        key: 'fetchOrder',
        value: function () {
            var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(id) {
                var symbol = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
                return regeneratorRuntime.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                throw new NotSupported(this.id + ' fetchOrder not implemented yet');

                            case 1:
                            case 'end':
                                return _context8.stop();
                        }
                    }
                }, _callee8, this);
            }));

            function fetchOrder(_x28) {
                return _ref8.apply(this, arguments);
            }

            return fetchOrder;
        }()
    }, {
        key: 'withdraw',
        value: function () {
            var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(currency, amount, address) {
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                return regeneratorRuntime.wrap(function _callee9$(_context9) {
                    while (1) {
                        switch (_context9.prev = _context9.next) {
                            case 0:
                                throw new NotSupported(this.id + ' withdraw not implemented yet');

                            case 1:
                            case 'end':
                                return _context9.stop();
                        }
                    }
                }, _callee9, this);
            }));

            function withdraw(_x30, _x31, _x32) {
                return _ref9.apply(this, arguments);
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

            var request = this.version + '/' + this.implodeParams(path, params);
            var query = this.omit(params, this.extractParams(path));
            var url = this.urls['api'] + '/' + request;
            if (api == 'public') {
                if (Object.keys(query).length) {
                    url += '?' + this.urlencode(query);
                }
            } else {
                this.checkRequiredCredentials();
                var nonce = this.nonce().toString();
                body = this.json(query);
                var auth = '/api' + '/' + request + nonce + body;
                var signature = this.hmac(this.encode(auth), this.encode(this.secret), 'sha384');
                headers = {
                    'bfx-nonce': nonce,
                    'bfx-apikey': this.apiKey,
                    'bfx-signature': signature,
                    'Content-Type': 'application/json'
                };
            }
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

                                if (!response) {
                                    _context10.next = 11;
                                    break;
                                }

                                if (!('message' in response)) {
                                    _context10.next = 8;
                                    break;
                                }

                                if (!(response['message'].indexOf('not enough exchange balance') >= 0)) {
                                    _context10.next = 7;
                                    break;
                                }

                                throw new InsufficientFunds(this.id + ' ' + this.json(response));

                            case 7:
                                throw new ExchangeError(this.id + ' ' + this.json(response));

                            case 8:
                                return _context10.abrupt('return', response);

                            case 11:
                                if (!(response == '')) {
                                    _context10.next = 13;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' returned empty response');

                            case 13:
                                return _context10.abrupt('return', response);

                            case 14:
                            case 'end':
                                return _context10.stop();
                        }
                    }
                }, _callee10, this);
            }));

            function request(_x43) {
                return _ref10.apply(this, arguments);
            }

            return request;
        }()
    }]);

    return bitfinex2;
}(bitfinex);