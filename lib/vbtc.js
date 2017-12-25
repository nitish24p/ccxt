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

var foxbit = require('./foxbit.js');

// ---------------------------------------------------------------------------

module.exports = function (_foxbit) {
    (0, _inherits3.default)(vbtc, _foxbit);

    function vbtc() {
        (0, _classCallCheck3.default)(this, vbtc);
        return (0, _possibleConstructorReturn3.default)(this, (vbtc.__proto__ || (0, _getPrototypeOf2.default)(vbtc)).apply(this, arguments));
    }

    (0, _createClass3.default)(vbtc, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend((0, _get3.default)(vbtc.prototype.__proto__ || (0, _getPrototypeOf2.default)(vbtc.prototype), 'describe', this).call(this), {
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