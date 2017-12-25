"use strict";

// ---------------------------------------------------------------------------

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var zb = require('./zb.js');

var _require = require('./base/errors'),
    ExchangeError = _require.ExchangeError,
    ExchangeNotAvailable = _require.ExchangeNotAvailable;

// ---------------------------------------------------------------------------

module.exports = function (_zb) {
    _inherits(chbtc, _zb);

    function chbtc() {
        _classCallCheck(this, chbtc);

        return _possibleConstructorReturn(this, (chbtc.__proto__ || Object.getPrototypeOf(chbtc)).apply(this, arguments));
    }

    _createClass(chbtc, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend(_get(chbtc.prototype.__proto__ || Object.getPrototypeOf(chbtc.prototype), 'describe', this).call(this), {
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
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                return regeneratorRuntime.wrap(function _callee$(_context) {
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
            var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(path) {
                var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
                var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;
                var response;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
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