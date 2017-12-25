"use strict";

// ---------------------------------------------------------------------------

import _Object$getPrototypeOf from 'babel-runtime/core-js/object/get-prototype-of';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _get from 'babel-runtime/helpers/get';
import _inherits from 'babel-runtime/helpers/inherits';
var qryptos = require('./qryptos.js');

// ---------------------------------------------------------------------------

module.exports = function (_qryptos) {
    _inherits(quoine, _qryptos);

    function quoine() {
        _classCallCheck(this, quoine);

        return _possibleConstructorReturn(this, (quoine.__proto__ || _Object$getPrototypeOf(quoine)).apply(this, arguments));
    }

    _createClass(quoine, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend(_get(quoine.prototype.__proto__ || _Object$getPrototypeOf(quoine.prototype), 'describe', this).call(this), {
                'id': 'quoine',
                'name': 'QUOINE',
                'countries': ['JP', 'SG', 'VN'],
                'version': '2',
                'rateLimit': 1000,
                'hasFetchTickers': true,
                'hasCORS': false,
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/27766844-9615a4e8-5ee8-11e7-8814-fcd004db8cdd.jpg',
                    'api': 'https://api.quoine.com',
                    'www': 'https://www.quoine.com',
                    'doc': 'https://developers.quoine.com'
                }
            });
        }
    }]);

    return quoine;
}(qryptos);