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
    (0, _inherits3.default)(bitmarket, _Exchange);

    function bitmarket() {
        (0, _classCallCheck3.default)(this, bitmarket);
        return (0, _possibleConstructorReturn3.default)(this, (bitmarket.__proto__ || (0, _getPrototypeOf2.default)(bitmarket)).apply(this, arguments));
    }

    (0, _createClass3.default)(bitmarket, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend((0, _get3.default)(bitmarket.prototype.__proto__ || (0, _getPrototypeOf2.default)(bitmarket.prototype), 'describe', this).call(this), {
                'id': 'bitmarket',
                'name': 'BitMarket',
                'countries': ['PL', 'EU'],
                'rateLimit': 1500,
                'hasCORS': false,
                'hasFetchOHLCV': true,
                'hasWithdraw': true,
                'timeframes': {
                    '90m': '90m',
                    '6h': '6h',
                    '1d': '1d',
                    '1w': '7d',
                    '1M': '1m',
                    '3M': '3m',
                    '6M': '6m',
                    '1y': '1y'
                },
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/27767256-a8555200-5ef9-11e7-96fd-469a65e2b0bd.jpg',
                    'api': {
                        'public': 'https://www.bitmarket.net',
                        'private': 'https://www.bitmarket.pl/api2/' // last slash is critical
                    },
                    'www': ['https://www.bitmarket.pl', 'https://www.bitmarket.net'],
                    'doc': ['https://www.bitmarket.net/docs.php?file=api_public.html', 'https://www.bitmarket.net/docs.php?file=api_private.html', 'https://github.com/bitmarket-net/api']
                },
                'api': {
                    'public': {
                        'get': ['json/{market}/ticker', 'json/{market}/orderbook', 'json/{market}/trades', 'json/ctransfer', 'graphs/{market}/90m', 'graphs/{market}/6h', 'graphs/{market}/1d', 'graphs/{market}/7d', 'graphs/{market}/1m', 'graphs/{market}/3m', 'graphs/{market}/6m', 'graphs/{market}/1y']
                    },
                    'private': {
                        'post': ['info', 'trade', 'cancel', 'orders', 'trades', 'history', 'withdrawals', 'tradingdesk', 'tradingdeskStatus', 'tradingdeskConfirm', 'cryptotradingdesk', 'cryptotradingdeskStatus', 'cryptotradingdeskConfirm', 'withdraw', 'withdrawFiat', 'withdrawPLNPP', 'withdrawFiatFast', 'deposit', 'transfer', 'transfers', 'marginList', 'marginOpen', 'marginClose', 'marginCancel', 'marginModify', 'marginBalanceAdd', 'marginBalanceRemove', 'swapList', 'swapOpen', 'swapClose']
                    }
                },
                'markets': {
                    'BCH/PLN': { 'id': 'BCCPLN', 'symbol': 'BCH/PLN', 'base': 'BCH', 'quote': 'PLN' },
                    'BTG/PLN': { 'id': 'BTGPLN', 'symbol': 'BTG/PLN', 'base': 'BTG', 'quote': 'PLN' },
                    'BTC/PLN': { 'id': 'BTCPLN', 'symbol': 'BTC/PLN', 'base': 'BTC', 'quote': 'PLN' },
                    'BTC/EUR': { 'id': 'BTCEUR', 'symbol': 'BTC/EUR', 'base': 'BTC', 'quote': 'EUR' },
                    'LTC/PLN': { 'id': 'LTCPLN', 'symbol': 'LTC/PLN', 'base': 'LTC', 'quote': 'PLN' },
                    'LTC/BTC': { 'id': 'LTCBTC', 'symbol': 'LTC/BTC', 'base': 'LTC', 'quote': 'BTC' },
                    'LiteMineX/BTC': { 'id': 'LiteMineXBTC', 'symbol': 'LiteMineX/BTC', 'base': 'LiteMineX', 'quote': 'BTC' }
                },
                'fees': {
                    'trading': {
                        'tierBased': true,
                        'percentage': true,
                        'taker': 0.45 / 100,
                        'maker': 0.15 / 100,
                        'tiers': {
                            'taker': [[0, 0.45 / 100], [99.99, 0.44 / 100], [299.99, 0.43 / 100], [499.99, 0.42 / 100], [999.99, 0.41 / 100], [1999.99, 0.40 / 100], [2999.99, 0.39 / 100], [4999.99, 0.38 / 100], [9999.99, 0.37 / 100], [19999.99, 0.36 / 100], [29999.99, 0.35 / 100], [49999.99, 0.34 / 100], [99999.99, 0.33 / 100], [199999.99, 0.32 / 100], [299999.99, 0.31 / 100], [499999.99, 0.0 / 100]],
                            'maker': [[0, 0.15 / 100], [99.99, 0.14 / 100], [299.99, 0.13 / 100], [499.99, 0.12 / 100], [999.99, 0.11 / 100], [1999.99, 0.10 / 100], [2999.99, 0.9 / 100], [4999.99, 0.8 / 100], [9999.99, 0.7 / 100], [19999.99, 0.6 / 100], [29999.99, 0.5 / 100], [49999.99, 0.4 / 100], [99999.99, 0.3 / 100], [199999.99, 0.2 / 100], [299999.99, 0.1 / 100], [499999.99, 0.0 / 100]]
                        }
                    },
                    'funding': {
                        'tierBased': false,
                        'percentage': false,
                        'withdraw': {
                            'BTC': 0.0008,
                            'LTC': 0.005,
                            'BCH': 0.0008,
                            'BTG': 0.0008,
                            'DOGE': 1,
                            'EUR': 2,
                            'PLN': 2
                        },
                        'deposit': {
                            'BTC': 0,
                            'LTC': 0,
                            'BCH': 0,
                            'BTG': 0,
                            'DOGE': 25,
                            'EUR': 2, // SEPA. Transfer INT (SHA): 5 EUR
                            'PLN': 0
                        }
                    }
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
                                return this.loadMarkets();

                            case 2:
                                _context.next = 4;
                                return this.privatePostInfo();

                            case 4:
                                response = _context.sent;
                                data = response['data'];
                                balance = data['balances'];
                                result = { 'info': data };
                                currencies = (0, _keys2.default)(this.currencies);

                                for (i = 0; i < currencies.length; i++) {
                                    currency = currencies[i];
                                    account = this.account();

                                    if (currency in balance['available']) account['free'] = balance['available'][currency];
                                    if (currency in balance['blocked']) account['used'] = balance['blocked'][currency];
                                    account['total'] = this.sum(account['free'], account['used']);
                                    result[currency] = account;
                                }
                                return _context.abrupt('return', this.parseBalance(result));

                            case 11:
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
                var orderbook, timestamp;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this.publicGetJsonMarketOrderbook(this.extend({
                                    'market': this.marketId(symbol)
                                }, params));

                            case 2:
                                orderbook = _context2.sent;
                                timestamp = this.milliseconds();
                                return _context2.abrupt('return', {
                                    'bids': orderbook['bids'],
                                    'asks': orderbook['asks'],
                                    'timestamp': timestamp,
                                    'datetime': this.iso8601(timestamp)
                                });

                            case 5:
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
                var ticker, timestamp, vwap, baseVolume, quoteVolume;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return this.publicGetJsonMarketTicker(this.extend({
                                    'market': this.marketId(symbol)
                                }, params));

                            case 2:
                                ticker = _context3.sent;
                                timestamp = this.milliseconds();
                                vwap = parseFloat(ticker['vwap']);
                                baseVolume = parseFloat(ticker['volume']);
                                quoteVolume = baseVolume * vwap;
                                return _context3.abrupt('return', {
                                    'symbol': symbol,
                                    'timestamp': timestamp,
                                    'datetime': this.iso8601(timestamp),
                                    'high': parseFloat(ticker['high']),
                                    'low': parseFloat(ticker['low']),
                                    'bid': parseFloat(ticker['bid']),
                                    'ask': parseFloat(ticker['ask']),
                                    'vwap': vwap,
                                    'open': undefined,
                                    'close': undefined,
                                    'first': undefined,
                                    'last': parseFloat(ticker['last']),
                                    'change': undefined,
                                    'percentage': undefined,
                                    'average': undefined,
                                    'baseVolume': baseVolume,
                                    'quoteVolume': quoteVolume,
                                    'info': ticker
                                });

                            case 8:
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
        value: function parseTrade(trade) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var side = trade['type'] == 'bid' ? 'buy' : 'sell';
            var timestamp = trade['date'] * 1000;
            return {
                'id': trade['tid'].toString(),
                'info': trade,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'symbol': market['symbol'],
                'order': undefined,
                'type': undefined,
                'side': side,
                'price': trade['price'],
                'amount': trade['amount']
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
                                return this.publicGetJsonMarketTrades(this.extend({
                                    'market': market['id']
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

            function fetchTrades(_x10) {
                return _ref4.apply(this, arguments);
            }

            return fetchTrades;
        }()
    }, {
        key: 'parseOHLCV',
        value: function parseOHLCV(ohlcv) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
            var timeframe = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '90m';
            var since = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
            var limit = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;

            return [ohlcv['time'] * 1000, parseFloat(ohlcv['open']), parseFloat(ohlcv['high']), parseFloat(ohlcv['low']), parseFloat(ohlcv['close']), parseFloat(ohlcv['vol'])];
        }
    }, {
        key: 'fetchOHLCV',
        value: function () {
            var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(symbol) {
                var timeframe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '90m';
                var since = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var limit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
                var params = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
                var method, market, response;
                return _regenerator2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.next = 2;
                                return this.loadMarkets();

                            case 2:
                                method = 'publicGetGraphsMarket' + this.timeframes[timeframe];
                                market = this.market(symbol);
                                _context5.next = 6;
                                return this[method](this.extend({
                                    'market': market['id']
                                }, params));

                            case 6:
                                response = _context5.sent;
                                return _context5.abrupt('return', this.parseOHLCVs(response, market, timeframe, since, limit));

                            case 8:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function fetchOHLCV(_x19) {
                return _ref5.apply(this, arguments);
            }

            return fetchOHLCV;
        }()
    }, {
        key: 'createOrder',
        value: function () {
            var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(symbol, type, side, amount) {
                var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
                var response, result;
                return _regenerator2.default.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                _context6.next = 2;
                                return this.privatePostTrade(this.extend({
                                    'market': this.marketId(symbol),
                                    'type': side,
                                    'amount': amount,
                                    'rate': price
                                }, params));

                            case 2:
                                response = _context6.sent;
                                result = {
                                    'info': response
                                };

                                if ('id' in response['order']) result['id'] = response['id'];
                                return _context6.abrupt('return', result);

                            case 6:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function createOrder(_x22, _x23, _x24, _x25) {
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
                return _regenerator2.default.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                _context7.next = 2;
                                return this.privatePostCancel({ 'id': id });

                            case 2:
                                return _context7.abrupt('return', _context7.sent);

                            case 3:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function cancelOrder(_x28) {
                return _ref7.apply(this, arguments);
            }

            return cancelOrder;
        }()
    }, {
        key: 'isFiat',
        value: function isFiat(currency) {
            if (currency == 'EUR') return true;
            if (currency == 'PLN') return true;
            return false;
        }
    }, {
        key: 'withdraw',
        value: function () {
            var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8(currency, amount, address) {
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var method, request, response;
                return _regenerator2.default.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                _context8.next = 2;
                                return this.loadMarkets();

                            case 2:
                                method = undefined;
                                request = {
                                    'currency': currency,
                                    'quantity': amount
                                };

                                if (!this.isFiat(currency)) {
                                    _context8.next = 25;
                                    break;
                                }

                                method = 'privatePostWithdrawFiat';

                                if (!('account' in params)) {
                                    _context8.next = 10;
                                    break;
                                }

                                request['account'] = params['account']; // bank account code for withdrawal
                                _context8.next = 11;
                                break;

                            case 10:
                                throw new ExchangeError(this.id + ' requires account parameter to withdraw fiat currency');

                            case 11:
                                if (!('account2' in params)) {
                                    _context8.next = 15;
                                    break;
                                }

                                request['account2'] = params['account2']; // bank SWIFT code (EUR only)
                                _context8.next = 17;
                                break;

                            case 15:
                                if (!(currency == 'EUR')) {
                                    _context8.next = 17;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' requires account2 parameter to withdraw EUR');

                            case 17:
                                if (!('withdrawal_note' in params)) {
                                    _context8.next = 21;
                                    break;
                                }

                                request['withdrawal_note'] = params['withdrawal_note']; // a 10-character user-specified withdrawal note (PLN only)
                                _context8.next = 23;
                                break;

                            case 21:
                                if (!(currency == 'PLN')) {
                                    _context8.next = 23;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' requires withdrawal_note parameter to withdraw PLN');

                            case 23:
                                _context8.next = 27;
                                break;

                            case 25:
                                method = 'privatePostWithdraw';
                                request['address'] = address;

                            case 27:
                                _context8.next = 29;
                                return this[method](this.extend(request, params));

                            case 29:
                                response = _context8.sent;
                                return _context8.abrupt('return', {
                                    'info': response,
                                    'id': response
                                });

                            case 31:
                            case 'end':
                                return _context8.stop();
                        }
                    }
                }, _callee8, this);
            }));

            function withdraw(_x30, _x31, _x32) {
                return _ref8.apply(this, arguments);
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

            var url = this.urls['api'][api];
            if (api == 'public') {
                url += '/' + this.implodeParams(path + '.json', params);
            } else {
                this.checkRequiredCredentials();
                var nonce = this.nonce();
                var query = this.extend({
                    'tonce': nonce,
                    'method': path
                }, params);
                body = this.urlencode(query);
                headers = {
                    'API-Key': this.apiKey,
                    'API-Hash': this.hmac(this.encode(body), this.encode(this.secret), 'sha512')
                };
            }
            return { 'url': url, 'method': method, 'body': body, 'headers': headers };
        }
    }]);
    return bitmarket;
}(Exchange);