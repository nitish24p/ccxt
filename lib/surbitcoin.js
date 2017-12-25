"use strict";

// ---------------------------------------------------------------------------

import _Object$getPrototypeOf from 'babel-runtime/core-js/object/get-prototype-of';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _get from 'babel-runtime/helpers/get';
import _inherits from 'babel-runtime/helpers/inherits';
var foxbit = require('./foxbit.js');

// ---------------------------------------------------------------------------

module.exports = function (_foxbit) {
    _inherits(surbitcoin, _foxbit);

    function surbitcoin() {
        _classCallCheck(this, surbitcoin);

        return _possibleConstructorReturn(this, (surbitcoin.__proto__ || _Object$getPrototypeOf(surbitcoin)).apply(this, arguments));
    }

    _createClass(surbitcoin, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend(_get(surbitcoin.prototype.__proto__ || _Object$getPrototypeOf(surbitcoin.prototype), 'describe', this).call(this), {
                'id': 'surbitcoin',
                'name': 'SurBitcoin',
                'countries': 'VE',
                'hasCORS': false,
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/27991511-f0a50194-6481-11e7-99b5-8f02932424cc.jpg',
                    'api': {
                        'public': 'https://api.blinktrade.com/api',
                        'private': 'https://api.blinktrade.com/tapi'
                    },
                    'www': 'https://surbitcoin.com',
                    'doc': 'https://blinktrade.com/docs'
                }
            });
        }
    }]);

    return surbitcoin;
}(foxbit);