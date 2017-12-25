"use strict";

//  ---------------------------------------------------------------------------

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
    AuthenticationError = _require.AuthenticationError;

//  ---------------------------------------------------------------------------

module.exports = function (_Exchange) {
    _inherits(btcchina, _Exchange);

    function btcchina() {
        _classCallCheck(this, btcchina);

        return _possibleConstructorReturn(this, (btcchina.__proto__ || _Object$getPrototypeOf(btcchina)).apply(this, arguments));
    }

    _createClass(btcchina, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend(_get(btcchina.prototype.__proto__ || _Object$getPrototypeOf(btcchina.prototype), 'describe', this).call(this), {
                'id': 'btcchina',
                'name': 'BTCChina',
                'countries': 'CN',
                'rateLimit': 1500,
                'version': 'v1',
                'hasCORS': true,
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/27766368-465b3286-5ed6-11e7-9a11-0f6467e1d82b.jpg',
                    'api': {
                        'plus': 'https://plus-api.btcchina.com/market',
                        'public': 'https://data.btcchina.com/data',
                        'private': 'https://api.btcchina.com/api_trade_v1.php'
                    },
                    'www': 'https://www.btcchina.com',
                    'doc': 'https://www.btcchina.com/apidocs'
                },
                'api': {
                    'plus': {
                        'get': ['orderbook', 'ticker', 'trade']
                    },
                    'public': {
                        'get': ['historydata', 'orderbook', 'ticker', 'trades']
                    },
                    'private': {
                        'post': ['BuyIcebergOrder', 'BuyOrder', 'BuyOrder2', 'BuyStopOrder', 'CancelIcebergOrder', 'CancelOrder', 'CancelStopOrder', 'GetAccountInfo', 'getArchivedOrder', 'getArchivedOrders', 'GetDeposits', 'GetIcebergOrder', 'GetIcebergOrders', 'GetMarketDepth', 'GetMarketDepth2', 'GetOrder', 'GetOrders', 'GetStopOrder', 'GetStopOrders', 'GetTransactions', 'GetWithdrawal', 'GetWithdrawals', 'RequestWithdrawal', 'SellIcebergOrder', 'SellOrder', 'SellOrder2', 'SellStopOrder']
                    }
                },
                'markets': {
                    'BTC/CNY': { 'id': 'btccny', 'symbol': 'BTC/CNY', 'base': 'BTC', 'quote': 'CNY', 'api': 'public', 'plus': false },
                    'LTC/CNY': { 'id': 'ltccny', 'symbol': 'LTC/CNY', 'base': 'LTC', 'quote': 'CNY', 'api': 'public', 'plus': false },
                    'LTC/BTC': { 'id': 'ltcbtc', 'symbol': 'LTC/BTC', 'base': 'LTC', 'quote': 'BTC', 'api': 'public', 'plus': false },
                    'BCH/CNY': { 'id': 'bcccny', 'symbol': 'BCH/CNY', 'base': 'BCH', 'quote': 'CNY', 'api': 'plus', 'plus': true },
                    'ETH/CNY': { 'id': 'ethcny', 'symbol': 'ETH/CNY', 'base': 'ETH', 'quote': 'CNY', 'api': 'plus', 'plus': true }
                }
            });
        }
    }, {
        key: 'fetchMarkets',
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
                var markets, result, keys, p, key, market, parts, id, base, quote, symbol;
                return _regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.publicGetTicker({
                                    'market': 'all'
                                });

                            case 2:
                                markets = _context.sent;
                                result = [];
                                keys = _Object$keys(markets);

                                for (p = 0; p < keys.length; p++) {
                                    key = keys[p];
                                    market = markets[key];
                                    parts = key.split('_');
                                    id = parts[1];
                                    base = id.slice(0, 3);
                                    quote = id.slice(3, 6);

                                    base = base.toUpperCase();
                                    quote = quote.toUpperCase();
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
                var response, balances, result, currencies, i, currency, lowercase, account;
                return _regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context2.next = 4;
                                return this.privatePostGetAccountInfo();

                            case 4:
                                response = _context2.sent;
                                balances = response['result'];
                                result = { 'info': balances };
                                currencies = _Object$keys(this.currencies);

                                for (i = 0; i < currencies.length; i++) {
                                    currency = currencies[i];
                                    lowercase = currency.toLowerCase();
                                    account = this.account();

                                    if (lowercase in balances['balance']) account['total'] = parseFloat(balances['balance'][lowercase]['amount']);
                                    if (lowercase in balances['frozen']) account['used'] = parseFloat(balances['frozen'][lowercase]['amount']);
                                    account['free'] = account['total'] - account['used'];
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
        key: 'createMarketRequest',
        value: function createMarketRequest(market) {
            var request = {};
            var field = market['plus'] ? 'symbol' : 'market';
            request[field] = market['id'];
            return request;
        }
    }, {
        key: 'fetchOrderBook',
        value: function () {
            var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var market, method, request, orderbook, timestamp, result;
                return _regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                method = market['api'] + 'GetOrderbook';
                                request = this.createMarketRequest(market);
                                _context3.next = 7;
                                return this[method](this.extend(request, params));

                            case 7:
                                orderbook = _context3.sent;
                                timestamp = orderbook['date'] * 1000;
                                result = this.parseOrderBook(orderbook, timestamp);

                                result['asks'] = this.sortBy(result['asks'], 0);
                                return _context3.abrupt('return', result);

                            case 12:
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
        value: function parseTicker(ticker, market) {
            var timestamp = ticker['date'] * 1000;
            return {
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'high': parseFloat(ticker['high']),
                'low': parseFloat(ticker['low']),
                'bid': parseFloat(ticker['buy']),
                'ask': parseFloat(ticker['sell']),
                'vwap': parseFloat(ticker['vwap']),
                'open': parseFloat(ticker['open']),
                'close': parseFloat(ticker['prev_close']),
                'first': undefined,
                'last': parseFloat(ticker['last']),
                'change': undefined,
                'percentage': undefined,
                'average': undefined,
                'baseVolume': parseFloat(ticker['vol']),
                'quoteVolume': undefined,
                'info': ticker
            };
        }
    }, {
        key: 'parseTickerPlus',
        value: function parseTickerPlus(ticker, market) {
            var timestamp = ticker['Timestamp'];
            var symbol = undefined;
            if (market) symbol = market['symbol'];
            return {
                'symbol': symbol,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'high': parseFloat(ticker['High']),
                'low': parseFloat(ticker['Low']),
                'bid': parseFloat(ticker['BidPrice']),
                'ask': parseFloat(ticker['AskPrice']),
                'vwap': undefined,
                'open': parseFloat(ticker['Open']),
                'close': parseFloat(ticker['PrevCls']),
                'first': undefined,
                'last': parseFloat(ticker['Last']),
                'change': undefined,
                'percentage': undefined,
                'average': undefined,
                'baseVolume': parseFloat(ticker['Volume24H']),
                'quoteVolume': undefined,
                'info': ticker
            };
        }
    }, {
        key: 'fetchTicker',
        value: function () {
            var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee4(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var market, method, request, tickers, ticker;
                return _regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                method = market['api'] + 'GetTicker';
                                request = this.createMarketRequest(market);
                                _context4.next = 7;
                                return this[method](this.extend(request, params));

                            case 7:
                                tickers = _context4.sent;
                                ticker = tickers['ticker'];

                                if (!market['plus']) {
                                    _context4.next = 11;
                                    break;
                                }

                                return _context4.abrupt('return', this.parseTickerPlus(ticker, market));

                            case 11:
                                return _context4.abrupt('return', this.parseTicker(ticker, market));

                            case 12:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function fetchTicker(_x5) {
                return _ref4.apply(this, arguments);
            }

            return fetchTicker;
        }()
    }, {
        key: 'parseTrade',
        value: function parseTrade(trade, market) {
            var timestamp = parseInt(trade['date']) * 1000;
            return {
                'id': trade['tid'],
                'info': trade,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'symbol': market['symbol'],
                'type': undefined,
                'side': undefined,
                'price': trade['price'],
                'amount': trade['amount']
            };
        }
    }, {
        key: 'parseTradePlus',
        value: function parseTradePlus(trade, market) {
            var timestamp = this.parse8601(trade['timestamp']);
            return {
                'id': undefined,
                'info': trade,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'symbol': market['symbol'],
                'type': undefined,
                'side': trade['side'].toLowerCase(),
                'price': trade['price'],
                'amount': trade['size']
            };
        }
    }, {
        key: 'parseTradesPlus',
        value: function parseTradesPlus(trades) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var result = [];
            for (var i = 0; i < trades.length; i++) {
                result.push(this.parseTradePlus(trades[i], market));
            }
            return result;
        }
    }, {
        key: 'fetchTrades',
        value: function () {
            var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee5(symbol) {
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var market, method, request, now, response;
                return _regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                method = market['api'] + 'GetTrade';
                                request = this.createMarketRequest(market);

                                if (market['plus']) {
                                    now = this.milliseconds();

                                    request['start_time'] = now - 86400 * 1000;
                                    request['end_time'] = now;
                                } else {
                                    method += 's'; // trades vs trade
                                }
                                _context5.next = 8;
                                return this[method](this.extend(request, params));

                            case 8:
                                response = _context5.sent;

                                if (!market['plus']) {
                                    _context5.next = 11;
                                    break;
                                }

                                return _context5.abrupt('return', this.parseTradesPlus(response['trades'], market));

                            case 11:
                                return _context5.abrupt('return', this.parseTrades(response, market, since, limit));

                            case 12:
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
            var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee6(symbol, type, side, amount) {
                var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
                var market, method, order, id, response;
                return _regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                _context6.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                method = 'privatePost' + this.capitalize(side) + 'Order2';
                                order = {};
                                id = market['id'].toUpperCase();

                                if (type == 'market') {
                                    order['params'] = [undefined, amount, id];
                                } else {
                                    order['params'] = [price, amount, id];
                                }
                                _context6.next = 9;
                                return this[method](this.extend(order, params));

                            case 9:
                                response = _context6.sent;
                                return _context6.abrupt('return', {
                                    'info': response,
                                    'id': response['id']
                                });

                            case 11:
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
            var _ref7 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee7(id) {
                var symbol = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
                var market;
                return _regeneratorRuntime.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                _context7.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = params['market']; // TODO fixme

                                _context7.next = 5;
                                return this.privatePostCancelOrder(this.extend({
                                    'params': [id, market]
                                }, params));

                            case 5:
                                return _context7.abrupt('return', _context7.sent);

                            case 6:
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
        key: 'nonce',
        value: function nonce() {
            return this.microseconds();
        }
    }, {
        key: 'sign',
        value: function sign(path) {
            var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var url = this.urls['api'][api] + '/' + path;
            if (api == 'private') {
                this.checkRequiredCredentials();
                var p = [];
                if ('params' in params) p = params['params'];
                var nonce = this.nonce();
                var request = {
                    'method': path,
                    'id': nonce,
                    'params': p
                };
                p = p.join(',');
                body = this.json(request);
                var query = 'tonce=' + nonce + '&accesskey=' + this.apiKey + '&requestmethod=' + method.toLowerCase() + '&id=' + nonce + '&method=' + path + '&params=' + p;
                var signature = this.hmac(this.encode(query), this.encode(this.secret), 'sha1');
                var auth = this.encode(this.apiKey + ':' + signature);
                headers = {
                    'Authorization': 'Basic ' + this.stringToBase64(auth),
                    'Json-Rpc-Tonce': nonce
                };
            } else {
                if (_Object$keys(params).length) url += '?' + this.urlencode(params);
            }
            return { 'url': url, 'method': method, 'body': body, 'headers': headers };
        }
    }]);

    return btcchina;
}(Exchange);