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

var _require = require('./base/errors'),
    ExchangeError = _require.ExchangeError,
    InsufficientFunds = _require.InsufficientFunds,
    DDoSProtection = _require.DDoSProtection;

// ---------------------------------------------------------------------------

module.exports = function (_liqui) {
    (0, _inherits3.default)(yobit, _liqui);

    function yobit() {
        (0, _classCallCheck3.default)(this, yobit);
        return (0, _possibleConstructorReturn3.default)(this, (yobit.__proto__ || (0, _getPrototypeOf2.default)(yobit)).apply(this, arguments));
    }

    (0, _createClass3.default)(yobit, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend((0, _get3.default)(yobit.prototype.__proto__ || (0, _getPrototypeOf2.default)(yobit.prototype), 'describe', this).call(this), {
                'id': 'yobit',
                'name': 'YoBit',
                'countries': 'RU',
                'rateLimit': 3000, // responses are cached every 2 seconds
                'version': '3',
                'hasCORS': false,
                'hasWithdraw': true,
                'hasFetchTickers': false,
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/27766910-cdcbfdae-5eea-11e7-9859-03fea873272d.jpg',
                    'api': {
                        'public': 'https://yobit.net/api',
                        'private': 'https://yobit.net/tapi'
                    },
                    'www': 'https://www.yobit.net',
                    'doc': 'https://www.yobit.net/en/api/'
                },
                'api': {
                    'public': {
                        'get': ['depth/{pair}', 'info', 'ticker/{pair}', 'trades/{pair}']
                    },
                    'private': {
                        'post': ['ActiveOrders', 'CancelOrder', 'GetDepositAddress', 'getInfo', 'OrderInfo', 'Trade', 'TradeHistory', 'WithdrawCoinsToAddress']
                    }
                },
                'fees': {
                    'trading': {
                        'maker': 0.002,
                        'taker': 0.002
                    },
                    'funding': 0.0
                }
            });
        }
    }, {
        key: 'commonCurrencyCode',
        value: function commonCurrencyCode(currency) {
            var substitutions = {
                'AIR': 'AirCoin',
                'ANI': 'ANICoin',
                'ANT': 'AntsCoin',
                'ATM': 'Autumncoin',
                'BCC': 'BCH',
                'BTS': 'Bitshares2',
                'DCT': 'Discount',
                'DGD': 'DarkGoldCoin',
                'ICN': 'iCoin',
                'LIZI': 'LiZi',
                'LUN': 'LunarCoin',
                'NAV': 'NavajoCoin',
                'OMG': 'OMGame',
                'PAY': 'EPAY',
                'REP': 'Republicoin'
            };
            if (currency in substitutions) return substitutions[currency];
            return currency;
        }
    }, {
        key: 'currencyId',
        value: function currencyId(commonCode) {
            var substitutions = {
                'AirCoin': 'AIR',
                'ANICoin': 'ANI',
                'AntsCoin': 'ANT',
                'Autumncoin': 'ATM',
                'BCH': 'BCC',
                'Bitshares2': 'BTS',
                'Discount': 'DCT',
                'DarkGoldCoin': 'DGD',
                'iCoin': 'ICN',
                'LiZi': 'LIZI',
                'LunarCoin': 'LUN',
                'NavajoCoin': 'NAV',
                'OMGame': 'OMG',
                'EPAY': 'PAY',
                'Republicoin': 'REP'
            };
            if (commonCode in substitutions) return substitutions[commonCode];
            return commonCode;
        }
    }, {
        key: 'fetchBalance',
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var response, balances, result, sides, keys, i, key, side, currencies, j, lowercase, uppercase, currency, account;
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
                                sides = { 'free': 'funds', 'total': 'funds_incl_orders' };
                                keys = (0, _keys2.default)(sides);

                                for (i = 0; i < keys.length; i++) {
                                    key = keys[i];
                                    side = sides[key];

                                    if (side in balances) {
                                        currencies = (0, _keys2.default)(balances[side]);

                                        for (j = 0; j < currencies.length; j++) {
                                            lowercase = currencies[j];
                                            uppercase = lowercase.toUpperCase();
                                            currency = this.commonCurrencyCode(uppercase);
                                            account = undefined;

                                            if (currency in result) {
                                                account = result[currency];
                                            } else {
                                                account = this.account();
                                            }
                                            account[key] = balances[side][lowercase];
                                            if (account['total'] && account['free']) account['used'] = account['total'] - account['free'];
                                            result[currency] = account;
                                        }
                                    }
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
        key: 'createDepositAddress',
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(currency) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var response;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this.fetchDepositAddress(currency, this.extend({
                                    'need_new': 1
                                }, params));

                            case 2:
                                response = _context2.sent;
                                return _context2.abrupt('return', {
                                    'currency': currency,
                                    'address': response['address'],
                                    'status': 'ok',
                                    'info': response['info']
                                });

                            case 4:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function createDepositAddress(_x3) {
                return _ref2.apply(this, arguments);
            }

            return createDepositAddress;
        }()
    }, {
        key: 'fetchDepositAddress',
        value: function () {
            var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(currency) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var currencyId, request, response, address;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                currencyId = this.currencyId(currency);
                                request = {
                                    'coinName': currencyId,
                                    'need_new': 0
                                };
                                _context3.next = 4;
                                return this.privatePostGetDepositAddress(this.extend(request, params));

                            case 4:
                                response = _context3.sent;
                                address = this.safeString(response['return'], 'address');
                                return _context3.abrupt('return', {
                                    'currency': currency,
                                    'address': address,
                                    'status': 'ok',
                                    'info': response
                                });

                            case 7:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function fetchDepositAddress(_x5) {
                return _ref3.apply(this, arguments);
            }

            return fetchDepositAddress;
        }()
    }, {
        key: 'withdraw',
        value: function () {
            var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(currency, amount, address) {
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var response;
                return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context4.next = 4;
                                return this.privatePostWithdrawCoinsToAddress(this.extend({
                                    'coinName': currency,
                                    'amount': amount,
                                    'address': address
                                }, params));

                            case 4:
                                response = _context4.sent;
                                return _context4.abrupt('return', {
                                    'info': response,
                                    'id': undefined
                                });

                            case 6:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function withdraw(_x7, _x8, _x9) {
                return _ref4.apply(this, arguments);
            }

            return withdraw;
        }()
    }, {
        key: 'request',
        value: function () {
            var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(path) {
                var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
                var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;
                var response;
                return _regenerator2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.next = 2;
                                return this.fetch2(path, api, method, params, headers, body);

                            case 2:
                                response = _context5.sent;

                                if (!('success' in response)) {
                                    _context5.next = 18;
                                    break;
                                }

                                if (response['success']) {
                                    _context5.next = 18;
                                    break;
                                }

                                if (!(response['error'].indexOf('Insufficient funds') >= 0)) {
                                    _context5.next = 9;
                                    break;
                                }

                                throw new InsufficientFunds(this.id + ' ' + this.json(response));

                            case 9:
                                if (!(response['error'] == 'Requests too often')) {
                                    _context5.next = 13;
                                    break;
                                }

                                throw new DDoSProtection(this.id + ' ' + this.json(response));

                            case 13:
                                if (!(response['error'] == 'not available' || response['error'] == 'external service unavailable')) {
                                    _context5.next = 17;
                                    break;
                                }

                                throw new DDoSProtection(this.id + ' ' + this.json(response));

                            case 17:
                                throw new ExchangeError(this.id + ' ' + this.json(response));

                            case 18:
                                return _context5.abrupt('return', response);

                            case 19:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function request(_x15) {
                return _ref5.apply(this, arguments);
            }

            return request;
        }()
    }]);
    return yobit;
}(liqui);