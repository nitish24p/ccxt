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

var btcturk = require('./btcturk.js');

// ---------------------------------------------------------------------------

module.exports = function (_btcturk) {
    (0, _inherits3.default)(btcexchange, _btcturk);

    function btcexchange() {
        (0, _classCallCheck3.default)(this, btcexchange);
        return (0, _possibleConstructorReturn3.default)(this, (btcexchange.__proto__ || (0, _getPrototypeOf2.default)(btcexchange)).apply(this, arguments));
    }

    (0, _createClass3.default)(btcexchange, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend((0, _get3.default)(btcexchange.prototype.__proto__ || (0, _getPrototypeOf2.default)(btcexchange.prototype), 'describe', this).call(this), {
                'id': 'btcexchange',
                'name': 'BTCExchange',
                'countries': 'PH', // Philippines
                'rateLimit': 1500,
                'hasCORS': false,
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/27993052-4c92911a-64aa-11e7-96d8-ec6ac3435757.jpg',
                    'api': 'https://www.btcexchange.ph/api',
                    'www': 'https://www.btcexchange.ph',
                    'doc': 'https://github.com/BTCTrader/broker-api-docs'
                },
                'markets': {
                    'BTC/PHP': { 'id': 'BTC/PHP', 'symbol': 'BTC/PHP', 'base': 'BTC', 'quote': 'PHP' }
                }
            });
        }
    }]);
    return btcexchange;
}(btcturk);