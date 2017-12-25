"use strict";

// ---------------------------------------------------------------------------

import _Object$getPrototypeOf from 'babel-runtime/core-js/object/get-prototype-of';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _get from 'babel-runtime/helpers/get';
import _inherits from 'babel-runtime/helpers/inherits';
var btcturk = require('./btcturk.js');

// ---------------------------------------------------------------------------

module.exports = function (_btcturk) {
    _inherits(btcexchange, _btcturk);

    function btcexchange() {
        _classCallCheck(this, btcexchange);

        return _possibleConstructorReturn(this, (btcexchange.__proto__ || _Object$getPrototypeOf(btcexchange)).apply(this, arguments));
    }

    _createClass(btcexchange, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend(_get(btcexchange.prototype.__proto__ || _Object$getPrototypeOf(btcexchange.prototype), 'describe', this).call(this), {
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