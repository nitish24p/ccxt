"use strict";

// ---------------------------------------------------------------------------

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var liqui = require('./liqui.js');

// ---------------------------------------------------------------------------

module.exports = function (_liqui) {
    _inherits(dsx, _liqui);

    function dsx() {
        _classCallCheck(this, dsx);

        return _possibleConstructorReturn(this, (dsx.__proto__ || Object.getPrototypeOf(dsx)).apply(this, arguments));
    }

    _createClass(dsx, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend(_get(dsx.prototype.__proto__ || Object.getPrototypeOf(dsx.prototype), 'describe', this).call(this), {
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
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var response, balances, result, funds, currencies, c, currency, uppercase, account;
                return regeneratorRuntime.wrap(function _callee$(_context) {
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
                                currencies = Object.keys(funds);

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