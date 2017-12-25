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
    _inherits(huobipro, _Exchange);

    function huobipro() {
        _classCallCheck(this, huobipro);

        return _possibleConstructorReturn(this, (huobipro.__proto__ || _Object$getPrototypeOf(huobipro)).apply(this, arguments));
    }

    _createClass(huobipro, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend(_get(huobipro.prototype.__proto__ || _Object$getPrototypeOf(huobipro.prototype), 'describe', this).call(this), {
                'id': 'huobipro',
                'name': 'Huobi Pro',
                'countries': 'CN',
                'rateLimit': 2000,
                'userAgent': this.userAgents['chrome39'],
                'version': 'v1',
                'accounts': undefined,
                'accountsById': undefined,
                'hostname': 'api.huobi.pro',
                'hasCORS': false,
                // obsolete metainfo structure
                'hasFetchOHLCV': true,
                'hasFetchOrders': true,
                'hasFetchOpenOrders': true,
                // new metainfo structure
                'has': {
                    'fetchOHCLV': true,
                    'fetchOrders': true,
                    'fetchOpenOrders': true
                },
                'timeframes': {
                    '1m': '1min',
                    '5m': '5min',
                    '15m': '15min',
                    '30m': '30min',
                    '1h': '60min',
                    '1d': '1day',
                    '1w': '1week',
                    '1M': '1mon',
                    '1y': '1year'
                },
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/27766569-15aa7b9a-5edd-11e7-9e7f-44791f4ee49c.jpg',
                    'api': 'https://api.huobi.pro',
                    'www': 'https://www.huobi.pro',
                    'doc': 'https://github.com/huobiapi/API_Docs/wiki/REST_api_reference'
                },
                'api': {
                    'market': {
                        'get': ['history/kline', // 获取K线数据
                        'detail/merged', // 获取聚合行情(Ticker)
                        'depth', // 获取 Market Depth 数据
                        'trade', // 获取 Trade Detail 数据
                        'history/trade', // 批量获取最近的交易记录
                        'detail']
                    },
                    'public': {
                        'get': ['common/symbols', // 查询系统支持的所有交易对
                        'common/currencys', // 查询系统支持的所有币种
                        'common/timestamp']
                    },
                    'private': {
                        'get': ['account/accounts', // 查询当前用户的所有账户(即account-id)
                        'account/accounts/{id}/balance', // 查询指定账户的余额
                        'order/orders/{id}', // 查询某个订单详情
                        'order/orders/{id}/matchresults', // 查询某个订单的成交明细
                        'order/orders', // 查询当前委托、历史委托
                        'order/matchresults', // 查询当前成交、历史成交
                        'dw/withdraw-virtual/addresses'],
                        'post': ['order/orders/place', // 创建并执行一个新订单 (一步下单， 推荐使用)
                        'order/orders', // 创建一个新的订单请求 （仅创建订单，不执行下单）
                        'order/orders/{id}/place', // 执行一个订单 （仅执行已创建的订单）
                        'order/orders/{id}/submitcancel', // 申请撤销一个订单请求
                        'order/orders/batchcancel', // 批量撤销订单
                        'dw/balance/transfer', // 资产划转
                        'dw/withdraw-virtual/create', // 申请提现虚拟币
                        'dw/withdraw-virtual/{id}/place', // 确认申请虚拟币提现
                        'dw/withdraw-virtual/{id}/cancel']
                    }
                }
            });
        }
    }, {
        key: 'fetchMarkets',
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
                var response, markets, numMarkets, result, i, market, baseId, quoteId, base, quote, id, symbol, precision, lot, maker, taker;
                return _regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.publicGetCommonSymbols();

                            case 2:
                                response = _context.sent;
                                markets = response['data'];
                                numMarkets = markets.length;

                                if (!(numMarkets < 1)) {
                                    _context.next = 7;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' publicGetCommonSymbols returned empty response: ' + this.json(response));

                            case 7:
                                result = [];

                                for (i = 0; i < markets.length; i++) {
                                    market = markets[i];
                                    baseId = market['base-currency'];
                                    quoteId = market['quote-currency'];
                                    base = baseId.toUpperCase();
                                    quote = quoteId.toUpperCase();
                                    id = baseId + quoteId;

                                    base = this.commonCurrencyCode(base);
                                    quote = this.commonCurrencyCode(quote);
                                    symbol = base + '/' + quote;
                                    precision = {
                                        'amount': market['amount-precision'],
                                        'price': market['price-precision']
                                    };
                                    lot = Math.pow(10, -precision['amount']);
                                    maker = base == 'OMG' ? 0 : 0.2 / 100;
                                    taker = base == 'OMG' ? 0 : 0.2 / 100;

                                    result.push({
                                        'id': id,
                                        'symbol': symbol,
                                        'base': base,
                                        'quote': quote,
                                        'lot': lot,
                                        'precision': precision,
                                        'taker': taker,
                                        'maker': maker,
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
                                        },
                                        'info': market
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
        key: 'parseTicker',
        value: function parseTicker(ticker) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var symbol = undefined;
            if (market) symbol = market['symbol'];
            var last = undefined;
            if ('last' in ticker) last = ticker['last'];
            var timestamp = this.milliseconds();
            if ('ts' in ticker) timestamp = ticker['ts'];
            var bid = undefined;
            var ask = undefined;
            if ('bid' in ticker) {
                if (ticker['bid']) bid = this.safeFloat(ticker['bid'], 0);
            }
            if ('ask' in ticker) {
                if (ticker['ask']) ask = this.safeFloat(ticker['ask'], 0);
            }
            return {
                'symbol': symbol,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'high': ticker['high'],
                'low': ticker['low'],
                'bid': bid,
                'ask': ask,
                'vwap': undefined,
                'open': ticker['open'],
                'close': ticker['close'],
                'first': undefined,
                'last': last,
                'change': undefined,
                'percentage': undefined,
                'average': undefined,
                'baseVolume': parseFloat(ticker['amount']),
                'quoteVolume': ticker['vol'],
                'info': ticker
            };
        }
    }, {
        key: 'fetchOrderBook',
        value: function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var market, response;
                return _regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                _context2.next = 5;
                                return this.marketGetDepth(this.extend({
                                    'symbol': market['id'],
                                    'type': 'step0'
                                }, params));

                            case 5:
                                response = _context2.sent;

                                if (!('tick' in response)) {
                                    _context2.next = 10;
                                    break;
                                }

                                if (response['tick']) {
                                    _context2.next = 9;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' fetchOrderBook() returned empty response: ' + this.json(response));

                            case 9:
                                return _context2.abrupt('return', this.parseOrderBook(response['tick'], response['tick']['ts']));

                            case 10:
                                throw new ExchangeError(this.id + ' fetchOrderBook() returned unrecognized response: ' + this.json(response));

                            case 11:
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
                var market, response;
                return _regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                _context3.next = 5;
                                return this.marketGetDetailMerged(this.extend({
                                    'symbol': market['id']
                                }, params));

                            case 5:
                                response = _context3.sent;
                                return _context3.abrupt('return', this.parseTicker(response['tick'], market));

                            case 7:
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
        key: 'parseTradesData',
        value: function parseTradesData(data, market) {
            var since = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
            var limit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;

            var result = [];
            for (var i = 0; i < data.length; i++) {
                var trades = this.parseTrades(data[i]['data'], market, since, limit);
                for (var k = 0; k < trades.length; k++) {
                    result.push(trades[k]);
                }
            }
            return result;
        }
    }, {
        key: 'fetchTrades',
        value: function () {
            var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee4(symbol) {
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var market, response;
                return _regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                _context4.next = 5;
                                return this.marketGetHistoryTrade(this.extend({
                                    'symbol': market['id'],
                                    'size': 2000
                                }, params));

                            case 5:
                                response = _context4.sent;
                                return _context4.abrupt('return', this.parseTradesData(response['data'], market, since, limit));

                            case 7:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function fetchTrades(_x11) {
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

            return [ohlcv['id'] * 1000, ohlcv['open'], ohlcv['high'], ohlcv['low'], ohlcv['close'], ohlcv['vol']];
        }
    }, {
        key: 'fetchOHLCV',
        value: function () {
            var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee5(symbol) {
                var timeframe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '1m';
                var since = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var limit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
                var params = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
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
                                return this.marketGetHistoryKline(this.extend({
                                    'symbol': market['id'],
                                    'period': this.timeframes[timeframe],
                                    'size': 2000 // max = 2000
                                }, params));

                            case 5:
                                response = _context5.sent;
                                return _context5.abrupt('return', this.parseOHLCVs(response['data'], market, timeframe, since, limit));

                            case 7:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function fetchOHLCV(_x20) {
                return _ref5.apply(this, arguments);
            }

            return fetchOHLCV;
        }()
    }, {
        key: 'loadAccounts',
        value: function () {
            var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee6() {
                var reload = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
                return _regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                if (!reload) {
                                    _context6.next = 6;
                                    break;
                                }

                                _context6.next = 3;
                                return this.fetchAccounts();

                            case 3:
                                this.accounts = _context6.sent;
                                _context6.next = 14;
                                break;

                            case 6:
                                if (!this.accounts) {
                                    _context6.next = 10;
                                    break;
                                }

                                return _context6.abrupt('return', this.accounts);

                            case 10:
                                _context6.next = 12;
                                return this.fetchAccounts();

                            case 12:
                                this.accounts = _context6.sent;

                                this.accountsById = this.indexBy(this.accounts, 'id');

                            case 14:
                                return _context6.abrupt('return', this.accounts);

                            case 15:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function loadAccounts() {
                return _ref6.apply(this, arguments);
            }

            return loadAccounts;
        }()
    }, {
        key: 'fetchAccounts',
        value: function () {
            var _ref7 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee7() {
                var response;
                return _regeneratorRuntime.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                _context7.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context7.next = 4;
                                return this.privateGetAccountAccounts();

                            case 4:
                                response = _context7.sent;
                                return _context7.abrupt('return', response['data']);

                            case 6:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function fetchAccounts() {
                return _ref7.apply(this, arguments);
            }

            return fetchAccounts;
        }()
    }, {
        key: 'fetchBalance',
        value: function () {
            var _ref8 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee8() {
                var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var response, balances, result, i, balance, uppercase, currency, account;
                return _regeneratorRuntime.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                _context8.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context8.next = 4;
                                return this.loadAccounts();

                            case 4:
                                _context8.next = 6;
                                return this.privateGetAccountAccountsIdBalance(this.extend({
                                    'id': this.accounts[0]['id']
                                }, params));

                            case 6:
                                response = _context8.sent;
                                balances = response['data']['list'];
                                result = { 'info': response };

                                for (i = 0; i < balances.length; i++) {
                                    balance = balances[i];
                                    uppercase = balance['currency'].toUpperCase();
                                    currency = this.commonCurrencyCode(uppercase);
                                    account = undefined;

                                    if (currency in result) account = result[currency];else account = this.account();
                                    if (balance['type'] == 'trade') account['free'] = parseFloat(balance['balance']);
                                    if (balance['type'] == 'frozen') account['used'] = parseFloat(balance['balance']);
                                    account['total'] = this.sum(account['free'], account['used']);
                                    result[currency] = account;
                                }
                                return _context8.abrupt('return', this.parseBalance(result));

                            case 11:
                            case 'end':
                                return _context8.stop();
                        }
                    }
                }, _callee8, this);
            }));

            function fetchBalance() {
                return _ref8.apply(this, arguments);
            }

            return fetchBalance;
        }()
    }, {
        key: 'fetchOrders',
        value: function () {
            var _ref9 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee9() {
                var symbol = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var market, status, response;
                return _regeneratorRuntime.wrap(function _callee9$(_context9) {
                    while (1) {
                        switch (_context9.prev = _context9.next) {
                            case 0:
                                if (symbol) {
                                    _context9.next = 2;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' fetchOrders() requires a symbol parameter');

                            case 2:
                                this.load_markets();
                                market = this.market(symbol);
                                status = undefined;

                                if (!('type' in params)) {
                                    _context9.next = 9;
                                    break;
                                }

                                status = params['type'];
                                _context9.next = 14;
                                break;

                            case 9:
                                if (!('status' in params)) {
                                    _context9.next = 13;
                                    break;
                                }

                                status = params['status'];
                                _context9.next = 14;
                                break;

                            case 13:
                                throw new ExchangeError(this.id + ' fetchOrders() requires type param or status param for spot market ' + symbol + '(0 or "open" for unfilled or partial filled orders, 1 or "closed" for filled orders)');

                            case 14:
                                if (!(status == 0 || status == 'open')) {
                                    _context9.next = 18;
                                    break;
                                }

                                status = 'submitted,partial-filled';
                                _context9.next = 23;
                                break;

                            case 18:
                                if (!(status == 1 || status == 'closed')) {
                                    _context9.next = 22;
                                    break;
                                }

                                status = 'filled,partial-canceled';
                                _context9.next = 23;
                                break;

                            case 22:
                                throw new ExchangeError(this.id + ' fetchOrders() wrong type param or status param for spot market ' + symbol + '(0 or "open" for unfilled or partial filled orders, 1 or "closed" for filled orders)');

                            case 23:
                                _context9.next = 25;
                                return this.privateGetOrderOrders(this.extend({
                                    'symbol': market['id'],
                                    'states': status
                                }));

                            case 25:
                                response = _context9.sent;
                                return _context9.abrupt('return', this.parseOrders(response['data'], market, since, limit));

                            case 27:
                            case 'end':
                                return _context9.stop();
                        }
                    }
                }, _callee9, this);
            }));

            function fetchOrders() {
                return _ref9.apply(this, arguments);
            }

            return fetchOrders;
        }()
    }, {
        key: 'fetchOpenOrders',
        value: function () {
            var _ref10 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee10() {
                var symbol = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var open;
                return _regeneratorRuntime.wrap(function _callee10$(_context10) {
                    while (1) {
                        switch (_context10.prev = _context10.next) {
                            case 0:
                                open = 0; // 0 for unfilled orders, 1 for filled orders

                                return _context10.abrupt('return', this.fetchOrders(symbol, undefined, undefined, this.extend({
                                    'status': open
                                }, params)));

                            case 2:
                            case 'end':
                                return _context10.stop();
                        }
                    }
                }, _callee10, this);
            }));

            function fetchOpenOrders() {
                return _ref10.apply(this, arguments);
            }

            return fetchOpenOrders;
        }()
    }, {
        key: 'parseOrderStatus',
        value: function parseOrderStatus(status) {
            if (status == 'partial-filled') {
                return 'open';
            } else if (status == 'filled') {
                return 'closed';
            } else if (status == 'canceled') {
                return 'canceled';
            } else if (status == 'submitted') {
                return 'open';
            }
            return status;
        }
    }, {
        key: 'parseOrder',
        value: function parseOrder(order) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var side = undefined;
            var type = undefined;
            var status = undefined;
            if ('type' in order) {
                var orderType = order['type'].split('-');
                side = orderType[0];
                type = orderType[1];
                status = this.parseOrderStatus(order['state']);
            }
            var symbol = undefined;
            if (!market) {
                if ('symbol' in order) {
                    if (order['symbol'] in this.markets_by_id) {
                        var marketId = order['symbol'];
                        market = this.markets_by_id[marketId];
                    }
                }
            }
            if (market) symbol = market['symbol'];
            var timestamp = order['created-at'];
            var amount = parseFloat(order['amount']);
            var filled = parseFloat(order['field-amount']);
            var remaining = amount - filled;
            var price = parseFloat(order['price']);
            var cost = parseFloat(order['field-cash-amount']);
            var average = 0;
            if (filled) average = parseFloat(cost / filled);
            var result = {
                'info': order,
                'id': order['id'],
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'symbol': symbol,
                'type': type,
                'side': side,
                'price': price,
                'average': average,
                'cost': cost,
                'amount': amount,
                'filled': filled,
                'remaining': remaining,
                'status': status,
                'fee': undefined
            };
            return result;
        }
    }, {
        key: 'createOrder',
        value: function () {
            var _ref11 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee11(symbol, type, side, amount) {
                var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
                var market, order, response;
                return _regeneratorRuntime.wrap(function _callee11$(_context11) {
                    while (1) {
                        switch (_context11.prev = _context11.next) {
                            case 0:
                                _context11.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context11.next = 4;
                                return this.loadAccounts();

                            case 4:
                                market = this.market(symbol);
                                order = {
                                    'account-id': this.accounts[0]['id'],
                                    'amount': this.amountToPrecision(symbol, amount),
                                    'symbol': market['id'],
                                    'type': side + '-' + type
                                };

                                if (type == 'limit') order['price'] = this.priceToPrecision(symbol, price);
                                _context11.next = 9;
                                return this.privatePostOrderOrdersPlace(this.extend(order, params));

                            case 9:
                                response = _context11.sent;
                                return _context11.abrupt('return', {
                                    'info': response,
                                    'id': response['data']
                                });

                            case 11:
                            case 'end':
                                return _context11.stop();
                        }
                    }
                }, _callee11, this);
            }));

            function createOrder(_x34, _x35, _x36, _x37) {
                return _ref11.apply(this, arguments);
            }

            return createOrder;
        }()
    }, {
        key: 'cancelOrder',
        value: function () {
            var _ref12 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee12(id) {
                var symbol = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
                return _regeneratorRuntime.wrap(function _callee12$(_context12) {
                    while (1) {
                        switch (_context12.prev = _context12.next) {
                            case 0:
                                _context12.next = 2;
                                return this.privatePostOrderOrdersIdSubmitcancel({ 'id': id });

                            case 2:
                                return _context12.abrupt('return', _context12.sent);

                            case 3:
                            case 'end':
                                return _context12.stop();
                        }
                    }
                }, _callee12, this);
            }));

            function cancelOrder(_x40) {
                return _ref12.apply(this, arguments);
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

            var url = '/';
            if (api == 'market') url += api;else url += this.version;
            url += '/' + this.implodeParams(path, params);
            var query = this.omit(params, this.extractParams(path));
            if (api == 'private') {
                this.checkRequiredCredentials();
                var timestamp = this.YmdHMS(this.milliseconds(), 'T');
                var request = this.keysort(this.extend({
                    'SignatureMethod': 'HmacSHA256',
                    'SignatureVersion': '2',
                    'AccessKeyId': this.apiKey,
                    'Timestamp': timestamp
                }, query));
                var auth = this.urlencode(request);
                var payload = [method, this.hostname, url, auth].join("\n");
                var signature = this.hmac(this.encode(payload), this.encode(this.secret), 'sha256', 'base64');
                auth += '&' + this.urlencode({ 'Signature': signature });
                url += '?' + auth;
                if (method == 'POST') {
                    body = this.json(query);
                    headers = {
                        'Content-Type': 'application/json'
                    };
                }
            } else {
                if (_Object$keys(params).length) url += '?' + this.urlencode(params);
            }
            url = this.urls['api'] + url;
            return { 'url': url, 'method': method, 'body': body, 'headers': headers };
        }
    }, {
        key: 'request',
        value: function () {
            var _ref13 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee13(path) {
                var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
                var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;
                var response;
                return _regeneratorRuntime.wrap(function _callee13$(_context13) {
                    while (1) {
                        switch (_context13.prev = _context13.next) {
                            case 0:
                                _context13.next = 2;
                                return this.fetch2(path, api, method, params, headers, body);

                            case 2:
                                response = _context13.sent;

                                if (!('status' in response)) {
                                    _context13.next = 6;
                                    break;
                                }

                                if (!(response['status'] == 'error')) {
                                    _context13.next = 6;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' ' + this.json(response));

                            case 6:
                                return _context13.abrupt('return', response);

                            case 7:
                            case 'end':
                                return _context13.stop();
                        }
                    }
                }, _callee13, this);
            }));

            function request(_x51) {
                return _ref13.apply(this, arguments);
            }

            return request;
        }()
    }]);

    return huobipro;
}(Exchange);