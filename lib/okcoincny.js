"use strict";

// ---------------------------------------------------------------------------

import _Object$getPrototypeOf from 'babel-runtime/core-js/object/get-prototype-of';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _get from 'babel-runtime/helpers/get';
import _inherits from 'babel-runtime/helpers/inherits';
var okcoinusd = require('./okcoinusd.js');

// ---------------------------------------------------------------------------

module.exports = function (_okcoinusd) {
    _inherits(okcoincny, _okcoinusd);

    function okcoincny() {
        _classCallCheck(this, okcoincny);

        return _possibleConstructorReturn(this, (okcoincny.__proto__ || _Object$getPrototypeOf(okcoincny)).apply(this, arguments));
    }

    _createClass(okcoincny, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend(_get(okcoincny.prototype.__proto__ || _Object$getPrototypeOf(okcoincny.prototype), 'describe', this).call(this), {
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