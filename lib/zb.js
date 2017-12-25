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
    (0, _inherits3.default)(zb, _Exchange);

    function zb() {
        (0, _classCallCheck3.default)(this, zb);
        return (0, _possibleConstructorReturn3.default)(this, (zb.__proto__ || (0, _getPrototypeOf2.default)(zb)).apply(this, arguments));
    }

    (0, _createClass3.default)(zb, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend((0, _get3.default)(zb.prototype.__proto__ || (0, _getPrototypeOf2.default)(zb.prototype), 'describe', this).call(this), {
                'id': 'zb',
                'name': 'ZB',
                'countries': 'CN',
                'rateLimit': 1000,
                'version': 'v1',
                'hasCORS': false,
                'hasFetchOrder': true,
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/32859187-cd5214f0-ca5e-11e7-967d-96568e2e2bd1.jpg',
                    'api': {
                        'public': 'http://api.zb.com/data', // no https for public API
                        'private': 'https://trade.zb.com/api'
                    },
                    'www': 'https://trade.zb.com/api',
                    'doc': 'https://www.zb.com/i/developer'
                },
                'api': {
                    'public': {
                        'get': ['markets', 'ticker', 'depth', 'trades', 'kline']
                    },
                    'private': {
                        'post': ['order', 'cancelOrder', 'getOrder', 'getOrders', 'getOrdersNew', 'getOrdersIgnoreTradeType', 'getUnfinishedOrdersIgnoreTradeType', 'getAccountInfo', 'getUserAddress', 'getWithdrawAddress', 'getWithdrawRecord', 'getChargeRecord', 'getCnyWithdrawRecord', 'getCnyChargeRecord', 'withdraw']
                    }
                }
            });
        }
    }, {
        key: 'getTradingFeeFromBaseQuote',
        value: function getTradingFeeFromBaseQuote(base, quote) {
            // base: quote
            var fees = {
                'BTC': { 'USDT': 0.0 },
                'BCH': { 'BTC': 0.001, 'USDT': 0.001 },
                'LTC': { 'BTC': 0.001, 'USDT': 0.0 },
                'ETH': { 'BTC': 0.001, 'USDT': 0.0 },
                'ETC': { 'BTC': 0.001, 'USDT': 0.0 },
                'BTS': { 'BTC': 0.001, 'USDT': 0.001 },
                'EOS': { 'BTC': 0.001, 'USDT': 0.001 },
                'HSR': { 'BTC': 0.001, 'USDT': 0.001 },
                'QTUM': { 'BTC': 0.001, 'USDT': 0.001 },
                'USDT': { 'BTC': 0.0 }
            };
            if (base in fees) {
                var quoteFees = fees[base];
                if (quote in quoteFees) return quoteFees[quote];
            }
            return undefined;
        }
    }, {
        key: 'fetchMarkets',
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                var markets, keys, result, i, id, market, _id$split, _id$split2, baseId, quoteId, base, quote, symbol, fee, precision, lot;

                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.publicGetMarkets();

                            case 2:
                                markets = _context.sent;
                                keys = (0, _keys2.default)(markets);
                                result = [];

                                for (i = 0; i < keys.length; i++) {
                                    id = keys[i];
                                    market = markets[id];
                                    _id$split = id.split('_'), _id$split2 = (0, _slicedToArray3.default)(_id$split, 2), baseId = _id$split2[0], quoteId = _id$split2[1];
                                    base = this.commonCurrencyCode(baseId.toUpperCase());
                                    quote = this.commonCurrencyCode(quoteId.toUpperCase());
                                    symbol = base + '/' + quote;
                                    fee = this.getTradingFeeFromBaseQuote(base, quote);
                                    precision = {
                                        'amount': market['amountScale'],
                                        'price': market['priceScale']
                                    };
                                    lot = Math.pow(10, -precision['amount']);

                                    result.push({
                                        'id': id,
                                        'symbol': symbol,
                                        'baseId': baseId,
                                        'quoteId': quoteId,
                                        'base': base,
                                        'quote': quote,
                                        'info': market,
                                        'maker': fee,
                                        'taker': fee,
                                        'lot': lot,
                                        'active': true,
                                        'precision': precision,
                                        'limits': {
                                            'amount': {
                                                'min': lot,
                                                'max': undefined
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
        key: 'fetchBalance',
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
                var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var response, balances, result, currencies, i, currency, account;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context2.next = 4;
                                return this.privatePostGetAccountInfo();

                            case 4:
                                response = _context2.sent;
                                balances = response['result'];
                                result = { 'info': balances };
                                currencies = (0, _keys2.default)(this.currencies);

                                for (i = 0; i < currencies.length; i++) {
                                    currency = currencies[i];
                                    account = this.account();

                                    if (currency in balances['balance']) account['free'] = parseFloat(balances['balance'][currency]['amount']);
                                    if (currency in balances['frozen']) account['used'] = parseFloat(balances['frozen'][currency]['amount']);
                                    account['total'] = this.sum(account['free'], account['used']);
                                    result[currency] = account;
                                }
                                return _context2.abrupt('return', this.parseBalance(result));

                            case 10:
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
        key: 'getMarketFieldName',
        value: function getMarketFieldName() {
            return 'market';
        }
    }, {
        key: 'fetchOrderBook',
        value: function () {
            var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var market, marketFieldName, request, orderbook, timestamp, bids, asks, result;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                marketFieldName = this.getMarketFieldName();
                                request = {};

                                request[marketFieldName] = market['id'];
                                _context3.next = 8;
                                return this.publicGetDepth(this.extend(request, params));

                            case 8:
                                orderbook = _context3.sent;
                                timestamp = this.milliseconds();
                                bids = undefined;
                                asks = undefined;

                                if ('bids' in orderbook) bids = orderbook['bids'];
                                if ('asks' in orderbook) asks = orderbook['asks'];
                                result = {
                                    'bids': bids,
                                    'asks': asks,
                                    'timestamp': timestamp,
                                    'datetime': this.iso8601(timestamp)
                                };

                                if (result['bids']) result['bids'] = this.sortBy(result['bids'], 0, true);
                                if (result['asks']) result['asks'] = this.sortBy(result['asks'], 0);
                                return _context3.abrupt('return', result);

                            case 18:
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
        key: 'fetchTicker',
        value: function () {
            var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var market, marketFieldName, request, response, ticker, timestamp;
                return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                marketFieldName = this.getMarketFieldName();
                                request = {};

                                request[marketFieldName] = market['id'];
                                _context4.next = 8;
                                return this.publicGetTicker(this.extend(request, params));

                            case 8:
                                response = _context4.sent;
                                ticker = response['ticker'];
                                timestamp = this.milliseconds();
                                return _context4.abrupt('return', {
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
                                });

                            case 12:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function fetchTicker(_x5) {
                return _ref4.apply(this, arguments);
            }

            return fetchTicker;
        }()
    }, {
        key: 'parseTrade',
        value: function parseTrade(trade) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var timestamp = trade['date'] * 1000;
            var side = trade['trade_type'] == 'bid' ? 'buy' : 'sell';
            return {
                'info': trade,
                'id': trade['tid'].toString(),
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'symbol': market['symbol'],
                'type': undefined,
                'side': side,
                'price': parseFloat(trade['price']),
                'amount': parseFloat(trade['amount'])
            };
        }
    }, {
        key: 'fetchTrades',
        value: function () {
            var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(symbol) {
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var market, marketFieldName, request, response;
                return _regenerator2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                marketFieldName = this.getMarketFieldName();
                                request = {};

                                request[marketFieldName] = market['id'];
                                _context5.next = 8;
                                return this.publicGetTrades(this.extend(request, params));

                            case 8:
                                response = _context5.sent;
                                return _context5.abrupt('return', this.parseTrades(response, market, since, limit));

                            case 10:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function fetchTrades(_x10) {
                return _ref5.apply(this, arguments);
            }

            return fetchTrades;
        }()
    }, {
        key: 'createOrder',
        value: function () {
            var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(symbol, type, side, amount) {
                var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
                var paramString, tradeType, response;
                return _regenerator2.default.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                _context6.next = 2;
                                return this.loadMarkets();

                            case 2:
                                paramString = '&price=' + price.toString();

                                paramString += '&amount=' + amount.toString();
                                tradeType = side == 'buy' ? '1' : '0';

                                paramString += '&tradeType=' + tradeType;
                                paramString += '&currency=' + this.marketId(symbol);
                                _context6.next = 9;
                                return this.privatePostOrder(paramString);

                            case 9:
                                response = _context6.sent;
                                return _context6.abrupt('return', {
                                    'info': response,
                                    'id': response['id']
                                });

                            case 11:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function createOrder(_x13, _x14, _x15, _x16) {
                return _ref6.apply(this, arguments);
            }

            return createOrder;
        }()
    }, {
        key: 'cancelOrder',
        value: function () {
            var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(id) {
                var symbol = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
                var paramString;
                return _regenerator2.default.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                _context7.next = 2;
                                return this.loadMarkets();

                            case 2:
                                paramString = '&id=' + id.toString();

                                if ('currency' in params) paramString += '&currency=' + params['currency'];
                                _context7.next = 6;
                                return this.privatePostCancelOrder(paramString);

                            case 6:
                                return _context7.abrupt('return', _context7.sent);

                            case 7:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function cancelOrder(_x19) {
                return _ref7.apply(this, arguments);
            }

            return cancelOrder;
        }()
    }, {
        key: 'fetchOrder',
        value: function () {
            var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8(id) {
                var symbol = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
                var paramString;
                return _regenerator2.default.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                _context8.next = 2;
                                return this.loadMarkets();

                            case 2:
                                paramString = '&id=' + id.toString();

                                if ('currency' in params) paramString += '&currency=' + params['currency'];
                                _context8.next = 6;
                                return this.privatePostGetOrder(paramString);

                            case 6:
                                return _context8.abrupt('return', _context8.sent);

                            case 7:
                            case 'end':
                                return _context8.stop();
                        }
                    }
                }, _callee8, this);
            }));

            function fetchOrder(_x22) {
                return _ref8.apply(this, arguments);
            }

            return fetchOrder;
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
            if (api == 'public') {
                url += '/' + this.version + '/' + path;
                if ((0, _keys2.default)(params).length) url += '?' + this.urlencode(params);
            } else {
                this.checkRequiredCredentials();
                var paramsLength = params.length; // params should be a string here
                var nonce = this.nonce();
                var auth = 'method=' + path;
                auth += '&accesskey=' + this.apiKey;
                auth += paramsLength ? params : '';
                var secret = this.hash(this.encode(this.secret), 'sha1');
                var signature = this.hmac(this.encode(auth), this.encode(secret), 'md5');
                var suffix = 'sign=' + signature + '&reqTime=' + nonce.toString();
                url += '/' + path + '?' + auth + '&' + suffix;
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

                                if (!(api == 'private')) {
                                    _context9.next = 6;
                                    break;
                                }

                                if (!('code' in response)) {
                                    _context9.next = 6;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' ' + this.json(response));

                            case 6:
                                return _context9.abrupt('return', response);

                            case 7:
                            case 'end':
                                return _context9.stop();
                        }
                    }
                }, _callee9, this);
            }));

            function request(_x33) {
                return _ref9.apply(this, arguments);
            }

            return request;
        }()
    }]);
    return zb;
}(Exchange);