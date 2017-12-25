"use strict";

//  ---------------------------------------------------------------------------

import _slicedToArray from 'babel-runtime/helpers/slicedToArray';
import _regeneratorRuntime from 'babel-runtime/regenerator';
import _Object$keys from 'babel-runtime/core-js/object/keys';
import _asyncToGenerator from 'babel-runtime/helpers/asyncToGenerator';
import _Object$getPrototypeOf from 'babel-runtime/core-js/object/get-prototype-of';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _get from 'babel-runtime/helpers/get';
import _inherits from 'babel-runtime/helpers/inherits';
var Exchange = require('./base/Exchange');

var _require = require('./base/errors'),
    ExchangeError = _require.ExchangeError,
    NotSupported = _require.NotSupported;

//  ---------------------------------------------------------------------------

module.exports = function (_Exchange) {
    _inherits(bithumb, _Exchange);

    function bithumb() {
        _classCallCheck(this, bithumb);

        return _possibleConstructorReturn(this, (bithumb.__proto__ || _Object$getPrototypeOf(bithumb)).apply(this, arguments));
    }

    _createClass(bithumb, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend(_get(bithumb.prototype.__proto__ || _Object$getPrototypeOf(bithumb.prototype), 'describe', this).call(this), {
                'id': 'bithumb',
                'name': 'Bithumb',
                'countries': 'KR', // South Korea
                'rateLimit': 500,
                'hasCORS': true,
                'hasFetchTickers': true,
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/30597177-ea800172-9d5e-11e7-804c-b9d4fa9b56b0.jpg',
                    'api': {
                        'public': 'https://api.bithumb.com/public',
                        'private': 'https://api.bithumb.com'
                    },
                    'www': 'https://www.bithumb.com',
                    'doc': 'https://www.bithumb.com/u1/US127'
                },
                'api': {
                    'public': {
                        'get': ['ticker/{currency}', 'ticker/all', 'orderbook/{currency}', 'orderbook/all', 'recent_transactions/{currency}', 'recent_transactions/all']
                    },
                    'private': {
                        'post': ['info/account', 'info/balance', 'info/wallet_address', 'info/ticker', 'info/orders', 'info/user_transactions', 'trade/place', 'info/order_detail', 'trade/cancel', 'trade/btc_withdrawal', 'trade/krw_deposit', 'trade/krw_withdrawal', 'trade/market_buy', 'trade/market_sell']
                    }
                },
                'fees': {
                    'trading': {
                        'maker': 0.15 / 100,
                        'taker': 0.15 / 100
                    }
                }
            });
        }
    }, {
        key: 'fetchMarkets',
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
                var markets, currencies, result, i, id, market, base, quote, symbol;
                return _regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.publicGetTickerAll();

                            case 2:
                                markets = _context.sent;
                                currencies = _Object$keys(markets['data']);
                                result = [];

                                for (i = 0; i < currencies.length; i++) {
                                    id = currencies[i];

                                    if (id != 'date') {
                                        market = markets['data'][id];
                                        base = id;
                                        quote = 'KRW';
                                        symbol = id + '/' + quote;

                                        result.push(this.extend(this.fees['trading'], {
                                            'id': id,
                                            'symbol': symbol,
                                            'base': base,
                                            'quote': quote,
                                            'info': market,
                                            'lot': undefined,
                                            'active': true,
                                            'precision': {
                                                'amount': undefined,
                                                'price': undefined
                                            },
                                            'limits': {
                                                'amount': {
                                                    'min': undefined,
                                                    'max': undefined
                                                },
                                                'price': {
                                                    'min': undefined,
                                                    'max': undefined
                                                },
                                                'cost': {
                                                    'min': undefined,
                                                    'max': undefined
                                                }
                                            }
                                        }));
                                    }
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
    }, {
        key: 'fetchBalance',
        value: function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2() {
                var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var response, result, balances, currencies, i, currency, account, lowercase;
                return _regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context2.next = 4;
                                return this.privatePostInfoBalance(this.extend({
                                    'currency': 'ALL'
                                }, params));

                            case 4:
                                response = _context2.sent;
                                result = { 'info': response };
                                balances = response['data'];
                                currencies = _Object$keys(this.currencies);

                                for (i = 0; i < currencies.length; i++) {
                                    currency = currencies[i];
                                    account = this.account();
                                    lowercase = currency.toLowerCase();

                                    account['total'] = this.safeFloat(balances, 'total_' + lowercase);
                                    account['used'] = this.safeFloat(balances, 'in_use_' + lowercase);
                                    account['free'] = this.safeFloat(balances, 'available_' + lowercase);
                                    result[currency] = account;
                                }
                                return _context2.abrupt('return', this.parseBalance(result));

                            case 10:
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
                var market, response, orderbook, timestamp;
                return _regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                _context3.next = 5;
                                return this.publicGetOrderbookCurrency(this.extend({
                                    'count': 50, // max = 50
                                    'currency': market['base']
                                }, params));

                            case 5:
                                response = _context3.sent;
                                orderbook = response['data'];
                                timestamp = parseInt(orderbook['timestamp']);
                                return _context3.abrupt('return', this.parseOrderBook(orderbook, timestamp, 'bids', 'asks', 'price', 'quantity'));

                            case 9:
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

            var timestamp = parseInt(ticker['date']);
            var symbol = undefined;
            if (market) symbol = market['symbol'];
            return {
                'symbol': symbol,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'high': this.safeFloat(ticker, 'max_price'),
                'low': this.safeFloat(ticker, 'min_price'),
                'bid': this.safeFloat(ticker, 'buy_price'),
                'ask': this.safeFloat(ticker, 'sell_price'),
                'vwap': undefined,
                'open': this.safeFloat(ticker, 'opening_price'),
                'close': this.safeFloat(ticker, 'closing_price'),
                'first': undefined,
                'last': this.safeFloat(ticker, 'last_trade'),
                'change': undefined,
                'percentage': undefined,
                'average': this.safeFloat(ticker, 'average_price'),
                'baseVolume': this.safeFloat(ticker, 'volume_1day'),
                'quoteVolume': undefined,
                'info': ticker
            };
        }
    }, {
        key: 'fetchTickers',
        value: function () {
            var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee4() {
                var symbols = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var response, result, timestamp, tickers, ids, i, id, symbol, market, ticker;
                return _regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context4.next = 4;
                                return this.publicGetTickerAll(params);

                            case 4:
                                response = _context4.sent;
                                result = {};
                                timestamp = response['data']['date'];
                                tickers = this.omit(response['data'], 'date');
                                ids = _Object$keys(tickers);

                                for (i = 0; i < ids.length; i++) {
                                    id = ids[i];
                                    symbol = id;
                                    market = undefined;

                                    if (id in this.markets_by_id) {
                                        market = this.markets_by_id[id];
                                        symbol = market['symbol'];
                                    }
                                    ticker = tickers[id];

                                    ticker['date'] = timestamp;
                                    result[symbol] = this.parseTicker(ticker, market);
                                }
                                return _context4.abrupt('return', result);

                            case 11:
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
                var market, response;
                return _regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                _context5.next = 5;
                                return this.publicGetTickerCurrency(this.extend({
                                    'currency': market['base']
                                }, params));

                            case 5:
                                response = _context5.sent;
                                return _context5.abrupt('return', this.parseTicker(response['data'], market));

                            case 7:
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
        value: function parseTrade(trade, market) {
            // a workaround for their bug in date format, hours are not 0-padded
            var _trade$transaction_da = trade['transaction_date'].split(' '),
                _trade$transaction_da2 = _slicedToArray(_trade$transaction_da, 2),
                transaction_date = _trade$transaction_da2[0],
                transaction_time = _trade$transaction_da2[1];

            var transaction_time_short = transaction_time.length < 8;
            if (transaction_time_short) transaction_time = '0' + transaction_time;
            var timestamp = this.parse8601(transaction_date + ' ' + transaction_time);
            var side = trade['type'] == 'ask' ? 'sell' : 'buy';
            return {
                'id': undefined,
                'info': trade,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'symbol': market['symbol'],
                'order': undefined,
                'type': undefined,
                'side': side,
                'price': parseFloat(trade['price']),
                'amount': parseFloat(trade['units_traded'])
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
                                return this.publicGetRecentTransactionsCurrency(this.extend({
                                    'currency': market['base'],
                                    'count': 100 // max = 100
                                }, params));

                            case 5:
                                response = _context6.sent;
                                return _context6.abrupt('return', this.parseTrades(response['data'], market, since, limit));

                            case 7:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function fetchTrades(_x12) {
                return _ref6.apply(this, arguments);
            }

            return fetchTrades;
        }()
    }, {
        key: 'createOrder',
        value: function createOrder(symbol, type, side, amount) {
            var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

            throw new NotSupported(this.id + ' private API not implemented yet');
            //     let prefix = '';
            //     if (type == 'market')
            //         prefix = 'market_';
            //     let order = {
            //         'pair': this.marketId (symbol),
            //         'quantity': amount,
            //         'price': price || 0,
            //         'type': prefix + side,
            //     };
            //     let response = await this.privatePostOrderCreate (this.extend (order, params));
            //     return {
            //         'info': response,
            //         'id': response['order_id'].toString (),
            //     };
        }
    }, {
        key: 'cancelOrder',
        value: function () {
            var _ref7 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee7(id) {
                var symbol = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
                var side, currency;
                return _regeneratorRuntime.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                side = 'side' in params;

                                if (side) {
                                    _context7.next = 3;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' cancelOrder requires a side parameter (sell or buy)');

                            case 3:
                                side = side == 'buy' ? 'purchase' : 'sales';
                                currency = 'currency' in params;

                                if (currency) {
                                    _context7.next = 7;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' cancelOrder requires a currency parameter');

                            case 7:
                                _context7.next = 9;
                                return this.privatePostTradeCancel({
                                    'order_id': id,
                                    'type': params['side'],
                                    'currency': params['currency']
                                });

                            case 9:
                                return _context7.abrupt('return', _context7.sent);

                            case 10:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function cancelOrder(_x17) {
                return _ref7.apply(this, arguments);
            }

            return cancelOrder;
        }()
    }, {
        key: 'nonce',
        value: function nonce() {
            return this.milliseconds();
        }
    }, {
        key: 'sign',
        value: function sign(path) {
            var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var endpoint = '/' + this.implodeParams(path, params);
            var url = this.urls['api'][api] + endpoint;
            var query = this.omit(params, this.extractParams(path));
            if (api == 'public') {
                if (_Object$keys(query).length) url += '?' + this.urlencode(query);
            } else {
                this.checkRequiredCredentials();
                body = this.urlencode(this.extend({
                    'endpoint': endpoint
                }, query));
                var nonce = this.nonce().toString();
                var auth = endpoint + "\0" + body + "\0" + nonce;
                var signature = this.hmac(this.encode(auth), this.encode(this.secret), 'sha512');
                headers = {
                    'Api-Key': this.apiKey,
                    'Api-Sign': this.decode(this.stringToBase64(this.encode(signature))),
                    'Api-Nonce': nonce
                };
            }
            return { 'url': url, 'method': method, 'body': body, 'headers': headers };
        }
    }, {
        key: 'request',
        value: function () {
            var _ref8 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee8(path) {
                var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
                var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;
                var response;
                return _regeneratorRuntime.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                _context8.next = 2;
                                return this.fetch2(path, api, method, params, headers, body);

                            case 2:
                                response = _context8.sent;

                                if (!('status' in response)) {
                                    _context8.next = 7;
                                    break;
                                }

                                if (!(response['status'] == '0000')) {
                                    _context8.next = 6;
                                    break;
                                }

                                return _context8.abrupt('return', response);

                            case 6:
                                throw new ExchangeError(this.id + ' ' + this.json(response));

                            case 7:
                                return _context8.abrupt('return', response);

                            case 8:
                            case 'end':
                                return _context8.stop();
                        }
                    }
                }, _callee8, this);
            }));

            function request(_x28) {
                return _ref8.apply(this, arguments);
            }

            return request;
        }()
    }]);

    return bithumb;
}(Exchange);