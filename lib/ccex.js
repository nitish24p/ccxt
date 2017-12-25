"use strict";

//  ---------------------------------------------------------------------------

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

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
    ExchangeError = _require.ExchangeError;

//  ---------------------------------------------------------------------------

module.exports = function (_Exchange) {
    (0, _inherits3.default)(ccex, _Exchange);

    function ccex() {
        (0, _classCallCheck3.default)(this, ccex);
        return (0, _possibleConstructorReturn3.default)(this, (ccex.__proto__ || (0, _getPrototypeOf2.default)(ccex)).apply(this, arguments));
    }

    (0, _createClass3.default)(ccex, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend((0, _get3.default)(ccex.prototype.__proto__ || (0, _getPrototypeOf2.default)(ccex.prototype), 'describe', this).call(this), {
                'id': 'ccex',
                'name': 'C-CEX',
                'countries': ['DE', 'EU'],
                'rateLimit': 1500,
                'hasCORS': false,
                'hasFetchTickers': true,
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/27766433-16881f90-5ed8-11e7-92f8-3d92cc747a6c.jpg',
                    'api': {
                        'tickers': 'https://c-cex.com/t',
                        'public': 'https://c-cex.com/t/api_pub.html',
                        'private': 'https://c-cex.com/t/api.html'
                    },
                    'www': 'https://c-cex.com',
                    'doc': 'https://c-cex.com/?id=api'
                },
                'api': {
                    'tickers': {
                        'get': ['coinnames', '{market}', 'pairs', 'prices', 'volume_{coin}']
                    },
                    'public': {
                        'get': ['balancedistribution', 'markethistory', 'markets', 'marketsummaries', 'orderbook']
                    },
                    'private': {
                        'get': ['buylimit', 'cancel', 'getbalance', 'getbalances', 'getopenorders', 'getorder', 'getorderhistory', 'mytrades', 'selllimit']
                    }
                },
                'fees': {
                    'trading': {
                        'taker': 0.2 / 100,
                        'maker': 0.2 / 100
                    }
                }
            });
        }
    }, {
        key: 'commonCurrencyCode',
        value: function commonCurrencyCode(currency) {
            if (currency == 'IOT') return 'IoTcoin';
            if (currency == 'BLC') return 'Cryptobullcoin';
            if (currency == 'XID') return 'InternationalDiamond';
            return currency;
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
                                return this.publicGetMarkets();

                            case 2:
                                markets = _context.sent;
                                result = [];

                                for (p = 0; p < markets['result'].length; p++) {
                                    market = markets['result'][p];
                                    id = market['MarketName'];
                                    base = market['MarketCurrency'];
                                    quote = market['BaseCurrency'];

                                    base = this.commonCurrencyCode(base);
                                    quote = this.commonCurrencyCode(quote);
                                    symbol = base + '/' + quote;

                                    result.push(this.extend(this.fees['trading'], {
                                        'id': id,
                                        'symbol': symbol,
                                        'base': base,
                                        'quote': quote,
                                        'info': market
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
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
                var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var response, balances, result, b, balance, code, currency, account;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context2.next = 4;
                                return this.privateGetBalances();

                            case 4:
                                response = _context2.sent;
                                balances = response['result'];
                                result = { 'info': balances };

                                for (b = 0; b < balances.length; b++) {
                                    balance = balances[b];
                                    code = balance['Currency'];
                                    currency = this.commonCurrencyCode(code);
                                    account = {
                                        'free': balance['Available'],
                                        'used': balance['Pending'],
                                        'total': balance['Balance']
                                    };

                                    result[currency] = account;
                                }
                                return _context2.abrupt('return', this.parseBalance(result));

                            case 9:
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
                var response, orderbook;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context3.next = 4;
                                return this.publicGetOrderbook(this.extend({
                                    'market': this.marketId(symbol),
                                    'type': 'both',
                                    'depth': 100
                                }, params));

                            case 4:
                                response = _context3.sent;
                                orderbook = response['result'];
                                return _context3.abrupt('return', this.parseOrderBook(orderbook, undefined, 'buy', 'sell', 'Rate', 'Quantity'));

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
                'high': parseFloat(ticker['high']),
                'low': parseFloat(ticker['low']),
                'bid': parseFloat(ticker['buy']),
                'ask': parseFloat(ticker['sell']),
                'vwap': undefined,
                'open': undefined,
                'close': undefined,
                'first': undefined,
                'last': parseFloat(ticker['lastprice']),
                'change': undefined,
                'percentage': undefined,
                'average': parseFloat(ticker['avg']),
                'baseVolume': undefined,
                'quoteVolume': this.safeFloat(ticker, 'buysupport'),
                'info': ticker
            };
        }
    }, {
        key: 'fetchTickers',
        value: function () {
            var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
                var symbols = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

                var tickers, result, ids, i, id, ticker, uppercase, market, symbol, _uppercase$split, _uppercase$split2, base, quote;

                return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context4.next = 4;
                                return this.tickersGetPrices(params);

                            case 4:
                                tickers = _context4.sent;
                                result = { 'info': tickers };
                                ids = (0, _keys2.default)(tickers);

                                for (i = 0; i < ids.length; i++) {
                                    id = ids[i];
                                    ticker = tickers[id];
                                    uppercase = id.toUpperCase();
                                    market = undefined;
                                    symbol = undefined;

                                    if (uppercase in this.markets_by_id) {
                                        market = this.markets_by_id[uppercase];
                                        symbol = market['symbol'];
                                    } else {
                                        _uppercase$split = uppercase.split('-'), _uppercase$split2 = (0, _slicedToArray3.default)(_uppercase$split, 2), base = _uppercase$split2[0], quote = _uppercase$split2[1];

                                        base = this.commonCurrencyCode(base);
                                        quote = this.commonCurrencyCode(quote);
                                        symbol = base + '/' + quote;
                                    }
                                    result[symbol] = this.parseTicker(ticker, market);
                                }
                                return _context4.abrupt('return', result);

                            case 9:
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
                var market, response, ticker;
                return _regenerator2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                _context5.next = 5;
                                return this.tickersGetMarket(this.extend({
                                    'market': market['id'].toLowerCase()
                                }, params));

                            case 5:
                                response = _context5.sent;
                                ticker = response['ticker'];
                                return _context5.abrupt('return', this.parseTicker(ticker, market));

                            case 8:
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
        key: 'parseTrade',
        value: function parseTrade(trade, market) {
            var timestamp = this.parse8601(trade['TimeStamp']);
            return {
                'id': trade['Id'],
                'info': trade,
                'order': undefined,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'symbol': market['symbol'],
                'type': undefined,
                'side': trade['OrderType'].toLowerCase(),
                'price': trade['Price'],
                'amount': trade['Quantity']
            };
        }
    }, {
        key: 'fetchTrades',
        value: function () {
            var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(symbol) {
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var market, response;
                return _regenerator2.default.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                _context6.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                _context6.next = 5;
                                return this.publicGetMarkethistory(this.extend({
                                    'market': market['id'],
                                    'type': 'both',
                                    'depth': 100
                                }, params));

                            case 5:
                                response = _context6.sent;
                                return _context6.abrupt('return', this.parseTrades(response['result'], market, since, limit));

                            case 7:
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
        key: 'createOrder',
        value: function () {
            var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(symbol, type, side, amount) {
                var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
                var method, response;
                return _regenerator2.default.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                _context7.next = 2;
                                return this.loadMarkets();

                            case 2:
                                method = 'privateGet' + this.capitalize(side) + type;
                                _context7.next = 5;
                                return this[method](this.extend({
                                    'market': this.marketId(symbol),
                                    'quantity': amount,
                                    'rate': price
                                }, params));

                            case 5:
                                response = _context7.sent;
                                return _context7.abrupt('return', {
                                    'info': response,
                                    'id': response['result']['uuid']
                                });

                            case 7:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function createOrder(_x15, _x16, _x17, _x18) {
                return _ref7.apply(this, arguments);
            }

            return createOrder;
        }()
    }, {
        key: 'cancelOrder',
        value: function () {
            var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8(id) {
                var symbol = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
                return _regenerator2.default.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                _context8.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context8.next = 4;
                                return this.privateGetCancel({ 'uuid': id });

                            case 4:
                                return _context8.abrupt('return', _context8.sent);

                            case 5:
                            case 'end':
                                return _context8.stop();
                        }
                    }
                }, _callee8, this);
            }));

            function cancelOrder(_x21) {
                return _ref8.apply(this, arguments);
            }

            return cancelOrder;
        }()
    }, {
        key: 'sign',
        value: function sign(path) {
            var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var url = this.urls['api'][api];
            if (api == 'private') {
                this.checkRequiredCredentials();
                var nonce = this.nonce().toString();
                var query = this.keysort(this.extend({
                    'a': path,
                    'apikey': this.apiKey,
                    'nonce': nonce
                }, params));
                url += '?' + this.urlencode(query);
                headers = { 'apisign': this.hmac(this.encode(url), this.encode(this.secret), 'sha512') };
            } else if (api == 'public') {
                url += '?' + this.urlencode(this.extend({
                    'a': 'get' + path
                }, params));
            } else {
                url += '/' + this.implodeParams(path, params) + '.json';
            }
            return { 'url': url, 'method': method, 'body': body, 'headers': headers };
        }
    }, {
        key: 'request',
        value: function () {
            var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9(path) {
                var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
                var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;
                var response;
                return _regenerator2.default.wrap(function _callee9$(_context9) {
                    while (1) {
                        switch (_context9.prev = _context9.next) {
                            case 0:
                                _context9.next = 2;
                                return this.fetch2(path, api, method, params, headers, body);

                            case 2:
                                response = _context9.sent;

                                if (!(api == 'tickers')) {
                                    _context9.next = 5;
                                    break;
                                }

                                return _context9.abrupt('return', response);

                            case 5:
                                if (!('success' in response)) {
                                    _context9.next = 8;
                                    break;
                                }

                                if (!response['success']) {
                                    _context9.next = 8;
                                    break;
                                }

                                return _context9.abrupt('return', response);

                            case 8:
                                throw new ExchangeError(this.id + ' ' + this.json(response));

                            case 9:
                            case 'end':
                                return _context9.stop();
                        }
                    }
                }, _callee9, this);
            }));

            function request(_x32) {
                return _ref9.apply(this, arguments);
            }

            return request;
        }()
    }]);
    return ccex;
}(Exchange);