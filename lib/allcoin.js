"use strict";

//  ---------------------------------------------------------------------------

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var okcoinusd = require('./okcoinusd.js');

//  ---------------------------------------------------------------------------

module.exports = function (_okcoinusd) {
    _inherits(allcoin, _okcoinusd);

    function allcoin() {
        _classCallCheck(this, allcoin);

        return _possibleConstructorReturn(this, (allcoin.__proto__ || Object.getPrototypeOf(allcoin)).apply(this, arguments));
    }

    _createClass(allcoin, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend(_get(allcoin.prototype.__proto__ || Object.getPrototypeOf(allcoin.prototype), 'describe', this).call(this), {
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
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                var currencies, result, i, currency, response, markets, k, market, base, quote, id, symbol;
                return regeneratorRuntime.wrap(function _callee$(_context) {
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