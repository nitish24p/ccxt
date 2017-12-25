"use strict";

// ---------------------------------------------------------------------------

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

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

var bittrex = require('./bittrex.js');

// ---------------------------------------------------------------------------

module.exports = function (_bittrex) {
    (0, _inherits3.default)(bleutrade, _bittrex);

    function bleutrade() {
        (0, _classCallCheck3.default)(this, bleutrade);
        return (0, _possibleConstructorReturn3.default)(this, (bleutrade.__proto__ || (0, _getPrototypeOf2.default)(bleutrade)).apply(this, arguments));
    }

    (0, _createClass3.default)(bleutrade, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend((0, _get3.default)(bleutrade.prototype.__proto__ || (0, _getPrototypeOf2.default)(bleutrade.prototype), 'describe', this).call(this), {
                'id': 'bleutrade',
                'name': 'Bleutrade',
                'countries': 'BR', // Brazil
                'rateLimit': 1000,
                'version': 'v2',
                'hasCORS': true,
                'hasFetchTickers': true,
                'hasFetchOHLCV': false,
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/30303000-b602dbe6-976d-11e7-956d-36c5049c01e7.jpg',
                    'api': {
                        'public': 'https://bleutrade.com/api',
                        'account': 'https://bleutrade.com/api',
                        'market': 'https://bleutrade.com/api'
                    },
                    'www': 'https://bleutrade.com',
                    'doc': 'https://bleutrade.com/help/API'
                }
            });
        }
    }, {
        key: 'fetchMarkets',
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                var markets, result, p, market, id, base, quote, symbol, precision, active;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.publicGetMarkets();

                            case 2:
                                markets = _context.sent;
                                result = [];

                                for (p = 0; p < markets['result'].length; p++) {
                                    market = markets['result'][p];
                                    id = market['MarketName'];
                                    base = market['MarketCurrency'];
                                    quote = market['BaseCurrency'];

                                    base = this.commonCurrencyCode(base);
                                    quote = this.commonCurrencyCode(quote);
                                    symbol = base + '/' + quote;
                                    precision = {
                                        'amount': 8,
                                        'price': 8
                                    };
                                    active = market['IsActive'];

                                    result.push(this.extend(this.fees['trading'], {
                                        'id': id,
                                        'symbol': symbol,
                                        'base': base,
                                        'quote': quote,
                                        'active': active,
                                        'info': market,
                                        'lot': Math.pow(10, -precision['amount']),
                                        'precision': precision,
                                        'limits': {
                                            'amount': {
                                                'min': market['MinTradeSize'],
                                                'max': undefined
                                            },
                                            'price': {
                                                'min': undefined,
                                                'max': undefined
                                            },
                                            'cost': {
                                                'min': 0,
                                                'max': undefined
                                            }
                                        }
                                    }));
                                }
                                return _context.abrupt('return', result);

                            case 6:
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
    }, {
        key: 'fetchOrderBook',
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var response, orderbook;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context2.next = 4;
                                return this.publicGetOrderbook(this.extend({
                                    'market': this.marketId(symbol),
                                    'type': 'ALL',
                                    'depth': 50
                                }, params));

                            case 4:
                                response = _context2.sent;
                                orderbook = response['result'];
                                return _context2.abrupt('return', this.parseOrderBook(orderbook, undefined, 'buy', 'sell', 'Rate', 'Quantity'));

                            case 7:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function fetchOrderBook(_x2) {
                return _ref2.apply(this, arguments);
            }

            return fetchOrderBook;
        }()
    }]);
    return bleutrade;
}(bittrex);