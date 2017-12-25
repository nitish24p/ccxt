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

var fybse = require('./fybse.js');

// ---------------------------------------------------------------------------

module.exports = function (_fybse) {
    (0, _inherits3.default)(fybsg, _fybse);

    function fybsg() {
        (0, _classCallCheck3.default)(this, fybsg);
        return (0, _possibleConstructorReturn3.default)(this, (fybsg.__proto__ || (0, _getPrototypeOf2.default)(fybsg)).apply(this, arguments));
    }

    (0, _createClass3.default)(fybsg, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend((0, _get3.default)(fybsg.prototype.__proto__ || (0, _getPrototypeOf2.default)(fybsg.prototype), 'describe', this).call(this), {
                'id': 'fybsg',
                'name': 'FYB-SG',
                'countries': 'SG', // Singapore
                'hasCORS': false,
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/27766513-3364d56a-5edb-11e7-9e6b-d5898bb89c81.jpg',
                    'api': 'https://www.fybsg.com/api/SGD',
                    'www': 'https://www.fybsg.com',
                    'doc': 'http://docs.fyb.apiary.io'
                },
                'markets': {
                    'BTC/SGD': { 'id': 'SGD', 'symbol': 'BTC/SGD', 'base': 'BTC', 'quote': 'SGD' }
                }
            });
        }
    }]);
    return fybsg;
}(fybse);