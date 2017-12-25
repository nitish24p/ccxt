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
    (0, _inherits3.default)(bitcoincoid, _Exchange);

    function bitcoincoid() {
        (0, _classCallCheck3.default)(this, bitcoincoid);
        return (0, _possibleConstructorReturn3.default)(this, (bitcoincoid.__proto__ || (0, _getPrototypeOf2.default)(bitcoincoid)).apply(this, arguments));
    }

    (0, _createClass3.default)(bitcoincoid, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend((0, _get3.default)(bitcoincoid.prototype.__proto__ || (0, _getPrototypeOf2.default)(bitcoincoid.prototype), 'describe', this).call(this), {
                'id': 'bitcoincoid',
                'name': 'Bitcoin.co.id',
                'countries': 'ID', // Indonesia
                'hasCORS': false,
                'version': '1.7', // as of 6 November 2017
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/27766138-043c7786-5ecf-11e7-882b-809c14f38b53.jpg',
                    'api': {
                        'public': 'https://vip.bitcoin.co.id/api',
                        'private': 'https://vip.bitcoin.co.id/tapi'
                    },
                    'www': 'https://www.bitcoin.co.id',
                    'doc': ['https://vip.bitcoin.co.id/downloads/BITCOINCOID-API-DOCUMENTATION.pdf', 'https://vip.bitcoin.co.id/trade_api']
                },
                'api': {
                    'public': {
                        'get': ['{pair}/ticker', '{pair}/trades', '{pair}/depth']
                    },
                    'private': {
                        'post': ['getInfo', 'transHistory', 'trade', 'tradeHistory', 'openOrders', 'cancelOrder']
                    }
                },
                'markets': {
                    'BTC/IDR': { 'id': 'btc_idr', 'symbol': 'BTC/IDR', 'base': 'BTC', 'quote': 'IDR', 'baseId': 'btc', 'quoteId': 'idr' },
                    'BCH/IDR': { 'id': 'bch_idr', 'symbol': 'BCH/IDR', 'base': 'BCH', 'quote': 'IDR', 'baseId': 'bch', 'quoteId': 'idr' },
                    'BTG/IDR': { 'id': 'btg_idr', 'symbol': 'BTG/IDR', 'base': 'BTG', 'quote': 'IDR', 'baseId': 'btg', 'quoteId': 'idr' },
                    'ETH/IDR': { 'id': 'eth_idr', 'symbol': 'ETH/IDR', 'base': 'ETH', 'quote': 'IDR', 'baseId': 'eth', 'quoteId': 'idr' },
                    'ETC/IDR': { 'id': 'etc_idr', 'symbol': 'ETC/IDR', 'base': 'ETC', 'quote': 'IDR', 'baseId': 'etc', 'quoteId': 'idr' },
                    'LTC/IDR': { 'id': 'ltc_idr', 'symbol': 'LTC/IDR', 'base': 'LTC', 'quote': 'IDR', 'baseId': 'ltc', 'quoteId': 'idr' },
                    'NXT/IDR': { 'id': 'nxt_idr', 'symbol': 'NXT/IDR', 'base': 'NXT', 'quote': 'IDR', 'baseId': 'nxt', 'quoteId': 'idr' },
                    'WAVES/IDR': { 'id': 'waves_idr', 'symbol': 'WAVES/IDR', 'base': 'WAVES', 'quote': 'IDR', 'baseId': 'waves', 'quoteId': 'idr' },
                    'XRP/IDR': { 'id': 'xrp_idr', 'symbol': 'XRP/IDR', 'base': 'XRP', 'quote': 'IDR', 'baseId': 'xrp', 'quoteId': 'idr' },
                    'XZC/IDR': { 'id': 'xzc_idr', 'symbol': 'XZC/IDR', 'base': 'XZC', 'quote': 'IDR', 'baseId': 'xzc', 'quoteId': 'idr' },
                    'XLM/IDR': { 'id': 'str_idr', 'symbol': 'XLM/IDR', 'base': 'XLM', 'quote': 'IDR', 'baseId': 'str', 'quoteId': 'idr' },
                    'BTS/BTC': { 'id': 'bts_btc', 'symbol': 'BTS/BTC', 'base': 'BTS', 'quote': 'BTC', 'baseId': 'bts', 'quoteId': 'btc' },
                    'DASH/BTC': { 'id': 'drk_btc', 'symbol': 'DASH/BTC', 'base': 'DASH', 'quote': 'BTC', 'baseId': 'drk', 'quoteId': 'btc' },
                    'DOGE/BTC': { 'id': 'doge_btc', 'symbol': 'DOGE/BTC', 'base': 'DOGE', 'quote': 'BTC', 'baseId': 'doge', 'quoteId': 'btc' },
                    'ETH/BTC': { 'id': 'eth_btc', 'symbol': 'ETH/BTC', 'base': 'ETH', 'quote': 'BTC', 'baseId': 'eth', 'quoteId': 'btc' },
                    'LTC/BTC': { 'id': 'ltc_btc', 'symbol': 'LTC/BTC', 'base': 'LTC', 'quote': 'BTC', 'baseId': 'ltc', 'quoteId': 'btc' },
                    'NXT/BTC': { 'id': 'nxt_btc', 'symbol': 'NXT/BTC', 'base': 'NXT', 'quote': 'BTC', 'baseId': 'nxt', 'quoteId': 'btc' },
                    'XLM/BTC': { 'id': 'str_btc', 'symbol': 'XLM/BTC', 'base': 'XLM', 'quote': 'BTC', 'baseId': 'str', 'quoteId': 'btc' },
                    'XEM/BTC': { 'id': 'nem_btc', 'symbol': 'XEM/BTC', 'base': 'XEM', 'quote': 'BTC', 'baseId': 'nem', 'quoteId': 'btc' },
                    'XRP/BTC': { 'id': 'xrp_btc', 'symbol': 'XRP/BTC', 'base': 'XRP', 'quote': 'BTC', 'baseId': 'xrp', 'quoteId': 'btc' }
                }
            });
        }
    }, {
        key: 'fetchBalance',
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var response, balance, result, currencies, i, currency, lowercase, account;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.privatePostGetInfo();

                            case 2:
                                response = _context.sent;
                                balance = response['return'];
                                result = { 'info': balance };
                                currencies = (0, _keys2.default)(this.currencies);

                                for (i = 0; i < currencies.length; i++) {
                                    currency = currencies[i];
                                    lowercase = currency.toLowerCase();
                                    account = this.account();

                                    account['free'] = this.safeFloat(balance['balance'], lowercase, 0.0);
                                    account['used'] = this.safeFloat(balance['balance_hold'], lowercase, 0.0);
                                    account['total'] = this.sum(account['free'], account['used']);
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
                var orderbook;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this.publicGetPairDepth(this.extend({
                                    'pair': this.marketId(symbol)
                                }, params));

                            case 2:
                                orderbook = _context2.sent;
                                return _context2.abrupt('return', this.parseOrderBook(orderbook, undefined, 'buy', 'sell'));

                            case 4:
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
                var market, response, ticker, timestamp, baseVolume, quoteVolume;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                market = this.market(symbol);
                                _context3.next = 3;
                                return this.publicGetPairTicker(this.extend({
                                    'pair': market['id']
                                }, params));

                            case 3:
                                response = _context3.sent;
                                ticker = response['ticker'];
                                timestamp = parseFloat(ticker['server_time']) * 1000;
                                baseVolume = 'vol_' + market['baseId'].toLowerCase();
                                quoteVolume = 'vol_' + market['quoteId'].toLowerCase();
                                return _context3.abrupt('return', {
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
                                    'baseVolume': parseFloat(ticker[baseVolume]),
                                    'quoteVolume': parseFloat(ticker[quoteVolume]),
                                    'info': ticker
                                });

                            case 9:
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
        key: 'parseTrade',
        value: function parseTrade(trade, market) {
            var timestamp = parseInt(trade['date']) * 1000;
            return {
                'id': trade['tid'],
                'info': trade,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'symbol': market['symbol'],
                'type': undefined,
                'side': trade['type'],
                'price': parseFloat(trade['price']),
                'amount': parseFloat(trade['amount'])
            };
        }
    }, {
        key: 'fetchTrades',
        value: function () {
            var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(symbol) {
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var market, response;
                return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                market = this.market(symbol);
                                _context4.next = 3;
                                return this.publicGetPairTrades(this.extend({
                                    'pair': market['id']
                                }, params));

                            case 3:
                                response = _context4.sent;
                                return _context4.abrupt('return', this.parseTrades(response, market, since, limit));

                            case 5:
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
                var market, order, base, result;
                return _regenerator2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                market = this.market(symbol);
                                order = {
                                    'pair': market['id'],
                                    'type': side,
                                    'price': price
                                };
                                base = market['baseId'];

                                order[base] = amount;
                                _context5.next = 6;
                                return this.privatePostTrade(this.extend(order, params));

                            case 6:
                                result = _context5.sent;
                                return _context5.abrupt('return', {
                                    'info': result,
                                    'id': result['return']['order_id'].toString()
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
                                return this.privatePostCancelOrder(this.extend({
                                    'order_id': id
                                }, params));

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
        key: 'sign',
        value: function sign(path) {
            var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var url = this.urls['api'][api];
            if (api == 'public') {
                url += '/' + this.implodeParams(path, params);
            } else {
                this.checkRequiredCredentials();
                body = this.urlencode(this.extend({
                    'method': path,
                    'nonce': this.nonce()
                }, params));
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
            var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(path) {
                var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
                var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;
                var response;
                return _regenerator2.default.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                _context7.next = 2;
                                return this.fetch2(path, api, method, params, headers, body);

                            case 2:
                                response = _context7.sent;

                                if (!('error' in response)) {
                                    _context7.next = 5;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' ' + response['error']);

                            case 5:
                                return _context7.abrupt('return', response);

                            case 6:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function request(_x29) {
                return _ref7.apply(this, arguments);
            }

            return request;
        }()
    }]);
    return bitcoincoid;
}(Exchange);