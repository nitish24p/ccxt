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
    ExchangeError = _require.ExchangeError;

//  ---------------------------------------------------------------------------

module.exports = function (_Exchange) {
    _inherits(huobi, _Exchange);

    function huobi() {
        _classCallCheck(this, huobi);

        return _possibleConstructorReturn(this, (huobi.__proto__ || _Object$getPrototypeOf(huobi)).apply(this, arguments));
    }

    _createClass(huobi, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend(_get(huobi.prototype.__proto__ || _Object$getPrototypeOf(huobi.prototype), 'describe', this).call(this), {
                'id': 'huobi',
                'name': 'Huobi',
                'countries': 'CN',
                'rateLimit': 2000,
                'version': 'v3',
                'hasCORS': false,
                'hasFetchOHLCV': true,
                'timeframes': {
                    '1m': '001',
                    '5m': '005',
                    '15m': '015',
                    '30m': '030',
                    '1h': '060',
                    '1d': '100',
                    '1w': '200',
                    '1M': '300',
                    '1y': '400'
                },
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/27766569-15aa7b9a-5edd-11e7-9e7f-44791f4ee49c.jpg',
                    'api': 'http://api.huobi.com',
                    'www': 'https://www.huobi.com',
                    'doc': 'https://github.com/huobiapi/API_Docs_en/wiki'
                },
                'api': {
                    'staticmarket': {
                        'get': ['{id}_kline_{period}', 'ticker_{id}', 'depth_{id}', 'depth_{id}_{length}', 'detail_{id}']
                    },
                    'usdmarket': {
                        'get': ['{id}_kline_{period}', 'ticker_{id}', 'depth_{id}', 'depth_{id}_{length}', 'detail_{id}']
                    },
                    'trade': {
                        'post': ['get_account_info', 'get_orders', 'order_info', 'buy', 'sell', 'buy_market', 'sell_market', 'cancel_order', 'get_new_deal_orders', 'get_order_id_by_trade_id', 'withdraw_coin', 'cancel_withdraw_coin', 'get_withdraw_coin_result', 'transfer', 'loan', 'repayment', 'get_loan_available', 'get_loans']
                    }
                },
                'markets': {
                    'BTC/CNY': { 'id': 'btc', 'symbol': 'BTC/CNY', 'base': 'BTC', 'quote': 'CNY', 'type': 'staticmarket', 'coinType': 1 },
                    'LTC/CNY': { 'id': 'ltc', 'symbol': 'LTC/CNY', 'base': 'LTC', 'quote': 'CNY', 'type': 'staticmarket', 'coinType': 2 }
                    // 'BTC/USD': { 'id': 'btc', 'symbol': 'BTC/USD', 'base': 'BTC', 'quote': 'USD', 'type': 'usdmarket',    'coinType': 1 },
                }
            });
        }
    }, {
        key: 'fetchBalance',
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
                var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var balances, result, currencies, i, currency, lowercase, account, available, frozen, loan;
                return _regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.tradePostGetAccountInfo();

                            case 2:
                                balances = _context.sent;
                                result = { 'info': balances };
                                currencies = _Object$keys(this.currencies);

                                for (i = 0; i < currencies.length; i++) {
                                    currency = currencies[i];
                                    lowercase = currency.toLowerCase();
                                    account = this.account();
                                    available = 'available_' + lowercase + '_display';
                                    frozen = 'frozen_' + lowercase + '_display';
                                    loan = 'loan_' + lowercase + '_display';

                                    if (available in balances) account['free'] = parseFloat(balances[available]);
                                    if (frozen in balances) account['used'] = parseFloat(balances[frozen]);
                                    if (loan in balances) account['used'] = this.sum(account['used'], parseFloat(balances[loan]));
                                    account['total'] = this.sum(account['free'], account['used']);
                                    result[currency] = account;
                                }
                                return _context.abrupt('return', this.parseBalance(result));

                            case 7:
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
                var market, method, orderbook;
                return _regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                market = this.market(symbol);
                                method = market['type'] + 'GetDepthId';
                                _context2.next = 4;
                                return this[method](this.extend({ 'id': market['id'] }, params));

                            case 4:
                                orderbook = _context2.sent;
                                return _context2.abrupt('return', this.parseOrderBook(orderbook));

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
        key: 'fetchTicker',
        value: function () {
            var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var market, method, response, ticker, timestamp;
                return _regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                market = this.market(symbol);
                                method = market['type'] + 'GetTickerId';
                                _context3.next = 4;
                                return this[method](this.extend({
                                    'id': market['id']
                                }, params));

                            case 4:
                                response = _context3.sent;
                                ticker = response['ticker'];
                                timestamp = parseInt(response['time']) * 1000;
                                return _context3.abrupt('return', {
                                    'symbol': symbol,
                                    'timestamp': timestamp,
                                    'datetime': this.iso8601(timestamp),
                                    'high': this.safeFloat(ticker, 'high'),
                                    'low': this.safeFloat(ticker, 'low'),
                                    'bid': this.safeFloat(ticker, 'buy'),
                                    'ask': this.safeFloat(ticker, 'sell'),
                                    'vwap': undefined,
                                    'open': this.safeFloat(ticker, 'open'),
                                    'close': undefined,
                                    'first': undefined,
                                    'last': this.safeFloat(ticker, 'last'),
                                    'change': undefined,
                                    'percentage': undefined,
                                    'average': undefined,
                                    'baseVolume': undefined,
                                    'quoteVolume': this.safeFloat(ticker, 'vol'),
                                    'info': ticker
                                });

                            case 8:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function fetchTicker(_x5) {
                return _ref3.apply(this, arguments);
            }

            return fetchTicker;
        }()
    }, {
        key: 'parseTrade',
        value: function parseTrade(trade, market) {
            var timestamp = trade['ts'];
            return {
                'info': trade,
                'id': trade['id'].toString(),
                'order': undefined,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'symbol': market['symbol'],
                'type': undefined,
                'side': trade['direction'],
                'price': trade['price'],
                'amount': trade['amount']
            };
        }
    }, {
        key: 'fetchTrades',
        value: function () {
            var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee4(symbol) {
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var market, method, response;
                return _regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                market = this.market(symbol);
                                method = market['type'] + 'GetDetailId';
                                _context4.next = 4;
                                return this[method](this.extend({
                                    'id': market['id']
                                }, params));

                            case 4:
                                response = _context4.sent;
                                return _context4.abrupt('return', this.parseTrades(response['trades'], market, since, limit));

                            case 6:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function fetchTrades(_x9) {
                return _ref4.apply(this, arguments);
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

            // not implemented yet
            return [ohlcv[0], ohlcv[1], ohlcv[2], ohlcv[3], ohlcv[4], ohlcv[6]];
        }
    }, {
        key: 'fetchOHLCV',
        value: function () {
            var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee5(symbol) {
                var timeframe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '1m';
                var since = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var limit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
                var params = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
                var market, method, ohlcvs;
                return _regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                market = this.market(symbol);
                                method = market['type'] + 'GetIdKlinePeriod';
                                _context5.next = 4;
                                return this[method](this.extend({
                                    'id': market['id'],
                                    'period': this.timeframes[timeframe]
                                }, params));

                            case 4:
                                ohlcvs = _context5.sent;
                                return _context5.abrupt('return', ohlcvs);

                            case 6:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function fetchOHLCV(_x18) {
                return _ref5.apply(this, arguments);
            }

            return fetchOHLCV;
        }()
    }, {
        key: 'createOrder',
        value: function () {
            var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee6(symbol, type, side, amount) {
                var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
                var market, method, order, response;
                return _regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                market = this.market(symbol);
                                method = 'tradePost' + this.capitalize(side);
                                order = {
                                    'coin_type': market['coinType'],
                                    'amount': amount,
                                    'market': market['quote'].toLowerCase()
                                };

                                if (type == 'limit') order['price'] = price;else method += this.capitalize(type);
                                response = this[method](this.extend(order, params));
                                return _context6.abrupt('return', {
                                    'info': response,
                                    'id': response['id']
                                });

                            case 6:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function createOrder(_x21, _x22, _x23, _x24) {
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
                return _regeneratorRuntime.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                _context7.next = 2;
                                return this.tradePostCancelOrder({ 'id': id });

                            case 2:
                                return _context7.abrupt('return', _context7.sent);

                            case 3:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function cancelOrder(_x27) {
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

            var url = this.urls['api'];
            if (api == 'trade') {
                this.checkRequiredCredentials();
                url += '/api' + this.version;
                var query = this.keysort(this.extend({
                    'method': path,
                    'access_key': this.apiKey,
                    'created': this.nonce()
                }, params));
                var queryString = this.urlencode(this.omit(query, 'market'));
                // secret key must be appended to the query before signing
                queryString += '&secret_key=' + this.secret;
                query['sign'] = this.hash(this.encode(queryString));
                body = this.urlencode(query);
                headers = {
                    'Content-Type': 'application/x-www-form-urlencoded'
                };
            } else {
                url += '/' + api + '/' + this.implodeParams(path, params) + '_json.js';
                var _query = this.omit(params, this.extractParams(path));
                if (_Object$keys(_query).length) url += '?' + this.urlencode(_query);
            }
            return { 'url': url, 'method': method, 'body': body, 'headers': headers };
        }
    }, {
        key: 'request',
        value: function () {
            var _ref8 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee8(path) {
                var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'trade';
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
                                    _context8.next = 6;
                                    break;
                                }

                                if (!(response['status'] == 'error')) {
                                    _context8.next = 6;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' ' + this.json(response));

                            case 6:
                                if (!('code' in response)) {
                                    _context8.next = 8;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' ' + this.json(response));

                            case 8:
                                return _context8.abrupt('return', response);

                            case 9:
                            case 'end':
                                return _context8.stop();
                        }
                    }
                }, _callee8, this);
            }));

            function request(_x38) {
                return _ref8.apply(this, arguments);
            }

            return request;
        }()
    }]);

    return huobi;
}(Exchange);