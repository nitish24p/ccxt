"use strict";

// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------

module.exports = function (_Exchange) {
    (0, _inherits3.default)(bl3p, _Exchange);

    function bl3p() {
        (0, _classCallCheck3.default)(this, bl3p);
        return (0, _possibleConstructorReturn3.default)(this, (bl3p.__proto__ || (0, _getPrototypeOf2.default)(bl3p)).apply(this, arguments));
    }

    (0, _createClass3.default)(bl3p, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend((0, _get3.default)(bl3p.prototype.__proto__ || (0, _getPrototypeOf2.default)(bl3p.prototype), 'describe', this).call(this), {
                'id': 'bl3p',
                'name': 'BL3P',
                'countries': ['NL', 'EU'], // Netherlands, EU
                'rateLimit': 1000,
                'version': '1',
                'comment': 'An exchange market by BitonicNL',
                'hasCORS': false,
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/28501752-60c21b82-6feb-11e7-818b-055ee6d0e754.jpg',
                    'api': 'https://api.bl3p.eu',
                    'www': ['https://bl3p.eu', 'https://bitonic.nl'],
                    'doc': ['https://github.com/BitonicNL/bl3p-api/tree/master/docs', 'https://bl3p.eu/api', 'https://bitonic.nl/en/api']
                },
                'api': {
                    'public': {
                        'get': ['{market}/ticker', '{market}/orderbook', '{market}/trades']
                    },
                    'private': {
                        'post': ['{market}/money/depth/full', '{market}/money/order/add', '{market}/money/order/cancel', '{market}/money/order/result', '{market}/money/orders', '{market}/money/orders/history', '{market}/money/trades/fetch', 'GENMKT/money/info', 'GENMKT/money/deposit_address', 'GENMKT/money/new_deposit_address', 'GENMKT/money/wallet/history', 'GENMKT/money/withdraw']
                    }
                },
                'markets': {
                    'BTC/EUR': { 'id': 'BTCEUR', 'symbol': 'BTC/EUR', 'base': 'BTC', 'quote': 'EUR', 'maker': 0.0025, 'taker': 0.0025 }
                    // 'LTC/EUR': { 'id': 'LTCEUR', 'symbol': 'LTC/EUR', 'base': 'LTC', 'quote': 'EUR' },
                }
            });
        }
    }, {
        key: 'fetchBalance',
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var response, data, balance, result, currencies, i, currency, account;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.privatePostGENMKTMoneyInfo();

                            case 2:
                                response = _context.sent;
                                data = response['data'];
                                balance = data['wallets'];
                                result = { 'info': data };
                                currencies = (0, _keys2.default)(this.currencies);

                                for (i = 0; i < currencies.length; i++) {
                                    currency = currencies[i];
                                    account = this.account();

                                    if (currency in balance) {
                                        if ('available' in balance[currency]) {
                                            account['free'] = parseFloat(balance[currency]['available']['value']);
                                        }
                                    }
                                    if (currency in balance) {
                                        if ('balance' in balance[currency]) {
                                            account['total'] = parseFloat(balance[currency]['balance']['value']);
                                        }
                                    }
                                    if (account['total']) {
                                        if (account['free']) {
                                            account['used'] = account['total'] - account['free'];
                                        }
                                    }
                                    result[currency] = account;
                                }
                                return _context.abrupt('return', this.parseBalance(result));

                            case 9:
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
        key: 'parseBidAsk',
        value: function parseBidAsk(bidask) {
            var priceKey = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
            var amountKey = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

            return [bidask['price_int'] / 100000.0, bidask['amount_int'] / 100000000.0];
        }
    }, {
        key: 'fetchOrderBook',
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var market, response, orderbook;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                market = this.market(symbol);
                                _context2.next = 3;
                                return this.publicGetMarketOrderbook(this.extend({
                                    'market': market['id']
                                }, params));

                            case 3:
                                response = _context2.sent;
                                orderbook = response['data'];
                                return _context2.abrupt('return', this.parseOrderBook(orderbook));

                            case 6:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function fetchOrderBook(_x5) {
                return _ref2.apply(this, arguments);
            }

            return fetchOrderBook;
        }()
    }, {
        key: 'fetchTicker',
        value: function () {
            var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var ticker, timestamp;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return this.publicGetMarketTicker(this.extend({
                                    'market': this.marketId(symbol)
                                }, params));

                            case 2:
                                ticker = _context3.sent;
                                timestamp = ticker['timestamp'] * 1000;
                                return _context3.abrupt('return', {
                                    'symbol': symbol,
                                    'timestamp': timestamp,
                                    'datetime': this.iso8601(timestamp),
                                    'high': parseFloat(ticker['high']),
                                    'low': parseFloat(ticker['low']),
                                    'bid': parseFloat(ticker['bid']),
                                    'ask': parseFloat(ticker['ask']),
                                    'vwap': undefined,
                                    'open': undefined,
                                    'close': undefined,
                                    'first': undefined,
                                    'last': parseFloat(ticker['last']),
                                    'change': undefined,
                                    'percentage': undefined,
                                    'average': undefined,
                                    'baseVolume': parseFloat(ticker['volume']['24h']),
                                    'quoteVolume': undefined,
                                    'info': ticker
                                });

                            case 5:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function fetchTicker(_x7) {
                return _ref3.apply(this, arguments);
            }

            return fetchTicker;
        }()
    }, {
        key: 'parseTrade',
        value: function parseTrade(trade, market) {
            return {
                'id': trade['trade_id'],
                'info': trade,
                'timestamp': trade['date'],
                'datetime': this.iso8601(trade['date']),
                'symbol': market['symbol'],
                'type': undefined,
                'side': undefined,
                'price': trade['price_int'] / 100000.0,
                'amount': trade['amount_int'] / 100000000.0
            };
        }
    }, {
        key: 'fetchTrades',
        value: function () {
            var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(symbol) {
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var market, response, result;
                return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                market = this.market(symbol);
                                _context4.next = 3;
                                return this.publicGetMarketTrades(this.extend({
                                    'market': market['id']
                                }, params));

                            case 3:
                                response = _context4.sent;
                                result = this.parseTrades(response['data']['trades'], market, since, limit);
                                return _context4.abrupt('return', result);

                            case 6:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function fetchTrades(_x11) {
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
                var market, order, response;
                return _regenerator2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                market = this.market(symbol);
                                order = {
                                    'market': market['id'],
                                    'amount_int': amount,
                                    'fee_currency': market['quote'],
                                    'type': side == 'buy' ? 'bid' : 'ask'
                                };

                                if (type == 'limit') order['price_int'] = price;
                                _context5.next = 5;
                                return this.privatePostMarketMoneyOrderAdd(this.extend(order, params));

                            case 5:
                                response = _context5.sent;
                                return _context5.abrupt('return', {
                                    'info': response,
                                    'id': response['order_id'].toString()
                                });

                            case 7:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function createOrder(_x14, _x15, _x16, _x17) {
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
                                return this.privatePostMarketMoneyOrderCancel({ 'order_id': id });

                            case 2:
                                return _context6.abrupt('return', _context6.sent);

                            case 3:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function cancelOrder(_x20) {
                return _ref6.apply(this, arguments);
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

            var request = this.implodeParams(path, params);
            var url = this.urls['api'] + '/' + this.version + '/' + request;
            var query = this.omit(params, this.extractParams(path));
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
                    'Rest-Sign': signature
                };
            }
            return { 'url': url, 'method': method, 'body': body, 'headers': headers };
        }
    }]);
    return bl3p;
}(Exchange);