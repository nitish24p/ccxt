"use strict";

// ---------------------------------------------------------------------------

import _Object$getPrototypeOf from 'babel-runtime/core-js/object/get-prototype-of';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _get from 'babel-runtime/helpers/get';
import _inherits from 'babel-runtime/helpers/inherits';
var bter = require('./bter.js');

// ---------------------------------------------------------------------------

module.exports = function (_bter) {
    _inherits(gateio, _bter);

    function gateio() {
        _classCallCheck(this, gateio);

        return _possibleConstructorReturn(this, (gateio.__proto__ || _Object$getPrototypeOf(gateio)).apply(this, arguments));
    }

    _createClass(gateio, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend(_get(gateio.prototype.__proto__ || _Object$getPrototypeOf(gateio.prototype), 'describe', this).call(this), {
                'id': 'gateio',
                'name': 'Gate.io',
                'countries': 'CN',
                'rateLimit': 1000,
                'hasCORS': false,
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/31784029-0313c702-b509-11e7-9ccc-bc0da6a0e435.jpg',
                    'api': {
                        'public': 'https://data.gate.io/api',
                        'private': 'https://data.gate.io/api'
                    },
                    'www': 'https://gate.io/',
                    'doc': 'https://gate.io/api2'
                }
            });
        }
    }]);

    return gateio;
}(bter);