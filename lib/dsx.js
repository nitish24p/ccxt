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

var liqui = require('./liqui.js');

// ---------------------------------------------------------------------------

module.exports = function (_liqui) {
    (0, _inherits3.default)(dsx, _liqui);

    function dsx() {
        (0, _classCallCheck3.default)(this, dsx);
        return (0, _possibleConstructorReturn3.default)(this, (dsx.__proto__ || (0, _getPrototypeOf2.default)(dsx)).apply(this, arguments));
    }

    (0, _createClass3.default)(dsx, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend((0, _get3.default)(dsx.prototype.__proto__ || (0, _getPrototypeOf2.default)(dsx.prototype), 'describe', this).call(this), {
                'id': 'dsx',
                'name': 'DSX',
                'countries': 'UK',
                'rateLimit': 1500,
                'hasCORS': false,
                'hasFetchOrder': true,
                'hasFetchOrders': true,
                'hasFetchOpenOrders': true,
                'hasFetchClosedOrders': true,
                'hasFetchTickers': true,
                'hasFetchMyTrades': true,
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/27990275-1413158a-645a-11e7-931c-94717f7510e3.jpg',
                    'api': {
                        'public': 'https://dsx.uk/mapi', // market data
                        'private': 'https://dsx.uk/tapi', // trading
                        'dwapi': 'https://dsx.uk/dwapi' // deposit/withdraw
                    },
                    'www': 'https://dsx.uk',
                    'doc': ['https://api.dsx.uk', 'https://dsx.uk/api_docs/public', 'https://dsx.uk/api_docs/private', '']
                },
                'api': {
                    // market data (public)
                    'public': {
                        'get': ['barsFromMoment/{id}/{period}/{start}', // empty reply :\
                        'depth/{pair}', 'info', 'lastBars/{id}/{period}/{amount}', // period is (m, h or d)
                        'periodBars/{id}/{period}/{start}/{end}', 'ticker/{pair}', 'trades/{pair}']
                    },
                    // trading (private)
                    'private': {
                        'post': ['getInfo', 'TransHistory', 'TradeHistory', 'OrderHistory', 'ActiveOrders', 'Trade', 'CancelOrder']
                    },
                    // deposit / withdraw (private)
                    'dwapi': {
                        'post': ['getCryptoDepositAddress', 'cryptoWithdraw', 'fiatWithdraw', 'getTransactionStatus', 'getTransactions']
                    }
                }
            });
        }
    }, {
        key: 'getBaseQuoteFromMarketId',
        value: function getBaseQuoteFromMarketId(id) {
            var uppercase = id.toUpperCase();
            var base = uppercase.slice(0, 3);
            var quote = uppercase.slice(3, 6);
            base = this.commonCurrencyCode(base);
            quote = this.commonCurrencyCode(quote);
            return [base, quote];
        }
    }, {
        key: 'fetchBalance',
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var response, balances, result, funds, currencies, c, currency, uppercase, account;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context.next = 4;
                                return this.privatePostGetInfo();

                            case 4:
                                response = _context.sent;
                                balances = response['return'];
                                result = { 'info': balances };
                                funds = balances['funds'];
                                currencies = (0, _keys2.default)(funds);

                                for (c = 0; c < currencies.length; c++) {
                                    currency = currencies[c];
                                    uppercase = currency.toUpperCase();

                                    uppercase = this.commonCurrencyCode(uppercase);
                                    account = {
                                        'free': funds[currency],
                                        'used': 0.0,
                                        'total': balances['total'][currency]
                                    };

                                    account['used'] = account['total'] - account['free'];
                                    result[uppercase] = account;
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
                'high': this.safeFloat(ticker, 'high'),
                'low': this.safeFloat(ticker, 'low'),
                'bid': this.safeFloat(ticker, 'buy'),
                'ask': this.safeFloat(ticker, 'sell'),
                'vwap': undefined,
                'open': undefined,
                'close': undefined,
                'first': undefined,
                'last': this.safeFloat(ticker, 'last'),
                'change': undefined,
                'percentage': undefined,
                'average': 1 / this.safeFloat(ticker, 'avg'),
                'baseVolume': this.safeFloat(ticker, 'vol'),
                'quoteVolume': this.safeFloat(ticker, 'vol_cur'),
                'info': ticker
            };
        }
    }, {
        key: 'getOrderIdKey',
        value: function getOrderIdKey() {
            return 'orderId';
        }
    }, {
        key: 'signBodyWithSecret',
        value: function signBodyWithSecret(body) {
            return this.decode(this.hmac(this.encode(body), this.encode(this.secret), 'sha512', 'base64'));
        }
    }, {
        key: 'getVersionString',
        value: function getVersionString() {
            return ''; // they don't prepend version number to public URLs as other BTC-e clones do
        }
    }]);
    return dsx;
}(liqui);