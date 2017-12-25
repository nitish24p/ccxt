"use strict";

// ---------------------------------------------------------------------------

import _Object$getPrototypeOf from 'babel-runtime/core-js/object/get-prototype-of';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _get from 'babel-runtime/helpers/get';
import _inherits from 'babel-runtime/helpers/inherits';
var okcoinusd = require('./okcoinusd.js');

// ---------------------------------------------------------------------------

module.exports = function (_okcoinusd) {
    _inherits(okex, _okcoinusd);

    function okex() {
        _classCallCheck(this, okex);

        return _possibleConstructorReturn(this, (okex.__proto__ || _Object$getPrototypeOf(okex)).apply(this, arguments));
    }

    _createClass(okex, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend(_get(okex.prototype.__proto__ || _Object$getPrototypeOf(okex.prototype), 'describe', this).call(this), {
                'id': 'okex',
                'name': 'OKEX',
                'countries': ['CN', 'US'],
                'hasCORS': false,
                'hasFutureMarkets': true,
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/32552768-0d6dd3c6-c4a6-11e7-90f8-c043b64756a7.jpg',
                    'api': {
                        'web': 'https://www.okex.com/v2',
                        'public': 'https://www.okex.com/api',
                        'private': 'https://www.okex.com/api'
                    },
                    'www': 'https://www.okex.com',
                    'doc': 'https://www.okex.com/rest_getStarted.html'
                }
            });
        }
    }]);

    return okex;
}(okcoinusd);