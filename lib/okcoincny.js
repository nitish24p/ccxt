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

var okcoinusd = require('./okcoinusd.js');

// ---------------------------------------------------------------------------

module.exports = function (_okcoinusd) {
    (0, _inherits3.default)(okcoincny, _okcoinusd);

    function okcoincny() {
        (0, _classCallCheck3.default)(this, okcoincny);
        return (0, _possibleConstructorReturn3.default)(this, (okcoincny.__proto__ || (0, _getPrototypeOf2.default)(okcoincny)).apply(this, arguments));
    }

    (0, _createClass3.default)(okcoincny, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend((0, _get3.default)(okcoincny.prototype.__proto__ || (0, _getPrototypeOf2.default)(okcoincny.prototype), 'describe', this).call(this), {
                'id': 'okcoincny',
                'name': 'OKCoin CNY',
                'countries': 'CN',
                'hasCORS': false,
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/27766792-8be9157a-5ee5-11e7-926c-6d69b8d3378d.jpg',
                    'api': {
                        'web': 'https://www.okcoin.cn',
                        'public': 'https://www.okcoin.cn/pai',
                        'private': 'https://www.okcoin.cn/api'
                    },
                    'www': 'https://www.okcoin.cn',
                    'doc': 'https://www.okcoin.cn/rest_getStarted.html'
                },
                'markets': {
                    'BTC/CNY': { 'id': 'btc_cny', 'symbol': 'BTC/CNY', 'base': 'BTC', 'quote': 'CNY', 'type': 'spot', 'spot': true, 'future': false },
                    'LTC/CNY': { 'id': 'ltc_cny', 'symbol': 'LTC/CNY', 'base': 'LTC', 'quote': 'CNY', 'type': 'spot', 'spot': true, 'future': false },
                    'ETH/CNY': { 'id': 'eth_cny', 'symbol': 'ETH/CNY', 'base': 'ETH', 'quote': 'CNY', 'type': 'spot', 'spot': true, 'future': false },
                    'ETC/CNY': { 'id': 'etc_cny', 'symbol': 'ETC/CNY', 'base': 'ETC', 'quote': 'CNY', 'type': 'spot', 'spot': true, 'future': false },
                    'BCH/CNY': { 'id': 'bcc_cny', 'symbol': 'BCH/CNY', 'base': 'BCH', 'quote': 'CNY', 'type': 'spot', 'spot': true, 'future': false }
                }
            });
        }
    }]);
    return okcoincny;
}(okcoinusd);