"use strict";

//  ---------------------------------------------------------------------------

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

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

var Exchange = require('./base/Exchange');

//  ---------------------------------------------------------------------------

module.exports = function (_Exchange) {
    (0, _inherits3.default)(independentreserve, _Exchange);

    function independentreserve() {
        (0, _classCallCheck3.default)(this, independentreserve);
        return (0, _possibleConstructorReturn3.default)(this, (independentreserve.__proto__ || (0, _getPrototypeOf2.default)(independentreserve)).apply(this, arguments));
    }

    (0, _createClass3.default)(independentreserve, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend((0, _get3.default)(independentreserve.prototype.__proto__ || (0, _getPrototypeOf2.default)(independentreserve.prototype), 'describe', this).call(this), {
                'id': 'independentreserve',
                'name': 'Independent Reserve',
                'countries': ['AU', 'NZ'], // Australia, New Zealand
                'rateLimit': 1000,
                'hasCORS': false,
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/30521662-cf3f477c-9bcb-11e7-89bc-d1ac85012eda.jpg',
                    'api': {
                        'public': 'https://api.independentreserve.com/Public',
                        'private': 'https://api.independentreserve.com/Private'
                    },
                    'www': 'https://www.independentreserve.com',
                    'doc': 'https://www.independentreserve.com/API'
                },
                'api': {
                    'public': {
                        'get': ['GetValidPrimaryCurrencyCodes', 'GetValidSecondaryCurrencyCodes', 'GetValidLimitOrderTypes', 'GetValidMarketOrderTypes', 'GetValidOrderTypes', 'GetValidTransactionTypes', 'GetMarketSummary', 'GetOrderBook', 'GetTradeHistorySummary', 'GetRecentTrades', 'GetFxRates']
                    },
                    'private': {
                        'post': ['PlaceLimitOrder', 'PlaceMarketOrder', 'CancelOrder', 'GetOpenOrders', 'GetClosedOrders', 'GetClosedFilledOrders', 'GetOrderDetails', 'GetAccounts', 'GetTransactions', 'GetDigitalCurrencyDepositAddress', 'GetDigitalCurrencyDepositAddresses', 'SynchDigitalCurrencyDepositAddressWithBlockchain', 'WithdrawDigitalCurrency', 'RequestFiatWithdrawal', 'GetTrades']
                    }
                }
            });
        }
    }, {
        key: 'fetchMarkets',
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                var baseCurrencies, quoteCurrencies, result, i, baseId, baseIdUppercase, base, j, quoteId, quoteIdUppercase, quote, id, symbol, taker, maker;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.publicGetValidPrimaryCurrencyCodes();

                            case 2:
                                baseCurrencies = _context.sent;
                                _context.next = 5;
                                return this.publicGetValidSecondaryCurrencyCodes();

                            case 5:
                                quoteCurrencies = _context.sent;
                                result = [];

                                for (i = 0; i < baseCurrencies.length; i++) {
                                    baseId = baseCurrencies[i];
                                    baseIdUppercase = baseId.toUpperCase();
                                    base = this.commonCurrencyCode(baseIdUppercase);

                                    for (j = 0; j < quoteCurrencies.length; j++) {
                                        quoteId = quoteCurrencies[j];
                                        quoteIdUppercase = quoteId.toUpperCase();
                                        quote = this.commonCurrencyCode(quoteIdUppercase);
                                        id = baseId + '/' + quoteId;
                                        symbol = base + '/' + quote;
                                        taker = 0.5 / 100;
                                        maker = 0.5 / 100;

                                        result.push({
                                            'id': id,
                                            'symbol': symbol,
                                            'base': base,
                                            'quote': quote,
                                            'baseId': baseId,
                                            'quoteId': quoteId,
                                            'taker': taker,
                                            'maker': maker,
                                            'info': id
                                        });
                                    }
                                }
                                return _context.abrupt('return', result);

                            case 9:
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
        key: 'fetchBalance',
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
                var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var balances, result, i, balance, currencyCode, uppercase, currency, account;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context2.next = 4;
                                return this.privatePostGetAccounts();

                            case 4:
                                balances = _context2.sent;
                                result = { 'info': balances };

                                for (i = 0; i < balances.length; i++) {
                                    balance = balances[i];
                                    currencyCode = balance['CurrencyCode'];
                                    uppercase = currencyCode.toUpperCase();
                                    currency = this.commonCurrencyCode(uppercase);
                                    account = this.account();

                                    account['free'] = balance['AvailableBalance'];
                                    account['total'] = balance['TotalBalance'];
                                    account['used'] = account['total'] - account['free'];
                                    result[currency] = account;
                                }
                                return _context2.abrupt('return', this.parseBalance(result));

                            case 8:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function fetchBalance() {
                return _ref2.apply(this, arguments);
            }

            return fetchBalance;
        }()
    }, {
        key: 'fetchOrderBook',
        value: function () {
            var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var market, response, timestamp;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                _context3.next = 5;
                                return this.publicGetOrderBook(this.extend({
                                    'primaryCurrencyCode': market['baseId'],
                                    'secondaryCurrencyCode': market['quoteId']
                                }, params));

                            case 5:
                                response = _context3.sent;
                                timestamp = this.parse8601(response['CreatedTimestampUtc']);
                                return _context3.abrupt('return', this.parseOrderBook(response, timestamp, 'BuyOrders', 'SellOrders', 'Price', 'Volume'));

                            case 8:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function fetchOrderBook(_x3) {
                return _ref3.apply(this, arguments);
            }

            return fetchOrderBook;
        }()
    }, {
        key: 'parseTicker',
        value: function parseTicker(ticker) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var timestamp = this.parse8601(ticker['CreatedTimestampUtc']);
            var symbol = undefined;
            if (market) symbol = market['symbol'];
            return {
                'symbol': symbol,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'high': ticker['DayHighestPrice'],
                'low': ticker['DayLowestPrice'],
                'bid': ticker['CurrentHighestBidPrice'],
                'ask': ticker['CurrentLowestOfferPrice'],
                'vwap': undefined,
                'open': undefined,
                'close': undefined,
                'first': undefined,
                'last': ticker['LastPrice'],
                'change': undefined,
                'percentage': undefined,
                'average': ticker['DayAvgPrice'],
                'baseVolume': ticker['DayVolumeXbtInSecondaryCurrrency'],
                'quoteVolume': undefined,
                'info': ticker
            };
        }
    }, {
        key: 'fetchTicker',
        value: function () {
            var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var market, response;
                return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                _context4.next = 5;
                                return this.publicGetMarketSummary(this.extend({
                                    'primaryCurrencyCode': market['baseId'],
                                    'secondaryCurrencyCode': market['quoteId']
                                }, params));

                            case 5:
                                response = _context4.sent;
                                return _context4.abrupt('return', this.parseTicker(response, market));

                            case 7:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function fetchTicker(_x6) {
                return _ref4.apply(this, arguments);
            }

            return fetchTicker;
        }()
    }, {
        key: 'parseTrade',
        value: function parseTrade(trade, market) {
            var timestamp = this.parse8601(trade['TradeTimestampUtc']);
            return {
                'id': undefined,
                'info': trade,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'symbol': market['symbol'],
                'order': undefined,
                'type': undefined,
                'side': undefined,
                'price': trade['SecondaryCurrencyTradePrice'],
                'amount': trade['PrimaryCurrencyAmount']
            };
        }
    }, {
        key: 'fetchTrades',
        value: function () {
            var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(symbol) {
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var market, response;
                return _regenerator2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                _context5.next = 5;
                                return this.publicGetRecentTrades(this.extend({
                                    'primaryCurrencyCode': market['baseId'],
                                    'secondaryCurrencyCode': market['quoteId'],
                                    'numberOfRecentTradesToRetrieve': 50 // max = 50
                                }, params));

                            case 5:
                                response = _context5.sent;
                                return _context5.abrupt('return', this.parseTrades(response['Trades'], market, since, limit));

                            case 7:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function fetchTrades(_x10) {
                return _ref5.apply(this, arguments);
            }

            return fetchTrades;
        }()
    }, {
        key: 'createOrder',
        value: function () {
            var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(symbol, type, side, amount) {
                var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
                var market, capitalizedOrderType, method, orderType, order, response;
                return _regenerator2.default.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                _context6.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                capitalizedOrderType = this.capitalize(type);
                                method = 'Place' + capitalizedOrderType + 'Order';
                                orderType = capitalizedOrderType;

                                orderType += side == 'sell' ? 'Offer' : 'Bid';
                                order = this.ordered({
                                    'primaryCurrencyCode': market['baseId'],
                                    'secondaryCurrencyCode': market['quoteId'],
                                    'orderType': orderType
                                });

                                if (type == 'limit') order['price'] = price;
                                order['volume'] = amount;
                                _context6.next = 12;
                                return this[method](this.extend(order, params));

                            case 12:
                                response = _context6.sent;
                                return _context6.abrupt('return', {
                                    'info': response,
                                    'id': response['OrderGuid']
                                });

                            case 14:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function createOrder(_x13, _x14, _x15, _x16) {
                return _ref6.apply(this, arguments);
            }

            return createOrder;
        }()
    }, {
        key: 'cancelOrder',
        value: function () {
            var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(id) {
                var symbol = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
                return _regenerator2.default.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                _context7.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context7.next = 4;
                                return this.privatePostCancelOrder({ 'orderGuid': id });

                            case 4:
                                return _context7.abrupt('return', _context7.sent);

                            case 5:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function cancelOrder(_x19) {
                return _ref7.apply(this, arguments);
            }

            return cancelOrder;
        }()
    }, {
        key: 'sign',
        value: function sign(path) {
            var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var url = this.urls['api'][api] + '/' + path;
            if (api == 'public') {
                if ((0, _keys2.default)(params).length) url += '?' + this.urlencode(params);
            } else {
                this.checkRequiredCredentials();
                var nonce = this.nonce();
                var auth = [url, 'apiKey=' + this.apiKey, 'nonce=' + nonce.toString()];
                var keysorted = this.keysort(params);
                var keys = (0, _keys2.default)(keysorted);
                for (var i = 0; i < keys.length; i++) {
                    var key = keys[i];
                    auth.push(key + '=' + params[key]);
                }
                var message = auth.join(',');
                var signature = this.hmac(this.encode(message), this.encode(this.secret));
                var query = this.keysort(this.extend({
                    'apiKey': this.apiKey,
                    'nonce': nonce,
                    'signature': signature
                }, params));
                body = this.json(query);
                headers = { 'Content-Type': 'application/json' };
            }
            return { 'url': url, 'method': method, 'body': body, 'headers': headers };
        }
    }, {
        key: 'request',
        value: function () {
            var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8(path) {
                var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
                var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;
                var response;
                return _regenerator2.default.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                _context8.next = 2;
                                return this.fetch2(path, api, method, params, headers, body);

                            case 2:
                                response = _context8.sent;
                                return _context8.abrupt('return', response);

                            case 4:
                            case 'end':
                                return _context8.stop();
                        }
                    }
                }, _callee8, this);
            }));

            function request(_x30) {
                return _ref8.apply(this, arguments);
            }

            return request;
        }()
    }]);
    return independentreserve;
}(Exchange);