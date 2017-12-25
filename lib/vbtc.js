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
    _inherits(vbtc, _foxbit);

    function vbtc() {
        _classCallCheck(this, vbtc);

        return _possibleConstructorReturn(this, (vbtc.__proto__ || _Object$getPrototypeOf(vbtc)).apply(this, arguments));
    }

    _createClass(vbtc, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend(_get(vbtc.prototype.__proto__ || _Object$getPrototypeOf(vbtc.prototype), 'describe', this).call(this), {
                'id': 'vbtc',
                'name': 'VBTC',
                'countries': 'VN',
                'hasCORS': false,
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/27991481-1f53d1d8-6481-11e7-884e-21d17e7939db.jpg',
                    'api': {
                        'public': 'https://api.blinktrade.com/api',
                        'private': 'https://api.blinktrade.com/tapi'
                    },
                    'www': 'https://vbtc.exchange',
                    'doc': 'https://blinktrade.com/docs'
                }
            });
        }
    }]);

    return vbtc;
}(foxbit);