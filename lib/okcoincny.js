"use strict";

// ---------------------------------------------------------------------------

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var okcoinusd = require('./okcoinusd.js');

// ---------------------------------------------------------------------------

module.exports = function (_okcoinusd) {
    _inherits(okcoincny, _okcoinusd);

    function okcoincny() {
        _classCallCheck(this, okcoincny);

        return _possibleConstructorReturn(this, (okcoincny.__proto__ || Object.getPrototypeOf(okcoincny)).apply(this, arguments));
    }

    _createClass(okcoincny, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend(_get(okcoincny.prototype.__proto__ || Object.getPrototypeOf(okcoincny.prototype), 'describe', this).call(this), {
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