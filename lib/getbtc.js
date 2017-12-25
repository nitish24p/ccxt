"use strict";

// ---------------------------------------------------------------------------

import _Object$getPrototypeOf from 'babel-runtime/core-js/object/get-prototype-of';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _get from 'babel-runtime/helpers/get';
import _inherits from 'babel-runtime/helpers/inherits';
var _1btcxe = require('./_1btcxe.js');

// ---------------------------------------------------------------------------

module.exports = function (_btcxe) {
    _inherits(getbtc, _btcxe);

    function getbtc() {
        _classCallCheck(this, getbtc);

        return _possibleConstructorReturn(this, (getbtc.__proto__ || _Object$getPrototypeOf(getbtc)).apply(this, arguments));
    }

    _createClass(getbtc, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend(_get(getbtc.prototype.__proto__ || _Object$getPrototypeOf(getbtc.prototype), 'describe', this).call(this), {
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