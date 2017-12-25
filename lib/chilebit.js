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
    _inherits(chilebit, _foxbit);

    function chilebit() {
        _classCallCheck(this, chilebit);

        return _possibleConstructorReturn(this, (chilebit.__proto__ || _Object$getPrototypeOf(chilebit)).apply(this, arguments));
    }

    _createClass(chilebit, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend(_get(chilebit.prototype.__proto__ || _Object$getPrototypeOf(chilebit.prototype), 'describe', this).call(this), {
                'id': 'chilebit',
                'name': 'ChileBit',
                'countries': 'CL',
                'hasCORS': false,
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/27991414-1298f0d8-647f-11e7-9c40-d56409266336.jpg',
                    'api': {
                        'public': 'https://api.blinktrade.com/api',
                        'private': 'https://api.blinktrade.com/tapi'
                    },
                    'www': 'https://chilebit.net',
                    'doc': 'https://blinktrade.com/docs'
                }
            });
        }
    }]);

    return chilebit;
}(foxbit);