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

var okcoinusd = require('./okcoinusd.js');

// ---------------------------------------------------------------------------

module.exports = function (_okcoinusd) {
    (0, _inherits3.default)(okex, _okcoinusd);

    function okex() {
        (0, _classCallCheck3.default)(this, okex);
        return (0, _possibleConstructorReturn3.default)(this, (okex.__proto__ || (0, _getPrototypeOf2.default)(okex)).apply(this, arguments));
    }

    (0, _createClass3.default)(okex, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend((0, _get3.default)(okex.prototype.__proto__ || (0, _getPrototypeOf2.default)(okex.prototype), 'describe', this).call(this), {
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