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

var bter = require('./bter.js');

// ---------------------------------------------------------------------------

module.exports = function (_bter) {
    (0, _inherits3.default)(gateio, _bter);

    function gateio() {
        (0, _classCallCheck3.default)(this, gateio);
        return (0, _possibleConstructorReturn3.default)(this, (gateio.__proto__ || (0, _getPrototypeOf2.default)(gateio)).apply(this, arguments));
    }

    (0, _createClass3.default)(gateio, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend((0, _get3.default)(gateio.prototype.__proto__ || (0, _getPrototypeOf2.default)(gateio.prototype), 'describe', this).call(this), {
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