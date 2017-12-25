"use strict";

//  ---------------------------------------------------------------------------

import _Object$keys from 'babel-runtime/core-js/object/keys';
import _regeneratorRuntime from 'babel-runtime/regenerator';
import _slicedToArray from 'babel-runtime/helpers/slicedToArray';
import _asyncToGenerator from 'babel-runtime/helpers/asyncToGenerator';
import _Object$getPrototypeOf from 'babel-runtime/core-js/object/get-prototype-of';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _get from 'babel-runtime/helpers/get';
import _inherits from 'babel-runtime/helpers/inherits';
var Exchange = require('./base/Exchange');

var _require = require('./base/errors'),
    ExchangeError = _require.ExchangeError;

//  ---------------------------------------------------------------------------

module.exports = function (_Exchange) {
    _inherits(coingi, _Exchange);

    function coingi() {
        _classCallCheck(this, coingi);

        return _possibleConstructorReturn(this, (coingi.__proto__ || _Object$getPrototypeOf(coingi)).apply(this, arguments));
    }

    _createClass(coingi, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend(_get(coingi.prototype.__proto__ || _Object$getPrototypeOf(coingi.prototype), 'describe', this).call(this), {
                'id': 'coingi',
                'name': 'Coingi',
                'rateLimit': 1000,
                'countries': ['PA', 'BG', 'CN', 'US'], // Panama, Bulgaria, China, US
                'hasFetchTickers': true,
                'hasCORS': false,
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/28619707-5c9232a8-7212-11e7-86d6-98fe5d15cc6e.jpg',
                    'api': {
                        'www': 'https://coingi.com',
                        'current': 'https://api.coingi.com',
                        'user': 'https://api.coingi.com'
                    },
                    'www': 'https://coingi.com',
                    'doc': 'http://docs.coingi.apiary.io/'
                },
                'api': {
                    'www': {
                        'get': ['']
                    },
                    'current': {
                        'get': ['order-book/{pair}/{askCount}/{bidCount}/{depth}', 'transactions/{pair}/{maxCount}', '24hour-rolling-aggregation']
                    },
                    'user': {
                        'post': ['balance', 'add-order', 'cancel-order', 'orders', 'transactions', 'create-crypto-withdrawal']
                    }
                },
                'fees': {
                    'trading': {
                        'tierBased': false,
                        'percentage': true,
                        'taker': 0.2 / 100,
                        'maker': 0.2 / 100
                    },
                    'funding': {
                        'tierBased': false,
                        'percentage': false,
                        'withdraw': {
                            'BTC': 0.001,
                            'LTC': 0.01,
                            'DOGE': 2,
                            'PPC': 0.02,
                            'VTC': 0.2,
                            'NMC': 2,
                            'DASH': 0.002,
                            'USD': 10,
                            'EUR': 10
                        },
                        'deposit': {
                            'BTC': 0,
                            'LTC': 0,
                            'DOGE': 0,
                            'PPC': 0,
                            'VTC': 0,
                            'NMC': 0,
                            'DASH': 0,
                            'USD': 5,
                            'EUR': 1
                        }
                    }
                }
            });
        }
    }, {
        key: 'fetchMarkets',
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
                var response, parts, currencyParts, result, i, currencyPart, idParts, id, symbol, _symbol$split, _symbol$split2, base, quote, precision, lot;

                return _regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                this.parseJsonResponse = false;
                                _context.next = 3;
                                return this.wwwGet();

                            case 3:
                                response = _context.sent;

                                this.parseJsonResponse = true;
                                parts = response.split('do=currencyPairSelector-selectCurrencyPair" class="active">');
                                currencyParts = parts[1].split('<div class="currency-pair-label">');
                                result = [];

                                for (i = 1; i < currencyParts.length; i++) {
                                    currencyPart = currencyParts[i];
                                    idParts = currencyPart.split('</div>');
                                    id = idParts[0];
                                    symbol = id;

                                    id = id.replace('/', '-');
                                    id = id.toLowerCase();
                                    _symbol$split = symbol.split('/'), _symbol$split2 = _slicedToArray(_symbol$split, 2), base = _symbol$split2[0], quote = _symbol$split2[1];
                                    precision = {
                                        'amount': 8,
                                        'price': 8
                                    };
                                    lot = Math.pow(10, -precision['amount']);

                                    result.push({
                                        'id': id,
                                        'symbol': symbol,
                                        'base': base,
                                        'quote': quote,
                                        'info': id,
                                        'lot': lot,
                                        'active': true,
                                        'precision': precision,
                                        'limits': {
                                            'amount': {
                                                'min': lot,
                                                'max': Math.pow(10, precision['amount'])
                                            },
                                            'price': {
                                                'min': Math.pow(10, -precision['price']),
                                                'max': undefined
                                            },
                                            'cost': {
                                                'min': 0,
                                                'max': undefined
                                            }
                                        }
                                    });
                                }
                                return _context.abrupt('return', result);

                            case 10:
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
            var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2() {
                var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                var lowercaseCurrencies, currencies, i, currency, balances, result, b, balance, _currency, account;

                return _regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this.loadMarkets();

                            case 2:
                                lowercaseCurrencies = [];
                                currencies = _Object$keys(this.currencies);

                                for (i = 0; i < currencies.length; i++) {
                                    currency = currencies[i];

                                    lowercaseCurrencies.push(currency.toLowerCase());
                                }
                                _context2.next = 7;
                                return this.userPostBalance({
                                    'currencies': lowercaseCurrencies.join(',')
                                });

                            case 7:
                                balances = _context2.sent;
                                result = { 'info': balances };

                                for (b = 0; b < balances.length; b++) {
                                    balance = balances[b];
                                    _currency = balance['currency']['name'];

                                    _currency = _currency.toUpperCase();
                                    account = {
                                        'free': balance['available'],
                                        'used': balance['blocked'] + balance['inOrders'] + balance['withdrawing'],
                                        'total': 0.0
                                    };

                                    account['total'] = this.sum(account['free'], account['used']);
                                    result[_currency] = account;
                                }
                                return _context2.abrupt('return', this.parseBalance(result));

                            case 11:
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
            var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var market, orderbook;
                return _regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                _context3.next = 5;
                                return this.currentGetOrderBookPairAskCountBidCountDepth(this.extend({
                                    'pair': market['id'],
                                    'askCount': 512, // maximum returned number of asks 1-512
                                    'bidCount': 512, // maximum returned number of bids 1-512
                                    'depth': 32 // maximum number of depth range steps 1-32
                                }, params));

                            case 5:
                                orderbook = _context3.sent;
                                return _context3.abrupt('return', this.parseOrderBook(orderbook, undefined, 'bids', 'asks', 'price', 'baseAmount'));

                            case 7:
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

            var timestamp = this.milliseconds();
            var symbol = undefined;
            if (market) symbol = market['symbol'];
            return {
                'symbol': symbol,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'high': ticker['high'],
                'low': ticker['low'],
                'bid': ticker['highestBid'],
                'ask': ticker['lowestAsk'],
                'vwap': undefined,
                'open': undefined,
                'close': undefined,
                'first': undefined,
                'last': undefined,
                'change': undefined,
                'percentage': undefined,
                'average': undefined,
                'baseVolume': ticker['baseVolume'],
                'quoteVolume': ticker['counterVolume'],
                'info': ticker
            };
            return ticker;
        }
    }, {
        key: 'fetchTickers',
        value: function () {
            var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee4() {
                var symbols = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var response, result, t, ticker, base, quote, symbol, market;
                return _regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context4.next = 4;
                                return this.currentGet24hourRollingAggregation(params);

                            case 4:
                                response = _context4.sent;
                                result = {};

                                for (t = 0; t < response.length; t++) {
                                    ticker = response[t];
                                    base = ticker['currencyPair']['base'].toUpperCase();
                                    quote = ticker['currencyPair']['counter'].toUpperCase();
                                    symbol = base + '/' + quote;
                                    market = undefined;

                                    if (symbol in this.markets) {
                                        market = this.markets[symbol];
                                    }
                                    result[symbol] = this.parseTicker(ticker, market);
                                }
                                return _context4.abrupt('return', result);

                            case 8:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function fetchTickers() {
                return _ref4.apply(this, arguments);
            }

            return fetchTickers;
        }()
    }, {
        key: 'fetchTicker',
        value: function () {
            var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee5(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var tickers;
                return _regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context5.next = 4;
                                return this.fetchTickers(undefined, params);

                            case 4:
                                tickers = _context5.sent;

                                if (!(symbol in tickers)) {
                                    _context5.next = 7;
                                    break;
                                }

                                return _context5.abrupt('return', tickers[symbol]);

                            case 7:
                                throw new ExchangeError(this.id + ' return did not contain ' + symbol);

                            case 8:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function fetchTicker(_x8) {
                return _ref5.apply(this, arguments);
            }

            return fetchTicker;
        }()
    }, {
        key: 'parseTrade',
        value: function parseTrade(trade) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            if (!market) market = this.markets_by_id[trade['currencyPair']];
            return {
                'id': trade['id'],
                'info': trade,
                'timestamp': trade['timestamp'],
                'datetime': this.iso8601(trade['timestamp']),
                'symbol': market['symbol'],
                'type': undefined,
                'side': undefined, // type
                'price': trade['price'],
                'amount': trade['amount']
            };
        }
    }, {
        key: 'fetchTrades',
        value: function () {
            var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee6(symbol) {
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var market, response;
                return _regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                _context6.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                _context6.next = 5;
                                return this.currentGetTransactionsPairMaxCount(this.extend({
                                    'pair': market['id'],
                                    'maxCount': 128
                                }, params));

                            case 5:
                                response = _context6.sent;
                                return _context6.abrupt('return', this.parseTrades(response, market, since, limit));

                            case 7:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function fetchTrades(_x13) {
                return _ref6.apply(this, arguments);
            }

            return fetchTrades;
        }()
    }, {
        key: 'createOrder',
        value: function () {
            var _ref7 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee7(symbol, type, side, amount) {
                var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
                var order, response;
                return _regeneratorRuntime.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                _context7.next = 2;
                                return this.loadMarkets();

                            case 2:
                                order = {
                                    'currencyPair': this.marketId(symbol),
                                    'volume': amount,
                                    'price': price,
                                    'orderType': side == 'buy' ? 0 : 1
                                };
                                _context7.next = 5;
                                return this.userPostAddOrder(this.extend(order, params));

                            case 5:
                                response = _context7.sent;
                                return _context7.abrupt('return', {
                                    'info': response,
                                    'id': response['result']
                                });

                            case 7:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function createOrder(_x16, _x17, _x18, _x19) {
                return _ref7.apply(this, arguments);
            }

            return createOrder;
        }()
    }, {
        key: 'cancelOrder',
        value: function () {
            var _ref8 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee8(id) {
                var symbol = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
                return _regeneratorRuntime.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                _context8.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context8.next = 4;
                                return this.userPostCancelOrder({ 'orderId': id });

                            case 4:
                                return _context8.abrupt('return', _context8.sent);

                            case 5:
                            case 'end':
                                return _context8.stop();
                        }
                    }
                }, _callee8, this);
            }));

            function cancelOrder(_x22) {
                return _ref8.apply(this, arguments);
            }

            return cancelOrder;
        }()
    }, {
        key: 'sign',
        value: function sign(path) {
            var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'current';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var url = this.urls['api'][api];
            if (api != 'www') {
                url += '/' + api + '/' + this.implodeParams(path, params);
            }
            var query = this.omit(params, this.extractParams(path));
            if (api == 'current') {
                if (_Object$keys(query).length) url += '?' + this.urlencode(query);
            } else if (api == 'user') {
                this.checkRequiredCredentials();
                var nonce = this.nonce();
                var request = this.extend({
                    'token': this.apiKey,
                    'nonce': nonce
                }, query);
                var auth = nonce.toString() + '$' + this.apiKey;
                request['signature'] = this.hmac(this.encode(auth), this.encode(this.secret));
                body = this.json(request);
                headers = {
                    'Content-Type': 'application/json'
                };
            }
            return { 'url': url, 'method': method, 'body': body, 'headers': headers };
        }
    }, {
        key: 'request',
        value: function () {
            var _ref9 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee9(path) {
                var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'current';
                var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;
                var response;
                return _regeneratorRuntime.wrap(function _callee9$(_context9) {
                    while (1) {
                        switch (_context9.prev = _context9.next) {
                            case 0:
                                _context9.next = 2;
                                return this.fetch2(path, api, method, params, headers, body);

                            case 2:
                                response = _context9.sent;

                                if (!(typeof response != 'string')) {
                                    _context9.next = 6;
                                    break;
                                }

                                if (!('errors' in response)) {
                                    _context9.next = 6;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' ' + this.json(response));

                            case 6:
                                return _context9.abrupt('return', response);

                            case 7:
                            case 'end':
                                return _context9.stop();
                        }
                    }
                }, _callee9, this);
            }));

            function request(_x33) {
                return _ref9.apply(this, arguments);
            }

            return request;
        }()
    }]);

    return coingi;
}(Exchange);