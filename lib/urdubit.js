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
    _inherits(urdubit, _foxbit);

    function urdubit() {
        _classCallCheck(this, urdubit);

        return _possibleConstructorReturn(this, (urdubit.__proto__ || _Object$getPrototypeOf(urdubit)).apply(this, arguments));
    }

    _createClass(urdubit, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend(_get(urdubit.prototype.__proto__ || _Object$getPrototypeOf(urdubit.prototype), 'describe', this).call(this), {
                'id': 'urdubit',
                'name': 'UrduBit',
                'countries': 'PK',
                'hasCORS': false,
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/27991453-156bf3ae-6480-11e7-82eb-7295fe1b5bb4.jpg',
                    'api': {
                        'public': 'https://api.blinktrade.com/api',
                        'private': 'https://api.blinktrade.com/tapi'
                    },
                    'www': 'https://urdubit.com',
                    'doc': 'https://blinktrade.com/docs'
                }
            });
        }
    }]);

    return urdubit;
}(foxbit);