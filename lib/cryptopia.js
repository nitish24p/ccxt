"use strict";

//  ---------------------------------------------------------------------------

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

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

var _require = require('./base/errors'),
    ExchangeError = _require.ExchangeError,
    InsufficientFunds = _require.InsufficientFunds,
    OrderNotFound = _require.OrderNotFound,
    OrderNotCached = _require.OrderNotCached;

//  ---------------------------------------------------------------------------

module.exports = function (_Exchange) {
    (0, _inherits3.default)(cryptopia, _Exchange);

    function cryptopia() {
        (0, _classCallCheck3.default)(this, cryptopia);
        return (0, _possibleConstructorReturn3.default)(this, (cryptopia.__proto__ || (0, _getPrototypeOf2.default)(cryptopia)).apply(this, arguments));
    }

    (0, _createClass3.default)(cryptopia, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend((0, _get3.default)(cryptopia.prototype.__proto__ || (0, _getPrototypeOf2.default)(cryptopia.prototype), 'describe', this).call(this), {
                'id': 'cryptopia',
                'name': 'Cryptopia',
                'rateLimit': 1500,
                'countries': 'NZ', // New Zealand
                'hasCORS': false,
                // obsolete metainfo interface
                'hasFetchTickers': true,
                'hasFetchOrder': true,
                'hasFetchOrders': true,
                'hasFetchOpenOrders': true,
                'hasFetchClosedOrders': true,
                'hasFetchMyTrades': true,
                'hasFetchCurrencies': true,
                'hasDeposit': true,
                'hasWithdraw': true,
                // new metainfo interface
                'has': {
                    'fetchTickers': true,
                    'fetchOrder': 'emulated',
                    'fetchOrders': 'emulated',
                    'fetchOpenOrders': true,
                    'fetchClosedOrders': 'emulated',
                    'fetchMyTrades': true,
                    'fetchCurrencies': true,
                    'deposit': true,
                    'withdraw': true
                },
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/29484394-7b4ea6e2-84c6-11e7-83e5-1fccf4b2dc81.jpg',
                    'api': 'https://www.cryptopia.co.nz/api',
                    'www': 'https://www.cryptopia.co.nz',
                    'doc': ['https://www.cryptopia.co.nz/Forum/Category/45', 'https://www.cryptopia.co.nz/Forum/Thread/255', 'https://www.cryptopia.co.nz/Forum/Thread/256']
                },
                'api': {
                    'public': {
                        'get': ['GetCurrencies', 'GetTradePairs', 'GetMarkets', 'GetMarkets/{id}', 'GetMarkets/{hours}', 'GetMarkets/{id}/{hours}', 'GetMarket/{id}', 'GetMarket/{id}/{hours}', 'GetMarketHistory/{id}', 'GetMarketHistory/{id}/{hours}', 'GetMarketOrders/{id}', 'GetMarketOrders/{id}/{count}', 'GetMarketOrderGroups/{ids}/{count}']
                    },
                    'private': {
                        'post': ['CancelTrade', 'GetBalance', 'GetDepositAddress', 'GetOpenOrders', 'GetTradeHistory', 'GetTransactions', 'SubmitTip', 'SubmitTrade', 'SubmitTransfer', 'SubmitWithdraw']
                    }
                }
            });
        }
    }, {
        key: 'commonCurrencyCode',
        value: function commonCurrencyCode(currency) {
            if (currency == 'CC') return 'CCX';
            if (currency == 'FCN') return 'Facilecoin';
            if (currency == 'NET') return 'NetCoin';
            if (currency == 'BTG') return 'Bitgem';
            if (currency == 'FUEL') return 'FC2'; // FuelCoin != FUEL
            if (currency == 'WRC') return 'WarCoin';
            return currency;
        }
    }, {
        key: 'currencyId',
        value: function currencyId(currency) {
            if (currency == 'CCX') return 'CC';
            if (currency == 'Facilecoin') return 'FCN';
            if (currency == 'NetCoin') return 'NET';
            if (currency == 'Bitgem') return 'BTG';
            if (currency == 'FC2') return 'FUEL'; // FuelCoin != FUEL
            return currency;
        }
    }, {
        key: 'fetchMarkets',
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                var response, result, markets, i, market, id, symbol, _symbol$split, _symbol$split2, base, quote, precision, amountLimits, priceLimits, limits, active;

                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.publicGetTradePairs();

                            case 2:
                                response = _context.sent;
                                result = [];
                                markets = response['Data'];

                                for (i = 0; i < markets.length; i++) {
                                    market = markets[i];
                                    id = market['Id'];
                                    symbol = market['Label'];
                                    _symbol$split = symbol.split('/'), _symbol$split2 = (0, _slicedToArray3.default)(_symbol$split, 2), base = _symbol$split2[0], quote = _symbol$split2[1];

                                    base = this.commonCurrencyCode(base);
                                    quote = this.commonCurrencyCode(quote);
                                    symbol = base + '/' + quote;
                                    precision = {
                                        'amount': 8,
                                        'price': 8
                                    };
                                    amountLimits = {
                                        'min': market['MinimumTrade'],
                                        'max': market['MaximumTrade']
                                    };
                                    priceLimits = {
                                        'min': market['MinimumPrice'],
                                        'max': market['MaximumPrice']
                                    };
                                    limits = {
                                        'amount': amountLimits,
                                        'price': priceLimits
                                    };
                                    active = market['Status'] == 'OK';

                                    result.push({
                                        'id': id,
                                        'symbol': symbol,
                                        'base': base,
                                        'quote': quote,
                                        'info': market,
                                        'maker': market['TradeFee'] / 100,
                                        'taker': market['TradeFee'] / 100,
                                        'lot': amountLimits['min'],
                                        'active': active,
                                        'precision': precision,
                                        'limits': limits
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
        key: 'fetchOrderBook',
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var response, orderbook;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context2.next = 4;
                                return this.publicGetMarketOrdersId(this.extend({
                                    'id': this.marketId(symbol)
                                }, params));

                            case 4:
                                response = _context2.sent;
                                orderbook = response['Data'];
                                return _context2.abrupt('return', this.parseOrderBook(orderbook, undefined, 'Buy', 'Sell', 'Price', 'Volume'));

                            case 7:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function fetchOrderBook(_x2) {
                return _ref2.apply(this, arguments);
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
                'info': ticker,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'high': parseFloat(ticker['High']),
                'low': parseFloat(ticker['Low']),
                'bid': parseFloat(ticker['BidPrice']),
                'ask': parseFloat(ticker['AskPrice']),
                'vwap': undefined,
                'open': parseFloat(ticker['Open']),
                'close': parseFloat(ticker['Close']),
                'first': undefined,
                'last': parseFloat(ticker['LastPrice']),
                'change': parseFloat(ticker['Change']),
                'percentage': undefined,
                'average': undefined,
                'baseVolume': parseFloat(ticker['Volume']),
                'quoteVolume': parseFloat(ticker['BaseVolume'])
            };
        }
    }, {
        key: 'fetchTicker',
        value: function () {
            var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var market, response, ticker;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                _context3.next = 5;
                                return this.publicGetMarketId(this.extend({
                                    'id': market['id']
                                }, params));

                            case 5:
                                response = _context3.sent;
                                ticker = response['Data'];
                                return _context3.abrupt('return', this.parseTicker(ticker, market));

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
        key: 'fetchTickers',
        value: function () {
            var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
                var symbols = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var response, result, tickers, i, ticker, id, recognized, market, symbol;
                return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context4.next = 4;
                                return this.publicGetMarkets(params);

                            case 4:
                                response = _context4.sent;
                                result = {};
                                tickers = response['Data'];
                                i = 0;

                            case 8:
                                if (!(i < tickers.length)) {
                                    _context4.next = 20;
                                    break;
                                }

                                ticker = tickers[i];
                                id = ticker['TradePairId'];
                                recognized = id in this.markets_by_id;

                                if (recognized) {
                                    _context4.next = 14;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' fetchTickers() returned unrecognized pair id ' + id);

                            case 14:
                                market = this.markets_by_id[id];
                                symbol = market['symbol'];

                                result[symbol] = this.parseTicker(ticker, market);

                            case 17:
                                i++;
                                _context4.next = 8;
                                break;

                            case 20:
                                return _context4.abrupt('return', result);

                            case 21:
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
        key: 'parseTrade',
        value: function parseTrade(trade) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var timestamp = undefined;
            if ('Timestamp' in trade) {
                timestamp = trade['Timestamp'] * 1000;
            } else if ('TimeStamp' in trade) {
                timestamp = this.parse8601(trade['TimeStamp']);
            }
            var price = this.safeFloat(trade, 'Price');
            if (!price) price = this.safeFloat(trade, 'Rate');
            var cost = this.safeFloat(trade, 'Total');
            var id = this.safeString(trade, 'TradeId');
            if (!market) {
                if ('TradePairId' in trade) if (trade['TradePairId'] in this.markets_by_id) market = this.markets_by_id[trade['TradePairId']];
            }
            var symbol = undefined;
            var fee = undefined;
            if (market) {
                symbol = market['symbol'];
                if ('Fee' in trade) {
                    fee = {
                        'currency': market['quote'],
                        'cost': trade['Fee']
                    };
                }
            }
            return {
                'id': id,
                'info': trade,
                'order': undefined,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'symbol': symbol,
                'type': 'limit',
                'side': trade['Type'].toLowerCase(),
                'price': price,
                'cost': cost,
                'amount': trade['Amount'],
                'fee': fee
            };
        }
    }, {
        key: 'fetchTrades',
        value: function () {
            var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(symbol) {
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var market, response, trades;
                return _regenerator2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                _context5.next = 5;
                                return this.publicGetMarketHistoryIdHours(this.extend({
                                    'id': market['id'],
                                    'hours': 24 // default
                                }, params));

                            case 5:
                                response = _context5.sent;
                                trades = response['Data'];
                                return _context5.abrupt('return', this.parseTrades(trades, market, since, limit));

                            case 8:
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
        key: 'fetchMyTrades',
        value: function () {
            var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6() {
                var symbol = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var request, market, response;
                return _regenerator2.default.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                _context6.next = 2;
                                return this.loadMarkets();

                            case 2:
                                request = {};
                                market = undefined;

                                if (symbol) {
                                    market = this.market(symbol);
                                    request['TradePairId'] = market['id'];
                                }
                                _context6.next = 7;
                                return this.privatePostGetTradeHistory(this.extend(request, params));

                            case 7:
                                response = _context6.sent;
                                return _context6.abrupt('return', this.parseTrades(response['Data'], market, since, limit));

                            case 9:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function fetchMyTrades() {
                return _ref6.apply(this, arguments);
            }

            return fetchMyTrades;
        }()
    }, {
        key: 'fetchCurrencies',
        value: function () {
            var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7() {
                var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var response, currencies, result, i, currency, id, precision, code, active, status;
                return _regenerator2.default.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                _context7.next = 2;
                                return this.publicGetCurrencies(params);

                            case 2:
                                response = _context7.sent;
                                currencies = response['Data'];
                                result = {};

                                for (i = 0; i < currencies.length; i++) {
                                    currency = currencies[i];
                                    id = currency['Symbol'];
                                    // todo: will need to rethink the fees
                                    // to add support for multiple withdrawal/deposit methods and
                                    // differentiated fees for each particular method

                                    precision = 8; // default precision, todo: fix "magic constants"

                                    code = this.commonCurrencyCode(id);
                                    active = currency['ListingStatus'] == 'Active';
                                    status = currency['Status'].toLowerCase();

                                    if (status != 'ok') active = false;
                                    result[code] = {
                                        'id': id,
                                        'code': code,
                                        'info': currency,
                                        'name': currency['Name'],
                                        'active': active,
                                        'status': status,
                                        'fee': currency['WithdrawFee'],
                                        'precision': precision,
                                        'limits': {
                                            'amount': {
                                                'min': currency['MinBaseTrade'],
                                                'max': Math.pow(10, precision)
                                            },
                                            'price': {
                                                'min': Math.pow(10, -precision),
                                                'max': Math.pow(10, precision)
                                            },
                                            'cost': {
                                                'min': undefined,
                                                'max': undefined
                                            },
                                            'withdraw': {
                                                'min': currency['MinWithdraw'],
                                                'max': currency['MaxWithdraw']
                                            }
                                        }
                                    };
                                }
                                return _context7.abrupt('return', result);

                            case 7:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function fetchCurrencies() {
                return _ref7.apply(this, arguments);
            }

            return fetchCurrencies;
        }()
    }, {
        key: 'fetchBalance',
        value: function () {
            var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8() {
                var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var response, balances, result, i, balance, code, currency, account;
                return _regenerator2.default.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                _context8.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context8.next = 4;
                                return this.privatePostGetBalance();

                            case 4:
                                response = _context8.sent;
                                balances = response['Data'];
                                result = { 'info': response };

                                for (i = 0; i < balances.length; i++) {
                                    balance = balances[i];
                                    code = balance['Symbol'];
                                    currency = this.commonCurrencyCode(code);
                                    account = {
                                        'free': balance['Available'],
                                        'used': 0.0,
                                        'total': balance['Total']
                                    };

                                    account['used'] = account['total'] - account['free'];
                                    result[currency] = account;
                                }
                                return _context8.abrupt('return', this.parseBalance(result));

                            case 9:
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
        key: 'createOrder',
        value: function () {
            var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9(symbol, type, side, amount) {
                var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
                var market, request, response, id, filled, filledOrders, filledOrdersLength, timestamp, order;
                return _regenerator2.default.wrap(function _callee9$(_context9) {
                    while (1) {
                        switch (_context9.prev = _context9.next) {
                            case 0:
                                if (!(type == 'market')) {
                                    _context9.next = 2;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' allows limit orders only');

                            case 2:
                                _context9.next = 4;
                                return this.loadMarkets();

                            case 4:
                                market = this.market(symbol);

                                price = parseFloat(price);
                                amount = parseFloat(amount);
                                request = {
                                    'TradePairId': market['id'],
                                    'Type': this.capitalize(side),
                                    'Rate': this.priceToPrecision(symbol, price),
                                    'Amount': this.amountToPrecision(symbol, amount)
                                };
                                _context9.next = 10;
                                return this.privatePostSubmitTrade(this.extend(request, params));

                            case 10:
                                response = _context9.sent;

                                if (response) {
                                    _context9.next = 13;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' createOrder returned unknown error: ' + this.json(response));

                            case 13:
                                id = undefined;
                                filled = 0.0;

                                if ('Data' in response) {
                                    if ('OrderId' in response['Data']) {
                                        if (response['Data']['OrderId']) {
                                            id = response['Data']['OrderId'].toString();
                                        }
                                    }
                                    if ('FilledOrders' in response['Data']) {
                                        filledOrders = response['Data']['FilledOrders'];
                                        filledOrdersLength = filledOrders.length;

                                        if (filledOrdersLength) {
                                            filled = undefined;
                                        }
                                    }
                                }
                                timestamp = this.milliseconds();
                                order = {
                                    'id': id,
                                    'timestamp': timestamp,
                                    'datetime': this.iso8601(timestamp),
                                    'status': 'open',
                                    'symbol': symbol,
                                    'type': type,
                                    'side': side,
                                    'price': price,
                                    'cost': price * amount,
                                    'amount': amount,
                                    'remaining': amount,
                                    'filled': filled,
                                    'fee': undefined
                                    // 'trades': this.parseTrades (order['trades'], market),
                                };

                                if (id) this.orders[id] = order;
                                return _context9.abrupt('return', this.extend({ 'info': response }, order));

                            case 20:
                            case 'end':
                                return _context9.stop();
                        }
                    }
                }, _callee9, this);
            }));

            function createOrder(_x21, _x22, _x23, _x24) {
                return _ref9.apply(this, arguments);
            }

            return createOrder;
        }()
    }, {
        key: 'cancelOrder',
        value: function () {
            var _ref10 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10(id) {
                var symbol = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
                var response, message;
                return _regenerator2.default.wrap(function _callee10$(_context10) {
                    while (1) {
                        switch (_context10.prev = _context10.next) {
                            case 0:
                                _context10.next = 2;
                                return this.loadMarkets();

                            case 2:
                                response = undefined;
                                _context10.prev = 3;
                                _context10.next = 6;
                                return this.privatePostCancelTrade(this.extend({
                                    'Type': 'Trade',
                                    'OrderId': id
                                }, params));

                            case 6:
                                response = _context10.sent;

                                if (id in this.orders) this.orders[id]['status'] = 'canceled';
                                _context10.next = 18;
                                break;

                            case 10:
                                _context10.prev = 10;
                                _context10.t0 = _context10['catch'](3);

                                if (!this.last_json_response) {
                                    _context10.next = 17;
                                    break;
                                }

                                message = this.safeString(this.last_json_response, 'Error');

                                if (!message) {
                                    _context10.next = 17;
                                    break;
                                }

                                if (!(message.indexOf('does not exist') >= 0)) {
                                    _context10.next = 17;
                                    break;
                                }

                                throw new OrderNotFound(this.id + ' cancelOrder() error: ' + this.last_http_response);

                            case 17:
                                throw _context10.t0;

                            case 18:
                                return _context10.abrupt('return', response);

                            case 19:
                            case 'end':
                                return _context10.stop();
                        }
                    }
                }, _callee10, this, [[3, 10]]);
            }));

            function cancelOrder(_x27) {
                return _ref10.apply(this, arguments);
            }

            return cancelOrder;
        }()
    }, {
        key: 'parseOrder',
        value: function parseOrder(order) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var symbol = undefined;
            if (market) {
                symbol = market['symbol'];
            } else if ('Market' in order) {
                var id = order['Market'];
                if (id in this.markets_by_id) {
                    market = this.markets_by_id[id];
                    symbol = market['symbol'];
                }
            }
            var timestamp = this.parse8601(order['TimeStamp']);
            var amount = this.safeFloat(order, 'Amount');
            var remaining = this.safeFloat(order, 'Remaining');
            var filled = amount - remaining;
            return {
                'id': order['OrderId'].toString(),
                'info': this.omit(order, 'status'),
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'status': order['status'],
                'symbol': symbol,
                'type': 'limit',
                'side': order['Type'].toLowerCase(),
                'price': this.safeFloat(order, 'Rate'),
                'cost': this.safeFloat(order, 'Total'),
                'amount': amount,
                'filled': filled,
                'remaining': remaining,
                'fee': undefined
                // 'trades': this.parseTrades (order['trades'], market),
            };
        }
    }, {
        key: 'fetchOrders',
        value: function () {
            var _ref11 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee11() {
                var symbol = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

                var market, response, orders, i, openOrders, j, openOrdersIndexedById, cachedOrderIds, result, k, id, _order, order;

                return _regenerator2.default.wrap(function _callee11$(_context11) {
                    while (1) {
                        switch (_context11.prev = _context11.next) {
                            case 0:
                                if (symbol) {
                                    _context11.next = 2;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' fetchOrders requires a symbol param');

                            case 2:
                                _context11.next = 4;
                                return this.loadMarkets();

                            case 4:
                                market = this.market(symbol);
                                _context11.next = 7;
                                return this.privatePostGetOpenOrders({
                                    // 'Market': market['id'],
                                    'TradePairId': market['id'] // Cryptopia identifier (not required if 'Market' supplied)
                                    // 'Count': 100, // default = 100
                                }, params);

                            case 7:
                                response = _context11.sent;
                                orders = [];

                                for (i = 0; i < response['Data'].length; i++) {
                                    orders.push(this.extend(response['Data'][i], { 'status': 'open' }));
                                }
                                openOrders = this.parseOrders(orders, market);

                                for (j = 0; j < openOrders.length; j++) {
                                    this.orders[openOrders[j]['id']] = openOrders[j];
                                }
                                openOrdersIndexedById = this.indexBy(openOrders, 'id');
                                cachedOrderIds = (0, _keys2.default)(this.orders);
                                result = [];

                                for (k = 0; k < cachedOrderIds.length; k++) {
                                    id = cachedOrderIds[k];

                                    if (id in openOrdersIndexedById) {
                                        this.orders[id] = this.extend(this.orders[id], openOrdersIndexedById[id]);
                                    } else {
                                        _order = this.orders[id];

                                        if (_order['status'] == 'open') {
                                            this.orders[id] = this.extend(_order, {
                                                'status': 'closed',
                                                'cost': _order['amount'] * _order['price'],
                                                'filled': _order['amount'],
                                                'remaining': 0.0
                                            });
                                        }
                                    }
                                    order = this.orders[id];

                                    if (order['symbol'] == symbol) result.push(order);
                                }
                                return _context11.abrupt('return', this.filterBySinceLimit(result, since, limit));

                            case 17:
                            case 'end':
                                return _context11.stop();
                        }
                    }
                }, _callee11, this);
            }));

            function fetchOrders() {
                return _ref11.apply(this, arguments);
            }

            return fetchOrders;
        }()
    }, {
        key: 'fetchOrder',
        value: function () {
            var _ref12 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee12(id) {
                var symbol = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
                var orders, i;
                return _regenerator2.default.wrap(function _callee12$(_context12) {
                    while (1) {
                        switch (_context12.prev = _context12.next) {
                            case 0:
                                id = id.toString();
                                _context12.next = 3;
                                return this.fetchOrders(symbol, params);

                            case 3:
                                orders = _context12.sent;
                                i = 0;

                            case 5:
                                if (!(i < orders.length)) {
                                    _context12.next = 11;
                                    break;
                                }

                                if (!(orders[i]['id'] == id)) {
                                    _context12.next = 8;
                                    break;
                                }

                                return _context12.abrupt('return', orders[i]);

                            case 8:
                                i++;
                                _context12.next = 5;
                                break;

                            case 11:
                                throw new OrderNotCached(this.id + ' order ' + id + ' not found in cached .orders, fetchOrder requires .orders (de)serialization implemented for this method to work properly');

                            case 12:
                            case 'end':
                                return _context12.stop();
                        }
                    }
                }, _callee12, this);
            }));

            function fetchOrder(_x35) {
                return _ref12.apply(this, arguments);
            }

            return fetchOrder;
        }()
    }, {
        key: 'fetchOpenOrders',
        value: function () {
            var _ref13 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee13() {
                var symbol = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var orders, result, i;
                return _regenerator2.default.wrap(function _callee13$(_context13) {
                    while (1) {
                        switch (_context13.prev = _context13.next) {
                            case 0:
                                _context13.next = 2;
                                return this.fetchOrders(symbol, params);

                            case 2:
                                orders = _context13.sent;
                                result = [];

                                for (i = 0; i < orders.length; i++) {
                                    if (orders[i]['status'] == 'open') result.push(orders[i]);
                                }
                                return _context13.abrupt('return', result);

                            case 6:
                            case 'end':
                                return _context13.stop();
                        }
                    }
                }, _callee13, this);
            }));

            function fetchOpenOrders() {
                return _ref13.apply(this, arguments);
            }

            return fetchOpenOrders;
        }()
    }, {
        key: 'fetchClosedOrders',
        value: function () {
            var _ref14 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee14() {
                var symbol = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var orders, result, i;
                return _regenerator2.default.wrap(function _callee14$(_context14) {
                    while (1) {
                        switch (_context14.prev = _context14.next) {
                            case 0:
                                _context14.next = 2;
                                return this.fetchOrders(symbol, params);

                            case 2:
                                orders = _context14.sent;
                                result = [];

                                for (i = 0; i < orders.length; i++) {
                                    if (orders[i]['status'] == 'closed') result.push(orders[i]);
                                }
                                return _context14.abrupt('return', result);

                            case 6:
                            case 'end':
                                return _context14.stop();
                        }
                    }
                }, _callee14, this);
            }));

            function fetchClosedOrders() {
                return _ref14.apply(this, arguments);
            }

            return fetchClosedOrders;
        }()
    }, {
        key: 'fetchDepositAddress',
        value: function () {
            var _ref15 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee15(currency) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var currencyId, response, address;
                return _regenerator2.default.wrap(function _callee15$(_context15) {
                    while (1) {
                        switch (_context15.prev = _context15.next) {
                            case 0:
                                currencyId = this.currencyId(currency);
                                _context15.next = 3;
                                return this.privatePostGetDepositAddress(this.extend({
                                    'Currency': currencyId
                                }, params));

                            case 3:
                                response = _context15.sent;
                                address = this.safeString(response['Data'], 'BaseAddress');

                                if (!address) address = this.safeString(response['Data'], 'Address');
                                return _context15.abrupt('return', {
                                    'currency': currency,
                                    'address': address,
                                    'status': 'ok',
                                    'info': response
                                });

                            case 7:
                            case 'end':
                                return _context15.stop();
                        }
                    }
                }, _callee15, this);
            }));

            function fetchDepositAddress(_x45) {
                return _ref15.apply(this, arguments);
            }

            return fetchDepositAddress;
        }()
    }, {
        key: 'withdraw',
        value: function () {
            var _ref16 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee16(currency, amount, address) {
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var currencyId, response;
                return _regenerator2.default.wrap(function _callee16$(_context16) {
                    while (1) {
                        switch (_context16.prev = _context16.next) {
                            case 0:
                                currencyId = this.currencyId(currency);
                                _context16.next = 3;
                                return this.privatePostSubmitWithdraw(this.extend({
                                    'Currency': currencyId,
                                    'Amount': amount,
                                    'Address': address // Address must exist in you AddressBook in security settings
                                }, params));

                            case 3:
                                response = _context16.sent;
                                return _context16.abrupt('return', {
                                    'info': response,
                                    'id': response['Data']
                                });

                            case 5:
                            case 'end':
                                return _context16.stop();
                        }
                    }
                }, _callee16, this);
            }));

            function withdraw(_x47, _x48, _x49) {
                return _ref16.apply(this, arguments);
            }

            return withdraw;
        }()
    }, {
        key: 'sign',
        value: function sign(path) {
            var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var url = this.urls['api'] + '/' + this.implodeParams(path, params);
            var query = this.omit(params, this.extractParams(path));
            if (api == 'public') {
                if ((0, _keys2.default)(query).length) url += '?' + this.urlencode(query);
            } else {
                this.checkRequiredCredentials();
                var nonce = this.nonce().toString();
                body = this.json(query);
                var hash = this.hash(this.encode(body), 'md5', 'base64');
                var secret = this.base64ToBinary(this.secret);
                var uri = this.encodeURIComponent(url);
                var lowercase = uri.toLowerCase();
                var payload = this.apiKey + method + lowercase + nonce + this.binaryToString(hash);
                var signature = this.hmac(this.encode(payload), secret, 'sha256', 'base64');
                var auth = 'amx ' + this.apiKey + ':' + this.binaryToString(signature) + ':' + nonce;
                headers = {
                    'Content-Type': 'application/json',
                    'Authorization': auth
                };
            }
            return { 'url': url, 'method': method, 'body': body, 'headers': headers };
        }
    }, {
        key: 'request',
        value: function () {
            var _ref17 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee17(path) {
                var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
                var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;
                var response;
                return _regenerator2.default.wrap(function _callee17$(_context17) {
                    while (1) {
                        switch (_context17.prev = _context17.next) {
                            case 0:
                                _context17.next = 2;
                                return this.fetch2(path, api, method, params, headers, body);

                            case 2:
                                response = _context17.sent;

                                if (!response) {
                                    _context17.next = 12;
                                    break;
                                }

                                if (!('Success' in response)) {
                                    _context17.next = 12;
                                    break;
                                }

                                if (!response['Success']) {
                                    _context17.next = 9;
                                    break;
                                }

                                return _context17.abrupt('return', response);

                            case 9:
                                if (!('Error' in response)) {
                                    _context17.next = 12;
                                    break;
                                }

                                if (!(response['Error'] == 'Insufficient Funds.')) {
                                    _context17.next = 12;
                                    break;
                                }

                                throw new InsufficientFunds(this.id + ' ' + this.json(response));

                            case 12:
                                throw new ExchangeError(this.id + ' ' + this.json(response));

                            case 13:
                            case 'end':
                                return _context17.stop();
                        }
                    }
                }, _callee17, this);
            }));

            function request(_x60) {
                return _ref17.apply(this, arguments);
            }

            return request;
        }()
    }]);
    return cryptopia;
}(Exchange);