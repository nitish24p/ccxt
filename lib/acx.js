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
    ExchangeError = _require.ExchangeError,
    OrderNotFound = _require.OrderNotFound;

//  ---------------------------------------------------------------------------

module.exports = function (_Exchange) {
    _inherits(acx, _Exchange);

    function acx() {
        _classCallCheck(this, acx);

        return _possibleConstructorReturn(this, (acx.__proto__ || _Object$getPrototypeOf(acx)).apply(this, arguments));
    }

    _createClass(acx, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend(_get(acx.prototype.__proto__ || _Object$getPrototypeOf(acx.prototype), 'describe', this).call(this), {
                'id': 'acx',
                'name': 'ACX',
                'countries': 'AU',
                'rateLimit': 1000,
                'version': 'v2',
                'hasCORS': true,
                'hasFetchTickers': true,
                'hasFetchOHLCV': true,
                'hasWithdraw': true,
                'timeframes': {
                    '1m': '1',
                    '5m': '5',
                    '15m': '15',
                    '30m': '30',
                    '1h': '60',
                    '2h': '120',
                    '4h': '240',
                    '12h': '720',
                    '1d': '1440',
                    '3d': '4320',
                    '1w': '10080'
                },
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/30247614-1fe61c74-9621-11e7-9e8c-f1a627afa279.jpg',
                    'extension': '.json',
                    'api': 'https://acx.io/api',
                    'www': 'https://acx.io',
                    'doc': 'https://acx.io/documents/api_v2'
                },
                'api': {
                    'public': {
                        'get': ['markets', // Get all available markets
                        'tickers', // Get ticker of all markets
                        'tickers/{market}', // Get ticker of specific market
                        'trades', // Get recent trades on market, each trade is included only once Trades are sorted in reverse creation order.
                        'order_book', // Get the order book of specified market
                        'depth', // Get depth or specified market Both asks and bids are sorted from highest price to lowest.
                        'k', // Get OHLC(k line) of specific market
                        'k_with_pending_trades', // Get K data with pending trades, which are the trades not included in K data yet, because there's delay between trade generated and processed by K data generator
                        'timestamp']
                    },
                    'private': {
                        'get': ['members/me', // Get your profile and accounts info
                        'deposits', // Get your deposits history
                        'deposit', // Get details of specific deposit
                        'deposit_address', // Where to deposit The address field could be empty when a new address is generating (e.g. for bitcoin), you should try again later in that case.
                        'orders', // Get your orders, results is paginated
                        'order', // Get information of specified order
                        'trades/my', // Get your executed trades Trades are sorted in reverse creation order.
                        'withdraws', // Get your cryptocurrency withdraws
                        'withdraw'],
                        'post': ['orders', // Create a Sell/Buy order
                        'orders/multi', // Create multiple sell/buy orders
                        'orders/clear', // Cancel all my orders
                        'order/delete', // Cancel an order
                        'withdraw']
                    }
                },
                'fees': {
                    'trading': {
                        'tierBased': false,
                        'percentage': true,
                        'maker': 0.0,
                        'taker': 0.0
                    },
                    'funding': {
                        'tierBased': false,
                        'percentage': true,
                        'withdraw': 0.0 // There is only 1% fee on withdrawals to your bank account.
                    }
                }
            });
        }
    }, {
        key: 'fetchMarkets',
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
                var markets, result, p, market, id, symbol, _symbol$split, _symbol$split2, base, quote;

                return _regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.publicGetMarkets();

                            case 2:
                                markets = _context.sent;
                                result = [];

                                for (p = 0; p < markets.length; p++) {
                                    market = markets[p];
                                    id = market['id'];
                                    symbol = market['name'];
                                    _symbol$split = symbol.split('/'), _symbol$split2 = _slicedToArray(_symbol$split, 2), base = _symbol$split2[0], quote = _symbol$split2[1];

                                    base = this.commonCurrencyCode(base);
                                    quote = this.commonCurrencyCode(quote);
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
                var response, balances, result, b, balance, currency, uppercase, account;
                return _regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context2.next = 4;
                                return this.privateGetMembersMe();

                            case 4:
                                response = _context2.sent;
                                balances = response['accounts'];
                                result = { 'info': balances };

                                for (b = 0; b < balances.length; b++) {
                                    balance = balances[b];
                                    currency = balance['currency'];
                                    uppercase = currency.toUpperCase();
                                    account = {
                                        'free': parseFloat(balance['balance']),
                                        'used': parseFloat(balance['locked']),
                                        'total': 0.0
                                    };

                                    account['total'] = this.sum(account['free'], account['used']);
                                    result[uppercase] = account;
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
                var market, orderbook, timestamp, result;
                return _regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                _context3.next = 5;
                                return this.publicGetDepth(this.extend({
                                    'market': market['id'],
                                    'limit': 300
                                }, params));

                            case 5:
                                orderbook = _context3.sent;
                                timestamp = orderbook['timestamp'] * 1000;
                                result = this.parseOrderBook(orderbook, timestamp);

                                result['bids'] = this.sortBy(result['bids'], 0, true);
                                result['asks'] = this.sortBy(result['asks'], 0);
                                return _context3.abrupt('return', result);

                            case 11:
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

            var timestamp = ticker['at'] * 1000;
            ticker = ticker['ticker'];
            var symbol = undefined;
            if (market) symbol = market['symbol'];
            return {
                'symbol': symbol,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'high': this.safeFloat(ticker, 'high', undefined),
                'low': this.safeFloat(ticker, 'low', undefined),
                'bid': this.safeFloat(ticker, 'buy', undefined),
                'ask': this.safeFloat(ticker, 'sell', undefined),
                'vwap': undefined,
                'open': undefined,
                'close': undefined,
                'first': undefined,
                'last': this.safeFloat(ticker, 'last', undefined),
                'change': undefined,
                'percentage': undefined,
                'average': undefined,
                'baseVolume': this.safeFloat(ticker, 'vol', undefined),
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

                var tickers, ids, result, i, id, market, symbol, base, quote, _symbol, ticker;

                return _regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context4.next = 4;
                                return this.publicGetTickers(params);

                            case 4:
                                tickers = _context4.sent;
                                ids = _Object$keys(tickers);
                                result = {};

                                for (i = 0; i < ids.length; i++) {
                                    id = ids[i];
                                    market = undefined;
                                    symbol = id;

                                    if (id in this.markets_by_id) {
                                        market = this.markets_by_id[id];
                                        symbol = market['symbol'];
                                    } else {
                                        base = id.slice(0, 3);
                                        quote = id.slice(3, 6);

                                        base = base.toUpperCase();
                                        quote = quote.toUpperCase();
                                        base = this.commonCurrencyCode(base);
                                        quote = this.commonCurrencyCode(quote);
                                        _symbol = base + '/' + quote;
                                    }
                                    ticker = tickers[id];

                                    result[symbol] = this.parseTicker(ticker, market);
                                }
                                return _context4.abrupt('return', result);

                            case 9:
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
                                return this.publicGetTickersMarket(this.extend({
                                    'market': market['id']
                                }, params));

                            case 5:
                                response = _context5.sent;
                                return _context5.abrupt('return', this.parseTicker(response, market));

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
        value: function parseTrade(trade) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var timestamp = trade['timestamp'] * 1000;
            var side = trade['type'] == 'bid' ? 'buy' : 'sell';
            return {
                'info': trade,
                'id': trade['tid'].toString(),
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'symbol': market['symbol'],
                'type': undefined,
                'side': side,
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
                                return this.publicGetTrades(this.extend({
                                    'market': market['id']
                                }, params));

                            case 5:
                                response = _context6.sent;
                                return _context6.abrupt('return', response);

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
        key: 'parseOHLCV',
        value: function parseOHLCV(ohlcv) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
            var timeframe = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '1m';
            var since = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
            var limit = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;

            return [ohlcv[0] * 1000, ohlcv[1], ohlcv[2], ohlcv[3], ohlcv[4], ohlcv[5]];
        }
    }, {
        key: 'fetchOHLCV',
        value: function () {
            var _ref7 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee7(symbol) {
                var timeframe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '1m';
                var since = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var limit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
                var params = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
                var market, request, response;
                return _regeneratorRuntime.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                _context7.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);

                                if (!limit) limit = 500; // default is 30
                                request = {
                                    'market': market['id'],
                                    'period': this.timeframes[timeframe],
                                    'limit': limit
                                };

                                if (since) request['timestamp'] = since;
                                _context7.next = 8;
                                return this.publicGetK(this.extend(request, params));

                            case 8:
                                response = _context7.sent;
                                return _context7.abrupt('return', this.parseOHLCVs(response, market, timeframe, since, limit));

                            case 10:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function fetchOHLCV(_x22) {
                return _ref7.apply(this, arguments);
            }

            return fetchOHLCV;
        }()
    }, {
        key: 'parseOrder',
        value: function parseOrder(order) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var symbol = undefined;
            if (market) {
                symbol = market['symbol'];
            } else {
                var marketId = order['market'];
                symbol = this.marketsById[marketId]['symbol'];
            }
            var timestamp = this.parse8601(order['created_at']);
            var state = order['state'];
            var status = undefined;
            if (state == 'done') {
                status = 'closed';
            } else if (state == 'wait') {
                status = 'open';
            } else if (state == 'cancel') {
                status = 'canceled';
            }
            return {
                'id': order['id'],
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'status': status,
                'symbol': symbol,
                'type': order['ord_type'],
                'side': order['side'],
                'price': parseFloat(order['price']),
                'amount': parseFloat(order['volume']),
                'filled': parseFloat(order['executed_volume']),
                'remaining': parseFloat(order['remaining_volume']),
                'trades': undefined,
                'fee': undefined,
                'info': order
            };
        }
    }, {
        key: 'createOrder',
        value: function () {
            var _ref8 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee8(symbol, type, side, amount) {
                var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
                var order, response, market;
                return _regeneratorRuntime.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                _context8.next = 2;
                                return this.loadMarkets();

                            case 2:
                                order = {
                                    'market': this.marketId(symbol),
                                    'side': side,
                                    'volume': amount.toString(),
                                    'ord_type': type
                                };

                                if (type == 'limit') {
                                    order['price'] = price.toString();
                                }
                                _context8.next = 6;
                                return this.privatePostOrders(this.extend(order, params));

                            case 6:
                                response = _context8.sent;
                                market = this.marketsById[response['market']];
                                return _context8.abrupt('return', this.parseOrder(response, market));

                            case 9:
                            case 'end':
                                return _context8.stop();
                        }
                    }
                }, _callee8, this);
            }));

            function createOrder(_x26, _x27, _x28, _x29) {
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
                var result, order;
                return _regeneratorRuntime.wrap(function _callee9$(_context9) {
                    while (1) {
                        switch (_context9.prev = _context9.next) {
                            case 0:
                                _context9.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context9.next = 4;
                                return this.privatePostOrderDelete({ 'id': id });

                            case 4:
                                result = _context9.sent;
                                order = this.parseOrder(result);

                                if (!(order['status'] == 'closed')) {
                                    _context9.next = 8;
                                    break;
                                }

                                throw new OrderNotFound(this.id + ' ' + result);

                            case 8:
                                return _context9.abrupt('return', order);

                            case 9:
                            case 'end':
                                return _context9.stop();
                        }
                    }
                }, _callee9, this);
            }));

            function cancelOrder(_x32) {
                return _ref9.apply(this, arguments);
            }

            return cancelOrder;
        }()
    }, {
        key: 'withdraw',
        value: function () {
            var _ref10 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee10(currency, amount, address) {
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var result;
                return _regeneratorRuntime.wrap(function _callee10$(_context10) {
                    while (1) {
                        switch (_context10.prev = _context10.next) {
                            case 0:
                                _context10.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context10.next = 4;
                                return this.privatePostWithdraw(this.extend({
                                    'currency': currency.toLowerCase(),
                                    'sum': amount,
                                    'address': address
                                }, params));

                            case 4:
                                result = _context10.sent;
                                return _context10.abrupt('return', {
                                    'info': result,
                                    'id': undefined
                                });

                            case 6:
                            case 'end':
                                return _context10.stop();
                        }
                    }
                }, _callee10, this);
            }));

            function withdraw(_x34, _x35, _x36) {
                return _ref10.apply(this, arguments);
            }

            return withdraw;
        }()
    }, {
        key: 'nonce',
        value: function nonce() {
            return this.milliseconds();
        }
    }, {
        key: 'encodeParams',
        value: function encodeParams(params) {
            if ('orders' in params) {
                var orders = params['orders'];
                var query = this.urlencode(this.keysort(this.omit(params, 'orders')));
                for (var i = 0; i < orders.length; i++) {
                    var order = orders[i];
                    var keys = _Object$keys(order);
                    for (var k = 0; k < keys.length; k++) {
                        var key = keys[k];
                        var value = order[key];
                        query += '&orders%5B%5D%5B' + key + '%5D=' + value.toString();
                    }
                }
                return query;
            }
            return this.urlencode(this.keysort(params));
        }
    }, {
        key: 'sign',
        value: function sign(path) {
            var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var request = '/api' + '/' + this.version + '/' + this.implodeParams(path, params);
            if ('extension' in this.urls) request += this.urls['extension'];
            var query = this.omit(params, this.extractParams(path));
            var url = this.urls['api'] + request;
            if (api == 'public') {
                if (_Object$keys(query).length) {
                    url += '?' + this.urlencode(query);
                }
            } else {
                this.checkRequiredCredentials();
                var nonce = this.nonce().toString();
                var _query = this.encodeParams(this.extend({
                    'access_key': this.apiKey,
                    'tonce': nonce
                }, params));
                var auth = method + '|' + request + '|' + _query;
                var signature = this.hmac(this.encode(auth), this.encode(this.secret));
                var suffix = _query + '&signature=' + signature;
                if (method == 'GET') {
                    url += '?' + suffix;
                } else {
                    body = suffix;
                    headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
                }
            }
            return { 'url': url, 'method': method, 'body': body, 'headers': headers };
        }
    }, {
        key: 'request',
        value: function () {
            var _ref11 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee11(path) {
                var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
                var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;
                var response;
                return _regeneratorRuntime.wrap(function _callee11$(_context11) {
                    while (1) {
                        switch (_context11.prev = _context11.next) {
                            case 0:
                                _context11.next = 2;
                                return this.fetch2(path, api, method, params, headers, body);

                            case 2:
                                response = _context11.sent;

                                if (!('error' in response)) {
                                    _context11.next = 5;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' ' + this.json(response));

                            case 5:
                                return _context11.abrupt('return', response);

                            case 6:
                            case 'end':
                                return _context11.stop();
                        }
                    }
                }, _callee11, this);
            }));

            function request(_x47) {
                return _ref11.apply(this, arguments);
            }

            return request;
        }()
    }]);

    return acx;
}(Exchange);