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

var qryptos = require('./qryptos.js');

// ---------------------------------------------------------------------------

module.exports = function (_qryptos) {
    (0, _inherits3.default)(quoine, _qryptos);

    function quoine() {
        (0, _classCallCheck3.default)(this, quoine);
        return (0, _possibleConstructorReturn3.default)(this, (quoine.__proto__ || (0, _getPrototypeOf2.default)(quoine)).apply(this, arguments));
    }

    (0, _createClass3.default)(quoine, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend((0, _get3.default)(quoine.prototype.__proto__ || (0, _getPrototypeOf2.default)(quoine.prototype), 'describe', this).call(this), {
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