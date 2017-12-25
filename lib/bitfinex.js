"use strict";

//  ---------------------------------------------------------------------------

import _Object$keys from 'babel-runtime/core-js/object/keys';
import _slicedToArray from 'babel-runtime/helpers/slicedToArray';
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
    ExchangeError = _require.ExchangeError,
    InsufficientFunds = _require.InsufficientFunds,
    NotSupported = _require.NotSupported,
    InvalidOrder = _require.InvalidOrder,
    OrderNotFound = _require.OrderNotFound;

//  ---------------------------------------------------------------------------

module.exports = function (_Exchange) {
    _inherits(bitfinex, _Exchange);

    function bitfinex() {
        _classCallCheck(this, bitfinex);

        return _possibleConstructorReturn(this, (bitfinex.__proto__ || _Object$getPrototypeOf(bitfinex)).apply(this, arguments));
    }

    _createClass(bitfinex, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend(_get(bitfinex.prototype.__proto__ || _Object$getPrototypeOf(bitfinex.prototype), 'describe', this).call(this), {
                'id': 'bitfinex',
                'name': 'Bitfinex',
                'countries': 'VG',
                'version': 'v1',
                'rateLimit': 1500,
                'hasCORS': false,
                // old metainfo interface
                'hasFetchOrder': true,
                'hasFetchTickers': true,
                'hasDeposit': true,
                'hasWithdraw': true,
                'hasFetchOHLCV': true,
                'hasFetchOpenOrders': true,
                'hasFetchClosedOrders': true,
                // new metainfo interface
                'has': {
                    'fetchOHLCV': true,
                    'fetchTickers': true,
                    'fetchOrder': true,
                    'fetchOpenOrders': true,
                    'fetchClosedOrders': true,
                    'fetchMyTrades': true,
                    'withdraw': true,
                    'deposit': true
                },
                'timeframes': {
                    '1m': '1m',
                    '5m': '5m',
                    '15m': '15m',
                    '30m': '30m',
                    '1h': '1h',
                    '3h': '3h',
                    '6h': '6h',
                    '12h': '12h',
                    '1d': '1D',
                    '1w': '7D',
                    '2w': '14D',
                    '1M': '1M'
                },
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/27766244-e328a50c-5ed2-11e7-947b-041416579bb3.jpg',
                    'api': 'https://api.bitfinex.com',
                    'www': 'https://www.bitfinex.com',
                    'doc': ['https://bitfinex.readme.io/v1/docs', 'https://github.com/bitfinexcom/bitfinex-api-node']
                },
                'api': {
                    'v2': {
                        'get': ['candles/trade:{timeframe}:{symbol}/{section}', 'candles/trade:{timeframe}:{symbol}/last', 'candles/trade:{timeframe}:{symbol}/hist']
                    },
                    'public': {
                        'get': ['book/{symbol}',
                        // 'candles/{symbol}',
                        'lendbook/{currency}', 'lends/{currency}', 'pubticker/{symbol}', 'stats/{symbol}', 'symbols', 'symbols_details', 'tickers', 'today', 'trades/{symbol}']
                    },
                    'private': {
                        'post': ['account_fees', 'account_infos', 'balances', 'basket_manage', 'credits', 'deposit/new', 'funding/close', 'history', 'history/movements', 'key_info', 'margin_infos', 'mytrades', 'mytrades_funding', 'offer/cancel', 'offer/new', 'offer/status', 'offers', 'offers/hist', 'order/cancel', 'order/cancel/all', 'order/cancel/multi', 'order/cancel/replace', 'order/new', 'order/new/multi', 'order/status', 'orders', 'orders/hist', 'position/claim', 'positions', 'summary', 'taken_funds', 'total_taken_funds', 'transfer', 'unused_taken_funds', 'withdraw']
                    }
                },
                'fees': {
                    'trading': {
                        'tierBased': true,
                        'percentage': true,
                        'maker': 0.1 / 100,
                        'taker': 0.2 / 100,
                        'tiers': {
                            'taker': [[0, 0.2 / 100], [500000, 0.2 / 100], [1000000, 0.2 / 100], [2500000, 0.2 / 100], [5000000, 0.2 / 100], [7500000, 0.2 / 100], [10000000, 0.18 / 100], [15000000, 0.16 / 100], [20000000, 0.14 / 100], [25000000, 0.12 / 100], [30000000, 0.1 / 100]],
                            'maker': [[0, 0.1 / 100], [500000, 0.08 / 100], [1000000, 0.06 / 100], [2500000, 0.04 / 100], [5000000, 0.02 / 100], [7500000, 0], [10000000, 0], [15000000, 0], [20000000, 0], [25000000, 0], [30000000, 0]]
                        }
                    },
                    'funding': {
                        'tierBased': false, // true for tier-based/progressive
                        'percentage': false, // fixed commission
                        'deposit': {
                            'BTC': 0.0005,
                            'IOTA': 0.5,
                            'ETH': 0.01,
                            'BCH': 0.01,
                            'LTC': 0.1,
                            'EOS': 0.1,
                            'XMR': 0.04,
                            'SAN': 0.1,
                            'DASH': 0.01,
                            'ETC': 0.01,
                            'XPR': 0.02,
                            'YYW': 0.1,
                            'NEO': 0,
                            'ZEC': 0.1,
                            'BTG': 0,
                            'OMG': 0.1,
                            'DATA': 1,
                            'QASH': 1,
                            'ETP': 0.01,
                            'QTUM': 0.01,
                            'EDO': 0.5,
                            'AVT': 0.5,
                            'USDT': 0
                        },
                        'withdraw': {
                            'BTC': 0.0005,
                            'IOTA': 0.5,
                            'ETH': 0.01,
                            'BCH': 0.01,
                            'LTC': 0.1,
                            'EOS': 0.1,
                            'XMR': 0.04,
                            'SAN': 0.1,
                            'DASH': 0.01,
                            'ETC': 0.01,
                            'XPR': 0.02,
                            'YYW': 0.1,
                            'NEO': 0,
                            'ZEC': 0.1,
                            'BTG': 0,
                            'OMG': 0.1,
                            'DATA': 1,
                            'QASH': 1,
                            'ETP': 0.01,
                            'QTUM': 0.01,
                            'EDO': 0.5,
                            'AVT': 0.5,
                            'USDT': 5
                        }
                    }
                }
            });
        }
    }, {
        key: 'commonCurrencyCode',
        value: function commonCurrencyCode(currency) {
            // issue #4 Bitfinex names Dash as DSH, instead of DASH
            if (currency == 'DSH') return 'DASH';
            if (currency == 'QTM') return 'QTUM';
            if (currency == 'BCC') return 'CST_BCC';
            if (currency == 'BCU') return 'CST_BCU';
            // issue #796
            if (currency == 'IOT') return 'IOTA';
            return currency;
        }
    }, {
        key: 'fetchMarkets',
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
                var markets, result, p, market, id, baseId, quoteId, base, quote, symbol, precision;
                return _regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.publicGetSymbolsDetails();

                            case 2:
                                markets = _context.sent;
                                result = [];

                                for (p = 0; p < markets.length; p++) {
                                    market = markets[p];
                                    id = market['pair'].toUpperCase();
                                    baseId = id.slice(0, 3);
                                    quoteId = id.slice(3, 6);
                                    base = this.commonCurrencyCode(baseId);
                                    quote = this.commonCurrencyCode(quoteId);
                                    symbol = base + '/' + quote;
                                    precision = {
                                        'price': market['price_precision'],
                                        'amount': market['price_precision']
                                    };

                                    result.push(this.extend(this.fees['trading'], {
                                        'id': id,
                                        'symbol': symbol,
                                        'base': base,
                                        'quote': quote,
                                        'baseId': baseId,
                                        'quoteId': quoteId,
                                        'active': true,
                                        'info': market,
                                        'precision': precision,
                                        'limits': {
                                            'amount': {
                                                'min': parseFloat(market['minimum_order_size']),
                                                'max': parseFloat(market['maximum_order_size'])
                                            },
                                            'price': {
                                                'min': Math.pow(10, -precision['price']),
                                                'max': Math.pow(10, precision['price'])
                                            },
                                            'cost': {
                                                'min': undefined,
                                                'max': undefined
                                            }
                                        }
                                    }));
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
                var balanceType, balances, result, i, balance, currency, uppercase, account;
                return _regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this.loadMarkets();

                            case 2:
                                balanceType = this.safeString(params, 'type', 'exchange');
                                _context2.next = 5;
                                return this.privatePostBalances();

                            case 5:
                                balances = _context2.sent;
                                result = { 'info': balances };

                                for (i = 0; i < balances.length; i++) {
                                    balance = balances[i];

                                    if (balance['type'] == balanceType) {
                                        currency = balance['currency'];
                                        uppercase = currency.toUpperCase();

                                        uppercase = this.commonCurrencyCode(uppercase);
                                        account = this.account();

                                        account['free'] = parseFloat(balance['available']);
                                        account['total'] = parseFloat(balance['amount']);
                                        account['used'] = account['total'] - account['free'];
                                        result[uppercase] = account;
                                    }
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
                var orderbook;
                return _regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context3.next = 4;
                                return this.publicGetBookSymbol(this.extend({
                                    'symbol': this.marketId(symbol)
                                }, params));

                            case 4:
                                orderbook = _context3.sent;
                                return _context3.abrupt('return', this.parseOrderBook(orderbook, undefined, 'bids', 'asks', 'price', 'amount'));

                            case 6:
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
        key: 'fetchTickers',
        value: function () {
            var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee4() {
                var symbols = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var tickers, result, i, ticker, id, market, symbol;
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
                                result = {};
                                i = 0;

                            case 7:
                                if (!(i < tickers.length)) {
                                    _context4.next = 24;
                                    break;
                                }

                                ticker = tickers[i];

                                if (!('pair' in ticker)) {
                                    _context4.next = 20;
                                    break;
                                }

                                id = ticker['pair'];

                                if (!(id in this.markets_by_id)) {
                                    _context4.next = 17;
                                    break;
                                }

                                market = this.markets_by_id[id];
                                symbol = market['symbol'];

                                result[symbol] = this.parseTicker(ticker, market);
                                _context4.next = 18;
                                break;

                            case 17:
                                throw new ExchangeError(this.id + ' fetchTickers() failed to recognize symbol ' + id + ' ' + this.json(ticker));

                            case 18:
                                _context4.next = 21;
                                break;

                            case 20:
                                throw new ExchangeError(this.id + ' fetchTickers() response not recognized ' + this.json(tickers));

                            case 21:
                                i++;
                                _context4.next = 7;
                                break;

                            case 24:
                                return _context4.abrupt('return', result);

                            case 25:
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
                var market, ticker;
                return _regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                _context5.next = 5;
                                return this.publicGetPubtickerSymbol(this.extend({
                                    'symbol': market['id']
                                }, params));

                            case 5:
                                ticker = _context5.sent;
                                return _context5.abrupt('return', this.parseTicker(ticker, market));

                            case 7:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function fetchTicker(_x7) {
                return _ref5.apply(this, arguments);
            }

            return fetchTicker;
        }()
    }, {
        key: 'parseTicker',
        value: function parseTicker(ticker) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var timestamp = parseFloat(ticker['timestamp']) * 1000;
            var symbol = undefined;
            if (market) {
                symbol = market['symbol'];
            } else if ('pair' in ticker) {
                var id = ticker['pair'];
                if (id in this.markets_by_id) {
                    market = this.markets_by_id[id];
                    symbol = market['symbol'];
                } else {
                    throw new ExchangeError(this.id + ' unrecognized ticker symbol ' + id + ' ' + this.json(ticker));
                }
            }
            return {
                'symbol': symbol,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'high': parseFloat(ticker['high']),
                'low': parseFloat(ticker['low']),
                'bid': parseFloat(ticker['bid']),
                'ask': parseFloat(ticker['ask']),
                'vwap': undefined,
                'open': undefined,
                'close': undefined,
                'first': undefined,
                'last': parseFloat(ticker['last_price']),
                'change': undefined,
                'percentage': undefined,
                'average': parseFloat(ticker['mid']),
                'baseVolume': parseFloat(ticker['volume']),
                'quoteVolume': undefined,
                'info': ticker
            };
        }
    }, {
        key: 'parseTrade',
        value: function parseTrade(trade, market) {
            var timestamp = parseInt(parseFloat(trade['timestamp'])) * 1000;
            var side = trade['type'].toLowerCase();
            var orderId = this.safeString(trade, 'order_id');
            var price = parseFloat(trade['price']);
            var amount = parseFloat(trade['amount']);
            var cost = price * amount;
            return {
                'id': trade['tid'].toString(),
                'info': trade,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'symbol': market['symbol'],
                'type': undefined,
                'order': orderId,
                'side': side,
                'price': price,
                'amount': amount,
                'cost': cost,
                'fee': undefined
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
                                return this.publicGetTradesSymbol(this.extend({
                                    'symbol': market['id']
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

            function fetchTrades(_x12) {
                return _ref6.apply(this, arguments);
            }

            return fetchTrades;
        }()
    }, {
        key: 'fetchMyTrades',
        value: function () {
            var _ref7 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee7() {
                var symbol = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var market, request, response;
                return _regeneratorRuntime.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                _context7.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                request = { 'symbol': market['id'] };

                                if (limit) {
                                    request['limit_trades'] = limit;
                                }
                                if (since) {
                                    request['timestamp'] = parseInt(since / 1000);
                                }
                                _context7.next = 8;
                                return this.privatePostMytrades(this.extend(request, params));

                            case 8:
                                response = _context7.sent;
                                return _context7.abrupt('return', this.parseTrades(response, market, since, limit));

                            case 10:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function fetchMyTrades() {
                return _ref7.apply(this, arguments);
            }

            return fetchMyTrades;
        }()
    }, {
        key: 'createOrder',
        value: function () {
            var _ref8 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee8(symbol, type, side, amount) {
                var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
                var orderType, order, result;
                return _regeneratorRuntime.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                _context8.next = 2;
                                return this.loadMarkets();

                            case 2:
                                orderType = type;

                                if (type == 'limit' || type == 'market') orderType = 'exchange ' + type;
                                // amount = this.amountToPrecision (symbol, amount);
                                order = {
                                    'symbol': this.marketId(symbol),
                                    'amount': amount.toString(),
                                    'side': side,
                                    'type': orderType,
                                    'ocoorder': false,
                                    'buy_price_oco': 0,
                                    'sell_price_oco': 0
                                };

                                if (type == 'market') {
                                    order['price'] = this.nonce().toString();
                                } else {
                                    // price = this.priceToPrecision (symbol, price);
                                    order['price'] = price.toString();
                                }
                                _context8.next = 8;
                                return this.privatePostOrderNew(this.extend(order, params));

                            case 8:
                                result = _context8.sent;
                                return _context8.abrupt('return', this.parseOrder(result));

                            case 10:
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
                                return this.privatePostOrderCancel({ 'order_id': parseInt(id) });

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
        key: 'parseOrder',
        value: function parseOrder(order) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var side = order['side'];
            var open = order['is_live'];
            var canceled = order['is_cancelled'];
            var status = undefined;
            if (open) {
                status = 'open';
            } else if (canceled) {
                status = 'canceled';
            } else {
                status = 'closed';
            }
            var symbol = undefined;
            if (!market) {
                var _exchange = order['symbol'].toUpperCase();
                if (_exchange in this.markets_by_id) {
                    market = this.markets_by_id[_exchange];
                }
            }
            if (market) symbol = market['symbol'];
            var orderType = order['type'];
            var exchange = orderType.indexOf('exchange ') >= 0;
            if (exchange) {
                var _order$type$split = order['type'].split(' '),
                    _order$type$split2 = _slicedToArray(_order$type$split, 2),
                    prefix = _order$type$split2[0],
                    _orderType = _order$type$split2[1];
            }
            var timestamp = parseInt(parseFloat(order['timestamp']) * 1000);
            var result = {
                'info': order,
                'id': order['id'].toString(),
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'symbol': symbol,
                'type': orderType,
                'side': side,
                'price': parseFloat(order['price']),
                'average': parseFloat(order['avg_execution_price']),
                'amount': parseFloat(order['original_amount']),
                'remaining': parseFloat(order['remaining_amount']),
                'filled': parseFloat(order['executed_amount']),
                'status': status,
                'fee': undefined
            };
            return result;
        }
    }, {
        key: 'fetchOpenOrders',
        value: function () {
            var _ref10 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee10() {
                var symbol = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var response, orders;
                return _regeneratorRuntime.wrap(function _callee10$(_context10) {
                    while (1) {
                        switch (_context10.prev = _context10.next) {
                            case 0:
                                _context10.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context10.next = 4;
                                return this.privatePostOrders(params);

                            case 4:
                                response = _context10.sent;
                                orders = this.parseOrders(response, undefined, since, limit);

                                if (symbol) orders = this.filterBy(orders, 'symbol', symbol);
                                return _context10.abrupt('return', orders);

                            case 8:
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
        key: 'fetchClosedOrders',
        value: function () {
            var _ref11 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee11() {
                var symbol = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var request, response, orders;
                return _regeneratorRuntime.wrap(function _callee11$(_context11) {
                    while (1) {
                        switch (_context11.prev = _context11.next) {
                            case 0:
                                _context11.next = 2;
                                return this.loadMarkets();

                            case 2:
                                request = {};

                                if (limit) request['limit'] = limit;
                                _context11.next = 6;
                                return this.privatePostOrdersHist(this.extend(request, params));

                            case 6:
                                response = _context11.sent;
                                orders = this.parseOrders(response, undefined, since, limit);

                                if (symbol) orders = this.filterBy(orders, 'symbol', symbol);
                                orders = this.filterBy(orders, 'status', 'closed');
                                return _context11.abrupt('return', orders);

                            case 11:
                            case 'end':
                                return _context11.stop();
                        }
                    }
                }, _callee11, this);
            }));

            function fetchClosedOrders() {
                return _ref11.apply(this, arguments);
            }

            return fetchClosedOrders;
        }()
    }, {
        key: 'fetchOrder',
        value: function () {
            var _ref12 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee12(id) {
                var symbol = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
                var response;
                return _regeneratorRuntime.wrap(function _callee12$(_context12) {
                    while (1) {
                        switch (_context12.prev = _context12.next) {
                            case 0:
                                _context12.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context12.next = 4;
                                return this.privatePostOrderStatus(this.extend({
                                    'order_id': parseInt(id)
                                }, params));

                            case 4:
                                response = _context12.sent;
                                return _context12.abrupt('return', this.parseOrder(response));

                            case 6:
                            case 'end':
                                return _context12.stop();
                        }
                    }
                }, _callee12, this);
            }));

            function fetchOrder(_x37) {
                return _ref12.apply(this, arguments);
            }

            return fetchOrder;
        }()
    }, {
        key: 'parseOHLCV',
        value: function parseOHLCV(ohlcv) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
            var timeframe = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '1m';
            var since = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
            var limit = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;

            return [ohlcv[0], ohlcv[1], ohlcv[3], ohlcv[4], ohlcv[2], ohlcv[5]];
        }
    }, {
        key: 'fetchOHLCV',
        value: function () {
            var _ref13 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee13(symbol) {
                var timeframe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '1m';
                var since = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var limit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
                var params = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
                var market, v2id, request, response;
                return _regeneratorRuntime.wrap(function _callee13$(_context13) {
                    while (1) {
                        switch (_context13.prev = _context13.next) {
                            case 0:
                                _context13.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                v2id = 't' + market['id'];
                                request = {
                                    'symbol': v2id,
                                    'timeframe': this.timeframes[timeframe]
                                };

                                if (limit) request['limit'] = limit;
                                if (since) request['start'] = since;
                                request = this.extend(request, params);
                                _context13.next = 10;
                                return this.v2GetCandlesTradeTimeframeSymbolHist(request);

                            case 10:
                                response = _context13.sent;
                                return _context13.abrupt('return', this.parseOHLCVs(response, market, timeframe, since, limit));

                            case 12:
                            case 'end':
                                return _context13.stop();
                        }
                    }
                }, _callee13, this);
            }));

            function fetchOHLCV(_x46) {
                return _ref13.apply(this, arguments);
            }

            return fetchOHLCV;
        }()
    }, {
        key: 'getCurrencyName',
        value: function getCurrencyName(currency) {
            if (currency == 'BTC') {
                return 'bitcoin';
            } else if (currency == 'LTC') {
                return 'litecoin';
            } else if (currency == 'ETH') {
                return 'ethereum';
            } else if (currency == 'ETC') {
                return 'ethereumc';
            } else if (currency == 'OMNI') {
                return 'mastercoin'; // ???
            } else if (currency == 'ZEC') {
                return 'zcash';
            } else if (currency == 'XMR') {
                return 'monero';
            } else if (currency == 'USD') {
                return 'wire';
            } else if (currency == 'DASH') {
                return 'dash';
            } else if (currency == 'XRP') {
                return 'ripple';
            } else if (currency == 'EOS') {
                return 'eos';
            } else if (currency == 'BCH') {
                return 'bcash';
            } else if (currency == 'USDT') {
                return 'tetheruso';
            }
            throw new NotSupported(this.id + ' ' + currency + ' not supported for withdrawal');
        }
    }, {
        key: 'createDepositAddress',
        value: function () {
            var _ref14 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee14(currency) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var response;
                return _regeneratorRuntime.wrap(function _callee14$(_context14) {
                    while (1) {
                        switch (_context14.prev = _context14.next) {
                            case 0:
                                _context14.next = 2;
                                return this.fetchDepositAddress(currency, this.extend({
                                    'renew': 1
                                }, params));

                            case 2:
                                response = _context14.sent;
                                return _context14.abrupt('return', {
                                    'currency': currency,
                                    'address': response['address'],
                                    'status': 'ok',
                                    'info': response['info']
                                });

                            case 4:
                            case 'end':
                                return _context14.stop();
                        }
                    }
                }, _callee14, this);
            }));

            function createDepositAddress(_x48) {
                return _ref14.apply(this, arguments);
            }

            return createDepositAddress;
        }()
    }, {
        key: 'fetchDepositAddress',
        value: function () {
            var _ref15 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee15(currency) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var name, request, response;
                return _regeneratorRuntime.wrap(function _callee15$(_context15) {
                    while (1) {
                        switch (_context15.prev = _context15.next) {
                            case 0:
                                name = this.getCurrencyName(currency);
                                request = {
                                    'method': name,
                                    'wallet_name': 'exchange',
                                    'renew': 0 // a value of 1 will generate a new address
                                };
                                _context15.next = 4;
                                return this.privatePostDepositNew(this.extend(request, params));

                            case 4:
                                response = _context15.sent;
                                return _context15.abrupt('return', {
                                    'currency': currency,
                                    'address': response['address'],
                                    'status': 'ok',
                                    'info': response
                                });

                            case 6:
                            case 'end':
                                return _context15.stop();
                        }
                    }
                }, _callee15, this);
            }));

            function fetchDepositAddress(_x50) {
                return _ref15.apply(this, arguments);
            }

            return fetchDepositAddress;
        }()
    }, {
        key: 'withdraw',
        value: function () {
            var _ref16 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee16(currency, amount, address) {
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var name, request, responses, response;
                return _regeneratorRuntime.wrap(function _callee16$(_context16) {
                    while (1) {
                        switch (_context16.prev = _context16.next) {
                            case 0:
                                name = this.getCurrencyName(currency);
                                request = {
                                    'withdraw_type': name,
                                    'walletselected': 'exchange',
                                    'amount': amount.toString(),
                                    'address': address
                                };
                                _context16.next = 4;
                                return this.privatePostWithdraw(this.extend(request, params));

                            case 4:
                                responses = _context16.sent;
                                response = responses[0];
                                return _context16.abrupt('return', {
                                    'info': response,
                                    'id': response['withdrawal_id']
                                });

                            case 7:
                            case 'end':
                                return _context16.stop();
                        }
                    }
                }, _callee16, this);
            }));

            function withdraw(_x52, _x53, _x54) {
                return _ref16.apply(this, arguments);
            }

            return withdraw;
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

            var request = '/' + this.implodeParams(path, params);
            if (api == 'v2') {
                request = '/' + api + request;
            } else {
                request = '/' + this.version + request;
            }
            var query = this.omit(params, this.extractParams(path));
            var url = this.urls['api'] + request;
            if (api == 'public' || path.indexOf('/hist') >= 0) {
                if (_Object$keys(query).length) {
                    var suffix = '?' + this.urlencode(query);
                    url += suffix;
                    request += suffix;
                }
            }
            if (api == 'private') {
                this.checkRequiredCredentials();
                var nonce = this.nonce();
                query = this.extend({
                    'nonce': nonce.toString(),
                    'request': request
                }, query);
                query = this.json(query);
                query = this.encode(query);
                var payload = this.stringToBase64(query);
                var secret = this.encode(this.secret);
                var signature = this.hmac(payload, secret, 'sha384');
                headers = {
                    'X-BFX-APIKEY': this.apiKey,
                    'X-BFX-PAYLOAD': this.decode(payload),
                    'X-BFX-SIGNATURE': signature
                };
            }
            return { 'url': url, 'method': method, 'body': body, 'headers': headers };
        }
    }, {
        key: 'handleErrors',
        value: function handleErrors(code, reason, url, method, headers, body) {
            if (code == 400) {
                if (body[0] == "{") {
                    var response = JSON.parse(body);
                    var message = response['message'];
                    if (message.indexOf('Key price should be a decimal number') >= 0) {
                        throw new InvalidOrder(this.id + ' ' + message);
                    } else if (message.indexOf('Invalid order: not enough exchange balance') >= 0) {
                        throw new InsufficientFunds(this.id + ' ' + message);
                    } else if (message.indexOf('Invalid order') >= 0) {
                        throw new InvalidOrder(this.id + ' ' + message);
                    } else if (message.indexOf('Order could not be cancelled.') >= 0) {
                        throw new OrderNotFound(this.id + ' ' + message);
                    }
                }
                throw new ExchangeError(this.id + ' ' + body);
            }
        }
    }, {
        key: 'request',
        value: function () {
            var _ref17 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee17(path) {
                var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
                var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;
                var response;
                return _regeneratorRuntime.wrap(function _callee17$(_context17) {
                    while (1) {
                        switch (_context17.prev = _context17.next) {
                            case 0:
                                _context17.next = 2;
                                return this.fetch2(path, api, method, params, headers, body);

                            case 2:
                                response = _context17.sent;

                                if (!('message' in response)) {
                                    _context17.next = 5;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' ' + this.json(response));

                            case 5:
                                return _context17.abrupt('return', response);

                            case 6:
                            case 'end':
                                return _context17.stop();
                        }
                    }
                }, _callee17, this);
            }));

            function request(_x65) {
                return _ref17.apply(this, arguments);
            }

            return request;
        }()
    }]);

    return bitfinex;
}(Exchange);