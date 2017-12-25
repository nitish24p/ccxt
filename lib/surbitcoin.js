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
    (0, _inherits3.default)(surbitcoin, _foxbit);

    function surbitcoin() {
        (0, _classCallCheck3.default)(this, surbitcoin);
        return (0, _possibleConstructorReturn3.default)(this, (surbitcoin.__proto__ || (0, _getPrototypeOf2.default)(surbitcoin)).apply(this, arguments));
    }

    (0, _createClass3.default)(surbitcoin, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend((0, _get3.default)(surbitcoin.prototype.__proto__ || (0, _getPrototypeOf2.default)(surbitcoin.prototype), 'describe', this).call(this), {
                'id': 'surbitcoin',
                'name': 'SurBitcoin',
                'countries': 'VE',
                'hasCORS': false,
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/27991511-f0a50194-6481-11e7-99b5-8f02932424cc.jpg',
                    'api': {
                        'public': 'https://api.blinktrade.com/api',
                        'private': 'https://api.blinktrade.com/tapi'
                    },
                    'www': 'https://surbitcoin.com',
                    'doc': 'https://blinktrade.com/docs'
                }
            });
        }
    }]);
    return surbitcoin;
}(foxbit);