"use strict";

// ---------------------------------------------------------------------------

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

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
    NotSupported = _require.NotSupported,
    AuthenticationError = _require.AuthenticationError;

// ---------------------------------------------------------------------------

module.exports = function (_Exchange) {
    (0, _inherits3.default)(xbtce, _Exchange);

    function xbtce() {
        (0, _classCallCheck3.default)(this, xbtce);
        return (0, _possibleConstructorReturn3.default)(this, (xbtce.__proto__ || (0, _getPrototypeOf2.default)(xbtce)).apply(this, arguments));
    }

    (0, _createClass3.default)(xbtce, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend((0, _get3.default)(xbtce.prototype.__proto__ || (0, _getPrototypeOf2.default)(xbtce.prototype), 'describe', this).call(this), {
                'id': 'xbtce',
                'name': 'xBTCe',
                'countries': 'RU',
                'rateLimit': 2000, // responses are cached every 2 seconds
                'version': 'v1',
                'hasPublicAPI': false,
                'hasCORS': false,
                'hasFetchTickers': true,
                'hasFetchOHLCV': false,
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/28059414-e235970c-662c-11e7-8c3a-08e31f78684b.jpg',
                    'api': 'https://cryptottlivewebapi.xbtce.net:8443/api',
                    'www': 'https://www.xbtce.com',
                    'doc': ['https://www.xbtce.com/tradeapi', 'https://support.xbtce.info/Knowledgebase/Article/View/52/25/xbtce-exchange-api']
                },
                'requiredCredentials': {
                    'apiKey': true,
                    'secret': true,
                    'uid': true
                },
                'api': {
                    'public': {
                        'get': ['currency', 'currency/{filter}', 'level2', 'level2/{filter}', 'quotehistory/{symbol}/{periodicity}/bars/ask', 'quotehistory/{symbol}/{periodicity}/bars/bid', 'quotehistory/{symbol}/level2', 'quotehistory/{symbol}/ticks', 'symbol', 'symbol/{filter}', 'tick', 'tick/{filter}', 'ticker', 'ticker/{filter}', 'tradesession']
                    },
                    'private': {
                        'get': ['tradeserverinfo', 'tradesession', 'currency', 'currency/{filter}', 'level2', 'level2/{filter}', 'symbol', 'symbol/{filter}', 'tick', 'tick/{filter}', 'account', 'asset', 'asset/{id}', 'position', 'position/{id}', 'trade', 'trade/{id}', 'quotehistory/{symbol}/{periodicity}/bars/ask', 'quotehistory/{symbol}/{periodicity}/bars/ask/info', 'quotehistory/{symbol}/{periodicity}/bars/bid', 'quotehistory/{symbol}/{periodicity}/bars/bid/info', 'quotehistory/{symbol}/level2', 'quotehistory/{symbol}/level2/info', 'quotehistory/{symbol}/periodicities', 'quotehistory/{symbol}/ticks', 'quotehistory/{symbol}/ticks/info', 'quotehistory/cache/{symbol}/{periodicity}/bars/ask', 'quotehistory/cache/{symbol}/{periodicity}/bars/bid', 'quotehistory/cache/{symbol}/level2', 'quotehistory/cache/{symbol}/ticks', 'quotehistory/symbols', 'quotehistory/version'],
                        'post': ['trade', 'tradehistory'],
                        'put': ['trade'],
                        'delete': ['trade']
                    }
                }
            });
        }
    }, {
        key: 'fetchMarkets',
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                var markets, result, p, market, id, base, quote, symbol;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.privateGetSymbol();

                            case 2:
                                markets = _context.sent;
                                result = [];

                                for (p = 0; p < markets.length; p++) {
                                    market = markets[p];
                                    id = market['Symbol'];
                                    base = market['MarginCurrency'];
                                    quote = market['ProfitCurrency'];

                                    if (base == 'DSH') base = 'DASH';
                                    symbol = base + '/' + quote;

                                    symbol = market['IsTradeAllowed'] ? symbol : id;
                                    result.push({
                                        'id': id,
                                        'symbol': symbol,
                                        'base': base,
                                        'quote': quote,
                                        'info': market
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
                var balances, result, b, balance, currency, uppercase, account;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context2.next = 4;
                                return this.privateGetAsset();

                            case 4:
                                balances = _context2.sent;
                                result = { 'info': balances };

                                for (b = 0; b < balances.length; b++) {
                                    balance = balances[b];
                                    currency = balance['Currency'];
                                    uppercase = currency.toUpperCase();
                                    // xbtce names DASH incorrectly as DSH

                                    if (uppercase == 'DSH') uppercase = 'DASH';
                                    account = {
                                        'free': balance['FreeAmount'],
                                        'used': balance['LockedAmount'],
                                        'total': balance['Amount']
                                    };

                                    result[uppercase] = account;
                                }
                                return _context2.abrupt('return', this.parseBalance(result));

                            case 8:
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
                var market, orderbook, timestamp;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                _context3.next = 5;
                                return this.privateGetLevel2Filter(this.extend({
                                    'filter': market['id']
                                }, params));

                            case 5:
                                orderbook = _context3.sent;

                                orderbook = orderbook[0];
                                timestamp = orderbook['Timestamp'];
                                return _context3.abrupt('return', this.parseOrderBook(orderbook, timestamp, 'Bids', 'Asks', 'Price', 'Volume'));

                            case 9:
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

            var timestamp = 0;
            var last = undefined;
            if ('LastBuyTimestamp' in ticker) if (timestamp < ticker['LastBuyTimestamp']) {
                timestamp = ticker['LastBuyTimestamp'];
                last = ticker['LastBuyPrice'];
            }
            if ('LastSellTimestamp' in ticker) if (timestamp < ticker['LastSellTimestamp']) {
                timestamp = ticker['LastSellTimestamp'];
                last = ticker['LastSellPrice'];
            }
            if (!timestamp) timestamp = this.milliseconds();
            var symbol = undefined;
            if (market) symbol = market['symbol'];
            return {
                'symbol': symbol,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'high': ticker['DailyBestBuyPrice'],
                'low': ticker['DailyBestSellPrice'],
                'bid': ticker['BestBid'],
                'ask': ticker['BestAsk'],
                'vwap': undefined,
                'open': undefined,
                'close': undefined,
                'first': undefined,
                'last': last,
                'change': undefined,
                'percentage': undefined,
                'average': undefined,
                'baseVolume': ticker['DailyTradedTotalVolume'],
                'quoteVolume': undefined,
                'info': ticker
            };
        }
    }, {
        key: 'fetchTickers',
        value: function () {
            var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
                var symbols = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var tickers, ids, result, i, id, market, symbol, base, quote, ticker;
                return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context4.next = 4;
                                return this.publicGetTicker(params);

                            case 4:
                                tickers = _context4.sent;

                                tickers = this.indexBy(tickers, 'Symbol');
                                ids = (0, _keys2.default)(tickers);
                                result = {};

                                for (i = 0; i < ids.length; i++) {
                                    id = ids[i];
                                    market = undefined;
                                    symbol = undefined;

                                    if (id in this.markets_by_id) {
                                        market = this.markets_by_id[id];
                                        symbol = market['symbol'];
                                    } else {
                                        base = id.slice(0, 3);
                                        quote = id.slice(3, 6);

                                        if (base == 'DSH') base = 'DASH';
                                        if (quote == 'DSH') quote = 'DASH';
                                        symbol = base + '/' + quote;
                                    }
                                    ticker = tickers[id];

                                    result[symbol] = this.parseTicker(ticker, market);
                                }
                                return _context4.abrupt('return', result);

                            case 10:
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
            var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var market, tickers, length, ticker;
                return _regenerator2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                _context5.next = 5;
                                return this.publicGetTickerFilter(this.extend({
                                    'filter': market['id']
                                }, params));

                            case 5:
                                tickers = _context5.sent;
                                length = tickers.length;

                                if (!(length < 1)) {
                                    _context5.next = 9;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' fetchTicker returned empty response, xBTCe public API error');

                            case 9:
                                tickers = this.indexBy(tickers, 'Symbol');
                                ticker = tickers[market['id']];
                                return _context5.abrupt('return', this.parseTicker(ticker, market));

                            case 12:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function fetchTicker(_x8) {
                return _ref5.apply(this, arguments);
            }

            return fetchTicker;
        }()
    }, {
        key: 'fetchTrades',
        value: function () {
            var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(symbol) {
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                return _regenerator2.default.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                _context6.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context6.next = 4;
                                return this.privateGetTrade(params);

                            case 4:
                                return _context6.abrupt('return', _context6.sent);

                            case 5:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function fetchTrades(_x12) {
                return _ref6.apply(this, arguments);
            }

            return fetchTrades;
        }()
    }, {
        key: 'parseOHLCV',
        value: function parseOHLCV(ohlcv) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
            var timeframe = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '1m';
            var since = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
            var limit = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;

            return [ohlcv['Timestamp'], ohlcv['Open'], ohlcv['High'], ohlcv['Low'], ohlcv['Close'], ohlcv['Volume']];
        }
    }, {
        key: 'fetchOHLCV',
        value: function () {
            var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(symbol) {
                var timeframe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '1m';
                var since = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var limit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
                var params = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
                var minutes, periodicity, market, response;
                return _regenerator2.default.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                throw new NotSupported(this.id + ' fetchOHLCV is disabled by the exchange');

                            case 5:
                                market = this.market(symbol);

                                if (!since) since = this.seconds() - 86400 * 7; // last day by defulat
                                if (!limit) limit = 1000; // default
                                _context7.next = 10;
                                return this.privateGetQuotehistorySymbolPeriodicityBarsBid(this.extend({
                                    'symbol': market['id'],
                                    'periodicity': periodicity,
                                    'timestamp': since,
                                    'count': limit
                                }, params));

                            case 10:
                                response = _context7.sent;
                                return _context7.abrupt('return', this.parseOHLCVs(response['Bars'], market, timeframe, since, limit));

                            case 12:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function fetchOHLCV(_x21) {
                return _ref7.apply(this, arguments);
            }

            return fetchOHLCV;
        }()
    }, {
        key: 'createOrder',
        value: function () {
            var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8(symbol, type, side, amount) {
                var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
                var response;
                return _regenerator2.default.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                _context8.next = 2;
                                return this.loadMarkets();

                            case 2:
                                if (!(type == 'market')) {
                                    _context8.next = 4;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' allows limit orders only');

                            case 4:
                                _context8.next = 6;
                                return this.tapiPostTrade(this.extend({
                                    'pair': this.marketId(symbol),
                                    'type': side,
                                    'amount': amount,
                                    'rate': price
                                }, params));

                            case 6:
                                response = _context8.sent;
                                return _context8.abrupt('return', {
                                    'info': response,
                                    'id': response['Id'].toString()
                                });

                            case 8:
                            case 'end':
                                return _context8.stop();
                        }
                    }
                }, _callee8, this);
            }));

            function createOrder(_x24, _x25, _x26, _x27) {
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
                                return this.privateDeleteTrade(this.extend({
                                    'Type': 'Cancel',
                                    'Id': id
                                }, params));

                            case 2:
                                return _context9.abrupt('return', _context9.sent);

                            case 3:
                            case 'end':
                                return _context9.stop();
                        }
                    }
                }, _callee9, this);
            }));

            function cancelOrder(_x30) {
                return _ref9.apply(this, arguments);
            }

            return cancelOrder;
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

            if (!this.apiKey) throw new AuthenticationError(this.id + ' requires apiKey for all requests, their public API is always busy');
            if (!this.uid) throw new AuthenticationError(this.id + ' requires uid property for authentication and trading, their public API is always busy');
            var url = this.urls['api'] + '/' + this.version;
            if (api == 'public') url += '/' + api;
            url += '/' + this.implodeParams(path, params);
            var query = this.omit(params, this.extractParams(path));
            if (api == 'public') {
                if ((0, _keys2.default)(query).length) url += '?' + this.urlencode(query);
            } else {
                this.checkRequiredCredentials();
                headers = { 'Accept-Encoding': 'gzip, deflate' };
                var nonce = this.nonce().toString();
                if (method == 'POST') {
                    if ((0, _keys2.default)(query).length) {
                        headers['Content-Type'] = 'application/json';
                        body = this.json(query);
                    } else {
                        url += '?' + this.urlencode(query);
                    }
                }
                var auth = nonce + this.uid + this.apiKey + method + url;
                if (body) auth += body;
                var signature = this.hmac(this.encode(auth), this.encode(this.secret), 'sha256', 'base64');
                var credentials = this.uid + ':' + this.apiKey + ':' + nonce + ':' + this.binaryToString(signature);
                headers['Authorization'] = 'HMAC ' + credentials;
            }
            return { 'url': url, 'method': method, 'body': body, 'headers': headers };
        }
    }]);
    return xbtce;
}(Exchange);