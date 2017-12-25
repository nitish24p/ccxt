"use strict";

//  ---------------------------------------------------------------------------

import _Object$keys from 'babel-runtime/core-js/object/keys';
import _regeneratorRuntime from 'babel-runtime/regenerator';
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
    _inherits(luno, _Exchange);

    function luno() {
        _classCallCheck(this, luno);

        return _possibleConstructorReturn(this, (luno.__proto__ || _Object$getPrototypeOf(luno)).apply(this, arguments));
    }

    _createClass(luno, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend(_get(luno.prototype.__proto__ || _Object$getPrototypeOf(luno.prototype), 'describe', this).call(this), {
                'id': 'luno',
                'name': 'luno',
                'countries': ['GB', 'SG', 'ZA'],
                'rateLimit': 10000,
                'version': '1',
                'hasCORS': false,
                'hasFetchTickers': true,
                'hasFetchOrder': true,
                'has': {
                    'fetchTickers': true,
                    'fetchOrder': true
                },
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/27766607-8c1a69d8-5ede-11e7-930c-540b5eb9be24.jpg',
                    'api': 'https://api.mybitx.com/api',
                    'www': 'https://www.luno.com',
                    'doc': ['https://www.luno.com/en/api', 'https://npmjs.org/package/bitx', 'https://github.com/bausmeier/node-bitx']
                },
                'api': {
                    'public': {
                        'get': ['orderbook', 'ticker', 'tickers', 'trades']
                    },
                    'private': {
                        'get': ['accounts/{id}/pending', 'accounts/{id}/transactions', 'balance', 'fee_info', 'funding_address', 'listorders', 'listtrades', 'orders/{id}', 'quotes/{id}', 'withdrawals', 'withdrawals/{id}'],
                        'post': ['accounts', 'postorder', 'marketorder', 'stoporder', 'funding_address', 'withdrawals', 'send', 'quotes', 'oauth2/grant'],
                        'put': ['quotes/{id}'],
                        'delete': ['quotes/{id}', 'withdrawals/{id}']
                    }
                }
            });
        }
    }, {
        key: 'fetchMarkets',
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
                var markets, result, p, market, id, base, quote, symbol;
                return _regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.publicGetTickers();

                            case 2:
                                markets = _context.sent;
                                result = [];

                                for (p = 0; p < markets['tickers'].length; p++) {
                                    market = markets['tickers'][p];
                                    id = market['pair'];
                                    base = id.slice(0, 3);
                                    quote = id.slice(3, 6);

                                    base = this.commonCurrencyCode(base);
                                    quote = this.commonCurrencyCode(quote);
                                    symbol = base + '/' + quote;

                                    result.push({
                                        'id': id,
                                        'symbol': symbol,
                                        'base': base,
                                        'quote': quote,
                                        'info': market
                                    });
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
        key: 'fetchBalance',
        value: function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2() {
                var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var response, balances, result, b, balance, currency, reserved, unconfirmed, account;
                return _regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context2.next = 4;
                                return this.privateGetBalance();

                            case 4:
                                response = _context2.sent;
                                balances = response['balance'];
                                result = { 'info': response };

                                for (b = 0; b < balances.length; b++) {
                                    balance = balances[b];
                                    currency = this.commonCurrencyCode(balance['asset']);
                                    reserved = parseFloat(balance['reserved']);
                                    unconfirmed = parseFloat(balance['unconfirmed']);
                                    account = {
                                        'free': parseFloat(balance['balance']),
                                        'used': this.sum(reserved, unconfirmed),
                                        'total': 0.0
                                    };

                                    account['total'] = this.sum(account['free'], account['used']);
                                    result[currency] = account;
                                }
                                return _context2.abrupt('return', this.parseBalance(result));

                            case 9:
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
                var orderbook, timestamp;
                return _regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context3.next = 4;
                                return this.publicGetOrderbook(this.extend({
                                    'pair': this.marketId(symbol)
                                }, params));

                            case 4:
                                orderbook = _context3.sent;
                                timestamp = orderbook['timestamp'];
                                return _context3.abrupt('return', this.parseOrderBook(orderbook, timestamp, 'bids', 'asks', 'price', 'volume'));

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
        key: 'parseOrder',
        value: function parseOrder(order) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var timestamp = order['creation_timestamp'];
            var status = order['state'] == 'PENDING' ? 'open' : 'closed';
            var side = order['type'] == 'ASK' ? 'sell' : 'buy';
            var symbol = undefined;
            if (market) symbol = market['symbol'];
            var price = this.safeFloat(order, 'limit_price');
            var amount = this.safeFloat(order, 'limit_volume');
            var quoteFee = this.safeFloat(order, 'fee_counter');
            var baseFee = this.safeFloat(order, 'fee_base');
            var fee = { 'currency': undefined };
            if (quoteFee) {
                fee['side'] = 'quote';
                fee['cost'] = quoteFee;
            } else {
                fee['side'] = 'base';
                fee['cost'] = baseFee;
            }
            return {
                'id': order['order_id'],
                'datetime': this.iso8601(timestamp),
                'timestamp': timestamp,
                'status': status,
                'symbol': symbol,
                'type': undefined,
                'side': side,
                'price': price,
                'amount': amount,
                'filled': undefined,
                'remaining': undefined,
                'trades': undefined,
                'fee': fee,
                'info': order
            };
        }
    }, {
        key: 'fetchOrder',
        value: function () {
            var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee4(id) {
                var symbol = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
                var response;
                return _regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context4.next = 4;
                                return this.privateGetOrders(this.extend({
                                    'id': id.toString()
                                }, params));

                            case 4:
                                response = _context4.sent;
                                return _context4.abrupt('return', this.parseOrder(response));

                            case 6:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function fetchOrder(_x7) {
                return _ref4.apply(this, arguments);
            }

            return fetchOrder;
        }()
    }, {
        key: 'parseTicker',
        value: function parseTicker(ticker) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var timestamp = ticker['timestamp'];
            var symbol = undefined;
            if (market) symbol = market['symbol'];
            return {
                'symbol': symbol,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'high': undefined,
                'low': undefined,
                'bid': parseFloat(ticker['bid']),
                'ask': parseFloat(ticker['ask']),
                'vwap': undefined,
                'open': undefined,
                'close': undefined,
                'first': undefined,
                'last': parseFloat(ticker['last_trade']),
                'change': undefined,
                'percentage': undefined,
                'average': undefined,
                'baseVolume': parseFloat(ticker['rolling_24_hour_volume']),
                'quoteVolume': undefined,
                'info': ticker
            };
        }
    }, {
        key: 'fetchTickers',
        value: function () {
            var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee5() {
                var symbols = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var response, tickers, ids, result, i, id, market, symbol, ticker;
                return _regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context5.next = 4;
                                return this.publicGetTickers(params);

                            case 4:
                                response = _context5.sent;
                                tickers = this.indexBy(response['tickers'], 'pair');
                                ids = _Object$keys(tickers);
                                result = {};

                                for (i = 0; i < ids.length; i++) {
                                    id = ids[i];
                                    market = this.markets_by_id[id];
                                    symbol = market['symbol'];
                                    ticker = tickers[id];

                                    result[symbol] = this.parseTicker(ticker, market);
                                }
                                return _context5.abrupt('return', result);

                            case 10:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function fetchTickers() {
                return _ref5.apply(this, arguments);
            }

            return fetchTickers;
        }()
    }, {
        key: 'fetchTicker',
        value: function () {
            var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee6(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var market, ticker;
                return _regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                _context6.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                _context6.next = 5;
                                return this.publicGetTicker(this.extend({
                                    'pair': market['id']
                                }, params));

                            case 5:
                                ticker = _context6.sent;
                                return _context6.abrupt('return', this.parseTicker(ticker, market));

                            case 7:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function fetchTicker(_x12) {
                return _ref6.apply(this, arguments);
            }

            return fetchTicker;
        }()
    }, {
        key: 'parseTrade',
        value: function parseTrade(trade, market) {
            var side = trade['is_buy'] ? 'buy' : 'sell';
            return {
                'info': trade,
                'id': undefined,
                'order': undefined,
                'timestamp': trade['timestamp'],
                'datetime': this.iso8601(trade['timestamp']),
                'symbol': market['symbol'],
                'type': undefined,
                'side': side,
                'price': parseFloat(trade['price']),
                'amount': parseFloat(trade['volume'])
            };
        }
    }, {
        key: 'fetchTrades',
        value: function () {
            var _ref7 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee7(symbol) {
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var market, response;
                return _regeneratorRuntime.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                _context7.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                _context7.next = 5;
                                return this.publicGetTrades(this.extend({
                                    'pair': market['id']
                                }, params));

                            case 5:
                                response = _context7.sent;
                                return _context7.abrupt('return', this.parseTrades(response['trades'], market, since, limit));

                            case 7:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function fetchTrades(_x16) {
                return _ref7.apply(this, arguments);
            }

            return fetchTrades;
        }()
    }, {
        key: 'createOrder',
        value: function () {
            var _ref8 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee8(market, type, side, amount) {
                var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
                var method, order, response;
                return _regeneratorRuntime.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                _context8.next = 2;
                                return this.loadMarkets();

                            case 2:
                                method = 'privatePost';
                                order = { 'pair': this.marketId(market) };

                                if (type == 'market') {
                                    method += 'Marketorder';
                                    order['type'] = side.toUpperCase();
                                    if (side == 'buy') order['counter_volume'] = amount;else order['base_volume'] = amount;
                                } else {
                                    method += 'Order';
                                    order['volume'] = amount;
                                    order['price'] = price;
                                    if (side == 'buy') order['type'] = 'BID';else order['type'] = 'ASK';
                                }
                                _context8.next = 7;
                                return this[method](this.extend(order, params));

                            case 7:
                                response = _context8.sent;
                                return _context8.abrupt('return', {
                                    'info': response,
                                    'id': response['order_id']
                                });

                            case 9:
                            case 'end':
                                return _context8.stop();
                        }
                    }
                }, _callee8, this);
            }));

            function createOrder(_x19, _x20, _x21, _x22) {
                return _ref8.apply(this, arguments);
            }

            return createOrder;
        }()
    }, {
        key: 'cancelOrder',
        value: function () {
            var _ref9 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee9(id) {
                var symbol = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
                return _regeneratorRuntime.wrap(function _callee9$(_context9) {
                    while (1) {
                        switch (_context9.prev = _context9.next) {
                            case 0:
                                _context9.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context9.next = 4;
                                return this.privatePostStoporder({ 'order_id': id });

                            case 4:
                                return _context9.abrupt('return', _context9.sent);

                            case 5:
                            case 'end':
                                return _context9.stop();
                        }
                    }
                }, _callee9, this);
            }));

            function cancelOrder(_x25) {
                return _ref9.apply(this, arguments);
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

            var url = this.urls['api'] + '/' + this.version + '/' + this.implodeParams(path, params);
            var query = this.omit(params, this.extractParams(path));
            if (_Object$keys(query).length) url += '?' + this.urlencode(query);
            if (api == 'private') {
                this.checkRequiredCredentials();
                var auth = this.encode(this.apiKey + ':' + this.secret);
                auth = this.stringToBase64(auth);
                headers = { 'Authorization': 'Basic ' + this.decode(auth) };
            }
            return { 'url': url, 'method': method, 'body': body, 'headers': headers };
        }
    }, {
        key: 'request',
        value: function () {
            var _ref10 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee10(path) {
                var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
                var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;
                var response;
                return _regeneratorRuntime.wrap(function _callee10$(_context10) {
                    while (1) {
                        switch (_context10.prev = _context10.next) {
                            case 0:
                                _context10.next = 2;
                                return this.fetch2(path, api, method, params, headers, body);

                            case 2:
                                response = _context10.sent;

                                if (!('error' in response)) {
                                    _context10.next = 5;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' ' + this.json(response));

                            case 5:
                                return _context10.abrupt('return', response);

                            case 6:
                            case 'end':
                                return _context10.stop();
                        }
                    }
                }, _callee10, this);
            }));

            function request(_x36) {
                return _ref10.apply(this, arguments);
            }

            return request;
        }()
    }]);

    return luno;
}(Exchange);