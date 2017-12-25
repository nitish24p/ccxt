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

var _1btcxe = require('./_1btcxe.js');

// ---------------------------------------------------------------------------

module.exports = function (_btcxe) {
    (0, _inherits3.default)(getbtc, _btcxe);

    function getbtc() {
        (0, _classCallCheck3.default)(this, getbtc);
        return (0, _possibleConstructorReturn3.default)(this, (getbtc.__proto__ || (0, _getPrototypeOf2.default)(getbtc)).apply(this, arguments));
    }

    (0, _createClass3.default)(getbtc, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend((0, _get3.default)(getbtc.prototype.__proto__ || (0, _getPrototypeOf2.default)(getbtc.prototype), 'describe', this).call(this), {
                'id': 'getbtc',
                'name': 'GetBTC',
                'countries': ['VC', 'RU'], // Saint Vincent and the Grenadines, Russia, CIS
                'rateLimit': 1000,
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/33801902-03c43462-dd7b-11e7-992e-077e4cd015b9.jpg',
                    'api': 'https://getbtc.org/api',
                    'www': 'https://getbtc.org',
                    'doc': 'https://getbtc.org/api-docs.php'
                },
                'markets': {
                    'BTC/EUR': { 'id': 'EUR', 'symbol': 'BTC/EUR', 'base': 'BTC', 'quote': 'EUR', 'precision': { 'amount': 8, 'price': 8 }, 'lot': 0.00000001, 'limits': { 'amount': { 'min': 0.00000001, 'max': undefined }, 'price': { 'min': 0.00000001, 'max': undefined } } },
                    'BTC/RUB': { 'id': 'RUB', 'symbol': 'BTC/RUB', 'base': 'BTC', 'quote': 'RUB', 'precision': { 'amount': 8, 'price': 8 }, 'lot': 0.00000001, 'limits': { 'amount': { 'min': 0.00000001, 'max': undefined }, 'price': { 'min': 0.00000001, 'max': undefined } } },
                    'BTC/USD': { 'id': 'USD', 'symbol': 'BTC/USD', 'base': 'BTC', 'quote': 'USD', 'precision': { 'amount': 8, 'price': 8 }, 'lot': 0.00000001, 'limits': { 'amount': { 'min': 0.00000001, 'max': undefined }, 'price': { 'min': 0.00000001, 'max': undefined } } }
                },
                'fees': {
                    'trading': {
                        'taker': 0.20 / 100,
                        'maker': 0.20 / 100
                    }
                }
            });
        }
    }]);
    return getbtc;
}(_1btcxe);