"use strict";

//  ---------------------------------------------------------------------------

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Exchange = require('./base/Exchange');

var _require = require('./base/errors'),
    NotSupported = _require.NotSupported;

//  ---------------------------------------------------------------------------

module.exports = function (_Exchange) {
    _inherits(bitlish, _Exchange);

    function bitlish() {
        _classCallCheck(this, bitlish);

        return _possibleConstructorReturn(this, (bitlish.__proto__ || Object.getPrototypeOf(bitlish)).apply(this, arguments));
    }

    _createClass(bitlish, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend(_get(bitlish.prototype.__proto__ || Object.getPrototypeOf(bitlish.prototype), 'describe', this).call(this), {
                'id': 'bitlish',
                'name': 'Bitlish',
                'countries': ['GB', 'EU', 'RU'],
                'rateLimit': 1500,
                'version': 'v1',
                'hasCORS': false,
                'hasFetchTickers': true,
                'hasFetchOHLCV': true,
                'hasWithdraw': true,
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/27766275-dcfc6c30-5ed3-11e7-839d-00a846385d0b.jpg',
                    'api': 'https://bitlish.com/api',
                    'www': 'https://bitlish.com',
                    'doc': 'https://bitlish.com/api'
                },
                'requiredCredentials': {
                    'apiKey': true,
                    'secret': false
                },
                'fees': {
                    'trading': {
                        'tierBased': false,
                        'percentage': true,
                        'taker': 0.3 / 100, // anonymous 0.3%, verified 0.2%
                        'maker': 0
                    },
                    'funding': {
                        'tierBased': false,
                        'percentage': false,
                        'withdraw': {
                            'BTC': 0.001,
                            'LTC': 0.001,
                            'DOGE': 0.001,
                            'ETH': 0.001,
                            'XMR': 0,
                            'ZEC': 0.001,
                            'DASH': 0.0001,
                            'EUR': 50
                        },
                        'deposit': {
                            'BTC': 0,
                            'LTC': 0,
                            'DOGE': 0,
                            'ETH': 0,
                            'XMR': 0,
                            'ZEC': 0,
                            'DASH': 0,
                            'EUR': 0
                        }
                    }
                },
                'api': {
                    'public': {
                        'get': ['instruments', 'ohlcv', 'pairs', 'tickers', 'trades_depth', 'trades_history'],
                        'post': ['instruments', 'ohlcv', 'pairs', 'tickers', 'trades_depth', 'trades_history']
                    },
                    'private': {
                        'post': ['accounts_operations', 'balance', 'cancel_trade', 'cancel_trades_by_ids', 'cancel_all_trades', 'create_bcode', 'create_template_wallet', 'create_trade', 'deposit', 'list_accounts_operations_from_ts', 'list_active_trades', 'list_bcodes', 'list_my_matches_from_ts', 'list_my_trades', 'list_my_trads_from_ts', 'list_payment_methods', 'list_payments', 'redeem_code', 'resign', 'signin', 'signout', 'trade_details', 'trade_options', 'withdraw', 'withdraw_by_id']
                    }
                }
            });
        }
    }, {
        key: 'commonCurrencyCode',
        value: function commonCurrencyCode(currency) {
            if (!this.substituteCommonCurrencyCodes) return currency;
            if (currency == 'XBT') return 'BTC';
            if (currency == 'BCC') return 'BCH';
            if (currency == 'DRK') return 'DASH';
            if (currency == 'DSH') currency = 'DASH';
            if (currency == 'XDG') currency = 'DOGE';
            return currency;
        }
    }, {
        key: 'fetchMarkets',
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                var markets, result, keys, p, market, id, symbol, _symbol$split, _symbol$split2, base, quote;

                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.publicGetPairs();

                            case 2:
                                markets = _context.sent;
                                result = [];
                                keys = Object.keys(markets);

                                for (p = 0; p < keys.length; p++) {
                                    market = markets[keys[p]];
                                    id = market['id'];
                                    symbol = market['name'];
                                    _symbol$split = symbol.split('/'), _symbol$split2 = _slicedToArray(_symbol$split, 2), base = _symbol$split2[0], quote = _symbol$split2[1];

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
        key: 'parseTicker',
        value: function parseTicker(ticker, market) {
            var timestamp = this.milliseconds();
            var symbol = undefined;
            if (market) symbol = market['symbol'];
            return {
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'symbol': symbol,
                'high': this.safeFloat(ticker, 'max'),
                'low': this.safeFloat(ticker, 'min'),
                'bid': undefined,
                'ask': undefined,
                'vwap': undefined,
                'open': undefined,
                'close': undefined,
                'first': this.safeFloat(ticker, 'first'),
                'last': this.safeFloat(ticker, 'last'),
                'change': undefined,
                'percentage': this.safeFloat(ticker, 'prc'),
                'average': undefined,
                'baseVolume': this.safeFloat(ticker, 'sum'),
                'quoteVolume': undefined,
                'info': ticker
            };
        }
    }, {
        key: 'fetchTickers',
        value: function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
                var symbols = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var tickers, ids, result, i, id, market, symbol, ticker;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context2.next = 4;
                                return this.publicGetTickers(params);

                            case 4:
                                tickers = _context2.sent;
                                ids = Object.keys(tickers);
                                result = {};

                                for (i = 0; i < ids.length; i++) {
                                    id = ids[i];
                                    market = this.markets_by_id[id];
                                    symbol = market['symbol'];
                                    ticker = tickers[id];

                                    result[symbol] = this.parseTicker(ticker, market);
                                }
                                return _context2.abrupt('return', result);

                            case 9:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function fetchTickers() {
                return _ref2.apply(this, arguments);
            }

            return fetchTickers;
        }()
    }, {
        key: 'fetchTicker',
        value: function () {
            var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var market, tickers, ticker;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                _context3.next = 5;
                                return this.publicGetTickers(params);

                            case 5:
                                tickers = _context3.sent;
                                ticker = tickers[market['id']];
                                return _context3.abrupt('return', this.parseTicker(ticker, market));

                            case 8:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function fetchTicker(_x4) {
                return _ref3.apply(this, arguments);
            }

            return fetchTicker;
        }()
    }, {
        key: 'fetchOHLCV',
        value: function () {
            var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(symbol) {
                var timeframe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '1m';
                var since = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var limit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
                var params = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
                var now, start, interval;
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                return this.loadMarkets();

                            case 2:
                                // let market = this.market (symbol);
                                now = this.seconds();
                                start = now - 86400 * 30; // last 30 days

                                interval = [start.toString(), undefined];
                                _context4.next = 7;
                                return this.publicPostOhlcv(this.extend({
                                    'time_range': interval
                                }, params));

                            case 7:
                                return _context4.abrupt('return', _context4.sent);

                            case 8:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function fetchOHLCV(_x9) {
                return _ref4.apply(this, arguments);
            }

            return fetchOHLCV;
        }()
    }, {
        key: 'fetchOrderBook',
        value: function () {
            var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var orderbook, timestamp, last;
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context5.next = 4;
                                return this.publicGetTradesDepth(this.extend({
                                    'pair_id': this.marketId(symbol)
                                }, params));

                            case 4:
                                orderbook = _context5.sent;
                                timestamp = undefined;
                                last = this.safeInteger(orderbook, 'last');

                                if (last) timestamp = parseInt(last / 1000);
                                return _context5.abrupt('return', this.parseOrderBook(orderbook, timestamp, 'bid', 'ask', 'price', 'volume'));

                            case 9:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function fetchOrderBook(_x11) {
                return _ref5.apply(this, arguments);
            }

            return fetchOrderBook;
        }()
    }, {
        key: 'parseTrade',
        value: function parseTrade(trade) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var side = trade['dir'] == 'bid' ? 'buy' : 'sell';
            var symbol = undefined;
            if (market) symbol = market['symbol'];
            var timestamp = parseInt(trade['created'] / 1000);
            return {
                'id': undefined,
                'info': trade,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'symbol': symbol,
                'order': undefined,
                'type': undefined,
                'side': side,
                'price': trade['price'],
                'amount': trade['amount']
            };
        }
    }, {
        key: 'fetchTrades',
        value: function () {
            var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(symbol) {
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var market, response;
                return regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                _context6.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                _context6.next = 5;
                                return this.publicGetTradesHistory(this.extend({
                                    'pair_id': market['id']
                                }, params));

                            case 5:
                                response = _context6.sent;
                                return _context6.abrupt('return', this.parseTrades(response['list'], market, since, limit));

                            case 7:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function fetchTrades(_x16) {
                return _ref6.apply(this, arguments);
            }

            return fetchTrades;
        }()
    }, {
        key: 'fetchBalance',
        value: function () {
            var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
                var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                var response, result, currencies, balance, c, currency, account, i, _currency, _account;

                return regeneratorRuntime.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                _context7.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context7.next = 4;
                                return this.privatePostBalance();

                            case 4:
                                response = _context7.sent;
                                result = { 'info': response };
                                currencies = Object.keys(response);
                                balance = {};

                                for (c = 0; c < currencies.length; c++) {
                                    currency = currencies[c];
                                    account = response[currency];

                                    currency = currency.toUpperCase();
                                    // issue #4 bitlish names Dash as DSH, instead of DASH
                                    if (currency == 'DSH') currency = 'DASH';
                                    if (currency == 'XDG') currency = 'DOGE';
                                    balance[currency] = account;
                                }
                                currencies = Object.keys(this.currencies);
                                for (i = 0; i < currencies.length; i++) {
                                    _currency = currencies[i];
                                    _account = this.account();

                                    if (_currency in balance) {
                                        _account['free'] = parseFloat(balance[_currency]['funds']);
                                        _account['used'] = parseFloat(balance[_currency]['holded']);
                                        _account['total'] = this.sum(_account['free'], _account['used']);
                                    }
                                    result[_currency] = _account;
                                }
                                return _context7.abrupt('return', this.parseBalance(result));

                            case 12:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function fetchBalance() {
                return _ref7.apply(this, arguments);
            }

            return fetchBalance;
        }()
    }, {
        key: 'signIn',
        value: function signIn() {
            return this.privatePostSignin({
                'login': this.login,
                'passwd': this.password
            });
        }
    }, {
        key: 'createOrder',
        value: function () {
            var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(symbol, type, side, amount) {
                var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
                var order, result;
                return regeneratorRuntime.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                _context8.next = 2;
                                return this.loadMarkets();

                            case 2:
                                order = {
                                    'pair_id': this.marketId(symbol),
                                    'dir': side == 'buy' ? 'bid' : 'ask',
                                    'amount': amount
                                };

                                if (type == 'limit') order['price'] = price;
                                _context8.next = 6;
                                return this.privatePostCreateTrade(this.extend(order, params));

                            case 6:
                                result = _context8.sent;
                                return _context8.abrupt('return', {
                                    'info': result,
                                    'id': result['id']
                                });

                            case 8:
                            case 'end':
                                return _context8.stop();
                        }
                    }
                }, _callee8, this);
            }));

            function createOrder(_x20, _x21, _x22, _x23) {
                return _ref8.apply(this, arguments);
            }

            return createOrder;
        }()
    }, {
        key: 'cancelOrder',
        value: function () {
            var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(id) {
                var symbol = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
                return regeneratorRuntime.wrap(function _callee9$(_context9) {
                    while (1) {
                        switch (_context9.prev = _context9.next) {
                            case 0:
                                _context9.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context9.next = 4;
                                return this.privatePostCancelTrade({ 'id': id });

                            case 4:
                                return _context9.abrupt('return', _context9.sent);

                            case 5:
                            case 'end':
                                return _context9.stop();
                        }
                    }
                }, _callee9, this);
            }));

            function cancelOrder(_x26) {
                return _ref9.apply(this, arguments);
            }

            return cancelOrder;
        }()
    }, {
        key: 'withdraw',
        value: function () {
            var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(currency, amount, address) {
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var response;
                return regeneratorRuntime.wrap(function _callee10$(_context10) {
                    while (1) {
                        switch (_context10.prev = _context10.next) {
                            case 0:
                                _context10.next = 2;
                                return this.loadMarkets();

                            case 2:
                                if (!(currency != 'BTC')) {
                                    _context10.next = 4;
                                    break;
                                }

                                throw new NotSupported(this.id + ' currently supports BTC withdrawals only, until they document other currencies...');

                            case 4:
                                _context10.next = 6;
                                return this.privatePostWithdraw(this.extend({
                                    'currency': currency.toLowerCase(),
                                    'amount': parseFloat(amount),
                                    'account': address,
                                    'payment_method': 'bitcoin' // they did not document other types...
                                }, params));

                            case 6:
                                response = _context10.sent;
                                return _context10.abrupt('return', {
                                    'info': response,
                                    'id': response['message_id']
                                });

                            case 8:
                            case 'end':
                                return _context10.stop();
                        }
                    }
                }, _callee10, this);
            }));

            function withdraw(_x28, _x29, _x30) {
                return _ref10.apply(this, arguments);
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

            var url = this.urls['api'] + '/' + this.version + '/' + path;
            if (api == 'public') {
                if (method == 'GET') {
                    if (Object.keys(params).length) url += '?' + this.urlencode(params);
                } else {
                    body = this.json(params);
                    headers = { 'Content-Type': 'application/json' };
                }
            } else {
                this.checkRequiredCredentials();
                body = this.json(this.extend({ 'token': this.apiKey }, params));
                headers = { 'Content-Type': 'application/json' };
            }
            return { 'url': url, 'method': method, 'body': body, 'headers': headers };
        }
    }]);

    return bitlish;
}(Exchange);