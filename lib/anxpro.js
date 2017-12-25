"use strict";

//  ---------------------------------------------------------------------------

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

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
    (0, _inherits3.default)(anxpro, _Exchange);

    function anxpro() {
        (0, _classCallCheck3.default)(this, anxpro);
        return (0, _possibleConstructorReturn3.default)(this, (anxpro.__proto__ || (0, _getPrototypeOf2.default)(anxpro)).apply(this, arguments));
    }

    (0, _createClass3.default)(anxpro, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend((0, _get3.default)(anxpro.prototype.__proto__ || (0, _getPrototypeOf2.default)(anxpro.prototype), 'describe', this).call(this), {
                'id': 'anxpro',
                'name': 'ANXPro',
                'countries': ['JP', 'SG', 'HK', 'NZ'],
                'version': '2',
                'rateLimit': 1500,
                'hasCORS': false,
                'hasFetchTrades': false,
                'hasWithdraw': true,
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/27765983-fd8595da-5ec9-11e7-82e3-adb3ab8c2612.jpg',
                    'api': 'https://anxpro.com/api',
                    'www': 'https://anxpro.com',
                    'doc': ['http://docs.anxv2.apiary.io', 'https://anxpro.com/pages/api']
                },
                'api': {
                    'public': {
                        'get': ['{currency_pair}/money/ticker', '{currency_pair}/money/depth/full', '{currency_pair}/money/trade/fetch']
                    },
                    'private': {
                        'post': ['{currency_pair}/money/order/add', '{currency_pair}/money/order/cancel', '{currency_pair}/money/order/quote', '{currency_pair}/money/order/result', '{currency_pair}/money/orders', 'money/{currency}/address', 'money/{currency}/send_simple', 'money/info', 'money/trade/list', 'money/wallet/history']
                    }
                },
                'markets': {
                    'BTC/USD': { 'id': 'BTCUSD', 'symbol': 'BTC/USD', 'base': 'BTC', 'quote': 'USD', 'multiplier': 100000 },
                    'BTC/HKD': { 'id': 'BTCHKD', 'symbol': 'BTC/HKD', 'base': 'BTC', 'quote': 'HKD', 'multiplier': 100000 },
                    'BTC/EUR': { 'id': 'BTCEUR', 'symbol': 'BTC/EUR', 'base': 'BTC', 'quote': 'EUR', 'multiplier': 100000 },
                    'BTC/CAD': { 'id': 'BTCCAD', 'symbol': 'BTC/CAD', 'base': 'BTC', 'quote': 'CAD', 'multiplier': 100000 },
                    'BTC/AUD': { 'id': 'BTCAUD', 'symbol': 'BTC/AUD', 'base': 'BTC', 'quote': 'AUD', 'multiplier': 100000 },
                    'BTC/SGD': { 'id': 'BTCSGD', 'symbol': 'BTC/SGD', 'base': 'BTC', 'quote': 'SGD', 'multiplier': 100000 },
                    'BTC/JPY': { 'id': 'BTCJPY', 'symbol': 'BTC/JPY', 'base': 'BTC', 'quote': 'JPY', 'multiplier': 100000 },
                    'BTC/GBP': { 'id': 'BTCGBP', 'symbol': 'BTC/GBP', 'base': 'BTC', 'quote': 'GBP', 'multiplier': 100000 },
                    'BTC/NZD': { 'id': 'BTCNZD', 'symbol': 'BTC/NZD', 'base': 'BTC', 'quote': 'NZD', 'multiplier': 100000 },
                    'LTC/BTC': { 'id': 'LTCBTC', 'symbol': 'LTC/BTC', 'base': 'LTC', 'quote': 'BTC', 'multiplier': 100000 },
                    'STR/BTC': { 'id': 'STRBTC', 'symbol': 'STR/BTC', 'base': 'STR', 'quote': 'BTC', 'multiplier': 100000000 },
                    'XRP/BTC': { 'id': 'XRPBTC', 'symbol': 'XRP/BTC', 'base': 'XRP', 'quote': 'BTC', 'multiplier': 100000000 },
                    'DOGE/BTC': { 'id': 'DOGEBTC', 'symbol': 'DOGE/BTC', 'base': 'DOGE', 'quote': 'BTC', 'multiplier': 100000000 }
                },
                'fees': {
                    'trading': {
                        'maker': 0.3 / 100,
                        'taker': 0.6 / 100
                    }
                }
            });
        }
    }, {
        key: 'fetchBalance',
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var response, balance, currencies, result, c, currency, account, wallet;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.privatePostMoneyInfo();

                            case 2:
                                response = _context.sent;
                                balance = response['data'];
                                currencies = (0, _keys2.default)(balance['Wallets']);
                                result = { 'info': balance };

                                for (c = 0; c < currencies.length; c++) {
                                    currency = currencies[c];
                                    account = this.account();

                                    if (currency in balance['Wallets']) {
                                        wallet = balance['Wallets'][currency];

                                        account['free'] = parseFloat(wallet['Available_Balance']['value']);
                                        account['total'] = parseFloat(wallet['Balance']['value']);
                                        account['used'] = account['total'] - account['free'];
                                    }
                                    result[currency] = account;
                                }
                                return _context.abrupt('return', this.parseBalance(result));

                            case 8:
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
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var response, orderbook, t, timestamp;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this.publicGetCurrencyPairMoneyDepthFull(this.extend({
                                    'currency_pair': this.marketId(symbol)
                                }, params));

                            case 2:
                                response = _context2.sent;
                                orderbook = response['data'];
                                t = parseInt(orderbook['dataUpdateTime']);
                                timestamp = parseInt(t / 1000);
                                return _context2.abrupt('return', this.parseOrderBook(orderbook, timestamp, 'bids', 'asks', 'price', 'amount'));

                            case 7:
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
        key: 'fetchTicker',
        value: function () {
            var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var response, ticker, t, timestamp, bid, ask, vwap, baseVolume;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return this.publicGetCurrencyPairMoneyTicker(this.extend({
                                    'currency_pair': this.marketId(symbol)
                                }, params));

                            case 2:
                                response = _context3.sent;
                                ticker = response['data'];
                                t = parseInt(ticker['dataUpdateTime']);
                                timestamp = parseInt(t / 1000);
                                bid = this.safeFloat(ticker['buy'], 'value');
                                ask = this.safeFloat(ticker['sell'], 'value');
                                ;
                                vwap = parseFloat(ticker['vwap']['value']);
                                baseVolume = parseFloat(ticker['vol']['value']);
                                return _context3.abrupt('return', {
                                    'symbol': symbol,
                                    'timestamp': timestamp,
                                    'datetime': this.iso8601(timestamp),
                                    'high': parseFloat(ticker['high']['value']),
                                    'low': parseFloat(ticker['low']['value']),
                                    'bid': bid,
                                    'ask': ask,
                                    'vwap': vwap,
                                    'open': undefined,
                                    'close': undefined,
                                    'first': undefined,
                                    'last': parseFloat(ticker['last']['value']),
                                    'change': undefined,
                                    'percentage': undefined,
                                    'average': parseFloat(ticker['avg']['value']),
                                    'baseVolume': baseVolume,
                                    'quoteVolume': baseVolume * vwap,
                                    'info': ticker
                                });

                            case 12:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function fetchTicker(_x5) {
                return _ref3.apply(this, arguments);
            }

            return fetchTicker;
        }()
    }, {
        key: 'fetchTrades',
        value: function () {
            var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(symbol) {
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                throw new ExchangeError(this.id + ' switched off the trades endpoint, see their docs at http://docs.anxv2.apiary.io/reference/market-data/currencypairmoneytradefetch-disabled');

                            case 2:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function fetchTrades(_x9) {
                return _ref4.apply(this, arguments);
            }

            return fetchTrades;
        }()
    }, {
        key: 'createOrder',
        value: function () {
            var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(symbol, type, side, amount) {
                var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
                var market, order, result;
                return _regenerator2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                market = this.market(symbol);
                                order = {
                                    'currency_pair': market['id'],
                                    'amount_int': parseInt(amount * 100000000) // 10^8
                                };

                                if (type == 'limit') {
                                    order['price_int'] = parseInt(price * market['multiplier']); // 10^5 or 10^8
                                }
                                order['type'] = side == 'buy' ? 'bid' : 'ask';
                                _context5.next = 6;
                                return this.privatePostCurrencyPairMoneyOrderAdd(this.extend(order, params));

                            case 6:
                                result = _context5.sent;
                                return _context5.abrupt('return', {
                                    'info': result,
                                    'id': result['data']
                                });

                            case 8:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function createOrder(_x12, _x13, _x14, _x15) {
                return _ref5.apply(this, arguments);
            }

            return createOrder;
        }()
    }, {
        key: 'cancelOrder',
        value: function () {
            var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(id) {
                var symbol = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
                return _regenerator2.default.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                _context6.next = 2;
                                return this.privatePostCurrencyPairMoneyOrderCancel({ 'oid': id });

                            case 2:
                                return _context6.abrupt('return', _context6.sent);

                            case 3:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function cancelOrder(_x18) {
                return _ref6.apply(this, arguments);
            }

            return cancelOrder;
        }()
    }, {
        key: 'getAmountMultiplier',
        value: function getAmountMultiplier(currency) {
            if (currency == 'BTC') {
                return 100000000;
            } else if (currency == 'LTC') {
                return 100000000;
            } else if (currency == 'STR') {
                return 100000000;
            } else if (currency == 'XRP') {
                return 100000000;
            } else if (currency == 'DOGE') {
                return 100000000;
            }
            return 100;
        }
    }, {
        key: 'withdraw',
        value: function () {
            var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(currency, amount, address) {
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var multiplier, response;
                return _regenerator2.default.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                _context7.next = 2;
                                return this.loadMarkets();

                            case 2:
                                multiplier = this.getAmountMultiplier(currency);
                                _context7.next = 5;
                                return this.privatePostMoneyCurrencySendSimple(this.extend({
                                    'currency': currency,
                                    'amount_int': parseInt(amount * multiplier),
                                    'address': address
                                }, params));

                            case 5:
                                response = _context7.sent;
                                return _context7.abrupt('return', {
                                    'info': response,
                                    'id': response['data']['transactionId']
                                });

                            case 7:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function withdraw(_x20, _x21, _x22) {
                return _ref7.apply(this, arguments);
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

            var request = this.implodeParams(path, params);
            var query = this.omit(params, this.extractParams(path));
            var url = this.urls['api'] + '/' + this.version + '/' + request;
            if (api == 'public') {
                if ((0, _keys2.default)(query).length) url += '?' + this.urlencode(query);
            } else {
                this.checkRequiredCredentials();
                var nonce = this.nonce();
                body = this.urlencode(this.extend({ 'nonce': nonce }, query));
                var secret = this.base64ToBinary(this.secret);
                var auth = request + "\0" + body;
                var signature = this.hmac(this.encode(auth), secret, 'sha512', 'base64');
                headers = {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Rest-Key': this.apiKey,
                    'Rest-Sign': this.decode(signature)
                };
            }
            return { 'url': url, 'method': method, 'body': body, 'headers': headers };
        }
    }, {
        key: 'request',
        value: function () {
            var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8(path) {
                var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
                var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;
                var response;
                return _regenerator2.default.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                _context8.next = 2;
                                return this.fetch2(path, api, method, params, headers, body);

                            case 2:
                                response = _context8.sent;

                                if (!('result' in response)) {
                                    _context8.next = 6;
                                    break;
                                }

                                if (!(response['result'] == 'success')) {
                                    _context8.next = 6;
                                    break;
                                }

                                return _context8.abrupt('return', response);

                            case 6:
                                throw new ExchangeError(this.id + ' ' + this.json(response));

                            case 7:
                            case 'end':
                                return _context8.stop();
                        }
                    }
                }, _callee8, this);
            }));

            function request(_x33) {
                return _ref8.apply(this, arguments);
            }

            return request;
        }()
    }]);
    return anxpro;
}(Exchange);