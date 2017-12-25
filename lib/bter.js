"use strict";

//  ---------------------------------------------------------------------------

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

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
    (0, _inherits3.default)(bter, _Exchange);

    function bter() {
        (0, _classCallCheck3.default)(this, bter);
        return (0, _possibleConstructorReturn3.default)(this, (bter.__proto__ || (0, _getPrototypeOf2.default)(bter)).apply(this, arguments));
    }

    (0, _createClass3.default)(bter, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend((0, _get3.default)(bter.prototype.__proto__ || (0, _getPrototypeOf2.default)(bter.prototype), 'describe', this).call(this), {
                'id': 'bter',
                'name': 'Bter',
                'countries': ['VG', 'CN'], // British Virgin Islands, China
                'version': '2',
                'hasCORS': false,
                'hasFetchTickers': true,
                'hasWithdraw': true,
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/27980479-cfa3188c-6387-11e7-8191-93fc4184ba5c.jpg',
                    'api': {
                        'public': 'https://data.bter.com/api',
                        'private': 'https://api.bter.com/api'
                    },
                    'www': 'https://bter.com',
                    'doc': 'https://bter.com/api2'
                },
                'api': {
                    'public': {
                        'get': ['pairs', 'marketinfo', 'marketlist', 'tickers', 'ticker/{id}', 'orderBook/{id}', 'trade/{id}', 'tradeHistory/{id}', 'tradeHistory/{id}/{tid}']
                    },
                    'private': {
                        'post': ['balances', 'depositAddress', 'newAddress', 'depositsWithdrawals', 'buy', 'sell', 'cancelOrder', 'cancelAllOrders', 'getOrder', 'openOrders', 'tradeHistory', 'withdraw']
                    }
                }
            });
        }
    }, {
        key: 'fetchMarkets',
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                var response, markets, result, i, market, keys, id, details, _id$split, _id$split2, base, quote, symbol, precision, amountLimits, priceLimits, limits;

                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.publicGetMarketinfo();

                            case 2:
                                response = _context.sent;
                                markets = this.safeValue(response, 'pairs');

                                if (markets) {
                                    _context.next = 6;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' fetchMarkets got an unrecognized response');

                            case 6:
                                result = [];

                                for (i = 0; i < markets.length; i++) {
                                    market = markets[i];
                                    keys = (0, _keys2.default)(market);
                                    id = keys[0];
                                    details = market[id];
                                    _id$split = id.split('_'), _id$split2 = (0, _slicedToArray3.default)(_id$split, 2), base = _id$split2[0], quote = _id$split2[1];

                                    base = base.toUpperCase();
                                    quote = quote.toUpperCase();
                                    base = this.commonCurrencyCode(base);
                                    quote = this.commonCurrencyCode(quote);
                                    symbol = base + '/' + quote;
                                    precision = {
                                        'amount': details['decimal_places'],
                                        'price': details['decimal_places']
                                    };
                                    amountLimits = {
                                        'min': details['min_amount'],
                                        'max': undefined
                                    };
                                    priceLimits = {
                                        'min': undefined,
                                        'max': undefined
                                    };
                                    limits = {
                                        'amount': amountLimits,
                                        'price': priceLimits
                                    };

                                    result.push({
                                        'id': id,
                                        'symbol': symbol,
                                        'base': base,
                                        'quote': quote,
                                        'info': market,
                                        'maker': details['fee'] / 100,
                                        'taker': details['fee'] / 100,
                                        'precision': precision,
                                        'limits': limits
                                    });
                                }
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
        key: 'fetchBalance',
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
                var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var balance, result, currencies, i, currency, code, account;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context2.next = 4;
                                return this.privatePostBalances();

                            case 4:
                                balance = _context2.sent;
                                result = { 'info': balance };
                                currencies = (0, _keys2.default)(this.currencies);

                                for (i = 0; i < currencies.length; i++) {
                                    currency = currencies[i];
                                    code = this.commonCurrencyCode(currency);
                                    account = this.account();

                                    if ('available' in balance) {
                                        if (currency in balance['available']) {
                                            account['free'] = parseFloat(balance['available'][currency]);
                                        }
                                    }
                                    if ('locked' in balance) {
                                        if (currency in balance['locked']) {
                                            account['used'] = parseFloat(balance['locked'][currency]);
                                        }
                                    }
                                    account['total'] = this.sum(account['free'], account['used']);
                                    result[code] = account;
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
                var orderbook, result;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context3.next = 4;
                                return this.publicGetOrderBookId(this.extend({
                                    'id': this.marketId(symbol)
                                }, params));

                            case 4:
                                orderbook = _context3.sent;
                                result = this.parseOrderBook(orderbook);

                                result['asks'] = this.sortBy(result['asks'], 0);
                                return _context3.abrupt('return', result);

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
            var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
                var symbols = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

                var tickers, result, ids, i, id, _id$split3, _id$split4, baseId, quoteId, base, quote, symbol, ticker, market;

                return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context4.next = 4;
                                return this.publicGetTickers(params);

                            case 4:
                                tickers = _context4.sent;
                                result = {};
                                ids = (0, _keys2.default)(tickers);

                                for (i = 0; i < ids.length; i++) {
                                    id = ids[i];
                                    _id$split3 = id.split('_'), _id$split4 = (0, _slicedToArray3.default)(_id$split3, 2), baseId = _id$split4[0], quoteId = _id$split4[1];
                                    base = baseId.toUpperCase();
                                    quote = quoteId.toUpperCase();

                                    base = this.commonCurrencyCode(base);
                                    quote = this.commonCurrencyCode(quote);
                                    symbol = base + '/' + quote;
                                    ticker = tickers[id];
                                    market = undefined;

                                    if (symbol in this.markets) market = this.markets[symbol];
                                    if (id in this.markets_by_id) market = this.markets_by_id[id];
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
                var market, ticker;
                return _regenerator2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                _context5.next = 5;
                                return this.publicGetTickerId(this.extend({
                                    'id': market['id']
                                }, params));

                            case 5:
                                ticker = _context5.sent;
                                return _context5.abrupt('return', this.parseTicker(ticker, market));

                            case 7:
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
            var timestamp = this.parse8601(trade['date']);
            return {
                'id': trade['tradeID'],
                'info': trade,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'symbol': market['symbol'],
                'type': undefined,
                'side': trade['type'],
                'price': trade['rate'],
                'amount': this.safeFloat(trade, 'amount')
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
                                return this.publicGetTradeHistoryId(this.extend({
                                    'id': market['id']
                                }, params));

                            case 5:
                                response = _context6.sent;
                                return _context6.abrupt('return', this.parseTrades(response['data'], market, since, limit));

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
                var method, order, response;
                return _regenerator2.default.wrap(function _callee7$(_context7) {
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
                                method = 'privatePost' + this.capitalize(side);
                                order = {
                                    'currencyPair': this.marketId(symbol),
                                    'rate': price,
                                    'amount': amount
                                };
                                _context7.next = 8;
                                return this[method](this.extend(order, params));

                            case 8:
                                response = _context7.sent;
                                return _context7.abrupt('return', {
                                    'info': response,
                                    'id': response['orderNumber']
                                });

                            case 10:
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
                                return this.privatePostCancelOrder({ 'orderNumber': id });

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
        key: 'withdraw',
        value: function () {
            var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9(currency, amount, address) {
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var response;
                return _regenerator2.default.wrap(function _callee9$(_context9) {
                    while (1) {
                        switch (_context9.prev = _context9.next) {
                            case 0:
                                _context9.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context9.next = 4;
                                return this.privatePostWithdraw(this.extend({
                                    'currency': currency.toLowerCase(),
                                    'amount': amount,
                                    'address': address // Address must exist in you AddressBook in security settings
                                }, params));

                            case 4:
                                response = _context9.sent;
                                return _context9.abrupt('return', {
                                    'info': response,
                                    'id': undefined
                                });

                            case 6:
                            case 'end':
                                return _context9.stop();
                        }
                    }
                }, _callee9, this);
            }));

            function withdraw(_x23, _x24, _x25) {
                return _ref9.apply(this, arguments);
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

            var prefix = api == 'private' ? api + '/' : '';
            var url = this.urls['api'][api] + this.version + '/1/' + prefix + this.implodeParams(path, params);
            var query = this.omit(params, this.extractParams(path));
            if (api == 'public') {
                if ((0, _keys2.default)(query).length) url += '?' + this.urlencode(query);
            } else {
                this.checkRequiredCredentials();
                var nonce = this.nonce();
                var request = { 'nonce': nonce };
                body = this.urlencode(this.extend(request, query));
                var signature = this.hmac(this.encode(body), this.encode(this.secret), 'sha512');
                headers = {
                    'Key': this.apiKey,
                    'Sign': signature,
                    'Content-Type': 'application/x-www-form-urlencoded'
                };
            }
            return { 'url': url, 'method': method, 'body': body, 'headers': headers };
        }
    }, {
        key: 'request',
        value: function () {
            var _ref10 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10(path) {
                var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
                var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;
                var response;
                return _regenerator2.default.wrap(function _callee10$(_context10) {
                    while (1) {
                        switch (_context10.prev = _context10.next) {
                            case 0:
                                _context10.next = 2;
                                return this.fetch2(path, api, method, params, headers, body);

                            case 2:
                                response = _context10.sent;

                                if (!('result' in response)) {
                                    _context10.next = 6;
                                    break;
                                }

                                if (!(response['result'] != 'true')) {
                                    _context10.next = 6;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' ' + this.json(response));

                            case 6:
                                return _context10.abrupt('return', response);

                            case 7:
                            case 'end':
                                return _context10.stop();
                        }
                    }
                }, _callee10, this);
            }));

            function request(_x36) {
                return _ref10.apply(this, arguments);
            }

            return request;
        }()
    }]);
    return bter;
}(Exchange);