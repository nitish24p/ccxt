"use strict";

// ---------------------------------------------------------------------------

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

var zb = require('./zb.js');

var _require = require('./base/errors'),
    ExchangeError = _require.ExchangeError,
    ExchangeNotAvailable = _require.ExchangeNotAvailable;

// ---------------------------------------------------------------------------

module.exports = function (_zb) {
    (0, _inherits3.default)(chbtc, _zb);

    function chbtc() {
        (0, _classCallCheck3.default)(this, chbtc);
        return (0, _possibleConstructorReturn3.default)(this, (chbtc.__proto__ || (0, _getPrototypeOf2.default)(chbtc)).apply(this, arguments));
    }

    (0, _createClass3.default)(chbtc, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend((0, _get3.default)(chbtc.prototype.__proto__ || (0, _getPrototypeOf2.default)(chbtc.prototype), 'describe', this).call(this), {
                'id': 'chbtc',
                'name': 'CHBTC',
                'countries': 'CN',
                'rateLimit': 1000,
                'version': 'v1',
                'hasCORS': false,
                'hasFetchOrder': true,
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/28555659-f0040dc2-7109-11e7-9d99-688a438bf9f4.jpg',
                    'api': {
                        'public': 'http://api.chbtc.com/data', // no https for public API
                        'private': 'https://trade.chbtc.com/api'
                    },
                    'www': 'https://trade.chbtc.com/api',
                    'doc': 'https://www.chbtc.com/i/developer'
                }
            });
        }
    }, {
        key: 'getMarketFieldName',
        value: function getMarketFieldName() {
            return 'currency';
        }
    }, {
        key: 'fetchMarkets',
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                return _context.abrupt('return', {
                                    'BTC/CNY': { 'id': 'btc_cny', 'symbol': 'BTC/CNY', 'base': 'BTC', 'quote': 'CNY' },
                                    'LTC/CNY': { 'id': 'ltc_cny', 'symbol': 'LTC/CNY', 'base': 'LTC', 'quote': 'CNY' },
                                    'ETH/CNY': { 'id': 'eth_cny', 'symbol': 'ETH/CNY', 'base': 'ETH', 'quote': 'CNY' },
                                    'ETC/CNY': { 'id': 'etc_cny', 'symbol': 'ETC/CNY', 'base': 'ETC', 'quote': 'CNY' },
                                    'BTS/CNY': { 'id': 'bts_cny', 'symbol': 'BTS/CNY', 'base': 'BTS', 'quote': 'CNY' },
                                    // 'EOS/CNY': { 'id': 'eos_cny', 'symbol': 'EOS/CNY', 'base': 'EOS', 'quote': 'CNY' },
                                    'BCH/CNY': { 'id': 'bcc_cny', 'symbol': 'BCH/CNY', 'base': 'BCH', 'quote': 'CNY' },
                                    'HSR/CNY': { 'id': 'hsr_cny', 'symbol': 'HSR/CNY', 'base': 'HSR', 'quote': 'CNY' },
                                    'QTUM/CNY': { 'id': 'qtum_cny', 'symbol': 'QTUM/CNY', 'base': 'QTUM', 'quote': 'CNY' }
                                });

                            case 1:
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
        key: 'request',
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(path) {
                var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
                var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;
                var response;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this.fetch2(path, api, method, params, headers, body);

                            case 2:
                                response = _context2.sent;

                                if (!(api == 'private')) {
                                    _context2.next = 6;
                                    break;
                                }

                                if (!('code' in response)) {
                                    _context2.next = 6;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' ' + this.json(response));

                            case 6:
                                if (!('result' in response)) {
                                    _context2.next = 9;
                                    break;
                                }

                                if (response['result']) {
                                    _context2.next = 9;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' ' + this.json(response));

                            case 9:
                                return _context2.abrupt('return', response);

                            case 10:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function request(_x6) {
                return _ref2.apply(this, arguments);
            }

            return request;
        }()
    }]);
    return chbtc;
}(zb);