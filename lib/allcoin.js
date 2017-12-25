"use strict";

//  ---------------------------------------------------------------------------

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

var okcoinusd = require('./okcoinusd.js');

//  ---------------------------------------------------------------------------

module.exports = function (_okcoinusd) {
    (0, _inherits3.default)(allcoin, _okcoinusd);

    function allcoin() {
        (0, _classCallCheck3.default)(this, allcoin);
        return (0, _possibleConstructorReturn3.default)(this, (allcoin.__proto__ || (0, _getPrototypeOf2.default)(allcoin)).apply(this, arguments));
    }

    (0, _createClass3.default)(allcoin, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend((0, _get3.default)(allcoin.prototype.__proto__ || (0, _getPrototypeOf2.default)(allcoin.prototype), 'describe', this).call(this), {
                'id': 'allcoin',
                'name': 'Allcoin',
                'countries': 'CA',
                'hasCORS': false,
                'extension': '',
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/31561809-c316b37c-b061-11e7-8d5a-b547b4d730eb.jpg',
                    'api': {
                        'web': 'https://allcoin.com',
                        'public': 'https://api.allcoin.com/api',
                        'private': 'https://api.allcoin.com/api'
                    },
                    'www': 'https://allcoin.com',
                    'doc': 'https://allcoin.com/About/APIReference'
                },
                'api': {
                    'web': {
                        'get': ['marketoverviews/']
                    },
                    'public': {
                        'get': ['depth', 'kline', 'ticker', 'trades']
                    },
                    'private': {
                        'post': ['batch_trade', 'cancel_order', 'order_history', 'order_info', 'orders_info', 'repayment', 'trade', 'trade_history', 'userinfo']
                    }
                },
                'markets': undefined
            });
        }
    }, {
        key: 'fetchMarkets',
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                var currencies, result, i, currency, response, markets, k, market, base, quote, id, symbol;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                // todo rewrite for https://www.allcoin.com/Home/MarketOverViewDetail/
                                currencies = ['BTC', 'ETH', 'USD', 'QTUM', 'CNET', 'CK.USD'];
                                result = [];
                                i = 0;

                            case 3:
                                if (!(i < currencies.length)) {
                                    _context.next = 13;
                                    break;
                                }

                                currency = currencies[i];
                                _context.next = 7;
                                return this.webGetMarketoverviews({
                                    'type': 'full',
                                    'secondary': currency
                                });

                            case 7:
                                response = _context.sent;
                                markets = response['Markets'];

                                for (k = 0; k < markets.length; k++) {
                                    market = markets[k];
                                    base = market['Primary'];
                                    quote = market['Secondary'];
                                    id = base.toLowerCase() + '_' + quote.toLowerCase();
                                    symbol = base + '/' + quote;

                                    result.push({
                                        'id': id,
                                        'symbol': symbol,
                                        'base': base,
                                        'quote': quote,
                                        'type': 'spot',
                                        'spot': true,
                                        'future': false,
                                        'info': market
                                    });
                                }

                            case 10:
                                i++;
                                _context.next = 3;
                                break;

                            case 13:
                                return _context.abrupt('return', result);

                            case 14:
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
        key: 'parseOrderStatus',
        value: function parseOrderStatus(status) {
            if (status == -1) return 'canceled';
            if (status == 0) return 'open';
            if (status == 1) return 'open'; // partially filled
            if (status == 2) return 'closed';
            if (status == 10) return 'canceled';
            return status;
        }
    }, {
        key: 'getCreateDateField',
        value: function getCreateDateField() {
            // allcoin typo create_data instead of create_date
            return 'create_data';
        }
    }, {
        key: 'getOrdersField',
        value: function getOrdersField() {
            // allcoin typo order instead of orders (expected based on their API docs)
            return 'order';
        }
    }]);
    return allcoin;
}(okcoinusd);