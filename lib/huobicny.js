"use strict";

// ---------------------------------------------------------------------------

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var huobipro = require('./huobipro.js');

// ---------------------------------------------------------------------------

module.exports = function (_huobipro) {
    (0, _inherits3.default)(huobicny, _huobipro);

    function huobicny() {
        (0, _classCallCheck3.default)(this, huobicny);
        return (0, _possibleConstructorReturn3.default)(this, (huobicny.__proto__ || (0, _getPrototypeOf2.default)(huobicny)).apply(this, arguments));
    }

    (0, _createClass3.default)(huobicny, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend((0, _get3.default)(huobicny.prototype.__proto__ || (0, _getPrototypeOf2.default)(huobicny.prototype), 'describe', this).call(this), {
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