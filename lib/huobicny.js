"use strict";

// ---------------------------------------------------------------------------

import _Object$getPrototypeOf from 'babel-runtime/core-js/object/get-prototype-of';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _get from 'babel-runtime/helpers/get';
import _inherits from 'babel-runtime/helpers/inherits';
var huobipro = require('./huobipro.js');

// ---------------------------------------------------------------------------

module.exports = function (_huobipro) {
    _inherits(huobicny, _huobipro);

    function huobicny() {
        _classCallCheck(this, huobicny);

        return _possibleConstructorReturn(this, (huobicny.__proto__ || _Object$getPrototypeOf(huobicny)).apply(this, arguments));
    }

    _createClass(huobicny, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend(_get(huobicny.prototype.__proto__ || _Object$getPrototypeOf(huobicny.prototype), 'describe', this).call(this), {
                'id': 'huobicny',
                'name': 'Huobi CNY',
                'hostname': 'be.huobi.com',
                'hasCORS': false,
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/27766569-15aa7b9a-5edd-11e7-9e7f-44791f4ee49c.jpg',
                    'api': 'https://be.huobi.com',
                    'www': 'https://www.huobi.com',
                    'doc': 'https://github.com/huobiapi/API_Docs/wiki/REST_api_reference'
                }
            });
        }
    }]);

    return huobicny;
}(huobipro);