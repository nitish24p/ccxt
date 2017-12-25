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
    _inherits(btcturk, _Exchange);

    function btcturk() {
        _classCallCheck(this, btcturk);

        return _possibleConstructorReturn(this, (btcturk.__proto__ || _Object$getPrototypeOf(btcturk)).apply(this, arguments));
    }

    _createClass(btcturk, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend(_get(btcturk.prototype.__proto__ || _Object$getPrototypeOf(btcturk.prototype), 'describe', this).call(this), {
                'id': 'btcturk',
                'name': 'BTCTurk',
                'countries': 'TR', // Turkey
                'rateLimit': 1000,
                'hasCORS': true,
                'hasFetchTickers': true,
                'hasFetchOHLCV': true,
                'timeframes': {
                    '1d': '1d'
                },
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/27992709-18e15646-64a3-11e7-9fa2-b0950ec7712f.jpg',
                    'api': 'https://www.btcturk.com/api',
                    'www': 'https://www.btcturk.com',
                    'doc': 'https://github.com/BTCTrader/broker-api-docs'
                },
                'api': {
                    'public': {
                        'get': ['ohlcdata', // ?last=COUNT
                        'orderbook', 'ticker', 'trades']
                    },
                    'private': {
                        'get': ['balance', 'openOrders', 'userTransactions'],
                        'post': ['buy', 'cancelOrder', 'sell']
                    }
                },
                'markets': {
                    'BTC/TRY': { 'id': 'BTCTRY', 'symbol': 'BTC/TRY', 'base': 'BTC', 'quote': 'TRY', 'maker': 0.002 * 1.18, 'taker': 0.0035 * 1.18 },
                    'ETH/TRY': { 'id': 'ETHTRY', 'symbol': 'ETH/TRY', 'base': 'ETH', 'quote': 'TRY', 'maker': 0.002 * 1.18, 'taker': 0.0035 * 1.18 },
                    'ETH/BTC': { 'id': 'ETHBTC', 'symbol': 'ETH/BTC', 'base': 'ETH', 'quote': 'BTC', 'maker': 0.002 * 1.18, 'taker': 0.0035 * 1.18 }
                }
            });
        }
    }, {
        key: 'fetchBalance',
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
                var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var response, result, base, quote, symbol, market;
                return _regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.privateGetBalance();

                            case 2:
                                response = _context.sent;
                                result = { 'info': response };
                                base = {
                                    'free': response['bitcoin_available'],
                                    'used': response['bitcoin_reserved'],
                                    'total': response['bitcoin_balance']
                                };
                                quote = {
                                    'free': response['money_available'],
                                    'used': response['money_reserved'],
                                    'total': response['money_balance']
                                };
                                symbol = this.symbols[0];
                                market = this.markets[symbol];

                                result[market['base']] = base;
                                result[market['quote']] = quote;
                                return _context.abrupt('return', this.parseBalance(result));

                            case 11:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function fetchBalance() {
                return _ref.apply(this, arguments);
            }

            return fetchBalance;
        }()
    }, {
        key: 'fetchOrderBook',
        value: function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var market, orderbook, timestamp;
                return _regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                market = this.market(symbol);
                                _context2.next = 3;
                                return this.publicGetOrderbook(this.extend({
                                    'pairSymbol': market['id']
                                }, params));

                            case 3:
                                orderbook = _context2.sent;
                                timestamp = parseInt(orderbook['timestamp'] * 1000);
                                return _context2.abrupt('return', this.parseOrderBook(orderbook, timestamp));

                            case 6:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function fetchOrderBook(_x3) {
                return _ref2.apply(this, arguments);
            }

            return fetchOrderBook;
        }()
    }, {
        key: 'parseTicker',
        value: function parseTicker(ticker) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var symbol = undefined;
            if (market) symbol = market['symbol'];
            var timestamp = parseInt(ticker['timestamp']) * 1000;
            return {
                'symbol': symbol,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'high': parseFloat(ticker['high']),
                'low': parseFloat(ticker['low']),
                'bid': parseFloat(ticker['bid']),
                'ask': parseFloat(ticker['ask']),
                'vwap': undefined,
                'open': parseFloat(ticker['open']),
                'close': undefined,
                'first': undefined,
                'last': parseFloat(ticker['last']),
                'change': undefined,
                'percentage': undefined,
                'average': parseFloat(ticker['average']),
                'baseVolume': parseFloat(ticker['volume']),
                'quoteVolume': undefined,
                'info': ticker
            };
        }
    }, {
        key: 'fetchTickers',
        value: function () {
            var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3() {
                var symbols = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var tickers, result, i, ticker, symbol, market;
                return _regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context3.next = 4;
                                return this.publicGetTicker(params);

                            case 4:
                                tickers = _context3.sent;
                                result = {};

                                for (i = 0; i < tickers.length; i++) {
                                    ticker = tickers[i];
                                    symbol = ticker['pair'];
                                    market = undefined;

                                    if (symbol in this.markets_by_id) {
                                        market = this.markets_by_id[symbol];
                                        symbol = market['symbol'];
                                    }
                                    result[symbol] = this.parseTicker(ticker, market);
                                }
                                return _context3.abrupt('return', result);

                            case 8:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function fetchTickers() {
                return _ref3.apply(this, arguments);
            }

            return fetchTickers;
        }()
    }, {
        key: 'fetchTicker',
        value: function () {
            var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee4(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var tickers, result;
                return _regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context4.next = 4;
                                return this.fetchTickers();

                            case 4:
                                tickers = _context4.sent;
                                result = undefined;

                                if (symbol in tickers) result = tickers[symbol];
                                return _context4.abrupt('return', result);

                            case 8:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function fetchTicker(_x8) {
                return _ref4.apply(this, arguments);
            }

            return fetchTicker;
        }()
    }, {
        key: 'parseTrade',
        value: function parseTrade(trade, market) {
            var timestamp = trade['date'] * 1000;
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
        key: 'fetchTrades',
        value: function () {
            var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee5(symbol) {
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var market, response;
                return _regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                market = this.market(symbol);
                                // let maxCount = 50;

                                _context5.next = 3;
                                return this.publicGetTrades(this.extend({
                                    'pairSymbol': market['id']
                                }, params));

                            case 3:
                                response = _context5.sent;
                                return _context5.abrupt('return', this.parseTrades(response, market, since, limit));

                            case 5:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function fetchTrades(_x12) {
                return _ref5.apply(this, arguments);
            }

            return fetchTrades;
        }()
    }, {
        key: 'parseOHLCV',
        value: function parseOHLCV(ohlcv) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
            var timeframe = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '1d';
            var since = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
            var limit = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;

            var timestamp = this.parse8601(ohlcv['Time']);
            return [timestamp, ohlcv['Open'], ohlcv['High'], ohlcv['Low'], ohlcv['Close'], ohlcv['Volume']];
        }
    }, {
        key: 'fetchOHLCV',
        value: function () {
            var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee6(symbol) {
                var timeframe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '1d';
                var since = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var limit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
                var params = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
                var market, request, response;
                return _regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                _context6.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                request = {};

                                if (limit) request['last'] = limit;
                                _context6.next = 7;
                                return this.publicGetOhlcdata(this.extend(request, params));

                            case 7:
                                response = _context6.sent;
                                return _context6.abrupt('return', this.parseOHLCVs(response, market, timeframe, since, limit));

                            case 9:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function fetchOHLCV(_x21) {
                return _ref6.apply(this, arguments);
            }

            return fetchOHLCV;
        }()
    }, {
        key: 'createOrder',
        value: function () {
            var _ref7 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee7(symbol, type, side, amount) {
                var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
                var method, order, response;
                return _regeneratorRuntime.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                method = 'privatePost' + this.capitalize(side);
                                order = {
                                    'Type': side == 'buy' ? 'BuyBtc' : 'SelBtc',
                                    'IsMarketOrder': type == 'market' ? 1 : 0
                                };

                                if (type == 'market') {
                                    if (side == 'buy') order['Total'] = amount;else order['Amount'] = amount;
                                } else {
                                    order['Price'] = price;
                                    order['Amount'] = amount;
                                }
                                _context7.next = 5;
                                return this[method](this.extend(order, params));

                            case 5:
                                response = _context7.sent;
                                return _context7.abrupt('return', {
                                    'info': response,
                                    'id': response['id']
                                });

                            case 7:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function createOrder(_x24, _x25, _x26, _x27) {
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
                                return this.privatePostCancelOrder({ 'id': id });

                            case 2:
                                return _context8.abrupt('return', _context8.sent);

                            case 3:
                            case 'end':
                                return _context8.stop();
                        }
                    }
                }, _callee8, this);
            }));

            function cancelOrder(_x30) {
                return _ref8.apply(this, arguments);
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

            if (this.id == 'btctrader') throw new ExchangeError(this.id + ' is an abstract base API for BTCExchange, BTCTurk');
            var url = this.urls['api'] + '/' + path;
            if (api == 'public') {
                if (_Object$keys(params).length) url += '?' + this.urlencode(params);
            } else {
                this.checkRequiredCredentials();
                var nonce = this.nonce().toString();
                body = this.urlencode(params);
                var secret = this.base64ToBinary(this.secret);
                var auth = this.apiKey + nonce;
                headers = {
                    'X-PCK': this.apiKey,
                    'X-Stamp': nonce,
                    'X-Signature': this.stringToBase64(this.hmac(this.encode(auth), secret, 'sha256', 'binary')),
                    'Content-Type': 'application/x-www-form-urlencoded'
                };
            }
            return { 'url': url, 'method': method, 'body': body, 'headers': headers };
        }
    }]);

    return btcturk;
}(Exchange);