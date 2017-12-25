"use strict";

// ---------------------------------------------------------------------------

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

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

var btcbox = require('./btcbox.js');

// ---------------------------------------------------------------------------

module.exports = function (_btcbox) {
    (0, _inherits3.default)(jubi, _btcbox);

    function jubi() {
        (0, _classCallCheck3.default)(this, jubi);
        return (0, _possibleConstructorReturn3.default)(this, (jubi.__proto__ || (0, _getPrototypeOf2.default)(jubi)).apply(this, arguments));
    }

    (0, _createClass3.default)(jubi, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend((0, _get3.default)(jubi.prototype.__proto__ || (0, _getPrototypeOf2.default)(jubi.prototype), 'describe', this).call(this), {
                'id': 'jubi',
                'name': 'jubi.com',
                'countries': 'CN',
                'rateLimit': 1500,
                'version': 'v1',
                'hasCORS': false,
                'hasFetchTickers': true,
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/27766581-9d397d9a-5edd-11e7-8fb9-5d8236c0e692.jpg',
                    'api': 'https://www.jubi.com/api',
                    'www': 'https://www.jubi.com',
                    'doc': 'https://www.jubi.com/help/api.html'
                }
            });
        }
    }, {
        key: 'fetchMarkets',
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                var markets, keys, result, p, id, base, quote, symbol;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.publicGetAllticker();

                            case 2:
                                markets = _context.sent;
                                keys = (0, _keys2.default)(markets);
                                result = [];

                                for (p = 0; p < keys.length; p++) {
                                    id = keys[p];
                                    base = id.toUpperCase();
                                    quote = 'CNY'; // todo

                                    symbol = base + '/' + quote;

                                    base = this.commonCurrencyCode(base);
                                    quote = this.commonCurrencyCode(quote);
                                    result.push({
                                        'id': id,
                                        'symbol': symbol,
                                        'base': base,
                                        'quote': quote,
                                        'info': id
                                    });
                                }
                                return _context.abrupt('return', result);

                            case 7:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function fetchMarkets() {
                return _ref.apply(this, arguments);
            }

            return fetchMarkets;
        }()
    }]);
    return jubi;
}(btcbox);