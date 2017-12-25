"use strict";

// ---------------------------------------------------------------------------

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _1btcxe = require('./_1btcxe.js');

// ---------------------------------------------------------------------------

module.exports = function (_btcxe) {
    _inherits(getbtc, _btcxe);

    function getbtc() {
        _classCallCheck(this, getbtc);

        return _possibleConstructorReturn(this, (getbtc.__proto__ || Object.getPrototypeOf(getbtc)).apply(this, arguments));
    }

    _createClass(getbtc, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend(_get(getbtc.prototype.__proto__ || Object.getPrototypeOf(getbtc.prototype), 'describe', this).call(this), {
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