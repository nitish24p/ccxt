"use strict";

// ---------------------------------------------------------------------------

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
    (0, _inherits3.default)(tidex, _liqui);

    function tidex() {
        (0, _classCallCheck3.default)(this, tidex);
        return (0, _possibleConstructorReturn3.default)(this, (tidex.__proto__ || (0, _getPrototypeOf2.default)(tidex)).apply(this, arguments));
    }

    (0, _createClass3.default)(tidex, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend((0, _get3.default)(tidex.prototype.__proto__ || (0, _getPrototypeOf2.default)(tidex.prototype), 'describe', this).call(this), {
                'id': 'tidex',
                'name': 'Tidex',
                'countries': 'UK',
                'rateLimit': 2000,
                'version': '3',
                // 'hasCORS': false,
                // 'hasFetchTickers': true,
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/30781780-03149dc4-a12e-11e7-82bb-313b269d24d4.jpg',
                    'api': {
                        'public': 'https://api.tidex.com/api',
                        'private': 'https://api.tidex.com/tapi'
                    },
                    'www': 'https://tidex.com',
                    'doc': 'https://tidex.com/public-api',
                    'fees': 'https://tidex.com/pairs-spec'
                },
                'fees': {
                    'trading': {
                        'tierBased': false,
                        'percentage': true,
                        'taker': 0.1 / 100,
                        'maker': 0.1 / 100
                    },
                    'funding': {
                        'tierBased': false,
                        'percentage': false,
                        'withdraw': {
                            'BTC': 0.0012,
                            'ETH': 0.01,
                            'LTC': 0.001,
                            'DOGE': 0.01,
                            'ICN': 2,
                            'DASH': 0.002,
                            'GNO': 2,
                            'EOS': 2,
                            'BCH': 2,
                            'USDT': 0
                        },
                        'deposit': {
                            'BTC': 0,
                            'ETH': 0,
                            'LTC': 0,
                            'DOGE': 0,
                            'ICN': 0,
                            'DASH': 0,
                            'GNO': 0,
                            'EOS': 0,
                            'BCH': 0,
                            'USDT': 0
                        }
                    }
                }
            });
        }
    }]);
    return tidex;
}(liqui);